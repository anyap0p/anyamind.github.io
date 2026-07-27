import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import KaleidoscopeMaker from '../Components/KaleidoscopeMaker';
import { BackButton } from '../Components/KaleidoscopeMaker/BackButton';
import { ChromeTitlePlaque } from '../Components/KaleidoscopeMaker/ChromeTitlePlaque';
import { ForwardButton } from '../Components/KaleidoscopeMaker/ForwardButton';
import { KaleidoscopeViewChrome } from '../Components/KaleidoscopeMaker/KaleidoscopeViewChrome';
import { KaleidoscopeViewControlsProvider } from '../Components/KaleidoscopeMaker/KaleidoscopeViewControlsContext';
import '../Components/KaleidoscopeMaker/KaleidoscopeMaker.css';

const CHROME_SHOW_MS = 3000;
const SHOP_TITLE = "anya's kaleidoscope shop";

function KaleidoscopeMakerArtFullscreen() {
    const [viewingKaleidoscope, setViewingKaleidoscope] = useState(false);
    const [makerScreen, setMakerScreen] = useState('home');
    const [chromeTitle, setChromeTitle] = useState(SHOP_TITLE);
    const [chromeBack, setChromeBack] = useState(null);
    const [chromeForward, setChromeForward] = useState(null);
    const [chromeVisible, setChromeVisible] = useState(true);
    const hideTimerRef = useRef(null);
    const hoveringChromeRef = useRef(false);

    /* Store { handler, tip }; wrap so function handlers aren't treated as setState updaters. */
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

    const clearHideTimer = useCallback(() => {
        if (hideTimerRef.current != null) {
            clearTimeout(hideTimerRef.current);
            hideTimerRef.current = null;
        }
    }, []);

    const scheduleChromeHide = useCallback(() => {
        clearHideTimer();
        hideTimerRef.current = setTimeout(() => {
            if (!hoveringChromeRef.current) setChromeVisible(false);
        }, CHROME_SHOW_MS);
    }, [clearHideTimer]);

    useEffect(() => {
        if (viewingKaleidoscope) {
            setChromeVisible(true);
            hoveringChromeRef.current = false;
            scheduleChromeHide();
        } else {
            clearHideTimer();
            setChromeVisible(true);
            hoveringChromeRef.current = false;
        }
        return clearHideTimer;
    }, [viewingKaleidoscope, scheduleChromeHide, clearHideTimer]);

    const onChromeEnter = useCallback(() => {
        if (!viewingKaleidoscope) return;
        hoveringChromeRef.current = true;
        clearHideTimer();
        setChromeVisible(true);
    }, [viewingKaleidoscope, clearHideTimer]);

    const onChromeLeave = useCallback(() => {
        if (!viewingKaleidoscope) return;
        hoveringChromeRef.current = false;
        /* Brief delay so moving between the title and the back/shake buttons doesn't flicker. */
        clearHideTimer();
        hideTimerRef.current = setTimeout(() => {
            if (!hoveringChromeRef.current) setChromeVisible(false);
        }, 120);
    }, [viewingKaleidoscope, clearHideTimer]);

    const isHomeScreen = !viewingKaleidoscope && makerScreen === 'home';

    const rootClass = [
        'km-art-fullscreen',
        isHomeScreen ? 'km-art-fullscreen--home-screen' : '',
        !viewingKaleidoscope && makerScreen !== 'kaleidoscope' && makerScreen !== 'home'
            ? 'km-art-fullscreen--title-lowered'
            : '',
        viewingKaleidoscope ? 'km-art-fullscreen--immersive' : '',
        viewingKaleidoscope && chromeVisible ? 'km-art-fullscreen--chrome-visible' : '',
    ]
        .filter(Boolean)
        .join(' ');

    const header = (
                <header
                    className={[
                        'km-art-fullscreen__header',
                        viewingKaleidoscope ? 'km-art-fullscreen__header--view-chrome kaleidoscope-maker__view-chrome-heading' : '',
                    ]
                        .filter(Boolean)
                        .join(' ')}
                    onMouseEnter={onChromeEnter}
                    onMouseLeave={onChromeLeave}
                >
                    <ChromeTitlePlaque className="km-art-fullscreen__title-plaque">
                    <div className="km-art-fullscreen__title-row">
                        <div className="km-art-fullscreen__title-nav km-art-fullscreen__title-nav--back">
                            {chromeBack ? (
                                <BackButton
                                    inTitle
                                    onClick={chromeBack.handler}
                                    tip={chromeBack.tip}
                                />
                            ) : null}
                        </div>
                        <h1 className="km-art-fullscreen__title">{chromeTitle}</h1>
                        <div className="km-art-fullscreen__title-nav km-art-fullscreen__title-nav--forward">
                            {chromeForward ? (
                                <ForwardButton
                                    inTitle
                                    onClick={chromeForward.handler}
                                    tip={chromeForward.tip}
                                />
                            ) : null}
                        </div>
                    </div>
                    <Link to="/about" className="km-art-fullscreen__wip km-art-fullscreen__wip-link">
                        by anya mind
                    </Link>
                </ChromeTitlePlaque>
                    {viewingKaleidoscope ? <KaleidoscopeViewChrome /> : null}
            </header>
    );

    const body = (
            <div className="km-art-fullscreen__body">
                <KaleidoscopeMaker
                    fullscreen
                    onScreenChange={setViewingKaleidoscope}
                    onMakerScreenChange={setMakerScreen}
                    onChromeBackChange={onChromeBackChange}
                    onChromeForwardChange={onChromeForwardChange}
                    onChromeTitleChange={onChromeTitleChange}
                    chromeVisible={chromeVisible}
                    onChromeEnter={onChromeEnter}
                    onChromeLeave={onChromeLeave}
                />
            </div>
    );

    return (
        <KaleidoscopeViewControlsProvider immersiveChrome={viewingKaleidoscope}>
            <div className={rootClass}>
                {viewingKaleidoscope ? (
                    <div
                        className="km-art-fullscreen__chrome-hotzone"
                        onMouseEnter={onChromeEnter}
                        onMouseLeave={onChromeLeave}
                        onTouchStart={onChromeEnter}
                        aria-hidden
                    />
                ) : null}
                <div
                    className={[
                        'km-art-fullscreen__chrome-stack',
                        isHomeScreen ? 'km-art-fullscreen__home-stack' : '',
                    ]
                        .filter(Boolean)
                        .join(' ')}
                >
                    {header}
                    {body}
                </div>
            </div>
        </KaleidoscopeViewControlsProvider>
    );
}

export default KaleidoscopeMakerArtFullscreen;
