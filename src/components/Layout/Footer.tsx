import React from 'react';

interface FooterProps {
    goList: () => void;
    showToast: (msg: React.ReactNode) => void;
}

export const Footer: React.FC<FooterProps> = ({ goList, showToast }) => {
    return (
        <footer>
            <div className="footer-grid">
                <div>
                    <div className="footer-logo">NiceHousing</div>
                    <div className="footer-desc">Nền tảng đặt phòng khách sạn hàng đầu Việt Nam. Kết nối bạn với hàng ngàn chỗ lưu trú.</div>
                </div>
                <div className="footer-col">
                    <h5>Khám phá</h5>
                    <a onClick={goList}>Khách sạn cao cấp</a>
                    <a onClick={goList}>Resort biển</a>
                    <a onClick={goList}>Homestay</a>
                </div>
                <div className="footer-col">
                    <h5>Hỗ trợ</h5>
                    <a onClick={() => showToast(<span><i className="fa-solid fa-screwdriver-wrench"></i> Đang bảo trì</span>)}>Trung tâm trợ giúp</a>
                    <a onClick={() => showToast(<span><i className="fa-solid fa-shield-halved"></i> Bảo mật 100%</span>)}>Bảo mật thanh toán</a>
                </div>
            </div>
            <div className="footer-bottom">
                <div className="footer-copy">© 2026 NiceHousing. Tất cả quyền được bảo lưu. 🇻🇳 Thương hiệu Việt Nam</div>
            </div>
        </footer>
    );
};
