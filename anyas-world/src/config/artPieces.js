import KikisLobbyGif from '../Icons/kikilobby.gif';
import LabyrinthGif from '../Icons/labyrinthFast.gif';
import AnyaTVGif from '../Icons/anyatv2.gif';
import SoapBraceletImage from '../Icons/thePassionOfSoapBracelet.jpg';
import BeastGif from '../Icons/beast.gif';
import ShadowPlayGif from '../Icons/shadowplay.gif';
import LawAndRage from '../Icons/lawAndRage.PNG';
import OgdenGif from '../Icons/ogden.gif';
import TetrafoldGif from '../Icons/tetrafold.gif';
import AtTheMallGif from '../Icons/atthemall.gif';
import SelfPromoImg from '../Icons/selfpromo.jpg';
import ThroughTheBlindsImg from '../Icons/peep.jpg';
import OnAWalkGif from '../Icons/onawalk.gif';
import SelfPortraitGif from '../Icons/selfportrait.gif';

/** Hover / “full” media for each grid piece (GIF or static). */
export const ART_PIECE_BY_SLUG = {
    'kikis-lobby': { media: KikisLobbyGif, alt: "kiki's lobby", title: "kiki's lobby" },
    labyrinth: { media: LabyrinthGif, alt: 'labyrinth', title: 'labyrinth' },
    'anya-tv': { media: AnyaTVGif, alt: 'ANYA.TV', title: 'ANYA.TV' },
    'soap-bracelet': {
        media: SoapBraceletImage,
        alt: 'the passion of soap bracelet',
        title: 'the passion of soap bracelet',
    },
    beast: { media: BeastGif, alt: 'beast', title: 'beast' },
    'shadow-play': { media: ShadowPlayGif, alt: 'shadow play', title: 'shadow play' },
    'law-and-rage': { media: LawAndRage, alt: 'law and rage', title: 'law and rage' },
    ogden: { media: OgdenGif, alt: 'ogden', title: 'ogden' },
    'scenes-from-home': { media: TetrafoldGif, alt: 'scenes from home', title: 'scenes from home' },
    'at-the-mall': { media: AtTheMallGif, alt: 'at the mall', title: 'at the mall' },
    'self-promo': { media: SelfPromoImg, alt: '#mybrand', title: '#mybrand' },
    'through-the-blinds': {
        media: ThroughTheBlindsImg,
        alt: 'through the blinds',
        title: 'through the blinds',
    },
    'on-a-walk': { media: OnAWalkGif, alt: 'on a walk', title: 'on a walk' },
    'self-portrait': { media: SelfPortraitGif, alt: 'self portrait', title: 'self portrait' },
};

/**
 * Carousel order — matches Art.jsx `workExamples` with filter “all” (column order).
 * `/art/kaleidoscope-maker` is omitted here so it does not appear on /art or in prev/next.
 */
export const ART_GALLERY_ROUTES = [
    '/art/mermaid-motel',
    '/art/piece/anya-tv',
    '/art/piece/soap-bracelet',
    '/art/piece/beast',
    '/art/piece/shadow-play',
    '/art/piece/self-portrait',
    '/art/piece/at-the-mall',
    '/art/piece/labyrinth',
    '/art/piece/kikis-lobby',
    '/art/piece/scenes-from-home',
    '/art/piece/law-and-rage',
    '/art/piece/ogden',
    '/art/piece/self-promo',
    '/art/piece/through-the-blinds',
    '/art/piece/on-a-walk',
];

export function resolveGalleryNeighbors(pathname) {
    const i = ART_GALLERY_ROUTES.findIndex(
        (route) => pathname === route || pathname.endsWith(route)
    );
    if (i < 0) {
        return { prev: null, next: null };
    }
    const n = ART_GALLERY_ROUTES.length;
    return {
        prev: ART_GALLERY_ROUTES[(i - 1 + n) % n],
        next: ART_GALLERY_ROUTES[(i + 1) % n],
    };
}
