-- Sprint 4 - Transaction mo/dong ca va doi soat tien mat
-- Backend phat su kien dashboard sau COMMIT.

/* US-117/118: MO CA
BEGIN IMMEDIATE;
INSERT INTO ca_lam_viec (ma_ca, nhan_vien_id, tien_mat_dau_ca)
VALUES (:ma_ca, :nhan_vien_id, :tien_mat_dau_ca);
COMMIT;
*/

/* US-119/122: DONG CA VA DOI SOAT
BEGIN IMMEDIATE;
UPDATE ca_lam_viec
SET tong_thu_tien_mat = COALESCE((SELECT SUM(gt.so_tien)
    FROM giao_dich_thanh_toan gt JOIN hoa_don hd ON hd.id = gt.hoa_don_id
    WHERE gt.nguoi_thu_id = nhan_vien_id AND gt.phuong_thuc = 'TienMat'
      AND gt.trang_thai = 'ThanhCong' AND date(gt.thoi_gian_thanh_toan) = date(bat_dau_luc)), 0),
    tong_thu_chuyen_khoan = COALESCE((SELECT SUM(gt.so_tien)
    FROM giao_dich_thanh_toan gt
    WHERE gt.nguoi_thu_id = nhan_vien_id AND gt.phuong_thuc = 'ChuyenKhoan'
      AND gt.trang_thai = 'ThanhCong' AND date(gt.thoi_gian_thanh_toan) = date(bat_dau_luc)), 0),
    tong_chi = COALESCE((SELECT SUM(pc.so_tien) FROM phieu_thu_chi_ca pc
      WHERE pc.ca_lam_viec_id = ca_lam_viec.id AND pc.loai_phieu = 'Chi'), 0)
WHERE id = :ca_lam_viec_id AND trang_thai = 'DangMo';

UPDATE ca_lam_viec
SET tien_mat_ky_vong = tien_mat_dau_ca + tong_thu_tien_mat - tong_chi,
    tien_mat_thuc_te = :tien_mat_thuc_te,
    chenh_lech = :tien_mat_thuc_te - (tien_mat_dau_ca + tong_thu_tien_mat - tong_chi),
    trang_thai = 'DaDong', ket_thuc_luc = CURRENT_TIMESTAMP
WHERE id = :ca_lam_viec_id AND trang_thai = 'DangMo';
INSERT INTO bien_ban_giao_ca
    (ca_lam_viec_id, nguoi_ban_giao_id, tien_mat_ky_vong, tien_mat_thuc_te, chenh_lech)
SELECT id, nhan_vien_id, tien_mat_ky_vong, tien_mat_thuc_te, chenh_lech
FROM ca_lam_viec WHERE id = :ca_lam_viec_id;
COMMIT;
*/
