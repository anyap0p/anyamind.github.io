import React from 'react';
import WorkBox from './Workbox';
import OgdenPhoto from '../../Icons/ogden.jpg'
import OgdenGif from '../../Icons/ogden.gif'

function OgdenPreview ({opacityEffect}) {
    return (
        <WorkBox 
            title="ogden"
            body=""
            image={OgdenPhoto}
            hoverImage={OgdenGif}
            header=""
            skillsUsed=""
            delayAppearance='3s'
            opacityEffect={opacityEffect}
            imageHeight='40vh'
            aspectRatio='11 / 8'
        />
    )
}

export default OgdenPreview