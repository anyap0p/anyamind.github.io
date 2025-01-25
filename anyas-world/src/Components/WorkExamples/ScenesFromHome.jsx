import React from 'react';
import WorkBox from './Workbox';
import './Work.css';
import Tetrafold from '../../Icons/tetrafold.jpg';
import TetrafoldGif from '../../Icons/tetrafold.gif';

function TetrafoldPreview ({opacityEffect}) {
    return (
        <WorkBox 
            title="scenes from home"
            body=""
            image={Tetrafold}
            hoverImage={TetrafoldGif}
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

export default TetrafoldPreview