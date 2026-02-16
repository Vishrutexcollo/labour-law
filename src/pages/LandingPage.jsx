import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, BookOpen, MessageSquare, ArrowRight, Gavel, CheckCircle2 } from 'lucide-react';

const LandingPage = () => {
    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#f9fafb',
            paddingTop: '80px',
            paddingBottom: '80px'
        }}>
            <div className="container" style={{ maxWidth: '1100px' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1.2fr 1fr',
                    gap: '60px',
                    alignItems: 'center'
                }}>

                    {/* Left Column: Guidelines */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
                            <Gavel size={36} color="var(--accent-primary)" />
                            <h1 style={{ fontSize: '2.2rem', fontWeight: 700, letterSpacing: '-0.5px' }}>LabourLawGPT</h1>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
                            <section>
                                <h2 style={{ fontSize: '1.25rem', marginBottom: '12px', color: 'var(--text-primary)', fontWeight: 600 }}>Purpose</h2>
                                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '1.05rem' }}>
                                    A professional tool designed to democratize legal information by providing accurate, and accessible guidance on Indian Labour Laws.
                                </p>
                            </section>

                            <section>
                                <h2 style={{ fontSize: '1.25rem', marginBottom: '12px', color: 'var(--text-primary)', fontWeight: 600 }}>Knowledge Base</h2>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', color: 'var(--text-secondary)' }}>
                                    {[
                                        "Industrial Disputes Act",
                                        "Minimum Wages Act",
                                        "New Labour Codes",
                                        "State Labor Laws"
                                    ].map((item, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem' }}>
                                            <CheckCircle2 size={16} color="var(--accent-primary)" /> {item}
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section>
                                <h2 style={{ fontSize: '1.25rem', marginBottom: '12px', color: 'var(--text-primary)', fontWeight: 600 }}>User Guidelines</h2>
                                <ul style={{ padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {[
                                        "State your queries clearly for better accuracy.",
                                        "Use follow-up questions to explore specific clauses.",
                                        "Specify the industry or state if relevant to your case."
                                    ].map((text, i) => (
                                        <li key={i} style={{ display: 'flex', gap: '12px', color: 'var(--text-secondary)', fontSize: '1rem' }}>
                                            <span style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>0{i + 1}</span>
                                            {text}
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        </div>
                    </div>

                    {/* Right Column: Overlapping Screenshots & Button */}
                    <div>
                        <div style={{
                            position: 'relative',
                            height: '420px',
                            marginBottom: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            {/* Primary Screenshot (Background) */}
                            <div style={{
                                position: 'absolute',
                                top: '0',
                                left: '20px',
                                width: '85%',
                                aspectRatio: '16/10',
                                backgroundColor: '#fff',
                                borderRadius: '16px',
                                border: '1px solid var(--border-color)',
                                boxShadow: '0 15px 40px rgba(0,0,0,0.08)',
                                overflow: 'hidden',
                                zIndex: 1
                            }}>
                                <img
                                    src="/screenshot1.png"
                                    alt="Chatbot Screenshot 1"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    onError={(e) => { e.target.src = 'https://placehold.co/600x400/fff/6b7280?text=Screenshot+1'; }}
                                />
                            </div>

                            {/* Secondary Screenshot (Overlapping) */}
                            <div style={{
                                position: 'absolute',
                                bottom: '20px',
                                right: '0',
                                width: '60%',
                                aspectRatio: '16/10',
                                backgroundColor: '#fff',
                                borderRadius: '16px',
                                border: '1px solid var(--border-color)',
                                boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
                                overflow: 'hidden',
                                zIndex: 2,
                                transform: 'rotate(2deg)'
                            }}>
                                <img
                                    src="/screenshot2.png"
                                    alt="Chatbot Screenshot 2"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    onError={(e) => { e.target.src = 'https://placehold.co/400x250/fff/6b7280?text=Screenshot+2'; }}
                                />
                            </div>
                        </div>

                        <div style={{ textAlign: 'center' }}>
                            <Link to="/chat" className="btn-primary" style={{
                                width: '100%',
                                padding: '18px',
                                fontSize: '1.2rem',
                                justifyContent: 'center',
                                borderRadius: '12px',
                                boxShadow: '0 12px 24px rgba(37, 99, 235, 0.3)'
                            }}>
                                Launch Assistant <ArrowRight size={22} />
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default LandingPage;
