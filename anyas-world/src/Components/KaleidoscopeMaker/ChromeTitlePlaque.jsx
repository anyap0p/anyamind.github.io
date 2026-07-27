import React from 'react';

import { ScallopedPlaque } from './ScallopedPlaque';



/** Cream scalloped plaque behind page chrome titles. */

export function ChromeTitlePlaque({ className = '', scallopRadius = 9, children }) {

    return (

        <ScallopedPlaque

            scallopRadius={scallopRadius}

            className={['kaleidoscope-maker__chrome-title-plaque', className].filter(Boolean).join(' ')}

        >

            {children}

        </ScallopedPlaque>

    );

}

