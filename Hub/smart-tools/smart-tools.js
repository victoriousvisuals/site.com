/* ==========================================================
   VICTORIOUS VISUALS SMARTTOOLS
   Defensive boot: a missing header/footer element, plugin error,
   or individual tool error must never disable the entire tool hub.
   ========================================================== */
(() => {
  'use strict';

  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));

  function safe(fn, fallback = null) {
    try { return fn(); } catch (err) {
      console.error('[SmartTools]', err);
      return fallback;
    }
  }

  function bootSmartTools() {
    const modal = $('#modal');
    const mc = $('#modalContent');
    const closeButton = $('.close');
    const backdrop = $('.backdrop');
    const year = $('#year');

    // Optional elements: never assume they exist.
    if (year) year.textContent = new Date().getFullYear();

    function closeModal() {
      if (!modal) return;
      modal.classList.remove('open');
      document.body.style.overflow = '';
      if (mc) mc.innerHTML = '';
    }

    function openModal(html) {
      if (!modal || !mc) {
        console.error('[SmartTools] Modal markup is missing.');
        return false;
      }
      mc.innerHTML = html || '<div class=\"tool-ui\"><h2>Tool unavailable</h2><p>This tool could not be loaded.</p></div>';
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
      return true;
    }

    function copyText(t, b) {
      const text = String(t ?? '');
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).catch(() => {});
      }
      if (b) {
        const old = b.textContent;
        b.textContent = '✓ Copied!';
        b.classList.add('success');
        setTimeout(() => { b.textContent = old; b.classList.remove('success'); }, 1200);
      }
    }

    // Modal controls are optional and independently protected.
    if (closeButton) closeButton.addEventListener('click', closeModal);
    if (backdrop) backdrop.addEventListener('click', closeModal);
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') safe(closeModal);
    });

    // Visual ripple handler is isolated from all SmartTool logic.
    document.addEventListener('click', e => {
      safe(() => {
        const target = e.target;
        const b = target && target.closest ? target.closest('button') : null;
        if (!b) return;
        b.classList.add('ripple');
        const r = b.getBoundingClientRect();
        b.style.setProperty('--rx', (e.clientX - r.left) + 'px');
        b.style.setProperty('--ry', (e.clientY - r.top) + 'px');
        setTimeout(() => b.classList.remove('ripple'), 500);
      });
    });


const fonts=['Inter','Poppins','Montserrat','DM Sans','Manrope','Lato','Open Sans','Nunito Sans','Raleway','Roboto','Source Sans 3','Oswald','Playfair Display','Merriweather','Libre Baskerville','Source Serif 4','Roboto Slab'];
const T={
password:`<div class="tool-ui"><h2>Password Generator</h2><p>Create a strong password instantly in your browser.</p><div class="field"><label>Length: <output id="pl">18</output></label><input id="pLen" type="range" min="6" max="64" value="18"></div><div class="two"><label><input id="pU" type="checkbox" checked> Uppercase</label><label><input id="pL" type="checkbox" checked> Lowercase</label><label><input id="pN" type="checkbox" checked> Numbers</label><label><input id="pS" type="checkbox" checked> Symbols</label></div><br><button class="btn" id="makeP">Generate Password</button><div class="output" id="pOut"></div><button class="btn light" id="cpP">Copy Password</button></div>`,
username:`<div class="tool-ui"><h2>Username Generator</h2><p>Generate varied, non-repeating handles from larger word pools.</p><div class="field"><label>Keyword</label><input id="uKey" placeholder="e.g. victorious"></div><button class="btn" id="makeU">Generate Ideas</button><div class="result-list" id="uOut"></div></div>`,
youtube:`<div class="tool-ui"><h2>YouTube Channel Name Generator</h2><p>Fresh channel-name structures on every generation.</p><div class="field"><label>Topic / niche</label><input id="yKey" placeholder="e.g. graphic design"></div><button class="btn" id="makeY">Generate Names</button><div class="result-list" id="yOut"></div></div>`,
business:`<div class="tool-ui"><h2>Business Name Generator</h2><p>Natural brand-name patterns with duplicate avoidance.</p><div class="field"><label>Industry / keyword</label><input id="bKey" placeholder="e.g. bakery"></div><button class="btn" id="makeB">Generate Names</button><div class="result-list" id="bOut"></div></div>`,
palette:`<div class="tool-ui"><h2>Color Palette Generator</h2><p>Randomized five-color palettes with copyable HEX values.</p><button class="btn" id="makePal">Generate New Palette</button><div id="palPrev" class="palette-preview"></div><div id="palOut" class="result-list"></div></div>`,
picker:`<div class="tool-ui"><h2>HEX Color Picker</h2><p>Pick a color and see HEX, RGB and HSL values.</p><div class="color-row"><input id="pick" type="color" value="#009eaa"><div><b id="hex"></b><br><span id="rgb"></span><br><span id="hsl"></span></div></div></div>`,
gradient:`<div class="tool-ui"><h2>Gradient Generator</h2><p>Photoshop-inspired multi-stop gradients with live CSS output.</p><div class="gradient-work"><div class="panel"><h3>Gradient Controls</h3><div class="control"><label>Type</label><select id="gType"><option>linear</option><option>radial</option><option>conic</option></select></div><div class="control" id="angleWrap"><label>Angle <output id="gdegOut">135°</output></label><input id="gdeg" type="range" min="0" max="360" value="135"></div><div class="stops" id="gStops"></div><div class="toolbar"><button id="addStop">+ Add stop</button><button id="randomGrad">Randomize</button></div><div class="gradient-track" id="gTrack"></div><div class="css-output" id="gcss"></div><button class="btn" id="copyG">Copy CSS</button></div><div><div class="gradient-canvas" id="gprev"></div><h3 style="margin:15px 0 7px">Professional Presets</h3><div class="toolbar" id="gradPresets"></div></div></div></div>`,
filters:`<div class="tool-ui"><h2>Image Filters</h2><p>Upload an image, choose a professional look, fine-tune it and download the processed image.</p><div class="workspace"><div class="panel"><h3>Filter Library</h3><div class="dropzone"><b>Choose an image</b><input id="fFile" type="file" accept="image/*"></div><div class="filter-grid" id="filterGrid"></div><h3 style="margin-top:18px">Custom Adjustments</h3><div class="adjust-grid"><div class="control"><label>Brightness <output id="fbO">0</output></label><input id="fb" type="range" min="-100" max="100" value="0"></div><div class="control"><label>Contrast <output id="fcO">0</output></label><input id="fc" type="range" min="-100" max="100" value="0"></div><div class="control"><label>Saturation <output id="fsO">0</output></label><input id="fs" type="range" min="-100" max="100" value="0"></div><div class="control"><label>Blur <output id="fblO">0</output></label><input id="fbl" type="range" min="0" max="12" step=".5" value="0"></div><div class="control"><label>Sepia <output id="fspO">0</output></label><input id="fsp" type="range" min="0" max="100" value="0"></div><div class="control"><label>Hue <output id="fhO">0°</output></label><input id="fh" type="range" min="-180" max="180" value="0"></div></div><button class="btn" id="resetFilter">Reset Adjustments</button></div><div><div class="preview-board"><canvas id="fCanvas"></canvas></div><div class="toolbar"><button class="btn" id="downloadFilter">⬇ Download PNG</button></div><div class="output" id="fInfo">Choose an image to begin.</div></div></div></div>`,
compressor:`<div class="tool-ui"><h2>Image Compressor</h2><p>Reduce JPG file size directly in your browser.</p><div class="dropzone"><b>Select an image</b><input id="cFile" type="file" accept="image/*"></div><div class="field"><label>Quality: <output id="qo">75%</output></label><input id="qual" type="range" min="10" max="100" value="75"></div><button class="btn" id="doC">Compress & Download</button><div id="cInfo" class="output"></div></div>`,
qr:`<div class="tool-ui"><h2>QR Code Generator</h2><p>Generate a clean QR image—not a screenshot of this interface.</p><div class="qr-work"><div class="panel"><div class="control"><label>Text / URL</label><textarea id="qrText" rows="4" placeholder="https://victoriousvisuals.site"></textarea></div><div class="control"><label>Size <output id="qrSizeO">320px</output></label><input id="qrSize" type="range" min="160" max="1000" value="320"></div><div class="control"><label>Foreground</label><input id="qrFg" type="color" value="#000000"></div><div class="control"><label>Background</label><input id="qrBg" type="color" value="#ffffff"></div><div class="control"><label>Error correction</label><select id="qrLevel"><option value="L">Low</option><option value="M">Medium</option><option value="Q">Quartile</option><option value="H" selected>High</option></select></div><button class="btn" id="doQR">Generate QR Code</button></div><div><div class="qr-preview" id="qrBox">Your QR code will appear here.</div><div class="toolbar"><button class="btn" id="downloadQR">⬇ Download QR PNG</button></div></div></div></div>`,
fonts:`<div class="tool-ui"><h2>Font Pairing Tool</h2><p>Type your own copy, compare heading/body families and tune typography live.</p><div class="font-layout"><div class="panel"><h3>Typography Controls</h3><div class="control"><label>Preview text</label><textarea id="fontText" class="font-input">Design with purpose. Build a brand people remember.</textarea></div><div class="control"><label>Heading font</label><select id="headFont"></select></div><div class="control"><label>Body font</label><select id="bodyFont"></select></div><div class="control"><label>Heading size <output id="hsO">52px</output></label><input id="hs" type="range" min="20" max="90" value="52"></div><div class="control"><label>Heading weight <output id="hwO">700</output></label><input id="hw" type="range" min="300" max="900" step="100" value="700"></div><div class="control"><label>Letter spacing <output id="lsO">0px</output></label><input id="ls" type="range" min="-3" max="10" step=".1" value="0"></div><div class="control"><label>Line height <output id="lhO">1.6</output></label><input id="lh" type="range" min="1" max="2.2" step=".05" value="1.6"></div><button class="btn" id="randomPair">↻ Random Pairing</button></div><div><div class="font-preview"><div class="fp-heading" id="fpH"></div><div class="fp-body" id="fpB"></div></div><h3 style="margin:15px 0 7px">Visual pairing suggestions</h3><div class="pair-grid" id="pairGrid"></div></div></div></div>`,
sizes:`<div class="tool-ui"><h2>Social Media Size Guide</h2><p>Visual production references with shape previews and one-click copy.</p><div class="social-grid" id="socialGrid"></div></div>`,
cropper:`<div class="tool-ui"><h2>Image Cropper</h2><p>Photoshop-inspired workflow: move or resize the crop box, choose a ratio, rotate, flip and export.</p><div class="dropzone"><b>Choose an image to begin</b><input id="cropFile" type="file" accept="image/*"></div><div class="crop-app"><div class="crop-toolbar"><button id="rotL">↶ Rotate</button><button id="rotR">↷ Rotate</button><button id="flipH">↔ Flip</button><button id="flipV">↕ Flip</button><button id="resetCrop">Reset</button></div><div class="crop-stage" id="stage"><canvas id="cropCanvas"></canvas><div id="cropBox" class="crop-overlay"><i class="handle tl"></i><i class="handle tr"></i><i class="handle bl"></i><i class="handle br"></i></div></div><div class="crop-options"><button data-ratio="free" class="active">Free</button><button data-ratio="1">1:1</button><button data-ratio="1.3333">4:3</button><button data-ratio="1.7778">16:9</button><button data-ratio=".5625">9:16</button><button data-ratio="1.5">3:2</button></div><div class="crop-info"><span id="cropDim">No image</span><span id="cropZoom">Zoom 100%</span></div><div class="crop-bottom"><button class="btn light" id="cropCancel">Cancel</button><button class="btn" id="cropDownload">⬇ Crop & Download</button></div></div></div>`
};

// Delegated tool opening: works even if the header or another page script fails.
// Each click is independently protected, so one broken tool cannot kill the others.
document.addEventListener('click', e => {
  const button = e.target && e.target.closest ? e.target.closest('.card-body button[data-tool]') : null;
  if (!button) return;

  safe(() => {
    const toolId = button.dataset.tool;
    const html = T[toolId];

    if (!html) {
      openModal('<div class=\"tool-ui\"><h2>Tool unavailable</h2><p>This tool is not configured correctly.</p></div>');
      return;
    }

    if (!openModal(html)) return;

    // Run the selected tool in isolation.
    try {
      init(toolId);
    } catch (err) {
      console.error('[SmartTools] Tool initialization failed:', toolId, err);
      if (mc) {
        mc.insertAdjacentHTML('beforeend', '<p style=\"color:#b42318;margin-top:14px\">This tool encountered an error while loading. Please try another tool.</p>');
      }
    }
  });
});
function rand(a,b){return Math.floor(Math.random()*(b-a+1))+a}
function shuffle(a){return a.map(x=>[Math.random(),x]).sort((a,b)=>a[0]-b[0]).map(x=>x[1])}
function genPass(){let s='';if($('#pU').checked)s+='ABCDEFGHIJKLMNOPQRSTUVWXYZ';if($('#pL').checked)s+='abcdefghijklmnopqrstuvwxyz';if($('#pN').checked)s+='0123456789';if($('#pS').checked)s+='!@#$%^&*()-_=+[]{}';if(!s)return;let a=new Uint32Array(+$('#pLen').value);crypto.getRandomValues(a);$('#pOut').textContent=Array.from(a,n=>s[n%s.length]).join('')}
function uniqueNames(key, pool, patterns, n=7){let used=new Set(),out=[],base=key.trim().replace(/\s+/g,'');while(out.length<n){let a=pool[rand(0,pool.length-1)],b=pool[rand(0,pool.length-1)],p=patterns[rand(0,patterns.length-1)],v=p(base,a,b);if(!used.has(v)&&v.length<34){used.add(v);out.push(v)}}return out}
function renderList(id,items,fmt=x=>x){$('#'+id).innerHTML=items.map(x=>`<div class="result-item"><span>${fmt(x)}</span><button class="copy-mini" data-copy="${fmt(x)}">Copy</button></div>`).join('');$$('#'+id+' .copy-mini').forEach(b=>b.onclick=()=>copyText(b.dataset.copy,b))}
function init(t){
if(t==='password'){let l=$('#pLen');l.oninput=()=>$('#pl').textContent=l.value;$('#makeP').onclick=genPass;$('#cpP').onclick=e=>copyText($('#pOut').textContent,e.currentTarget);genPass()}
if(t==='username'){let pool=['studio','forge','spark','pixel','craft','vision','lab','works','creative','collective','hub','house','atelier','media','made','motion','design','digital','works','north','nova','orbit','flow','frame','canvas','co','daily','hq'];let used=[];let go=()=>{let key=$('#uKey').value||'creator';let vals=uniqueNames(key,pool,[(k,a,b)=>k+a,(k,a,b)=>a+k,(k,a,b)=>k+a+b,(k,a,b)=>a+k+b,(k,a,b)=>k+'_'+a,(k,a,b)=>a+'_'+k,(k,a,b)=>k+b+'_'+a],8).map(x=>'@'+x.toLowerCase());used.push(...vals);renderList('uOut',vals)};$('#makeU').onclick=go;go()}
if(t==='youtube'){let pool=['Studio','Stories','Central','Academy','Unlocked','World','Creators','Daily','Lab','Zone','Works','School','Show','Media','Collective','Vision','Channel','Journal','House','Focus','Hub','Talks'];let go=()=>renderList('yOut',uniqueNames($('#yKey').value||'creative',pool,[(k,a,b)=>k+' '+a,(k,a,b)=>a+' '+k,(k,a,b)=>k+' '+a+' '+b,(k,a,b)=>a+k,(k,a,b)=>k+' '+a+' Studio',(k,a,b)=>'The '+k+' '+a],8));$('#makeY').onclick=go;go()}
if(t==='business'){let pool=['Works','Studio','House','Craft','Sphere','Point','Plus','Nova','Prime','Co','Collective','Forge','Lab','Nest','Foundry','Bloom','Rise','Vertex','Horizon','Root','Peak','Canvas','Orbit'];let go=()=>renderList('bOut',uniqueNames($('#bKey').value||'creative',pool,[(k,a,b)=>k+a,(k,a,b)=>a+k,(k,a,b)=>k+' '+a,(k,a,b)=>a+' '+k,(k,a,b)=>k+' '+a+' '+b,(k,a,b)=>'The '+a+' '+k],8));$('#makeB').onclick=go;go()}
if(t==='palette'){$('#makePal').onclick=palette;palette()}
if(t==='picker'){let up=()=>{let c=$('#pick').value.toUpperCase(),r=hexRgb(c),h=rgbHsl(...r);$('#hex').textContent=c;$('#rgb').textContent=`RGB: ${r.join(', ')}`;$('#hsl').textContent=`HSL: ${h[0]}°, ${h[1]}%, ${h[2]}%`};$('#pick').oninput=up;up()}
if(t==='gradient')initGradient()
if(t==='filters')initFilters()
if(t==='compressor')initCompressor()
if(t==='qr')initQR()
if(t==='fonts')initFonts()
if(t==='sizes')initSizes()
if(t==='cropper')initCropper()
}
function palette(){let c=Array.from({length:5},()=>randomHex());$('#palPrev').innerHTML=c.map(x=>`<div class="swatch" style="background:${x}">${x}</div>`).join('');renderList('palOut',c.map(x=>x.toUpperCase()))}
function randomHex(){return '#'+rand(0,16777215).toString(16).padStart(6,'0')}
function hexRgb(h){return[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)]}
function rgbHsl(r,g,b){r/=255;g/=255;b/=255;let mx=Math.max(r,g,b),mn=Math.min(r,g,b),d=mx-mn,l=(mx+mn)/2,s=0,h=0;if(d){s=d/(1-Math.abs(2*l-1));if(mx===r)h=60*((g-b)/d%6);else if(mx===g)h=60*((b-r)/d+2);else h=60*((r-g)/d+4);if(h<0)h+=360}return[Math.round(h),Math.round(s*100),Math.round(l*100)]}
function fileToImg(f){return new Promise((res,rej)=>{let i=new Image;i.onload=()=>res(i);i.onerror=rej;i.src=URL.createObjectURL(f)})}
function saveCanvas(c,n,type='image/png',q=.92){c.toBlob(b=>{let a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=n;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)},type,q)}
function initCompressor(){let f=$('#cFile'),file=null;$('#qual').oninput=()=>$('#qo').textContent=$('#qual').value+'%';f.onchange=()=>file=f.files[0];$('#doC').onclick=async()=>{if(!file)return alert('Choose an image first.');let b=await fileToImg(file),c=document.createElement('canvas');c.width=b.width;c.height=b.height;c.getContext('2d').drawImage(b,0,0);c.toBlob(x=>{$('#cInfo').textContent=`Original: ${(file.size/1024).toFixed(1)} KB → Compressed: ${(x.size/1024).toFixed(1)} KB`;let a=document.createElement('a');a.href=URL.createObjectURL(x);a.download='compressed-image.jpg';a.click()},'image/jpeg',+$('#qual').value/100)}}
const filterPresets={Original:{},Grayscale:{saturate:0,contrast:5},Vintage:{sepia:25,saturate:-20,contrast:-5,brightness:4},Sepia:{sepia:85,saturate:-10},Warm:{hue:0,saturate:12,brightness:5},Cool:{hue:8,saturate:3,brightness:0},Bright:{brightness:25,contrast:4},'High Contrast':{contrast:38,saturate:8},Fade:{contrast:-18,brightness:10,saturate:-8},Dramatic:{contrast:48,saturate:15,brightness:-4},Noir:{saturate:-100,contrast:35,brightness:-3},Blur:{blur:4},Sharpen:{contrast:18,saturate:8},Saturation:{saturate:55}};
function initFilters(){
  let img=null;
  let objectUrl=null;
  const names=Object.keys(filterPresets);
  const vals={brightness:0,contrast:0,saturate:0,blur:0,sepia:0,hue:0};
  let chosen='Original';

  $('#filterGrid').innerHTML=names.map(n=>`
    <button class="filter-btn ${n==='Original'?'active':''}" data-f="${n}" type="button" aria-label="Apply ${n} filter">
      <span class="filter-preview" aria-hidden="true"><b>${n}</b></span>
      <strong>${n}</strong>
    </button>`).join('');

  function cssFor(p){
    return `brightness(${100+(p.brightness||0)}%) contrast(${100+(p.contrast||0)}%) saturate(${100+(p.saturate||0)}%) sepia(${p.sepia||0}%) hue-rotate(${p.hue||0}deg) blur(${p.blur||0}px)`;
  }

  function resetAdjustments(){
    Object.keys(vals).forEach(k=>vals[k]=0);
    const ids={brightness:'b',contrast:'c',saturate:'s',blur:'bl',sepia:'sp',hue:'h'};
    Object.entries(ids).forEach(([key,id])=>{
      const el=$('#f'+id);
      if(el) el.value=0;
    });
    updateLabels();
  }

  // Put a preset's exact values into Custom Adjustments. This makes every
  // preset a real starting point that the user can immediately fine-tune.
  function applyPreset(name){
    const preset=filterPresets[name]||{};
    const keys=['brightness','contrast','saturate','blur','sepia','hue'];
    keys.forEach(k=>{
      vals[k]=Number(preset[k]||0);
    });
    const ids={brightness:'b',contrast:'c',saturate:'s',blur:'bl',sepia:'sp',hue:'h'};
    Object.entries(ids).forEach(([key,id])=>{
      const el=$('#f'+id);
      if(el) el.value=vals[key];
    });
    chosen=name;
    updateLabels();
  }

  function drawImageWithFilter(canvas, filter, maxW, maxH){
    if(!img)return;
    const scale=Math.min(maxW/img.width,maxH/img.height,1);
    canvas.width=Math.max(1,Math.round(img.width*scale));
    canvas.height=Math.max(1,Math.round(img.height*scale));
    const ctx=canvas.getContext('2d',{willReadFrequently:false});
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.filter=filter;
    ctx.drawImage(img,0,0,canvas.width,canvas.height);
    ctx.filter='none';
  }

  function renderFilterThumbs(){
    const buttons=$$('.filter-btn');
    buttons.forEach(btn=>{
      const holder=btn.querySelector('.filter-preview');
      if(!holder)return;
      if(!img){
        holder.innerHTML='<b>'+btn.dataset.f+'</b>';
        return;
      }
      const canvas=document.createElement('canvas');
      canvas.className='filter-thumb';
      canvas.width=180;
      canvas.height=108;
      const p=filterPresets[btn.dataset.f]||{};
      drawImageWithFilter(canvas,cssFor(p),180,108);
      holder.replaceChildren(canvas);
    });
  }

  function render(){
    if(!img)return;
    const p={...filterPresets[chosen],...vals};
    drawImageWithFilter($('#fCanvas'),cssFor(p),760,500);
    $('#fInfo').textContent=`${img.width} × ${img.height}px • ${chosen}`;
    renderFilterThumbs();
  }

  $('#fFile').onchange=async()=>{
    const file=$('#fFile').files && $('#fFile').files[0];
    if(!file)return;
    try{
      if(objectUrl)URL.revokeObjectURL(objectUrl);
      objectUrl=URL.createObjectURL(file);
      img=await fileToImg(file);
      chosen='Original';
      resetAdjustments();
      $$('.filter-btn').forEach(x=>x.classList.toggle('active',x.dataset.f==='Original'));
      render();
    }catch(err){
      console.error('[SmartTools] Filter image load failed:',err);
      $('#fInfo').textContent='Unable to load this image. Please choose another image.';
    }
  };

  $$('.filter-btn').forEach(b=>b.onclick=()=>{
    if(!img){
      $('#fInfo').textContent='Choose an image first, then select a filter.';
      $('#fFile').focus();
      return;
    }
    $$('.filter-btn').forEach(x=>x.classList.remove('active'));
    b.classList.add('active');
    // Load the selected preset into the Custom Adjustments controls.
    // render() then applies those exact values to the main uploaded image.
    applyPreset(b.dataset.f);
    render();
  });

  ['b','c','s','bl','sp','h'].forEach(id=>{
    const el=$('#f'+id);
    if(!el)return;
    el.oninput=()=>{
      const map={b:'brightness',c:'contrast',s:'saturate',bl:'blur',sp:'sepia',h:'hue'};
      vals[map[id]]=+el.value;
      updateLabels();
      render();
    };
  });

  function updateLabels(){
    [['b',''],['c',''],['s',''],['bl',''],['sp',''],['h','°']].forEach(([x,u])=>{
      const output=$('#f'+x+'O'), input=$('#f'+x);
      if(output&&input)output.textContent=input.value+u;
    });
  }

  $('#resetFilter').onclick=()=>{
    applyPreset('Original');
    $$('.filter-btn').forEach(x=>x.classList.toggle('active',x.dataset.f==='Original'));
    render();
  };

  $('#downloadFilter').onclick=()=>{
    if(!img)return alert('Choose an image first.');
    const c=$('#fCanvas');
    saveCanvas(c,'filtered-image.png');
    const b=$('#downloadFilter');
    b.textContent='✓ Downloaded';
    setTimeout(()=>b.textContent='⬇ Download PNG',1200);
  };

  renderFilterThumbs();
}

function initGradient(){let stops=[{c:'#009eaa',p:0},{c:'#7f00ff',p:100}], presets=[['Ocean',['#009eaa','#1261a0']],['Sunset',['#ff9966','#ff5e62']],['Aurora',['#00c6ff','#0072ff','#7f00ff']],['Berry',['#a18cd1','#fbc2eb']],['Forest',['#134e5e','#71b280']]];let render=()=>{stops.sort((a,b)=>a.p-b.p);let type=$('#gType').value,angle=$('#gdeg').value;let parts=stops.map(s=>`${s.c} ${s.p}%`).join(', '),css=type==='linear'?`linear-gradient(${angle}deg, ${parts})`:type==='radial'?`radial-gradient(circle, ${parts})`:`conic-gradient(from ${angle}deg, ${parts})`;$('#gprev').style.background=css;$('#gcss').textContent=`background: ${css};`;$('#gdegOut').textContent=angle+'°';$('#gTrack').style.background=css;$('#gStops').innerHTML=stops.map((s,i)=>`<div class="stop-row"><input class="stop-color" type="color" data-i="${i}" value="${s.c}"><input class="stop-pos" type="number" min="0" max="100" data-i="${i}" value="${s.p}"><button class="toolbar-btn" data-del="${i}" ${stops.length<=2?'disabled':''}>×</button></div>`).join('');stops.forEach((s,i)=>{let h=document.createElement('div');h.className='gradient-handle';h.style.left=s.p+'%';h.dataset.i=i;$('#gTrack').appendChild(h)});$$('.stop-color').forEach(x=>x.oninput=e=>{stops[+e.target.dataset.i].c=e.target.value;render()});$$('.stop-pos').forEach(x=>x.oninput=e=>{stops[+e.target.dataset.i].p=Math.max(0,Math.min(100,+e.target.value));render()});$$('[data-del]').forEach(x=>x.onclick=()=>{stops.splice(+x.dataset.del,1);render()});$$('.gradient-handle').forEach(h=>h.onpointerdown=e=>{let i=+h.dataset.i;const move=ev=>{let r=$('#gTrack').getBoundingClientRect();stops[i].p=Math.max(0,Math.min(100,Math.round((ev.clientX-r.left)/r.width*100)));render()};document.addEventListener('pointermove',move);document.addEventListener('pointerup',()=>document.removeEventListener('pointermove',move),{once:true})})};$('#addStop').onclick=()=>{stops.push({c:randomHex(),p:Math.round(Math.random()*80+10)});render()};$('#randomGrad').onclick=()=>{stops=Array.from({length:rand(2,5)},(_,i)=>({c:randomHex(),p:Math.round(i*100/(rand(2,5)-1))}));stops.sort((a,b)=>a.p-b.p);render()};$('#gType').onchange=render;$('#gdeg').oninput=render;$('#copyG').onclick=e=>copyText($('#gcss').textContent,e.currentTarget);$('#gradPresets').innerHTML=presets.map((p,i)=>`<button data-pre="${i}">${p[0]}</button>`).join('');$$('[data-pre]').forEach(b=>b.onclick=()=>{stops=presets[+b.dataset.pre][1].map((c,i,a)=>({c,p:Math.round(i*100/(a.length-1))}));render()});render()}
function initQR(){let loaded=false;const load=()=>new Promise(res=>{if(window.QRCode)return res();let s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';s.onload=res;s.onerror=()=>alert('QR library could not load. Check your internet connection.');document.head.appendChild(s)});let generate=async()=>{await load();let box=$('#qrBox');box.innerHTML='';let size=+$('#qrSize').value;let level={L:QRCode.CorrectLevel.L,M:QRCode.CorrectLevel.M,Q:QRCode.CorrectLevel.Q,H:QRCode.CorrectLevel.H}[$('#qrLevel').value];new QRCode(box,{text:$('#qrText').value.trim()||'Victorious Visuals',width:size,height:size,colorDark:$('#qrFg').value,colorLight:$('#qrBg').value,correctLevel:level});$('#qrBox').dataset.ready='1'};$('#doQR').onclick=generate;$('#qrText').oninput=()=>{clearTimeout(window.qrt);window.qrt=setTimeout(generate,250)};['qrSize','qrFg','qrBg','qrLevel'].forEach(id=>$('#'+id).oninput=()=>{if(id==='qrSize')$('#qrSizeO').textContent=$('#qrSize').value+'px';generate()});$('#downloadQR').onclick=()=>{let canvas=$('#qrBox canvas');if(!canvas){return alert('Generate a QR code first.')}saveCanvas(canvas,'victorious-visuals-qr.png');let b=$('#downloadQR');b.textContent='✓ Downloaded';setTimeout(()=>b.textContent='⬇ Download QR PNG',1200)};$('#qrSize').oninput()}
function initFonts(){let fill=(id)=>{$('#'+id).innerHTML=fonts.map(f=>`<option value="${f}">${f}</option>`).join('')};fill('headFont');fill('bodyFont');$('#headFont').value='Playfair Display';$('#bodyFont').value='Poppins';let update=()=>{let h=$('#headFont').value,b=$('#bodyFont').value,txt=$('#fontText').value||'Type your preview text here';$('#fpH').textContent=txt;$('#fpB').textContent=txt;$('#fpH').style.fontFamily=`"${h}"`;$('#fpB').style.fontFamily=`"${b}"`;$('#fpH').style.fontSize=$('#hs').value+'px';$('#fpH').style.fontWeight=$('#hw').value;$('#fpH').style.letterSpacing=$('#ls').value+'px';$('#fpH').style.lineHeight=$('#lh').value;[['hs','hsO','px'],['hw','hwO',''],['ls','lsO','px'],['lh','lhO','']].forEach(([a,o,u])=>$('#'+o).textContent=$('#'+a).value+u);};['fontText','headFont','bodyFont','hs','hw','ls','lh'].forEach(id=>$('#'+id).addEventListener(id==='fontText'?'input':'input',update));$('#randomPair').onclick=()=>{let h=fonts[rand(0,fonts.length-1)],b=fonts[rand(0,fonts.length-1)];while(b===h)b=fonts[rand(0,fonts.length-1)];$('#headFont').value=h;$('#bodyFont').value=b;update()};let pairs=[['Playfair Display','Poppins'],['Montserrat','Libre Baskerville'],['Oswald','DM Sans'],['Merriweather','Lato'],['Raleway','Roboto Slab'],['Manrope','Source Serif 4'],['Poppins','Lato'],['Libre Baskerville','Montserrat']];$('#pairGrid').innerHTML=pairs.map((p,i)=>`<div class="pair-card" data-pair="${i}"><div class="pair-head" style="font-family:'${p[0]}'">${p[0]}</div><div class="pair-body" style="font-family:'${p[1]}'">${p[1]} — balanced heading + body pairing</div></div>`).join('');$$('.pair-card').forEach(c=>c.onclick=()=>{let p=pairs[+c.dataset.pair];$('#headFont').value=p[0];$('#bodyFont').value=p[1];update()});update()}
function initSizes(){let data=[['Instagram Post',1080,1080,'1:1'],['Instagram Portrait',1080,1350,'4:5'],['Instagram Story / Reel',1080,1920,'9:16'],['Facebook Post',1200,630,'1.91:1'],['YouTube Thumbnail',1280,720,'16:9'],['TikTok Video',1080,1920,'9:16'],['LinkedIn Post',1200,627,'1.91:1'],['Facebook Story',1080,1920,'9:16']];$('#socialGrid').innerHTML=data.map((x,i)=>{let ratio=x[1]/x[2],w=ratio>=1?82:Math.max(42,82*ratio),h=ratio>=1?Math.max(42,82/ratio):82;return `<div class="social-card"><div class="social-thumb-wrap"><div class="social-thumb" style="width:${w}px;height:${h}px">${x[3]}</div></div><div class="social-meta"><h4>${x[0]}</h4><p>${x[1]} × ${x[2]} px • ${x[3]}</p><button data-copy-size="${x[1]} × ${x[2]} px">Copy Size</button></div></div>`}).join('');$$('[data-copy-size]').forEach(b=>b.onclick=()=>copyText(b.dataset.copySize,b))}
function initCropper(){let f=$('#cropFile'),img=null,angle=0,fx=1,fy=1,ratio=null,scale=1,crop={x:0,y:0,w:0,h:0},drag=null,stage=$('#stage'),canvas=$('#cropCanvas'),box=$('#cropBox'),ctx=canvas.getContext('2d');function fit(){if(!img)return;let mw=stage.clientWidth-30,mh=stage.clientHeight-30;scale=Math.min(mw/img.width,mh/img.height,1);canvas.width=img.width*scale;canvas.height=img.height*scale;draw();def()}function draw(){ctx.clearRect(0,0,canvas.width,canvas.height);ctx.save();ctx.translate(canvas.width/2,canvas.height/2);ctx.scale(fx,fy);ctx.rotate(angle*Math.PI/180);ctx.drawImage(img,-canvas.width/2,-canvas.height/2,canvas.width,canvas.height);ctx.restore()}function def(){let w=canvas.width*.75,h=canvas.height*.75;if(ratio){if(w/h>ratio)w=h*ratio;else h=w/ratio}crop={x:(canvas.width-w)/2,y:(canvas.height-h)/2,w,h};show()}function show(){box.style.display='block';box.style.left=canvas.offsetLeft+crop.x+'px';box.style.top=canvas.offsetTop+crop.y+'px';box.style.width=crop.w+'px';box.style.height=crop.h+'px';$('#cropDim').textContent=`Crop ${Math.round(crop.w/scale)} × ${Math.round(crop.h/scale)}px`;$('#cropZoom').textContent=`Zoom ${Math.round(scale*100)}%`}function clamp(){crop.x=Math.max(0,Math.min(crop.x,canvas.width-crop.w));crop.y=Math.max(0,Math.min(crop.y,canvas.height-crop.h));crop.w=Math.max(30,Math.min(crop.w,canvas.width-crop.x));crop.h=Math.max(30,Math.min(crop.h,canvas.height-crop.y))}box.onpointerdown=e=>{if(e.target.classList.contains('handle'))return;drag={type:'move',sx:e.clientX,sy:e.clientY,ox:crop.x,oy:crop.y};box.setPointerCapture(e.pointerId)};$$('.handle').forEach(h=>h.onpointerdown=e=>{e.stopPropagation();let t=[...h.classList].find(x=>['tl','tr','bl','br'].includes(x));drag={type:t,sx:e.clientX,sy:e.clientY,ox:crop.x,oy:crop.y,ow:crop.w,oh:crop.h};box.setPointerCapture(e.pointerId)});box.onpointermove=e=>{if(!drag)return;let dx=e.clientX-drag.sx,dy=e.clientY-drag.sy;if(drag.type==='move'){crop.x=drag.ox+dx;crop.y=drag.oy+dy}else{let t=drag.type,nw=drag.ow,nh=drag.oh,nx=drag.ox,ny=drag.oy;if(t.includes('r'))nw=drag.ow+dx;if(t.includes('l')){nw=drag.ow-dx;nx=drag.ox+dx}if(t.includes('b'))nh=drag.oh+dy;if(t.includes('t')){nh=drag.oh-dy;ny=drag.oy+dy}if(ratio){if(nw/nh>ratio)nh=nw/ratio;else nw=nh*ratio;if(t.includes('l'))nx=drag.ox+drag.ow-nw;if(t.includes('t'))ny=drag.oy+drag.oh-nh}crop={x:nx,y:ny,w:nw,h:nh}}clamp();show()};box.onpointerup=()=>drag=null;f.onchange=async()=>{img=await fileToImg(f.files[0]);angle=0;fx=fy=1;fit()};addEventListener('resize',()=>img&&fit());$('#rotL').onclick=()=>{if(!img)return;angle-=90;draw();show()};$('#rotR').onclick=()=>{if(!img)return;angle+=90;draw();show()};$('#flipH').onclick=()=>{if(!img)return;fx*=-1;draw()};$('#flipV').onclick=()=>{if(!img)return;fy*=-1;draw()};$('#resetCrop').onclick=()=>{angle=0;fx=fy=1;draw();def()};$$('.crop-options button').forEach(b=>b.onclick=()=>{$$('.crop-options button').forEach(x=>x.classList.remove('active'));b.classList.add('active');ratio=b.dataset.ratio==='free'?null:+b.dataset.ratio;img&&def()});$('#cropCancel').onclick=closeModal;$('#cropDownload').onclick=()=>{if(!img)return alert('Choose an image first.');let out=document.createElement('canvas'),sx=crop.x/scale,sy=crop.y/scale,sw=crop.w/scale,sh=crop.h/scale;out.width=Math.max(1,Math.round(sw));out.height=Math.max(1,Math.round(sh));let o=out.getContext('2d');o.drawImage(img,sx,sy,sw,sh,0,0,out.width,out.height);saveCanvas(out,'cropped-image.png')}}
let active='all';function apply(){let q=$('#search').value.toLowerCase().trim(),n=0;$$('.tool-card').forEach(c=>{let ok=(active==='all'||c.dataset.cat===active)&&(!q||c.dataset.key.includes(q)||c.innerText.toLowerCase().includes(q));c.style.display=ok?'block':'none';if(ok)n++});$('#count').textContent=`${n} tool${n===1?'':'s'}`;$('#none').hidden=n!==0}$$('.filter').forEach(b=>b.onclick=()=>{$$('.filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');active=b.dataset.filter;apply()});$('#search').oninput=apply;


  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootSmartTools, { once: true });
  } else {
    bootSmartTools();
  }
})();
