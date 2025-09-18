// app.js — yuklash, qidirish, modal
let TREYLERS = [];
const FEED = document.getElementById('feed');
const SEARCH = document.getElementById('search');
const MODAL = document.getElementById('modal');
const modalVideoWrap = document.getElementById('modalVideoWrap');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');
const modalTG = document.getElementById('modalTG');
const closeModal = document.getElementById('closeModal');

async function loadInitial() {
  // 1) Agar localStorageda bor bo'lsa, undan olamiz
  const local = localStorage.getItem('treylers');
  if (local) {
    TREYLERS = JSON.parse(local);
    renderFeed(TREYLERS);
    return;
  }
  // 2) Aks holda treylerlar.json faylidan yuklaymiz
  try {
    const res = await fetch('treylerlar.json');
    TREYLERS = await res.json();
  } catch (e) {
    TREYLERS = [];
    console.warn('treylerlar.json topilmadi yoki yuklanmadi', e);
  }
  renderFeed(TREYLERS);
}

function renderFeed(list) {
  FEED.innerHTML = '';
  if (!list.length) {
    FEED.innerHTML = '<p style="color:#999;padding:20px">Hozircha treylerlar mavjud emas.</p>';
    return;
  }
  list.forEach(item => {
    const card = document.createElement('div'); card.className = 'card';
    card.innerHTML = `
      <div class="videoThumb">
        <video src="${item.video}" muted preload="metadata"></video>
      </div>
      <div class="meta">
        <h3>${item.title}</h3>
        <p>${item.desc}</p>
        <div class="btnRow">
          <button class="btn primary" data-id="${item.id}">▶ Tomosha qilish</button>
          <button class="btn" data-id-edit="${item.id}">✎ Tahrirlash</button>
        </div>
      </div>
    `;
    FEED.appendChild(card);

    // play preview on hover (optional)
    const vid = card.querySelector('video');
    card.addEventListener('mouseenter', ()=>{ try{ vid.play(); }catch(e){} });
    card.addEventListener('mouseleave', ()=>{ try{ vid.pause(); vid.currentTime=0; }catch(e){} });

    card.querySelector('[data-id]').addEventListener('click', ()=> openModal(item));
    card.querySelector('[data-id-edit]').addEventListener('click', ()=> openAdminEdit(item.id));
  });
}

function openModal(item){
  modalVideoWrap.innerHTML = `<video controls src="${item.video}" style="width:100%;max-height:420px"></video>`;
  modalTitle.textContent = item.title;
  modalDesc.textContent = item.desc;
  modalTG.href = item.tg || 'https://t.me/KinoProLab';
  MODAL.classList.remove('hidden');
}

closeModal.addEventListener('click', ()=>{ MODAL.classList.add('hidden'); modalVideoWrap.innerHTML=''; });

SEARCH.addEventListener('input', ()=>{
  const q = SEARCH.value.trim().toLowerCase();
  if (!q) return renderFeed(TREYLERS);
  const filtered = TREYLERS.filter(t => t.title.toLowerCase().includes(q));
  renderFeed(filtered);
});

// Email gate (simple)
const emailGate = document.getElementById('emailGate');
const emailInput = document.getElementById('emailInput');
const emailSubmit = document.getElementById('emailSubmit');
emailSubmit.addEventListener('click', ()=>{
  const em = emailInput.value.trim();
  if (!em || !em.includes('@')) { alert('Iltimos haqiqiy email kiriting'); return; }
  localStorage.setItem('kp_user_email', em);
  emailGate.style.display = 'none';
});

// open admin from index (will open admin.html)
document.getElementById('goAdmin').addEventListener('click', ()=>{
  window.location.href = 'admin.html';
});

// For admin edit button: go to admin and pass id via query
function openAdminEdit(id){
  localStorage.setItem('kp_edit_id', id);
  window.location.href = 'admin.html';
}

loadInitial();
