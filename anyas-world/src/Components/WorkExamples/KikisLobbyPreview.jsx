import React from 'react';
import WorkBox from './Workbox';
import './Work.css';
import KikisLobby from '../../Icons/kikisLobby2.jpg'
import KikisLobbyGif from '../../Icons/kikilobby.gif'

function KikisLobbyPreview ({opacityEffect}) {
    return (
        <WorkBox 
            title="kiki's lobby"
            body=""
            image={KikisLobby}
            hoverImage={KikisLobbyGif}
            header=""
            skillsUsed=""
            imageHeight='40vh'
            aspectRatio='4 / 5 '
            delayAppearance='1s'
            opacityEffect={opacityEffect}
            underDevelopment={true}
        />
    )
}

export default KikisLobbyPreview