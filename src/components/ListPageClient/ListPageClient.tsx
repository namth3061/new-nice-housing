"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "../Layout/Navbar";
import { Footer } from "../Layout/Footer";
import { ListView } from "../../views/ListView/ListView";
import { Hotel } from "../../types/hotel";
import { useLanguage } from "@/context/LanguageContext";

interface ListPageClientProps {
    basePath: string;
    hotels: Hotel[];
    total: number;
    totalPages: number;
    currentPage: number;
    initialFilters: { price: string[]; stars: number[]; amenities: string[]; province?: string };
}

export const ListPageClient: React.FC<ListPageClientProps> = ({ basePath, hotels, total, totalPages, currentPage, initialFilters }) => {
    const router = useRouter();
    const { t } = useLanguage();

    const goHome = () => router.push("/");
    const goList = () => router.push(basePath);
    const onBack = () => router.push("/");
    const onNavigateToDetails = (hotel: Hotel) => router.push(`${basePath}/${hotel.slug}`);

    const handleSearch = (filters: { price: string[]; stars: number[]; amenities: string[]; province?: string }) => {
        const params = new URLSearchParams();
        if (filters.price.length > 0) params.set("price", filters.price.join(","));
        if (filters.stars.length > 0) params.set("stars", filters.stars.join(","));
        if (filters.amenities.length > 0) params.set("amenities", filters.amenities.join(","));
        if (filters.province && filters.province.trim() !== "") params.set("province", filters.province.trim());
        params.set("page", "1");
        router.push(`${basePath}?${params.toString()}`);
    };

    const goToPage = (p: number) => {
        if (typeof window !== "undefined") {
            const currentUrl = new URL(window.location.href);
            currentUrl.searchParams.set("page", p.toString());
            router.push(currentUrl.pathname + currentUrl.search);
        }
    };

    return (
        <>
            <Navbar view="list" goHome={goHome} goList={goList} />
            <main className="list-page page-transition" style={{ minHeight: "80vh", display: "flex", flexDirection: "column" }}>
                <div style={{ flex: "1 0 auto", paddingLeft: "24px", paddingRight: "24px" }}>
                    <ListView
                        hotels={hotels}
                        loading={false}
                        onNavigateToDetails={onNavigateToDetails}
                        onBack={onBack}
                        totalCount={total}
                        initialFilters={initialFilters}
                        onSearch={handleSearch}
                    />
                </div>
                {totalPages > 1 && (
                    <nav className="pagination pagination-bottom" style={{ flex: "0 0 auto", marginTop: "32px", marginBottom: "48px", paddingTop: "24px", display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", flexWrap: "wrap", paddingLeft: "24px", paddingRight: "24px" }}>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                            <button
                                key={p}
                                type="button"
                                onClick={() => goToPage(p)}
                                style={{
                                    padding: "8px 12px",
                                    minWidth: "40px",
                                    border: p === currentPage ? "2px solid var(--gold, #F5D060)" : "1px solid #e2e8f0",
                                    borderRadius: "8px",
                                    background: p === currentPage ? "rgba(245,208,96,0.15)" : "#fff",
                                    cursor: "pointer",
                                    color: p === currentPage ? "#92670a" : "#475569",
                                    fontWeight: p === currentPage ? 700 : 600,
                                }}
                            >
                                {p}
                            </button>
                        ))}

                    </nav>
                )}
            </main>
            <Footer goList={goList} />
        </>
    );
};
