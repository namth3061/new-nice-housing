export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  image: string;
  author: string;
  category: string;
  content: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 1,
    slug: "top-10-resort-bien-dep-nhat-viet-nam-2026",
    title: "Top 10 resort biển đẹp nhất Việt Nam 2026",
    excerpt: "Khám phá những bãi biển tuyệt đẹp và resort đẳng cấp từ Bắc vào Nam, phù hợp cho kỳ nghỉ dưỡng đáng nhớ.",
    date: "2026-02-20",
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80",
    author: "NineHousing",
    category: "Khám phá",
    content: `Việt Nam sở hữu bờ biển dài hơn 3.260km với vô vàn bãi cát trắng, làn nước trong xanh. Dưới đây là 10 resort biển được đánh giá cao nhất năm 2026.

**1. Vinpearl Luxury Nha Trang** – Nằm trên đảo Hòn Tre, resort mang đến không gian riêng tư với hồ bơi vô cực và spa trên mặt nước.

**2. InterContinental Đà Nẵng** – Thiết kế bởi Bill Bensley, khu nghỉ dưỡng huyền thoại với bãi biển riêng và nhà hàng La Maison 1888.

**3. Six Senses Ninh Van Bay** – Ẩn mình trong vịnh Ninh Vân, mỗi villa có bể bơi riêng và view biển tuyệt đẹp.

**4. Amanoi** – Nằm trong Vườn quốc gia Núi Chúa, không gian tĩnh lặng với kiến trúc tối giản đẳng cấp.

**5. The Anam Cam Ranh** – Phong cách Indochine, bãi biển dài với dịch vụ 5 sao chuẩn quốc tế.

Còn 5 resort nữa trong danh sách sẽ được cập nhật trong bài viết tiếp theo. Hãy đặt phòng sớm để nhận ưu đãi từ NineHousing!`,
  },
  {
    id: 2,
    slug: "huong-dan-dat-phong-online-an-toan",
    title: "Hướng dẫn đặt phòng online an toàn",
    excerpt: "5 bước đơn giản giúp bạn đặt phòng khách sạn trực tuyến an toàn, tránh lừa đảo và nhận được giá tốt nhất.",
    date: "2026-02-18",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
    author: "NineHousing",
    category: "Mẹo hay",
    content: `Đặt phòng online ngày càng phổ biến nhưng cần cẩn trọng để tránh rủi ro. Dưới đây là hướng dẫn chi tiết.

**Bước 1: Chọn nền tảng uy tín** – Ưu tiên các trang có xác minh đối tác, chính sách hoàn tiền rõ ràng như NineHousing.

**Bước 2: Kiểm tra đánh giá** – Đọc review từ khách thật, chú ý điểm rating và nội dung phản hồi gần nhất.

**Bước 3: So sánh giá** – Dùng mã giảm giá, đặt sớm hoặc vào mùa thấp điểm để có giá tốt.

**Bước 4: Xác nhận thông tin** – Sau khi đặt, kiểm tra email xác nhận: tên khách sạn, ngày nhận/trả phòng, số tiền.

**Bước 5: Lưu mã đặt phòng** – Giữ mã đặt phòng và thông tin liên hệ khách sạn để đối chiếu khi nhận phòng.

Chúc bạn có chuyến đi an toàn và vui vẻ!`,
  },
  {
    id: 3,
    slug: "xu-huong-du-lich-nghi-duong-viet-nam-2026",
    title: "Xu hướng du lịch nghỉ dưỡng Việt Nam 2026",
    excerpt: "Du lịch bền vững, staycation và trải nghiệm địa phương đang là xu hướng được ưa chuộng.",
    date: "2026-02-15",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
    author: "NineHousing",
    category: "Xu hướng",
    content: `Năm 2026, du khách Việt Nam và quốc tế có xu hướng tìm kiếm trải nghiệm nghỉ dưỡng ý nghĩa hơn.

**Du lịch bền vững** – Nhiều resort đầu tư năng lượng xanh, giảm rác thải nhựa và hỗ trợ cộng đồng địa phương.

**Staycation** – Nghỉ dưỡng tại khách sạn trong nước, kết hợp làm việc từ xa (workation) ngày càng phổ biến.

**Trải nghiệm địa phương** – Du khách muốn học nấu ăn, tham quan làng nghề, gặp gỡ người dân thay vì chỉ nằm bể bơi.

**Wellness & Spa** – Các gói chăm sóc sức khỏe, yoga, thiền được đặt nhiều hơn sau giai đoạn bận rộn.

NineHousing sẽ tiếp tục cập nhật danh sách khách sạn và gói ưu đãi phù hợp từng xu hướng.`,
  },
  {
    id: 4,
    slug: "khach-san-5-sao-gia-tot-ha-noi-da-nang",
    title: "Khách sạn 5 sao giá tốt: Hà Nội & Đà Nẵng",
    excerpt: "Gợi ý những khách sạn hạng sang với mức giá hợp lý tại hai thành phố du lịch hàng đầu.",
    date: "2026-02-10",
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80",
    author: "NineHousing",
    category: "Gợi ý",
    content: `Bạn muốn trải nghiệm 5 sao nhưng ngân sách có hạn? Dưới đây là lựa chọn cân bằng giữa chất lượng và giá cả.

**Hà Nội:** Sofitel Legend Metropole – biểu tượng lịch sử, thường có ưu đãi cuối tuần. Lotte Hotel Hanoi – view hồ Hoàn Kiếm, buffet sáng đa dạng.

**Đà Nẵng:** InterContinental Danang Sun Peninsula – thiết kế độc đáo, phù hợp dịp đặc biệt. Mường Thanh Luxury – gần biển Mỹ Khê, giá mềm hơn so với mặt bằng 5 sao.

Đăng ký nhận tin NineHousing để nhận thông báo flash sale và mã giảm giá cho các khách sạn này.`,
  },
];
