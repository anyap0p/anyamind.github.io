import React from 'react';
import WorkBox from './Workbox';
import './Work.css';
import AtTheMall from '../../Icons/atthemall.jpg';
import AtTheMallGif from '../../Icons/atthemall.gif';

function AtTheMallPreview ({opacityEffect}) {
    return (
        <WorkBox 
            title="at the mall"
            body=""
            image={AtTheMall}
            hoverImage={AtTheMallGif}
            header=""
            skillsUsed=""
            imageHeight='40vh'
            aspectRatio='3 / 2'
            delayAppearance='1s'
            opacityEffect={opacityEffect}
            underDevelopment={true}
        />
    )
}

export default AtTheMallPreview