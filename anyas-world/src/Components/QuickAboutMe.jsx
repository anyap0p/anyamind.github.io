import React, { useState, } from 'react';
import './QuickAboutMe.css';
import './NavigationBar.css';
import glitterEye from '../Icons/allseeingi.gif';
import glitterEyeAlt from '../Icons/altseeingi.gif';
import gatePeep from '../Icons/gate_peep.png';
import sparkles from '../Icons/pink-sparkles.png';

function QuickAboutMe () {

    const [titleHovered, setTitleHovered] = useState(false);
    const [hoverIndex, setHoverIndex] = useState(null);
    const [jumpAnimation, setJumpAnimation] = useState(true);
    const [moveInAnimation, setMoveInAnimation] = useState(true);

    const createLetterSpans = (text, delay) => {
        return text.split('').map((letter, index) => (
            letter === ' ' ? 
            (<span key={index} className={`nav-letter${jumpAnimation ? 'animate' : ''}`} style={{ animationDelay: `${delay + (index * 0.1) +  1}s` }}>
                &nbsp;
            </span>) :
            (<span key={index} className={`nav-letter${jumpAnimation ? 'animate' : ''}`} style={{ animationDelay: `${delay + (index * 0.1) + 1}s` }}>
                {letter}
            </span>)
        ));
    };
    
    return (
        <div className='landing-container'>
            <div className='welcome-block'>
                <h1
                    className='welcome-header'
                    onMouseEnter={() => setTitleHovered(true)}
                    onMouseLeave={() => setTitleHovered(false)}
                >
                    {titleHovered ? '⚝\n⅌\n♱\n⚝' : `anya`}
                </h1>
                <div className="carousel-container">
                    <div className="carousel">
                        {[
                            glitterEye,
                            glitterEyeAlt,
                            glitterEye,
                            glitterEyeAlt,
                            glitterEye,
                            glitterEyeAlt,
                            glitterEye,
                            glitterEyeAlt,
                        ].map((image, index) => (
                            <img
                                key={index}
                                className="carousel-image"
                                src={image}
                                alt=""
                                style={{ zIndex: index % 2 === 0 ? -1 : 1 }}
                            />
                        ))}
                    </div>
                    <div className="carouselY">
                        {[
                            gatePeep,
                            gatePeep,
                            gatePeep,
                            gatePeep,
                            gatePeep,
                            gatePeep,
                            gatePeep,
                            gatePeep,
                            gatePeep,
                            gatePeep,
                            gatePeep,
                            gatePeep,
                            gatePeep,
                            gatePeep,
                            gatePeep,
                            gatePeep,
                            gatePeep,
                            gatePeep,
                            gatePeep,
                            gatePeep,
                            gatePeep,
                            gatePeep,
                            gatePeep,
                            gatePeep,
                            gatePeep,
                            gatePeep,
                            gatePeep,
                        ].map((image, index) => (
                            <img
                                key={index}
                                className="carouselY-image"
                                src={image}
                                alt=""
                                style={{ zIndex: index % 2 === 0 ? -1 : 1 }}
                            />
                        ))}
                    </div>
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
                <div className={`left-nav-container${moveInAnimation ? 'animate' : ''}`}>
                    <a href='/#/work' style={{ animationDelay: '8s', '--diamond-width': '2rem', '--diamond-height': '2rem' }} className='nav-text'>
                        {createLetterSpans("art", 3.5)}
                    </a>
                    <a href='/#/about' style={{ animationDelay: '5s', '--diamond-width': '3rem', '--diamond-height': '3rem' }} className='nav-text'>
                        {createLetterSpans("about", 3)}
                    </a>
                    <a href='#/welcome' style={{'--diamond-width': '4rem', '--diamond-height': '4rem' }} className='nav-text'>
                        {createLetterSpans("anyamind", 2.5)}
                    </a>
                    <img src={sparkles} className='glitter-on-hover' alt=''></img>
                    <a href='/#/about' style={{ animationDelay: '5s', '--diamond-width': '3rem', '--diamond-height': '3rem' }} className='nav-text'>
                        {createLetterSpans("about", 3)}
                    </a>
                    <a href='/#/work' style={{ animationDelay: '8s', '--diamond-width': '2rem', '--diamond-height': '2rem' }} className='nav-text'>
                        {createLetterSpans("art", 3.5)}
                    </a>
                </div>
            </div>
        </div>
    )
}

export default QuickAboutMe