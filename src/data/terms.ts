export interface TermsSection {
  id: string;
  title: string;
  content: string;
}

export const TERMS_SECTIONS: TermsSection[] = [
  {
    id: "acceptance",
    title: "Chấp nhận điều khoản",
    content: `Bằng việc truy cập và sử dụng website NiceHousing (bao gồm ứng dụng di động nếu có), bạn đồng ý tuân thủ các Điều khoản sử dụng này. Nếu bạn không đồng ý, vui lòng không sử dụng dịch vụ. Chúng tôi có quyền cập nhật điều khoản bất kỳ lúc nào; phiên bản hiện tại luôn được đăng trên trang này.`,
  },
  {
    id: "service",
    title: "Mô tả dịch vụ",
    content: `NiceHousing là nền tảng trung gian kết nối người dùng với các khách sạn, resort và chỗ lưu trú. Chúng tôi không sở hữu hoặc vận hành các cơ sở lưu trú mà chỉ cung cấp công cụ tìm kiếm, so sánh giá và đặt phòng. Hợp đồng đặt phòng thực chất được tạo giữa bạn và đơn vị cung cấp chỗ ở; NiceHousing chịu trách nhiệm trong phạm vi nền tảng và chính sách của mình.`,
  },
  {
    id: "booking",
    title: "Đặt phòng và thanh toán",
    content: `Khi đặt phòng, bạn cam kết cung cấp thông tin chính xác và đủ. Giá hiển thị đã bao gồm thuế và phí theo quy định trừ khi có ghi chú khác. Thanh toán được thực hiện qua cổng an toàn; bạn chịu trách nhiệm đảm bảo tài khoản/thẻ có đủ số dư. Chính sách hủy phòng, hoàn tiền áp dụng theo từng khách sạn và được hiển thị trước khi xác nhận đặt phòng.`,
  },
  {
    id: "account",
    title: "Tài khoản người dùng",
    content: `Bạn có thể đăng ký tài khoản để lưu thông tin, xem lịch sử đặt phòng và nhận ưu đãi. Bạn chịu trách nhiệm bảo mật mật khẩu và mọi hoạt động diễn ra qua tài khoản của mình. NiceHousing không yêu cầu mật khẩu qua email hoặc điện thoại; hãy cảnh giác với lừa đảo. Chúng tôi có quyền vô hiệu hóa tài khoản nếu vi phạm điều khoản hoặc pháp luật.`,
  },
  {
    id: "conduct",
    title: "Hành vi sử dụng",
    content: `Bạn không được: sử dụng dịch vụ cho mục đích bất hợp pháp hoặc vi phạm quyền của bên thứ ba; đăng nội dung sai lệch, xúc phạm hoặc spam; can thiệp hệ thống, crawl dữ liệu trái phép hoặc tạo tài khoản giả; đặt phòng giả để chiếm ưu đãi hoặc gây thiệt hại cho khách sạn. Vi phạm có thể dẫn đến chặn truy cập và/hoặc truy cứu pháp lý.`,
  },
  {
    id: "liability",
    title: "Giới hạn trách nhiệm",
    content: `NiceHousing nỗ lực đảm bảo thông tin trên nền tảng chính xác nhưng không bảo đảm hoàn toàn do dữ liệu do đối tác cung cấp. Trong phạm vi pháp luật cho phép, chúng tôi không chịu trách nhiệm gián tiếp, thiệt hại do gián đoạn dịch vụ, lỗi kỹ thuật hoặc hành vi của khách sạn/bên thứ ba. Trách nhiệm tối đa của NiceHousing trong mỗi giao dịch có thể bị giới hạn theo quy định áp dụng.`,
  },
  {
    id: "contact",
    title: "Liên hệ",
    content: `Mọi thắc mắc về Điều khoản sử dụng hoặc dịch vụ, vui lòng liên hệ: Email: support@nicehousing.vn | Hotline: 1900 xxxx (giờ hành chính). Chúng tôi sẽ phản hồi trong thời gian sớm nhất.`,
  },
];
