/**
 * BỘ ĐIỀU PHỐI SOCKET.IO THỜI GIAN THỰC (ketNoiSocket.js)
 * Chuẩn bị cho Sprint 2 (Đồng bộ Order khách) và Sprint 3 (Bếp KDS & POS)
 */

class SocketClient {
    constructor() {
        this.socket = null;
        this.langNgheSuKien = new Map();
        this.daKetNoi = false;
    }

    /**
     * Khởi tạo kết nối Socket.io tới máy chủ
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
            } catch (err) {
                console.warn('Không thể khởi tạo Socket.io client:', err);
            }
        }
    }

    /**
     * Đăng ký lắng nghe sự kiện
     */
    khiCoSuKien(tenSuKien, hamXuLy) {
        if (this.socket) {
            this.socket.on(tenSuKien, hamXuLy);
        } else {
            if (!this.langNgheSuKien.has(tenSuKien)) {
                this.langNgheSuKien.set(tenSuKien, []);
            }
            this.langNgheSuKien.get(tenSuKien).push(hamXuLy);
        }
    }

    /**
     * Phát sự kiện
     */
    phatSuKien(tenSuKien, duLieu) {
        if (this.socket && this.daKetNoi) {
            this.socket.emit(tenSuKien, duLieu);
        } else {
            // Giả lập phát sự kiện cục bộ nếu đang chạy offline
            const danhSachHam = this.langNgheSuKien.get(tenSuKien) || [];
            danhSachHam.forEach(fn => fn(duLieu));
        }
    }
}

window.socketClient = new SocketClient();
