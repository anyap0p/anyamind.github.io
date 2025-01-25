import React, {useRef, useEffect} from 'react';
import './Socials.css';
// import linkedin from '../Icons/linkedin-logo.svg';
// import github from '../Icons/github-logo.svg';
// import email from '../Icons/mail-logo.svg'

function SocialsBar ({animate}) {
    
    const emailIconRef = useRef(null);
    const githubIconRef = useRef(null);
    const linkedinIconRef = useRef(null);

    useEffect(() => {
        if (animate === true) {
            if (emailIconRef.current) {
                emailIconRef.current.style.setProperty('--w', '-400deg');
            }
            if (githubIconRef.current) {
                githubIconRef.current.style.setProperty('--w', '-800deg');
            }
            if (linkedinIconRef.current) {
                linkedinIconRef.current.style.setProperty('--w', '-960deg');
            }
        }
        else {
            if (emailIconRef.current) {
                emailIconRef.current.style.setProperty('animation', 'None');
            }
            if (githubIconRef.current) {
                githubIconRef.current.style.setProperty('animation', 'None');
            }
            if (linkedinIconRef.current) {
                linkedinIconRef.current.style.setProperty('animation', 'None');
            }
        }
    });

    return (
        <div className='right-social-container'>
            <div className='icon-container'>
                <a href="mailto:anyaprice@utexas.edu"  target="_blank" rel="noopener noreferrer">
                    {/* <img ref={emailIconRef} src={email} alt="" className='social-icon'/> */}
                </a>
            </div>
            <div className='icon-container'>
                <a href='https://www.linkedin.com/in/anya-price-671121206/' target="_blank" rel="noopener noreferrer"> 
                    {/* <img ref={linkedinIconRef} src={linkedin} alt="" className='social-icon'/> */}
                </a>
            </div>
            <div className='icon-container'>
                <a href='https://github.com/anyap0p' target="_blank" rel="noopener noreferrer">
                    {/* <img ref={githubIconRef} src={github} alt="" className='social-icon'/> */}
                </a>
            </div>
        </div>
    )
}

export default SocialsBar