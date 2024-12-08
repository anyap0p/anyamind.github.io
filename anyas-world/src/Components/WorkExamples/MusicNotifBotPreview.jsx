import React from 'react';
import WorkBox from './Workbox';
import NotifBotPhoto from '../../Icons/altseeingi.gif'

function MusicNotifBotPreview ({opacityEffect}) {
    return (
        <WorkBox 
            title="MusicNotifBot"
            body="Your friendly neighorhood discord bot, here to compile your favorite artist's recent releases."
            image={NotifBotPhoto}
            hoverImage={NotifBotPhoto}
            header="TECH STACK"
            skillsUsed="discord.py, last.fm API, Spotify API"
            imageHeight='60vh'
            delayAppearance='5s'
            underDevelopment={true}
            opacityEffect={opacityEffect}
            aspectRatio='6 / 7'
        />
    )
}

export default MusicNotifBotPreview