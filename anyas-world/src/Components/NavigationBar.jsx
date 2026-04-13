import React from 'react';
import { Link } from 'react-router-dom';
import './NavigationBar.css';
import sparkles from '../Icons/pink-sparkles.png';

function NavigationBar ({jumpAnimation, moveInAnimation}) {

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
        <div className={`left-nav-container${moveInAnimation ? 'animate' : ''}`}>
            <div className='top-nav-box'>
                <Link to='/' className='head-text'>
                    {createLetterSpans("anyamind", 2.5)}
                </Link>
                <img src={sparkles} className='glitter-on-hover' alt=''></img>
            </div>
            <div className='nav-box'>
                <Link to='/about' style={{ animationDelay: '5s' }} className='nav-text'>
                    {createLetterSpans("about", 3)}
                </Link>
            </div>
            <div className='nav-box'>
                <Link to='/art' style={{ animationDelay: '8s' }} className='nav-text'>
                    {createLetterSpans("art", 3.5)}
                </Link>
            </div>
        </div>
    )
}

export default NavigationBar