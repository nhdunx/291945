const mapping = {
  '%E8%BD%A6%E7%A5%A8%E7%A5%A8': ['vip+watch_vip'],
  'Locket': ['Gold']
};

var ua = $request.headers["User-Agent"] || $request.headers["user-agent"];
var obj = JSON.parse($response.body);
obj.Attention = "UP TO NỖI HÀ DỤNG";

// Thông tin thanh toán ảo
var dunx = {
  is_sandbox: false,  // Đặt là false để mô phỏng giao dịch thật
  ownership_type: "PURCHASED",  // Giao dịch đã được mua
  billing_issues_detected_at: null,  // Không có vấn đề thanh toán
  period_type: "normal",  // Thời gian thuê bao bình thường
  expires_date: "2222-12-21T01:23:45Z",  // Đặt ngày hết hạn dài
  grace_period_expires_date: null,  // Không có thời gian gia hạn
  unsubscribe_detected_at: null,  // Không phát hiện hủy bỏ
  original_purchase_date: "1945-09-02T01:23:45Z",  // Ngày mua ban đầu là ngày Quốc Khánh 2/9/1945
  purchase_date: "1945-09-02T01:23:45Z",  // Ngày mua là ngày Quốc Khánh 2/9/1945
  store: "app_store"  // Địa chỉ cửa hàng (Apple App Store)
};

var titkok = {
  grace_period_expires_date: null,  // Không có thời gian gia hạn
  purchase_date: "1945-09-02T01:23:45Z",  // Ngày mua là ngày Quốc Khánh 2/9/1945
  product_identifier: "com.dunx.premium.yearly",  // Định danh sản phẩm cho thuê bao hàng năm
  expires_date: "2222-12-21T01:23:45Z"  // Ngày hết hạn dài
};

const match = Object.keys(mapping).find(e => ua.includes(e));

if (match) {
  let [e, s] = mapping[match];
  if (s) {
    titkok.product_identifier = s;
    obj.subscriber.subscriptions[s] = dunx;
  } else {
    obj.subscriber.subscriptions["com.dunx.premium.yearly"] = dunx;
  }

  // Cấp quyền Gold cho Locket nếu chưa cấp
  if (e === 'Gold' && !obj.subscriber.entitlements['Gold']) {
    obj.subscriber.entitlements['Gold'] = titkok;
  }

  // Bật tính năng "Huy Hiệu Locket Gold" và đảm bảo tính năng luôn bật
  if (e === 'Gold') {
    obj.subscriber.entitlements['Gold'].feature_enabled = true;  // Thêm flag hoặc cờ bật tính năng
    obj.subscriber.entitlements['Gold'].badge = "Locket Gold";  // Cập nhật thông tin thêm cho huy hiệu
    obj.subscriber.entitlements['Gold'].is_active = true;  // Đảm bảo tính năng hoạt động
    obj.subscriber.entitlements['Gold'].valid = true;  // Đảm bảo quyền là hợp lệ
  }

  // Xác nhận tính hợp lệ của quyền truy cập
  obj.subscriber.entitlements[e] = titkok;

} else {
  obj.subscriber.subscriptions["com.dunx.premium.yearly"] = dunx;
  obj.subscriber.entitlements.pro = titkok;
}

// Trả về phản hồi đã chỉnh sửa
$done({ body: JSON.stringify(obj) });
