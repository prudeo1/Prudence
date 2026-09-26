const projects = [
  ["01","01","WEB3","2026","Business Development · Promotion","assets/videos/first.mp4"],
  ["02","02","MOTION","2026","Motion Designer · Video Editor","assets/videos/2.mp4"],
  ["03","03","VIDEO","2026","Creative Direction · Product Video","assets/videos/3.mp4"],
  ["04","04","WEB3","2026","Promotion · Creative Strategy","assets/videos/4.mp4"],
  ["05","05","MOTION","2026","3D Motion · Brand Animation","assets/videos/5.mp4"], 
  ["06","06","BRAND","2026","Motion Graphics · Visual Storytelling","assets/videos/6.mp4"],
  ["07","07","VIDEO","2026","Video Editor · Social Content","assets/videos/7.mp4"],
  ["08","08","WEB3","2026","Promotion · Content Strategy","assets/videos/8.mp4"],
  ["09","09","MOTION","2026","Motion Graphics · Creative Direction","assets/videos/9.mp4"],
  ["10","10","VIDEO","2026","Product Storytelling · Editing","assets/videos/10.mp4"],
  ["11","11","BRAND","2026","Brand Animation · 3D Motion","assets/videos/11.mp4"],
  ["12","12","WEB3","2026","Campaigns · Community Growth","assets/videos/12.mp4"],
  ["13","13","MOTION","2026","Motion Designer · Visual Effects","assets/videos/13.mp4"],
  ["14","14","WEB3","2026","Launch Campaign · Promotion","assets/videos/14.mp4"],
  ["15","FINAL FRAME","VIDEO","2026","Video Editing · Creative Direction","assets/videos/15.mp4"]
];

const track = document.querySelector("#projectTrack");
const activeNum = document.querySelector("#activeNum");
const totalNum = document.querySelector("#totalNum");
const progressBar = document.querySelector("#progressBar");
totalNum.textContent = String(projects.length).padStart(2,"0");

function renderProjects(filter="ALL"){
  track.innerHTML="";
  const filtered = projects.filter(p=>filter==="ALL" || p[2]===filter || (filter==="MOTION" && p[2]==="BRAND"));
  
  filtered.forEach((p,i)=>{
    const card=document.createElement("article");
    card.className="project";
    card.dataset.category=p[2];
    card.dataset.index=p[0];
    card.innerHTML=`
      <div class="project-visual">
        <!-- FIXED: Removed 'muted' so video sound plays out -->
        <video class="project-video" src="${p[5]}" playsinline preload="metadata" loop></video>
        <div class="video-shade"></div>
        <button class="video-toggle" type="button" aria-label="Play video" title="Play / pause video">▶</button>
      </div>
      <div class="project-top"><span class="project-cat">${p[2]}</span><span class="project-year">${p[3]}</span></div>
      <div class="project-bottom">
        <div><div class="project-title">${p[1]}</div><div class="project-role">${p[4]}</div></div>
        <button class="play project-open" type="button" aria-label="Open project details">↗</button>
      </div>`;

    const video = card.querySelector(".project-video");
    const toggle = card.querySelector(".video-toggle");
    const openButton = card.querySelector(".project-open");

    function updateVideoButton(){
      toggle.textContent = video.paused ? "▶" : "Ⅱ";
      toggle.setAttribute("aria-label", video.paused ? "Play video" : "Pause video");
    }

    // Toggle Play/Pause Function
    function toggleVideoState() {
      if(video.paused) {
        video.play().catch(err => console.log("Audio autoplay restriction: Click card directly to play.", err));
      } else {
        video.pause();
      }
    }

    // Explicit UI Button Click Hooks
    toggle.addEventListener("click", (event)=>{
      event.stopPropagation();
      toggleVideoState();
    });

    video.addEventListener("play", updateVideoButton);
    video.addEventListener("pause", updateVideoButton);
    video.addEventListener("ended", updateVideoButton);

    // 1. HOVER INTERACTIONS (With unmuted audio)
    card.addEventListener("mouseenter", () => {
      video.play().catch(() => {});
    });
    
    card.addEventListener("mouseleave", () => {
      video.pause();
      video.currentTime = 0; // Resets clip to frame 0
    });

    // 2. CLICK TO TOGGLE INTERACTION (Overrides or runs alongside hover)
    card.addEventListener("click",(event)=>{
      // If clicking open details button, route to modal instead
      if(event.target.closest(".project-open")) return;
      
      // If clicking anywhere else on the visual/card, toggle play and audio state
      if(event.target.closest(".project-visual") || event.target.closest(".project-video")) {
        toggleVideoState();
      } else {
        openProject(p);
      }
    });

    openButton.addEventListener("click",(event)=>{
      event.stopPropagation();
      openProject(p);
    });
    
    track.appendChild(card);
  });
  updateSlider();
}
renderProjects();

document.querySelectorAll(".filter").forEach(btn=>{
  btn.addEventListener("click",()=>{
    document.querySelectorAll(".filter").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    renderProjects(btn.dataset.filter);
  });
});

function updateSlider(){
  const cards=[...track.querySelectorAll(".project")];
  if(!cards.length)return;
  const max=Math.max(1,track.scrollWidth-track.clientWidth);
  const ratio=track.scrollLeft/max;
  const idx=Math.min(cards.length-1,Math.round(ratio*(cards.length-1)));
  activeNum.textContent=String(Number(cards[idx]?.dataset.index||1)).padStart(2,"0");
  progressBar.style.width=`${Math.max(6.66,((idx+1)/cards.length)*100)}%`;
}
track.addEventListener("scroll",()=>requestAnimationFrame(updateSlider));
document.querySelector(".next").addEventListener("click",()=>track.scrollBy({left:track.clientWidth*.72,behavior:"smooth"}));
document.querySelector(".prev").addEventListener("click",()=>track.scrollBy({left:-track.clientWidth*.72,behavior:"smooth"}));

// Pointer drag scrolling
let down=false,startX,scrollLeft;
track.addEventListener("pointerdown",e=>{down=true;startX=e.pageX-track.offsetLeft;scrollLeft=track.scrollLeft;track.setPointerCapture(e.pointerId)});
track.addEventListener("pointerup",()=>down=false);
track.addEventListener("pointercancel",()=>down=false);
track.addEventListener("pointermove",e=>{if(!down)return;e.preventDefault();const x=e.pageX-track.offsetLeft;track.scrollLeft=scrollLeft-(x-startX)*1.25});

const modal=document.querySelector("#projectModal");
function openProject(p){
  document.querySelector("#modalTitle").textContent=p[1];
  document.querySelector("#modalCategory").textContent=p[2];
  document.querySelector("#modalYear").textContent=p[3];
  document.querySelector("#modalRole").textContent=p[4];
  document.querySelector("#modalDescription").textContent="Add the real project contribution here — what was created, why it mattered, and where it was deployed.";
  document.querySelector("#modalMedia").innerHTML = `<video src="${p[5]}" controls playsinline autoplay preload="metadata"></video>`;
  modal.classList.add("open");modal.setAttribute("aria-hidden","false");document.body.style.overflow="hidden";
}
function closeProject(){modal.classList.remove("open");modal.setAttribute("aria-hidden","true");document.body.style.overflow=""}
document.querySelector(".modal-close").addEventListener("click",closeProject);
document.querySelector(".modal-backdrop").addEventListener("click",closeProject);

const caseModal=document.querySelector("#caseModal");
document.querySelectorAll("[data-open='case']").forEach(btn=>btn.addEventListener("click",()=>{
  caseModal.classList.add("open");document.body.style.overflow="hidden";
}));
document.querySelector(".case-close").addEventListener("click",()=>{caseModal.classList.remove("open");document.body.style.overflow=""});

document.addEventListener("keydown",e=>{
  if(e.key==="Escape"){closeProject();caseModal.classList.remove("open");document.body.style.overflow=""}
});

const cursor=document.querySelector(".cursor-glow");
if(cursor){
  window.addEventListener("pointermove",e=>{
    cursor.style.left=e.clientX+"px";cursor.style.top=e.clientY+"px";
  });
}

document.querySelectorAll(".magnetic").forEach(el=>{
  el.addEventListener("pointermove",e=>{
    const r=el.getBoundingClientRect();
    const x=(e.clientX-r.left-r.width/2)*.12;
    const y=(e.clientY-r.top-r.height/2)*.12;
    el.style.transform=`translate(${x}px,${y}px)`;
  });
  el.addEventListener("pointerleave",()=>el.style.transform="");
});

const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{if(entry.isIntersecting)entry.target.classList.add("visible")});
},{threshold:.12});
document.querySelectorAll(".reveal").forEach(el=>observer.observe(el));
