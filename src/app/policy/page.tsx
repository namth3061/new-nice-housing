"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "../../components/Layout/Navbar";
import { Footer } from "../../components/Layout/Footer";
import { POLICY_SECTIONS } from "../../data/policy";
import { useLanguage } from "@/context/LanguageContext";

export default function PolicyPage() {
  const router = useRouter();
  const { t } = useLanguage();

  return (
    <>
      <Navbar />
      <main className="list-page page-transition" style={{ minHeight: "80vh" }}>
        <div className="section-header" style={{ marginBottom: "40px" }}>
          <div>
            <div className="section-eyebrow"><i className="fa-solid fa-shield-halved"></i> {t("policy.eyebrow")}</div>
            <h1 className="section-title">{t("policy.title")}</h1>
          </div>
        </div>

        <div style={{ maxWidth: "760px" }}>
          {POLICY_SECTIONS.map((section) => (
            <section key={section.id} style={{ marginBottom: "40px" }}>
              <h2 style={{ fontFamily: "Playfair Display", fontSize: "22px", fontWeight: 700, color: "var(--black)", marginBottom: "12px", borderBottom: "1px solid var(--border)", paddingBottom: "8px" }}>
                {section.title}
              </h2>
              <p style={{ color: "var(--charcoal)", lineHeight: 1.8, fontSize: "15px", whiteSpace: "pre-line" }}>
                {section.content}
              </p>
            </section>
          ))}
        </div>
      </main>
      <Footer goList={() => router.push("/apartment")} />
    </>
  );
}
