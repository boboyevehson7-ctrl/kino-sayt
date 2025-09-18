// admin.js — oddiy parol (o'zgartirish mumkin)
const ADMIN_PASS = 'joRAadmin2025'; // agar xohlasang bu yerni o'zgartir
const authBox = document.getElementById('authBox');
const panel = document.getElementById('panel');
const authBtn = document.getElementById('authBtn');
const adminPass = document.getElementById('adminPass');

const tTitle = document.getElementById('tTitle');
const tVideo = document.getElementById('tVideo');
const tTG = document.getElementById('tTG');
const tDesc = document.getElementById('tDesc');
const saveBtn = document.getElementById('saveBtn');
const newBtn = document.getElementById('newBtn');
const exportBtn = document.getElementById('exportBtn');
const clearBtn = document.getElementById('clearBtn');
const listArea = document.getElementById('listArea');

let TREYLERS = [];
let editingId = null;

function load() {
  const local = localStorage.getItem('treylers');
  if (local) { TREYLERS = JSON.parse(local); }
  else {
    // try load treylerlar.json if present (only on initial visit)
    fetch('treylerlar.json').then(r=>r.json()).then(data=>{
      TREYLERS = data || [];
      renderList();
    }).catch(()=>{ renderList(); });
  }
  renderList();
}

function renderList(){
  listArea.innerHTML = '';
  if (!TREYLERS.length) { listArea.innerHTML = '<p class="muted">Treylerlar mavjud emas.</p>'; return; }
  TREYLERS.forEach(t=>{
    const div = document.createElement('div'); div.className='card';
    div.innerHTML = `<h4>${t.title}</h4><p class="muted">${t.desc}</p>
      <div style="display:flex;gap:8px">
        <button class="btn" data-edit="${t.id}">Tahrirlash</button>
        <button class="btn" data-del="${t.id}">O'chirish</button>
      </div>`;
    listArea.appendChild(div);
    div.querySelector('[data-edit]').addEventListener('click', ()=> startEdit(t.id));
    div.querySelector('[data-del]').addEventListener('click', ()=> deleteItem(t.id));
  });
}

function startEdit(id){
  const item = TREYLERS.find(x=>x.id===id); if(!item) return;
  editingId = id;
  tTitle.value = item.title; tVideo.value = item.video; tDesc.value = item.desc; tTG.value = item.tg || '';
}

function deleteItem(id){
  if (!confirm('Rostdan o\'chirasizmi?')) return;
  TREYLERS = TREYLERS.filter(x=>x.id!==id);
  saveLocal();
  renderList();
  alert('O\'chirildi');
}

function saveLocal(){ localStorage.setItem('treylers', JSON.stringify(TREYLERS)); }

authBtn.addEventListener('click', ()=>{
  if (adminPass.value === ADMIN_PASS) {
    authBox.classList.add('hidden'); panel.classList.remove('hidden');
    load();
    // if came here to edit a specific id
    const toEdit = localStorage.getItem('kp_edit_id');
    if (toEdit) { startEdit(toEdit); localStorage.removeItem('kp_edit_id'); }
  } else alert('Noto\'g\'ri parol');
});

saveBtn.addEventListener('click', ()=>{
  const title = tTitle.value.trim(); const video = tVideo.value.trim(); const desc = tDesc.value.trim(); const tg = tTG.value.trim();
  if (!title || !video) { alert('Iltimos nom va video kiriting'); return; }
  if (editingId) {
    const it = TREYLERS.find(x=>x.id===editingId);
    if (it) { it.title = title; it.video = video; it.desc = desc; it.tg = tg; }
    editingId = null;
  } else {
    const id = 'k'+Date.now().toString(36);
    TREYLERS.unshift({id,title,video,desc,tg});
  }
  tTitle.value=''; tVideo.value=''; tDesc.value=''; tTG.value='https://t.me/KinoProLab';
  saveLocal(); renderList();
  alert('Saqlangan');
});

newBtn.addEventListener('click', ()=>{
  editingId = null; tTitle.value=''; tVideo.value=''; tDesc.value=''; tTG.value='https://t.me/KinoProLab';
});

exportBtn.addEventListener('click', ()=>{
  const blob = new Blob([JSON.stringify(TREYLERS, null, 2)], {type:'application/json'});
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download='treylerlar_export.json'; a.click();
});

clearBtn.addEventListener('click', ()=>{
  if (!confirm('Hammasini o\'chirishni xohlaysizmi?')) return;
  TREYLERS = []; saveLocal(); renderList();
  alert('Hammasi o\'chirildi');
});

// If not logged in and email not present, redirect back
const em = localStorage.getItem('kp_user_email');
if (!em) {
  alert('Birinchidan saytga email bilan kiring (index sahifasiga qayting).');
  window.location.href = 'index.html';
}

