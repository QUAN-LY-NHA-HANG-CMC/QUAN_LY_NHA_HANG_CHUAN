-- Sprint 4 - Rang buoc danh gia, ca va bao cao
PRAGMA foreign_keys = ON;

CREATE TRIGGER IF NOT EXISTS trg_danh_gia_so_sao
BEFORE INSERT ON danh_gia_khach_hang
WHEN NEW.so_sao < 1 OR NEW.so_sao > 5
BEGIN SELECT RAISE(ABORT, 'so sao phai tu 1 den 5'); END;

CREATE TRIGGER IF NOT EXISTS trg_danh_gia_so_sao_update
BEFORE UPDATE OF so_sao ON danh_gia_khach_hang
WHEN NEW.so_sao < 1 OR NEW.so_sao > 5
BEGIN SELECT RAISE(ABORT, 'so sao phai tu 1 den 5'); END;

CREATE TRIGGER IF NOT EXISTS trg_ca_tien_khong_am
BEFORE INSERT ON ca_lam_viec
WHEN NEW.tien_mat_dau_ca < 0
  OR NEW.tong_thu_tien_mat < 0
  OR NEW.tong_thu_chuyen_khoan < 0
  OR NEW.tong_chi < 0
BEGIN SELECT RAISE(ABORT, 'so tien cua ca khong duoc am'); END;

CREATE TRIGGER IF NOT EXISTS trg_phieu_thu_chi_so_tien
BEFORE INSERT ON phieu_thu_chi_ca
WHEN NEW.so_tien <= 0
BEGIN SELECT RAISE(ABORT, 'so tien phieu thu chi phai lon hon 0'); END;

CREATE TRIGGER IF NOT EXISTS trg_dong_ca_tinh_chenh_lech
BEFORE UPDATE OF trang_thai ON ca_lam_viec
WHEN NEW.trang_thai = 'DaDong' AND NEW.tien_mat_thuc_te IS NULL
BEGIN SELECT RAISE(ABORT, 'dong ca phai co tien mat thuc te'); END;

CREATE TRIGGER IF NOT EXISTS trg_danh_gia_phai_thuoc_phien
BEFORE INSERT ON danh_gia_khach_hang
WHEN NOT EXISTS (SELECT 1 FROM phien_phuc_vu p WHERE p.id = NEW.phien_phuc_vu_id AND p.trang_thai = 'DaDong')
BEGIN SELECT RAISE(ABORT, 'chi danh gia sau khi phien da dong'); END;
