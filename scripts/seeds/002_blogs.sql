-- Seed blog posts for NiceHousing
-- Run: node scripts/run-seeds.js
-- Idempotent: ON CONFLICT (slug) DO UPDATE

INSERT INTO blog_posts (slug, title, excerpt, date, image, author, category, content) VALUES
(
  'top-10-resort-bien-dep-nhat-viet-nam-2026',
  'Top 10 resort biển đẹp nhất Việt Nam 2026',
  'Khám phá những bãi biển tuyệt đẹp và resort đẳng cấp từ Bắc vào Nam, phù hợp cho kỳ nghỉ dưỡng đáng nhớ.',
  '2026-02-20',
  'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80',
  'NiceHousing',
  'Khám phá',
  E'Việt Nam sở hữu bờ biển dài hơn 3.260km với vô vàn bãi cát trắng, làn nước trong xanh. Dưới đây là 10 resort biển được đánh giá cao nhất năm 2026.\n\n**1. Vinpearl Luxury Nha Trang** – Nằm trên đảo Hòn Tre, resort mang đến không gian riêng tư với hồ bơi vô cực và spa trên mặt nước.\n\n**2. InterContinental Đà Nẵng** – Thiết kế bởi Bill Bensley, khu nghỉ dưỡng huyền thoại với bãi biển riêng và nhà hàng La Maison 1888.\n\n**3. Six Senses Ninh Van Bay** – Ẩn mình trong vịnh Ninh Vân, mỗi villa có bể bơi riêng và view biển tuyệt đẹp.\n\n**4. Amanoi** – Nằm trong Vườn quốc gia Núi Chúa, không gian tĩnh lặng với kiến trúc tối giản đẳng cấp.\n\n**5. The Anam Cam Ranh** – Phong cách Indochine, bãi biển dài với dịch vụ 5 sao chuẩn quốc tế.\n\nCòn 5 resort nữa trong danh sách sẽ được cập nhật trong bài viết tiếp theo. Hãy đặt phòng sớm để nhận ưu đãi từ NiceHousing!'
),
(
  'huong-dan-dat-phong-online-an-toan',
  'Hướng dẫn đặt phòng online an toàn',
  '5 bước đơn giản giúp bạn đặt phòng khách sạn trực tuyến an toàn, tránh lừa đảo và nhận được giá tốt nhất.',
  '2026-02-18',
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
  'NiceHousing',
  'Mẹo hay',
  E'Đặt phòng online ngày càng phổ biến nhưng cần cẩn trọng để tránh rủi ro. Dưới đây là hướng dẫn chi tiết.\n\n**Bước 1: Chọn nền tảng uy tín** – Ưu tiên các trang có xác minh đối tác, chính sách hoàn tiền rõ ràng như NiceHousing.\n\n**Bước 2: Kiểm tra đánh giá** – Đọc review từ khách thật, chú ý điểm rating và nội dung phản hồi gần nhất.\n\n**Bước 3: So sánh giá** – Dùng mã giảm giá, đặt sớm hoặc vào mùa thấp điểm để có giá tốt.\n\n**Bước 4: Xác nhận thông tin** – Sau khi đặt, kiểm tra email xác nhận: tên khách sạn, ngày nhận/trả phòng, số tiền.\n\n**Bước 5: Lưu mã đặt phòng** – Giữ mã đặt phòng và thông tin liên hệ khách sạn để đối chiếu khi nhận phòng.\n\nChúc bạn có chuyến đi an toàn và vui vẻ!'
),
(
  'xu-huong-du-lich-nghi-duong-viet-nam-2026',
  'Xu hướng du lịch nghỉ dưỡng Việt Nam 2026',
  'Du lịch bền vững, staycation và trải nghiệm địa phương đang là xu hướng được ưa chuộng.',
  '2026-02-15',
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80',
  'NiceHousing',
  'Xu hướng',
  E'Năm 2026, du khách Việt Nam và quốc tế có xu hướng tìm kiếm trải nghiệm nghỉ dưỡng ý nghĩa hơn.\n\n**Du lịch bền vững** – Nhiều resort đầu tư năng lượng xanh, giảm rác thải nhựa và hỗ trợ cộng đồng địa phương.\n\n**Staycation** – Nghỉ dưỡng tại khách sạn trong nước, kết hợp làm việc từ xa (workation) ngày càng phổ biến.\n\n**Trải nghiệm địa phương** – Du khách muốn học nấu ăn, tham quan làng nghề, gặp gỡ người dân thay vì chỉ nằm bể bơi.\n\n**Wellness & Spa** – Các gói chăm sóc sức khỏe, yoga, thiền được đặt nhiều hơn sau giai đoạn bận rộn.\n\nNiceHousing sẽ tiếp tục cập nhật danh sách khách sạn và gói ưu đãi phù hợp từng xu hướng.'
),
(
  'khach-san-5-sao-gia-tot-ha-noi-da-nang',
  'Khách sạn 5 sao giá tốt: Hà Nội & Đà Nẵng',
  'Gợi ý những khách sạn hạng sang với mức giá hợp lý tại hai thành phố du lịch hàng đầu.',
  '2026-02-10',
  'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80',
  'NiceHousing',
  'Gợi ý',
  E'Bạn muốn trải nghiệm 5 sao nhưng ngân sách có hạn? Dưới đây là lựa chọn cân bằng giữa chất lượng và giá cả.\n\n**Hà Nội:** Sofitel Legend Metropole – biểu tượng lịch sử, thường có ưu đãi cuối tuần. Lotte Hotel Hanoi – view hồ Hoàn Kiếm, buffet sáng đa dạng.\n\n**Đà Nẵng:** InterContinental Danang Sun Peninsula – thiết kế độc đáo, phù hợp dịp đặc biệt. Mường Thanh Luxury – gần biển Mỹ Khê, giá mềm hơn so với mặt bằng 5 sao.\n\nĐăng ký nhận tin NiceHousing để nhận thông báo flash sale và mã giảm giá cho các khách sạn này.'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  date = EXCLUDED.date,
  image = EXCLUDED.image,
  author = EXCLUDED.author,
  category = EXCLUDED.category,
  content = EXCLUDED.content,
  updated_at = NOW();

-- 12 blog posts thêm
INSERT INTO blog_posts (slug, title, excerpt, date, image, author, category, content) VALUES
(
  'phu-quoc-nen-o-dau-het-can',
  'Phú Quốc nên ở đâu hết cạn?',
  'Gợi ý khu vực lưu trú từ Bãi Dài, Dương Đông đến Bãi Sao cho từng phong cách du lịch.',
  '2026-02-08',
  'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=800&q=80',
  'NiceHousing',
  'Gợi ý',
  E'Phú Quốc có nhiều bãi biển và khu vực nghỉ dưỡng. **Bãi Dài** – yên tĩnh, resort cao cấp. **Dương Đông** – gần chợ đêm, tiện ăn uống. **Bãi Sao** – nước trong, phù hợp gia đình. Đặt phòng sớm trên NiceHousing để có giá tốt.'
),
(
  'kinh-nghiem-du-lich-sapa-mua-lanh',
  'Kinh nghiệm du lịch Sapa mùa lạnh',
  'Chuẩn bị trang phục, lịch trình và đặt homestay view núi để tận hưởng Sapa đúng điệu.',
  '2026-02-05',
  'https://images.unsplash.com/photo-1528127260-dc66d52bef19?w=800&q=80',
  'NiceHousing',
  'Khám phá',
  E'Sapa mùa lạnh đẹp nhất từ tháng 12 đến tháng 2. Mang theo áo ấm, giày chống trơn. Nên đặt homestay gần Fansipan hoặc bản Tả Van. NiceHousing gợi ý nhiều homestay view núi giá tốt.'
),
(
  'uu-dai-thang-2-khach-san-resort',
  'Ưu đãi tháng 2: Khách sạn & resort',
  'Tổng hợp mã giảm giá và gói nghỉ dưỡng tháng 2 từ các đối tác NiceHousing.',
  '2026-02-03',
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
  'NiceHousing',
  'Mẹo hay',
  E'Tháng 2 nhiều khách sạn ra mắt ưu đãi đầu năm. Giảm đến 20% khi đặt trước 7 ngày. Áp dụng tại Nha Trang, Đà Nẵng, Phú Quốc. Theo dõi trang Khuyến mãi trên NiceHousing.'
),
(
  'homestay-vung-tau-view-bien',
  'Homestay Vũng Tàu view biển giá rẻ',
  '5 homestay gần biển tại Vũng Tàu phù hợp nhóm bạn và gia đình, giá từ 500k/đêm.',
  '2026-02-01',
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80',
  'NiceHousing',
  'Gợi ý',
  E'Vũng Tàu không chỉ có khách sạn lớn. Nhiều homestay view biển với giá 500–800k/đêm, gần Bãi Sau và Bãi Trước. Đặt qua NiceHousing được xác nhận nhanh và hỗ trợ đổi lịch.'
),
(
  'can-ho-dich-vu-ha-noi-cho-nguoi-di-cong-tac',
  'Căn hộ dịch vụ Hà Nội cho người đi công tác',
  'Tiêu chí chọn căn hộ dịch vụ dài hạn: vị trí, wifi, bếp và chính sách hủy linh hoạt.',
  '2026-01-28',
  'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80',
  'NiceHousing',
  'Mẹo hay',
  E'Công tác dài ngày tại Hà Nội nên chọn căn hộ có bếp, máy giặt, gần metro hoặc văn phòng. NiceHousing có filter "Căn hộ dịch vụ" và "Cho thuê dài hạn" giúp bạn tìm nhanh.'
),
(
  'da-lat-mua-hoa-dao-thang-giang',
  'Đà Lạt mùa hoa đào tháng Giêng',
  'Lịch trình 2 ngày 1 đêm ngắm hoa đào và sống ảo tại Đà Lạt đầu năm.',
  '2026-01-25',
  'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80',
  'NiceHousing',
  'Khám phá',
  E'Tháng 1–2 Đà Lạt vào mùa hoa đào. Gợi ý route: Hồ Xuân Hương – Đồi chè Cầu Đất – Vườn hoa thành phố. Đặt khách sạn gần trung tâm để thuận tiện di chuyển.'
),
(
  'so-sanh-booking-truc-tuyen-va-dat-truc-tiep',
  'So sánh đặt phòng trực tuyến và đặt trực tiếp',
  'Ưu nhược điểm của đặt qua app so với gọi điện trực tiếp cho khách sạn.',
  '2026-01-22',
  'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80',
  'NiceHousing',
  'Mẹo hay',
  E'Đặt trực tuyến: dễ so sánh giá, có mã giảm giá, xác nhận ngay. Đặt trực tiếp: đôi khi giá đặc biệt cho khách quen. Nên so sánh cả hai và chọn kênh có lợi hơn.'
),
(
  'nha-trang-3-ngay-2-dem-tiet-kiem',
  'Nha Trang 3 ngày 2 đêm tiết kiệm',
  'Lịch ăn chơi và gợi ý chỗ ở phù hợp túi tiền cho chuyến Nha Trang ngắn ngày.',
  '2026-01-20',
  'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=80',
  'NiceHousing',
  'Gợi ý',
  E'Ngày 1: Vinpearl hoặc bãi biển. Ngày 2: Tour đảo hoặc lặn biển. Ngày 3: Chợ Đầm, mua đặc sản. Ở khách sạn 3–4 sao gần biển giá 800k–1,2tr/đêm trên NiceHousing.'
),
(
  'xu-huong-booking-nam-2026',
  'Xu hướng booking năm 2026',
  'Du khách ưu tiên thanh toán linh hoạt, hủy miễn phí và trải nghiệm địa phương.',
  '2026-01-18',
  'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80',
  'NiceHousing',
  'Xu hướng',
  E'Năm 2026 khách hàng đặt phòng quan tâm nhiều hơn đến chính sách hủy và thanh toán trả sau. Các nền tảng như NiceHousing đã bổ sung tùy chọn "Thanh toán tại chỗ" và "Hủy miễn phí trước 24h".'
),
(
  'resort-binh-an-phu-quoc',
  'Resort bình an tại Phú Quốc',
  'Những resort thiết kế hướng wellness, yoga và ẩm thực healthy tại Phú Quốc.',
  '2026-01-15',
  'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&q=80',
  'NiceHousing',
  'Khám phá',
  E'Phú Quốc không chỉ có biển và tour. Nhiều resort tập trung vào wellness: lớp yoga sáng, bữa ăn organic, spa. Tìm filter "Wellness" trên NiceHousing để xem danh sách.'
),
(
  'quy-tac-huy-phong-va-hoan-tien',
  'Quy tắc hủy phòng và hoàn tiền',
  'Hiểu rõ điều khoản hủy miễn phí, hoàn tiền một phần và trường hợp bất khả kháng.',
  '2026-01-12',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
  'NiceHousing',
  'Mẹo hay',
  E'Mỗi khách sạn có chính sách hủy khác nhau. Thường hủy miễn phí trước 24–48h. Hủy gần ngày có thể mất phí hoặc không hoàn tiền. Đọc kỹ điều khoản khi đặt trên NiceHousing.'
),
(
  'hoi-an-1-ngay-di-gi-cho-het',
  'Hội An 1 ngày đi gì cho hết',
  'Lịch trình gợi ý từ sáng đến tối: phố cổ, làng rau, biển An Bàng và ẩm thực.',
  '2026-01-10',
  'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&q=80',
  'NiceHousing',
  'Gợi ý',
  E'Sáng: Phố cổ, Chùa Cầu. Trưa: Cao lầu, bánh mì Phượng. Chiều: Làng rau Trà Quế hoặc biển An Bàng. Tối: Đèn lồng, chè bắp. Đặt khách sạn gần phố cổ để đi bộ.'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  date = EXCLUDED.date,
  image = EXCLUDED.image,
  author = EXCLUDED.author,
  category = EXCLUDED.category,
  content = EXCLUDED.content,
  updated_at = NOW();
