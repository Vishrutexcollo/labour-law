import React from 'react';
import { ExternalLink } from 'lucide-react';

const ReferenceChips = ({ ids, urls, references }) => {
    if ((!ids || ids.length === 0) && (!urls || urls.length === 0)) return null;

    const uniqueRefs = [];
    const seenUrls = new Set();
    const seenIds = new Set();

    // Prioritize mapping from references array via IDs
    ids?.forEach(id => {
        if (seenIds.has(id)) return;
        seenIds.add(id);
        const ref = references?.find(r => r.id === id);
        if (ref) {
            uniqueRefs.push(ref);
            if (ref.url) seenUrls.add(ref.url);
        }
    });

    // Then process URLs
    urls?.forEach(url => {
        if (seenUrls.has(url)) return;
        seenUrls.add(url);
        const ref = references?.find(r => r.url === url);
        if (ref) {
            uniqueRefs.push(ref);
        } else {
            // Fallback for URLs not in the references array
            uniqueRefs.push({ title: 'Source', url });
        }
    });

    if (uniqueRefs.length === 0) return null;

    return (
        <span style={{ display: 'inline-flex', flexWrap: 'wrap', gap: '4px', verticalAlign: 'middle', marginLeft: '6px' }}>
            {uniqueRefs.map((ref, idx) => (
                <a
                    key={idx}
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="reference-chip"
                    onClick={(e) => e.stopPropagation()}
                >
                    <span className="reference-chip-icon">
                        <ExternalLink size={10} />
                    </span>
                    {ref.title || 'Source'}
                </a>
            ))}
        </span>
    );
};

export default ReferenceChips;
