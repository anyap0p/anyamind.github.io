import React from 'react';
import NavigationBar from '../Components/NavigationBar'
import UnderConstruction from '../Components/UnderConstruction'
import SocialsBar from '../Components/Socials'

function Art () {
    return (
        <div class="page">
            <NavigationBar
                jumpAnimation={false}
                moveInAnimation={false}
            />
            <UnderConstruction></UnderConstruction>
        </div>
    )
}

export default Art