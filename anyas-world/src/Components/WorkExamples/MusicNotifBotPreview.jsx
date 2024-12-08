import React from 'react';
import WorkBox from './Workbox';
import NotifBotPhoto from '../../Icons/altseeingi.gif'

function MusicNotifBotPreview ({opacityEffect}) {
    return (
        <WorkBox 
            title="MusicNotifBot"
            body=""
            image={NotifBotPhoto}
            hoverImage={NotifBotPhoto}
            header=""
            skillsUsed=""
            delayAppearance='5s'
            underDevelopment={true}
            opacityEffect={opacityEffect}
            imageHeight='40vh'
            aspectRatio='1 / 1'
        />
    )
}

export default MusicNotifBotPreview