// WorkBox.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import './Workbox.css'
import ZoomedModal from './ZoomedModal';

const WorkBox = ({ title, body, image, hoverImage, aspectRatio, opacityEffect, link }) => {

    const [isHovered, setIsHovered] = useState(false);
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [opacity, setOpacity] = useState(0);
    const [isZoomed, setIsZoomed] = useState(false);
    const [pointerType, setPointerType] = useState('default');
    const workBoxRef = useRef(null);
    const navigate = useNavigate();
    const calculateVisibility = useCallback(() => {

        if (opacityEffect === false) {
            setOpacity(1);
            return;
        }

        if(!workBoxRef.current){
            return;
        }
        const rect = workBoxRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const isVisible = rect.top < windowHeight && rect.bottom > 0;

        if (isVisible) {
            const totalHeight = rect.bottom - rect.top;
            const visiblePart = Math.min(totalHeight, (Math.min(windowHeight, rect.bottom) - Math.max(0, rect.top)) * 2);
            const visiblePercentage = visiblePart / totalHeight;
            setOpacity(visiblePercentage);
        } else {
            setOpacity(0);
        }
    }, [opacityEffect, workBoxRef]);

    const disableScroll = () => {
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth; // Calculate the scrollbar width
        document.body.style.paddingRight = `${scrollbarWidth}px`;
        disableBodyScroll(document);
    };

    const enableScroll = () => {
        document.body.style.paddingRight = '';
        enableBodyScroll(document);
    };

    const toggleZoom = () => {
        // if (opacityEffect === false) {
        //     setIsZoomed(!isZoomed);
        //     isZoomed ? enableScroll() : disableScroll();
        // }
    };

    useEffect(() => {
        if (opacityEffect === false) {
            setPointerType('default');
            setOpacity(1);
            return;
        }
        else {
            window.addEventListener('scroll', calculateVisibility);
            calculateVisibility();
            return () => window.removeEventListener('scroll', calculateVisibility);
        }

    }, [opacityEffect, calculateVisibility]);

    return (
        <div ref={workBoxRef} className='work-box' style={{ opacity: opacity }}>
            {isZoomed && <div className="scrollbar-overlay"></div>}
            <div className='work-box-content-container'
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        onClick={() => 
                            { if (link) {
                                    navigate(link);
                                }
                            }
                        }>
                <div className='work-title'>
                    <h1 className='work-header'>{" "}</h1>
                    <h1 className='work-header'>{" "}</h1>
                    <h1 className='work-header'>{title}</h1>
                    {body !== "" && <h3 className='work-body'>{body}</h3>}
                </div>
                <div className='work-image-container'
                     style = {{
                        aspectRatio: aspectRatio,
                        cursor: pointerType
                     }}>
                    <img 
                        className='work-image'
                        src={isHovered ? hoverImage : image}
                        alt=''
                    />
                </div>
                {false && (
                    <ZoomedModal
                        images={[image, hoverImage]}
                        textContent={
                            <div>
                                <h2>{title}</h2>
                                <p>{body}</p>
                            </div>
                        }
                        onClose={toggleZoom}
                    />
                )}
            </div>
        </div>
    );
};

export default WorkBox;
