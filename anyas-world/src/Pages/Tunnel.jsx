import React, { useState } from 'react';
import NavigationBar from '../Components/NavigationBar';

import Tunnel from '../Components/Tunnel';

function ArtTunnel() {
    return (
        <div>
            <NavigationBar jumpAnimation={false} moveInAnimation={false} />
            <Tunnel />
        </div>
    );
}

export default ArtTunnel;
