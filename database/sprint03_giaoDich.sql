-- Sprint 3 - Kich ban transaction nghiep vu quan trong (SQLite)
-- Backend phai phat Socket event sau COMMIT, khong phat trong transaction.

/* US-097: CHUYEN BAN - tao phien dich, ghi lich su, dong phien nguon
BEGIN IMMEDIATE;
SELECT id FROM phien_phuc_vu WHERE id = :phien_nguon_id AND trang_thai = 'DangMo';
SELECT id FROM ban_an WHERE id = :ban_dich_id AND trang_thai = 'Trong';
UPDATE phien_phuc_vu SET ban_an_id = :ban_dich_id WHERE id = :phien_nguon_id;
UPDATE ban_an SET trang_thai = 'Trong' WHERE id = :ban_nguon_id;
UPDATE ban_an SET trang_thai = 'DangPhucVu' WHERE id = :ban_dich_id;
INSERT INTO lich_su_chuyen_ban (phien_nguon_id, ban_nguon_id, phien_dich_id, ban_dich_id, nguoi_thuc_hien_id)
VALUES (:phien_nguon_id, :ban_nguon_id, :phien_nguon_id, :ban_dich_id, :nguoi_thuc_hien_id);
COMMIT;
*/

/* US-098: GHEP BAN - chuyen cac don sang phien dich va ghi nhat ky
BEGIN IMMEDIATE;
SELECT id FROM phien_phuc_vu WHERE id IN (:phien_nguon_id, :phien_dich_id) AND trang_thai = 'DangMo';
UPDATE don_hang SET phien_phuc_vu_id = :phien_dich_id WHERE phien_phuc_vu_id = :phien_nguon_id;
UPDATE hoa_don SET phien_phuc_vu_id = :phien_dich_id WHERE phien_phuc_vu_id = :phien_nguon_id;
UPDATE phien_phuc_vu SET trang_thai = 'DaDong', ket_thuc_luc = CURRENT_TIMESTAMP WHERE id = :phien_nguon_id;
UPDATE ban_an SET trang_thai = 'Trong' WHERE id = :ban_nguon_id;
INSERT INTO lich_su_ghep_ban (phien_nguon_id, ban_nguon_id, phien_dich_id, ban_dich_id, nguoi_thuc_hien_id)
VALUES (:phien_nguon_id, :ban_nguon_id, :phien_dich_id, :ban_dich_id, :nguoi_thuc_hien_id);
COMMIT;
*/

/* US-108: TACH HOA DON - tao hoa don con va chuyen dong chi tiet
BEGIN IMMEDIATE;
INSERT INTO hoa_don (phien_phuc_vu_id, hoa_don_goc_id, ma_hoa_don, nguoi_lap_id)
VALUES (:phien_phuc_vu_id, :hoa_don_goc_id, :ma_hoa_don_moi, :nguoi_lap_id);
-- Backend lay last_insert_rowid() lam :hoa_don_moi_id.
UPDATE chi_tiet_hoa_don SET hoa_don_id = :hoa_don_moi_id
 WHERE id IN (:chi_tiet_hoa_don_ids) AND hoa_don_id = :hoa_don_goc_id;
-- Service tinh lai tam_tinh/giam_gia/phu_phi/thue_vat/tong_tien cho ca hai hoa don.
COMMIT;
*/

/* US-109/110: THANH TOAN VA DONG PHIEN BAN
BEGIN IMMEDIATE;
SELECT id, tong_tien FROM hoa_don WHERE id = :hoa_don_id AND trang_thai IN ('TamTinh', 'ChoThanhToan');
INSERT INTO giao_dich_thanh_toan
    (hoa_don_id, ma_giao_dich, phuong_thuc, trang_thai, so_tien,
     tien_khach_dua, tien_thua, ma_tham_chieu_ngan_hang, nguoi_thu_id)
VALUES (:hoa_don_id, :ma_giao_dich, :phuong_thuc, 'ThanhCong', :so_tien,
        :tien_khach_dua, :tien_thua, :ma_tham_chieu_ngan_hang, :nguoi_thu_id);
UPDATE hoa_don SET trang_thai = 'DaThanhToan', ngay_thanh_toan = CURRENT_TIMESTAMP
 WHERE id = :hoa_don_id;
UPDATE phien_phuc_vu SET trang_thai = 'DaDong', ket_thuc_luc = CURRENT_TIMESTAMP
 WHERE id = :phien_phuc_vu_id;
UPDATE ban_an SET trang_thai = 'Trong' WHERE id = :ban_an_id;
COMMIT;
*/
