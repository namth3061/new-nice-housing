export interface PolicySection {
  id: string;
  title: string;
  content: string;
}

export const POLICY_SECTIONS: PolicySection[] = [
  {
    id: "intro",
    title: "Giới thiệu",
    content: `Chính sách này mô tả cách NineHousing thu thập, sử dụng và bảo vệ thông tin cá nhân của bạn khi sử dụng nền tảng đặt phòng khách sạn. Chúng tôi cam kết bảo mật thông tin và minh bạch trong mọi hoạt động xử lý dữ liệu.`,
  },
  {
    id: "collect",
    title: "Thông tin chúng tôi thu thập",
    content: `Chúng tôi có thể thu thập: (1) Thông tin bạn cung cấp: họ tên, email, số điện thoại, địa chỉ khi đặt phòng hoặc đăng ký tài khoản. (2) Thông tin thanh toán: thẻ tín dụng/ghi nợ được xử lý qua cổng thanh toán bảo mật, NineHousing không lưu trữ số thẻ đầy đủ. (3) Thông tin tự động: địa chỉ IP, loại thiết bị, trình duyệt khi bạn truy cập website để cải thiện trải nghiệm và bảo mật.`,
  },
  {
    id: "use",
    title: "Mục đích sử dụng",
    content: `Thông tin được sử dụng để: xử lý đặt phòng và gửi xác nhận; liên hệ hỗ trợ khách hàng; gửi thông tin khuyến mãi (nếu bạn đồng ý); cải thiện website và dịch vụ; tuân thủ quy định pháp luật. Chúng tôi không bán hoặc cho thuê dữ liệu cá nhân của bạn cho bên thứ ba vì mục đích marketing.`,
  },
  {
    id: "share",
    title: "Chia sẻ thông tin",
    content: `Chúng tôi có thể chia sẻ thông tin với: (1) Khách sạn/đối tác lưu trú để hoàn tất đặt phòng. (2) Đơn vị xử lý thanh toán để thực hiện giao dịch. (3) Cơ quan có thẩm quyền khi pháp luật yêu cầu. Các đối tác đều cam kết bảo mật theo chuẩn và chỉ sử dụng đúng mục đích.`,
  },
  {
    id: "security",
    title: "Bảo mật",
    content: `NineHousing áp dụng các biện pháp kỹ thuật và tổ chức phù hợp để bảo vệ dữ liệu: mã hóa kết nối (SSL/TLS), hạn chế quyền truy cập nội bộ, và cập nhật thường xuyên. Trong trường hợp sự cố rò rỉ dữ liệu có thể ảnh hưởng đến bạn, chúng tôi sẽ thông báo trong thời gian sớm nhất theo quy định.`,
  },
  {
    id: "rights",
    title: "Quyền của bạn",
    content: `Bạn có quyền: truy cập và xem dữ liệu cá nhân mà chúng tôi lưu trữ; yêu cầu chỉnh sửa hoặc xóa dữ liệu (trừ trường hợp pháp luật yêu cầu lưu giữ); rút lại đồng ý với marketing bất kỳ lúc nào; khiếu nại với cơ quan bảo vệ dữ liệu. Để thực hiện các quyền trên, vui lòng liên hệ qua email hoặc mục Liên hệ trên website.`,
  },
  {
    id: "update",
    title: "Cập nhật chính sách",
    content: `Chính sách này có thể được cập nhật theo thay đổi pháp luật hoặc hoạt động kinh doanh. Phiên bản mới sẽ được đăng trên trang này với ngày cập nhật. Việc bạn tiếp tục sử dụng dịch vụ sau khi đăng chính sách mới được coi là chấp nhận. Nếu có thay đổi quan trọng, chúng tôi có thể gửi thông báo qua email.`,
  },
];
