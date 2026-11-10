// COURS CAMPUS - V3 - By ADIKA - 30 JOURS PAR PERSONNE
const STORAGE_KEY = 'campus_codes_v3';
const UNLOCK_KEY = 'campus_unlocked_v3';
const CODE_PATRON = 'RASTIZY228';

let validCodes = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
let unlocked = localStorage.getItem(UNLOCK_KEY) === 'yes';
let lastCode = '';

if(validCodes.length === 0){
  validCodes = [
    { code: 'CAMPUS-1001', date: Date.now() },
    { code: 'CAMPUS-1002', date: Date.now() }
  ];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(validCodes));
}

function showFiliere(id){
  document.querySelectorAll('.cours').forEach(e=>e.classList.remove('show'));
  document.getElementById(id).classList.add('show');
  window.scrollTo({top:600,behavior:'smooth'});
  updateLocks();
}

function checkCode(){
  const c = document.getElementById('codeInput').value.trim().toUpperCase();
  const msg = document.getElementById('msg');
  if(c === CODE_PATRON){
    localStorage.setItem(UNLOCK_KEY,'yes');
    unlocked = true;
    msg.innerHTML = '👑 BIENVENUE PATRON RASTIZY228 ! Accès à vie débloqué ! ❤️';
    document.getElementById('status').innerHTML = '👑 MODE PATRON - À VIE';
    updateLocks();
    return;
  }
  const trouve = validCodes.find(x => x.code === c);
  if(!trouve){
    msg.innerHTML = '❌ Code faux ! Paie 1000F Flooz pour avoir ton code.';
    return;
  }
  const maintenant = Date.now();
  const difference = maintenant - trouve.date;
  const trenteJours = 30 * 24 * 60 * 60 * 1000;
  if(difference > trenteJours){
    msg.innerHTML = '⏰ Ton code de 30 jours est fini ! Repaie 1000F pour un nouveau code.';
    return;
  }
  const joursRestants = Math.ceil((trenteJours - difference) / (24*60*60*1000));
  localStorage.setItem(UNLOCK_KEY,'yes');
  unlocked = true;
  msg.innerHTML = '✅ CODE BON ! Il te reste ' + joursRestants + ' jours ! Bienvenue PRO ❤️';
  document.getElementById('status').innerHTML = '✅ MODE PRO - Reste ' + joursRestants + ' jours';
  updateLocks();
}

function updateLocks(){
  if(!unlocked) return;
  document.querySelectorAll('.lock').forEach(e=>e.innerHTML='✅');
  document.querySelectorAll('.cours-item').forEach(e=>{
    if(e.innerHTML.includes('PRO') && !e.innerHTML.includes('DÉBLOQUÉ')){
      e.innerHTML = e.innerHTML.replace('🔒','✅').replace('PRO','PRO DÉBLOQUÉ');
    }
  });
}

function showAdmin(){
  document.getElementById('main').style.display='none';
  document.getElementById('admin').classList.add('show');
}
function backMain(){
  document.getElementById('admin').classList.remove('show');
  document.getElementById('main').style.display='block';
}
function loginAdmin(){
  if(document.getElementById('adminPass').value==='ADIKA123'){
    document.getElementById('adminZone').style.display='block';
    renderCodes();
  } else alert('Mot de passe faux !');
}
function genCode(){
  const code = 'CAMPUS-' + Math.floor(1000+Math.random()*9000);
  lastCode = code;
  validCodes.push({ code: code, date: Date.now() });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(validCodes));
  const el = document.getElementById('newCode');
  el.style.display='block';
  el.textContent = code + ' - Valable 30 jours à partir d\'aujourd\'hui';
  document.getElementById('copyBtn').style.display='block';
  renderCodes();
}
function copyCode(){
  if(!lastCode) return;
  navigator.clipboard.writeText(lastCode).then(()=> alert('Code copié ! ✅ : ' + lastCode));
}
function renderCodes(){
  const trenteJours = 30 * 24 * 60 * 60 * 1000;
  const maintenant = Date.now();
  let html = '<div style="background:#ffaa00;color:#000;padding:10px;border-radius:10px;margin-bottom:10px;"><b>👑 TON CODE PATRON : RASTIZY228</b><br>Ne s\'expire jamais - Ne le donne à personne !</div>';
  html += validCodes.map(obj=>{
    const reste = Math.ceil((trenteJours - (maintenant - obj.date)) / (24*60*60*1000));
    const dateCree = new Date(obj.date).toLocaleDateString('fr-FR');
    if(reste <= 0){ return '• ' + obj.code + ' - ⏰ EXPIRÉ - créé le ' + dateCree; }
    else { return '• ' + obj.code + ' - créé le ' + dateCree + ' - reste ' + reste + ' jours'; }
  }).join('<br>');
  document.getElementById('listCodes').innerHTML = html;
  document.getElementById('countCodes').textContent = '(' + validCodes.length + ')';
}
updateLocks();
