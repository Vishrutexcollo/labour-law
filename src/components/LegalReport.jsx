import React from 'react';
import { Book, CheckCircle, ExternalLink, AlertTriangle, Scale, Info } from 'lucide-react';

const LegalReport = ({ data }) => {
    if (!data) return null;

    const {
        answer,
        applicability,
        key_points,
        checklist,
        bare_act,
        citations,
        confidence,
        assumptions
    } = data;

    // Helper to check if a value has actual displayable content
    const hasContent = (val) => {
        if (!val) return false;
        if (typeof val === 'string') return val.trim().length > 0;
        if (Array.isArray(val)) return val.length > 0;
        if (typeof val === 'object') return Object.values(val).some(v => hasContent(v));
        return true;
    };

    const hasBareAct = hasContent(bare_act);

    return (
        <div className="report-container fade-in">
            <div className="report-header">
                <div>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '4px' }}>Legal Analysis Report</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Structured guidance based on Indian Labour Law</p>
                </div>
                {hasContent(confidence) && (
                    <span className={`badge badge-${confidence.toLowerCase()}`}>
                        {confidence} Confidence
                    </span>
                )}
            </div>

            {hasContent(answer) && (
                <div className="report-section">
                    <h3><Scale size={20} color="var(--accent-primary)" /> Executive Summary</h3>
                    <div className="info-box">
                        {answer}
                    </div>
                </div>
            )}

            {hasBareAct && (
                <div className="report-section">
                    <h3><Book size={20} color="var(--accent-primary)" /> Bare Act Reference</h3>
                    <div style={{ padding: '16px', backgroundColor: '#f0f7ff', borderRadius: '8px', borderLeft: '4px solid #3b82f6' }}>
                        {hasContent(bare_act.act) && <p style={{ fontWeight: 600, fontSize: '1rem', color: '#1e40af' }}>{bare_act.act}</p>}
                        {hasContent(bare_act.section) && <p style={{ fontWeight: 500, color: '#1e3a8a', marginTop: '4px' }}>Section: {bare_act.section}</p>}
                        {hasContent(bare_act.summary) && <p style={{ marginTop: '8px', fontSize: '0.95rem', color: '#1e40af', lineHeight: 1.5 }}>{bare_act.summary}</p>}

                        {/* New Evidence Field */}
                        {hasContent(bare_act.evidence) && (
                            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(59, 130, 246, 0.2)' }}>
                                <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e40af', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.025em' }}>
                                    Supporting Evidence
                                </p>
                                {bare_act.evidence.map((item, idx) => (
                                    <div key={idx} style={{ marginBottom: idx === bare_act.evidence.length - 1 ? 0 : '12px' }}>
                                        <div style={{ display: 'flex', gap: '8px', fontSize: '0.8rem', color: '#3b82f6', marginBottom: '4px' }}>
                                            <span>Doc: {item.doc_id}</span>
                                            <span>•</span>
                                            <span>Section: {item.section}</span>
                                        </div>
                                        <p style={{ fontSize: '0.9rem', color: '#1e3a8a', fontStyle: 'italic', backgroundColor: 'rgba(255,255,255,0.5)', padding: '8px', borderRadius: '4px' }}>
                                            "{item.snippet}"
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {hasContent(applicability) && (
                <div className="report-section">
                    <h3><Info size={20} color="#22c55e" /> Applicability</h3>
                    <div className="applicability-box">
                        <p style={{ fontSize: '0.95rem', color: '#166534' }}>{applicability}</p>
                    </div>
                </div>
            )}

            {hasContent(key_points) && (
                <div className="report-section">
                    <h3><CheckCircle size={20} color="var(--accent-primary)" /> Key Findings</h3>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {key_points.map((point, i) => (
                            <li key={i} style={{ display: 'flex', gap: '10px', marginBottom: '12px', fontSize: '0.95rem' }}>
                                <div style={{ color: '#22c55e', marginTop: '2px' }}>✓</div>
                                <span>{point}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {hasContent(checklist) && (
                <div className="report-section">
                    <h3><CheckCircle size={20} color="var(--accent-primary)" /> Compliance Checklist</h3>
                    <div style={{ overflowX: 'auto' }}>
                        <table className="report-table">
                            <thead>
                                <tr>
                                    <th>Action Step</th>
                                    <th>Timeline</th>
                                    <th>Owner</th>
                                </tr>
                            </thead>
                            <tbody>
                                {checklist.map((item, i) => (
                                    <tr key={i}>
                                        <td>{item.step}</td>
                                        <td>{item.timeline}</td>
                                        <td>{item.owner}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {hasContent(citations) && (
                <div className="report-section">
                    <h3><ExternalLink size={20} color="var(--accent-primary)" /> Legal Citations</h3>
                    {citations.map((cite, i) => (
                        <div key={i} className="citation-card">
                            <h4 style={{ fontSize: '0.95rem', color: '#1e40af', marginBottom: '4px' }}>
                                {cite.title} {cite.year && `(${cite.year})`}
                            </h4>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                                {cite.court} • {cite.relevance}
                            </p>
                            {hasContent(cite.url) && (
                                <a href={cite.url} target="_blank" rel="noopener noreferrer"
                                    style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    View Document <ExternalLink size={12} />
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {hasContent(assumptions) && (
                <div className="report-section">
                    <h3><AlertTriangle size={20} color="#f59e0b" /> Assumptions Made</h3>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {assumptions.map((item, i) => (
                            <li key={i} style={{ display: 'flex', gap: '10px', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                <div style={{ color: '#f59e0b' }}>⚠</div>
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default LegalReport;
