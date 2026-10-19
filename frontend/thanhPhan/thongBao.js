/**
 * HỆ THỐNG THÔNG BÁO NỔI TOAST (thongBao.js)
 * Cung cấp thông báo mượt mà cho các hành động người dùng: Thành công, Thất bại, Cảnh báo
 */

class HeThongThongBao {
    constructor() {
        this.container = null;
        this.khoiTao();
    }

    khoiTao() {
        if (typeof document === 'undefined') return;
        let c = document.getElementById('khung-thong-bao-toast');
        if (!c) {
            c = document.createElement('div');
            c.id = 'khung-thong-bao-toast';
            c.className = 'khung-thong-bao-toast';
            document.body.appendChild(c);
        }
        this.container = c;
    }

    hienThi(loai, tieuDe, noiDung, thoiGian = 3500) {
        if (!this.container) this.khoiTao();

        const toast = document.createElement('div');
        toast.className = `the-thong-bao the-${loai}`;

        const bieuTuong = {
            thanhCong: '✔',
            thatBai: '✖',
            canhBao: '⚠',
            thongTin: 'ℹ'
        }[loai] || 'ℹ';

        toast.innerHTML = `
            <div class="bieu-tuong-thong-bao">${bieuTuong}</div>
            <div class="noi-dung-thong-bao">
                <div class="tieu-de-thong-bao">${window.DinhDang ? window.DinhDang.thoatHtml(tieuDe) : tieuDe}</div>
                ${noiDung ? `<div class="chi-tiet-thong-bao">${window.DinhDang ? window.DinhDang.thoatHtml(noiDung) : noiDung}</div>` : ''}
            </div>
            <button class="nut-dong-thong-bao" onclick="this.parentElement.remove()">✕</button>
        `;

        this.container.appendChild(toast);

        // Hiệu ứng xuất hiện
        setTimeout(() => toast.classList.add('hien-thi'), 10);

        // Tự động đóng
        setTimeout(() => {
            toast.classList.remove('hien-thi');
            setTimeout(() => toast.remove(), 300);
        }, thoiGian);
    }

    thanhCong(tieuDe, noiDung = '') {
        this.hienThi('thanhCong', tieuDe, noiDung);
    }

    thatBai(tieuDe, noiDung = '') {
        this.hienThi('thatBai', tieuDe, noiDung, 4500);
    }

    canhBao(tieuDe, noiDung = '') {
        this.hienThi('canhBao', tieuDe, noiDung, 4000);
    }

    thongTin(tieuDe, noiDung = '') {
        this.hienThi('thongTin', tieuDe, noiDung);
    }
}

window.thongBao = new HeThongThongBao();
