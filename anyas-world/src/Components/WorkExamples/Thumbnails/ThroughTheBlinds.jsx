import React from 'react';
import WorkBox from '../Workbox';
import ThroughTheBlinds from '../../../Icons/peep.jpg';
import ThroughTheBlindsGif from '../../../Icons/peep.jpg';

function ThroughTheBlindsPreview ({opacityEffect}) {
    return (
        <WorkBox 
            title="through the blinds"
            body=""
            image={ThroughTheBlinds}
            hoverImage={ThroughTheBlindsGif}
            header=""
            skillsUsed=""
            imageHeight='40vh'
            aspectRatio='1 / 1'
            delayAppearance='1s'
            opacityEffect={opacityEffect}
            underDevelopment={true}
        />
    )
}

export default ThroughTheBlindsPreview