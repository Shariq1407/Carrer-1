/* ============================================================
   Career Mate — Shared App Shell + Helpers
   ============================================================ */

/* ---------- tiny helpers ---------- */
function $(sel, root) { return (root || document).querySelector(sel); }
function $$(sel, root) { return Array.from((root || document).querySelectorAll(sel)); }

function escapeHtml(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function fmtMin(m) { return m >= 60 ? (m / 60).toFixed(m % 60 ? 1 : 0) + ' hr' : m + ' min'; }

function todayISO(offset) {
  const d = new Date();
  d.setDate(d.getDate() + (offset || 0));
  return d.toISOString().slice(0, 10);
}

function prettyDate(offset) {
  const d = new Date();
  d.setDate(d.getDate() + (offset || 0));
  return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
}

/* ---------- toast ---------- */
let toastTimer = null;
function toast(msg) {
  let el = $('#toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'toast';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2800);
}

/* ---------- generic modal ---------- */
function openModal(html) {
  const ov = $('#modal-overlay');
  ov.innerHTML = '<div class="modal">' + html + '</div>';
  ov.classList.add('open');
  ov.onclick = e => { if (e.target === ov) closeModal(); };
}
function closeModal() {
  const ov = $('#modal-overlay');
  ov.classList.remove('open');
  ov.innerHTML = '';
}

/* ---------- constants ---------- */
const NAV_ITEMS = [
  { href: 'dashboard.html',  icon: '🏠', label: 'Dashboard' },
  { href: 'education.html',  icon: '📚', label: 'Education' },
  { href: 'career.html',     icon: '🚀', label: 'Career' },
  { href: 'roadmap.html',    icon: '🗺️', label: 'Roadmaps' },
  { href: 'planner.html',    icon: '📅', label: 'Daily Planner' },
  { href: 'goals.html',      icon: '🎯', label: 'Goals' },
  { href: 'progress.html',   icon: '📈', label: 'Progress' },
  { href: 'assistant.html',  icon: '🤖', label: 'AI Assistant' },
  { href: 'community.html',  icon: '👥', label: 'Community' },
  { href: 'profile.html',    icon: '🧑‍💼', label: 'Profile' },
  { href: 'settings.html',   icon: '⚙️', label: 'Settings' }
];

const PRIORITY_BADGE = {
  high:   '<span class="badge badge-red">High</span>',
  medium: '<span class="badge badge-amber">Medium</span>',
  low:    '<span class="badge badge-gray">Low</span>'
};

/* ============================================================
   APP SHELL — injects sidebar + topbar into any dashboard page
   ============================================================ */
function initShell(activePage, options) {
  options = options || {};
  Store.load();
  let user = Store.user();

  /* open-preview mode: pages render without login.
     New registrations still land on onboarding via register flow. */
  if (!user) {
    Store.currentUserId = 'u1';
    user = Store.user();
  }

  /* only a real (logged-in) non-onboarded user goes to onboarding */
  if (Store.realLogin && !user.onboarded && !options.skipOnboardCheck) {
    location.replace('onboarding.html');
    throw new Error('CM_ONBOARDING_REQUIRED');
  }

  const title = options.title || activePage;

  document.body.innerHTML =
    '<div class="app-shell">' +
      '<aside class="sidebar" id="sidebar">' +
        '<div class="sidebar-brand">' +
          '<img src="assets/logo.svg" class="logo" alt="">' +
          '<span>Career Mate</span>' +
        '</div>' +
        '<nav class="sidebar-nav">' +
          NAV_ITEMS.map(n =>
            '<a href="' + n.href + '" class="' + (n.href.startsWith(activePage) ? 'active' : '') + '">' +
              '<span class="icon">' + n.icon + '</span>' + n.label +
            '</a>').join('') +
          (user.role === 'admin' || user.role === 'moderator'
            ? '<a href="admin.html"><span class="icon">🛡️</span>Admin Panel</a>' : '') +
        '</nav>' +
        '<div class="sidebar-foot">' +
          '<div class="sidebar-user">' +
            '<div class="avatar">' + escapeHtml(user.fullName.charAt(0)) + '</div>' +
            '<div>' +
              '<div class="name">' + escapeHtml(user.fullName) + '</div>' +
              '<div class="role">' + (user.role === 'admin' ? 'Super Admin' : user.role === 'moderator' ? 'Moderator' : user.verified ? 'Verified Student' : 'Student') + '</div>' +
            '</div>' +
            '<button class="icon-btn" style="margin-left:auto" title="Logout" id="logout-btn">⏏</button>' +
          '</div>' +
        '</div>' +
      '</aside>' +
      '<div class="sidebar-overlay" id="sidebar-overlay"></div>' +
      '<div class="main-area">' +
        '<header class="topbar">' +
          '<button class="icon-btn" id="hamburger" aria-label="Menu">☰</button>' +
          '<div class="page-title">' + escapeHtml(title) + '</div>' +
          '<div class="spacer"></div>' +
          '<a class="icon-btn" href="notifications.html" title="Notifications">🔔' +
            (Store.unreadCount() ? '<span class="dot"></span>' : '') + '</a>' +
        '</header>' +
        '<main class="content">' + (options.content || '') + '</main>' +
      '</div>' +
    '</div>' +
    '<div class="modal-overlay" id="modal-overlay"></div>';

  /* wire up */
  $('#hamburger').onclick = () => {
    $('#sidebar').classList.toggle('open');
    $('#sidebar-overlay').classList.toggle('show');
  };
  $('#sidebar-overlay').onclick = () => {
    $('#sidebar').classList.remove('open');
    $('#sidebar-overlay').classList.remove('show');
  };
  $('#logout-btn').onclick = () => {
    Store.logout();
    location.href = 'index.html';
  };
}

/* ============================================================
   PAGE RENDERERS (shared fragments)
   ============================================================ */

/* task row used on dashboard + planner */
function renderTaskRow(t, opts) {
  opts = opts || {};
  return '<div class="task-row' + (t.done ? ' done' : '') + '">' +
    '<button class="t-check" data-toggle-task="' + t.id + '" title="Toggle complete">✓</button>' +
    '<div class="t-main">' +
      '<div class="t-name">' + escapeHtml(t.name) + '</div>' +
      '<div class="t-meta">' +
        '<span>⏱ ' + fmtMin(t.minutes) + '</span>' +
        '<span>🔗 ' + escapeHtml(skillName(t.skill)) + '</span>' +
        PRIORITY_BADGE[t.priority] +
        (t.date < 0 ? '<span class="badge badge-red">Overdue</span>' : '') +
        (opts.showDate ? '<span>📅 ' + prettyDate(t.date) + '</span>' : '') +
      '</div>' +
    '</div>' +
    '<div class="rn-actions">' +
      (t.done ? '' : '<button class="btn btn-sm btn-primary" data-start-task="' + t.id + '">Start</button>') +
      '<button class="btn btn-sm btn-outline" data-delete-task="' + t.id + '" title="Delete">🗑</button>' +
    '</div>' +
  '</div>';
}

function skillName(id) {
  for (const c of CM_CAREERS) {
    const n = c.roadmap.find(r => r.id === id);
    if (n) return n.name;
  }
  return id;
}

/* global delegated handlers for task buttons (bound once per page) */
function bindTaskActions() {
  document.addEventListener('click', e => {
    const tog = e.target.closest('[data-toggle-task]');
    if (tog) {
      Store.toggleTask(tog.dataset.toggleTask);
      const row = tog.closest('.task-row');
      if (row) row.classList.toggle('done', true);
      toast('Task completed! 🎉');
      setTimeout(() => location.reload(), 350);
    }
    const start = e.target.closest('[data-start-task]');
    if (start) {
      const id = start.dataset.startTask;
      openModal(
        '<h3>Focus Session</h3>' +
        '<p class="muted small">Timer chalao aur task complete karo. Distraction-free!</p>' +
        '<div class="center" style="padding:22px 0">' +
          '<div id="focus-min" style="font-size:2.4rem;font-weight:850">25:00</div>' +
          '<p class="muted small" id="focus-task"></p>' +
        '</div>' +
        '<div class="modal-actions">' +
          '<button class="btn btn-outline" onclick="closeModal()">Cancel</button>' +
          '<button class="btn btn-primary" id="focus-done">Mark Done</button>' +
        '</div>');
      const task = Store.tasks.find(t => t.id === id);
      $('#focus-task').textContent = task ? task.name : '';
      let sec = 25 * 60;
      const iv = setInterval(() => {
        sec -= 60;
        const m = $('#focus-min');
        if (m && sec >= 0) m.textContent = String(Math.floor(sec / 60)).padStart(2, '0') + ':00';
        if (sec < 0) clearInterval(iv);
      }, 800);
      $('#focus-done').onclick = () => {
        clearInterval(iv);
        Store.toggleTask(id);
        closeModal();
        toast('Task completed! 🎉');
        setTimeout(() => location.reload(), 350);
      };
      return;
    }
    const del = e.target.closest('[data-delete-task]');
    if (del) {
      Store.deleteTask(del.dataset.deleteTask);
      toast('Task deleted');
      setTimeout(() => location.reload(), 350);
    }
  });
}

/* simple horizontal bar chart renderer */
function barChart(el, data) {
  /* data: [{ label, value, dim? }] */
  const max = Math.max.apply(null, data.map(d => d.value).concat([1]));
  el.innerHTML = data.map(d =>
    '<div class="bar-col">' +
      '<div class="b-val">' + d.value + '</div>' +
      '<div class="bar' + (d.dim ? ' dim' : '') + '" style="height:' + Math.round(d.value / max * 100) + '%"></div>' +
      '<div class="b-label">' + d.label + '</div>' +
    '</div>').join('');
}
