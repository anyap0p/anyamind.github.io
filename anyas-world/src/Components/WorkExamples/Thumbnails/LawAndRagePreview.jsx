import React from 'react';
import WorkBox from '../Workbox';
import LawAndRage from '../../../Icons/lawAndRage.PNG';

function LawAndRagePreview ({opacityEffect}) {
    return (
        <WorkBox 
            title="law and rage"
            body=""
            image={LawAndRage}
            hoverImage={LawAndRage}
            header=""
            skillsUsed=""
            delayAppearance='5s'
            underDevelopment={false}
            opacityEffect={opacityEffect}
            imageHeight='40vh'
            aspectRatio='17 / 22'
            link="/art/piece/law-and-rage"
        />
    )
}

export default LawAndRagePreview