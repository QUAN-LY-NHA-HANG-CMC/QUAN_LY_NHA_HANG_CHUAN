-- Sprint 4 - View aggregation phuc vu Dashboard
CREATE VIEW IF NOT EXISTS vw_doanh_thu_theo_phuong_thuc AS
SELECT date(gt.thoi_gian_thanh_toan) AS ngay_bao_cao,
       gt.phuong_thuc,
       COUNT(*) AS so_giao_dich,
       SUM(gt.so_tien) AS doanh_thu
FROM giao_dich_thanh_toan gt
WHERE gt.trang_thai = 'ThanhCong'
GROUP BY date(gt.thoi_gian_thanh_toan), gt.phuong_thuc;

CREATE VIEW IF NOT EXISTS vw_top_mon_ban_chay AS
SELECT COALESCE(ctdh.mon_an_id, ct.id) AS mon_an_id,
       ct.ten_mon_snapshot AS ten_mon,
       SUM(ct.so_luong) AS so_luong_ban,
       SUM(ct.thanh_tien) AS doanh_thu
FROM chi_tiet_hoa_don ct
JOIN hoa_don hd ON hd.id = ct.hoa_don_id
LEFT JOIN chi_tiet_don_hang ctdh ON ct.chi_tiet_don_hang_id = ctdh.id
WHERE hd.trang_thai = 'DaThanhToan'
GROUP BY ct.ten_mon_snapshot;

CREATE VIEW IF NOT EXISTS vw_doanh_thu_khung_gio AS
SELECT strftime('%H', gt.thoi_gian_thanh_toan) AS gio_trong_ngay,
       COUNT(DISTINCT gt.hoa_don_id) AS so_don_hang,
       SUM(gt.so_tien) AS doanh_thu
FROM giao_dich_thanh_toan gt
WHERE gt.trang_thai = 'ThanhCong'
GROUP BY strftime('%H', gt.thoi_gian_thanh_toan);

CREATE VIEW IF NOT EXISTS vw_ty_le_huy_mon AS
SELECT date(dh.ngay_tao) AS ngay_bao_cao,
       COUNT(*) AS tong_mon,
       SUM(CASE WHEN ctdh.trang_thai_mon IN ('DaHuy', 'TuChoi', 'DaTra') THEN 1 ELSE 0 END) AS mon_huy,
       CAST(SUM(CASE WHEN ctdh.trang_thai_mon IN ('DaHuy', 'TuChoi', 'DaTra') THEN 1 ELSE 0 END) AS REAL)
       / NULLIF(COUNT(*), 0) AS ty_le_huy
FROM chi_tiet_don_hang ctdh
JOIN don_hang dh ON dh.id = ctdh.don_hang_id
GROUP BY date(dh.ngay_tao);
