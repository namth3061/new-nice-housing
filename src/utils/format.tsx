import React from 'react';

export const renderStars = (count: number) => {
    return [...Array(5)].map((_, i) => (
        <i key={i} className={i < count ? "fa-solid fa-star" : "fa-regular fa-star"}></i>
    ));
};
