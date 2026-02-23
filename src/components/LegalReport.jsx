import React from 'react';
import { ExternalLink, ShieldAlert } from 'lucide-react';
import ReferenceChips from './ReferenceChips';

const ReportSection = ({ id, title, children }) => (
    <div className="report-section">
        <h3>SECTION {id} — {title}</h3>
        <div className="report-section-content">
            {children}
        </div>
    </div>
);

const ReportTable = ({ headers, data, renderRow }) => (
    <div style={{ overflowX: 'auto' }}>
        <table className="report-table">
            <thead>
                <tr>
                    {headers.map((h, i) => <th key={i}>{h}</th>)}
                </tr>
            </thead>
            <tbody>
                {data.map((item, i) => (
                    <tr key={i}>
                        {renderRow(item, i)}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

const LegalReport = ({ data, originalQuery }) => {
    if (!data) return null;

    const {
        answer,
        at_a_glance,
        executive_summary,
        executive_summary_ref_ids,
        executive_summary_ref_urls,
        applicability_detail,
        checklist,
        risks,
        penalties,
        next_steps,
        bare_act,
        citations,
        disclaimer,
        references
    } = data;

    const hasContent = (val) => {
        if (!val) return false;
        if (typeof val === 'string') return val.trim().length > 0;
        if (Array.isArray(val)) return val.length > 0;
        if (typeof val === 'object') return Object.values(val).some(v => hasContent(v));
        return true;
    };

    return (
        <div className="report-container fade-in">
            {/* Header Banner */}
            <div className="report-banner">
                <h1>LABOUR LAW COMPLIANCE REPORT</h1>
                <p>Central Acts Only — Gold Standard Reference</p>
            </div>

            {/* Metadata Section */}
            <div className="report-metadata">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <span style={{ fontWeight: 700, minWidth: '100px' }}>Report ID:</span>
                        <span>LLW-RPT-{new Date().getTime().toString().slice(-8)}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <span style={{ fontWeight: 700, minWidth: '100px' }}>Acts in Scope:</span>
                        <span>Central Acts only</span>
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <span style={{ fontWeight: 700, minWidth: '100px' }}>Generated On:</span>
                        <span>{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <span style={{ fontWeight: 700, minWidth: '100px' }}>Query:</span>
                        <span>{originalQuery || "Legal Consultation"}</span>
                    </div>
                </div>
            </div>

            <div className="report-body">
                {/* SECTION 1 — AT-A-GLANCE STATUS */}
                {hasContent(at_a_glance) && (
                    <ReportSection id="1" title="AT-A-GLANCE STATUS">
                        <ReportTable
                            headers={["Act", "Applicable", "Confidence", "Key Risk"]}
                            data={at_a_glance}
                            renderRow={(item) => (
                                <>
                                    <td style={{ fontWeight: 600 }}>{item.act}</td>
                                    <td>{item.applicable}</td>
                                    <td>{item.confidence}</td>
                                    <td style={{ color: '#dc2626' }}>{item.key_risk}</td>
                                </>
                            )}
                        />
                    </ReportSection>
                )}

                {/* SECTION 2 — EXECUTIVE SUMMARY */}
                {hasContent(executive_summary || answer) && (
                    <ReportSection id="2" title="EXECUTIVE SUMMARY">
                        <div className="info-box">
                            {executive_summary || answer}
                            <ReferenceChips
                                ids={executive_summary_ref_ids}
                                urls={executive_summary_ref_urls}
                                references={references}
                            />
                        </div>
                        {!String(executive_summary || "").includes("State-specific obligations") && (
                            <div className="warning-box">
                                This report covers Central Acts only. State-specific obligations are not analyzed. Consult your legal team for state-level compliance.
                            </div>
                        )}
                    </ReportSection>
                )}

                {/* SECTION 3 — APPLICABILITY DETERMINATION */}
                {hasContent(applicability_detail) && (
                    <ReportSection id="3" title="APPLICABILITY DETERMINATION">
                        {applicability_detail.map((item, i) => (
                            <div key={i} style={{ marginBottom: '24px' }}>
                                <div style={{ fontWeight: 700, color: 'var(--report-navy)', marginBottom: '8px', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px' }}>{item.act}</div>
                                <div style={{ marginBottom: '4px' }}><span style={{ fontWeight: 700 }}>Applies because:</span> {item.applies_because}</div>
                                <div style={{ marginBottom: '4px' }}><span style={{ fontWeight: 700 }}>Does NOT apply if:</span> {item.does_not_apply_if}</div>
                                <div style={{ marginBottom: '12px' }}>
                                    <span style={{ fontWeight: 700 }}>Statutory basis:</span> {item.section} — {item.act}
                                    <ReferenceChips ids={item.ref_ids} urls={item.ref_urls} references={references} />
                                </div>

                                {item.evidence_snippet && (
                                    <div style={{ marginTop: '12px', padding: '12px', backgroundColor: '#f8fafc', borderLeft: '3px solid #cbd5e1', borderRadius: '0 4px 4px 0' }}>
                                        <div style={{ fontWeight: 700, fontSize: '0.75rem', color: '#64748b', marginBottom: '6px', textTransform: 'uppercase' }}>Evidence Snippet (Source Data)</div>
                                        <div style={{ fontStyle: 'italic', fontSize: '0.85rem', color: '#334155', lineHeight: '1.5' }}>"{item.evidence_snippet}"</div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </ReportSection>
                )}

                {/* SECTION 4 — COMPLIANCE CHECKLIST */}
                {hasContent(checklist) && (
                    <ReportSection id="4" title="COMPLIANCE CHECKLIST">
                        <ReportTable
                            headers={["Obligation", "Action Required", "Timeline", "Owner", "Confidence", "Status"]}
                            data={checklist}
                            renderRow={(item) => (
                                <>
                                    <td style={{ fontWeight: 600 }}>{item.step}</td>
                                    <td>
                                        <div>
                                            {item.action}
                                            <ReferenceChips ids={item.ref_ids} urls={item.ref_urls} references={references} />
                                        </div>
                                        {/* {item.trigger && <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>Trigger: {item.trigger}</div>} */}
                                    </td>
                                    <td>{item.timeline}</td>
                                    <td>{item.owner}</td>
                                    <td style={{ fontWeight: 500, color: item.confidence === 'High' ? '#166534' : '#92400e' }}>{item.confidence}</td>
                                    <td>
                                        <span style={{
                                            fontSize: '0.7rem',
                                            padding: '2px 6px',
                                            borderRadius: '3px',
                                            backgroundColor: item.status === 'Verified' ? '#dcfce7' : '#fef9c3',
                                            color: item.status === 'Verified' ? '#166534' : '#854d0e'
                                        }}>
                                            {item.status}
                                        </span>
                                    </td>
                                </>
                            )}
                        />
                    </ReportSection>
                )}

                {/* SECTION 5 — RISKS & GREY AREAS */}
                {hasContent(risks) && (
                    <ReportSection id="5" title="RISKS & GREY AREAS">
                        {risks.map((risk, i) => (
                            <div key={i} className={`risk-card ${risk.confidence === 'Review Needed' ? 'high-risk' : 'med-risk'}`}>
                                <div style={{ fontWeight: 700, color: risk.confidence === 'Review Needed' ? '#991b1b' : '#92400e', marginBottom: '12px', textTransform: 'uppercase' }}>
                                    RISK {i + 1}: {risk.title}
                                </div>
                                <div style={{ marginBottom: '8px' }}><span className="risk-label">Confidence:</span> {risk.confidence}</div>
                                <div style={{ marginBottom: '8px' }}><span className="risk-label">What the issue is:</span> {risk.issue}</div>
                                <div style={{ marginBottom: '8px' }}><span className="risk-label">Why it is disputed:</span> {risk.why_disputed}</div>
                                {risk.case_law_signal && (
                                    <div style={{ marginBottom: '8px', fontStyle: 'italic' }}><span className="risk-label">Case law signal:</span> {risk.case_law_signal}</div>
                                )}
                                <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                                    <span className="risk-label">Recommended action:</span> {risk.recommended_action}
                                </div>
                            </div>
                        ))}
                    </ReportSection>
                )}

                {/* SECTION 6 — PENALTY EXPOSURE */}
                {hasContent(penalties) && (
                    <ReportSection id="6" title="PENALTY EXPOSURE">
                        <ReportTable
                            headers={["Violation", "Monetary Penalty", "Imprisonment", "Reference"]}
                            data={penalties}
                            renderRow={(item) => (
                                <>
                                    <td style={{ fontWeight: 600, color: '#dc2626' }}>{item.violation}</td>
                                    <td>{item.monetary}</td>
                                    <td>{item.imprisonment || "N/A"}</td>
                                    <td>{item.reference}</td>
                                </>
                            )}
                        />
                    </ReportSection>
                )}

                {/* SECTION 8 — NEXT STEPS */}
                {hasContent(next_steps) && (
                    <ReportSection id="8" title="NEXT STEPS">
                        <ReportTable
                            headers={["#", "Action Required", "Why it is needed", "Timeline", "Owner"]}
                            data={next_steps}
                            renderRow={(item, idx) => (
                                <>
                                    <td style={{ fontWeight: 700 }}>{idx + 1}</td>
                                    <td style={{ fontWeight: 600 }}>
                                        {item.action}
                                        <ReferenceChips ids={item.ref_ids} urls={item.ref_urls} references={references} />
                                    </td>
                                    <td>{item.reason}</td>
                                    <td>{item.timeline}</td>
                                    <td>{item.owner}</td>
                                </>
                            )}
                        />
                    </ReportSection>
                )}

                {/* SECTION 9 — EVIDENCE INDEX */}
                {hasContent(bare_act || citations) && (
                    <ReportSection id="9" title="EVIDENCE INDEX">
                        {hasContent(bare_act) && (
                            <div style={{ marginBottom: '24px' }}>
                                <div style={{ fontWeight: 700, marginBottom: '12px', color: 'var(--report-navy)', fontSize: '0.9rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px' }}>Bare Acts</div>
                                <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '4px' }}>
                                    <div style={{ fontWeight: 600, marginBottom: '8px' }}>{bare_act.act} — {bare_act.section}</div>
                                    {bare_act.summary && <div style={{ fontSize: '0.9rem', marginBottom: '12px', color: '#475569' }}>{bare_act.summary}</div>}
                                    {bare_act.evidence?.map((ev, i) => (
                                        <div key={i} style={{ marginBottom: '12px', paddingLeft: '12px', borderLeft: '2px solid var(--report-teal)' }}>
                                            {/* <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>DOC ID: {ev.doc_id} | {ev.section || bare_act.section}</div> */}
                                            <div style={{ fontSize: '0.85rem', fontStyle: 'italic', marginTop: '4px' }}>"{ev.snippet}"</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {hasContent(citations) && (
                            <div>
                                <div style={{ fontWeight: 700, marginBottom: '12px', color: 'var(--report-navy)', fontSize: '0.9rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px' }}>Case Law References</div>
                                {citations.map((cite, i) => (
                                    <div key={i} style={{ marginBottom: '16px', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '4px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <div style={{ fontWeight: 600, color: 'var(--report-navy)' }}>{cite.title}</div>
                                            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{cite.court} ({cite.year})</div>
                                        </div>
                                        <div style={{ fontSize: '0.85rem', marginTop: '6px', color: '#334155' }}>{cite.relevance}</div>
                                        {cite.url && (
                                            <a href={cite.url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', marginTop: '8px', color: 'var(--report-teal)', textDecoration: 'none', fontWeight: 600 }}>
                                                View Judgment on Indian Kanoon <ExternalLink size={12} />
                                            </a>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </ReportSection>
                )}

                {/* DISCLAIMER */}
                <div className="disclaimer-box">
                    <strong>DISCLAIMER:</strong> {disclaimer || "This report is informational guidance based on cited Central Acts only and is not legal advice. Verify all compliance decisions with a qualified legal professional."}
                </div>
            </div>
        </div>
    );
};

export default LegalReport;
