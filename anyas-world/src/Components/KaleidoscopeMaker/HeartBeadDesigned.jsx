import React from 'react';
import { HEART_FINAL_GEM } from './heartFinalGemData';
import { GrayscaleGemSubtree } from './GrayscaleGemSubtree';

/**
 * Heart gem from Icons/heartFInal.svg: each path’s grayscale fill becomes a mix of
 * primary (bead fill, maps from black) and secondary (bead accent, maps from white).
 */

/** Heart paths only — parent supplies `<svg viewBox={…}>` so layout matches gem bounds. */
export function HeartBeadDesigned({ fill, accent, lightDeg }) {
    const a = accent || fill;
    const { root } = HEART_FINAL_GEM;
    if (!root) return null;
    return <GrayscaleGemSubtree node={root} primary={fill} accent={a} lightDeg={lightDeg} />;
}
