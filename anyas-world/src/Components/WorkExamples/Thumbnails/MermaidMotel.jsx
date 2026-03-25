import React from 'react';
import WorkBox from '../Workbox';
import MermaidMotel from '../../../Icons/mermaidMotel.png';
import MermaidMotelGif from '../../../Icons/mermaidMotel.gif';

function MermaidMotelPreview ({opacityEffect}) {
    return (
        <WorkBox 
            title="mermaid motel"
            body=""
            image={MermaidMotel}
            hoverImage={MermaidMotelGif}
            header=""
            skillsUsed=""
            imageHeight='40vh'
            aspectRatio='3 / 2'
            delayAppearance='1s'
            opacityEffect={opacityEffect}
            underDevelopment={false}
            link="/art/mermaid-motel"
        />
    )
}

export default MermaidMotelPreview