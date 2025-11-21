const nama = document.getElementById('nama');
const kelas = document.getElementById('kelas');
const jenis = document.getElementById('jenis');
const tanggal = document.getElementById('tanggal');
const catatan = document.getElementById('catatan');

const prevTanggal = document.getElementById('previewTanggal');
const prevIsi = document.getElementById('previewIsi');

const previewBtn = document.getElementById('previewBtn');
const resetBtn = document.getElementById('resetBtn');
const downloadBtn = document.getElementById('downloadBtn');
const darkToggle = document.getElementById('darkToggle');

// Batasi tanggal maksimal = hari ini
const today = new Date().toISOString().split("T")[0];
tanggal.max = today;
tanggal.value = today;

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

  prevTanggal.innerHTML = `Kediri, ${t}`;
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
};

downloadBtn.onclick = () => {
  const element = document.getElementById('surat');
  const sigImg = document.getElementById('sigPreview');
  const opt = {
    margin: 10,
    filename: 'surat-izin.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  const generatePdf = () => html2pdf().set(opt).from(element).save();

  // If a signature image is present and visible, wait for it to load to ensure it's included
  if(sigImg && sigImg.src && sigImg.style.display !== 'none'){
    if(!sigImg.complete){
      sigImg.addEventListener('load', generatePdf, { once: true });
      sigImg.addEventListener('error', generatePdf, { once: true });
    } else {
      generatePdf();
    }
  } else {
    generatePdf();
  }
};
 
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
    const sigInfo = document.getElementById('sigInfo');
    if(sigNamePreview) sigNamePreview.textContent = nameVal || '';
    if(sigDatePreview) sigDatePreview.textContent = dateVal ? (new Date(dateVal)).toLocaleDateString() : '';
    if(sigInfo) sigInfo.style.display = (nameVal || dateVal) ? 'block' : (sigImg && sigImg.src ? 'block' : 'none');
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
        // also copy name/date into preview (if any)
        const nameVal = sigNameInput ? sigNameInput.value.trim() : '';
        const dateVal = sigDateInput ? sigDateInput.value : '';
        const sigNamePreview = document.getElementById('sigNamePreview');
        const sigDatePreview = document.getElementById('sigDatePreview');
        const sigInfo = document.getElementById('sigInfo');
        if(sigNamePreview) sigNamePreview.textContent = nameVal || '';
        if(sigDatePreview) sigDatePreview.textContent = dateVal ? (new Date(dateVal)).toLocaleDateString() : '';
        if(sigInfo) sigInfo.style.display = (nameVal || dateVal) ? 'block' : (sigImg && sigImg.src ? 'block' : 'none');
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
  const sigInfo = document.getElementById('sigInfo');
  const nameVal = sigNameInput ? sigNameInput.value.trim() : '';
  const dateVal = sigDateInput ? sigDateInput.value : '';
  if(sigNamePreview) sigNamePreview.textContent = nameVal || '';
  if(sigDatePreview) sigDatePreview.textContent = dateVal ? (new Date(dateVal)).toLocaleDateString() : '';
  if(sigInfo) sigInfo.style.display = (sigImg && sigImg.src) ? 'block' : 'none';
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
  const sigInfo = document.getElementById('sigInfo');
  if(sigInfo) sigInfo.style.display = 'none';
});


