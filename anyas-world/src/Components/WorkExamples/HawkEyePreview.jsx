import React from 'react';
import WorkBox from './Workbox';
import HawkEyeGif from '../../Icons/altseeingi.gif'
import HawkEyePhoto from '../../Icons/altseeingi.gif'

function HawkEyePreview ({opacityEffect}) {
    return (
        <WorkBox 
            title="Hawk Eye"
            body="Computer vision for unmanned aerial vehicles."
            image={HawkEyePhoto}
            hoverImage={HawkEyeGif}
            header="TECH STACK"
            skillsUsed="Pytorch, Tensorboard, Bazel"
            imageHeight='35vh'
            delayAppearance='3s'
            opacityEffect={opacityEffect}
            aspectRatio='20 / 11'
        />
    )
}

export default HawkEyePreview