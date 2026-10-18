(()=>{
// pinned sections sit just under the sticky header; publish its real height (it wraps on phones)
const h=document.querySelector(".site-head");if(!h)return;
const set=()=>document.documentElement.style.setProperty("--head-h",h.offsetHeight+"px");
"ResizeObserver"in window?new ResizeObserver(set).observe(h):addEventListener("resize",set);set()})();
(()=>{const i=document.querySelector("[data-hero-canvas]"),t=i?.getContext("2d");if(!i||!t)return;const l=matchMedia("(prefers-reduced-motion: reduce)").matches,r=(1+Math.sqrt(5))/2,s=1/r,d=[[1,1,1],[1,1,-1],[1,-1,1],[1,-1,-1],[-1,1,1],[-1,1,-1],[-1,-1,1],[-1,-1,-1],[0,s,r],[0,s,-r],[0,-s,r],[0,-s,-r],[s,r,0],[s,-r,0],[-s,r,0],[-s,-r,0],[r,0,s],[r,0,-s],[-r,0,s],[-r,0,-s]],g=2*s,o=[];for(let e=0;e<d.length;e++)for(let p=e+1;p<d.length;p++){const M=Math.hypot(d[e][0]-d[p][0],d[e][1]-d[p][1],d[e][2]-d[p][2]);Math.abs(M-g)<.05&&o.push([e,p])}let a=-.42,n=.62,v=-.42,c=.62;l||addEventListener("pointermove",e=>{c=.62+(e.clientX/innerWidth-.5)*1.6,v=-.42+(e.clientY/innerHeight-.5)*1.1},{passive:!0});let h=0,f=0,u=1;const I=()=>{h=i.clientWidth,f=i.clientHeight,u=Math.min(2,window.devicePixelRatio||1),i.width=Math.max(1,Math.round(h*u)),i.height=Math.max(1,Math.round(f*u))};"ResizeObserver"in window?new ResizeObserver(I).observe(i):addEventListener("resize",I),I();const L=e=>{const p=Math.cos(n),M=Math.sin(n),E=e[0]*p+e[2]*M,y=-e[0]*M+e[2]*p,S=Math.cos(a),w=Math.sin(a);return[E,e[1]*S-y*w,e[1]*w+y*S]},b=performance.now(),m=e=>{const p=(e-b)/1e3;l||(a+=(v-a)*.05,n+=(c+p*.22-n)*.05),t.setTransform(u,0,0,u,0,0),t.clearRect(0,0,h,f);const M=h/2,E=f/2,y=Math.min(h,f)*.25,S=d.map(L);let w=1/0,z=-1/0;for(const x of S)x[2]<w&&(w=x[2]),x[2]>z&&(z=x[2]);const k=z-w||1;t.strokeStyle="rgba(14,27,48,0.16)",t.lineWidth=1,t.setLineDash([4,7]),t.beginPath(),t.arc(M,E,y*1.6,0,Math.PI*2),t.stroke(),t.setLineDash([]);for(const[x,q]of o){const O=S[x],P=S[q],A=((O[2]+P[2])/2-w)/k;t.strokeStyle=`rgba(43,92,255,${(.12+A*.82).toFixed(3)})`,t.lineWidth=.7+A*1.7,t.beginPath(),t.moveTo(M+O[0]*y,E-O[1]*y),t.lineTo(M+P[0]*y,E-P[1]*y),t.stroke()}for(const x of S){const q=(x[2]-w)/k;t.fillStyle=q>.5?"rgba(14,27,48,0.9)":"rgba(14,27,48,0.3)",t.beginPath(),t.arc(M+x[0]*y,E-x[1]*y,1.1+q*2.3,0,Math.PI*2),t.fill()}l||requestAnimationFrame(m)};requestAnimationFrame(m)})();(()=>{const i=document.querySelector("[data-playground]");if(!i||matchMedia("(prefers-reduced-motion: reduce)").matches)return;const t=(i.dataset.playground||"").split("|").filter(Boolean);if(t.length<2)return;const l=o=>{const a=/\/([^/]+)\/p(\d+)(?:_\d+)?\.webp/.exec(o)??[];return(a[1]??"playground").replace(/_/g," ")+" · p"+(a[2]??"")},r=new Map,s=o=>{if(r.has(o))return;const a=new Image;a.src=o,r.set(o,a)};if("IntersectionObserver"in window){const o=new IntersectionObserver(a=>{a.some(n=>n.isIntersecting)&&(t.forEach(s),o.disconnect())},{rootMargin:"600px 0px"});o.observe(i)}else t.forEach(s);const d=[...i.querySelectorAll(".mosaic__item")],g=new Set;d.forEach((o,a)=>{const n=o.querySelector("img"),v=o.querySelector(".mosaic__cap");if(!n)return;let c=n.getAttribute("src")||t[0];g.add(c);const h=()=>{n.naturalWidth&&n.naturalHeight&&(n.style.aspectRatio=`${n.naturalWidth} / ${n.naturalHeight}`)};n.complete&&n.naturalWidth?h():n.addEventListener("load",h,{once:!0});let f=0;const u=()=>{let b=t.filter(e=>e!==c&&!g.has(e));b.length||(b=t.filter(e=>e!==c));const m=b[Math.floor(Math.random()*b.length)];!m||m===c||(g.delete(c),g.add(m),c=m,o.classList.remove("is-flick"),o.offsetWidth,n.addEventListener("load",h,{once:!0}),n.src=m,n.alt=l(m),v&&(v.textContent=l(m)),o.classList.add("is-flick"))},I=()=>{f||(f=window.setInterval(u,2200+a%5*420))},L=()=>{clearInterval(f),f=0};"IntersectionObserver"in window?new IntersectionObserver(b=>b.forEach(m=>m.isIntersecting?I():L()),{rootMargin:"0px 0px -10% 0px"}).observe(o):I()})})();(()=>{
// Pinned intro stage, driven by scroll distance (in viewport heights):
//   0 – 2.0   hero copy → decahedron flies → net designer unfolds (scene 1 → 2), scrubbed by scroll
//   2.2       trigger: the screen dithers into ink + 0/1s, swaps, dithers back out (scene 2 → 3).
//             This plays on a timer (DUR ms) rather than following the scroll, so it always
//             finishes on a clean frame; scrolling back above the trigger plays it in reverse.
//   2.2 – 2.9 hold on the 1 bit camera, then the page scrolls on
const stage=document.querySelector("[data-intro-stage]"),copy=stage?.querySelector("[data-intro-copy]"),demo=stage?.querySelector("[data-intro-demo]"),frame=stage?.querySelector("[data-intro-frame]");
if(!stage||!copy||!demo)return;
const SRC="/decahedron-net-designer.html",reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
const box=stage.querySelector(".introswap"),orb=stage.querySelector("[data-orb]"),slot=stage.querySelector("[data-orb-slot]"),target=stage.querySelector("[data-orb-target]"),unfold=stage.querySelector("[data-intro-unfold]"),title=stage.querySelector("[data-scramble]"),label=stage.querySelector("[data-orb-label]");
const cam=stage.querySelector("[data-intro-cam]"),camFrame=cam?.querySelector("iframe"),camTitle=cam?.querySelector("[data-bit-scramble]"),dither=stage.querySelector("[data-intro-dither]");
const clamp=v=>Math.min(1,Math.max(0,v)),ease=v=>v<.5?4*v*v*v:1-Math.pow(-2*v+2,3)/2,lerp=(a,b,t)=>a+(b-a)*t;
const rel=el=>{const r=el.getBoundingClientRect(),b=box.getBoundingClientRect();return{x:r.left-b.left+r.width/2,y:r.top-b.top+r.height/2,w:r.width,h:r.height}};
// the orb flies only when it is displayed (desktop); otherwise fall back to a plain fade
const flying=()=>orb&&target&&slot&&orb.offsetWidth>0&&slot.offsetWidth>0;
const placeOrb=(x,y,s)=>{const w=orb.offsetWidth;orb.style.transform=`translate(${(x-w/2).toFixed(1)}px,${(y-w/2).toFixed(1)}px) scale(${s.toFixed(4)})`;orb.style.visibility="visible"};
// headings decode as q goes 0 → 1, from random letters or from 0s and 1s
const decoder=(el,glyphs)=>{const text=el?.textContent||"";let lastN=-1;return q=>{if(!el)return;const n=Math.round(q*text.length);if(n===lastN&&(q>=1||q<=0))return;lastN=n;
el.textContent=[...text].map((c,i)=>i<n||c===" "?c:glyphs[Math.random()*glyphs.length|0]).join("")}};
const scramble=decoder(title,"ABCDEFGHJKLMNPQRSTUVWXYZ"),bits=decoder(camTitle,"01");
// tell the camera sim when its scene is hidden so it can release the camera
let camShown=null;
const showCam=on=>{if(!cam||on===camShown)return;camShown=on;cam.style.visibility=on?"visible":"hidden";cam.setAttribute("aria-hidden",String(!on));
try{camFrame?.contentWindow?.postMessage({type:"1bit-visibility",visible:on},location.origin)}catch{}};
camFrame?.addEventListener("load",()=>{const v=camShown;camShown=null;showCam(!!v)});
let loaded=!1,queued=!1,shift=0;
const load=()=>{!loaded&&frame&&(loaded=!0,frame.setAttribute("src",SRC))};
if(reduce){load();demo.style.opacity="1";demo.style.pointerEvents="auto";label&&(label.style.opacity="1");showCam(!0);
const still=()=>{if(!flying())return;const a=rel(slot);placeOrb(a.x,a.y,a.w/orb.offsetWidth)};
addEventListener("resize",still,{passive:!0});still();return}

// ── full-screen dither: Bayer 8×8 thresholds, biased so it starts in the centre ──
const B=[0,48,12,60,3,51,15,63,32,16,44,28,35,19,47,31,8,56,4,52,11,59,7,55,40,24,36,20,43,27,39,23,2,50,14,62,1,49,13,61,34,18,46,30,33,17,45,29,10,58,6,54,9,57,5,53,42,26,38,22,41,25,37,21].map(v=>(v+.5)/64);
const css=getComputedStyle(document.documentElement),INK=css.getPropertyValue("--ink").trim()||"#0e1b30",ACC=css.getPropertyValue("--acc").trim()||"#2b5cff";
const CELL=16,BAND=.2,dctx=dither?.getContext("2d");
let dw=0,dh=0,dpr=1,cols=0,rows=0,thr=null,sprites=null,flick=0;
const mix=(i,k)=>{let h=Math.imul(i^Math.imul(k,0x85ebca6b),0x9e3779b1);h^=h>>>15;h=Math.imul(h,0x2c1b3c6d);h^=h>>>12;return h>>>0};
const sprite=(ch,fg,bg)=>{const c=document.createElement("canvas");c.width=c.height=Math.round(CELL*dpr);const x=c.getContext("2d");x.scale(dpr,dpr);
if(bg){x.fillStyle=bg;x.fillRect(0,0,CELL,CELL)}x.fillStyle=fg;x.font=`700 ${Math.round(CELL*.82)}px "Space Mono", ui-monospace, monospace`;x.textAlign="center";x.textBaseline="middle";x.fillText(ch,CELL/2,CELL/2+1);return c};
const sizeDither=()=>{if(!dither)return;dw=dither.clientWidth;dh=dither.clientHeight;dpr=Math.min(2,devicePixelRatio||1);dither.width=Math.round(dw*dpr);dither.height=Math.round(dh*dpr);
cols=Math.ceil(dw/CELL);rows=Math.ceil(dh/CELL);thr=new Float32Array(cols*rows);
for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){const r=Math.hypot((x+.5)/cols-.5,((y+.5)/rows-.5)*dh/dw)/.72;thr[y*cols+x]=B[(y&7)*8+(x&7)]*.68+Math.min(1,r)*.32}
// "0"/"1" in ink for the dissolving edge, and faint accent ones inside the solid ink
sprites=[sprite("0",INK),sprite("1",INK),sprite("0",ACC+"88",INK),sprite("1",ACC+"88",INK)]};
// c = coverage 0 → 1+BAND; cells below c-BAND are solid ink, cells in the band show 0/1
const drawDither=c=>{if(!dctx)return;dctx.setTransform(1,0,0,1,0,0);dctx.clearRect(0,0,dither.width,dither.height);
if(c<=0){dither.hidden=!0;return}dither.hidden=!1;
const S=CELL*dpr,inkR=[];flick=performance.now()/90|0;
dctx.fillStyle=INK;dctx.beginPath();
for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){const i=y*cols+x,t=thr[i];
if(t<c-BAND){const h=mix(i,flick);if((h&15)<3)inkR.push(i,h);else dctx.rect(x*S,y*S,S,S)}
else if(t<c){const h=mix(i,flick+7919);dctx.drawImage(sprites[h&1],x*S,y*S)}}
dctx.fill();
for(let k=0;k<inkR.length;k+=2){const i=inkR[k];dctx.drawImage(sprites[2+(inkR[k+1]>>4&1)],(i%cols)*S,(i/cols|0)*S)}};
"ResizeObserver"in window&&dither?new ResizeObserver(()=>{sizeDither();req()}).observe(dither):addEventListener("resize",sizeDither);
sizeDither();document.fonts?.ready.then(()=>{sizeDither();req()});

const DUR=700,TRIG_IN=2.25,TRIG_OUT=2.15;   // swap duration (ms); trigger points with a little hysteresis
let raf=0,phase=0,goal=0,animT=0;            // phase 0 = designer, 1 = camera
const step=now=>{const dt=Math.min(64,now-(animT||now));animT=now;
phase=goal>phase?Math.min(goal,phase+dt/DUR):Math.max(goal,phase-dt/DUR);render();
raf=phase!==goal?requestAnimationFrame(step):(animT=0,0)};
const render=()=>{queued=!1;
const s=Math.max(0,-stage.getBoundingClientRect().top),vh=innerHeight;
const p=clamp(s/(2*vh));     // scene 1→2 progress
if(s>TRIG_IN*vh)goal=1;else if(s<TRIG_OUT*vh)goal=0;
if(phase!==goal&&!raf){animT=0;raf=requestAnimationFrame(step)}
const swapped=phase>=.5;
// scene 1: intro copy slides up and away
const f=clamp(p/.28);shift=-f*80;copy.style.opacity=String(1-f);copy.style.transform=`translateY(${shift.toFixed(1)}px)`;
// scene 2: heading + chrome fade in, heading decodes; hidden once the dither has swapped
const u=swapped?0:clamp((p-.3)/.15);demo.style.opacity=String(u);demo.style.visibility=swapped?"hidden":"";scramble(clamp((p-.32)/.3));
p>.08&&load();
if(!flying()){demo.style.transform=swapped?"":`translateY(${((1-u)*60).toFixed(1)}px)`;unfold&&(unfold.style.clipPath="");demo.style.pointerEvents=!swapped&&u>.6?"auto":"none"}
else{demo.style.transform="";
// the decahedron: slot → centre of the designer (grows) → docks big beside it, then its tag appears
const w=orb.offsetWidth,a=rel(slot),c=rel(unfold||demo),t=rel(target);a.y-=shift;
const s0=a.w/w,s1=Math.min(1.15,Math.min(c.w,c.h)*.95/w),s2=t.w/w;
const t1=ease(clamp((p-.04)/.34)),t2=ease(clamp((p-.5)/.25));
placeOrb(lerp(lerp(a.x,c.x,t1),t.x,t2),lerp(lerp(a.y,c.y,t1),t.y,t2),lerp(lerp(s0,s1,t1),s2,t2));
orb.style.opacity=swapped?"0":"1";label&&(label.style.opacity=t2>.92?"1":"0");
// the designer unfolds out of the decahedron's centre
if(unfold){const k=ease(clamp((p-.42)/.22));unfold.style.clipPath=k>=1?"none":`circle(${(k*75).toFixed(2)}% at 50% 50%)`}
demo.style.pointerEvents=!swapped&&p>.64?"auto":"none"}
// scene 2 → 3, in place: dither in to solid ink + 0/1s, swap underneath, dither back out
const cover=phase<=0||phase>=1?0:(swapped?1-ease((phase-.5)/.5):ease(phase/.5))*(1+BAND);
drawDither(cover);
if(cam){showCam(swapped);cam.style.opacity=swapped?"1":"0";cam.style.pointerEvents=phase>=1?"auto":"none";bits(swapped?clamp((phase-.62)/.38):0)}
};
const req=()=>{queued||(queued=!0,requestAnimationFrame(render))};
addEventListener("scroll",req,{passive:!0});addEventListener("resize",req,{passive:!0});render()})();
(()=>{
// Manifesto → selected work, pinned. Scroll distance (viewport heights) inside the section:
//   0 – 1.0   the manifesto fills with colour (scrubbed)
//   1.1       trigger: "MAKE IT ·" glides up into the heading, the rest + banner leave,
//             the first group of projects arrives (timed, so it never rests half-way)
//   1.1 + k·SPAN  group k: the verb scrambles to MAKE / HOLD / SHOW / TEACH and its cards
//             swap in; while a group is active its cards pan sideways if they overflow
const sec=document.querySelector("[data-words]");if(!sec)return;
if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;
const fill=sec.querySelector("[data-words-fill]"),first=sec.querySelector("[data-words-first]"),head=sec.querySelector("[data-words-head]"),verbEl=sec.querySelector("[data-words-verb]");
const decks=[...sec.querySelectorAll("[data-words-deck]")],steps=[...sec.querySelectorAll("[data-words-go]")];
const VERBS=decks.map(d=>d.dataset.verb.toUpperCase());
const FILL_END=1.0,TRIG=1.1,SPAN=.9,HYS=.04,clamp=v=>Math.min(1,Math.max(0,v));
let work=!1,group=-1,queued=!1,morph=0;
const startOf=k=>TRIG+k*SPAN;

// "MAKE IT ·" in the manifesto ⇄ the heading: FLIP between the two boxes
const flip=toHead=>{
  head.style.transition="none";head.style.transform="none";
  const a=first.getBoundingClientRect(),b=head.getBoundingClientRect(),sx=a.width/b.width;
  const fromHead=`translate(${a.left-b.left}px,${a.top-b.top}px) scale(${sx})`;
  head.style.transition="none";head.style.visibility="visible";first.style.visibility="hidden";
  head.style.transform=toHead?fromHead:"none";head.getBoundingClientRect();
  head.style.transition="transform .7s cubic-bezier(.7,0,.2,1)";head.style.transform=toHead?"none":fromHead;
  clearTimeout(head._t);if(!toHead)head._t=setTimeout(()=>{if(!work){head.style.visibility="hidden";first.style.visibility="visible"}},720)};

// verb scramble (timed), e.g. MAKE → HOLD
const GL="ABCDEFGHJKLMNOPQRSTUVWXYZ";
const setVerb=word=>{cancelAnimationFrame(morph);const t0=performance.now(),D=420;
  const tick=now=>{const q=clamp((now-t0)/D),n=Math.round(q*word.length);
    verbEl.textContent=[...word].map((c,i)=>i<n?c:GL[Math.random()*GL.length|0]).join("");
    if(q<1)morph=requestAnimationFrame(tick)};morph=requestAnimationFrame(tick)};

const show=k=>{decks.forEach((d,i)=>{d.dataset.state=i===k?"on":i<k?"before":"after";d.inert=i!==k;d.setAttribute("aria-hidden",String(i!==k))});
  steps.forEach((b,i)=>b.setAttribute("aria-current",String(i===k)));
  head.setAttribute("aria-label",VERBS[k]+" it")};
show(0);verbEl.textContent=VERBS[0];

const render=()=>{queued=!1;
  const vh=innerHeight,s=-sec.getBoundingClientRect().top/vh;
  fill.style.setProperty("--fill",(clamp(s/FILL_END)*100).toFixed(1));
  // enter / leave the work view
  const wantWork=work?s>TRIG-HYS:s>TRIG+HYS;
  if(wantWork!==work){work=wantWork;sec.classList.toggle("is-work",work);flip(work);if(!work){group=0;show(0);verbEl.textContent=VERBS[0]}}
  if(!work)return;
  // which group, with a little hysteresis at each boundary
  let k=Math.max(0,Math.min(decks.length-1,Math.floor((s-TRIG)/SPAN)));
  if(group>=0&&k!==group){const edge=startOf(Math.max(k,group));if(Math.abs(s-edge)<HYS)k=group}
  if(k!==group){const prev=group;group=k;show(k);if(prev>=0||k>0)setVerb(VERBS[k])}
  // carousel: pan the active track across its overflow during the group's span
  const tr=decks[group].querySelector("[data-words-track]"),over=Math.max(0,tr.scrollWidth-tr.parentElement.parentElement.clientWidth);
  const g=clamp(((s-startOf(group))/SPAN-.12)/.7);
  tr.style.setProperty("--pan",(-over*g).toFixed(1)+"px")};
const req=()=>{queued||(queued=!0,requestAnimationFrame(render))};
steps.forEach((b,i)=>b.addEventListener("click",()=>{const top=sec.getBoundingClientRect().top+scrollY;scrollTo({top:top+(startOf(i)+.08)*innerHeight,behavior:"smooth"})}));
addEventListener("scroll",req,{passive:!0});addEventListener("resize",req,{passive:!0});render()})();
(()=>{
// Toolkit honeycomb, Apple-Watch style, full screen. The section pins while you scroll through it.
// The 22 real tools form a cluster in the middle, sized so all of them are always visible; the hex
// lattice carries on to every edge with blank "ghost" bubbles (coloured like their nearest tool)
// that fade and shrink toward the screen edge. The whole field glides with the scroll, drifts and
// bobs; the tool under the pointer (or keyboard focus / tap) swells and shows its name while a
// fisheye spreads everything around it. A colour legend spotlights one category.
const sec=document.querySelector("[data-toolkit]"),hive=sec?.querySelector("[data-hive]");if(!hive)return;
const real=[...hive.querySelectorAll(".tk-bub")],legend=[...sec.querySelectorAll("[data-tk-cat]")],N=real.length;
const headBox=sec.querySelector(".toolkit__head");
const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
const FOCUS=1.75,NEAR=.12,PUSH=.84;           // focused scale, neighbour growth, fisheye spread (× tile size)
const GLIDE=.34,DRIFT_X=.2,DRIFT_Y=.1,BOB=3;  // scroll glide & idle drift (× tile size), bob (px)
const GHOST_ALPHA=.6;                          // ghost opacity right next to the cluster
const LIFT=.42;                                // scroll progress at which the bubbles float away like balloons
const FADE_IN=.72;                             // …and at which the next section starts fading in, in place
const seed=i=>{const x=Math.sin(i*127.1+311.7)*43758.5453;return x-Math.floor(x)};
let size=92,pts=[],els=[],cur=[],ptr=null,raf=0,visible=!1;

const layout=()=>{
  const W=hive.clientWidth,H=hive.clientHeight;if(!W||!H)return;
  // real cluster: the honeycomb (rows of c, c-1, …) with the biggest tiles inside a central box,
  // leaving a margin all round for the ghosts to show
  const BW=Math.min(W*.8,headBox.clientWidth||W),aw=BW*.96,ah=H*(reduce?.94:.74),cap=W<640?104:150;
  let best=null;
  for(let R=2;R<=10;R++){
    const c=Math.ceil((N+Math.floor(R/2))/R),counts=[];let left=N;
    for(let r=0;r<R&&left>0;r++){const n=Math.min(left,r%2?c-1:c);counts.push(n);left-=n}
    if(left>0||counts.length<R)continue;
    const s=Math.min(cap,aw/((c-1)*1.14+1.25),ah/((R-1)*1.14*.866+1.25));
    if(!best||s>best.s)best={s,counts,c}}
  size=best.s;const dx=size*1.14,dy=dx*.866,R=best.counts.length,gh=(R-1)*dy;
  const full=r=>(((r%2)+2)%2)?best.c-1:best.c;                 // slots in lattice row r
  const X=(r,k)=>W/2+(k-(full(r)-1)/2)*dx,Y=r=>H/2-gh/2+r*dy;
  pts=[];const taken=new Set();let i=0;
  best.counts.forEach((n,r)=>{const st=Math.floor((full(r)-n)/2);for(let j=0;j<n;j++,i++){taken.add(r+","+(st+j));pts.push({x:X(r,st+j),y:Y(r),real:!0})}});
  // cluster bounds → how far each ghost sits between the cluster and the screen edge
  const xs=pts.map(p=>p.x),ys=pts.map(p=>p.y),x0=Math.min(...xs),x1=Math.max(...xs),y0=Math.min(...ys),y1=Math.max(...ys);
  const gapX=Math.max(dx,Math.min(x0,W-x1)+dx*.4),gapY=Math.max(dy,Math.min(y0,H-y1)+dy*.4);
  const cx=(x0+x1)/2,cy=(y0+y1)/2,maxD=Math.max(...pts.map(p=>Math.hypot((p.x-cx)/1.5,p.y-cy)))||1;
  pts.forEach(p=>p.rest=1-.12*Math.max(0,(Math.hypot((p.x-cx)/1.5,p.y-cy)/maxD-.5)/.5));
  // ghosts on every free lattice slot that can be seen (plus one ring beyond the edges)
  hive.querySelectorAll(".tk-ghost").forEach(g=>g.remove());
  const ghosts=[],rMin=-Math.ceil(Y(0)/dy)-1,rMax=R-1+Math.ceil((H-Y(R-1))/dy)+1;
  for(let r=rMin;r<=rMax;r++){const f=full(r),k0=Math.floor((-dx-W/2)/dx+(f-1)/2),k1=Math.ceil((W+dx-W/2)/dx+(f-1)/2);
    for(let k=k0;k<=k1;k++){if(taken.has(r+","+k))continue;
      const x=X(r,k),y=Y(r),fx=Math.max(0,x0-x,x-x1)/gapX,fy=Math.max(0,y0-y,y-y1)/gapY,fade=Math.min(1,Math.hypot(fx,fy));
      if(fade>=1)continue;
      let near=0,nd=1/0;pts.forEach((p,j)=>{if(!p.real)return;const d=Math.hypot(p.x-x,p.y-y);if(d<nd){nd=d;near=j}});
      const li=document.createElement("li");li.className="tk-bub tk-ghost";li.setAttribute("aria-hidden","true");
      for(const a of real[0].getAttributeNames())if(a.startsWith("data-astro-cid"))li.setAttribute(a,"");
      li.dataset.cat=real[near].dataset.cat;li.style.setProperty("--c",real[near].style.getPropertyValue("--c"));
      li.style.opacity=(GHOST_ALPHA*Math.pow(1-fade,1.4)).toFixed(3);
      const face=document.createElement("span");face.className="tk-face";for(const a of real[0].getAttributeNames())if(a.startsWith("data-astro-cid"))face.setAttribute(a,"");
      li.appendChild(face);ghosts.push(li);pts.push({x,y,real:!1,rest:1-.4*fade})}}
  hive.append(...ghosts);
  els=[...real,...ghosts];
  els.forEach(b=>b.style.setProperty("--s",size+"px"));
  cur=pts.map(p=>({x:p.x,y:p.y,s:p.rest}));
  spot(pinned);
  hive.classList.add("is-hive");draw(performance.now(),!0)};

const targets=lp=>{
  let focus=-1,best=size*.85;
  if(lp)for(let i=0;i<N;i++){const p=pts[i],d=Math.hypot(p.x-lp.x,p.y-lp.y);if(d<best){best=d;focus=i}}
  return pts.map((p,i)=>{
    if(!lp)return{x:p.x,y:p.y,s:p.rest,f:!1};
    if(i===focus)return{x:p.x,y:p.y,s:FOCUS,f:!0};
    const vx=p.x-lp.x,vy=p.y-lp.y,d=Math.hypot(vx,vy)||1,r=d/size;
    // fisheye: radial offset grows monotonically with distance, so spacing never shrinks
    const push=PUSH*size*(1-Math.exp(-((r/1.2)**2))),grow=NEAR*Math.exp(-((r/1.6)**2));
    return{x:p.x+vx/d*push,y:p.y+vy/d*push,s:p.rest*(1+grow),f:!1}})};

// scroll progress through the pinned section (0 → 1); raw = px scrolled since the pin engaged
const pin=sec.querySelector(".toolkit__pin");
let next=sec.nextElementSibling;
const pinState=()=>{const top=parseFloat(getComputedStyle(pin).top)||0,S=sec.offsetHeight-pin.offsetHeight,raw=top-sec.getBoundingClientRect().top;return{S,raw,prog:S>0?Math.min(1,Math.max(0,raw/S)):.5}};
const progress=()=>pinState().prog;
// the next section is pulled up under the pinned screen (by one screen) so that, as the balloons
// leave, it can fade in exactly where it will sit; when the pin releases it simply scrolls on
const syncNext=()=>{if(!next||reduce)return;next.classList.add("tk-next");next.style.marginTop=-pin.offsetHeight+"px"};
const handOff=()=>{if(!next||reduce)return;const {S,raw,prog}=pinState();
  if(raw>=S){next.style.transform="";next.style.opacity="";next.style.pointerEvents="";headBox.style.opacity="";return}
  const q=Math.min(1,Math.max(0,(prog-FADE_IN)/(.97-FADE_IN)));
  next.style.transform=raw>0?`translateY(${(raw-S).toFixed(1)}px)`:"";   // hold it still under the pin
  next.style.opacity=String(q);next.style.pointerEvents=q<1?"none":"";
  headBox.style.opacity=String(1-Math.min(1,Math.max(0,(prog-LIFT)/.3)))};
// whole-field offset: glide with scroll progress (before the balloons let go) + slow idle drift
const field=(now,prog)=>{
  if(reduce)return{x:0,y:0};
  const t=now/1000,g=Math.min(1,prog/LIFT);
  return{x:Math.sin(t*2*Math.PI/16)*DRIFT_X*size,y:(.5-g)*2*GLIDE*size+Math.sin(t*2*Math.PI/19+1)*DRIFT_Y*size}};

const draw=(now,snap)=>{
  const prog=reduce?0:progress(),F=field(now,prog),hr=hive.getBoundingClientRect(),lifting=prog>LIFT;
  // pointer in field coordinates (client pointers move with the page; tapped/focused ones stick to a tile)
  const lp=ptr&&!lifting?(ptr.tile!=null?pts[ptr.tile]:{x:ptr.cx-hr.left-F.x,y:ptr.cy-hr.top-F.y}):null;
  const T=targets(lp),t=now/1000;
  T.forEach((g,i)=>{const c=cur[i],k=snap||reduce?1:.16;
    c.x+=(g.x-c.x)*k;c.y+=(g.y-c.y)*k;c.s+=(g.s-c.s)*k;
    const bx=reduce?0:Math.sin(t*1.1+i*1.7)*BOB,by=reduce?0:Math.cos(t*.9+i*2.3)*BOB;
    let x=c.x+F.x+bx,y=c.y+F.y+by;
    // real tools always stay fully inside the box, whatever the fisheye/drift does
    if(i<N){const half=size*c.s/2+5;x=Math.min(hr.width-half,Math.max(half,x));y=Math.min(hr.height-half,Math.max(half,y))}
    // balloons: past LIFT each bubble lets go at its own moment, rises (accelerating), sways and tilts
    let rot=0;
    if(lifting){const r=seed(i),start=LIFT+(i<N?.08:0)+r*.22,q=Math.max(0,Math.min(1,(prog-start)/(1-start)*1.35));
      if(q>0){const rise=q*q*(hr.height+size*2.4),sway=Math.sin(q*Math.PI*2.2+r*6.3)*size*.32*Math.min(1,q*3);
        y-=rise;x+=sway;rot=Math.sin(q*Math.PI*2.2+r*6.3+.9)*9*Math.min(1,q*3)}}
    els[i].style.transform=`translate(${(x-size/2).toFixed(1)}px,${(y-size/2).toFixed(1)}px) scale(${c.s.toFixed(3)}) rotate(${rot.toFixed(1)}deg)`;
    if(i<N)els[i].classList.toggle("is-focus",g.f)})};
const loop=now=>{raf=0;draw(now);handOff();if(visible&&!reduce)raf=requestAnimationFrame(loop)};
addEventListener("scroll",handOff,{passive:!0});
const kick=()=>{if(reduce)draw(performance.now(),!0);else raf||(raf=requestAnimationFrame(loop))};

hive.addEventListener("pointermove",e=>{if(e.pointerType==="mouse"||e.pointerType==="pen"){ptr={cx:e.clientX,cy:e.clientY};kick()}});
hive.addEventListener("pointerleave",e=>{if(e.pointerType!=="touch"){ptr=null;kick()}});
addEventListener("scroll",()=>{if(ptr&&ptr.tile==null)kick()},{passive:!0});
hive.addEventListener("pointerdown",e=>{if(e.pointerType==="touch"){const b=e.target.closest(".tk-bub:not(.tk-ghost)");ptr=b?{tile:real.indexOf(b)}:null;kick()}});
document.addEventListener("pointerdown",e=>{if(e.pointerType==="touch"&&!hive.contains(e.target)&&ptr){ptr=null;kick()}});
real.forEach((b,i)=>{b.addEventListener("focus",()=>{ptr={tile:i};kick()});b.addEventListener("blur",()=>{ptr=null;kick()})});

// colour guide: hover / focus / tap a category to spotlight it (ghosts follow their colour)
let pinned=null;
function spot(cat){els.forEach(b=>b.classList.toggle("is-dim",!!cat&&b.dataset.cat!==cat))}
legend.forEach(btn=>{const cat=btn.dataset.tkCat;
  btn.addEventListener("mouseenter",()=>spot(cat));btn.addEventListener("mouseleave",()=>spot(pinned));
  btn.addEventListener("focus",()=>spot(cat));btn.addEventListener("blur",()=>spot(pinned));
  btn.addEventListener("click",()=>{pinned=pinned===cat?null:cat;legend.forEach(l=>l.setAttribute("aria-pressed",String(l.dataset.tkCat===pinned)));spot(pinned)})});

// only animate while the section is on screen
if("IntersectionObserver"in window)new IntersectionObserver(es=>{visible=es[0].isIntersecting;if(visible)kick()}).observe(sec);else visible=!0;
"ResizeObserver"in window?new ResizeObserver(()=>{layout();syncNext();handOff()}).observe(hive):addEventListener("resize",()=>{layout();syncNext();handOff()});layout();syncNext();handOff();kick()})();
