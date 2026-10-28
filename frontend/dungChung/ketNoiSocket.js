/**
 * BỘ ĐIỀU PHỐI SOCKET.IO THỜI GIAN THỰC & ĐỒNG BỘ CLIENT (ketNoiSocket.js)
 * Phụ trách: Phong (Sprint 2 - US-075 -> US-078)
 * - US-075: Đẩy đơn đặt món mới từ máy khách lên Server và Bếp/Thu ngân tức thời
 * - US-076: Đồng bộ trạng thái món ăn từ Bếp ngược về màn hình khách hàng theo thời gian thực
 * - US-077: Đồng bộ tức thời khi Quản lý/Bếp báo hết món để khóa món trên E-Menu của khách
 * - US-078: Phát âm thanh chuông báo (Web Audio Synth) trên màn hình Bếp và Thu ngân khi có đơn/yêu cầu mới
 */

class SocketClient {
    constructor() {
        this.socket = null;
        this.langNgheSuKien = new Map();
        this.daKetNoi = false;
        this.kenhPhatSong = null;
        this.audioCtx = null;
        this.khoiTaoKenhPhatSong();
    }

    /**
     * Khởi tạo kênh BroadcastChannel để đồng bộ tức thời giữa các Tab/Cửa sổ trình duyệt
     * (Khách hàng đặt món -> Tab Bếp/Thu ngân/Admin nhận ngay lập tức kể cả khi Backend chưa bật)
     */
    khoiTaoKenhPhatSong() {
        if (typeof BroadcastChannel !== 'undefined') {
            try {
                this.kenhPhatSong = new BroadcastChannel('quanmoc_realtime_channel');
                this.kenhPhatSong.onmessage = (event) => {
                    const { tenSuKien, duLieu } = event.data || {};
                    if (tenSuKien) {
                        this.kichHoatSuKienNoiBo(tenSuKien, duLieu);
                    }
                };
            } catch (e) {
                console.warn('Trình duyệt không hỗ trợ BroadcastChannel:', e);
            }
        }
    }

    /**
     * Khởi tạo kết nối Socket.io tới máy chủ backend chính thức
     */
    ketNoi(url = 'http://localhost:3001') {
        if (typeof io !== 'undefined') {
            try {
                this.socket = io(url, {
                    transports: ['websocket', 'polling'],
                    reconnection: true,
                    reconnectionAttempts: 5,
                    reconnectionDelay: 1000
                });

                this.socket.on('connect', () => {
                    this.daKetNoi = true;
                    console.log('✅ Đã kết nối Socket.io thời gian thực:', this.socket.id);
                });

                this.socket.on('disconnect', () => {
                    this.daKetNoi = false;
                    console.warn('⚠️ Mất kết nối Socket.io');
                });

                // Chuyển tiếp các sự kiện từ Socket server vào hệ thống nội bộ
                const cacSuKienServer = [
                    'order:moi', 'order:capNhatTrangThai', 'order:huyMon',
                    'order:tuChoiMon', 'hoTro:yeuCauMoi', 'hoTro:tiepNhan',
                    'thucDon:hetMon', 'thanhToan:yeuCau'
                ];
                cacSuKienServer.forEach(evt => {
                    this.socket.on(evt, (duLieu) => {
                        this.kichHoatSuKienNoiBo(evt, duLieu);
                    });
                });
            } catch (err) {
                console.warn('Không thể khởi tạo Socket.io client:', err);
            }
        }
    }

    /**
     * Tham gia vào Room theo bàn ăn
     */
    thamGiaBan(soBan) {
        if (this.socket && this.daKetNoi) {
            this.socket.emit('thamGiaBan', { soBan });
        }
    }

    /**
     * Đăng ký lắng nghe sự kiện
     */
    khiCoSuKien(tenSuKien, hamXuLy) {
        if (!this.langNgheSuKien.has(tenSuKien)) {
            this.langNgheSuKien.set(tenSuKien, []);
        }
        this.langNgheSuKien.get(tenSuKien).push(hamXuLy);

        if (this.socket) {
            this.socket.on(tenSuKien, hamXuLy);
        }
    }

    /**
     * Hủy đăng ký lắng nghe sự kiện
     */
    huyLangsNghe(tenSuKien, hamXuLy) {
        if (this.langNgheSuKien.has(tenSuKien)) {
            const arr = this.langNgheSuKien.get(tenSuKien).filter(fn => fn !== hamXuLy);
            this.langNgheSuKien.set(tenSuKien, arr);
        }
        if (this.socket) {
            this.socket.off(tenSuKien, hamXuLy);
        }
    }

    /**
     * Phát sự kiện (đồng bộ lên Socket server + đồng bộ các Tab qua BroadcastChannel)
     */
    phatSuKien(tenSuKien, duLieu) {
        // 1. Gửi qua Socket.io server nếu có kết nối
        if (this.socket && this.daKetNoi) {
            this.socket.emit(tenSuKien, duLieu);
        }

        // 2. Kích hoạt handler nội bộ của tab hiện tại
        this.kichHoatSuKienNoiBo(tenSuKien, duLieu);

        // 3. Đồng bộ sang các Tab khác (Cross-tab Real-time)
        if (this.kenhPhatSong) {
            try {
                this.kenhPhatSong.postMessage({ tenSuKien, duLieu });
            } catch (e) {
                console.error('Lỗi postMessage BroadcastChannel:', e);
            }
        }
    }

    /**
     * Kích hoạt danh sách callback nội bộ
     */
    kichHoatSuKienNoiBo(tenSuKien, duLieu) {
        const danhSachHam = this.langNgheSuKien.get(tenSuKien) || [];
        danhSachHam.forEach(fn => {
            try {
                fn(duLieu);
            } catch (e) {
                console.error(`Lỗi thực thi callback sự kiện ${tenSuKien}:`, e);
            }
        });
    }

    // =========================================================================
    // US-078: PHÁT ÂM THANH CHUÔNG BÁO THỜI GIAN THỰC (Web Audio API Synthesizer)
    // Không phụ thuộc tệp mp3 ngoài - tạo chuông kêu thanh tao, chuẩn nhà hàng
    // =========================================================================

    phatAmThanh(loai = 'donMoi') {
        try {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (!AudioContextClass) return;

            if (!this.audioCtx) {
                this.audioCtx = new AudioContextClass();
            }

            if (this.audioCtx.state === 'suspended') {
                this.audioCtx.resume();
            }

            const ctx = this.audioCtx;
            const now = ctx.currentTime;

            if (loai === 'donMoi') {
                // Chuông "Ding-Dong" 2 nốt cao báo Đơn mới (US-078)
                this.taoNotNhac(ctx, 880, now, 0.25, 'sine');          // Nốt A5
                this.taoNotNhac(ctx, 1318.51, now + 0.15, 0.45, 'sine'); // Nốt E6
            } else if (loai === 'hoTro') {
                // Chuông "Ting-Ting-Ting" 3 nhịp báo Khách gọi hỗ trợ (US-074)
                this.taoNotNhac(ctx, 587.33, now, 0.18, 'triangle');       // Nốt D5
                this.taoNotNhac(ctx, 783.99, now + 0.12, 0.18, 'triangle'); // Nốt G5
                this.taoNotNhac(ctx, 1046.50, now + 0.24, 0.35, 'sine');    // Nốt C6
            } else if (loai === 'thanhToan') {
                // Chuông thanh toán ngân vang
                this.taoNotNhac(ctx, 659.25, now, 0.2, 'sine');        // Nốt E5
                this.taoNotNhac(ctx, 880, now + 0.15, 0.2, 'sine');      // Nốt A5
                this.taoNotNhac(ctx, 1174.66, now + 0.3, 0.5, 'sine');   // Nốt D6
            } else if (loai === 'tuChoi') {
                // Âm trầm cảnh báo Bếp từ chối món (US-069)
                this.taoNotNhac(ctx, 440, now, 0.2, 'sawtooth');
                this.taoNotNhac(ctx, 330, now + 0.18, 0.35, 'sawtooth');
            }
        } catch (e) {
            console.warn('Trình duyệt chặn Web Audio hoặc chưa có tương tác người dùng:', e);
        }
    }

    taoNotNhac(ctx, tanSo, thoiDiemBatDau, thoiLuong, kieuSong = 'sine') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = kieuSong;
        osc.frequency.setValueAtTime(tanSo, thoiDiemBatDau);

        gain.gain.setValueAtTime(0.001, thoiDiemBatDau);
        gain.gain.exponentialRampToValueAtTime(0.25, thoiDiemBatDau + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, thoiDiemBatDau + thoiLuong);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(thoiDiemBatDau);
        osc.stop(thoiDiemBatDau + thoiLuong);
    }
}

// Khởi tạo đối tượng toàn cục
window.socketClient = new SocketClient();
