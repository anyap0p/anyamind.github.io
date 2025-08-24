import React from 'react';
import WorkBox from '../Workbox';
import '../Work.css';
import AnyaTV from '../../../Icons/anyatv.png';
import AnyaTVGif from '../../../Icons/anyatv2.gif';

function AnyaTvPreview ({opacityEffect}) {
    return (
        <WorkBox 
            title="ANYA.TV"
            body=""
            image={AnyaTV}
            hoverImage={AnyaTVGif}
            header=""
            skillsUsed=""
            imageHeight='40vh'
            aspectRatio='5 / 4'
            delayAppearance='1s'
            opacityEffect={opacityEffect}
            underDevelopment={true}
        />
    )
}

export default AnyaTvPreview