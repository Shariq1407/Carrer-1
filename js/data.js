/* ============================================================
   Career Mate — Sample Data Store
   All realistic demo data lives here. localStorage persistence
   handled in store.js.
   ============================================================ */

/* ---------- Education hierarchy ---------- */
const CM_UNIVERSITIES = [
  { id: 'aktu', name: 'Dr. A.P.J. Abdul Kalam Technical University', short: 'AKTU' },
  { id: 'du',   name: 'University of Delhi', short: 'DU' },
  { id: 'ipu',  name: 'Guru Gobind Singh Indraprastha University', short: 'IPU' },
  { id: 'mdu',  name: 'Mumbai University', short: 'MU' }
];

const CM_PROGRAMS = [
  { id: 'btech-cse', name: 'B.Tech CSE', icon: '⚙️', universities: ['aktu', 'du', 'ipu', 'mdu'] },
  { id: 'bca',       name: 'BCA',        icon: '💻', universities: ['aktu', 'du', 'ipu', 'mdu'] },
  { id: 'btech-it',  name: 'B.Tech IT',  icon: '🌐', universities: ['aktu', 'ipu'] }
];

const CM_SEMESTERS = [1, 2, 3, 4, 5, 6];

const CM_SUBJECTS = {
  'btech-cse:4': [
    { id: 'dbms',   name: 'DBMS',                  icon: '🗄️', code: 'KCS-402' },
    { id: 'os',     name: 'Operating Systems',     icon: '🧠', code: 'KCS-401' },
    { id: 'daa',    name: 'Design & Analysis of Algorithms', icon: '📐', code: 'KCS-403' },
    { id: 'micp',   name: 'Microprocessors',       icon: '🔧', code: 'KCS-404' }
  ],
  'bca:4': [
    { id: 'dbms',   name: 'DBMS',                  icon: '🗄️', code: 'BCA-204' },
    { id: 'java',   name: 'Java Programming',      icon: '☕', code: 'BCA-205' },
    { id: 'web',    name: 'Web Technologies',      icon: '🌍', code: 'BCA-206' },
    { id: 'stats',  name: 'Statistics',            icon: '📊', code: 'BCA-207' }
  ],
  'btech-cse:3': [
    { id: 'ds',     name: 'Data Structures',       icon: '🧩', code: 'KCS-301' },
    { id: 'coa',    name: 'Computer Organization', icon: '🔡', code: 'KCS-302' },
    { id: 'oops',   name: 'OOP with C++',          icon: '🧱', code: 'KCS-303' }
  ],
  'bca:2': [
    { id: 'c',      name: 'C Programming',         icon: '🔤', code: 'BCA-102' },
    { id: 'maths',  name: 'Discrete Mathematics',  icon: '➗', code: 'BCA-103' }
  ]
};

/* fallback subjects for combos without curated data */
function cmSubjectsFor(programId, sem) {
  return CM_SUBJECTS[programId + ':' + sem] ||
    [{ id: 'core', name: 'Core Subjects', icon: '📘', code: 'GEN-00' }];
}

/* ---------- Resource library ---------- */
/* type: syllabus | pyq | notes | lab | ref */
const CM_RESOURCES = [
  { id: 'r1',  subject: 'dbms', type: 'syllabus', title: 'DBMS Complete Syllabus 2025', year: 2025, fileType: 'PDF', size: '412 KB', uploads: '3 weeks ago' },
  { id: 'r2',  subject: 'dbms', type: 'pyq',   title: 'DBMS PYQ — Semester 4 2024', year: 2024, fileType: 'PDF', size: '1.2 MB', uploads: '2 months ago' },
  { id: 'r3',  subject: 'dbms', type: 'pyq',   title: 'DBMS PYQ — Semester 4 2023', year: 2023, fileType: 'PDF', size: '1.1 MB', uploads: '3 months ago' },
  { id: 'r4',  subject: 'dbms', type: 'notes', title: 'Normalization (1NF–BCNF) Notes', year: 2025, fileType: 'PDF', size: '890 KB', uploads: '5 days ago' },
  { id: 'r5',  subject: 'dbms', type: 'notes', title: 'ER Model + Relational Algebra Notes', year: 2025, fileType: 'PDF', size: '760 KB', uploads: '1 week ago' },
  { id: 'r6',  subject: 'dbms', type: 'notes', title: 'Transactions & ACID Notes', year: 2024, fileType: 'DOC', size: '320 KB', uploads: '2 months ago' },
  { id: 'r7',  subject: 'dbms', type: 'lab',   title: 'SQL Lab File — All Experiments', year: 2025, fileType: 'PDF', size: '2.1 MB', uploads: '1 month ago' },
  { id: 'r8',  subject: 'dbms', type: 'lab',   title: 'ER Diagram Practice Sheets', year: 2024, fileType: 'IMG', size: '640 KB', uploads: '2 months ago' },
  { id: 'r9',  subject: 'dbms', type: 'ref',   title: 'SQL Practice Question Bank', year: 2025, fileType: 'PDF', size: '980 KB', uploads: '4 days ago' },
  { id: 'r10', subject: 'dbms', type: 'ref',   title: 'DBMS Viva Questions', year: 2025, fileType: 'PDF', size: '300 KB', uploads: '1 week ago' },
  { id: 'r11', subject: 'dbms', type: 'pyq',   title: 'DBMS Unit-wise PYQs (2018–2023)', year: 2023, fileType: 'PDF', size: '1.8 MB', uploads: '4 months ago' },
  { id: 'r12', subject: 'dbms', type: 'notes', title: 'Indexing & Hashing Notes', year: 2024, fileType: 'PDF', size: '540 KB', uploads: '3 weeks ago' },

  { id: 'r20', subject: 'os',   type: 'syllabus', title: 'OS Syllabus 2025', year: 2025, fileType: 'PDF', size: '380 KB', uploads: '3 weeks ago' },
  { id: 'r21', subject: 'os',   type: 'pyq',   title: 'OS PYQ — 2024', year: 2024, fileType: 'PDF', size: '1.0 MB', uploads: '2 months ago' },
  { id: 'r22', subject: 'os',   type: 'notes', title: 'Process Scheduling Notes', year: 2025, fileType: 'PDF', size: '820 KB', uploads: '1 week ago' },
  { id: 'r23', subject: 'os',   type: 'notes', title: 'Deadlocks — Full Notes', year: 2024, fileType: 'PDF', size: '710 KB', uploads: '1 month ago' },
  { id: 'r24', subject: 'os',   type: 'lab',   title: 'Shell Scripting Lab File', year: 2025, fileType: 'PDF', size: '1.4 MB', uploads: '3 weeks ago' },
  { id: 'r25', subject: 'os',   type: 'ref',   title: 'OS Numerical Practice Set', year: 2025, fileType: 'PDF', size: '460 KB', uploads: '2 weeks ago' },

  { id: 'r30', subject: 'ds',   type: 'syllabus', title: 'Data Structures Syllabus 2025', year: 2025, fileType: 'PDF', size: '350 KB', uploads: '1 month ago' },
  { id: 'r31', subject: 'ds',   type: 'pyq',   title: 'DS PYQ — 2024', year: 2024, fileType: 'PDF', size: '1.3 MB', uploads: '2 months ago' },
  { id: 'r32', subject: 'ds',   type: 'notes', title: 'Trees & Graphs Notes', year: 2025, fileType: 'PDF', size: '910 KB', uploads: '5 days ago' },
  { id: 'r33', subject: 'ds',   type: 'lab',   title: 'Linked List Lab Programs', year: 2025, fileType: 'PDF', size: '780 KB', uploads: '2 weeks ago' },

  { id: 'r40', subject: 'java', type: 'syllabus', title: 'Java Programming Syllabus', year: 2025, fileType: 'PDF', size: '290 KB', uploads: '1 month ago' },
  { id: 'r41', subject: 'java', type: 'notes', title: 'OOP Concepts in Java Notes', year: 2025, fileType: 'PDF', size: '830 KB', uploads: '1 week ago' },
  { id: 'r42', subject: 'java', type: 'lab',   title: 'Java Lab Programs (30 Programs)', year: 2025, fileType: 'PDF', size: '1.6 MB', uploads: '2 weeks ago' },
  { id: 'r43', subject: 'java', type: 'pyq',   title: 'Java PYQ — 2024', year: 2024, fileType: 'PDF', size: '1.0 MB', uploads: '2 months ago' },

  { id: 'r50', subject: 'web',  type: 'syllabus', title: 'Web Technologies Syllabus', year: 2025, fileType: 'PDF', size: '280 KB', uploads: '1 month ago' },
  { id: 'r51', subject: 'web',  type: 'notes', title: 'HTML + CSS Complete Notes', year: 2025, fileType: 'PDF', size: '1.1 MB', uploads: '3 days ago' },
  { id: 'r52', subject: 'web',  type: 'notes', title: 'JavaScript Fundamentals Notes', year: 2025, fileType: 'PDF', size: '960 KB', uploads: '1 week ago' },
  { id: 'r53', subject: 'web',  type: 'lab',   title: 'Web Lab — Mini Website Project', year: 2025, fileType: 'PDF', size: '1.2 MB', uploads: '2 weeks ago' },

  { id: 'r60', subject: 'daa',  type: 'pyq',   title: 'DAA PYQ — 2024', year: 2024, fileType: 'PDF', size: '1.1 MB', uploads: '1 month ago' },
  { id: 'r61', subject: 'daa',  type: 'notes', title: 'Greedy + DP Algorithms Notes', year: 2025, fileType: 'PDF', size: '870 KB', uploads: '2 weeks ago' },

  { id: 'r70', subject: 'core', type: 'syllabus', title: 'Semester Syllabus (Generic)', year: 2025, fileType: 'PDF', size: '300 KB', uploads: '2 weeks ago' },
  { id: 'r71', subject: 'core', type: 'pyq',   title: 'Semester PYQ — 2024', year: 2024, fileType: 'PDF', size: '900 KB', uploads: '1 month ago' }
];

/* syllabus unit breakdown per subject */
const CM_SYLLABUS = {
  dbms: [
    { unit: 'U1', name: 'Introduction: DBMS architecture, ER model' },
    { unit: 'U2', name: 'Relational model, algebra, SQL basics' },
    { unit: 'U3', name: 'Normalization: FDs, 1NF–BCNF' },
    { unit: 'U4', name: 'Transactions, concurrency, recovery' },
    { unit: 'U5', name: 'Indexing, hashing, storage' }
  ],
  os: [
    { unit: 'U1', name: 'OS overview, processes, threads' },
    { unit: 'U2', name: 'CPU scheduling algorithms' },
    { unit: 'U3', name: 'Synchronization & deadlocks' },
    { unit: 'U4', name: 'Memory management, paging' },
    { unit: 'U5', name: 'File & I/O systems' }
  ],
  ds: [
    { unit: 'U1', name: 'Arrays, stacks, queues' },
    { unit: 'U2', name: 'Linked lists' },
    { unit: 'U3', name: 'Trees & BSTs' },
    { unit: 'U4', name: 'Graphs & traversals' },
    { unit: 'U5', name: 'Searching, sorting, hashing' }
  ],
  core: [
    { unit: 'U1', name: 'Unit 1 topics' },
    { unit: 'U2', name: 'Unit 2 topics' },
    { unit: 'U3', name: 'Unit 3 topics' },
    { unit: 'U4', name: 'Unit 4 topics' }
  ]
};

/* ---------- Careers + Roadmaps ---------- */
/* node: { id, name, weeks (est), desc } — order = prerequisite order */
const CM_CAREERS = [
  {
    id: 'data-analyst',
    name: 'Data Analyst',
    icon: '📊',
    desc: 'Turn raw data into insights using SQL, Excel, Python and BI tools. One of the most in-demand entry roles.',
    skills: ['Excel', 'SQL', 'Statistics', 'Python', 'Pandas', 'Power BI'],
    difficulty: 'Beginner-friendly',
    months: 6,
    roadmap: [
      { id: 'excel',     name: 'Excel',            weeks: 3, desc: 'Formulas, lookups, pivot tables, charts' },
      { id: 'sql',       name: 'SQL',              weeks: 5, desc: 'SELECT, JOINs, GROUP BY, subqueries, windows' },
      { id: 'stats',     name: 'Statistics',       weeks: 4, desc: 'Descriptive stats, distributions, hypothesis basics' },
      { id: 'python',    name: 'Python',           weeks: 6, desc: 'Syntax, functions, data handling' },
      { id: 'pandas',    name: 'Pandas',           weeks: 4, desc: 'DataFrames, cleaning, groupby, merges' },
      { id: 'powerbi',   name: 'Power BI',         weeks: 3, desc: 'Dashboards, DAX basics, visual storytelling' },
      { id: 'da-projects', name: 'Projects',       weeks: 4, desc: 'Sales dashboard, COVID analysis, portfolio' }
    ]
  },
  {
    id: 'backend-dev',
    name: 'Backend Developer',
    icon: '🛠️',
    desc: 'Build the server-side of applications: APIs, databases, authentication and business logic.',
    skills: ['Programming', 'DSA', 'Databases', 'Node.js', 'APIs', 'Git'],
    difficulty: 'Intermediate',
    months: 8,
    roadmap: [
      { id: 'lang',      name: 'One Language Deeply (JS/Python)', weeks: 5, desc: 'Syntax, functions, OOP, error handling' },
      { id: 'dsa',       name: 'DSA Basics',            weeks: 8, desc: 'Arrays, strings, linked lists, stacks, queues' },
      { id: 'db',        name: 'Databases (SQL)',       weeks: 4, desc: 'Schema design, joins, indexes' },
      { id: 'node',      name: 'Node.js + Express',     weeks: 5, desc: 'Routing, middleware, REST APIs' },
      { id: 'auth',      name: 'Auth & Security',       weeks: 3, desc: 'JWT, sessions, hashing, OWASP basics' },
      { id: 'git',       name: 'Git & Deployment',      weeks: 2, desc: 'Branching, PRs, hosting on Render/Railway' },
      { id: 'be-projects', name: 'Projects',            weeks: 5, desc: 'Auth system, e-commerce API, deployment' }
    ]
  },
  {
    id: 'fullstack-dev',
    name: 'Full Stack Developer',
    icon: '🌐',
    desc: 'Build complete web products — frontend, backend and deployment. Great for placements.',
    skills: ['HTML/CSS', 'JavaScript', 'React', 'Node.js', 'MongoDB', 'Git'],
    difficulty: 'Intermediate',
    months: 9,
    roadmap: [
      { id: 'htmlcss',   name: 'HTML + CSS',            weeks: 4, desc: 'Layouts, flexbox, grid, responsive design' },
      { id: 'js',        name: 'JavaScript',            weeks: 6, desc: 'DOM, events, ES6, fetch API' },
      { id: 'react',     name: 'React',                 weeks: 6, desc: 'Components, state, hooks, router' },
      { id: 'nodefs',    name: 'Node.js + Express',     weeks: 5, desc: 'REST APIs, middleware' },
      { id: 'mongo',     name: 'MongoDB',               weeks: 3, desc: 'Documents, CRUD, Mongoose' },
      { id: 'deployfs',  name: 'Deployment',            weeks: 2, desc: 'Vercel + Render, env vars, CI basics' },
      { id: 'fs-projects', name: 'Projects',            weeks: 5, desc: 'Full stack app with auth + payments' }
    ]
  },
  {
    id: 'frontend-dev',
    name: 'Frontend Developer',
    icon: '🎨',
    desc: 'Craft beautiful, fast user interfaces with modern tools and design sense.',
    skills: ['HTML/CSS', 'JavaScript', 'React', 'Responsive', 'Git'],
    difficulty: 'Beginner-friendly',
    months: 6,
    roadmap: [
      { id: 'htmlcssf',  name: 'HTML + CSS',            weeks: 4, desc: 'Semantic HTML, flexbox, grid' },
      { id: 'jsf',       name: 'JavaScript',            weeks: 6, desc: 'DOM, ES6+, async JS, fetch' },
      { id: 'reactf',    name: 'React',                 weeks: 6, desc: 'Components, hooks, state' },
      { id: 'tailwind',  name: 'CSS Framework (Tailwind)', weeks: 2, desc: 'Utility-first styling' },
      { id: 'perf',      name: 'Responsive + Performance', weeks: 3, desc: 'Mobile-first, Lighthouse, accessibility' },
      { id: 'fe-projects', name: 'Projects',           weeks: 4, desc: 'Clone UIs, portfolio, dashboard build' }
    ]
  },
  {
    id: 'data-scientist',
    name: 'Data Scientist',
    icon: '🤖',
    desc: 'Combine statistics, ML and domain thinking to predict and explain. Advanced path.',
    skills: ['Python', 'Statistics', 'ML', 'Pandas', 'Visualization'],
    difficulty: 'Advanced',
    months: 12,
    roadmap: [
      { id: 'pybasics',  name: 'Python Basics',         weeks: 5, desc: 'Syntax, functions, data structures' },
      { id: 'pyfun',     name: 'Python Functions & OOP', weeks: 4, desc: 'Reusable code, classes' },
      { id: 'numpy',     name: 'NumPy',                 weeks: 3, desc: 'Arrays, vectorization' },
      { id: 'pandasds',  name: 'Pandas',                weeks: 4, desc: 'Cleaning, analysis pipelines' },
      { id: 'statsds',   name: 'Statistics',            weeks: 5, desc: 'Probability, distributions, testing' },
      { id: 'ml',        name: 'Machine Learning',      weeks: 8, desc: 'Regression, classification, sklearn' },
      { id: 'dsviz',     name: 'Data Visualization',    weeks: 3, desc: 'Matplotlib, Seaborn, storytelling' },
      { id: 'ds-projects', name: 'Projects',            weeks: 5, desc: 'End-to-end ML project + writeup' }
    ]
  },
  {
    id: 'cybersecurity',
    name: 'Cybersecurity',
    icon: '🛡️',
    desc: 'Protect systems and networks. High-demand, high-responsibility career path.',
    skills: ['Networking', 'Linux', 'Security Tools', 'Scripting'],
    difficulty: 'Intermediate',
    months: 10,
    roadmap: [
      { id: 'netbasics', name: 'Networking Basics',     weeks: 4, desc: 'TCP/IP, DNS, ports, protocols' },
      { id: 'linux',     name: 'Linux',                 weeks: 5, desc: 'Terminal, permissions, services' },
      { id: 'pysec',     name: 'Python for Security',   weeks: 4, desc: 'Scripting, automation' },
      { id: 'websec',    name: 'Web Security',          weeks: 5, desc: 'OWASP Top 10, Burp Suite basics' },
      { id: 'ctf',       name: 'CTF Practice',          weeks: 6, desc: 'TryHackMe, HackTheBox rooms' },
      { id: 'cyproj',    name: 'Security Projects',     weeks: 4, desc: 'Vuln report, home lab, writeups' }
    ]
  }
];

/* ---------- Sample users (pre-seeded) ---------- */
const CM_SEED_USERS = [
  {
    id: 'u1', fullName: 'Shariq', email: 'shariq@demo.com', password: 'demo123',
    role: 'student', verified: true,
    program: 'btech-cse', university: 'aktu', semester: 4,
    goalId: 'data-analyst', dailyMinutes: 90,
    onboarded: true,
    goalProgress: 65,
    completedSkills: ['excel', 'sql'],
    inProgressSkills: ['stats'],
    streak: 12, longestStreak: 18,
    registeredOn: '2025-06-14'
  },
  {
    id: 'u2', fullName: 'Priya Sharma', email: 'priya@demo.com', password: 'demo123',
    role: 'student', verified: true,
    program: 'bca', university: 'du', semester: 4,
    goalId: 'fullstack-dev', dailyMinutes: 120,
    onboarded: true,
    goalProgress: 40,
    completedSkills: ['htmlcss', 'js'],
    inProgressSkills: ['react'],
    streak: 6, longestStreak: 15,
    registeredOn: '2025-07-02'
  },
  {
    id: 'u3', fullName: 'Aman Verma', email: 'aman@demo.com', password: 'demo123',
    role: 'student', verified: false,
    program: 'btech-cse', university: 'aktu', semester: 6,
    goalId: 'backend-dev', dailyMinutes: 90,
    onboarded: true,
    goalProgress: 25,
    completedSkills: ['lang'],
    inProgressSkills: ['dsa'],
    streak: 3, longestStreak: 9,
    registeredOn: '2025-08-10'
  },
  { id: 'u4', fullName: 'Sneha Gupta', email: 'sneha@demo.com', password: 'demo123', role: 'moderator', verified: true },
  { id: 'u5', fullName: 'Rahul Mehta', email: 'admin@demo.com', password: 'admin123', role: 'admin', verified: true }
];

/* ---------- Tasks / planner seed ---------- */
const CM_SEED_TASKS = [
  /* today */
  { id: 't1', userId: 'u1', date: 0, name: 'SQL JOIN Practice',   skill: 'sql',       minutes: 45, priority: 'high',   done: false },
  { id: 't2', userId: 'u1', date: 0, name: 'GROUP BY + HAVING',   skill: 'stats',     minutes: 30, priority: 'medium', done: true },
  { id: 't3', userId: 'u1', date: 0, name: 'SQL Mini Project',    skill: 'da-projects', minutes: 60, priority: 'high',  done: false },
  /* yesterday (1 missed → reschedule demo) */
  { id: 't4', userId: 'u1', date: -1, name: 'Hypothesis Testing', skill: 'stats',     minutes: 40, priority: 'medium', done: false },
  { id: 't5', userId: 'u1', date: -1, name: 'Descriptive Stats Revise', skill: 'stats', minutes: 25, priority: 'low',  done: true },
  /* future days */
  { id: 't6', userId: 'u1', date: 1, name: 'Probability Distributions', skill: 'stats',  minutes: 45, priority: 'medium', done: false },
  { id: 't7', userId: 'u1', date: 2, name: 'Python Basics Setup', skill: 'python',      minutes: 45, priority: 'low',    done: false },
  { id: 't8', userId: 'u1', date: 2, name: 'Correlation vs Causation', skill: 'stats',  minutes: 30, priority: 'medium', done: false }
];

/* ---------- Community seed ---------- */
const CM_SEED_POSTS = [
  {
    id: 'p1', communityId: 'btech-cse-aktu', author: 'Priya Sharma', authorId: 'u2', time: '2h ago',
    title: 'Best resources for DBMS?',
    body: 'Semester 4 mein DBMS hai. AKTU ke hisaab se kaunsi resources best rahengi? Notes + PYQs dono chahiye.',
    up: 24, down: 2, userVote: 0,
    comments: [
      { author: 'Aman Verma', text: 'Normalization notes bohot ache hain — library mein "Normalization (1NF–BCNF)" dekho.', time: '1h ago' },
      { author: 'Shariq', text: 'PYQs 2024 wale zaroor solve karo, pattern same rehta hai.', time: '45m ago' }
    ],
    reported: false
  },
  {
    id: 'p2', communityId: 'btech-cse-aktu', author: 'Aman Verma', authorId: 'u3', time: '5h ago',
    title: 'SQL practice questions',
    body: 'SQL ke liye daily practice karne ke liye question set chahiye. Koi site ya PDF suggest karo jo beginner friendly ho.',
    up: 17, down: 1, userVote: 0,
    comments: [
      { author: 'Priya Sharma', text: 'SQL Practice Question Bank resource card mein hai, download kar lo.', time: '3h ago' }
    ],
    reported: false
  },
  {
    id: 'p3', communityId: 'btech-cse-aktu', author: 'Shariq', authorId: 'u1', time: '1d ago',
    title: 'How should I prepare for placements?',
    body: '3rd year start hoga. Placement prep kab se begin karni chahiye aur DSA ka kitna time dena chahiye daily?',
    up: 41, down: 3, userVote: 0,
    comments: [
      { author: 'Sneha Gupta', text: 'Daily 1 hr DSA + 30 min aptitude se start karo. Projects profile pe hone chahiye.', time: '20h ago' }
    ],
    reported: false
  },
  {
    id: 'p4', communityId: 'bca-du', author: 'Sneha Gupta', authorId: 'u4', time: '2d ago',
    title: 'Web Tech ke lab projects ideas?',
    body: 'Web Technologies lab ke liye mini website project banana hai. Ideas share karo jo portfolio ke liye acche ho.',
    up: 12, down: 0, userVote: 0,
    comments: [],
    reported: false
  }
];

const CM_COMMUNITIES = [
  { id: 'btech-cse-aktu', name: 'B.Tech CSE — AKTU', members: 1284 },
  { id: 'bca-du',         name: 'BCA — DU',          members: 842 },
  { id: 'btech-cse-ipu',  name: 'B.Tech CSE — IPU',  members: 517 },
  { id: 'general',        name: 'General Career Talk', members: 2310 }
];

/* ---------- Notifications seed ---------- */
const CM_SEED_NOTIFS = [
  { id: 'n1', userId: 'u1', icon: '⏰', title: 'Your SQL task is due today.', time: 'Today, 9:00 AM', unread: true },
  { id: 'n2', userId: 'u1', icon: '📦', title: '1 unfinished task was moved to Saturday.', time: 'Today, 8:00 AM', unread: true },
  { id: 'n3', userId: 'u1', icon: '🔥', title: 'Your 12-day study streak is active.', time: 'Yesterday', unread: false },
  { id: 'n4', userId: 'u1', icon: '📚', title: 'New notes added for DBMS.', time: '2 days ago', unread: false },
  { id: 'n5', userId: 'u1', icon: '✅', title: 'You completed 7 tasks this week.', time: '3 days ago', unread: false }
];

/* ---------- Admin seed ---------- */
const CM_SEED_ADMIN = {
  pendingResources: [
    { id: 'ar1', title: 'Operating Systems Handwritten Notes', subject: 'os', by: 'Aman Verma', date: '1 day ago', type: 'notes' },
    { id: 'ar2', title: 'DAA Unit-3 Short Notes', subject: 'daa', by: 'Priya Sharma', date: '2 days ago', type: 'notes' },
    { id: 'ar3', title: 'DBMS 2022 PYQ Scan', subject: 'dbms', by: 'Rohit K.', date: '3 days ago', type: 'pyq' }
  ],
  reportedPosts: [
    { id: 'rp1', postId: 'p2', title: 'SQL practice questions', reason: 'Spam link in comments', by: 'Anonymous', date: '6h ago' },
    { id: 'rp2', postId: 'p4', title: 'Web Tech ke lab projects ideas?', reason: 'Off-topic replies', by: 'Priya Sharma', date: '1 day ago' }
  ],
  auditLog: [
    { id: 'a1', action: 'Approved resource "SQL Practice Question Bank"', by: 'Sneha Gupta (Moderator)', time: 'Today, 10:12 AM' },
    { id: 'a2', action: 'Verified student: Priya Sharma', by: 'Rahul Mehta (Admin)', time: 'Yesterday' },
    { id: 'a3', action: 'Removed reported comment on "Placement prep" post', by: 'Sneha Gupta (Moderator)', time: '2 days ago' },
    { id: 'a4', action: 'Updated DBMS syllabus units', by: 'Rahul Mehta (Admin)', time: '3 days ago' }
  ]
};
