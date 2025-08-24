import React, { useState } from 'react';
import NavigationBar from '../Components/NavigationBar';

import '../Components/WorkExamples/Work.css';

import KikisLobbyPreview from '../Components/WorkExamples/Thumbnails/KikisLobbyPreview';
import LabyrinthPreview from '../Components/WorkExamples/Thumbnails/LabyrinthPreview';
import SoapBraceletPreview from '../Components/WorkExamples/Thumbnails/SoapBraceletPreview';
import OnAWalkPreview from '../Components/WorkExamples/Thumbnails/OnAWalkPreview';
import LawAndRagePreview from '../Components/WorkExamples/Thumbnails/LawAndRagePreview';
import OgdenPreview from '../Components/WorkExamples/Thumbnails/OgdenPreview';
import AnyaTvPreview from '../Components/WorkExamples/Thumbnails/AnyaTVPreview';
import ShadowPlayPreview from '../Components/WorkExamples/Thumbnails/ShadowPlay';
import BeastPreview from '../Components/WorkExamples/Thumbnails/BeastPreview';
import TetrafoldPreview from '../Components/WorkExamples/Thumbnails/ScenesFromHome';
import AtTheMallPreview from '../Components/WorkExamples/Thumbnails/AtTheMall';
import SelfPromoPreview from '../Components/WorkExamples/Thumbnails/SelfPromo';
import ThroughTheBlindsPreview from '../Components/WorkExamples/Thumbnails/ThroughTheBlinds';
import SelfPortraitPreview from '../Components/WorkExamples/Thumbnails/SelfPortraitPreview';

const workExamples = [
    { id: 0, component: <AnyaTvPreview opacityEffect={false} />, mediaType: ['performance', 'digital media'] },
    { id: 11, component: <SoapBraceletPreview opacityEffect={false} />, mediaType: ['performance', 'sculpture'] },
    { id: 8, component: <BeastPreview opacityEffect={false} />, mediaType: ['printed works'] },
    { id: 5, component: <ShadowPlayPreview opacityEffect={false} />, mediaType: ['printed works'] },
    { id: 2, component: <SelfPortraitPreview opacityEffect={false} />, mediaType: ['digital media'] },
    { id: 13, component: <AtTheMallPreview opacityEffect={false} />, mediaType: ['printed works', 'writing'] },
    { id: 10, component: <LabyrinthPreview opacityEffect={false} />, mediaType: ['printed works'] },
    { id: 7, component: <KikisLobbyPreview opacityEffect={false} />, mediaType: ['printed works'] },
    { id: 4, component: <TetrafoldPreview opacityEffect={false} />, mediaType: ['printed works'] },
    { id: 1, component: <LawAndRagePreview opacityEffect={false} />, mediaType: ['printed works'] },
    { id: 12, component: <OgdenPreview opacityEffect={false} />, mediaType: ['sculpture'] },
    { id: 9, component: <SelfPromoPreview opacityEffect={false} />, mediaType: ['printed works', 'sculpture'] },
    { id: 6, component: <ThroughTheBlindsPreview opacityEffect={false} />, mediaType: ['sculpture'] },
    { id: 3, component: <OnAWalkPreview opacityEffect={false} />, mediaType: ['printed works', 'writing'] },
];

function Art() {
    const [selectedMediaType, setSelectedMediaType] = useState('all');

    const filteredExamples = selectedMediaType === 'all'
        ? workExamples
        : workExamples.filter(example => example.mediaType.includes(selectedMediaType));
    
    const columns = [[], [], []];
    filteredExamples.forEach((example, index) => {
        columns[index % 3].push(example);
    });

    return (
        <div className="page">
            <NavigationBar jumpAnimation={false} moveInAnimation={false} />
            <div className="media-filter">
                {['all', 'sculpture', 'performance', 'digital media', 'printed works', 'writing'].map(mediaType => (
                    <button
                        key={mediaType}
                        onClick={() => setSelectedMediaType(mediaType)}
                        className={selectedMediaType === mediaType ? 'selected' : ''}
                    >
                        {mediaType}
                    </button>
                ))}
            </div>
            <sticky-grid-2>
                <div className="work-column-1">{columns[0].map(item => <div key={item.id}>{item.component}</div>)}</div>
                <div className="work-column-2">{columns[1].map(item => <div key={item.id}>{item.component}</div>)}</div>
                <div className="work-column-3">{columns[2].map(item => <div key={item.id}>{item.component}</div>)}</div>
            </sticky-grid-2>
        </div>
    );
}

export default Art;
