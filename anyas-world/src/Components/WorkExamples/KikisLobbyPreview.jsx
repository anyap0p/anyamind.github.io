import React from 'react';
import WorkBox from './Workbox';
import './Work.css';
import KikisLobby from '../../Icons/kikilobbyallpages.png'

function KikisLobbyPreview ({opacityEffect}) {
    return (
        <WorkBox 
            title="kiki's lobby"
            body=""
            image={KikisLobby}
            hoverImage={KikisLobby}
            header=""
            skillsUsed=""
            imageHeight='40vh'
            aspectRatio='17 / 22'
            delayAppearance='1s'
            opacityEffect={opacityEffect}
            underDevelopment={true}
        />
    )
}

export default KikisLobbyPreview