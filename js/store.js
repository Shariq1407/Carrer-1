/* ============================================================
   Career Mate — Store + Business Logic
   Deterministic task engine incl. falling-behind rescheduling.
   ============================================================ */

const Store = {
  /* ---------- state ---------- */
  users: [],
  tasks: [],
  posts: [],
  notifs: [],
  admin: null,
  currentUserId: null,

  /* ---------- persistence ---------- */
  load() {
    try {
      const users = JSON.parse(localStorage.getItem('cm_users'));
      const tasks = JSON.parse(localStorage.getItem('cm_tasks'));
      const posts = JSON.parse(localStorage.getItem('cm_posts'));
      const notifs = JSON.parse(localStorage.getItem('cm_notifs'));
      const admin = JSON.parse(localStorage.getItem('cm_admin'));
      const uid = JSON.parse(localStorage.getItem('cm_session'));
      if (users) {
        /* restore session; fall back to sample student for open-preview mode */
        this.currentUserId = (uid && users.some(u => u.id === uid)) ? uid : 'u1';
        /* migrate old sample names (one-time cleanup) */
        this.users.forEach(u => { if (u.fullName === 'Shariq Khan') u.fullName = 'Shariq'; });
        this.realLogin = this.currentUserId !== 'u1' || localStorage.getItem('cm_real') === '1';
        this.users = users;
        this.tasks = tasks || [];
        this.posts = posts || [];
        this.notifs = notifs || [];
        this.admin = admin;
        return;
      }
    } catch (e) { /* corrupted → reseed */ }
    this.seed();
  },

  save() {
    localStorage.setItem('cm_users', JSON.stringify(this.users));
    localStorage.setItem('cm_tasks', JSON.stringify(this.tasks));
    localStorage.setItem('cm_posts', JSON.stringify(this.posts));
    localStorage.setItem('cm_notifs', JSON.stringify(this.notifs));
    localStorage.setItem('cm_admin', JSON.stringify(this.admin));
    localStorage.setItem('cm_session', JSON.stringify(this.currentUserId));
    localStorage.setItem('cm_real', this.realLogin ? '1' : '0');
  },

  seed() {
    this.users = CM_SEED_USERS.map(u => Object.assign({}, u));
    this.tasks = CM_SEED_TASKS.map(t => Object.assign({}, t));
    this.posts = CM_SEED_POSTS.map(p => Object.assign({}, p, {
      comments: p.comments.map(c => Object.assign({}, c))
    }));
    this.notifs = CM_SEED_NOTIFS.map(n => Object.assign({}, n));
    this.admin = JSON.parse(JSON.stringify(CM_SEED_ADMIN));
    /* open-preview mode: pages render with the sample student (Shariq).
       Login/register replace this session with the real account. */
    this.currentUserId = 'u1';
    this.save();
  },

  reset() {
    ['cm_users', 'cm_tasks', 'cm_posts', 'cm_notifs', 'cm_admin', 'cm_session', 'cm_real']
      .forEach(k => localStorage.removeItem(k));
    this.seed();
  },

  /* ---------- session / users ---------- */
  user() { return this.users.find(u => u.id === this.currentUserId) || null; },
  userById(id) { return this.users.find(u => u.id === id) || null; },

  login(email, password) {
    const u = this.users.find(x =>
      x.email.toLowerCase() === email.toLowerCase().trim() && x.password === password);
    if (!u) return { ok: false, error: 'Invalid email or password.' };
    this.currentUserId = u.id;
    this.realLogin = true;
    this.save();
    return { ok: true, user: u };
  },

  register(data) {
    if (this.users.some(x => x.email.toLowerCase() === data.email.toLowerCase().trim()))
      return { ok: false, error: 'An account with this email already exists.' };
    const u = Object.assign({
      id: 'u' + (this.users.length + 1) + '-' + Date.now(),
      role: 'student', verified: false, streak: 0, longestStreak: 0,
      completedSkills: [], inProgressSkills: [], goalProgress: 0,
      onboarded: false,
      registeredOn: new Date().toISOString().slice(0, 10)
    }, data);
    this.users.push(u);
    this.currentUserId = u.id;
    this.realLogin = true;
    this.save();
    return { ok: true, user: u };
  },

  logout() {
    /* back to open-preview session (sample student) instead of blank */
    this.currentUserId = 'u1';
    this.save();
  },

  update(patch) {
    const u = this.user();
    if (!u) return;
    Object.assign(u, patch);
    this.save();
  },

  /* ---------- careers / goals ---------- */
  careerById(id) { return CM_CAREERS.find(c => c.id === id) || null; },

  skillState(careerId, nodeId) {
    const u = this.user();
    if (!u || u.goalId !== careerId) return 'locked';
    if ((u.completedSkills || []).includes(nodeId)) return 'completed';
    if ((u.inProgressSkills || []).includes(nodeId)) return 'inprogress';
    const career = this.careerById(careerId);
    const idx = career.roadmap.findIndex(n => n.id === nodeId);
    if (idx === 0) return 'inprogress';
    const prev = career.roadmap[idx - 1];
    if ((u.completedSkills || []).includes(prev.id)) return 'inprogress';
    return 'locked';
  },

  startSkill(careerId, nodeId) {
    const u = this.user();
    if (this.skillState(careerId, nodeId) === 'locked') return false;
    if (!u.inProgressSkills.includes(nodeId)) u.inProgressSkills.push(nodeId);
    u.completedSkills = u.completedSkills.filter(s => s !== nodeId);
    this.save();
    return true;
  },

  completeSkill(careerId, nodeId) {
    const u = this.user();
    if (this.skillState(careerId, nodeId) === 'locked') return false;
    u.inProgressSkills = u.inProgressSkills.filter(s => s !== nodeId);
    if (!u.completedSkills.includes(nodeId)) u.completedSkills.push(nodeId);
    const career = this.careerById(careerId);
    u.goalProgress = Math.round(u.completedSkills.length / career.roadmap.length * 100);
    if (u.goalProgress >= 100) this.completeGoal();
    this.recalcTasks();
    this.save();
    return true;
  },

  completeGoal() {
    const u = this.user();
    u.goalProgress = 100;
    u.completedSkills = this.careerById(u.goalId).roadmap.map(n => n.id);
    u.inProgressSkills = [];
    this.notifs.unshift({
      id: 'n' + Date.now(), userId: u.id, icon: '🏆',
      title: 'Goal complete! Roadmap finished — update your profile.',
      time: 'Just now', unread: true
    });
    this.save();
  },

  /* ---------- tasks / planner ---------- */
  /* dateOffset: 0 = today, negative = past, positive = future.
     Uses day index computed from "planner epoch" so past days stay fixed. */
  taskDate(t) {
    const epoch = new Date();
    epoch.setHours(0, 0, 0, 0);
    const d = new Date(epoch);
    d.setDate(d.getDate() + t.date);
    return d;
  },

  todayTasks(offset = 0) {
    const uid = this.currentUserId;
    return this.tasks.filter(t => t.userId === uid && t.date === offset);
  },

  /* tasks strictly before `offset` that are not done → overdue */
  overdueTasks(offset = 0) {
    const uid = this.currentUserId;
    return this.tasks
      .filter(t => t.userId === uid && t.date < offset && !t.done)
      .sort((a, b) => a.date - b.date);
  },

  /* rescheduling is run whenever the planner/dashboard renders day 0 */
  rescheduleRun() {
    const u = this.user();
    if (!u) return [];
    const moved = [];
    const MAX_CAPACITY_MULT = 1.2;                 /* 120% never exceeded */
    const priorityRank = { high: 0, medium: 1, low: 2 };

    /* group overdue tasks, oldest day first, prerequisites (high pr.) first */
    const overdue = this.overdueTasks(0);
    if (!overdue.length) return moved;

    /* bucket overdue by original day, then priority */
    const buckets = {};
    overdue.forEach(t => {
      (buckets[t.date] = buckets[t.date] || []).push(t);
    });

    /* future days already have booked minutes */
    const booked = {};
    this.tasks.filter(t => t.userId === u.id && t.date > 0 && !t.done)
      .forEach(t => { booked[t.date] = (booked[t.date] || 0) + t.minutes; });

    Object.keys(buckets).map(Number).sort((a, b) => a - b).forEach(day => {
      const tasksForDay = buckets[day]
        .slice()
        .sort((a, b) => priorityRank[a.priority] - priorityRank[b.priority]);
      tasksForDay.forEach(t => {
        /* find first future day with capacity */
        let target = null;
        for (let d = 1; d <= 14; d++) {
          const cap = u.dailyMinutes * MAX_CAPACITY_MULT;
          if ((booked[d] || 0) + t.minutes <= cap) { target = d; break; }
        }
        if (target === null) target = 1; /* fallback: tomorrow, cap sacrifice logged */
        t.date = target;
        booked[target] = (booked[target] || 0) + t.minutes;
        moved.push({ task: t, target });
      });
    });

    if (moved.length) {
      const d0 = this.taskDate(moved[0].target);
      const label = d0.toLocaleDateString('en-IN', { weekday: 'long' });
      const first = moved[0].task;
      this.notifs.unshift({
        id: 'n' + Date.now(), userId: u.id, icon: '📦',
        title: moved.length === 1
          ? `1 unfinished task (${first.name}) has been moved to ${label}.`
          : `${moved.length} unfinished tasks have been moved (first to ${label}).`,
        time: 'Just now', unread: true
      });
    }
    this.save();
    return moved;
  },

  /* rebuild daily tasks for the current roadmap when empty */
  recalcTasks() {
    const u = this.user();
    if (!u || !u.goalId) return;
    const career = this.careerById(u.goalId);
    const remaining = career.roadmap.filter(n => !u.completedSkills.includes(n.id));
    if (!remaining.length) return;
    const cur = this.tasks.filter(t => t.userId === u.id && !t.done && t.date >= 0);
    if (cur.length) return; /* user already has a plan */

    /* deterministic template: [45, 30, 60] pattern rotated across days */
    const pattern = [45, 30, 60];
    let day = 0, i = 0;
    remaining.slice(0, 9).forEach(skill => {
      const minutes = pattern[i % pattern.length];
      this.tasks.push({
        id: 't' + Date.now() + '-' + (i++),
        userId: u.id, date: day,
        name: skill.name + ' — Practice',
        skill: skill.id,
        minutes,
        priority: day === 0 ? 'high' : (i % 3 === 0 ? 'medium' : 'low'),
        done: false
      });
      if (i % 3 === 0) day++;
    });
    this.save();
  },

  addTask(task) {
    this.tasks.push(Object.assign({
      id: 't' + Date.now() + Math.random().toString(36).slice(2, 6),
      userId: this.currentUserId, date: 0, done: false, priority: 'medium'
    }, task));
    this.save();
  },

  toggleTask(id) {
    const t = this.tasks.find(x => x.id === id);
    if (!t) return;
    t.done = !t.done;
    if (t.done) {
      const u = this.user();
      if (u.streak === 0) u.streak = 1;
    }
    this.save();
  },

  deleteTask(id) {
    this.tasks = this.tasks.filter(t => t.id !== id);
    this.save();
  },

  plannedMinutes(offset) {
    return this.todayTasks(offset).reduce((s, t) => s + t.minutes, 0);
  },
  doneMinutes(offset) {
    return this.todayTasks(offset).filter(t => t.done).reduce((s, t) => s + t.minutes, 0);
  },

  /* ---------- streaks (deterministic from done tasks) ---------- */
  streakInfo() {
    const u = this.user();
    let longest = u.longestStreak || 0;
    /* compute a consistent current streak from history: count consecutive
       past days (before today) where at least one task was completed */
    let current = 0;
    for (let d = -1; d >= -30; d--) {
      const any = this.tasks.some(t => t.userId === u.id && t.date === d && t.done);
      if (any) current++;
      else break;
    }
    const todayDone = this.tasks.some(t => t.userId === u.id && t.date === 0 && t.done);
    if (todayDone) current++;
    if (current > longest) longest = current;
    if (longest > (u.longestStreak || 0)) { u.longestStreak = longest; this.save(); }
    return { current, longest };
  },

  /* ---------- goals ---------- */
  activeGoal() {
    const u = this.user();
    return u && u.goalId ? this.careerById(u.goalId) : null;
  },

  /* ---------- community ---------- */
  addPost(title, body, communityId) {
    const u = this.user();
    this.posts.unshift({
      id: 'p' + Date.now(), communityId,
      author: u.fullName, authorId: u.id, time: 'Just now',
      title, body, up: 0, down: 0, userVote: 0, comments: [], reported: false
    });
    this.save();
  },

  votePost(id, dir) {
    const p = this.posts.find(x => x.id === id);
    if (!p) return;
    if (p.userVote === dir) {           /* undo */
      if (dir === 1) p.up--; else p.down--;
      p.userVote = 0;
    } else {
      if (p.userVote === 1) p.up--;     /* switching */
      if (p.userVote === -1) p.down--;
      if (dir === 1) p.up++; else p.down++;
      p.userVote = dir;
    }
    this.save();
  },

  addComment(postId, text) {
    const p = this.posts.find(x => x.id === postId);
    const u = this.user();
    if (!p) return;
    p.comments.push({ author: u.fullName, text, time: 'Just now' });
    this.save();
  },

  reportPost(id) {
    const p = this.posts.find(x => x.id === id);
    if (!p || p.reported) return;
    p.reported = true;
    this.admin.reportedPosts.unshift({
      id: 'rp' + Date.now(), postId: p.id,
      title: p.title, reason: 'Reported by user', by: 'Anonymous', date: 'Just now'
    });
    this.save();
  },

  /* ---------- notifications ---------- */
  myNotifs() {
    return this.notifs.filter(n => n.userId === this.currentUserId);
  },
  unreadCount() {
    return this.myNotifs().filter(n => n.unread).length;
  },
  markAllRead() {
    this.myNotifs().forEach(n => n.unread = false);
    this.save();
  },
  pushNotif(icon, title) {
    this.notifs.unshift({
      id: 'n' + Date.now(), userId: this.currentUserId,
      icon, title, time: 'Just now', unread: true
    });
    this.save();
  },

  /* ---------- admin / moderation ---------- */
  approveResource(id) {
    const i = this.admin.pendingResources.findIndex(r => r.id === id);
    if (i < 0) return;
    const r = this.admin.pendingResources.splice(i, 1)[0];
    CM_RESOURCES.unshift({
      id: 'r' + Date.now(), subject: r.subject, type: r.type,
      title: r.title, year: new Date().getFullYear(),
      fileType: 'PDF', size: '—', uploads: 'Just now'
    });
    this.admin.auditLog.unshift({
      id: 'a' + Date.now(),
      action: `Approved resource "${r.title}"`,
      by: (this.user() ? this.user().fullName : 'Admin') + ' (Moderator)',
      time: 'Just now'
    });
    this.save();
  },

  rejectResource(id) {
    const i = this.admin.pendingResources.findIndex(r => r.id === id);
    if (i < 0) return;
    const r = this.admin.pendingResources.splice(i, 1)[0];
    this.admin.auditLog.unshift({
      id: 'a' + Date.now(),
      action: `Rejected resource "${r.title}"`,
      by: (this.user() ? this.user().fullName : 'Admin') + ' (Moderator)',
      time: 'Just now'
    });
    this.save();
  },

  resolveReport(id) {
    const i = this.admin.reportedPosts.findIndex(r => r.id === id);
    if (i < 0) return;
    const r = this.admin.reportedPosts.splice(i, 1)[0];
    this.admin.auditLog.unshift({
      id: 'a' + Date.now(),
      action: `Resolved report on "${r.title}"`,
      by: (this.user() ? this.user().fullName : 'Admin') + ' (Moderator)',
      time: 'Just now'
    });
    this.save();
  },

  setUserRole(userId, role) {
    const u = this.userById(userId);
    if (!u) return;
    u.role = role;
    this.admin.auditLog.unshift({
      id: 'a' + Date.now(),
      action: `Changed role of ${u.fullName} to ${role}`,
      by: (this.user() ? this.user().fullName : 'Admin') + ' (Admin)',
      time: 'Just now'
    });
    this.save();
  },

  verifyStudent(userId) {
    const u = this.userById(userId);
    if (!u) return;
    u.verified = true;
    this.admin.auditLog.unshift({
      id: 'a' + Date.now(),
      action: `Verified student: ${u.fullName}`,
      by: (this.user() ? this.user().fullName : 'Admin') + ' (Admin)',
      time: 'Just now'
    });
    this.save();
  }
};
