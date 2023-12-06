import React from 'react';
import NavigationBar from '../Components/NavigationBar'
import FullAboutMe from '../Components/FullAboutMe'
import WorkExamples from '../Components/Work';
import SocialsBar from '../Components/Socials';

function About () {
    return (
        <div id="about-me-page">
            <NavigationBar
                jumpAnimation={false}
                moveInAnimation={false}
            />
            <FullAboutMe></FullAboutMe>
            <SocialsBar animate={false}></SocialsBar>
        </div>
    )
}

export default About