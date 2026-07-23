/* =====================================================================
   Prototype — App shell dùng chung (sidebar, topbar, tương tác)
   Render điều hướng cho toàn bộ màn hình, để mỗi trang chỉ chứa nội dung.
   Dữ liệu trong prototype là SAMPLE DATA cho nhà máy Nhiệt điện Vĩnh Tân 2.
   ===================================================================== */
(function () {
  "use strict";

  // ---- Nhà máy / kỳ đang làm việc (prototype: end-user chỉ phụ trách 1 NM) ----
  // Phú Mỹ 1 là nhà máy CHUẨN của bộ trình bày khách hàng (TASK-008): để đứng đầu
  // bộ chọn. Các màn vòng đời (thu thập/sự kiện/tính toán/hồ sơ) vẫn dùng SAMPLE DATA
  // nhiệt điện than Vĩnh Tân 2 (chưa có dữ liệu khí cho phần ngoài Pc), nên topbar của
  // các màn đó giữ nhãn Vĩnh Tân 2 để mỗi màn nhất quán; riêng cụm màn Tính Pc dùng dữ
  // liệu khảo sát Phú Mỹ nên hiển thị "Phú Mỹ 1" (xem plantForActive()).
  var PLANT = "Nhiệt điện Vĩnh Tân 2";
  var PLANTS = ["Phú Mỹ 1", "Phú Mỹ 2.1", "Phú Mỹ 2.1 MR", "Phú Mỹ 4", "Nhiệt điện Vĩnh Tân 2"];
  var PERIOD = "Tháng 05/2026";
  // Ngữ cảnh nhà máy hiển thị theo màn: cụm Tính Pc (active "pc") dùng dữ liệu Phú Mỹ.
  function plantForActive() { return App._active === "pc" ? "Phú Mỹ 1" : PLANT; }

  // ---- THEME REGISTRY (review-only; DEC-005 + DEC-006) ----
  // Điểm quản lý TẬP TRUNG duy nhất của khác biệt cấu trúc giữa các Presentation
  // Theme. Mỗi entry: tokens + recipe nằm ở assets/themes/<id>.css; phần cấu trúc
  // shell (nav pattern) khai báo ở đây để App.layout()/App.setTheme() render đúng.
  //   nav: "sidebar" (sidebar trái + topbar) | "topnav" (top navigation 2 tầng).
  // KHÔNG rải điều kiện theme ở trang/HTML - thêm theme mới = thêm 1 entry + 1 file CSS.
  var THEMES = [
    { id: "default", label: "Default", desc: "Material rút gọn (DS-001)", nav: "sidebar" },
    { id: "carbon",  label: "Carbon Energy", desc: "IBM Carbon (DS-002)", nav: "sidebar" },
    { id: "fluent",  label: "Fluent Liquid", desc: "Microsoft Fluent 2 (DS-003)", nav: "sidebar" },
    { id: "linear",  label: "Linear Energy", desc: "Linear + shadcn (DS-004)", nav: "sidebar" },
    { id: "vercel",  label: "Vercel Grid", desc: "Vercel Dashboard (DS-005)", nav: "topnav" }
  ];
  function themeMeta(id) {
    for (var i = 0; i < THEMES.length; i++) if (THEMES[i].id === id) return THEMES[i];
    return THEMES[0];
  }
  function themeLabel(id) { return themeMeta(id).label; }
  function currentTheme() { return document.documentElement.getAttribute("data-theme") || "default"; }
  function lsGet(k, d) { try { return localStorage.getItem(k) || d; } catch (_) { return d; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (_) {} }

  // ---- Icon set (lucide-style, 18x18) ----
  var I = {
    dashboard: '<path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>',
    collect:   '<path d="M21 12a9 9 0 1 1-6.2-8.6"/><path d="M21 3v6h-6"/>',
    event:     '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    calc:      '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h8M8 10h2M12 10h2M16 10h0M8 14h2M12 14h2M8 18h6"/>',
    pc:        '<path d="M4 20V7a3 3 0 0 1 3-3h1"/><path d="M3 12h7"/><path d="M13 9l7 8M20 9l-7 8"/>',
    dossier:   '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M9 13h6M9 17h6"/>',
    report:    '<path d="M3 3v18h18"/><path d="M7 16l4-5 3 3 5-7"/>',
    config:    '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
    bell:      '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>',
    search:    '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    upload:    '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M17 8l-5-5-5 5M12 3v12"/>',
    refresh:   '<path d="M3 12a9 9 0 0 1 9-9 9 9 0 0 1 6.7 3M21 3v6h-6"/><path d="M21 12a9 9 0 0 1-9 9 9 9 0 0 1-6.7-3M3 21v-6h6"/>',
    logout:    '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5M21 12H9"/>',
    palette:   '<circle cx="13.5" cy="6.5" r="1.3"/><circle cx="17" cy="10.5" r="1.3"/><circle cx="8.5" cy="7.5" r="1.3"/><circle cx="6.5" cy="12" r="1.3"/><path d="M12 2a10 10 0 0 0 0 20c1.1 0 2-.9 2-2 0-.5-.2-.9-.5-1.3-.3-.3-.5-.8-.5-1.2 0-1.1.9-2 2-2h1.5A4.5 4.5 0 0 0 21 11c0-5-4-9-9-9z"/>',
    sun:       '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon:      '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
    check:     '<path d="M20 6 9 17l-5-5"/>',
    panelLeft: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/>'
  };
  function icon(name, cls) {
    return '<svg class="ico ' + (cls || '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + (I[name] || '') + '</svg>';
  }

  // ---- Cấu trúc điều hướng ----
  // Dashboard KHÔNG còn là mục nav (DEC-021): nội dung dashboard nay là khu 2 của
  // Trang chào (route "/" = index.html). Về Trang chào bằng cách bấm logo. NAV cũng
  // là NGUỒN CHUẨN cho module launcher của Trang chào (renderWelcomeLauncher()).
  var NAV = [
    { group: "Quy trình lập hồ sơ", items: [
      { id: "collect",  label: "Thu thập dữ liệu",   icon: "collect",  href: "thu-thap-du-lieu.html" },
      { id: "event",    label: "Sự kiện vận hành",   icon: "event",    href: "su-kien.html", badge: "2" },
      { id: "pc",       label: "Tính Pc",             icon: "pc",       href: "tinh-pc.html" },
      { id: "calc",     label: "Tính toán và tổng hợp", icon: "calc",   href: "tinh-toan.html" },
      { id: "dossier",  label: "Tổng hợp hồ sơ",     icon: "dossier",  href: "ho-so-chi-tiet.html" },
      { id: "calc-config", label: "Cấu hình tính toán", icon: "config", href: "cau-hinh-tinh-toan.html" }
    ]},
    { group: "Giám sát & quản trị", items: [
      { id: "report",   label: "Giám sát và báo cáo", icon: "report",   href: "bao-cao.html" },
      { id: "config",   label: "Danh mục & cấu hình", icon: "config",  href: "cau-hinh.html" }
    ]}
  ];

  function renderSidebar(active) {
    var html = '' +
      '<div class="sidebar__brand">' +
        '<a class="sidebar__brandlink" href="index.html" title="Về Trang chào">' +
          '<div class="sidebar__logo">G3</div>' +
          '<div><b>Thanh toán điện</b><span>GENCO3 · v1.0</span></div>' +
        '</a>' +
        '<button class="sidebar__toggle" title="Thu gọn/mở rộng menu" ' +
          'onclick="App.toggleSidebar()">' + icon('panelLeft') + '</button>' +
      '</div>' +
      '<nav class="sidebar__nav">';
    NAV.forEach(function (g) {
      html += '<div class="nav-group__label">' + g.group + '</div>';
      g.items.forEach(function (it) {
        var on = it.id === active ? ' is-active' : '';
        var badge = it.badge ? '<span class="nav-link__badge">' + it.badge + '</span>' : '';
        html += '<a class="nav-link' + on + '" href="' + it.href + '">' + icon(it.icon) +
                '<span>' + it.label + '</span>' + badge + '</a>';
      });
    });
    html += '</nav>' +
      '<div class="sidebar__foot">Phạm vi: <b style="color:var(--sidebar-ink-strong)">1 nhà máy</b><br>Phân công chuyên viên thanh toán.</div>';
    return html;
  }

  // ---- Top navigation (nav pattern "topnav", DEC-006) - brand + điều khiển ngữ
  //      cảnh ở hàng 1, tab điều hướng hàng 2. Dùng chung NAV với sidebar. ----
  function renderTopnav(active) {
    var tabs = '';
    NAV.forEach(function (g) {
      g.items.forEach(function (it) {
        var on = it.id === active ? ' is-active' : '';
        var badge = it.badge ? '<span class="nav-link__badge">' + it.badge + '</span>' : '';
        tabs += '<a class="topnav__link' + on + '" href="' + it.href + '">' + icon(it.icon) +
                '<span>' + it.label + '</span>' + badge + '</a>';
      });
    });
    return '' +
      '<div class="topnav__row">' +
        '<a class="topnav__brand" href="index.html" title="Về Trang chào">' +
          '<div class="sidebar__logo">G3</div>' +
          '<div><b>Thanh toán điện</b><span>GENCO3 · v1.0</span></div>' +
        '</a>' +
        renderTopbar() +
      '</div>' +
      '<nav class="topnav__tabs">' + tabs + '</nav>';
  }

  // ---- Theme switcher (review-only) — đặt cạnh topbar__user ----
  function renderThemeControl() {
    var curTheme = document.documentElement.getAttribute("data-theme") || "default";
    var opts = THEMES.map(function (t) {
      var on = t.id === curTheme ? " is-active" : "";
      return '<button class="theme-opt' + on + '" data-theme-id="' + t.id + '" onclick="App.setTheme(\'' + t.id + '\')">' +
        '<span class="theme-opt__sw theme-sw--' + t.id + '"></span>' +
        '<span class="theme-opt__txt"><b>' + t.label + '</b><small>' + t.desc + '</small></span>' +
        '<span class="theme-opt__check">' + icon('check') + '</span>' +
      '</button>';
    }).join('');
    var darkOn = (document.documentElement.getAttribute("data-mode") === "dark");
    return '' +
      '<div class="theme-switch" id="themeSwitch">' +
        '<button class="topbar__icon-btn" title="Đổi Design System (chỉ để review)" onclick="App.toggleThemeMenu(event)">' + icon('palette') + '</button>' +
        '<div class="theme-menu" id="themeMenu">' +
          '<div class="theme-menu__head">Design System <span>review</span></div>' +
          '<div class="theme-menu__list">' + opts + '</div>' +
          '<div class="theme-menu__mode">' +
            '<span class="theme-menu__mode-lbl">' + icon('moon') + ' Chế độ tối</span>' +
            '<label class="switch"><input type="checkbox" id="themeModeToggle"' + (darkOn ? ' checked' : '') +
              ' onchange="App.setMode(this.checked ? \'dark\' : \'light\')"><span class="slider"></span></label>' +
          '</div>' +
          '<a class="theme-menu__link" href="showcase.html">Theme Showcase - so sánh 5 giao diện</a>' +
        '</div>' +
      '</div>';
  }

  function renderTopbar() {
    var curPlant = plantForActive();
    var opts = PLANTS.map(function (p) {
      return '<option' + (p === curPlant ? ' selected' : '') + '>' + p + '</option>';
    }).join('');
    return '' +
      '<div class="topbar__plant" title="Người dùng được phân công 1 nhà máy">' +
        '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 21h18M5 21V7l7-4 7 4v14M9 9h0M9 13h0M9 17h0M15 9h0M15 13h0M15 17h0"/></svg>' +
        '<select onchange="App.toast(\'Đã chuyển ngữ cảnh nhà máy (prototype)\')">' + opts + '</select>' +
      '</div>' +
      '<div class="topbar__plant" title="Tháng hồ sơ đang thao tác (Biên bản 03)">' +
        '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>' +
        '<select onchange="App.toast(\'Đã chuyển tháng hồ sơ (prototype)\')"><option>Tháng 05/2026</option><option>Tháng 04/2026</option><option>Tháng 03/2026</option></select>' +
      '</div>' +
      '<div class="topbar__spacer"></div>' +
      '<div class="topbar__period">' +
        '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>' +
        PERIOD +
      '</div>' +
      '<button class="topbar__icon-btn" onclick="App.toast(\'Tìm kiếm (prototype)\')">' + icon('search') + '</button>' +
      '<button class="topbar__icon-btn" onclick="App.toast(\'3 thông báo mới (prototype)\')">' + icon('bell') + '<span class="dot"></span></button>' +
      renderThemeControl() +
      '<div class="topbar__user" title="Tài khoản — bấm để đổi mật khẩu" onclick="App.openChangePw()">' +
        '<div class="avatar">TS</div>' +
        '<div><b>Trần Khánh Duy</b><small>Chuyên viên thanh toán</small></div>' +
      '</div>' +
      '<button class="topbar__icon-btn" title="Đăng xuất" onclick="App.logout()">' + icon('logout') + '</button>';
  }

  // ---- Trang chào / Welcome (SC-021, DEC-021) ----
  // Header tối giản: logo (link về "/") + switch theme + thông tin user. KHÔNG dùng
  // app shell sidebar/topnav - module launcher thay vai trò điều hướng.
  function renderWelcomeHeader() {
    return '' +
      '<a class="welcome__brand" href="index.html" title="Trang chào">' +
        '<div class="sidebar__logo">G3</div>' +
        '<div><b>Thanh toán điện</b><span>GENCO3 · v1.0</span></div>' +
      '</a>' +
      '<div class="welcome__spacer"></div>' +
      renderThemeControl() +
      '<div class="topbar__user" title="Tài khoản — bấm để đổi mật khẩu" onclick="App.openChangePw()">' +
        '<div class="avatar">TS</div>' +
        '<div><b>Trần Khánh Duy</b><small>Chuyên viên thanh toán</small></div>' +
      '</div>' +
      '<button class="topbar__icon-btn" title="Đăng xuất" onclick="App.logout()">' + icon('logout') + '</button>';
  }

  // Module launcher: 8 mô-đun = toàn bộ NAV (Dashboard đã bị loại khỏi NAV, DEC-021),
  // xếp 2 dòng bằng grid; nguồn chuẩn là NAV nên không lệch với sidebar trang con.
  function renderWelcomeLauncher() {
    var html = '';
    NAV.forEach(function (g) {
      g.items.forEach(function (it) {
        var badge = it.badge ? '<span class="welcome-mod__badge">' + it.badge + '</span>' : '';
        html += '<a class="welcome-mod" href="' + it.href + '">' +
          '<span class="welcome-mod__icon">' + icon(it.icon) + '</span>' +
          '<span class="welcome-mod__txt"><span class="welcome-mod__label">' + it.label + '</span></span>' +
          badge +
        '</a>';
      });
    });
    return html;
  }

  // ---- Modal đổi mật khẩu (SC-010) — dùng chung ở app shell, mở từ topbar__user ----
  function renderChangePwModal() {
    return '' +
      '<div class="modal-overlay" id="m-changepw"><div class="modal">' +
        '<div class="modal__head"><h3>Đổi mật khẩu</h3>' +
          '<button class="modal__close" onclick="App.closeModal(\'m-changepw\')">×</button></div>' +
        '<div class="modal__body">' +
          '<div class="alert alert--danger" id="cpw-err" style="display:none;margin-bottom:var(--sp-4)">' +
            '<span class="ico">✕</span><div id="cpw-err-msg"></div></div>' +
          '<div class="field"><label class="label">Mật khẩu cũ</label>' +
            '<input type="password" class="input" id="cpw-old" placeholder="Nhập mật khẩu hiện tại"></div>' +
          '<div class="field"><label class="label">Mật khẩu mới</label>' +
            '<input type="password" class="input" id="cpw-new" placeholder="Nhập mật khẩu mới"></div>' +
          '<div class="field" style="margin-bottom:0"><label class="label">Nhập lại mật khẩu mới</label>' +
            '<input type="password" class="input" id="cpw-confirm" placeholder="Nhập lại mật khẩu mới"></div>' +
          '<div class="hint" style="margin-top:var(--sp-3)">Chính sách độ mạnh mật khẩu áp theo cấu hình hệ thống (prototype — cần xác nhận).</div>' +
        '</div>' +
        '<div class="modal__foot">' +
          '<button class="btn btn-secondary" onclick="App.closeModal(\'m-changepw\')">Hủy</button>' +
          '<button class="btn btn-primary" onclick="App.submitChangePw()">OK</button>' +
        '</div>' +
      '</div></div>';
  }

  // ---- Public API ----
  var App = {
    plant: PLANT, period: PERIOD, icon: icon,

    layout: function (activeId) {
      App._active = activeId;
      App._renderShell();
      App._mountShared();
    },

    // Trang chào (SC-021, DEC-021): render header tối giản + module launcher vào
    // khung .welcome; KHÔNG dùng app shell sidebar/topnav. Nội dung dashboard (khu 2)
    // đã nằm sẵn trong HTML (khối SC-001).
    welcome: function () {
      App._active = "welcome";
      var root = document.querySelector(".welcome");
      if (root && !root.querySelector(".welcome__header")) {
        var header = document.createElement("header");
        header.className = "welcome__header";
        header.innerHTML = renderWelcomeHeader();
        root.insertBefore(header, root.firstChild);
      }
      var launcher = document.getElementById("welcomeLauncher");
      if (launcher) launcher.innerHTML = renderWelcomeLauncher();
      App._mountShared();
      App._syncThemeUI();
    },

    // Thiết lập dùng chung cho mọi màn: toast container, modal đổi mật khẩu (SC-010),
    // đóng theme menu khi bấm ra ngoài.
    _mountShared: function () {
      if (!document.querySelector(".toast-wrap")) {
        var tw = document.createElement("div"); tw.className = "toast-wrap"; document.body.appendChild(tw);
      }
      if (!document.getElementById("m-changepw")) {
        var holder = document.createElement("div"); holder.innerHTML = renderChangePwModal();
        document.body.appendChild(holder.firstChild);
      }
      if (!App._themeDocBound) {
        document.addEventListener("click", function (e) {
          var sw = document.getElementById("themeSwitch");
          var menu = document.getElementById("themeMenu");
          if (menu && sw && !sw.contains(e.target)) menu.classList.remove("is-open");
        });
        App._themeDocBound = true;
      }
    },

    // Render app shell theo Theme Registry (DEC-006). Gọi lại khi đổi theme:
    // chỉ thay chrome (sidebar/topbar/topnav), KHÔNG đụng nội dung trang =>
    // không reload, không mất state/dữ liệu đang nhập, không đổi route.
    _renderShell: function () {
      var app = document.querySelector(".app");
      if (!app) return;
      var meta = themeMeta(currentTheme());
      var main = app.querySelector(".main");
      // gỡ chrome cũ (nếu có) trước khi render theo nav pattern mới
      app.querySelectorAll(":scope > .sidebar, :scope > .main > .topbar, :scope > .main > .topnav")
        .forEach(function (el) { el.remove(); });
      document.documentElement.setAttribute("data-nav", meta.nav);
      if (meta.nav === "topnav") {
        var tn = document.createElement("header"); tn.className = "topnav";
        tn.innerHTML = renderTopnav(App._active);
        main.insertBefore(tn, main.firstChild);
      } else {
        var sb = document.createElement("aside"); sb.className = "sidebar";
        sb.innerHTML = renderSidebar(App._active);
        var tb = document.createElement("header"); tb.className = "topbar";
        tb.innerHTML = renderTopbar();
        app.insertBefore(sb, app.firstChild);
        main.insertBefore(tb, main.firstChild);
      }
      App._syncThemeUI();
      // Thu gọn/mở rộng menu (FR-050): khôi phục trạng thái, chỉ áp cho nav sidebar.
      if (meta.nav === "sidebar" && lsGet("g3proto:nav", "expanded") === "collapsed") {
        app.classList.add("is-nav-collapsed");
      } else {
        app.classList.remove("is-nav-collapsed");
      }
    },

    logout: function () { window.location.href = "dang-nhap.html"; },

    // ---- Thu gọn/mở rộng menu chính (FR-050 / FL-018 / SC-015, Biên bản 004) ----
    toggleSidebar: function () {
      var app = document.querySelector(".app");
      if (!app) return;
      var collapsed = app.classList.toggle("is-nav-collapsed");
      lsSet("g3proto:nav", collapsed ? "collapsed" : "expanded");
    },

    // ---- Theme switcher (review-only, DEC-005/DEC-006) ----
    setTheme: function (id) {
      var menuOpen = (function () {
        var m = document.getElementById("themeMenu");
        return !!(m && m.classList.contains("is-open"));
      })();
      document.documentElement.setAttribute("data-theme", id);
      lsSet("g3proto:theme", id);
      // Presentation Theme: re-render app shell tại chỗ theo nav pattern của theme.
      // Trên Trang chào không có .app (_renderShell noop) - gradient/launcher đổi theo
      // token bằng CSS; _syncThemeUI cập nhật trạng thái chọn trong theme menu.
      App._renderShell();
      App._syncThemeUI();
      if (menuOpen) {
        var m = document.getElementById("themeMenu");
        if (m) m.classList.add("is-open");
      }
      App.toast("Presentation Theme: " + themeLabel(id) + " (review)");
    },
    setMode: function (mode) {
      document.documentElement.setAttribute("data-mode", mode);
      lsSet("g3proto:mode", mode);
      App._syncThemeUI();
    },
    toggleThemeMenu: function (ev) {
      if (ev) ev.stopPropagation();
      var m = document.getElementById("themeMenu");
      if (m) m.classList.toggle("is-open");
    },
    _syncThemeUI: function () {
      var t = document.documentElement.getAttribute("data-theme") || "default";
      var m = document.documentElement.getAttribute("data-mode") || "light";
      var opts = document.querySelectorAll(".theme-opt");
      opts.forEach(function (o) { o.classList.toggle("is-active", o.getAttribute("data-theme-id") === t); });
      var tg = document.getElementById("themeModeToggle");
      if (tg) tg.checked = (m === "dark");
    },

    // ---- Đổi mật khẩu (FL-011 / SC-010) ----
    openChangePw: function () {
      ["cpw-old", "cpw-new", "cpw-confirm"].forEach(function (id) {
        var el = document.getElementById(id); if (el) el.value = "";
      });
      var err = document.getElementById("cpw-err"); if (err) err.style.display = "none";
      App.modal("m-changepw");
    },
    submitChangePw: function () {
      var oldpw = (document.getElementById("cpw-old") || {}).value || "";
      var newpw = (document.getElementById("cpw-new") || {}).value || "";
      var confirmpw = (document.getElementById("cpw-confirm") || {}).value || "";
      var err = document.getElementById("cpw-err");
      var msg = document.getElementById("cpw-err-msg");
      function fail(text) { if (msg) msg.textContent = text; if (err) err.style.display = "flex"; }
      if (!oldpw || !newpw || !confirmpw) { fail("Vui lòng nhập đủ ba trường mật khẩu."); return; }
      if (newpw !== confirmpw) { fail("Mật khẩu mới và ô nhập lại không khớp."); return; }
      // Prototype: giả lập kiểm tra mật khẩu cũ đúng; sai mật khẩu cũ do backend xác thực thật.
      App.closeModal("m-changepw");
      App.toast("Đã đổi mật khẩu thành công", "success");
    },

    tab: function (el, panelId) {
      var tabs = el.parentElement.querySelectorAll(".tab");
      tabs.forEach(function (t) { t.classList.remove("is-active"); });
      el.classList.add("is-active");
      var root = document.getElementById(panelId).parentElement;
      root.querySelectorAll(":scope > .tabpanel").forEach(function (p) { p.classList.remove("is-active"); });
      document.getElementById(panelId).classList.add("is-active");
    },

    pill: function (el) {
      el.parentElement.querySelectorAll(".pill").forEach(function (p) { p.classList.remove("is-active"); });
      el.classList.add("is-active");
    },

    modal: function (id, open) {
      var m = document.getElementById(id);
      if (m) m.classList.toggle("is-open", open !== false);
    },
    closeModal: function (id) { var m = document.getElementById(id); if (m) m.classList.remove("is-open"); },

    toast: function (msg, type) {
      var tw = document.querySelector(".toast-wrap");
      if (!tw) { tw = document.createElement("div"); tw.className = "toast-wrap"; document.body.appendChild(tw); }
      var t = document.createElement("div");
      t.className = "toast" + (type ? " toast--" + type : "");
      t.innerHTML = (type === "success" ? "✓ " : type === "danger" ? "✕ " : "ℹ ") + msg;
      tw.appendChild(t);
      setTimeout(function () { t.style.opacity = "0"; t.style.transition = "opacity .3s";
        setTimeout(function () { t.remove(); }, 300); }, 2600);
    }
  };

  window.App = App;
})();
