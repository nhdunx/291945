const mapping = {
  '%E8%BD%A6%E7%A5%A8%E7%A5%A8': ['vip+watch_vip'],
  'Locket': ['Gold']
};

var ua = $request.headers["User-Agent"] || $request.headers["user-agent"];
var obj = JSON.parse($response.body);
obj.Attention = "UP TO NỖI HÀ DỤNG";

// Thông tin thanh toán ảo
var dunx = {
  is_sandbox: false,
  ownership_type: "PURCHASED",
  billing_issues_detected_at: null,
  period_type: "normal",
  expires_date: "2222-12-21T01:23:45Z",
  grace_period_expires_date: null,
  unsubscribe_detected_at: null,
  original_purchase_date: "1945-09-02T01:23:45Z",  // Ngày Quốc Khánh 2/9/1945
  purchase_date: "1945-09-02T01:23:45Z",  // Ngày Quốc Khánh 2/9/1945
  store: "app_store"
};

var titkok = {
  grace_period_expires_date: null,
  purchase_date: "1945-09-02T01:23:45Z",
  product_identifier: "com.dunx.premium.yearly",
  expires_date: "2222-12-21T01:23:45Z"
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

  // Đảm bảo tính năng Locket Gold luôn bật
  if (e === 'Gold') {
    obj.subscriber.entitlements['Gold'].feature_enabled = true;
    obj.subscriber.entitlements['Gold'].badge = "Locket Gold";
    obj.subscriber.entitlements['Gold'].is_active = true;
    obj.subscriber.entitlements['Gold'].valid = true;

    // Lưu lại quyền để tránh bị mất
    if (!obj.subscriber.entitlements['Gold'].hasOwnProperty('persistent')) {
      obj.subscriber.entitlements['Gold'].persistent = true;  // Cờ để lưu quyền bền vững
    }
  }

  // Xác nhận quyền truy cập cho Locket Gold
  obj.subscriber.entitlements[e] = titkok;

} else {
  obj.subscriber.subscriptions["com.dunx.premium.yearly"] = dunx;
  obj.subscriber.entitlements.pro = titkok;
}

// Trả về phản hồi đã chỉnh sửa
$done({ body: JSON.stringify(obj) });
