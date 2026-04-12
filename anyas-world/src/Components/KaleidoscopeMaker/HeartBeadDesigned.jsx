import React from 'react';
import { HEART_FINAL_GEM } from './heartFinalGemData';
import { adjustBrightnessT, mixPrimaryAccent } from './heartGrayscaleMix';

/**
 * Heart gem from Icons/heartFInal.svg: each path’s grayscale fill becomes a mix of
 * primary (bead fill, maps from black) and secondary (bead accent, maps from white).
 */

function GemSubtree({ node, primary, accent, lightDeg }) {
    if (node.kind === 'path') {
        const t = adjustBrightnessT(node.t, lightDeg);
        const fill = mixPrimaryAccent(primary, accent, t);
        return <path d={node.d} fill={fill} />;
    }
    return (
        <g transform={node.transform}>
            {node.children.map((ch) => (
                <GemSubtree key={ch.k} node={ch} primary={primary} accent={accent} lightDeg={lightDeg} />
            ))}
        </g>
    );
}

/** Heart paths only — parent supplies `<svg viewBox={…}>` so layout matches gem bounds. */
export function HeartBeadDesigned({ fill, accent, lightDeg }) {
    const a = accent || fill;
    const { root } = HEART_FINAL_GEM;
    if (!root) return null;
    return <GemSubtree node={root} primary={fill} accent={a} lightDeg={lightDeg} />;
}
