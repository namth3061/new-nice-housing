"use client";

import React from 'react';
import { LanguageProvider } from '../context/LanguageContext';
import { DynamicFavicon } from './DynamicFavicon';

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <LanguageProvider>
            <DynamicFavicon />
            {children}
        </LanguageProvider>
    );
}
