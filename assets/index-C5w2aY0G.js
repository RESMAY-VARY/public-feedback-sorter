(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const l of document.querySelectorAll('link[rel="modulepreload"]'))c(l);new MutationObserver(l=>{for(const r of l)if(r.type==="childList")for(const n of r.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&c(n)}).observe(document,{childList:!0,subtree:!0});function t(l){const r={};return l.integrity&&(r.integrity=l.integrity),l.referrerPolicy&&(r.referrerPolicy=l.referrerPolicy),l.crossOrigin==="use-credentials"?r.credentials="include":l.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function c(l){if(l.ep)return;l.ep=!0;const r=t(l);fetch(l.href,r)}})();const I=[{id:1,source:"email",text:"The wait times for the city bus are getting out of control. I waited 45 minutes this morning.",date:"2026-02-15",status:"new"},{id:2,source:"youtube",text:"LIT VIDEO! Can you do a tutorial on how you made those 3D effects?",date:"2026-02-16",status:"new"},{id:3,source:"survey",text:"I love the new mobile app, it's very intuitive and fast.",date:"2026-02-17",status:"new"},{id:4,source:"youtube",text:"Next video should be about the new AI tools. Love the channel!",date:"2026-02-14",status:"new"},{id:5,source:"email",text:"The wait times for the city bus are getting out of control. I waited 45 minutes this morning.",date:"2026-02-15",status:"new"},{id:6,source:"youtube",text:"Tutorial on 3D effects please! Your editing is insane.",date:"2026-02-17",status:"new"},{id:7,source:"comment",text:"The transit app keeps crashing on my Android phone when I try to buy a ticket.",date:"2026-02-16",status:"new"},{id:8,source:"youtube",text:"First! Also great content as always.",date:"2026-02-15",status:"new"},{id:9,source:"survey",text:"More bike racks on buses please!",date:"2026-02-17",status:"new"},{id:10,source:"youtube",text:"Can you talk about the gear you use for filming? Need a tutorial on that.",date:"2026-02-14",status:"new"},{id:11,source:"comment",text:"Transit app is broken on Android.",date:"2026-02-16",status:"new"},{id:12,source:"youtube",text:"Great video, looking forward to the next one!",date:"2026-02-15",status:"new"},{id:13,source:"youtube",text:"This video is trash, you have no idea what you are talking about. UNFOLLOWED.",date:"2026-02-17",status:"new"},{id:14,source:"comment",text:"You guys are incompetent. Fix the bus system or resign!!",date:"2026-02-16",status:"new"}];let d=[],f=[],m=[],y=[];const a={activeTab:"feed",hasAnalyzed:!1,isAnalyzing:!1,searchQuery:"",sourceFilter:"all",statusFilters:["new","grouped","flagged"],selectedTheme:null,distribution:{email:0,comment:0,survey:0,youtube:0},specialCollection:new Set,visibleLimit:20};let b;const E=600,o={feedList:document.getElementById("feedback-list"),clustersList:document.getElementById("clusters-list"),duplicatesList:document.getElementById("duplicates-list"),totalCount:document.getElementById("total-count"),duplicateCount:document.getElementById("duplicate-count"),themeCount:document.getElementById("theme-count"),specialCount:document.getElementById("special-count"),analyzeBtn:document.getElementById("analyze-btn"),importBtn:document.getElementById("import-btn"),tabs:document.querySelectorAll(".tab-btn"),tabContents:document.querySelectorAll(".tab-content"),sidebar:document.querySelector(".sidebar"),searchInput:document.getElementById("feedback-search"),sourceSelect:document.getElementById("source-filter"),statusCheckboxes:document.querySelectorAll(".checkbox-list input")};function $(){C(),P()}function C(){o.importBtn.addEventListener("click",A),o.analyzeBtn.addEventListener("click",w),o.searchInput.addEventListener("input",e=>{a.searchQuery=e.target.value.toLowerCase(),u()}),o.sourceSelect.addEventListener("change",e=>{a.sourceFilter=e.target.value,u()}),o.statusCheckboxes.forEach(e=>{e.addEventListener("change",()=>{a.statusFilters=Array.from(o.statusCheckboxes).filter(s=>s.checked).map(s=>s.value),u()})}),o.tabs.forEach(e=>{e.addEventListener("click",()=>{o.tabs.forEach(t=>t.classList.remove("active")),o.tabContents.forEach(t=>t.classList.remove("active")),e.classList.add("active"),document.getElementById(`${e.dataset.tab}-tab`).classList.add("active"),a.activeTab=e.dataset.tab})}),o.feedList.parentElement.addEventListener("scroll",e=>{const{scrollTop:s,scrollHeight:t,clientHeight:c}=e.target;s+c>=t-10&&k()})}function k(){a.visibleLimit<d.length&&(a.visibleLimit+=20,u())}function A(){p("Importing public records..."),setTimeout(()=>{d=JSON.parse(JSON.stringify(I)),o.totalCount.textContent=d.length,u(),p("Import complete. Starting AI Analysis sequence..."),setTimeout(w,600)},800)}function w(){if(d.length===0){p("Import data first!");return}a.isAnalyzing=!0,o.analyzeBtn.disabled=!0,o.analyzeBtn.innerHTML='<span class="spinner-small"></span> Sorting...',setTimeout(()=>{S(),a.isAnalyzing=!1,a.hasAnalyzed=!0,o.analyzeBtn.disabled=!1,o.analyzeBtn.textContent="Re-analyze Feed",o.duplicateCount.textContent=m.length,o.themeCount.textContent=f.length,v(),R(),O(),p("AI intelligence applied: 5 themes detected, redundant clusters merged."),setTimeout(()=>{const e=Array.from(o.tabs).find(s=>s.dataset.tab==="clusters");e&&e.click()},1e3)},2e3)}function S(){const e=new Map,s=[];m=[],d.forEach(n=>{const i=n.text.toLowerCase().trim().replace(/[.,!]/g,"");e.has(i)?m.push(n):(e.set(i,n.id),s.push(n))});const t={"Technical Assistance & Requests":[],"Positive Stakeholder Sentiment":[],"Platform & Infrastructure":[],"Operational Efficiency":[],"Compliance & Policy Violation":[],"General Public Inquiry":[]},c={};s.forEach(n=>{const i=n.text.toLowerCase();n.isToxic=!1,["trash","hate","stupid","dumb","incompetent","useless","resign","fail"].some(h=>i.includes(h))&&(n.isToxic=!0),Object.entries({Tutorial:["tutorial","how to","explain","tutorial"],"Gear/Setup":["gear","mic","setup","camera"],"App Crash":["crash","broken","bug","error"],Engagement:["love","great","first","insane"]}).forEach(([h,T])=>{T.some(L=>i.includes(L))&&(c[h]=(c[h]||0)+1)}),n.isToxic?(n.theme="Compliance & Policy Violation",t[n.theme].push(n)):i.includes("tutorial")||i.includes("how to")||i.includes("explain")||i.includes("guide")?(n.theme="Technical Assistance & Requests",t[n.theme].push(n)):i.includes("love")||i.includes("great")||i.includes("insane")||i.includes("video")?(n.theme="Positive Stakeholder Sentiment",t[n.theme].push(n)):i.includes("app")||i.includes("android")||i.includes("crash")||i.includes("broken")?(n.theme="Platform & Infrastructure",t[n.theme].push(n)):i.includes("wait")||i.includes("time")||i.includes("schedule")||i.includes("late")?(n.theme="Operational Efficiency",t[n.theme].push(n)):(n.theme="General Public Inquiry",t[n.theme].push(n))}),f=Object.entries(t).filter(([n,i])=>i.length>0).map(([n,i])=>({title:n,count:i.length,samples:i.slice(0,3)})),y=Object.entries(c).sort((n,i)=>i[1]-n[1]).slice(0,4);const l={positive:0,neutral:0,violation:0};d.forEach(n=>{n.isToxic?l.violation++:n.text.toLowerCase().split(" ").some(i=>["great","love","helpful","thanks","cool"].includes(i))?l.positive++:l.neutral++}),a.sentiment=l,a.noiseReduction=(m.length/d.length*100).toFixed(1);const r={email:0,comment:0,survey:0,youtube:0};d.forEach(n=>{r[n.source]!==void 0&&r[n.source]++}),a.distribution=r}function P(){u()}function u(){if(d.length===0){o.feedList.innerHTML=`
      <div class="loading-state">
        <p>No data imported. Click 'Import Data' to begin.</p>
      </div>
    `;return}const e=d.filter(t=>{const c=t.text.toLowerCase().includes(a.searchQuery),l=a.sourceFilter==="all"||t.source===a.sourceFilter,r=a.statusFilters.includes(t.status),n=!a.selectedTheme||t.theme===a.selectedTheme;return c&&l&&r&&n});if(e.length===0){o.feedList.innerHTML='<p class="placeholder-text">No results matching your filters.</p>';return}const s=e.slice(0,a.visibleLimit);o.feedList.innerHTML=s.map(t=>`
    <div class="feedback-card ${a.specialCollection.has(t.id)?"is-collected":""} ${t.isToxic?"is-toxic":""}" 
         onmousedown="startPress(${t.id})" 
         onmouseup="cancelPress()" 
         onmouseleave="cancelPress()"
         ontouchstart="startPress(${t.id})"
         ontouchend="cancelPress()"
         onclick="openDetails(${t.id})">
      <div class="card-header">
        <span class="source-tag">${t.source} ${t.isToxic?"[FLAGGED]":""}</span>
        <span class="date-tag">${t.date}</span>
      </div>
      <p>"${t.text}"</p>
      <div class="card-footer">
        <span class="theme-pill status-${t.status}">${t.status}</span>
        ${t.theme?`<span class="theme-pill theme-tag" style="background: var(--surface-color)">${t.theme}</span>`:""}
        ${a.specialCollection.has(t.id)?'<span class="priority-badge">PRIORITY</span>':""}
        ${t.isToxic?'<span class="toxic-blur">Pending Policy Review</span>':""}
      </div>
    </div>
  `).join(""),s.length<e.length&&o.feedList.insertAdjacentHTML("beforeend",'<div class="scroll-loader">Simulating high-volume stream...</div>')}window.startPress=e=>{b=setTimeout(()=>{B(e)},E)};window.cancelPress=()=>{clearTimeout(b)};function B(e){a.specialCollection.has(e)?(a.specialCollection.delete(e),p("Removed from Priority Queue.")):(a.specialCollection.add(e),p("Added to Priority Review Queue.")),o.specialCount.textContent=a.specialCollection.size,u()}function v(){if(f.length===0){o.clustersList.innerHTML='<p class="placeholder-text">Run analysis to see thematic clusters</p>';return}o.clustersList.innerHTML=f.map(e=>`
    <div class="cluster-item ${a.selectedTheme===e.title?"selected-cluster":""}" onclick="selectTheme('${e.title}')">
      <div class="cluster-header">
        <div class="cluster-title">
          <h3>${e.title}</h3>
          <span class="cluster-count">${e.count} entries</span>
        </div>
        <div class="cluster-actions">
           <button class="secondary-btn btn-small" onclick="event.stopPropagation(); bulkAction('flagged', '${e.title}')">Flag Group</button>
           <button class="secondary-btn btn-small" onclick="event.stopPropagation(); bulkAction('Archived', '${e.title}')">Archive All</button>
        </div>
      </div>
      <div class="cluster-body">
        <p class="cluster-summary">AI has identified ${e.count} similar reports regarding this theme.</p>
        <div class="cluster-samples">
          ${e.samples.map(s=>`<div class="sample-text">${s.text}</div>`).join("")}
        </div>
      </div>
    </div>
  `).join("")}function O(){let e=document.getElementById("issue-panel");e||(e=document.createElement("div"),e.id="issue-panel",e.className="filter-section fade-in",o.sidebar.appendChild(e));const s=d.length;e.innerHTML=`
    <h3>Thematic Insights</h3>
    <div class="issue-list">
      ${y.map(([t,c])=>`
        <div class="issue-item">
          <div class="issue-info">
            <span class="issue-name">${t}</span>
            <div class="issue-bar-bg"><div class="issue-bar" style="width: ${c/s*100*5}%"></div></div>
          </div>
          <span class="issue-pill">${c}</span>
        </div>
      `).join("")}
    </div>

    <h3 style="margin-top: 1.5rem">Community Pulse</h3>
    <div class="pulse-metrics">
       <div class="pulse-stat">
          <span class="pulse-label">Sentiment Score</span>
          <div class="pulse-bar">
             <div class="p-segment pos" style="width: ${a.sentiment.positive/s*100}%"></div>
             <div class="p-segment neu" style="width: ${a.sentiment.neutral/s*100}%"></div>
             <div class="p-segment neg" style="width: ${a.sentiment.violation/s*100}%"></div>
          </div>
       </div>
       <div class="pulse-stat">
          <span class="pulse-label">Noise Reduction (AI)</span>
          <span class="pulse-val" style="color: var(--primary)">${a.noiseReduction}%</span>
       </div>
    </div>

    <h3 style="margin-top: 1.5rem">Source Distribution</h3>
    <div class="source-ring-container">
       <div class="source-item"><span class="dot youtube"></span> YouTube (${a.distribution.youtube})</div>
       <div class="source-item"><span class="dot email"></span> Emails (${a.distribution.email})</div>
       <div class="source-item"><span class="dot comment"></span> Comments (${a.distribution.comment})</div>
       <div class="source-item"><span class="dot survey"></span> Surveys (${a.distribution.survey})</div>
    </div>
  `}window.selectTheme=e=>{a.selectedTheme===e?a.selectedTheme=null:a.selectedTheme=e,v(),u(),a.selectedTheme&&p(`Filtering feed by: ${e}`)};window.bulkAction=(e,s)=>{d.forEach(t=>{t.theme===s&&(t.status=e)}),u(),v(),p(`Bulk updated entire cluster to ${e}.`)};window.openDetails=e=>{const s=d.find(l=>l.id===e),t=document.getElementById("modal-container"),c=document.getElementById("modal-content");t.classList.remove("modal-hidden"),c.innerHTML=`
    <div class="detail-view">
      <div class="detail-header">
        <span class="source-tag">${s.source}</span>
        <span class="date-tag">${s.date}</span>
      </div>
      <p class="detail-text">"${s.text}"</p>
      <div class="ai-suggestion">
        <h4>AI Suggested Response</h4>
        <p>This report matches the <strong>${s.theme||"General"}</strong> cluster. We suggest acknowledging the wait time and referencing the Route 42 improvement plan.</p>
        <button class="primary-btn" onclick="showToast('Response Drafted')">Draft Response</button>
      </div>
      <div class="detail-actions">
        <button class="secondary-btn" onclick="updateItemStatus(${s.id}, 'flagged')">Flag for Review</button>
        <button class="secondary-btn" onclick="updateItemStatus(${s.id}, 'archived')">Archive</button>
      </div>
    </div>
  `};window.updateItemStatus=(e,s)=>{const t=d.find(c=>c.id===e);t.status=s,u(),g(),p(`Item moved to ${s}`)};function g(){document.getElementById("modal-container").classList.add("modal-hidden")}document.querySelector(".close-modal").addEventListener("click",g);window.onclick=e=>{e.target.id==="modal-container"&&g()};function R(){if(m.length===0){o.duplicatesList.innerHTML='<p class="placeholder-text">No duplicates identified</p>';return}o.duplicatesList.innerHTML=`
    <div class="search-bar">
      <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1rem;">
        The system has flagged ${m.length} items as direct or near-exact duplicates.
      </p>
    </div>
    <div class="feedback-grid">
      ${m.map(e=>`
        <div class="feedback-card" style="opacity: 0.7">
          <div class="card-header">
            <span class="source-tag">DUPLICATE</span>
            <span class="date-tag">${e.date}</span>
          </div>
          <p>"${e.text}"</p>
          <div class="card-footer">
            <span class="theme-pill" style="color: var(--accent-purple)">Redundant</span>
          </div>
        </div>
      `).join("")}
    </div>
  `}function p(e){const s=document.createElement("div");s.className="toast",s.textContent=e,document.getElementById("toast-container").appendChild(s),Object.assign(s.style,{position:"fixed",bottom:"24px",right:"24px",background:"var(--surface-alt)",color:"var(--text-main)",padding:"12px 24px",borderRadius:"8px",border:"1px solid var(--primary)",boxShadow:"var(--shadow-lg)",zIndex:"2000",animation:"slideIn 0.3s forwards ease-out"}),setTimeout(()=>{s.style.animation="fadeOut 0.3s forwards ease-in",setTimeout(()=>s.remove(),300)},3e3)}const x=document.createElement("style");x.textContent=`
  @keyframes fadeOut {
    from { opacity: 1; transform: translateY(0); }
    to { opacity: 0; transform: translateY(10px); }
  }
`;document.head.appendChild(x);$();
