const mapping = {
  'Locket': ['Gold'], // Chắc chắn rằng đây là 'Gold' trong mapping
  'iPad': ['Gold']
};

var ua = $request.headers["User-Agent"] || $request.headers["user-agent"],
    obj = JSON.parse($response.body);

obj.Attention = "UP TO NỖI HÀ DỤNG";

var dunx = {
  is_sandbox: false,
  ownership_type: "PURCHASED",
  billing_issues_detected_at: null,
  period_type: "normal",
  expires_date: "2222-12-21T01:23:45Z",
  grace_period_expires_date: null,
  unsubscribe_detected_at: null,
  original_purchase_date: "1945-09-02T14:00:00Z",
  purchase_date: "1945-09-02T14:00:00Z",
  store: "app_store"
};

var titkok = {
  grace_period_expires_date: null,
  purchase_date: "1945-09-02T14:00:00Z",
  product_identifier: "Gold", // Đảm bảo rằng sản phẩm là "Gold"
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
  obj.subscriber.entitlements[e] = titkok;

  obj.subscriber.features = [
    "gold_badge", // Đây là huy hiệu "Locket Gold"
    "premium_ui",
    "priority_access",
    "video_record_10s"
  ];

  obj.subscriber.video_recording_duration = 10;
  obj.settings = obj.settings || {};
  obj.settings.video_duration_limit = 10;

  obj.subscriber.entitlements["Video10s"] = {
    ...titkok,
    is_video_10s_enabled: true
  };
} else {
  obj.subscriber.subscriptions["com.dunx.premium.yearly"] = dunx;
  obj.subscriber.entitlements.pro = titkok;
}

$done({ body: JSON.stringify(obj) });
