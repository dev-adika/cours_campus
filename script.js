// ANTI-COPIE
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('copy', e => e.preventDefault());

// VARIABLES
let score = 0;
let answered = 0;
let codesValides = JSON.parse(localStorage.getItem('campus_codes') || '[]');

// PAGE SECRETE : si URL contient ?admin=adika123, on montre la page admin
if (window.location.search.includes('admin=adika123')) {
  document.getElementById('adminSection').classList.remove('hidden');
  document.getElementById('adminSection').scrollIntoView();
}

// CHANGER DE QUIZ
function showQuiz(id, el) {
  document.querySelectorAll('.quiz-block').forEach(b => b.classList.add('hidden'));
  document.getElementById('quiz-' + id).classList.remove('hidden');
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  resetQuiz();
}

// VERIFIER REPONSE QUIZ
function check(el, good) {
  if (el.dataset.clicked) return;
  el.dataset.clicked = "1";
  if (good == 1) {
    el.classList.add('correct');
    score++;
  } else {
    el.classList.add('wrong');
  }
  answered++;
  document.getElementById('score').innerText = "Score : " + score + " / " + answered;
  if (answered >= 5) {
    document.getElementById('score').innerText = "🏆 BRAVO ! Score final : " + score + " / 5 - Fais un screenshot !";
  }
}

function resetQuiz() {
  score = 0;
  answered = 0;
  document.querySelectorAll('.opt').forEach(o => {
    o.classList.remove('correct', 'wrong');
    delete o.dataset.clicked;
  });
  document.getElementById('score').innerText = "Score : 0 / 5";
}

// PAYER - SEULEMENT POUR PAYER, PAS POUR JOUER
function payer() {
  let n = document.getElementById('nom').value || "Poto";
  let f = document.getElementById('filiere').value;
  let msg = "Bonjour COURS CAMPUS, je suis " + encodeURIComponent(n) + " en " + encodeURIComponent(f) + ", je veux payer PREMIUM 1000F par Flooz / T-Money";
  window.location.href = "https://wa.me/22897528950?text=" + msg;
}

// CREER UN CODE - PAGE SECRETE ADIKA
function creerCode() {
  let nom = document.getElementById('clientNom').value || "Client";
  let fil = document.getElementById('clientFiliere').value;
  let duree = document.getElementById('clientDuree').value;
  let code = "CAMPUS-" + Math.random().toString(36).substring(2, 6).toUpperCase() + "-" + Math.floor(Math.random() * 9000 + 1000);
  let obj = { code: code, nom: nom, filiere: fil, duree: duree, date: Date.now() };
  codesValides.push(obj);
  localStorage.setItem('campus_codes', JSON.stringify(codesValides));
  document.getElementById('codeResult').classList.remove('hidden');
  document.getElementById('codeResult').innerText = code;
  document.getElementById('codeInfo').innerText = "Pour : " + nom + " - " + fil + " - " + duree + " jours.";
  window._lastCode = code;
  window._lastNom = nom;
}

function copierCode() {
  if (!window._lastCode) { alert("Crée d'abord un code poto !"); return; }
  let txt = "Salut " + window._lastNom + " ! Voici ton code COURS CAMPUS PREMIUM : " + window._lastCode + " . Va sur le site, mets-le dans PREMIUM > J'AI DEJA UN CODE. Merci ! - ADIKA";
  navigator.clipboard.writeText(txt);
  alert("Copié ! Colle-le sur WhatsApp ou Email : " + txt);
}

// VERIFIER CODE CLIENT
function verifierCode() {
  let c = document.getElementById('codeClient').value.trim().toUpperCase();
  let trouve = codesValides.find(x => x.code === c);
  if (trouve) {
    alert("✅ CODE VALIDE ! Bienvenue " + trouve.nom + " - " + trouve.filiere + " débloqué pour " + trouve.duree + " jours !");
    document.querySelectorAll('.lock').forEach(e => e.classList.remove('lock'));
  } else {
    alert("❌ Code invalide. Contacte ADIKA sur WhatsApp 97 52 89 50 ou Email rastizy2007@gmail.com");
  }
}