-- Sprint 2 - Rang buoc va trigger nghiep vu
PRAGMA foreign_keys = ON;

CREATE TRIGGER IF NOT EXISTS trg_phien_phuc_vu_khong_dong_lai
BEFORE UPDATE OF trang_thai ON phien_phuc_vu
WHEN OLD.trang_thai = 'DaDong' AND NEW.trang_thai <> 'DaDong'
BEGIN SELECT RAISE(ABORT, 'phien phuc vu da dong khong duoc mo lai'); END;

CREATE TRIGGER IF NOT EXISTS trg_gio_hang_item_so_luong
BEFORE INSERT ON gio_hang_item
WHEN NEW.so_luong < 1
BEGIN SELECT RAISE(ABORT, 'so luong gio hang phai lon hon 0'); END;

CREATE TRIGGER IF NOT EXISTS trg_gio_hang_item_so_luong_update
BEFORE UPDATE OF so_luong ON gio_hang_item
WHEN NEW.so_luong < 1
BEGIN SELECT RAISE(ABORT, 'so luong gio hang phai lon hon 0'); END;

CREATE TRIGGER IF NOT EXISTS trg_chi_tiet_don_so_luong
BEFORE INSERT ON chi_tiet_don_hang
WHEN NEW.so_luong < 1
BEGIN SELECT RAISE(ABORT, 'so luong mon dat phai lon hon 0'); END;

CREATE TRIGGER IF NOT EXISTS trg_don_hang_khong_sua_khi_da_huy
BEFORE UPDATE OF trang_thai ON don_hang
WHEN OLD.trang_thai IN ('DaHuy', 'DaHoanThanh') AND NEW.trang_thai <> OLD.trang_thai
BEGIN SELECT RAISE(ABORT, 'don hang da ket thuc khong duoc doi trang thai'); END;

CREATE TRIGGER IF NOT EXISTS trg_phien_dong_khong_tao_don
BEFORE INSERT ON don_hang
WHEN EXISTS (SELECT 1 FROM phien_phuc_vu p WHERE p.id = NEW.phien_phuc_vu_id AND p.trang_thai <> 'DangMo')
BEGIN SELECT RAISE(ABORT, 'khong the tao don trong phien da dong'); END;

CREATE TRIGGER IF NOT EXISTS trg_lich_su_trang_thai_don
AFTER UPDATE OF trang_thai ON don_hang
WHEN OLD.trang_thai <> NEW.trang_thai
BEGIN
    INSERT INTO lich_su_trang_thai_don_hang (don_hang_id, trang_thai_cu, trang_thai_moi)
    VALUES (NEW.id, OLD.trang_thai, NEW.trang_thai);
END;
