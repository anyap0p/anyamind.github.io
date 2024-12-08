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
            header=""
            skillsUsed=""
            delayAppearance='3s'
            opacityEffect={opacityEffect}
            imageHeight='40vh'
            aspectRatio='1 / 1'
        />
    )
}

export default HawkEyePreview