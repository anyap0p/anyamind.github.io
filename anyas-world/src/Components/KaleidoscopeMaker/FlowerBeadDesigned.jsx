import React from 'react';
import { FLOWER_FINAL_GEM } from './flowerGemData';
import { GrayscaleGemSubtree } from './GrayscaleGemSubtree';

/** flower.svg paths — parent supplies `<svg viewBox={…}>`. */
export function FlowerBeadDesigned({ fill, accent, lightDeg }) {
    const a = accent || fill;
    const { root } = FLOWER_FINAL_GEM;
    if (!root) return null;
    return <GrayscaleGemSubtree node={root} primary={fill} accent={a} lightDeg={lightDeg} />;
}
