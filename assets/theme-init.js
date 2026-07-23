/* =====================================================================
   Anti-flash theme init (DEC-005) — nạp ở <head> BLOCKING, chạy TRƯỚC khi
   paint để tránh nháy theme. Đọc tùy chọn review từ localStorage và set
   data-theme / data-mode lên <html>. Progressive enhancement: không có
   localStorage (vd file://) thì rơi về Default/light, không vỡ trang.
   Trục: data-theme = default|carbon|fluent|linear|vercel ; data-mode = light|dark.
   ===================================================================== */
(function () {
  var VALID_THEME = { default: 1, carbon: 1, fluent: 1, linear: 1, vercel: 1 };
  var VALID_MODE = { light: 1, dark: 1 };
  var t = "default", m = "light";
  try {
    t = localStorage.getItem("g3proto:theme") || "default";
    m = localStorage.getItem("g3proto:mode") || "light";
  } catch (_) { /* file:// hoặc bị chặn — dùng mặc định */ }
  // Override qua query (?theme=carbon&mode=dark) — tiện chia sẻ link review; persist nếu có localStorage.
  // ?embed=1 (DEC-006): trang chạy trong iframe so sánh của showcase — áp theme
  // từ query nhưng KHÔNG persist (tránh các iframe ghi đè lựa chọn của người dùng).
  var embed = /[?&]embed=1/.test(location.search || "");
  var q = (location.search || "").match(/[?&]theme=([^&]+)/);
  var qm = (location.search || "").match(/[?&]mode=([^&]+)/);
  if (q && VALID_THEME[q[1]]) { t = q[1]; if (!embed) { try { localStorage.setItem("g3proto:theme", t); } catch (_) {} } }
  if (qm && VALID_MODE[qm[1]]) { m = qm[1]; if (!embed) { try { localStorage.setItem("g3proto:mode", m); } catch (_) {} } }
  if (!VALID_THEME[t]) t = "default";
  if (!VALID_MODE[m]) m = "light";
  var e = document.documentElement;
  e.setAttribute("data-theme", t);
  e.setAttribute("data-mode", m);
  if (embed) e.setAttribute("data-embed", "1");
})();
