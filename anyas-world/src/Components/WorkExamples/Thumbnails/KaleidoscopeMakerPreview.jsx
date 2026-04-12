import React from 'react';
import WorkBox from '../Workbox';
import KaleidoscopeThumb from '../../../Icons/kaleidoscopeMaker.svg';

function KaleidoscopeMakerPreview({ opacityEffect }) {
    return (
        <WorkBox
            title="kaleidoscope maker"
            body=""
            image={KaleidoscopeThumb}
            hoverImage={KaleidoscopeThumb}
            header=""
            skillsUsed=""
            imageHeight="40vh"
            aspectRatio="1 / 1"
            delayAppearance="1s"
            opacityEffect={opacityEffect}
            underDevelopment={false}
            link="/art/kaleidoscope-maker"
        />
    );
}

export default KaleidoscopeMakerPreview;
