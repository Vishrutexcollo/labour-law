import React, { useState, useRef, useEffect } from 'react';
import { Send, User, ChevronRight, Gavel, RefreshCw, Loader2, AlertTriangle } from 'lucide-react';
import LegalReport from '../components/LegalReport';

const ChatPage = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId, setSessionId] = useState('');
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
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userQuery = input.trim();
        const userMsg = { id: Date.now(), role: 'user', text: userQuery };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: userQuery,
                    sessionId: sessionId
                })
            });

            if (!response.ok) throw new Error('Failed to fetch from expert');

            let data = await response.json();

            // Recursive function to strip away all layers (arrays, stringified JSON, "final"/"output" keys)
            const deepUnwrap = (val) => {
                let current = val;

                // 1. Handle Array
                if (Array.isArray(current) && current.length > 0) {
                    return deepUnwrap(current[0]);
                }

                // 2. Handle Stringified JSON
                if (typeof current === 'string' && (current.trim().startsWith('{') || current.trim().startsWith('['))) {
                    try {
                        const parsed = JSON.parse(current);
                        return deepUnwrap(parsed);
                    } catch (e) {
                        // If parsing fails, treat as normal string
                        return current;
                    }
                }

                // 3. Handle Object wrappers
                if (current && typeof current === 'object') {
                    if (current.final !== undefined) return deepUnwrap(current.final);
                    if (current.output !== undefined) return deepUnwrap(current.output);
                }

                return current;
            };

            const finalContent = deepUnwrap(data);

            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                role: 'assistant',
                content: finalContent
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
                        <div style={{ textAlign: 'center', marginTop: '100px', color: 'var(--text-muted)' }} className="fade-in">
                            <Gavel size={64} color="var(--accent-primary)" style={{ marginBottom: '24px', opacity: 0.15 }} />
                            <h2 style={{ fontSize: '1.8rem', color: 'var(--text-primary)', marginBottom: '12px' }}>How can I help you today?</h2>
                            <p style={{ maxWidth: '400px', margin: '0 auto', lineHeight: 1.6 }}>
                                Ask about Industrial Disputes, Minimum Wages, or any Indian Labour Law query.
                            </p>
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
                                            // FLEXIBLE RENDERING:
                                            // 1. If it's a greeting or general message, show a simple bubble
                                            // 2. If it's abusive or harmful, show a warning
                                            // 3. If it has structured legal keys, show the LegalReport
                                            // 4. Fallback to string/JSON rendering
                                            (typeof msg.content === 'object' && msg.content && msg.content.type === 'greeting_or_general') ? (
                                                <div style={{
                                                    display: 'inline-block',
                                                    backgroundColor: '#f8fafc',
                                                    padding: '14px 20px',
                                                    borderRadius: '4px 20px 20px 20px',
                                                    color: 'var(--text-primary)',
                                                    fontSize: '1rem',
                                                    lineHeight: 1.6,
                                                    border: '1px solid var(--border-color)'
                                                }}>
                                                    {msg.content.answer}
                                                </div>
                                            ) : (typeof msg.content === 'object' && msg.content && msg.content.type === 'abusive_or_harmful') ? (
                                                <div style={{
                                                    display: 'inline-block',
                                                    backgroundColor: '#fef2f2',
                                                    padding: '16px 20px',
                                                    borderRadius: '12px',
                                                    color: '#991b1b',
                                                    fontSize: '0.95rem',
                                                    lineHeight: 1.6,
                                                    border: '1px solid #fecaca',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '12px'
                                                }}>
                                                    <AlertTriangle size={20} color="#dc2626" />
                                                    <span>{msg.content.answer || "I cannot respond to this query as it violates our safety policies."}</span>
                                                </div>
                                            ) : (typeof msg.content === 'object' && msg.content && (msg.content.answer || msg.content.key_points || msg.content.bare_act)) ? (
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
                                                    {typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content)}
                                                </div>
                                            )
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
