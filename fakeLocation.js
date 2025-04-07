// fakeLocation.js
const geoLocation = {
    "latitude": 37.7749,  // Thay đổi giá trị latitude theo vị trí bạn muốn (Ví dụ: San Francisco, USA)
    "longitude": -122.4194,  // Thay đổi giá trị longitude theo vị trí bạn muốn (Ví dụ: San Francisco, USA)
    "accuracy": 100  // Độ chính xác của vị trí (theo mét)
};

// Thêm GeoLocation vào headers của request
$addheader('X-Geo-Location', JSON.stringify(geoLocation));
$done();
