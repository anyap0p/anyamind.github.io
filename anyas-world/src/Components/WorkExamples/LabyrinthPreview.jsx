import React from 'react';
import WorkBox from './Workbox';
import Labyrinth from '../../Icons/labyrinth.jpg';
import LabyrinthGif from '../../Icons/labyrinthFast.gif';

function LabyrinthPreview ({opacityEffect}) {
    return (
        <WorkBox 
            title="labyrinth"
            body=""
            image={Labyrinth}
            hoverImage={LabyrinthGif}
            header=""
            skillsUsed=""
            delayAppearance='5s'
            underDevelopment={true}
            opacityEffect={opacityEffect}
            imageHeight='40vh'
            aspectRatio='70 / 55'
        />
    )
}

export default LabyrinthPreview