const mapping = {
  '%E8%BD%A6%E7%A5%A8%E7%A5%A8': ['vip+watch_vip'],
  'Locket': ['Gold']
};

var ua=$request.headers["User-Agent"]||$request.headers["user-agent"],obj=JSON.parse($response.body);obj.Attention="UP TO NỖI HÀ DỤNG";var dunx={is_sandbox:!1,ownership_type:"PURCHASED",billing_issues_detected_at:null,period_type:"normal",expires_date:"2222-12-21T01:23:45Z",grace_period_expires_date:null,unsubscribe_detected_at:null,original_purchase_date:"2004-12-21T01:23:45Z",purchase_date:"2004-12-21T01:23:45Z",store:"app_store"},titkok={grace_period_expires_date:null,purchase_date:"2004-12-21T01:23:45Z",product_identifier:"com.dunx.premium.yearly",expires_date:"2222-12-21T01:23:45Z"};const match=Object.keys(mapping).find(e=>ua.includes(e));if(match){let[e,s]=mapping[match];s?(titkok.product_identifier=s,obj.subscriber.subscriptions[s]=dunx):obj.subscriber.subscriptions["com.dunx.premium.yearly"]=dunx,obj.subscriber.entitlements[e]=titkok}else obj.subscriber.subscriptions["com.dunx.premium.yearly"]=dunx,obj.subscriber.entitlements.pro=titkok;$done({body:JSON.stringify(obj)});
