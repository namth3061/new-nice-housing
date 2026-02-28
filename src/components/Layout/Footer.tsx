import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useRouter } from 'next/navigation';

interface FooterProps {
    goList: () => void;
    showToast: (msg: React.ReactNode) => void;
}

export const Footer: React.FC<FooterProps> = ({ goList, showToast }) => {
    const { t, language } = useLanguage();
    const router = useRouter();
    const [settings, setSettings] = useState<any>(null);

    useEffect(() => {
        fetch('/api/settings')
            .then(res => res.json())
            .then(data => {
                if (data && !data.error) setSettings(data);
            })
            .catch(console.error);
    }, []);

    const address = language === 'en'
        ? (settings?.address_value_en || t('footer.address_value'))
        : (settings?.address_value_vi || t('footer.address_value'));
    const phone = settings?.phone_value || t('footer.phone_value');
    const email = settings?.email_value || t('footer.email_value');
    const domain = settings?.domain_value || t('footer.domain_value');

    return (
        <footer>
            <div className="footer-grid">
                <div>
                    <div className="footer-logo" style={{ marginBottom: '16px' }}>
                        <img src="/logo.png" alt="Nine Housing" style={{ height: '48px', width: 'auto' }} />
                    </div>
                    <div className="footer-desc">{t('footer.desc')}</div>
                </div>
                <div className="footer-col">
                    <h5>{t('home.discover')}</h5>
                    <a onClick={() => router.push('/apartment')}>{t('home.luxury_apartments')}</a>
                    <a onClick={() => router.push('/apartment')}>{t('home.premium_condos')}</a>
                    <a onClick={() => router.push('/apartment')}>{t('home.homestay')}</a>
                </div>
                <div className="footer-col">
                    <h5>{t('home.support')}</h5>
                    <a onClick={() => showToast(<span><i className="fa-solid fa-screwdriver-wrench"></i> {t('common.maintenance')}</span>)}>{t('home.help_center')}</a>
                    <a onClick={() => showToast(<span><i className="fa-solid fa-shield-halved"></i> {t('common.secure_payment')}</span>)}>{t('common.secure_payment')}</a>
                </div>
                <div className="footer-col" style={{ flex: 1.5, minWidth: '250px' }}>
                    <h5>{t('footer.contact_info')}</h5>
                    <p style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: 'var(--mid)', marginBottom: '8px', lineHeight: '1.4' }}>
                        <i className="fa-solid fa-location-dot" style={{ marginTop: '4px' }}></i>
                        <span><strong>{t('footer.address_label')}</strong> {address}</span>
                    </p>
                    <p style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--mid)', marginBottom: '8px' }}>
                        <i className="fa-solid fa-phone"></i>
                        <span><strong>{t('footer.phone_label')}</strong> {phone}</span>
                    </p>
                    <p style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--mid)', marginBottom: '8px' }}>
                        <i className="fa-regular fa-envelope"></i>
                        <span><strong>{t('footer.email_label')}</strong> {email}</span>
                    </p>
                    <p style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--mid)', marginBottom: '8px' }}>
                        <i className="fa-solid fa-globe"></i>
                        <span><strong>{t('footer.domain_label')}</strong> {domain}</span>
                    </p>
                </div>
            </div>
            <div className="footer-bottom">
                <div className="footer-copy">{t('footer.copyright')}</div>
            </div>
        </footer>
    );
};
