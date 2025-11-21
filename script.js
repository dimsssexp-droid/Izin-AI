const nama = document.getElementById('nama');
const kelas = document.getElementById('kelas');
const jenis = document.getElementById('jenis');
const tanggal = document.getElementById('tanggal');
const catatan = document.getElementById('catatan');
const schoolName = document.getElementById('schoolName');
const letterheadEl = document.getElementById('letterhead');
const helpBtn = document.getElementById('helpBtn');
const introModal = document.getElementById('introModal');
const dontShowIntro = document.getElementById('dontShowIntro');
const gotItBtn = document.getElementById('gotItBtn');
const closeIntroBtn = document.getElementById('closeIntro');

const prevTanggal = document.getElementById('previewTanggal');
const prevIsi = document.getElementById('previewIsi');
const prevPerihal = document.getElementById('previewPerihal');
const prevNo = document.getElementById('previewNo');

const previewBtn = document.getElementById('previewBtn');
const resetBtn = document.getElementById('resetBtn');
const darkToggle = document.getElementById('darkToggle');
const downloadImgBtn = document.getElementById('downloadImgBtn');


// Batasi tanggal maksimal = hari ini
const today = new Date().toISOString().split("T")[0];
tanggal.max = today;
tanggal.value = today;

// initialize school name (persisted in localStorage)
const DEFAULT_SCHOOL = 'SMKN 1 Grogol';
if(schoolName){
  const savedSchool = localStorage.getItem('schoolName');
  schoolName.value = savedSchool || '';
  if(letterheadEl) letterheadEl.textContent = savedSchool || DEFAULT_SCHOOL;
  schoolName.addEventListener('input', (e)=>{
    const v = (e.target.value || '').trim();
    if(letterheadEl) letterheadEl.textContent = v || DEFAULT_SCHOOL;
    localStorage.setItem('schoolName', v);
  });
}

// school address, nomor, perihal, jabatan references
const schoolAddressInput = document.getElementById('schoolAddress');
const schoolAddressPreview = document.getElementById('schoolAddressPreview');
const footerAddress = document.getElementById('footerAddress');
const nomorSurat = document.getElementById('nomorSurat');
const perihal = document.getElementById('perihal');
const sigRoleInput = document.getElementById('sigRole');

// initialize school address from localStorage
if(schoolAddressInput){
  const savedAddr = localStorage.getItem('schoolAddress');
  schoolAddressInput.value = savedAddr || '';
  if(schoolAddressPreview) schoolAddressPreview.textContent = savedAddr || 'Jl. Contoh No.1 — Kediri';
  if(footerAddress) footerAddress.textContent = savedAddr || 'Jl. Contoh No.1 — Kediri';
  schoolAddressInput.addEventListener('input', (e)=>{
    const v = (e.target.value || '').trim();
    if(schoolAddressPreview) schoolAddressPreview.textContent = v || 'Jl. Contoh No.1 — Kediri';
    if(footerAddress) footerAddress.textContent = v || 'Jl. Contoh No.1 — Kediri';
    localStorage.setItem('schoolAddress', v);
  });
}

// Intro/help modal handling
function openIntro(){
  if(introModal) introModal.style.display = 'flex';
}
function closeIntro(save){
  if(introModal) introModal.style.display = 'none';
  if(save && dontShowIntro && dontShowIntro.checked){
    localStorage.setItem('seenIntro','true');
  }
}

if(helpBtn) helpBtn.addEventListener('click', ()=> openIntro());
if(gotItBtn) gotItBtn.addEventListener('click', ()=> closeIntro(dontShowIntro && dontShowIntro.checked));
if(closeIntroBtn) closeIntroBtn.addEventListener('click', ()=> closeIntro(dontShowIntro && dontShowIntro.checked));

// Show intro/modal on first visit (unless user opted out)
try{
  const seen = localStorage.getItem('seenIntro');
  if(!seen || seen !== 'true'){
    // small delay so layout settles
    setTimeout(openIntro, 600);
  }
}catch(e){ /* ignore storage errors */ }

function generateText(){
  const n = nama.value.trim();
  const k = kelas.value.trim();
  const t = tanggal.value;
  const c = catatan.value.trim();

  if(!n || !k || !t){
    prevIsi.innerHTML = "Harap isi semua data wajib.";
    return;
  }

  let jenisText = "";
  switch(jenis.value){
    case "sakit": jenisText = ` saya ${n} dari kelas ${k} memberitahukan bahwa saya tidak dapat mengikuti pelajaran pada tanggal ${t} dikarenakan sakit, mohon bapak/ibu guru memakluminya danSaya berkomitmen akan menyelesaikan seluruh tugas atau kewajiban yang tertunda setelah saya dapat kembali beraktivitas seperti biasa.

Demikian surat izin ini saya buat dengan sebenar-benarnya. Atas perhatian dan pengertiannya, saya ucapkan terima kasih..`; break;
    case "telat": jenisText = `saya ${n} dari kelas ${k} akan datang terlambat pada tanggal ${t}. Mohon izin dan terimakasih kepada bapak/ibu guru atas pengertiannya dan Saya berkomitmen akan menyelesaikan seluruh tugas atau kewajiban yang tertunda setelah saya dapat kembali beraktivitas seperti biasa.

Demikian surat izin ini saya buat dengan sebenar-benarnya. Atas perhatian dan pengertiannya, saya ucapkan terima kasih..`; break;
    case "acara": jenisText = `saya ${n} kelas ${k} tidak dapat hadir pada tanggal ${t} karena adanya acara keluarga, Mohon izin dan kepada bapak/ibu guru atas pengertiannya dan Saya berkomitmen akan menyelesaikan seluruh tugas atau kewajiban yang tertunda setelah saya dapat kembali beraktivitas seperti biasa.

Demikian surat izin ini saya buat dengan sebenar-benarnya. Atas perhatian dan pengertiannya, saya ucapkan terima kasih..`; break;
    case "disp": jenisText = `${n}saya dari kelas ${k} memohon dispensasi pada tanggal ${t} dikarenakan ada acara organisasi, mohon izin  kepada bapak/ibu guru atas pengertiannya Saya berkomitmen akan menyelesaikan seluruh tugas atau kewajiban yang tertunda setelah saya dapat kembali beraktivitas seperti biasa.

Demikian surat izin ini saya buat dengan sebenar-benarnya. Atas perhatian dan pengertiannya, saya ucapkan terima kasih..`; break;
  }

  const extra = c ? `<br><br>Catatan tambahan: ${c}` : "";

  const no = (nomorSurat && nomorSurat.value) ? nomorSurat.value.trim() : '';
  const p = (perihal && perihal.value) ? perihal.value.trim() : '';

  prevTanggal.innerHTML = `Kediri, ${t}`;
  if(prevPerihal) prevPerihal.innerHTML = p ? `<strong>Perihal:</strong> ${p}` : `<strong>Perihal:</strong> —`;
  if(prevNo) prevNo.innerText = no ? `No: ${no}` : 'No: —';
  prevIsi.innerHTML = jenisText + extra;
}

previewBtn.onclick = generateText;

resetBtn.onclick = () => {
  nama.value = "nama";
  kelas.value = "kelas";
  catatan.value = "";
  jenis.value = "sakit";
  tanggal.value = today;
  prevTanggal.innerHTML = "Kediri, —";
  prevIsi.innerHTML = "Isi surat akan tampil di sini.";
  // reset school name to default (do not erase user's placeholder entirely)
  if(schoolName) { schoolName.value = ''; }
  if(letterheadEl) { letterheadEl.textContent = DEFAULT_SCHOOL; }
  // clear new fields
  if(schoolAddressInput) { schoolAddressInput.value = ''; }
  if(schoolAddressPreview) { schoolAddressPreview.textContent = 'Jl. Contoh No.1 — Kediri'; }
  if(footerAddress) { footerAddress.textContent = 'Jl. Contoh No.1 — Kediri'; }
  if(nomorSurat) nomorSurat.value = '';
  if(perihal) perihal.value = '';
};

/* PDF download removed per request */

// Download preview as image (PNG) using html2canvas (loaded dynamically if needed)
if(downloadImgBtn){
  downloadImgBtn.addEventListener('click', async ()=>{
    try{
      if(introModal) introModal.style.display = 'none';
      if(typeof generateText === 'function') generateText();
      if(typeof attachSignatureToPreview === 'function') attachSignatureToPreview();

      const element = document.getElementById('surat');
      if(!element){ alert('Preview tidak ditemukan. Tekan "Tampilkan Preview" terlebih dahulu.'); return; }

      downloadImgBtn.disabled = true;

      // wait for images in preview
      const imgs = Array.from(element.querySelectorAll('img')).filter(i=>i.src);
      await Promise.all(imgs.map(img => new Promise((resolve) => {
        if(img.complete) return resolve();
        img.addEventListener('load', ()=>resolve(), { once: true });
        img.addEventListener('error', ()=>resolve(), { once: true });
      })));

      // dynamic loader for html2canvas
      const loadHtml2canvas = () => new Promise((resolve, reject) => {
        if(window.html2canvas || window.html2canvas === undefined && window.html2canvas === undefined){
          // proceed to load script
        }
        if(window.html2canvas || window.html2canvas !== undefined) return resolve(window.html2canvas);
        const s = document.createElement('script');
        s.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
        s.onload = () => resolve(window.html2canvas || window.html2canvas);
        s.onerror = reject;
        document.head.appendChild(s);
      });

      // ensure html2canvas available
      if(!window.html2canvas && !window.html2canvas){
        await loadHtml2canvas();
      }

      if(window.html2canvas || window.html2canvas){
        // use html2canvas to render
        const canv = await window.html2canvas(element, {scale:2, useCORS:true, logging:false});
        canv.toBlob((blob)=>{
          if(!blob){ alert('Gagal membuat gambar.'); downloadImgBtn.disabled = false; return; }
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'surat-izin.png';
          document.body.appendChild(a);
          a.click();
          a.remove();
          URL.revokeObjectURL(url);
          downloadImgBtn.disabled = false;
        }, 'image/png', 0.95);
      } else {
        alert('Tidak dapat memuat library screenshot.');
        downloadImgBtn.disabled = false;
      }
    }catch(err){
      console.error('Image generation failed', err);
      alert('Gagal membuat gambar. Periksa console.');
      downloadImgBtn.disabled = false;
    }
  });
}
 
function setTheme(isDark){
  const switchEl = darkToggle.querySelector('.switch');
  const label = darkToggle.querySelector('.toggle-label');

  if(isDark){
    document.body.classList.add('dark');
    darkToggle.setAttribute('aria-pressed','true');
    if(switchEl) switchEl.setAttribute('aria-checked','true');
    if(label) label.textContent = "Dark mode: On";
    localStorage.setItem('theme','dark');
  } else {
    document.body.classList.remove('dark');
    darkToggle.setAttribute('aria-pressed','false');
    if(switchEl) switchEl.setAttribute('aria-checked','false');
    if(label) label.textContent = "Dark mode: Off";
    localStorage.setItem('theme','light');
  }
}

// Inisialisasi tema dari localStorage
const saved = localStorage.getItem('theme');
setTheme(saved === 'dark');

darkToggle.onclick = () => {
  setTheme(!document.body.classList.contains('dark'));
};

// Signature pad logic
const signaturePad = document.getElementById('signaturePad');
const clearSigBtn = document.getElementById('clearSig');
const useSigBtn = document.getElementById('useSig');
const uploadSig = document.getElementById('uploadSig');
const sigNameInput = document.getElementById('sigName');
const sigDateInput = document.getElementById('sigDate');
let sigDataUrl = null;
if(signaturePad){
  const ctx = signaturePad.getContext('2d');
  let drawing = false;
  let lastX = 0, lastY = 0;
  const scaleCanvas = () => {
    // make canvas crisp on HiDPI
    const dpr = window.devicePixelRatio || 1;
    const rect = signaturePad.getBoundingClientRect();
    signaturePad.width = rect.width * dpr;
    signaturePad.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#111';
  };
  // ensure CSS width/height respected
  signaturePad.style.width = signaturePad.width + 'px';
  signaturePad.style.height = signaturePad.height + 'px';
  window.addEventListener('resize', () => { setTimeout(scaleCanvas,10); });
  setTimeout(scaleCanvas,50);

  function pointerDown(e){
    drawing = true;
    const rect = signaturePad.getBoundingClientRect();
    lastX = (e.clientX || e.touches && e.touches[0].clientX) - rect.left;
    lastY = (e.clientY || e.touches && e.touches[0].clientY) - rect.top;
  }
  function pointerMove(e){
    if(!drawing) return;
    e.preventDefault();
    const rect = signaturePad.getBoundingClientRect();
    const x = (e.clientX || e.touches && e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches && e.touches[0].clientY) - rect.top;
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();
    lastX = x; lastY = y;
  }
  function pointerUp(){ drawing = false; }

  signaturePad.addEventListener('pointerdown', pointerDown);
  signaturePad.addEventListener('pointermove', pointerMove);
  signaturePad.addEventListener('pointerup', pointerUp);
  signaturePad.addEventListener('pointercancel', pointerUp);
  // support touch fallback
  signaturePad.addEventListener('touchstart', (e)=>{ pointerDown(e.touches[0]); });
  signaturePad.addEventListener('touchmove', (e)=>{ pointerMove(e.touches[0]); });
  signaturePad.addEventListener('touchend', pointerUp);

  clearSigBtn.addEventListener('click', ()=>{
    ctx.clearRect(0,0,signaturePad.width, signaturePad.height);
    sigDataUrl = null;
  });

  useSigBtn.addEventListener('click', ()=>{
    // save data URL and put into preview
    sigDataUrl = signaturePad.toDataURL('image/png');
    const sigImg = document.getElementById('sigPreview');
    if(sigImg){ sigImg.src = sigDataUrl; sigImg.style.display = 'block'; }

    // also set name and date from inputs into preview
    const nameVal = sigNameInput ? sigNameInput.value.trim() : '';
    const dateVal = sigDateInput ? sigDateInput.value : '';
      const sigNamePreview = document.getElementById('sigNamePreview');
      const sigDatePreview = document.getElementById('sigDatePreview');
      const sigRolePreview = document.getElementById('sigRolePreview');
      const sigInfo = document.getElementById('sigInfo');
      if(sigNamePreview) sigNamePreview.textContent = nameVal || '';
      if(sigRolePreview) sigRolePreview.textContent = sigRoleInput && sigRoleInput.value ? sigRoleInput.value : '';
      if(sigDatePreview) sigDatePreview.textContent = dateVal ? (new Date(dateVal)).toLocaleDateString() : '';
      if(sigInfo) sigInfo.style.display = (nameVal || dateVal || (sigRoleInput && sigRoleInput.value)) ? 'block' : (sigImg && sigImg.src ? 'block' : 'none');
  });

  uploadSig.addEventListener('change', (ev)=>{
    const file = ev.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = function(evt){
      const img = new Image();
      img.onload = function(){
        // draw uploaded image into canvas scaled
        ctx.clearRect(0,0,signaturePad.width, signaturePad.height);
        const rect = signaturePad.getBoundingClientRect();
        const hRatio = rect.width / img.width;
        const vRatio = rect.height / img.height;
        const ratio = Math.min(hRatio, vRatio);
        const w = img.width * ratio;
        const h = img.height * ratio;
        ctx.drawImage(img, 0, 0, img.width, img.height, (rect.width - w)/2, (rect.height - h)/2, w, h);
        sigDataUrl = signaturePad.toDataURL('image/png');
        const sigImg = document.getElementById('sigPreview');
        if(sigImg){ sigImg.src = sigDataUrl; sigImg.style.display = 'block'; }
        // also copy name/date/role into preview (if any)
        const nameVal = sigNameInput ? sigNameInput.value.trim() : '';
        const dateVal = sigDateInput ? sigDateInput.value : '';
        const sigNamePreview = document.getElementById('sigNamePreview');
        const sigDatePreview = document.getElementById('sigDatePreview');
        const sigRolePreview = document.getElementById('sigRolePreview');
        const sigInfo = document.getElementById('sigInfo');
        if(sigNamePreview) sigNamePreview.textContent = nameVal || '';
        if(sigRolePreview) sigRolePreview.textContent = sigRoleInput && sigRoleInput.value ? sigRoleInput.value : '';
        if(sigDatePreview) sigDatePreview.textContent = dateVal ? (new Date(dateVal)).toLocaleDateString() : '';
        if(sigInfo) sigInfo.style.display = (nameVal || dateVal || (sigRoleInput && sigRoleInput.value)) ? 'block' : (sigImg && sigImg.src ? 'block' : 'none');
      };
      img.src = evt.target.result;
    };
    reader.readAsDataURL(file);
  });
}

// when generating preview, show signature if available
function attachSignatureToPreview(){
  const sigImg = document.getElementById('sigPreview');
  if(!sigImg) return;
  if(sigDataUrl){ sigImg.src = sigDataUrl; sigImg.style.display = 'block'; }
  else { sigImg.style.display = 'none'; }
  // also attach name/date if inputs exist
  const sigNamePreview = document.getElementById('sigNamePreview');
  const sigDatePreview = document.getElementById('sigDatePreview');
  const sigRolePreview = document.getElementById('sigRolePreview');
  const sigInfo = document.getElementById('sigInfo');
  const nameVal = sigNameInput ? sigNameInput.value.trim() : '';
  const dateVal = sigDateInput ? sigDateInput.value : '';
  const roleVal = sigRoleInput ? sigRoleInput.value.trim() : '';
  if(sigNamePreview) sigNamePreview.textContent = nameVal || '';
  if(sigDatePreview) sigDatePreview.textContent = dateVal ? (new Date(dateVal)).toLocaleDateString() : '';
  if(sigRolePreview) sigRolePreview.textContent = roleVal || '';
  if(sigInfo) sigInfo.style.display = (sigImg && sigImg.src) || roleVal || nameVal || dateVal ? 'block' : 'none';
}

// hook into previewBtn to also attach signature
previewBtn.addEventListener('click', ()=>{
  attachSignatureToPreview();
});

// include signature handling on reset
resetBtn.addEventListener('click', ()=>{
  const sigImg = document.getElementById('sigPreview');
  if(sigImg) sigImg.src = '';
  sigDataUrl = null;
  if(signaturePad){
    const ctx = signaturePad.getContext('2d');
    ctx.clearRect(0,0,signaturePad.width, signaturePad.height);
  }
  // clear name/date inputs and preview
  if(sigNameInput) sigNameInput.value = '';
  if(sigDateInput) sigDateInput.value = '';
  if(sigRoleInput) sigRoleInput.value = '';
  const sigInfo = document.getElementById('sigInfo');
  if(sigInfo) sigInfo.style.display = 'none';
});

