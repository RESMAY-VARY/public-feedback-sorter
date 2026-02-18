// --- Mock Data ---
const FEEDBACK_SAMPLES = [
  { id: 1, source: 'email', text: "The wait times for the city bus are getting out of control. I waited 45 minutes this morning.", date: '2026-02-15', status: 'new' },
  { id: 2, source: 'youtube', text: "LIT VIDEO! Can you do a tutorial on how you made those 3D effects?", date: '2026-02-16', status: 'new' },
  { id: 3, source: 'survey', text: "I love the new mobile app, it's very intuitive and fast.", date: '2026-02-17', status: 'new' },
  { id: 4, source: 'youtube', text: "Next video should be about the new AI tools. Love the channel!", date: '2026-02-14', status: 'new' },
  { id: 5, source: 'email', text: "The wait times for the city bus are getting out of control. I waited 45 minutes this morning.", date: '2026-02-15', status: 'new' }, // Exact Duplicate
  { id: 6, source: 'youtube', text: "Tutorial on 3D effects please! Your editing is insane.", date: '2026-02-17', status: 'new' }, // Duplicate-ish of 2
  { id: 7, source: 'comment', text: "The transit app keeps crashing on my Android phone when I try to buy a ticket.", date: '2026-02-16', status: 'new' },
  { id: 8, source: 'youtube', text: "First! Also great content as always.", date: '2026-02-15', status: 'new' },
  { id: 9, source: 'survey', text: "More bike racks on buses please!", date: '2026-02-17', status: 'new' },
  { id: 10, source: 'youtube', text: "Can you talk about the gear you use for filming? Need a tutorial on that.", date: '2026-02-14', status: 'new' },
  { id: 11, source: 'comment', text: "Transit app is broken on Android.", date: '2026-02-16', status: 'new' },
  { id: 12, source: 'youtube', text: "Great video, looking forward to the next one!", date: '2026-02-15', status: 'new' },
  { id: 13, source: 'youtube', text: "This video is trash, you have no idea what you are talking about. UNFOLLOWED.", date: '2026-02-17', status: 'new' }, // Rude
  { id: 14, source: 'comment', text: "You guys are incompetent. Fix the bus system or resign!!", date: '2026-02-16', status: 'new' }, // Aggressive
];

let rawData = [];
let clusters = [];
let duplicates = [];
let commonIssues = [];

// --- State Management ---
const state = {
  activeTab: 'feed',
  hasAnalyzed: false,
  isAnalyzing: false,
  searchQuery: '',
  sourceFilter: 'all',
  statusFilters: ['new', 'grouped', 'flagged'],
  selectedTheme: null,
  distribution: { email: 0, comment: 0, survey: 0, youtube: 0 },
  specialCollection: new Set(),
  visibleLimit: 20,
  showShielded: false // Toggle to hide toxic comments
};

let longPressTimer;
const LONG_PRESS_DURATION = 600;

// --- DOM Elements ---
const elements = {
  feedList: document.getElementById('feedback-list'),
  clustersList: document.getElementById('clusters-list'),
  duplicatesList: document.getElementById('duplicates-list'),
  totalCount: document.getElementById('total-count'),
  duplicateCount: document.getElementById('duplicate-count'),
  themeCount: document.getElementById('theme-count'),
  specialCount: document.getElementById('special-count'),
  analyzeBtn: document.getElementById('analyze-btn'),
  importBtn: document.getElementById('import-btn'),
  tabs: document.querySelectorAll('.tab-btn'),
  tabContents: document.querySelectorAll('.tab-content'),
  sidebar: document.querySelector('.sidebar'),
  searchInput: document.getElementById('feedback-search'),
  sourceSelect: document.getElementById('source-filter'),
  statusCheckboxes: document.querySelectorAll('.checkbox-list input')
};

// --- Core Logic ---

function init() {
  setupEventListeners();
  render();
}

function setupEventListeners() {
  elements.importBtn.addEventListener('click', importData);
  elements.analyzeBtn.addEventListener('click', runAIAnalysis);

  elements.searchInput.addEventListener('input', (e) => {
    state.searchQuery = e.target.value.toLowerCase();
    renderFeed();
  });

  elements.sourceSelect.addEventListener('change', (e) => {
    state.sourceFilter = e.target.value;
    renderFeed();
  });

  elements.statusCheckboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      state.statusFilters = Array.from(elements.statusCheckboxes)
        .filter(i => i.checked)
        .map(i => i.value);
      renderFeed();
    });
  });

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

  // Infinite Scroll Listener
  elements.feedList.parentElement.addEventListener('scroll', (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      loadMoreItems();
    }
  });
}

function loadMoreItems() {
  if (state.visibleLimit < rawData.length) {
    state.visibleLimit += 20;
    renderFeed();
  }
}

function importData() {
  showToast("Importing public records...");
  setTimeout(() => {
    rawData = JSON.parse(JSON.stringify(FEEDBACK_SAMPLES));
    elements.totalCount.textContent = rawData.length;
    renderFeed();
    showToast("Import complete. Starting AI Analysis sequence...");

    // Auto-start analysis for better UX
    setTimeout(runAIAnalysis, 600);
  }, 800);
}

function runAIAnalysis() {
  if (rawData.length === 0) {
    showToast("Import data first!");
    return;
  }

  state.isAnalyzing = true;
  elements.analyzeBtn.disabled = true;
  elements.analyzeBtn.innerHTML = `<span class="spinner-small"></span> Sorting...`;

  // Simulate AI Processing time
  setTimeout(() => {
    performClustering();
    state.isAnalyzing = false;
    state.hasAnalyzed = true;
    elements.analyzeBtn.disabled = false;
    elements.analyzeBtn.textContent = "Re-analyze Feed";

    // Update stats
    elements.duplicateCount.textContent = duplicates.length;
    elements.themeCount.textContent = clusters.length;

    renderClusters();
    renderDuplicates();
    renderIssuePanel();
    showToast("AI intelligence applied: 5 themes detected, redundant clusters merged.");

    // Automatically switch to the "Thematic Groups" tab to show results
    setTimeout(() => {
      const clustersTabBtn = Array.from(elements.tabs).find(t => t.dataset.tab === 'clusters');
      if (clustersTabBtn) clustersTabBtn.click();
    }, 1000);
  }, 2000);
}

function performClustering() {
  // 1. Duplicate Detection 
  const seenTexts = new Map();
  const uniqueItems = [];
  duplicates = [];

  rawData.forEach(item => {
    const normalized = item.text.toLowerCase().trim().replace(/[.,!]/g, "");
    if (seenTexts.has(normalized)) {
      duplicates.push(item);
    } else {
      seenTexts.set(normalized, item.id);
      uniqueItems.push(item);
    }
  });

  // 2. Thematic Grouping (Heuristic keywords)
  const themeMap = {
    "Technical Assistance & Requests": [],
    "Positive Stakeholder Sentiment": [],
    "Platform & Infrastructure": [],
    "Operational Efficiency": [],
    "Compliance & Policy Violation": [],
    "General Public Inquiry": []
  };

  const issueCounter = {};

  uniqueItems.forEach(item => {
    const text = item.text.toLowerCase();
    item.isToxic = false;

    // Detect "Not-so-nice" comments
    const toxicKeywords = ['trash', 'hate', 'stupid', 'dumb', 'incompetent', 'useless', 'resign', 'fail'];
    if (toxicKeywords.some(k => text.includes(k))) {
      item.isToxic = true;
    }

    // Tagging common issues for creators
    const issueKeywords = {
      'Tutorial': ['tutorial', 'how to', 'explain', 'tutorial'],
      'Gear/Setup': ['gear', 'mic', 'setup', 'camera'],
      'App Crash': ['crash', 'broken', 'bug', 'error'],
      'Engagement': ['love', 'great', 'first', 'insane']
    };

    Object.entries(issueKeywords).forEach(([issue, keywords]) => {
      if (keywords.some(k => text.includes(k))) {
        issueCounter[issue] = (issueCounter[issue] || 0) + 1;
      }
    });

    if (item.isToxic) {
      item.theme = "Compliance & Policy Violation";
      themeMap[item.theme].push(item);
    } else if (text.includes('tutorial') || text.includes('how to') || text.includes('explain') || text.includes('guide')) {
      item.theme = "Technical Assistance & Requests";
      themeMap[item.theme].push(item);
    } else if (text.includes('love') || text.includes('great') || text.includes('insane') || text.includes('video')) {
      item.theme = "Positive Stakeholder Sentiment";
      themeMap[item.theme].push(item);
    } else if (text.includes('app') || text.includes('android') || text.includes('crash') || text.includes('broken')) {
      item.theme = "Platform & Infrastructure";
      themeMap[item.theme].push(item);
    } else if (text.includes('wait') || text.includes('time') || text.includes('schedule') || text.includes('late')) {
      item.theme = "Operational Efficiency";
      themeMap[item.theme].push(item);
    } else {
      item.theme = "General Public Inquiry";
      themeMap[item.theme].push(item);
    }
  });

  clusters = Object.entries(themeMap).filter(([_, items]) => items.length > 0).map(([title, items]) => ({
    title,
    count: items.length,
    samples: items.slice(0, 3)
  }));

  commonIssues = Object.entries(issueCounter)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  // 3. Community Health & Efficiency Metrics
  const sentiment = { positive: 0, neutral: 0, violation: 0 };
  rawData.forEach(item => {
    if (item.isToxic) sentiment.violation++;
    else if (item.text.toLowerCase().split(' ').some(w => ['great', 'love', 'helpful', 'thanks', 'cool'].includes(w))) sentiment.positive++;
    else sentiment.neutral++;
  });
  state.sentiment = sentiment;
  state.noiseReduction = ((duplicates.length / rawData.length) * 100).toFixed(1);

  // 4. Source Distribution
  const sourceCounter = { email: 0, comment: 0, survey: 0, youtube: 0 };
  rawData.forEach(item => {
    if (sourceCounter[item.source] !== undefined) {
      sourceCounter[item.source]++;
    }
  });
  state.distribution = sourceCounter;
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

  // Apply filters
  const filteredData = rawData.filter(item => {
    const matchesSearch = item.text.toLowerCase().includes(state.searchQuery);
    const matchesSource = state.sourceFilter === 'all' || item.source === state.sourceFilter;
    const matchesStatus = state.statusFilters.includes(item.status);
    const matchesTheme = !state.selectedTheme || item.theme === state.selectedTheme;
    return matchesSearch && matchesSource && matchesStatus && matchesTheme;
  });

  if (filteredData.length === 0) {
    elements.feedList.innerHTML = `<p class="placeholder-text">No results matching your filters.</p>`;
    return;
  }

  // Chunks: Only render a slice to keep memory low
  const displayData = filteredData.slice(0, state.visibleLimit);

  elements.feedList.innerHTML = displayData.map(item => `
    <div class="feedback-card ${state.specialCollection.has(item.id) ? 'is-collected' : ''} ${item.isToxic ? 'is-toxic' : ''}" 
         onmousedown="startPress(${item.id})" 
         onmouseup="cancelPress()" 
         onmouseleave="cancelPress()"
         ontouchstart="startPress(${item.id})"
         ontouchend="cancelPress()"
         onclick="openDetails(${item.id})">
      <div class="card-header">
        <span class="source-tag">${item.source} ${item.isToxic ? '[FLAGGED]' : ''}</span>
        <span class="date-tag">${item.date}</span>
      </div>
      <p>"${item.text}"</p>
      <div class="card-footer">
        <span class="theme-pill status-${item.status}">${item.status}</span>
        ${item.theme ? `<span class="theme-pill theme-tag" style="background: var(--surface-color)">${item.theme}</span>` : ''}
        ${state.specialCollection.has(item.id) ? `<span class="priority-badge">PRIORITY</span>` : ''}
        ${item.isToxic ? `<span class="toxic-blur">Pending Policy Review</span>` : ''}
      </div>
    </div>
  `).join('');

  if (displayData.length < filteredData.length) {
    elements.feedList.insertAdjacentHTML('beforeend', `<div class="scroll-loader">Simulating high-volume stream...</div>`);
  }
}

window.startPress = (id) => {
  longPressTimer = setTimeout(() => {
    toggleSpecialItem(id);
  }, LONG_PRESS_DURATION);
};

window.cancelPress = () => {
  clearTimeout(longPressTimer);
};

function toggleSpecialItem(id) {
  if (state.specialCollection.has(id)) {
    state.specialCollection.delete(id);
    showToast("Removed from Priority Queue.");
  } else {
    state.specialCollection.add(id);
    showToast("Added to Priority Review Queue.");
  }
  elements.specialCount.textContent = state.specialCollection.size;
  renderFeed();
}

function renderClusters() {
  if (clusters.length === 0) {
    elements.clustersList.innerHTML = `<p class="placeholder-text">Run analysis to see thematic clusters</p>`;
    return;
  }

  elements.clustersList.innerHTML = clusters.map(cluster => `
    <div class="cluster-item ${state.selectedTheme === cluster.title ? 'selected-cluster' : ''}" onclick="selectTheme('${cluster.title}')">
      <div class="cluster-header">
        <div class="cluster-title">
          <h3>${cluster.title}</h3>
          <span class="cluster-count">${cluster.count} entries</span>
        </div>
        <div class="cluster-actions">
           <button class="secondary-btn btn-small" onclick="event.stopPropagation(); bulkAction('flagged', '${cluster.title}')">Flag Group</button>
           <button class="secondary-btn btn-small" onclick="event.stopPropagation(); bulkAction('Archived', '${cluster.title}')">Archive All</button>
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

function renderIssuePanel() {
  let panel = document.getElementById('issue-panel');
  if (!panel) {
    panel = document.createElement('div');
    panel.id = 'issue-panel';
    panel.className = 'filter-section fade-in';
    elements.sidebar.appendChild(panel);
  }

  const total = rawData.length;

  panel.innerHTML = `
    <h3>Thematic Insights</h3>
    <div class="issue-list">
      ${commonIssues.map(([issue, count]) => `
        <div class="issue-item">
          <div class="issue-info">
            <span class="issue-name">${issue}</span>
            <div class="issue-bar-bg"><div class="issue-bar" style="width: ${(count / total * 100) * 5}%"></div></div>
          </div>
          <span class="issue-pill">${count}</span>
        </div>
      `).join('')}
    </div>

    <h3 style="margin-top: 1.5rem">Community Pulse</h3>
    <div class="pulse-metrics">
       <div class="pulse-stat">
          <span class="pulse-label">Sentiment Score</span>
          <div class="pulse-bar">
             <div class="p-segment pos" style="width: ${(state.sentiment.positive / total * 100)}%"></div>
             <div class="p-segment neu" style="width: ${(state.sentiment.neutral / total * 100)}%"></div>
             <div class="p-segment neg" style="width: ${(state.sentiment.violation / total * 100)}%"></div>
          </div>
       </div>
       <div class="pulse-stat">
          <span class="pulse-label">Noise Reduction (AI)</span>
          <span class="pulse-val" style="color: var(--primary)">${state.noiseReduction}%</span>
       </div>
    </div>

    <h3 style="margin-top: 1.5rem">Source Distribution</h3>
    <div class="source-ring-container">
       <div class="source-item"><span class="dot youtube"></span> YouTube (${state.distribution.youtube})</div>
       <div class="source-item"><span class="dot email"></span> Emails (${state.distribution.email})</div>
       <div class="source-item"><span class="dot comment"></span> Comments (${state.distribution.comment})</div>
       <div class="source-item"><span class="dot survey"></span> Surveys (${state.distribution.survey})</div>
    </div>
  `;
}

// --- Interaction Handlers ---

window.selectTheme = (theme) => {
  if (state.selectedTheme === theme) {
    state.selectedTheme = null;
  } else {
    state.selectedTheme = theme;
  }
  renderClusters();
  renderFeed();

  if (state.selectedTheme) {
    showToast(`Filtering feed by: ${theme}`);
  }
};

window.bulkAction = (newStatus, theme) => {
  rawData.forEach(item => {
    if (item.theme === theme) {
      item.status = newStatus;
    }
  });
  renderFeed();
  renderClusters();
  showToast(`Bulk updated entire cluster to ${newStatus}.`);
};

window.openDetails = (id) => {
  const item = rawData.find(i => i.id === id);
  const modal = document.getElementById('modal-container');
  const content = document.getElementById('modal-content');

  modal.classList.remove('modal-hidden');
  content.innerHTML = `
    <div class="detail-view">
      <div class="detail-header">
        <span class="source-tag">${item.source}</span>
        <span class="date-tag">${item.date}</span>
      </div>
      <p class="detail-text">"${item.text}"</p>
      <div class="ai-suggestion">
        <h4>AI Suggested Response</h4>
        <p>This report matches the <strong>${item.theme || 'General'}</strong> cluster. We suggest acknowledging the wait time and referencing the Route 42 improvement plan.</p>
        <button class="primary-btn" onclick="showToast('Response Drafted')">Draft Response</button>
      </div>
      <div class="detail-actions">
        <button class="secondary-btn" onclick="updateItemStatus(${item.id}, 'flagged')">Flag for Review</button>
        <button class="secondary-btn" onclick="updateItemStatus(${item.id}, 'archived')">Archive</button>
      </div>
    </div>
  `;
};

window.updateItemStatus = (id, status) => {
  const item = rawData.find(i => i.id === id);
  item.status = status;
  renderFeed();
  closeModal();
  showToast(`Item moved to ${status}`);
};

function closeModal() {
  document.getElementById('modal-container').classList.add('modal-hidden');
}

document.querySelector('.close-modal').addEventListener('click', closeModal);
window.onclick = (e) => {
  if (e.target.id === 'modal-container') closeModal();
};

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
