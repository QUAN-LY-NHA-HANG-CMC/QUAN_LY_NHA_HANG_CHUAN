-- Sprint 3 - Rang buoc va trigger bep/thanh toan
PRAGMA foreign_keys = ON;

CREATE TRIGGER IF NOT EXISTS trg_hang_doi_bep_ghi_lich_su
AFTER UPDATE OF trang_thai ON hang_doi_bep
WHEN OLD.trang_thai <> NEW.trang_thai
BEGIN
    INSERT INTO lich_su_mon_bep (chi_tiet_don_hang_id, trang_thai_cu, trang_thai_moi, nguoi_cap_nhat_id)
    VALUES (NEW.chi_tiet_don_hang_id, OLD.trang_thai, NEW.trang_thai, NEW.nguoi_phu_trach_id);
    UPDATE chi_tiet_don_hang
       SET trang_thai_mon = NEW.trang_thai, ngay_cap_nhat = CURRENT_TIMESTAMP
     WHERE id = NEW.chi_tiet_don_hang_id;
END;

CREATE TRIGGER IF NOT EXISTS trg_yeu_cau_huy_tra_so_luong
BEFORE INSERT ON yeu_cau_huy_tra_mon
WHEN NEW.so_luong < 1
BEGIN SELECT RAISE(ABORT, 'so luong huy tra phai lon hon 0'); END;

CREATE TRIGGER IF NOT EXISTS trg_that_thoat_so_luong
BEFORE INSERT ON lich_su_that_thoat_mon
WHEN NEW.so_luong < 1 OR NEW.gia_tri < 0
BEGIN SELECT RAISE(ABORT, 'du lieu that thoat khong hop le'); END;

CREATE TRIGGER IF NOT EXISTS trg_khuyen_mai_gia_tri
BEFORE INSERT ON chuong_trinh_khuyen_mai
WHEN NEW.gia_tri_giam < 0 OR NEW.don_toi_thieu < 0 OR NEW.ket_thuc_luc <= NEW.bat_dau_luc
BEGIN SELECT RAISE(ABORT, 'thoi gian hoac gia tri khuyen mai khong hop le'); END;

CREATE TRIGGER IF NOT EXISTS trg_thanh_toan_so_tien
BEFORE INSERT ON giao_dich_thanh_toan
WHEN NEW.so_tien <= 0
BEGIN SELECT RAISE(ABORT, 'so tien thanh toan phai lon hon 0'); END;

CREATE TRIGGER IF NOT EXISTS trg_thanh_toan_tien_mat
BEFORE INSERT ON giao_dich_thanh_toan
WHEN NEW.phuong_thuc = 'TienMat' AND (NEW.tien_khach_dua IS NULL OR NEW.tien_khach_dua < NEW.so_tien)
BEGIN SELECT RAISE(ABORT, 'tien khach dua khong du'); END;

CREATE TRIGGER IF NOT EXISTS trg_ma_giam_gia_tang_luot_dung
AFTER INSERT ON hoa_don_khuyen_mai
WHEN NEW.ma_giam_gia_id IS NOT NULL
BEGIN
    UPDATE ma_giam_gia SET so_lan_da_su_dung = so_lan_da_su_dung + 1
     WHERE id = NEW.ma_giam_gia_id;
END;
