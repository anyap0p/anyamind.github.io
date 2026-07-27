import React, { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import ArtGalleryChrome from '../Components/ArtGalleryChrome';
import KaleidoscopeMaker from '../Components/KaleidoscopeMaker';
import { BackButton } from '../Components/KaleidoscopeMaker/BackButton';
import { ChromeTitlePlaque } from '../Components/KaleidoscopeMaker/ChromeTitlePlaque';
import { ForwardButton } from '../Components/KaleidoscopeMaker/ForwardButton';
import { KaleidoscopeViewChrome } from '../Components/KaleidoscopeMaker/KaleidoscopeViewChrome';
import { KaleidoscopeViewControlsProvider } from '../Components/KaleidoscopeMaker/KaleidoscopeViewControlsContext';
import '../Components/KaleidoscopeMaker/KaleidoscopeMaker.css';
import './ArtWorkPiece.css';
import './KaleidoscopeMakerArt.css';

const SHOP_TITLE = "anya's kaleidoscope shop";

function KaleidoscopeMakerArt() {
    const [makerScreen, setMakerScreen] = useState('home');
    const [chromeTitle, setChromeTitle] = useState(SHOP_TITLE);
    const [chromeBack, setChromeBack] = useState(null);
    const [chromeForward, setChromeForward] = useState(null);

    const onChromeBackChange = useCallback((handler, tip = 'home') => {
        if (!handler) {
            setChromeBack(null);
            return;
        }
        setChromeBack(() => ({ handler, tip }));
    }, []);

    const onChromeForwardChange = useCallback((handler, tip = 'save and view') => {
        if (!handler) {
            setChromeForward(null);
            return;
        }
        setChromeForward(() => ({ handler, tip }));
    }, []);

    const onChromeTitleChange = useCallback((title) => {
        setChromeTitle(title || SHOP_TITLE);
    }, []);

    return (
        <ArtGalleryChrome>
            <KaleidoscopeViewControlsProvider>
                <div className="art-work-piece-media-wrap">
                    <div className="art-work-piece-media-frame kaleidoscope-maker-art__media-frame">
                        <div
                            className={[
                                'kaleidoscope-maker-art__heading',
                                makerScreen === 'home' ? 'kaleidoscope-maker-art__heading--home' : '',
                                makerScreen === 'kaleidoscope'
                                    ? 'kaleidoscope-maker-art__heading--view-chrome kaleidoscope-maker__view-chrome-heading'
                                    : '',
                                makerScreen !== 'kaleidoscope' && makerScreen !== 'home'
                                    ? 'kaleidoscope-maker-art__heading--title-lowered'
                                    : '',
                            ]
                                .filter(Boolean)
                                .join(' ')}
                        >
                            <ChromeTitlePlaque className="kaleidoscope-maker-art__title-plaque">
                            <div className="kaleidoscope-maker-art__title-row">
                                <div className="kaleidoscope-maker-art__title-nav kaleidoscope-maker-art__title-nav--back">
                                    {chromeBack ? (
                                        <BackButton
                                            inTitle
                                            onClick={chromeBack.handler}
                                            tip={chromeBack.tip}
                                        />
                                    ) : null}
                                </div>
                                <Link
                                    to="/art/kaleidoscope-maker/full"
                                    className="kaleidoscope-maker-art__title-link"
                                >
                                    <h1 className="kaleidoscope-maker-art__title-inner">{chromeTitle}</h1>
                                </Link>
                                <div className="kaleidoscope-maker-art__title-nav kaleidoscope-maker-art__title-nav--forward">
                                    {chromeForward ? (
                                        <ForwardButton
                                            inTitle
                                            onClick={chromeForward.handler}
                                            tip={chromeForward.tip}
                                        />
                                    ) : null}
                                </div>
                            </div>
                            <Link to="/about" className="kaleidoscope-maker-art__subtitle kaleidoscope-maker-art__subtitle-link">
                                by anya mind
                            </Link>
                        </ChromeTitlePlaque>
                            {makerScreen === 'kaleidoscope' ? <KaleidoscopeViewChrome /> : null}
                    </div>
                    <KaleidoscopeMaker
                        onMakerScreenChange={setMakerScreen}
                        onChromeBackChange={onChromeBackChange}
                        onChromeForwardChange={onChromeForwardChange}
                        onChromeTitleChange={onChromeTitleChange}
                    />
                </div>
            </div>
            </KaleidoscopeViewControlsProvider>
        </ArtGalleryChrome>
    );
}

export default KaleidoscopeMakerArt;
