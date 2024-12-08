import React from 'react';
import WorkBox from './Workbox';
import Connect4Gif from '../../Icons/altseeingi.gif'
import Connect4Image from '../../Icons/altseeingi.gif'

function ConnectFourPreview ({opacityEffect}) {
    return (
        <WorkBox 
            title="Connect4!"
            body="Embedded Connect4 on a TM4C123 microcontroller."
            image={Connect4Image}
            hoverImage={Connect4Gif}
            header=""
            skillsUsed=""
            delayAppearance='3s'
            opacityEffect={opacityEffect}
            imageHeight='40vh'
            aspectRatio='1 / 1'
        />
    )
}

export default ConnectFourPreview