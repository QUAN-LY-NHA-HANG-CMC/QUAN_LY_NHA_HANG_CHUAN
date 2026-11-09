const { execSync } = require('child_process');
const ungDung = require('./ungDung');
const cauHinhChung = require('./cauHinh/cauHinhChung');

const CONG_MAC_DINH = cauHinhChung.congBackend || 3001;

/**
 * Tự động tìm và giải phóng cổng nếu bị tiến trình cũ chiếm dụng
 */
function giaiPhongCong(cong) {
    try {
        if (process.platform !== 'win32') {
            const pids = execSync(`lsof -ti :${cong} 2>/dev/null || true`).toString().trim().split('\n').filter(Boolean);
            for (const pidStr of pids) {
                const pid = parseInt(pidStr, 10);
                if (pid && pid !== process.pid) {
                    try {
                        process.kill(pid, 'SIGKILL');
                        console.log(`🧹 Đã tự động dọn dẹp tiến trình cũ (PID: ${pid}) chiếm cổng ${cong}`);
                    } catch {}
                }
            }
        }
    } catch {}
}

/**
 * Khởi động máy chủ có khả năng tự phục hồi khi trùng cổng
 */
function khoiDong(cong, daThuGiaiPhong = false) {
    const mayChu = ungDung.listen(cong, () => {
        console.log(`================================================================`);
        console.log(`🚀 Máy chủ Backend Quản Lý Nhà Hàng đang chạy tại:`);
        console.log(`👉 http://localhost:${cong}`);
        console.log(`👉 Kiểm tra hệ thống: http://localhost:${cong}/api/kiem-tra-he-thong`);
        console.log(`👉 Danh mục món: http://localhost:${cong}/api/danh-muc-mon`);
        console.log(`👉 Thực đơn món: http://localhost:${cong}/api/thuc-don`);
        console.log(`👉 Khu vực: http://localhost:${cong}/api/khu-vuc`);
        console.log(`👉 Bàn ăn & QR: http://localhost:${cong}/api/ban-an`);
        console.log(`👉 Nhân viên: http://localhost:${cong}/api/nhan-vien`);
        console.log(`👉 Cấu hình: http://localhost:${cong}/api/cau-hinh`);
        console.log(`================================================================`);
    });

    mayChu.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            if (!daThuGiaiPhong) {
                console.log(`⚠️ Cổng ${cong} đang bị tiến trình cũ chiếm dụng. Đang tự động giải phóng...`);
                giaiPhongCong(cong);
                setTimeout(() => {
                    khoiDong(cong, true);
                }, 400);
            } else {
                console.error(`\n❌ Cổng ${cong} vẫn bận sau khi giải phóng. Đang chuyển sang cổng phụ ${cong + 1}...`);
                khoiDong(cong + 1, false);
            }
        } else {
            console.error('❌ Lỗi khởi động máy chủ:', err);
            process.exit(1);
        }
    });

    return mayChu;
}

const mayChu = khoiDong(CONG_MAC_DINH);

module.exports = mayChu;
