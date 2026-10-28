const ungDung = require('./ungDung');
const cauHinhChung = require('./cauHinh/cauHinhChung');

const mayChu = ungDung.listen(cauHinhChung.congBackend, () => {
    console.log(`================================================================`);
    console.log(`🚀 Máy chủ Backend Quản Lý Nhà Hàng đang chạy tại:`);
    console.log(`👉 http://localhost:${cauHinhChung.congBackend}`);
    console.log(`👉 Kiểm tra hệ thống: http://localhost:${cauHinhChung.congBackend}/api/kiem-tra-he-thong`);
    console.log(`👉 Danh mục món: http://localhost:${cauHinhChung.congBackend}/api/danh-muc-mon`);
    console.log(`👉 Thực đơn món: http://localhost:${cauHinhChung.congBackend}/api/thuc-don`);
    console.log(`👉 Khu vực: http://localhost:${cauHinhChung.congBackend}/api/khu-vuc`);
    console.log(`👉 Bàn ăn & QR: http://localhost:${cauHinhChung.congBackend}/api/ban-an`);
    console.log(`👉 Nhân viên: http://localhost:${cauHinhChung.congBackend}/api/nhan-vien`);
    console.log(`================================================================`);
});

module.exports = mayChu;
