let selectedOrnament = "⭐";
let decorationCount = 0;
const container = document.getElementById("tree-container");
const counter = document.getElementById("counter");
const music = document.getElementById("bg-music");

// Süs seçimi
function selectOrnament(type) { selectedOrnament = type; }

// Sayaç güncelle
function updateCounter() { counter.textContent = "🎁 Eklenen süs: " + decorationCount; }

// Süs ekleme
container.addEventListener("click", e => {
    if(e.target!==container) return;

    const ornament = document.createElement("div");
    ornament.className = "ornament";
    ornament.textContent = selectedOrnament;

    const rect = container.getBoundingClientRect();
    ornament.style.left = (e.clientX - rect.left - 15) + "px";
    ornament.style.top = (e.clientY - rect.top - 15) + "px";

    makeDraggable(ornament);

    ornament.ondblclick = () => {
        ornament.remove();
        decorationCount--;
        updateCounter();
        saveTree();
    };

    ornament.classList.add("sparkle");
    setTimeout(()=>ornament.classList.remove("sparkle"),500);

    container.appendChild(ornament);
    decorationCount++;
    updateCounter();
    saveTree();
});

// Sürükleme
function makeDraggable(el){
    let offsetX=0, offsetY=0, dragging=false;

    el.addEventListener("mousedown", e=>{ dragging=true; offsetX=e.offsetX; offsetY=e.offsetY; el.style.cursor="grabbing"; });
    document.addEventListener("mousemove", e=>{ if(!dragging) return; const rect=container.getBoundingClientRect(); el.style.left=(e.clientX-rect.left-offsetX)+"px"; el.style.top=(e.clientY-rect.top-offsetY)+"px"; });
    document.addEventListener("mouseup", ()=>{ dragging=false; el.style.cursor="grab"; });

    el.addEventListener("touchstart", e=>{ const t=e.touches[0]; const rect=el.getBoundingClientRect(); offsetX=t.clientX-rect.left; offsetY=t.clientY-rect.top; dragging=true; e.preventDefault(); }, {passive:false});
    el.addEventListener("touchmove", e=>{ if(!dragging)return; const t=e.touches[0]; const rect=container.getBoundingClientRect(); el.style.left=(t.clientX-rect.left-offsetX)+"px"; el.style.top=(t.clientY-rect.top-offsetY)+"px"; e.preventDefault(); }, {passive:false});
    el.addEventListener("touchend", ()=>{ dragging=false; });
}

// Kaydet / yükle
function saveTree(){
    const ornaments=[];
    container.querySelectorAll(".ornament").forEach(o=>ornaments.push({emoji:o.textContent,left:o.style.left,top:o.style.top}));
    localStorage.setItem("treeDecorations", JSON.stringify(ornaments));
}

function loadTree(){
    const saved = localStorage.getItem("treeDecorations");
    if(!saved) return;
    const ornaments = JSON.parse(saved);
    ornaments.forEach(d=>{
        const o=document.createElement("div");
        o.className="ornament"; o.textContent=d.emoji; o.style.left=d.left; o.style.top=d.top;
        makeDraggable(o);
        o.ondblclick=()=>{ o.remove(); decorationCount--; updateCounter(); saveTree(); };
        container.appendChild(o);
    });
    decorationCount=ornaments.length; updateCounter();
}
window.onload=loadTree;

// Sıfırlama
function clearDecorations(){ container.querySelectorAll(".ornament").forEach(o=>o.remove()); decorationCount=0; updateCounter(); saveTree(); }

// Kar yağışı
function createSnowflake(){
    const snow=document.getElementById("snow");
    const f=document.createElement("div");
    f.className="snowflake"; f.textContent="❄️";
    f.style.left=Math.random()*window.innerWidth+"px";
    f.style.fontSize=(10+Math.random()*15)+"px";
    snow.appendChild(f);
    let y=0;
    const id=setInterval(()=>{ y+=2; f.style.top=y+"px"; if(y>window.innerHeight){ f.remove(); clearInterval(id); } }, 30);
}
setInterval(createSnowflake, 200);

// Müzik aç/kapat
let musicPlaying=false;
function toggleMusic(){ if(!music)return; if(musicPlaying) music.pause(); else music.play(); musicPlaying=!musicPlaying; }

// PNG kaydet
function downloadTree(){
    html2canvas(container).then(canvas=>{
        const link=document.createElement("a");
        link.download="yilbasi_agacim.png";
        link.href=canvas.toDataURL("image/png");
        link.click();
    });
}
