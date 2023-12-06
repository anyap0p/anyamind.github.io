import React from 'react';
import './NavigationBar.css';
import sparkles from '../Icons/pink-sparkles.png';

function NavigationBar ({jumpAnimation, moveInAnimation}) {

    const createLetterSpans = (text, delay) => {
        console.log(jumpAnimation, moveInAnimation)

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
        <div className={`left-nav-container${moveInAnimation ? 'animate' : ''}`}>
            <div className='top-nav-box'>
                <a href='#' className='head-text'>
                    {createLetterSpans("anya price", 2.5)}
                </a>
                <img src={sparkles} className='glitter-on-hover'></img>
            </div>
            <div className='nav-box'>
                <a href='/#/about' style={{ animationDelay: '5s' }} className='nav-text'>
                    {createLetterSpans("about", 3)}
                </a>
            </div>
            <div className='nav-box'>
                <a href='/#/work' style={{ animationDelay: '8s' }} className='nav-text'>
                    {createLetterSpans("work", 3.5)}
                </a>
            </div>
            <div className='nav-box'>
                <a href='/#/art' className='nav-text'>
                    {createLetterSpans("art", 4)}
                </a>
            </div>
        </div>
    )
}

export default NavigationBar