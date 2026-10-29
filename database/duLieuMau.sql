-- Sprint 1 - Du lieu mau an toan cho moi truong phat trien
PRAGMA foreign_keys = ON;

INSERT OR IGNORE INTO vai_tro (id, ma_vai_tro, ten_vai_tro, mo_ta) VALUES
(1, 'QUAN_LY', 'Quan ly', 'Quan tri nha hang'),
(2, 'THU_NGAN', 'Thu ngan', 'Tiep nhan va thanh toan'),
(3, 'BEP', 'Bep', 'Xu ly mon tai bep'),
(4, 'PHUC_VU', 'Phuc vu', 'Phuc vu tai ban');

INSERT OR IGNORE INTO quyen_han (id, ma_quyen, ten_quyen, nhom_quyen) VALUES
(1, 'TAI_KHOAN_XEM', 'Xem tai khoan', 'Tai khoan'),
(2, 'NHAN_VIEN_QUAN_LY', 'Quan ly nhan vien', 'Nhan vien'),
(3, 'BAN_AN_QUAN_LY', 'Quan ly ban an', 'Ban an'),
(4, 'THUC_DON_QUAN_LY', 'Quan ly thuc don', 'Thuc don'),
(5, 'CAU_HINH_QUAN_LY', 'Quan ly cau hinh', 'He thong'),
(6, 'NHAT_KY_XEM', 'Xem nhat ky he thong', 'He thong');

INSERT OR IGNORE INTO vai_tro_quyen_han (vai_tro_id, quyen_han_id) SELECT 1, id FROM quyen_han;
INSERT OR IGNORE INTO vai_tro_quyen_han (vai_tro_id, quyen_han_id) VALUES (2,1),(2,3),(3,4),(4,3);

INSERT OR IGNORE INTO tai_khoan (id, ten_dang_nhap, mat_khau, email) VALUES
(1, 'quanly', '$2a$10$w3a6zB2qLphF3kL4kOaPDeP46n9Gk1wD26dJ3j5aC3aE.vEw6G.Xe', 'quanly@example.test'),
(2, 'thungan01', '$2a$10$w3a6zB2qLphF3kL4kOaPDeP46n9Gk1wD26dJ3j5aC3aE.vEw6G.Xe', 'thungan@example.test'),
(3, 'bep01', '$2a$10$w3a6zB2qLphF3kL4kOaPDeP46n9Gk1wD26dJ3j5aC3aE.vEw6G.Xe', 'bep@example.test');

INSERT OR IGNORE INTO nhan_vien (id, tai_khoan_id, ho_ten, so_dien_thoai, email, vai_tro_id) VALUES
(1,1,'Nguyen Van Quan Ly','0900000001','quanly@example.test',1),
(2,2,'Tran Thi Thu Ngan','0900000002','thungan@example.test',2),
(3,3,'Le Van Bep Truong','0900000003','bep@example.test',3);

INSERT OR IGNORE INTO khu_vuc (id, ten_khu_vuc, ghi_chu) VALUES
(1,'Tang 1 - Sanh chinh','Khu vuc trong nha'),
(2,'Tang 2 - Ngoai troi','Khu vuc ban cong'),
(3,'Phong VIP','Khu vuc rieng tu');
INSERT OR IGNORE INTO ban_an (id,khu_vuc_id,ma_ban,ten_ban,suc_chua) VALUES
(1,1,'B101','Ban 01',4),(2,1,'B102','Ban 02',4),(3,2,'B201','Ban 11',4),(4,3,'VIP1','Phong VIP 1',10);
INSERT OR IGNORE INTO ma_qr_ban (ban_an_id,token_bao_mat,duong_dan_qr) VALUES
(1,'dev-token-b101','/e-menu?ban=B101'),(2,'dev-token-b102','/e-menu?ban=B102'),
(3,'dev-token-b201','/e-menu?ban=B201'),(4,'dev-token-vip1','/e-menu?ban=VIP1');

INSERT OR IGNORE INTO danh_muc_mon (id,ten_danh_muc,thu_tu_hien_thi) VALUES
(1,'Khai vi',1),(2,'Mon chinh',2),(3,'Lau',3),(4,'Do uong',4),(5,'Trang mieng',5);
INSERT OR IGNORE INTO mon_an (id,danh_muc_id,ten_mon,gia_ban,don_vi_tinh,mo_ta,la_mon_ban_chay) VALUES
(1,1,'Goi bo bop thau',95000,'Dia','Mon khai vi',1),
(2,2,'Bo to hap cuon banh trang',185000,'Phan','Mon dac san',1),
(3,3,'Lau bo nhung dam',295000,'Noi','Lau bo truyen thong',0),
(4,4,'Tra vai hoa nhai',35000,'Ly','Do uong mat',1);
INSERT OR IGNORE INTO hinh_anh_mon_an (mon_an_id,duong_dan,la_anh_dai_dien) VALUES
(1,'/tepTaiLen/anhMonAn/goi-bo.jpg',1),(2,'/tepTaiLen/anhMonAn/bo-to-hap.jpg',1),
(3,'/tepTaiLen/anhMonAn/lau-bo.jpg',1),(4,'/tepTaiLen/anhMonAn/tra-vai.jpg',1);
INSERT OR IGNORE INTO cau_hinh_nha_hang (ma_cau_hinh,gia_tri,kieu_du_lieu,mo_ta) VALUES
('ten_nha_hang','Quan Moc','text','Ten hien thi'),
('thue_vat','8','number','Phan tram VAT'),
('phi_phuc_vu','0','number','Phan tram phi phuc vu');
