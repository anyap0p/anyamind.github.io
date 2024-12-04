import React, { useState, } from 'react';
import './QuickAboutMe.css';
import glitterEye from '../Icons/allseeingi.gif';
import glitterEyeAlt from '../Icons/altseeingi.gif';
import gatePeep from '../Icons/gate_peep.png';

function QuickAboutMe () {

    const [titleHovered, setTitleHovered] = useState(false);
    const [hoverIndex, setHoverIndex] = useState(null);

    return (
        <div className='landing-container'>
            <div className='welcome-block'>
                <h1
                    className='welcome-header'
                    onMouseEnter={() => setTitleHovered(true)}
                    onMouseLeave={() => setTitleHovered(false)}
                >
                    {titleHovered ? '⚝⅌♱⚝' : `anya`}
                </h1>
                <div className='image-container'>
                    <img 
                        className='intro-image'
                        src={glitterEye}
                        alt=''
                    />
                    <img 
                        className='intro-image'
                        src={glitterEyeAlt}
                        alt=''
                    />
                     <img 
                        className='intro-image'
                        src={glitterEye}
                        alt=''
                    />
                    <img 
                        className='intro-image'
                        src={glitterEyeAlt}
                        alt=''
                    />
                     <img 
                        className='intro-image'
                        src={glitterEye}
                        alt=''
                    />
                    <img 
                        className='intro-image'
                        src={glitterEyeAlt}
                        alt=''
                    />
                     <img 
                        className='intro-image'
                        src={glitterEye}
                        alt=''
                    />
                    <img 
                        className='intro-image'
                        src={glitterEyeAlt}
                        alt=''
                    />
                     <img 
                        className='intro-image'
                        src={glitterEye}
                        alt=''
                    />
                    <img 
                        className='intro-image'
                        src={glitterEyeAlt}
                        alt=''
                    />
                </div>
                <div className='repeating-text'>
                    {Array.from({ length: 20 }, (_, index) => (
                        <h1 
                            key={index} 
                            className='welcome-body'
                            onMouseEnter={() => setHoverIndex(index)}
                            onMouseLeave={() => setHoverIndex(null)}
                        >
                            {hoverIndex === index? 'on ur mind' : `anya  mind`}
                        </h1>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default QuickAboutMe