import React, { useState } from 'react';
import NavigationBar from '../Components/NavigationBar';

import '../Components/WorkExamples/Work.css';

import KikisLobbyPreview from '../Components/WorkExamples/KikisLobbyPreview';
import LabyrinthPreview from '../Components/WorkExamples/LabyrinthPreview';
import SoapBraceletPreview from '../Components/WorkExamples/SoapBraceletPreview';
import OnAWalkPreview from '../Components/WorkExamples/OnAWalkPreview';
import LawAndRagePreview from '../Components/WorkExamples/LawAndRagePreview';
import OgdenPreview from '../Components/WorkExamples/OgdenPreview';
import AnyaTvPreview from '../Components/WorkExamples/AnyaTVPreview';
import ShadowPlayPreview from '../Components/WorkExamples/ShadowPlay';
import BeastPreview from '../Components/WorkExamples/BeastPreview';
import TetrafoldPreview from '../Components/WorkExamples/ScenesFromHome';
import AtTheMallPreview from '../Components/WorkExamples/AtTheMall';
import SelfPromoPreview from '../Components/WorkExamples/SelfPromo';
import ThroughTheBlindsPreview from '../Components/WorkExamples/ThroughTheBlinds';
import SelfPortraitPreview from '../Components/WorkExamples/SelfPortraitPreview';

const workExamples = [
    { id: 1, component: <AnyaTvPreview opacityEffect={false} />, mediaType: ['performance'] },
    { id: 2, component: <ShadowPlayPreview opacityEffect={false} />, mediaType: ['book'] },
    { id: 3, component: <LabyrinthPreview opacityEffect={false} />, mediaType: ['book'] },
    { id: 4, component: <LawAndRagePreview opacityEffect={false} />, mediaType: 'book' },
    { id: 5, component: <ThroughTheBlindsPreview opacityEffect={false} />, mediaType: 'sculpture' },
    { id: 6, component: <SoapBraceletPreview opacityEffect={false} />, mediaType: 'performance' },
    { id: 7, component: <SelfPortraitPreview opacityEffect={false} />, mediaType: 'Painting' },
    { id: 8, component: <KikisLobbyPreview opacityEffect={false} />, mediaType: 'Design' },
    { id: 9, component: <OgdenPreview opacityEffect={false} />, mediaType: 'Animation' },
    { id: 10, component: <OnAWalkPreview opacityEffect={false} />, mediaType: 'Film' },
    { id: 11, component: <BeastPreview opacityEffect={false} />, mediaType: 'Sculpture' },
    { id: 12, component: <AtTheMallPreview opacityEffect={false} />, mediaType: 'Photography' },
    { id: 13, component: <TetrafoldPreview opacityEffect={false} />, mediaType: 'Interactive' },
    { id: 14, component: <SelfPromoPreview opacityEffect={false} />, mediaType: 'Design' },
];

function Art() {
    const [selectedMediaType, setSelectedMediaType] = useState('All');

    const filteredExamples = selectedMediaType === 'All'
        ? workExamples
        : workExamples.filter(example => example.mediaType.con === selectedMediaType);

    return (
        <div className="page">
            <NavigationBar jumpAnimation={false} moveInAnimation={false} />
            <div className="media-filter">
                <button onClick={() => setSelectedMediaType('All')}>All</button>
                <button onClick={() => setSelectedMediaType('Animation')}>Animation</button>
                <button onClick={() => setSelectedMediaType('Film')}>Film</button>
                <button onClick={() => setSelectedMediaType('Interactive')}>Interactive</button>
                <button onClick={() => setSelectedMediaType('Photography')}>Photography</button>
                <button onClick={() => setSelectedMediaType('Design')}>Design</button>
                <button onClick={() => setSelectedMediaType('Jewelry')}>Jewelry</button>
                <button onClick={() => setSelectedMediaType('Sculpture')}>Sculpture</button>
                <button onClick={() => setSelectedMediaType('Painting')}>Painting</button>
                <button onClick={() => setSelectedMediaType('Illustration')}>Illustration</button>
            </div>
            <div className="sticky-grid-2">
                {filteredExamples.map(example => (
                    <div key={example.id} className="work-item">
                        {example.component}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Art;
