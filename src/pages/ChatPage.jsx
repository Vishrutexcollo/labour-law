import React, { useState, useRef, useEffect } from 'react';
import { Send, User, ChevronRight, Gavel, RefreshCw, Loader2, AlertTriangle, MessageSquare } from 'lucide-react';
import LegalReport from '../components/LegalReport';

const ChatPage = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId, setSessionId] = useState('');
    const [selectedMode, setSelectedMode] = useState('chat'); // Default mode
    const messagesEndRef = useRef(null);

    // Initialize or retrieve Session ID
    useEffect(() => {
        let sid = sessionStorage.getItem('labour_law_session');
        if (!sid) {
            sid = crypto.randomUUID();
            sessionStorage.setItem('labour_law_session', sid);
        }
        setSessionId(sid);
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const handleNewChat = () => {
        const newSid = crypto.randomUUID();
        sessionStorage.setItem('labour_law_session', newSid);
        setSessionId(newSid);
        setMessages([]);
        setInput('');
        setSelectedMode('chat');
    };

    // Recursive function to strip away all layers (arrays, stringified JSON, "final"/"output" keys)
    const deepUnwrap = (val) => {
        let current = val;
        if (Array.isArray(current) && current.length > 0) return deepUnwrap(current[0]);
        if (typeof current === 'string' && (current.trim().startsWith('{') || current.trim().startsWith('['))) {
            try { return deepUnwrap(JSON.parse(current)); } catch (e) { return current; }
        }
        if (current && typeof current === 'object') {
            if (current.final !== undefined) return deepUnwrap(current.final);
            if (current.output !== undefined) return deepUnwrap(current.output);
        }
        return current;
    };

    const processQuery = async (queryText) => {
        if (!queryText.trim() || isLoading) return;

        const currentMode = selectedMode;
        const userMsg = { id: Date.now(), role: 'user', text: queryText };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: queryText,
                    sessionId: sessionId,
                    mode: currentMode
                })
            });

            if (!response.ok) throw new Error('Failed to fetch from expert');

            let data = await response.json();
            const finalContent = deepUnwrap(data);

            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                role: 'assistant',
                content: finalContent,
                viewMode: currentMode,
                originalQuery: queryText,
                hasReportData: currentMode === 'report' // Set flag on creation
            }]);
        } catch (error) {
            console.error('Error:', error);
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                role: 'assistant',
                isError: true,
                text: "I apologize, but I encountered an error connecting to the legal database. Please try again later."
            }]);

        } finally {
            setIsLoading(false);
        }
    };

    const handleSend = (e) => {
        e.preventDefault();
        processQuery(input);
    };

    const toggleViewMode = async (messageId, mode) => {
        const msg = messages.find(m => m.id === messageId);
        if (!msg) return;

        // If switching to report but we don't have the data yet, RE-FETCH from n8n
        if (mode === 'report' && !msg.hasReportData) {
            // Set upgrading state for UI feedback
            setMessages(prev => prev.map(m => m.id === messageId ? { ...m, isUpgrading: true, viewMode: mode } : m));

            try {
                const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;
                const response = await fetch(webhookUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        query: msg.originalQuery,
                        sessionId: sessionId,
                        mode: 'report'
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    const finalContent = deepUnwrap(data);
                    setMessages(prev => prev.map(m => m.id === messageId ? {
                        ...m,
                        content: finalContent,
                        isUpgrading: false,
                        hasReportData: true // Mark as fetched permanently
                    } : m));
                    return;
                }
            } catch (e) {
                console.error("Failed to upgrade message to report:", e);
            }
            setMessages(prev => prev.map(m => m.id === messageId ? { ...m, isUpgrading: false } : m));
        } else {
            // If we have the data or are switching to chat, just toggle viewMode locally
            setMessages(prev => prev.map(m => m.id === messageId ? { ...m, viewMode: mode } : m));
        }
    };

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#fff' }}>
            {/* Scrollable Chat Area */}
            <div style={{ flex: 1, overflowY: 'auto', paddingTop: '80px', paddingBottom: '140px' }}>
                <div className="container">
                    {/* Floating New Chat Button at top of content if messages exist */}
                    {messages.length > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                            <button
                                onClick={handleNewChat}
                                style={{
                                    background: '#f8fafc', border: '1px solid var(--border-color)',
                                    padding: '8px 16px', borderRadius: '8px', cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem',
                                    color: 'var(--text-secondary)', transition: 'all 0.2s'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                            >
                                <RefreshCw size={14} /> Start New Conversation
                            </button>
                        </div>
                    )}

                    {messages.length === 0 && (
                        <div style={{ textAlign: 'center', marginTop: '60px', color: 'var(--text-muted)' }} className="fade-in">
                            <Gavel size={64} color="var(--accent-primary)" style={{ marginBottom: '24px', opacity: 0.15 }} />
                            <h2 style={{ fontSize: '1.8rem', color: 'var(--text-primary)', marginBottom: '12px' }}>How can I help you today?</h2>
                            <p style={{ maxWidth: '400px', margin: '0 auto 40px', lineHeight: 1.6 }}>
                                Ask about Industrial Disputes, Minimum Wages, or any Indian Labour Law query.
                            </p>

                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(2, 1fr)',
                                gap: '16px',
                                maxWidth: '800px',
                                margin: '0 auto'
                            }}>
                                {[
                                    "What is the severance pay calculation under the ID Act?",
                                    "Explain illegal strike with reference to judgments.",
                                    "Can an employer deduct salary for damage to property?",
                                    "How has the judiciary interpreted the triple test of industry?"
                                ].map((q, i) => (
                                    <button
                                        key={i}
                                        onClick={() => processQuery(q)}
                                        style={{
                                            padding: '24px',
                                            textAlign: 'left',
                                            backgroundColor: '#fff',
                                            border: '1px solid var(--border-color)',
                                            borderRadius: '16px',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            gap: '12px'
                                        }}
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-2px)';
                                            e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                                            e.currentTarget.style.borderColor = 'var(--accent-primary)';
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05)';
                                            e.currentTarget.style.borderColor = 'var(--border-color)';
                                        }}
                                    >
                                        <span style={{ fontSize: '1rem', color: 'var(--text-primary)', fontWeight: 500 }}>{q}</span>
                                        <ChevronRight size={18} color="var(--accent-primary)" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {messages.map((msg) => (
                        <div key={msg.id} style={{
                            marginBottom: '2.5rem',
                            display: 'flex',
                            flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                            gap: '16px',
                            alignItems: 'flex-start'
                        }} className="fade-in">

                            {/* Avatar */}
                            <div style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '8px',
                                backgroundColor: msg.role === 'user' ? '#f1f5f9' : 'var(--accent-primary)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                                boxShadow: msg.role === 'assistant' ? '0 4px 12px rgba(37, 99, 235, 0.2)' : 'none',
                                textAlign: 'center'
                            }}>
                                {msg.role === 'user' ? <User size={20} color="#64748b" /> : <Gavel size={20} color="white" />}
                            </div>

                            {/* Message Content */}
                            <div style={{
                                flex: 1,
                                maxWidth: '92%',
                                textAlign: msg.role === 'user' ? 'right' : 'left'
                            }}>
                                {msg.role === 'user' ? (
                                    <div style={{
                                        display: 'inline-block',
                                        backgroundColor: 'var(--accent-primary)',
                                        padding: '14px 20px',
                                        borderRadius: '20px 20px 0 20px',
                                        color: '#fff',
                                        fontWeight: 500,
                                        fontSize: '0.95rem',
                                        boxShadow: '0 4px 12px rgba(37, 99, 235, 0.15)'
                                    }}>
                                        {msg.text}
                                    </div>
                                ) : (
                                    <div style={{ paddingTop: '6px' }}>
                                        {msg.isError ? (
                                            <div style={{ color: '#dc2626', fontSize: '0.95rem', backgroundColor: '#fef2f2', padding: '12px', borderRadius: '8px', border: '1px solid #fecaca' }}>
                                                {msg.text}
                                            </div>
                                        ) : (
                                            <div className="assistant-response-container" style={{ width: '100%', maxWidth: '900px' }}>
                                                {/* Mode Toggle Tabs - Now ALWAYS shown for every assistant message */}
                                                <div className="view-mode-tabs" style={{
                                                    display: 'inline-flex',
                                                    backgroundColor: '#f1f5f9',
                                                    padding: '4px',
                                                    borderRadius: '8px',
                                                    marginBottom: '12px',
                                                    border: '1px solid var(--border-color)'
                                                }}>
                                                    <button
                                                        onClick={() => toggleViewMode(msg.id, 'report')}
                                                        style={{
                                                            padding: '6px 16px',
                                                            borderRadius: '6px',
                                                            fontSize: '0.85rem',
                                                            fontWeight: 600,
                                                            cursor: 'pointer',
                                                            border: 'none',
                                                            backgroundColor: msg.viewMode === 'report' ? '#fff' : 'transparent',
                                                            color: msg.viewMode === 'report' ? 'var(--accent-primary)' : 'var(--text-muted)',
                                                            boxShadow: msg.viewMode === 'report' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                                                            transition: 'all 0.2s'
                                                        }}
                                                    >
                                                        Detailed Report
                                                    </button>
                                                    <button
                                                        onClick={() => toggleViewMode(msg.id, 'chat')}
                                                        style={{
                                                            padding: '6px 16px',
                                                            borderRadius: '6px',
                                                            fontSize: '0.85rem',
                                                            fontWeight: 600,
                                                            cursor: 'pointer',
                                                            border: 'none',
                                                            backgroundColor: msg.viewMode === 'chat' ? '#fff' : 'transparent',
                                                            color: msg.viewMode === 'chat' ? 'var(--accent-primary)' : 'var(--text-muted)',
                                                            boxShadow: msg.viewMode === 'chat' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                                                            transition: 'all 0.2s'
                                                        }}
                                                    >
                                                        Simple Chat
                                                    </button>
                                                </div>

                                                {/* Content Rendering based on preference and type */}
                                                {msg.isUpgrading ? (
                                                    <div style={{
                                                        padding: '40px 20px',
                                                        textAlign: 'center',
                                                        backgroundColor: '#f8fafc',
                                                        borderRadius: '16px',
                                                        border: '1px dashed var(--border-color)',
                                                        color: 'var(--accent-primary)',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'center',
                                                        gap: '12px'
                                                    }}>
                                                        <Loader2 size={32} className="animate-spin" />
                                                        <div style={{ fontWeight: 600 }}>Upgrading to Detailed Report...</div>
                                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Retrieving legal citations and precedents...</div>
                                                    </div>
                                                ) : msg.viewMode === 'report' ? (
                                                    // Detailed Report View
                                                    (typeof msg.content === 'object' && msg.content && (msg.content.answer || msg.content.key_points || msg.content.bare_act)) ? (
                                                        <LegalReport data={msg.content} />
                                                    ) : (
                                                        <div style={{
                                                            display: 'inline-block',
                                                            backgroundColor: '#f8fafc',
                                                            padding: '14px 20px',
                                                            borderRadius: '4px 20px 20px 20px',
                                                            color: 'var(--text-primary)',
                                                            fontSize: '1rem',
                                                            lineHeight: 1.6,
                                                            border: '1px solid var(--border-color)',
                                                            whiteSpace: 'pre-wrap'
                                                        }}>
                                                            {typeof msg.content === 'object' ? msg.content.answer : msg.content}
                                                        </div>
                                                    )
                                                ) : (
                                                    // Simple Chat View
                                                    <div style={{
                                                        display: (typeof msg.content === 'object' && msg.content && msg.content.type === 'abusive_or_harmful') ? 'flex' : 'inline-block',
                                                        backgroundColor: (typeof msg.content === 'object' && msg.content && msg.content.type === 'abusive_or_harmful') ? '#fef2f2' : '#f8fafc',
                                                        padding: '14px 20px',
                                                        borderRadius: '4px 20px 20px 20px',
                                                        color: (typeof msg.content === 'object' && msg.content && msg.content.type === 'abusive_or_harmful') ? '#991b1b' : 'var(--text-primary)',
                                                        fontSize: '1rem',
                                                        lineHeight: 1.6,
                                                        border: (typeof msg.content === 'object' && msg.content && msg.content.type === 'abusive_or_harmful') ? '1px solid #fecaca' : '1px solid var(--border-color)',
                                                        whiteSpace: 'pre-wrap',
                                                        alignItems: 'center',
                                                        gap: '12px'
                                                    }}>
                                                        {typeof msg.content === 'object' && msg.content && msg.content.type === 'abusive_or_harmful' && <AlertTriangle size={20} color="#dc2626" />}
                                                        <span>
                                                            {typeof msg.content === 'object' ? (msg.content.answer || (msg.content.type === 'abusive_or_harmful' ? "Safety limit reached." : "")) : msg.content}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '2.5rem' }}>
                            <div style={{
                                width: '36px', height: '36px', borderRadius: '8px',
                                backgroundColor: 'var(--accent-primary)', display: 'flex',
                                alignItems: 'center', justifyContent: 'center',
                                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)'
                            }}>
                                <Loader2 size={20} color="white" className="animate-spin" />
                            </div>
                            <div style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.95rem' }}>
                                Searching legal precedents...
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Bar */}
            <div style={{
                position: 'fixed', bottom: 0, left: 0, right: 0,
                padding: '20px 0 40px', background: 'linear-gradient(to top, #fff 70%, transparent)',
                zIndex: 5
            }}>
                <div className="container">
                    <form onSubmit={handleSend} style={{ position: 'relative' }}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about labour laws, acts, or specific cases..."
                            disabled={isLoading}
                            style={{
                                width: '100%',
                                padding: '18px 60px 18px 24px',
                                borderRadius: '16px',
                                border: '1px solid var(--border-color)',
                                backgroundColor: isLoading ? '#f8fafc' : '#fff',
                                fontSize: '1rem',
                                outline: 'none',
                                boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
                                transition: 'all 0.2s',
                                fontFamily: 'inherit'
                            }}
                            onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
                            onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                        />
                        <button type="submit" disabled={!input.trim() || isLoading} style={{
                            position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                            backgroundColor: (input.trim() && !isLoading) ? 'var(--accent-primary)' : '#e2e8f0',
                            border: 'none', borderRadius: '10px', width: '40px', height: '40px',
                            cursor: (input.trim() && !isLoading) ? 'pointer' : 'default',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'all 0.2s'
                        }}>
                            <Send size={20} color={(input.trim() && !isLoading) ? 'white' : '#94a3b8'} />
                        </button>
                    </form>
                    <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '16px' }}>
                        Session: {sessionId.split('-')[0]} • Professional Legal Intelligence
                    </p>
                </div>
            </div>

            <style>{`
                .animate-spin {
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default ChatPage;
