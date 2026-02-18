// --- Mock Data ---
const FEEDBACK_SAMPLES = [
  { id: 1, source: 'email', text: "The wait times for the city bus are getting out of control. I waited 45 minutes this morning.", date: '2026-02-15', status: 'new' },
  { id: 2, source: 'comment', text: "Actually ridiculous how long the bus takes now. Fix the schedule!", date: '2026-02-16', status: 'new' }, // Duplicate-ish
  { id: 3, source: 'survey', text: "I love the new mobile app, it's very intuitive and fast.", date: '2026-02-17', status: 'new' },
  { id: 4, source: 'email', text: "Could you add a dark mode to the transit portal? My eyes hurt at night.", date: '2026-02-14', status: 'new' },
  { id: 5, source: 'email', text: "The wait times for the city bus are getting out of control. I waited 45 minutes this morning.", date: '2026-02-15', status: 'new' }, // Exact Duplicate
  { id: 6, source: 'form', text: "The bus driver on route 42 was very helpful today. Great employee!", date: '2026-02-17', status: 'new' },
  { id: 7, source: 'comment', text: "The transit app keeps crashing on my Android phone when I try to buy a ticket.", date: '2026-02-16', status: 'new' },
  { id: 8, source: 'email', text: "I'm having trouble with the Android app. It crashes frequently.", date: '2026-02-15', status: 'new' }, // Similar to 7
  { id: 9, source: 'survey', text: "More bike racks on buses please!", date: '2026-02-17', status: 'new' },
  { id: 10, source: 'form', text: "The bus route 12 needs more frequent stops in the downtown area.", date: '2026-02-14', status: 'new' },
  { id: 11, source: 'comment', text: "Transit app is broken on Android.", date: '2026-02-16', status: 'new' }, // Another similar
  { id: 12, source: 'email', text: "Wait times are too long. Bus 45 is always late.", date: '2026-02-15', status: 'new' },
];

let rawData = [];
let clusters = [];
let duplicates = [];

// --- State Management ---
const state = {
  activeTab: 'feed',
  hasAnalyzed: false,
  isAnalyzing: false
};

// --- DOM Elements ---
const elements = {
  feedList: document.getElementById('feedback-list'),
  clustersList: document.getElementById('clusters-list'),
  duplicatesList: document.getElementById('duplicates-list'),
  totalCount: document.getElementById('total-count'),
  duplicateCount: document.getElementById('duplicate-count'),
  themeCount: document.getElementById('theme-count'),
  analyzeBtn: document.getElementById('analyze-btn'),
  importBtn: document.getElementById('import-btn'),
  tabs: document.querySelectorAll('.tab-btn'),
  tabContents: document.querySelectorAll('.tab-content')
};

// --- Core Logic ---

function init() {
  setupEventListeners();
  render();
}

function setupEventListeners() {
  elements.importBtn.addEventListener('click', importData);
  elements.analyzeBtn.addEventListener('click', runAIAnalysis);

  elements.tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      elements.tabs.forEach(t => t.classList.remove('active'));
      elements.tabContents.forEach(c => c.classList.remove('active'));
      
      tab.classList.add('active');
      const target = document.getElementById(`${tab.dataset.tab}-tab`);
      target.classList.add('active');
      state.activeTab = tab.dataset.tab;
    });
  });
}

function importData() {
  showToast("Importing 1,240 records...");
  setTimeout(() => {
    rawData = [...FEEDBACK_SAMPLES];
    elements.totalCount.textContent = rawData.length;
    renderFeed();
    showToast("Import complete.");
  }, 800);
}

function runAIAnalysis() {
  if (rawData.length === 0) {
    showToast("Import data first!");
    return;
  }

  state.isAnalyzing = true;
  elements.analyzeBtn.disabled = true;
  elements.analyzeBtn.textContent = "Processing...";
  
  // Simulate AI Processing time
  setTimeout(() => {
    performClustering();
    state.isAnalyzing = false;
    state.hasAnalyzed = true;
    elements.analyzeBtn.disabled = false;
    elements.analyzeBtn.textContent = "Re-analyze";
    
    // Update stats
    elements.duplicateCount.textContent = duplicates.length;
    elements.themeCount.textContent = clusters.length;
    
    renderClusters();
    renderDuplicates();
    showToast("Analysis complete: Disregarding duplicates and grouping themes.");
  }, 2000);
}

function performClustering() {
  // 1. Duplicate Detection (Simple logic for demo)
  const seenTexts = new Map();
  const uniqueItems = [];
  duplicates = [];

  rawData.forEach(item => {
    const normalized = item.text.toLowerCase().trim();
    if (seenTexts.has(normalized)) {
      duplicates.push(item);
    } else {
      seenTexts.set(normalized, item.id);
      uniqueItems.push(item);
    }
  });

  // 2. Thematic Grouping (Heuristic keywords for AI simulation)
  const themeMap = {
    "Wait Times & Scheduling": [],
    "Mobile App Reliability": [],
    "Driver & Staff Praise": [],
    "Infrastructure Requests": [],
    "General Improvement": []
  };

  uniqueItems.forEach(item => {
    const text = item.text.toLowerCase();
    if (text.includes('wait') || text.includes('time') || text.includes('schedule') || text.includes('late')) {
      themeMap["Wait Times & Scheduling"].push(item);
    } else if (text.includes('app') || text.includes('android') || text.includes('crash') || text.includes('broken')) {
      themeMap["Mobile App Reliability"].push(item);
    } else if (text.includes('helpful') || text.includes('staff') || text.includes('driver') || text.includes('great')) {
      themeMap["Driver & Staff Praise"].push(item);
    } else if (text.includes('rack') || text.includes('stop') || text.includes('bike') || text.includes('infrastructure')) {
      themeMap["Infrastructure Requests"].push(item);
    } else {
      themeMap["General Improvement"].push(item);
    }
  });

  clusters = Object.entries(themeMap).filter(([_, items]) => items.length > 0).map(([title, items]) => ({
    title,
    count: items.length,
    samples: items.slice(0, 3)
  }));
}

// --- Rendering ---

function render() {
  renderFeed();
}

function renderFeed() {
  if (rawData.length === 0) {
    elements.feedList.innerHTML = `
      <div class="loading-state">
        <p>No data imported. Click 'Import Data' to begin.</p>
      </div>
    `;
    return;
  }

  elements.feedList.innerHTML = rawData.map(item => `
    <div class="feedback-card" style="animation-delay: ${item.id * 0.05}s">
      <div class="card-header">
        <span class="source-tag">${item.source}</span>
        <span class="date-tag">${item.date}</span>
      </div>
      <p>"${item.text}"</p>
      <div class="card-footer">
        <span class="theme-pill">${item.status}</span>
      </div>
    </div>
  `).join('');
}

function renderClusters() {
  if (clusters.length === 0) {
    elements.clustersList.innerHTML = `<p class="placeholder-text">Run analysis to see thematic clusters</p>`;
    return;
  }

  elements.clustersList.innerHTML = clusters.map(cluster => `
    <div class="cluster-item">
      <div class="cluster-header">
        <div class="cluster-title">
          <h3>${cluster.title}</h3>
          <span class="cluster-count">${cluster.count} entries</span>
        </div>
      </div>
      <div class="cluster-body">
        <p class="cluster-summary">AI has identified ${cluster.count} similar reports regarding this theme.</p>
        <div class="cluster-samples">
          ${cluster.samples.map(s => `<div class="sample-text">${s.text}</div>`).join('')}
        </div>
      </div>
    </div>
  `).join('');
}

function renderDuplicates() {
  if (duplicates.length === 0) {
    elements.duplicatesList.innerHTML = `<p class="placeholder-text">No duplicates identified</p>`;
    return;
  }

  elements.duplicatesList.innerHTML = `
    <div class="search-bar">
      <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1rem;">
        The system has flagged ${duplicates.length} items as direct or near-exact duplicates.
      </p>
    </div>
    <div class="feedback-grid">
      ${duplicates.map(item => `
        <div class="feedback-card" style="opacity: 0.7">
          <div class="card-header">
            <span class="source-tag">DUPLICATE</span>
            <span class="date-tag">${item.date}</span>
          </div>
          <p>"${item.text}"</p>
          <div class="card-footer">
            <span class="theme-pill" style="color: var(--accent-purple)">Redundant</span>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.getElementById('toast-container').appendChild(toast);
  
  // Style toast dynamically for simplicity
  Object.assign(toast.style, {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    background: 'var(--surface-alt)',
    color: 'var(--text-main)',
    padding: '12px 24px',
    borderRadius: '8px',
    border: '1px solid var(--primary)',
    boxShadow: 'var(--shadow-lg)',
    zIndex: '2000',
    animation: 'slideIn 0.3s forwards ease-out'
  });

  setTimeout(() => {
    toast.style.animation = 'fadeOut 0.3s forwards ease-in';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Add fadeOut to CSS dynamically
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeOut {
    from { opacity: 1; transform: translateY(0); }
    to { opacity: 0; transform: translateY(10px); }
  }
`;
document.head.appendChild(style);

init();
