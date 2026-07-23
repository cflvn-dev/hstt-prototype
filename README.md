# Prototype - Hệ thống Lập hồ sơ thanh toán tiền điện GENCO3

Prototype tương tác (HTML/CSS/JS tĩnh) mô phỏng **một phiên bản dùng thật** của hệ thống, phục vụ giai đoạn Discovery để kiểm chứng UI/UX và full flow nghiệp vụ.

> **Prototype không phải SSOT** - nó chỉ là hiện thực hóa các **screen specification** trong [`../screens/`](../screens/) và là công cụ review với khách hàng / validate requirement & design. **Không sửa prototype khi chưa cập nhật screen spec tương ứng** (quy tắc trong [CLAUDE.md](../CLAUDE.md) và skill [`discovery-workflow`](../.ai/skills/discovery-workflow/SKILL.md)).
>
> Dùng chung [design system](../design/) (`../design/design-system.css`). Không có backend - dữ liệu là **sample data**.

> **Trình bày cho khách hàng**: bộ slide giới thiệu prototype (đi từ tổng quan tới chi tiết, tập trung phân hệ core) ở [../presentation/](../presentation/) - mở [../presentation/index.html](../presentation/index.html). Đây là **view review-only ngoài SSOT** ([DEC-020](../review/decision-log.md#dec-020)); ảnh trong slide chụp từ prototype này bằng `presentation/capture.mjs`, prototype đổi thì chụp lại.

## Cách mở

- **Review chuẩn (khuyến nghị)**: host thẳng thư mục `prototype/` trên **IIS** ([DEC-005](../review/decision-log.md#dec-005)) - web root = `prototype/`, [index.html](index.html) là default document. Prototype **tự chứa** nên chạy ngay, không cần cấu hình thêm (virtual directory...). Cách này cho `localStorage` ổn định => dùng được **bộ chọn theme** (5 Design System x light/dark).
- **Mở nhanh (fallback)**: mở trực tiếp [index.html](index.html) bằng trình duyệt (không cần server). Vẫn chạy được; riêng ghi nhớ theme qua `localStorage` có thể không bền trên `file://` (khi đó rơi về theme Default/light).

Sau đăng nhập vào thẳng **Trang chào (Welcome)** ở route `/` = [index.html](index.html) ([SC-021](../screens/SC-021.md), [DEC-021](../review/decision-log.md#dec-021)): header tối giản (logo + switch theme + user) + **module launcher** liệt kê 8 mô-đun (2 dòng) + khối tổng quan dashboard (nội dung theo [SC-001](../screens/SC-001.md)). Điều hướng ở **trang con** qua sidebar bên trái (riêng theme Vercel Grid dùng top navigation - nav pattern do Theme Registry quyết định, [DEC-006](../review/decision-log.md#dec-006)); **Dashboard đã bỏ khỏi menu nav** (nay là khu nội dung của Trang chào), **bấm logo** để quay lại Trang chào. Đổi giao diện bằng nút **palette** trên thanh điều hướng - đổi theme re-render app shell tại chỗ, không reload/mất state. So sánh 5 Presentation Theme trên cùng dataset: [showcase.html](showcase.html) (review-only; `?compare=1` xem song song). Màn hình đăng nhập [dang-nhap.html](dang-nhap.html) minh họa cổng vào hệ thống; nút Đăng xuất đưa về màn này (prototype không chặn truy cập thật).

> **Self-contained + quy ước link**: mọi asset phải nằm **trong** `prototype/` (không tham chiếu `../` ra ngoài web root - sẽ 404 trên IIS). Link là **document-relative** (`./`, `assets/...`), **không** root-relative (`/assets/...`). CSS design là **bản build** [assets/design-system.css](assets/design-system.css) + [assets/themes.css](assets/themes.css) - **sinh tự động** từ SSOT `design/` bằng `node .ai/scripts/sync-prototype-assets.js` (đừng sửa tay bản build; sửa ở `design/` rồi chạy sync). Chi tiết: [rules/prototype-conventions.md](../rules/prototype-conventions.md) mục 5-6.

## Phạm vi: 1 nhà máy

Theo thực tế vận hành, mỗi chuyên viên được phân công phụ trách **một nhà máy cụ thể**. Prototype vì vậy được thiết kế **plant-scoped** cho **Nhiệt điện Vĩnh Tân 2** (nhiệt điện than, 2 tổ máy S1/S2 x 622 MW), kỳ thanh toán **Tháng 05/2026**.

- Có màn hình đăng nhập ([dang-nhap.html](dang-nhap.html) - hiện thực hóa [SC-009](../screens/SC-009.md)); cơ chế xác thực (nội bộ hay SSO) **cần xác nhận**. Prototype không chặn truy cập: mở thẳng trang nội dung vẫn vào được, đăng nhập/đăng xuất chỉ để minh họa luồng FL-010.
- Bộ chọn nhà máy ở topbar minh họa khả năng chuyển ngữ cảnh; **Phú Mỹ 1 đứng đầu bộ chọn và là ngữ cảnh mặc định của mọi màn** (nhà máy chuẩn của bộ trình bày khách hàng - [DEC-020](../review/decision-log.md#dec-020), cập nhật 2026-07-23). Số liệu **vòng đời** (thu thập/sự kiện/tính toán/hồ sơ) vẫn là mẫu **Vĩnh Tân 2** (nhiệt điện than, chưa có dữ liệu khí) nên ở các màn đó **nhãn topbar không khớp số liệu bên dưới** - lưu ý khi demo; cụm màn **Tính Pc** dùng **dữ liệu thực cụm Phú Mỹ** ([DEC-019](../review/decision-log.md#dec-019)) nên khớp.

## Các màn hình (full flow)

| # | Màn hình | File | Screen spec | Phân hệ |
| --- | --- | --- | --- | --- |
| 1 | Trang chào (Welcome) - module launcher + khối dashboard (route `/`) | [index.html](index.html) | [SC-021](../screens/SC-021.md) (composition) + [SC-001](../screens/SC-001.md) (khối dashboard) | PH-007 (app shell / trang chung) + PH-005 (dashboard) |
| 2 | Thu thập &amp; đồng bộ dữ liệu (+ OCR) | [thu-thap-du-lieu.html](thu-thap-du-lieu.html) | [SC-002](../screens/SC-002.md) | PH-001 |
| 3 | Tổng hợp &amp; công bố sự kiện | [su-kien.html](su-kien.html) | [SC-003](../screens/SC-003.md) | PH-002 |
| 4 | Tính toán và tổng hợp | [tinh-toan.html](tinh-toan.html) | [SC-004](../screens/SC-004.md) | PH-003 |
| 5 | Hồ sơ thanh toán (danh sách) - **deprecated**, [lap-ho-so.html](lap-ho-so.html) chỉ còn chuyển hướng sang chi tiết ([DEC-009](../review/decision-log.md#dec-009)) | [lap-ho-so.html](lap-ho-so.html) | [SC-005](../screens/SC-005.md) | PH-004 |
| 6 | Chi tiết hồ sơ (tabs, checklist, xuất hồ sơ, ký số) - màn vào thẳng của menu Hồ sơ thanh toán | [ho-so-chi-tiet.html](ho-so-chi-tiet.html) | [SC-006](../screens/SC-006.md) | PH-004 |
| 7 | Báo cáo &amp; giám sát | [bao-cao.html](bao-cao.html) | [SC-007](../screens/SC-007.md) | PH-005 |
| 8 | Danh mục &amp; cấu hình | [cau-hinh.html](cau-hinh.html) | [SC-008](../screens/SC-008.md) | PH-006 |
| 9 | Đăng nhập | [dang-nhap.html](dang-nhap.html) | [SC-009](../screens/SC-009.md) | PH-007 |
| 10 | Giải trình audit cách tính Pc dạng bảng tính (Univer readonly + Audit Panel) | [tinh-pc-audit.html](tinh-pc-audit.html) | [SC-016](../screens/SC-016.md) | PH-009 |
| 11 | Tính Pc (dữ liệu đầu vào + công thức áp dụng + quy trình tính toán) | [tinh-pc.html](tinh-pc.html) | [SC-019](../screens/SC-019.md) | PH-009 |
| 12 | Bản đồ quy trình tính Pc (DAG bước tính + lớp phủ file đối chiếu) | [tinh-pc-ban-do.html](tinh-pc-ban-do.html) | [SC-020](../screens/SC-020.md) | PH-009 |

## Luồng demo gợi ý (end-to-end)

1. **Bảng điều khiển** => thấy cảnh báo: NKVH lỗi, 2 sự kiện chờ duyệt, tiến độ 64%.
2. **Thu thập dữ liệu** => xem trạng thái 5 nguồn, hàng đợi Message Queue, bóc tách chứng từ than bằng **OCR** (modal kiểm tra/xác nhận).
3. **Sự kiện** => duyệt &amp; **công bố** 2 sự kiện chờ; xử lý sự kiện bị **NSMO từ chối**.
4. **Tính toán** => xem tiến độ engine, kết quả theo khoản mục, **snapshot**, **so sánh lần tính**, **chốt kỳ** (khóa số liệu).
5. **Hồ sơ thanh toán** (vào thẳng chi tiết kỳ đang chọn) => tab Tài liệu (mặc định) / Thư mục hồ sơ / dữ liệu đầu vào / tính toán / đánh giá; **Xuất hồ sơ** (modal 3 lựa chọn), **ký số USB Token**.
6. **Báo cáo &amp; giám sát** => hiện trạng đồng bộ, giám sát lỗi (WARN/FATAL), báo cáo nhanh dashboard.
7. **Cấu hình** => engine công thức (đánh phiên bản), danh mục, tích hợp OCR, phân quyền theo nhà máy.

## Thiết kế mẫu audit spreadsheet (BB-06 / SC-016 / DEC-010)

Trang [tinh-pc-audit.html](tinh-pc-audit.html) - **nay là màn chính thức của FR-046** ([DEC-013](../review/decision-log.md#dec-013), đổi tên từ `tinh-toan-audit-sample.html`); các điểm kỹ thuật Univer còn theo dõi ở [ISS-012](../review/open-issues.md#iss-012).

- **Cách chạy**: vào từ nút **"Xem chi tiết"** trên header bảng "Giá Pc theo chu kỳ" (trang Tính toán, tab Tính giá Pc), hoặc mở trực tiếp file. **Cần online** để tải Univer UMD từ unpkg (pin `@0.25.1`); dữ liệu sample tự chứa nên phần còn lại chạy được cả `file://` lẫn IIS.
- **Vị trí file Excel nguồn**: `../references/sample_tinhtoan.xlsx` (chỉ đọc `Sheet1`). Dữ liệu được chuyển đổi **offline** thành `assets/data/sample-tinhtoan-sheet1.js` bằng `powershell -ExecutionPolicy Bypass -File .ai/scripts/convert-sample-tinhtoan.ps1` - chạy lại khi file Excel đổi; **không** ghi/di chuyển file gốc.
- **Bổ sung audit metadata cho cell**: thêm entry vào `assets/data/sample-tinhtoan-audit.js` (key = địa chỉ cell, vd `"F11"`), cấu trúc `CellAuditInfo` gồm `valueType`, `metricName`, `formulaName/Expression/Version`, `inputs[]` (mỗi input có `sourceType` + `cellReference` bấm được để truy vết ngược), `calculationSteps[]`, `roundingRule`, `sourceModule/Document`, `warnings`, `isOverridden`.
- **Kiến trúc chính**: `WorkbookLoaderService` (nạp snapshot, xử lý merge) - `SpreadsheetViewer` (Univer render/selection/điều hướng, readonly qua permission API + chặn command) - `CellAuditService` (audit mock tách ngoài Univer, thiết kế để thay bằng API `GET /api/calculation-workbooks/...`) - `AuditPanel` (Tổng quan / Công thức / Dữ liệu đầu vào / Các bước tính / Truy vết, collapse + kéo đổi chiều rộng, màn hẹp thành drawer).
- **Giới hạn bản sample**: chỉ Sheet1 (42 dòng); audit metadata mới gắn cho một số cell (chips phía trên spreadsheet); công thức gốc Excel chỉ để tham khảo/phân loại raw-derived; chưa có backend, chưa vendor Univer cho môi trường offline (xem ISS-012).

## Kiến trúc prototype

- `assets/app.js` - render **app shell** dùng chung cho mọi trang + **Theme Registry** ([DEC-006](../review/decision-log.md#dec-006)): mỗi theme khai báo nav pattern (`sidebar` | `topnav`), `App.layout()`/`App.setTheme()` render shell theo registry (đổi theme re-render shell tại chỗ, không reload); tiện ích `tab`, `pill`, `modal`, `toast`, `logout` và **theme switcher** (review-only). Mỗi trang chỉ chứa nội dung và gọi `App.layout('<id>')`. Màn đăng nhập là ngoại lệ - độc lập, không dùng app shell.
- `assets/theme-init.js` - nạp ở `<head>` (blocking) đọc `localStorage` (`g3proto:theme`/`g3proto:mode`) và set `data-theme`/`data-mode` lên `<html>` **trước khi paint** (tránh nháy theme); hỗ trợ `?theme=&mode=` và `?embed=1` (iframe so sánh, không persist).
- `assets/app.css` - bổ sung nhỏ (biểu đồ giả lập bằng CSS, source card, style bộ chọn theme...).
- `assets/design-system.css` (base + DS-001 Default), `assets/themes.css` (aggregator) và `assets/themes/*.css` (mỗi theme một **Presentation Theme** DS-002..005) - **bản build sinh tự động** từ SSOT [`../design/`](../design/) (đừng sửa tay; sửa ở `design/` rồi chạy `node .ai/scripts/sync-prototype-assets.js`). Kiến trúc Presentation Theme + token contract: [design/README.md](../design/README.md) mục 4, [rules/prototype-conventions.md](../rules/prototype-conventions.md) mục 6.
- `showcase.html` - **Theme Showcase** (review-only, cùng lớp chrome DEC-005/DEC-006, không có SC-xxx): trình diễn mọi nhóm component (KPI, filter bar, data table, form, tabs, workflow, timeline, panel, chart, modal, drawer, empty/loading/error/success) với cùng dataset mẫu; `?compare=1` xem 5 theme song song.

> Các nút thao tác (lưu, công bố, chốt kỳ, ký số...) hiển thị **toast** mô phỏng phản hồi; không thay đổi dữ liệu thật.
