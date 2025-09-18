// Kinolarni massivda saqlaymiz
const kinolar = [
  { nom: "Oppenheimer", trailer: "https://www.youtube.com/embed/uYPbbksJxIg", malumot: "Biografik, Drama, 2023" },
  { nom: "Dune 2", trailer: "https://www.youtube.com/embed/_YUzQa_1RCE", malumot: "Fantastika, 2024" },
  { nom: "John Wick 4", trailer: "https://www.youtube.com/embed/qEVUtrk8_B4", malumot: "Jangari, 2023" }
];

// Elementlarni tanlaymiz
const qidirishInput = document.getElementById("qidirish");
const kinoList = document.getElementById("kino-list");
const modal = document.getElementById("modal");
const modalVideo = document.getElementById("modal-video");
const modalTitle = document.getElementById("modal-title");
const modalInfo = document.getElementById("modal-info");

// Sayt ochilganda kinolarni chiqaramiz
function kinolarniChiz() {
  kinoList.innerHTML = "";
  kinolar.forEach((kino, index) => {
    const card = document.createElement("div");
    card.className = "kino-card";
    card.innerHTML = `
      <h3>${kino.nom}</h3>
      <button onclick="kinoOch(${index})">▶ Treyler</button>
    `;
    kinoList.appendChild(card);
  });
}

// Qidirish
qidirishInput.addEventListener("input", () => {
  const qiymat = qidirishInput.value.toLowerCase();
  kinoList.innerHTML = "";
  kinolar
    .filter(k => k.nom.toLowerCase().includes(qiymat))
    .forEach((kino, index) => {
      const card = document.createElement("div");
      card.className = "kino-card";
      card.innerHTML = `
        <h3>${kino.nom}</h3>
        <button onclick="kinoOch(${index})">▶ Treyler</button>
      `;
      kinoList.appendChild(card);
    });
});

// Modal ochish
function kinoOch(index) {
  modal.style.display = "block";
  modalVideo.src = kinolar[index].trailer;
  modalTitle.innerText = kinolar[index].nom;
  modalInfo.innerText = kinolar[index].malumot;
}

// Modal yopish
function modalYop() {
  modal.style.display = "none";
  modalVideo.src = "";
}

// Dastlabki chizish
kinolarniChiz();
