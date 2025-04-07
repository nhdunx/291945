const mapping = {
  '%E8%BD%A6%E7%A5%A8%E7%A5%A8': ['vip+watch_vip'],
  'Locket': ['Gold']
};

var ua = $request.headers["User-Agent"] || $request.headers["user-agent"];
var obj = JSON.parse($response.body);
obj.Attention = "UP TO NỖI HÀ DỤNG";

// Thông tin thanh toán giả
var dunx = {
  is_sandbox: false,
  ownership_type: "PURCHASED",
  billing_issues_detected_at: null,
  period_type: "normal",
  expires_date: "2222-12-21T01:23:45Z",
  grace_period_expires_date: null,
  unsubscribe_detected_at: null,
  original_purchase_date: "1945-09-02T01:23:45Z",
  purchase_date: "1945-09-02T01:23:45Z",
  store: "app_store"
};

var titkok = {
  grace_period_expires_date: null,
  purchase_date: "1945-09-02T01:23:45Z",
  product_identifier: "com.dunx.premium.yearly",
  expires_date: "2222-12-21T01:23:45Z"
};

// Thêm thông tin giả lập IP từ Mỹ
obj.subscriber.country = "US";
obj.subscriber.location = {
  country_code: "US",
  region: "CA",
  city: "Los Angeles"
};
obj.subscriber.ip_address = "104.26.10.78"; // IP của Cloudflare US
obj.subscriber.locale = "en-US";

const match = Object.keys(mapping).find(e => ua.includes(e));

if (match) {
  let [e, s] = mapping[match];
  if (s) {
    titkok.product_identifier = s;
    obj.subscriber.subscriptions[s] = dunx;
  } else {
    obj.subscriber.subscriptions["com.dunx.premium.yearly"] = dunx;
  }

  // Đảm bảo quyền Gold luôn bật
  if (e === 'Gold') {
    obj.subscriber.entitlements['Gold'] = {
      ...titkok,
      feature_enabled: true,
      badge: "Locket Gold",
      is_active: true,
      valid: true,
      persistent: true
    };
  }

  obj.subscriber.entitlements[e] = titkok;

} else {
  obj.subscriber.subscriptions["com.dunx.premium.yearly"] = dunx;
  obj.subscriber.entitlements.pro = titkok;
}

$done({ body: JSON.stringify(obj) });
