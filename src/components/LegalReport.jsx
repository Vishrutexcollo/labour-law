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
        assumptions,
        disclaimer
    } = data;

    return (
        <div className="report-container fade-in">
            <div className="report-header">
                <div>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '4px' }}>Legal Analysis Report</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Structured guidance based on Indian Labour Law</p>
                </div>
                <span className={`badge badge-${confidence?.toLowerCase() || 'medium'}`}>
                    {confidence || 'Medium'} Confidence
                </span>
            </div>

            <div className="report-section">
                <h3><Scale size={20} color="var(--accent-primary)" /> Executive Summary</h3>
                <div className="info-box">
                    {answer}
                </div>
            </div>

            {bare_act && (
                <div className="report-section">
                    <h3><Book size={20} color="var(--accent-primary)" /> Bare Act Reference</h3>
                    <div style={{ padding: '16px', backgroundColor: '#f0f7ff', borderRadius: '8px', borderLeft: '4px solid #3b82f6' }}>
                        <p style={{ fontWeight: 600, fontSize: '1rem', color: '#1e40af' }}>{bare_act.act}</p>
                        <p style={{ fontWeight: 500, color: '#1e3a8a', marginTop: '4px' }}>Section: {bare_act.section}</p>
                        <p style={{ marginTop: '8px', fontSize: '0.95rem', color: '#1e40af', lineHeight: 1.5 }}>{bare_act.summary}</p>
                    </div>
                </div>
            )}

            {applicability && (
                <div className="report-section">
                    <h3><Info size={20} color="#22c55e" /> Applicability</h3>
                    <div className="applicability-box">
                        <p style={{ fontSize: '0.95rem', color: '#166534' }}>{applicability}</p>
                    </div>
                </div>
            )}

            {key_points && key_points.length > 0 && (
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

            {checklist && checklist.length > 0 && (
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

            {citations && citations.length > 0 && (
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
                            {cite.url && (
                                <a href={cite.url} target="_blank" rel="noopener noreferrer"
                                    style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    View Document <ExternalLink size={12} />
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {assumptions && assumptions.length > 0 && (
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

            <div className="disclaimer-box">
                <p style={{ display: 'flex', gap: '8px', fontWeight: 600, marginBottom: '4px' }}>
                    <AlertTriangle size={16} /> Legal Disclaimer
                </p>
                <p>{disclaimer || "This is informational guidance based on cited sources, not legal advice."}</p>
            </div>
        </div>
    );
};

export default LegalReport;
