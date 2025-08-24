import React from 'react';
import WorkBox from '../Workbox';
import SelfPromo from '../../../Icons/selfpromo.jpg';
import SelfPromoGif from '../../../Icons/selfpromo.jpg';

function SelfPromoPreview ({opacityEffect}) {
    return (
        <WorkBox 
            title="#mybrand"
            body=""
            image={SelfPromo}
            hoverImage={SelfPromoGif}
            header=""
            skillsUsed=""
            imageHeight='40vh'
            aspectRatio='3 / 4'
            delayAppearance='1s'
            opacityEffect={opacityEffect}
            underDevelopment={true}
        />
    )
}

export default SelfPromoPreview