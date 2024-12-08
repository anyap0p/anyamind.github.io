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
            header="TECH STACK"
            skillsUsed="Assembly, C++, Arm Cortex-M4F based MCU"
            imageHeight='70vh'
            delayAppearance='3s'
            aspectRatio='6 / 7'
            opacityEffect={opacityEffect}
        />
    )
}

export default ConnectFourPreview