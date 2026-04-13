import React from 'react';
import { adjustBrightnessT, mixPrimaryAccent } from './heartGrayscaleMix';

export function GrayscaleGemSubtree({ node, primary, accent, lightDeg }) {
    if (node.kind === 'path') {
        const t = adjustBrightnessT(node.t, lightDeg);
        const fill = mixPrimaryAccent(primary, accent, t);
        return <path d={node.d} fill={fill} />;
    }
    return (
        <g transform={node.transform}>
            {node.children.map((ch) => (
                <GrayscaleGemSubtree key={ch.k} node={ch} primary={primary} accent={accent} lightDeg={lightDeg} />
            ))}
        </g>
    );
}
