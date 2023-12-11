import React, { useEffect, useState } from 'react';
import NavigationBar from '../Components/NavigationBar'
import QuickAboutMe from '../Components/QuickAboutMe'
import WorkExamples from '../Components/WorkExamples/WorkPreview';
import SocialsBar from '../Components/Socials'

function Welcome () {
    return (
        <div id="welcome-page">
            <NavigationBar
                jumpAnimation={true}
                moveInAnimation={true}
            />
            <SocialsBar animate={true}></SocialsBar>
            <QuickAboutMe></QuickAboutMe>
            <WorkExamples></WorkExamples>
        </div>
    )
}

export default Welcome