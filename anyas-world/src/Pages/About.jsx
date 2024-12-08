import React from 'react';
import NavigationBar from '../Components/NavigationBar'
import FullAboutMe from '../Components/FullAboutMe'
import SocialsBar from '../Components/Socials';

function About () {
    return (
        <div class="page">
            <NavigationBar
                jumpAnimation={false}
                moveInAnimation={false}
            />
            <FullAboutMe></FullAboutMe>
            {/* <SocialsBar animate={false}></SocialsBar> */}
        </div>
    )
}

export default About