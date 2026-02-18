(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))a(e);new MutationObserver(e=>{for(const r of e)if(r.type==="childList")for(const u of r.addedNodes)u.tagName==="LINK"&&u.rel==="modulepreload"&&a(u)}).observe(document,{childList:!0,subtree:!0});function i(e){const r={};return e.integrity&&(r.integrity=e.integrity),e.referrerPolicy&&(r.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?r.credentials="include":e.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function a(e){if(e.ep)return;e.ep=!0;const r=i(e);fetch(e.href,r)}})();const f=[{id:1,source:"email",text:"The wait times for the city bus are getting out of control. I waited 45 minutes this morning.",date:"2026-02-15",status:"new"},{id:2,source:"comment",text:"Actually ridiculous how long the bus takes now. Fix the schedule!",date:"2026-02-16",status:"new"},{id:3,source:"survey",text:"I love the new mobile app, it's very intuitive and fast.",date:"2026-02-17",status:"new"},{id:4,source:"email",text:"Could you add a dark mode to the transit portal? My eyes hurt at night.",date:"2026-02-14",status:"new"},{id:5,source:"email",text:"The wait times for the city bus are getting out of control. I waited 45 minutes this morning.",date:"2026-02-15",status:"new"},{id:6,source:"form",text:"The bus driver on route 42 was very helpful today. Great employee!",date:"2026-02-17",status:"new"},{id:7,source:"comment",text:"The transit app keeps crashing on my Android phone when I try to buy a ticket.",date:"2026-02-16",status:"new"},{id:8,source:"email",text:"I'm having trouble with the Android app. It crashes frequently.",date:"2026-02-15",status:"new"},{id:9,source:"survey",text:"More bike racks on buses please!",date:"2026-02-17",status:"new"},{id:10,source:"form",text:"The bus route 12 needs more frequent stops in the downtown area.",date:"2026-02-14",status:"new"},{id:11,source:"comment",text:"Transit app is broken on Android.",date:"2026-02-16",status:"new"},{id:12,source:"email",text:"Wait times are too long. Bus 45 is always late.",date:"2026-02-15",status:"new"}];let d=[],l=[],o=[];const s={feedList:document.getElementById("feedback-list"),clustersList:document.getElementById("clusters-list"),duplicatesList:document.getElementById("duplicates-list"),totalCount:document.getElementById("total-count"),duplicateCount:document.getElementById("duplicate-count"),themeCount:document.getElementById("theme-count"),analyzeBtn:document.getElementById("analyze-btn"),importBtn:document.getElementById("import-btn"),tabs:document.querySelectorAll(".tab-btn"),tabContents:document.querySelectorAll(".tab-content")};function h(){y(),x()}function y(){s.importBtn.addEventListener("click",g),s.analyzeBtn.addEventListener("click",v),s.tabs.forEach(t=>{t.addEventListener("click",()=>{s.tabs.forEach(i=>i.classList.remove("active")),s.tabContents.forEach(i=>i.classList.remove("active")),t.classList.add("active"),document.getElementById(`${t.dataset.tab}-tab`).classList.add("active"),t.dataset.tab})})}function g(){c("Importing 1,240 records..."),setTimeout(()=>{d=[...f],s.totalCount.textContent=d.length,p(),c("Import complete.")},800)}function v(){if(d.length===0){c("Import data first!");return}s.analyzeBtn.disabled=!0,s.analyzeBtn.textContent="Processing...",setTimeout(()=>{b(),s.analyzeBtn.disabled=!1,s.analyzeBtn.textContent="Re-analyze",s.duplicateCount.textContent=o.length,s.themeCount.textContent=l.length,w(),L(),c("Analysis complete: Disregarding duplicates and grouping themes.")},2e3)}function b(){const t=new Map,n=[];o=[],d.forEach(a=>{const e=a.text.toLowerCase().trim();t.has(e)?o.push(a):(t.set(e,a.id),n.push(a))});const i={"Wait Times & Scheduling":[],"Mobile App Reliability":[],"Driver & Staff Praise":[],"Infrastructure Requests":[],"General Improvement":[]};n.forEach(a=>{const e=a.text.toLowerCase();e.includes("wait")||e.includes("time")||e.includes("schedule")||e.includes("late")?i["Wait Times & Scheduling"].push(a):e.includes("app")||e.includes("android")||e.includes("crash")||e.includes("broken")?i["Mobile App Reliability"].push(a):e.includes("helpful")||e.includes("staff")||e.includes("driver")||e.includes("great")?i["Driver & Staff Praise"].push(a):e.includes("rack")||e.includes("stop")||e.includes("bike")||e.includes("infrastructure")?i["Infrastructure Requests"].push(a):i["General Improvement"].push(a)}),l=Object.entries(i).filter(([a,e])=>e.length>0).map(([a,e])=>({title:a,count:e.length,samples:e.slice(0,3)}))}function x(){p()}function p(){if(d.length===0){s.feedList.innerHTML=`
      <div class="loading-state">
        <p>No data imported. Click 'Import Data' to begin.</p>
      </div>
    `;return}s.feedList.innerHTML=d.map(t=>`
    <div class="feedback-card" style="animation-delay: ${t.id*.05}s">
      <div class="card-header">
        <span class="source-tag">${t.source}</span>
        <span class="date-tag">${t.date}</span>
      </div>
      <p>"${t.text}"</p>
      <div class="card-footer">
        <span class="theme-pill">${t.status}</span>
      </div>
    </div>
  `).join("")}function w(){if(l.length===0){s.clustersList.innerHTML='<p class="placeholder-text">Run analysis to see thematic clusters</p>';return}s.clustersList.innerHTML=l.map(t=>`
    <div class="cluster-item">
      <div class="cluster-header">
        <div class="cluster-title">
          <h3>${t.title}</h3>
          <span class="cluster-count">${t.count} entries</span>
        </div>
      </div>
      <div class="cluster-body">
        <p class="cluster-summary">AI has identified ${t.count} similar reports regarding this theme.</p>
        <div class="cluster-samples">
          ${t.samples.map(n=>`<div class="sample-text">${n.text}</div>`).join("")}
        </div>
      </div>
    </div>
  `).join("")}function L(){if(o.length===0){s.duplicatesList.innerHTML='<p class="placeholder-text">No duplicates identified</p>';return}s.duplicatesList.innerHTML=`
    <div class="search-bar">
      <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1rem;">
        The system has flagged ${o.length} items as direct or near-exact duplicates.
      </p>
    </div>
    <div class="feedback-grid">
      ${o.map(t=>`
        <div class="feedback-card" style="opacity: 0.7">
          <div class="card-header">
            <span class="source-tag">DUPLICATE</span>
            <span class="date-tag">${t.date}</span>
          </div>
          <p>"${t.text}"</p>
          <div class="card-footer">
            <span class="theme-pill" style="color: var(--accent-purple)">Redundant</span>
          </div>
        </div>
      `).join("")}
    </div>
  `}function c(t){const n=document.createElement("div");n.className="toast",n.textContent=t,document.getElementById("toast-container").appendChild(n),Object.assign(n.style,{position:"fixed",bottom:"24px",right:"24px",background:"var(--surface-alt)",color:"var(--text-main)",padding:"12px 24px",borderRadius:"8px",border:"1px solid var(--primary)",boxShadow:"var(--shadow-lg)",zIndex:"2000",animation:"slideIn 0.3s forwards ease-out"}),setTimeout(()=>{n.style.animation="fadeOut 0.3s forwards ease-in",setTimeout(()=>n.remove(),300)},3e3)}const m=document.createElement("style");m.textContent=`
  @keyframes fadeOut {
    from { opacity: 1; transform: translateY(0); }
    to { opacity: 0; transform: translateY(10px); }
  }
`;document.head.appendChild(m);h();
