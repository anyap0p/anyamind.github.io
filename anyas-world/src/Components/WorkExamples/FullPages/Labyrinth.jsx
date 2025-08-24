import React from 'react';
import NavigationBar from '../../NavigationBar'
import WorkExample from '../WorkExample'

function Labyrinth () {
    return (
        <div class="page">
            <NavigationBar
                jumpAnimation={false}
                moveInAnimation={false}
            />
            <WorkExample></WorkExample>
        </div>
    )
}

export default Labyrinth