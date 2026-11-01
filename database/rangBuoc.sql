-- Sprint 1 - Rang buoc nghiep vu va trigger
PRAGMA foreign_keys = ON;

CREATE TRIGGER IF NOT EXISTS trg_nhan_vien_email_khong_rong
BEFORE INSERT ON nhan_vien
WHEN NEW.email IS NOT NULL AND length(trim(NEW.email)) = 0
BEGIN SELECT RAISE(ABORT, 'email nhan vien khong duoc rong'); END;

CREATE TRIGGER IF NOT EXISTS trg_ban_an_suc_chua_hop_le
BEFORE INSERT ON ban_an
WHEN NEW.suc_chua < 1
BEGIN SELECT RAISE(ABORT, 'suc chua phai lon hon 0'); END;

CREATE TRIGGER IF NOT EXISTS trg_ban_an_suc_chua_hop_le_update
BEFORE UPDATE OF suc_chua ON ban_an
WHEN NEW.suc_chua < 1
BEGIN SELECT RAISE(ABORT, 'suc chua phai lon hon 0'); END;

CREATE TRIGGER IF NOT EXISTS trg_mon_an_gia_hop_le
BEFORE INSERT ON mon_an
WHEN NEW.gia_ban < 0
BEGIN SELECT RAISE(ABORT, 'gia ban khong duoc am'); END;

CREATE TRIGGER IF NOT EXISTS trg_mon_an_gia_hop_le_update
BEFORE UPDATE OF gia_ban ON mon_an
WHEN NEW.gia_ban < 0
BEGIN SELECT RAISE(ABORT, 'gia ban khong duoc am'); END;

CREATE TRIGGER IF NOT EXISTS trg_tuy_chon_gia_hop_le
BEFORE INSERT ON tuy_chon_mon
WHEN NEW.gia_them < 0
BEGIN SELECT RAISE(ABORT, 'gia them khong duoc am'); END;
