-- Sprint 2 - Mau transaction tao Order + Order Items (SQLite)
-- Backend phai truyen ma_yeu_cau_idempotency duy nhat cho moi lan bam Dat mon.
-- BEGIN IMMEDIATE khoa ghi database, tranh hai thiet bi cung ban chen don dong thoi.
-- Khong chay file nay nhu seed; day la mau de map vao service tao don.
/*
BEGIN IMMEDIATE;

-- 1. Kiem tra phien dang mo, gio hang thuoc dung phien va idempotency key chua ton tai.
SELECT id FROM phien_phuc_vu
 WHERE ma_phien = :ma_phien AND trang_thai = 'DangMo';
SELECT id FROM don_hang
 WHERE ma_yeu_cau_idempotency = :ma_yeu_cau_idempotency;
SELECT gh.id
FROM gio_hang gh
JOIN phien_phuc_vu p ON p.id = gh.phien_phuc_vu_id
WHERE gh.id = :gio_hang_id
  AND p.id = :phien_phuc_vu_id
  AND p.trang_thai = 'DangMo';

-- 2. Tao header don hang, tong tien phai do service tinh tu gio hang.
INSERT INTO don_hang
    (phien_phuc_vu_id, ma_don, ma_yeu_cau_idempotency, loai_don,
     ghi_chu_chung, tong_tien, tao_boi_ma_khach)
VALUES
    (:phien_phuc_vu_id, :ma_don, :ma_yeu_cau_idempotency, :loai_don,
     :ghi_chu_chung, :tong_tien, :ma_khach);

-- Backend lay ID vua tao bang last_insert_rowid() va gan vao :don_hang_id.
-- Neu idempotency key da ton tai, tra don hang cu va khong chen lai.

-- 3. Chen snapshot mon, gia va so luong tai thoi diem dat.
INSERT INTO chi_tiet_don_hang
    (don_hang_id, mon_an_id, ten_mon_snapshot, don_gia_snapshot,
     so_luong, ghi_chu, thanh_tien)
SELECT :don_hang_id, mon_an_id, ten_mon_snapshot, don_gia_snapshot,
       so_luong, ghi_chu, thanh_tien
FROM gio_hang_item
WHERE gio_hang_id = :gio_hang_id;

-- 3b. Copy cac tuy chon tu gio hang sang chi tiet don hang theo item mapping
-- do service tao trong cung transaction; tuyet doi khong doc lai gia hien tai tu client.

-- 4. Chen lich su trang thai ban dau va thong bao realtime trong cung transaction.
INSERT INTO lich_su_trang_thai_don_hang (don_hang_id, trang_thai_moi)
VALUES (:don_hang_id, 'ChoXacNhan');
INSERT INTO thong_bao_thoi_gian_thuc
    (phien_phuc_vu_id, loai_su_kien, doi_tuong, doi_tuong_id, du_lieu_json)
VALUES (:phien_phuc_vu_id, 'DonHangMoi', 'don_hang', :don_hang_id, :du_lieu_json);

COMMIT;
-- Neu bat ky buoc nao loi: ROLLBACK; khong duoc phat su kien Socket truoc COMMIT.
*/
