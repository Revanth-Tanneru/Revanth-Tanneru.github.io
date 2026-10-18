(()=>{
// pinned sections sit just under the sticky header; publish its real height (it wraps on phones)
const h=document.querySelector(".site-head");if(!h)return;
const set=()=>document.documentElement.style.setProperty("--head-h",h.offsetHeight+"px");
"ResizeObserver"in window?new ResizeObserver(set).observe(h):addEventListener("resize",set);set()})();
(()=>{const i=document.querySelector("[data-hero-canvas]"),t=i?.getContext("2d");if(!i||!t)return;const _cs=getComputedStyle(document.documentElement),_A=_cs.getPropertyValue("--acc-rgb").trim()||"43,92,255",_I=_cs.getPropertyValue("--ink-rgb").trim()||"14,27,48";const l=matchMedia("(prefers-reduced-motion: reduce)").matches,r=(1+Math.sqrt(5))/2,s=1/r,d=[[1,1,1],[1,1,-1],[1,-1,1],[1,-1,-1],[-1,1,1],[-1,1,-1],[-1,-1,1],[-1,-1,-1],[0,s,r],[0,s,-r],[0,-s,r],[0,-s,-r],[s,r,0],[s,-r,0],[-s,r,0],[-s,-r,0],[r,0,s],[r,0,-s],[-r,0,s],[-r,0,-s]],g=2*s,o=[];for(let e=0;e<d.length;e++)for(let p=e+1;p<d.length;p++){const M=Math.hypot(d[e][0]-d[p][0],d[e][1]-d[p][1],d[e][2]-d[p][2]);Math.abs(M-g)<.05&&o.push([e,p])}let a=-.42,n=.62,v=-.42,c=.62;l||addEventListener("pointermove",e=>{c=.62+(e.clientX/innerWidth-.5)*1.6,v=-.42+(e.clientY/innerHeight-.5)*1.1},{passive:!0});let h=0,f=0,u=1;const I=()=>{h=i.clientWidth,f=i.clientHeight,u=Math.min(2,window.devicePixelRatio||1),i.width=Math.max(1,Math.round(h*u)),i.height=Math.max(1,Math.round(f*u))};"ResizeObserver"in window?new ResizeObserver(I).observe(i):addEventListener("resize",I),I();const L=e=>{const p=Math.cos(n),M=Math.sin(n),E=e[0]*p+e[2]*M,y=-e[0]*M+e[2]*p,S=Math.cos(a),w=Math.sin(a);return[E,e[1]*S-y*w,e[1]*w+y*S]},b=performance.now(),m=e=>{const p=(e-b)/1e3;l||(a+=(v-a)*.05,n+=(c+p*.22-n)*.05),t.setTransform(u,0,0,u,0,0),t.clearRect(0,0,h,f);const M=h/2,E=f/2,y=Math.min(h,f)*.25,S=d.map(L);let w=1/0,z=-1/0;for(const x of S)x[2]<w&&(w=x[2]),x[2]>z&&(z=x[2]);const k=z-w||1;t.strokeStyle=`rgba(${_I},0.16)`,t.lineWidth=1,t.setLineDash([4,7]),t.beginPath(),t.arc(M,E,y*1.6,0,Math.PI*2),t.stroke(),t.setLineDash([]);for(const[x,q]of o){const O=S[x],P=S[q],A=((O[2]+P[2])/2-w)/k;t.strokeStyle=`rgba(${_A},${(.12+A*.82).toFixed(3)})`,t.lineWidth=.7+A*1.7,t.beginPath(),t.moveTo(M+O[0]*y,E-O[1]*y),t.lineTo(M+P[0]*y,E-P[1]*y),t.stroke()}for(const x of S){const q=(x[2]-w)/k;t.fillStyle=q>.5?`rgba(${_I},0.9)`:`rgba(${_I},0.3)`,t.beginPath(),t.arc(M+x[0]*y,E-x[1]*y,1.1+q*2.3,0,Math.PI*2),t.fill()}l||requestAnimationFrame(m)};requestAnimationFrame(m)})();(()=>{
// Pinned intro stage, driven by scroll distance (in viewport heights):
//   0 – 2.0   hero copy → decahedron flies → net designer unfolds (scene 1 → 2), scrubbed by scroll
//   2.85      trigger: the screen dithers into ink + 0/1s, swaps, dithers back out (scene 2 → 3).
//             This plays on a timer (DUR ms) rather than following the scroll, so it always
//             finishes on a clean frame; scrolling back above the trigger plays it in reverse.
//   2.85 – 3.5 hold on the 1 bit camera, then the page scrolls on
const stage=document.querySelector("[data-intro-stage]"),copy=stage?.querySelector("[data-intro-copy]"),demo=stage?.querySelector("[data-intro-demo]"),frame=stage?.querySelector("[data-intro-frame]");
if(!stage||!copy||!demo)return;
const SRC="/decahedron-net-designer.html?demo",reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
const box=stage.querySelector(".introswap"),orb=stage.querySelector("[data-orb]"),slot=stage.querySelector("[data-orb-slot]"),target=stage.querySelector("[data-orb-target]"),unfold=stage.querySelector("[data-intro-unfold]"),title=stage.querySelector("[data-scramble]"),label=stage.querySelector("[data-orb-label]");
const lmField=stage.querySelector("[data-lm]");
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
// the designer plays itself as a demo behind a "take control" shield; the shield also keeps the
// mouse wheel scrolling the page (not the designer) until someone chooses to use it
const shield=stage.querySelector("[data-demo-shield]");let demoVis=null,taken=!1;
const tellDemo=msg=>{try{frame?.contentWindow?.postMessage({type:"deca-demo",...msg},location.origin)}catch{}};
const demoVisible=v=>{if(v===demoVis)return;demoVis=v;tellDemo({visible:v});
  if(!v&&shield&&taken){shield.classList.remove("is-off");shield.querySelector(".demo-shield__pill").lastChild.textContent="tap to use the designer"}};
frame?.addEventListener("load",()=>{const v=demoVis;demoVis=null;demoVisible(!!v)});
shield?.addEventListener("click",()=>{taken=!0;shield.classList.add("is-off");tellDemo({stop:!0});frame?.focus()});
if(reduce){load();shield?.remove();demo.style.opacity="1";demo.style.pointerEvents="auto";label&&(label.style.opacity="1");showCam(!0);
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

const DUR=700,TRIG_IN=2.85,TRIG_OUT=2.75;   // swap duration (ms); trigger points with a little hysteresis
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
demoVisible(!swapped&&p>.35);
// scene 1: intro copy slides up and away
const f=clamp(p/.28);shift=-f*80;copy.style.opacity=String(1-f);if(lmField){lmField.style.opacity=String(1-f);lmField.style.visibility=f>=1?"hidden":"";lmField.style.translate=`0 ${(shift*1.4).toFixed(1)}px`}copy.style.transform=`translateY(${shift.toFixed(1)}px)`;
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
  // once the balloons have gone, the (transparent) pinned screen must not swallow clicks meant for the next section
  pin.style.pointerEvents=prog>=.95?"none":"";
  if(raw>=S){next.style.transform="";next.style.opacity="";next.style.pointerEvents="";headBox.style.opacity="0";return}
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
(()=>{
// "From the playground" light table: a hand of polaroid prints dealt from the pool of 30 and
// scattered across a glowing table. Drag a print (it lifts and comes to the front), toss it and it
// slides with momentum, slowing down and bouncing softly off the edges. Click / Enter opens it large.
// "deal again" tosses the hand off the table and deals a fresh one.
const sec=document.querySelector("[data-lighttable]"),table=sec?.querySelector("[data-lt-table]");if(!table)return;
const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches,hint=table.querySelector(".lt__hint");
const NAMES={oldest_portfolio:"early portfolio",portfolio_f:"portfolio",experiments:"experiment"};
const label=src=>{const m=/\/([a-z_]+)\/([a-z]*?)(\d+)(?:_(\d+))?\.\w+$/.exec(src);if(!m)return"playground";
  return(NAMES[m[1]]||m[1].replace(/_/g," "))+" · "+(m[2]==="slide"?"slide ":"")+m[3]+(m[4]?"."+m[4]:"")};
// each entry is "src@WxH@caption"; captions match the Playground page sections (e.g. "Posters & covers · 06")
const POOL=sec.dataset.playground.split("|").map(e=>{const[src,dim,cap]=e.split("@"),[w,h]=(dim||"1x1").split("x").map(Number);return{src,w,h,cap:cap||label(src)}});
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v)),rand=(a,b)=>a+Math.random()*(b-a);
const easeOutBack=t=>{const c=1.4;return 1+(c+1)*Math.pow(t-1,3)+c*Math.pow(t-1,2)};
let cards=[],W=0,H=0,L=200,z=1,raf=0,last=0,dealt=!1,held=null;

const size=()=>{W=table.clientWidth;H=table.clientHeight;L=W<640?clamp(W*.3,92,140):clamp(W*.16,112,215)};   // print size (longest side)
const place=c=>{c.el.style.transform=`translate(${(c.x-c.w/2).toFixed(1)}px,${(c.y-c.h/2).toFixed(1)}px) rotate(${c.r.toFixed(2)}deg)${c===held?.card?" scale(1.04)":""}`};

const makeCard=item=>{
  const s=L/Math.max(item.w,item.h),iw=Math.round(item.w*s),ih=Math.round(item.h*s);
  const el=document.createElement("button");el.type="button";el.className="lt__card";el.setAttribute("aria-label","View "+item.cap);
  const img=document.createElement("img");img.src=item.src;img.alt=item.cap;img.width=iw;img.height=ih;img.draggable=!1;img.decoding="async";
  img.style.width=iw+"px";img.style.height=ih+"px";
  const cap=document.createElement("span");cap.className="lt__cap";cap.textContent=item.cap;cap.style.maxWidth=iw+"px";
  el.append(img,cap);el.style.zIndex=++z;table.appendChild(el);
  const c={el,item,x:W/2,y:H+200,r:0,vx:0,vy:0,vr:0,w:el.offsetWidth,h:el.offsetHeight,tw:null,dying:!1};
  bind(c);return c};

// scatter: best-candidate sampling keeps prints spread out without a rigid grid
const spots=list=>{const out=[];
  list.forEach(c=>{let best=null,bd=-1;
    for(let k=0;k<60;k++){const x=rand(c.w/2+12,W-c.w/2-12),y=rand(c.h/2+12,H-c.h/2-30);
      const d=out.length?Math.min(...out.map(o=>Math.hypot((o.x-x)/W,(o.y-y)/H))):1;if(d>bd){bd=d;best={x,y}}}
    out.push(best)});return out};

const deal=animate=>{
  size();const n=W<640?10:16,current=new Set(cards.map(c=>c.item.src));
  let pick=POOL.filter(p=>!current.has(p.src));if(pick.length<n)pick=POOL.slice();
  pick=pick.sort(()=>Math.random()-.5).slice(0,n);
  const fresh=pick.map(makeCard),targets=spots(fresh),now=performance.now();
  fresh.forEach((c,i)=>{const t=targets[i],r=rand(-11,11);
    if(!animate||reduce){c.x=t.x;c.y=t.y;c.r=r;place(c);return}
    c.x=W/2+rand(-40,40);c.y=H+c.h;c.r=rand(-40,40);place(c);
    c.tw={t0:now+i*85,dur:720,from:{x:c.x,y:c.y,r:c.r},to:{x:t.x,y:t.y,r}}});
  cards.push(...fresh);dealt=!0;kick();
  // once the prints have landed, tape down up to two that sit on top of the pile (nothing overlaps them)
  setTimeout(()=>tapeTop(fresh),animate&&!reduce?fresh.length*85+780:0)};
const tapeTop=fresh=>{const live=fresh.filter(c=>!c.dying&&c.el.isConnected);if(!live.length)return;
  const box=c=>c.el.getBoundingClientRect(),zi=c=>+c.el.style.zIndex||0;
  const hit=(a,b)=>a.left<b.right&&b.left<a.right&&a.top<b.bottom&&b.top<a.bottom;
  const open=live.filter(c=>{const r=box(c);return!cards.some(o=>o!==c&&!o.dying&&zi(o)>zi(c)&&hit(r,box(o)))});
  (open.length?open:[live.reduce((a,b)=>zi(b)>zi(a)?b:a)]).sort(()=>Math.random()-.5).slice(0,2).forEach(c=>{
    const t=document.createElement("span");t.className="lt__tape";t.style.setProperty("--tr",rand(-8,8).toFixed(1)+"deg");t.style.left=rand(30,70).toFixed(0)+"%";c.el.appendChild(t)})};

const tossAway=()=>{cards.forEach(c=>{if(c.dying)return;const a=Math.atan2(c.y-H/2,c.x-W/2)+rand(-.5,.5),sp=rand(1100,1600);
  c.dying=!0;c.tw=null;c.vx=Math.cos(a)*sp;c.vy=Math.sin(a)*sp-400;c.vr=rand(-500,500)});kick()};

const step=now=>{raf=0;const dt=Math.min(.05,(now-(last||now))/1000);last=now;let busy=!1;
  for(const c of cards){
    if(c.tw){const q=clamp((now-c.tw.t0)/c.tw.dur,0,1),e=easeOutBack(q),f=c.tw.from,t=c.tw.to;
      c.x=f.x+(t.x-f.x)*e;c.y=f.y+(t.y-f.y)*e;c.r=f.r+(t.r-f.r)*Math.min(1,q*1.2);
      if(q>=1)c.tw=null;busy=!0;place(c);continue}
    if(c===held?.card||(Math.abs(c.vx)+Math.abs(c.vy)<4&&Math.abs(c.vr)<2&&!c.dying))continue;
    c.x+=c.vx*dt;c.y+=c.vy*dt;c.r+=c.vr*dt;
    if(c.dying){c.el.style.opacity=String(clamp(1-Math.hypot(c.x-W/2,c.y-H/2)/(Math.max(W,H)*.9),0,1))}
    else{const f=Math.exp(-3.4*dt);c.vx*=f;c.vy*=f;c.vr*=Math.exp(-4.5*dt);
      // soft bounce off the table edges
      const hw=c.w/2,hh=c.h/2;
      if(c.x<hw){c.x=hw;c.vx=Math.abs(c.vx)*.45}else if(c.x>W-hw){c.x=W-hw;c.vx=-Math.abs(c.vx)*.45}
      if(c.y<hh){c.y=hh;c.vy=Math.abs(c.vy)*.45}else if(c.y>H-hh){c.y=H-hh;c.vy=-Math.abs(c.vy)*.45}}
    place(c);busy=!0}
  cards=cards.filter(c=>{if(c.dying&&(c.el.style.opacity==="0"||c.x<-W||c.x>2*W||c.y<-H||c.y>2*H)){c.el.remove();return!1}return!0});
  if(busy)raf=requestAnimationFrame(step);else last=0};
const kick=()=>{raf||(raf=requestAnimationFrame(step))};

// drag & toss
function bind(c){const el=c.el;
  el.addEventListener("pointerdown",e=>{if(c.dying||e.button>0)return;e.preventDefault();el.setPointerCapture(e.pointerId);
    const tr=table.getBoundingClientRect();c.tw=null;c.vx=c.vy=c.vr=0;el.style.zIndex=++z;el.classList.add("is-held");
    held={card:c,id:e.pointerId,ox:e.clientX-tr.left-c.x,oy:e.clientY-tr.top-c.y,sx:e.clientX,sy:e.clientY,t0:performance.now(),lx:e.clientX,ly:e.clientY,lt:performance.now(),vx:0,vy:0,moved:0,r0:c.r};
    place(c)});
  el.addEventListener("pointermove",e=>{if(!held||held.card!==c||e.pointerId!==held.id)return;
    const tr=table.getBoundingClientRect(),now=performance.now(),dt=Math.max(1,now-held.lt)/1000;
    const ivx=(e.clientX-held.lx)/dt,ivy=(e.clientY-held.ly)/dt;held.vx=held.vx*.6+ivx*.4;held.vy=held.vy*.6+ivy*.4;
    held.lx=e.clientX;held.ly=e.clientY;held.lt=now;held.moved=Math.max(held.moved,Math.hypot(e.clientX-held.sx,e.clientY-held.sy));
    c.x=clamp(e.clientX-tr.left-held.ox,c.w/2*.3,W-c.w/2*.3);c.y=clamp(e.clientY-tr.top-held.oy,c.h/2*.3,H-c.h/2*.3);
    c.r=held.r0+clamp(held.vx*.006,-14,14);place(c)});
  const end=e=>{if(!held||held.card!==c||e.pointerId!==held.id)return;const h=held;held=null;el.classList.remove("is-held");
    if(h.moved<6&&performance.now()-h.t0<450){place(c);open(cards.filter(k=>!k.dying).indexOf(c));return}
    if(performance.now()-h.lt>90){h.vx=h.vx*.2;h.vy=h.vy*.2}   // paused before letting go → little momentum
    const sp=Math.hypot(h.vx,h.vy),k=sp>2600?2600/sp:1;c.vx=h.vx*k;c.vy=h.vy*k;
    c.vr=clamp((h.ox*c.vy-h.oy*c.vx)*.0009,-420,420);if(reduce){c.vx=c.vy=c.vr=0}
    place(c);kick()};
  el.addEventListener("pointerup",end);el.addEventListener("pointercancel",end);
  el.addEventListener("click",e=>{if(e.detail===0)open(cards.filter(k=>!k.dying).indexOf(c))})}   // keyboard Enter / Space

// full-size viewer
const box=document.createElement("div");box.className="lt-box";box.hidden=!0;box.setAttribute("role","dialog");box.setAttribute("aria-modal","true");box.setAttribute("aria-label","Playground piece");
box.innerHTML='<button class="lt-x" type="button" aria-label="Close">close ✕</button><button class="lt-prev" type="button" aria-label="Previous">‹</button><figure><img alt=""><figcaption></figcaption></figure><button class="lt-next" type="button" aria-label="Next">›</button>';
document.body.appendChild(box);
const bImg=box.querySelector("img"),bCap=box.querySelector("figcaption");let at=-1,opener=null,openedAt=0;
const show=i=>{const live=cards.filter(k=>!k.dying);if(!live.length)return;at=(i+live.length)%live.length;const it=live[at].item;bImg.src=it.src;bImg.alt=it.cap;bCap.textContent=`${it.cap} — ${at+1} / ${live.length}`};
function open(i){if(i<0)return;openedAt=performance.now();opener=document.activeElement;show(i);box.hidden=!1;requestAnimationFrame(()=>box.classList.add("is-open"));document.documentElement.style.overflow="hidden";box.querySelector(".lt-x").focus()}
const close=()=>{box.classList.remove("is-open");document.documentElement.style.overflow="";setTimeout(()=>{box.hidden=!0},250);opener?.focus?.()};
box.querySelector(".lt-x").addEventListener("click",close);
box.querySelector(".lt-prev").addEventListener("click",()=>show(at-1));box.querySelector(".lt-next").addEventListener("click",()=>show(at+1));
// (a tap opens on finger-up; ignore the click that follows it landing on the backdrop)
box.addEventListener("click",e=>{if(e.target===box&&performance.now()-openedAt>400)close()});
addEventListener("keydown",e=>{if(box.hidden)return;if(e.key==="Escape")close();else if(e.key==="ArrowLeft")show(at-1);else if(e.key==="ArrowRight")show(at+1)});

sec.querySelector("[data-lt-deal]").addEventListener("click",()=>{if(!dealt)return deal(!0);tossAway();setTimeout(()=>deal(!0),reduce?0:320)});

// keep prints on the table when it resizes
new ResizeObserver(()=>{const ow=W,oh=H;size();if(!dealt||!ow)return;
  cards.forEach(c=>{c.x=clamp(c.x*W/ow,c.w/2,W-c.w/2);c.y=clamp(c.y*H/oh,c.h/2,H-c.h/2);place(c)})}).observe(table);

// first deal: when the table is on screen and fully visible (it fades in after the toolkit balloons)
size();
if(reduce)deal(!1);
else{const io=new IntersectionObserver(es=>{if(!es[0].isIntersecting||dealt)return;io.disconnect();
  // the backlight eases on, then the prints are dealt
  const wait=()=>{if(dealt)return;if(parseFloat(getComputedStyle(sec).opacity)>=.95){table.classList.add("is-warming");setTimeout(()=>deal(!0),300);setTimeout(()=>table.classList.remove("is-warming"),600)}else requestAnimationFrame(wait)};wait()},{threshold:.35});io.observe(table)}

// 2. loupe: hold Shift over the table to magnify the print under the pointer
if(matchMedia("(hover: hover) and (pointer: fine)").matches){
  const lp=document.createElement("div");lp.className="lt__loupe";lp.setAttribute("aria-hidden","true");table.appendChild(lp);
  const Z=2.6,R=80;let shift=!1,mx=-1,my=-1;
  const upd=()=>{if(!shift||mx<0||held){lp.classList.remove("is-on");return}
    const tr=table.getBoundingClientRect();lp.classList.add("is-on");lp.style.transform=`translate(${(mx-tr.left-R).toFixed(1)}px,${(my-tr.top-R).toFixed(1)}px)`;
    const card=document.elementsFromPoint(mx,my).find(e=>e.classList&&e.classList.contains("lt__card")),img=card?.querySelector("img");
    if(!img){lp.style.backgroundImage="none";return}
    const r=img.getBoundingClientRect();
    lp.style.backgroundImage=`url("${img.currentSrc||img.src}")`;
    lp.style.backgroundSize=`${(r.width*Z).toFixed(1)}px ${(r.height*Z).toFixed(1)}px`;
    lp.style.backgroundPosition=`${(-(mx-r.left)*Z+R).toFixed(1)}px ${(-(my-r.top)*Z+R).toFixed(1)}px`};
  table.addEventListener("pointermove",e=>{if(e.pointerType==="mouse"){mx=e.clientX;my=e.clientY;shift=e.shiftKey;upd()}});
  table.addEventListener("pointerleave",()=>{mx=-1;upd()});
  addEventListener("keydown",e=>{if(e.key==="Shift"){shift=!0;upd()}});
  addEventListener("keyup",e=>{if(e.key==="Shift"){shift=!1;upd()}});
  if(hint)hint.textContent="drag · toss · click to look closer · hold shift for a loupe"}})();
(()=>{
// home finale: "before you ask" + "say hello" + the footer share exactly one screen,
// so publish the footer's real height for the finale's min-height
const f=document.querySelector(".site-foot--finale");if(!f)return;
const set=()=>document.documentElement.style.setProperty("--foot-h",f.offsetHeight+"px");
"ResizeObserver"in window?new ResizeObserver(set).observe(f):addEventListener("resize",set);set()})();
(()=>{
// A moth on the light table: drawn to the light, it loops around the bright centre, lands on the
// table now and then and slowly fans its wings, and darts off when the cursor comes close.
const table=document.querySelector("[data-lt-table]");if(!table)return;
const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
const NS="http://www.w3.org/2000/svg";
const m=document.createElement("div");m.className="lt__moth";m.setAttribute("aria-hidden","true");
m.innerHTML=`<svg viewBox="0 0 100 100" width="68" height="68"><g transform="translate(50 50)"><g class="mw mw-l"><path class="mh" d="M-3 0C-15 2-28 8-29 17-28 25-15 24-3 10Z"/><path class="mf" d="M-2-9C-14-18-32-24-46-21-44-11-40-2-34 6-24 5-12 4-3 2Z"/><path class="mp" d="M-10-12L-14-6-11-1-14 3M-27-17L-31-10-26-6-30 2M-38-19L-41-12-37-5"/><circle class="md" cx="-20" cy="-8" r="1.8"/></g><g class="mw mw-r"><g transform="scale(-1 1)"><path class="mh" d="M-3 0C-15 2-28 8-29 17-28 25-15 24-3 10Z"/><path class="mf" d="M-2-9C-14-18-32-24-46-21-44-11-40-2-34 6-24 5-12 4-3 2Z"/><path class="mp" d="M-10-12L-14-6-11-1-14 3M-27-17L-31-10-26-6-30 2M-38-19L-41-12-37-5"/><circle class="md" cx="-20" cy="-8" r="1.8"/></g></g><ellipse class="mb" cx="0" cy="5" rx="5" ry="13"/><path class="ms" d="M-4 4h8M-4.6 8h9.2M-4.2 12h8.4M-3.4 16h6.8"/><circle class="mt" cx="0" cy="-8" r="6"/><circle class="mb" cx="0" cy="-15" r="3.6"/><path class="ma" d="M-2 -16Q-6 -27 -15 -32M2 -16Q6 -27 15 -32"/><path class="mc" d="M-3.5 -19.5l1.4 -2.2M-3.5 -19.5l-2.6 -0.3M-4.3 -21.1l1.8 -2.6M-4.3 -21.1l-3.2 0.2M-5.2 -22.7l2.1 -3.0M-5.2 -22.7l-3.6 0.6M-6.2 -24.1l2.2 -3.3M-6.2 -24.1l-3.8 1.0M-7.2 -25.5l2.1 -3.5M-7.2 -25.5l-3.8 1.3M-8.4 -26.8l1.8 -3.5M-8.4 -26.8l-3.7 1.5M-9.6 -28.0l1.3 -3.4M-9.6 -28.0l-3.3 1.5M-10.8 -29.1l0.8 -3.1M-10.8 -29.1l-2.9 1.3M-12.1 -30.2l0.2 -2.6M-12.1 -30.2l-2.4 0.9M-13.5 -31.1l-0.4 -2.0M-13.5 -31.1l-1.9 0.4M3.5 -19.5l2.6 -0.3M3.5 -19.5l-1.4 -2.2M4.3 -21.1l3.2 0.2M4.3 -21.1l-1.8 -2.6M5.2 -22.7l3.6 0.6M5.2 -22.7l-2.1 -3.0M6.2 -24.1l3.8 1.0M6.2 -24.1l-2.2 -3.3M7.2 -25.5l3.8 1.3M7.2 -25.5l-2.1 -3.5M8.4 -26.8l3.7 1.5M8.4 -26.8l-1.8 -3.5M9.6 -28.0l3.3 1.5M9.6 -28.0l-1.3 -3.4M10.8 -29.1l2.9 1.3M10.8 -29.1l-0.8 -3.1M12.1 -30.2l2.4 0.9M12.1 -30.2l-0.2 -2.6M13.5 -31.1l1.9 0.4M13.5 -31.1l0.4 -2.0"/></g></svg>`;
table.appendChild(m);
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v)),rand=(a,b)=>a+Math.random()*(b-a);
let W=0,H=0,x=0,y=0,vx=0,vy=0,ang=0,mode="fly",timer=0,tx=0,ty=0,px=-1e4,py=-1e4,last=0,raf=0,on=!1,t0=performance.now();
const size=()=>{W=table.clientWidth;H=table.clientHeight};size();new ResizeObserver(size).observe(table);
x=W*.5;y=H*.45;
const land=()=>{mode="rest";timer=rand(2.2,5);vx=vy=0;m.classList.add("is-rest")};
const takeOff=()=>{mode="fly";timer=rand(5,11);m.classList.remove("is-rest")};
takeOff();
table.addEventListener("pointermove",e=>{const r=table.getBoundingClientRect();px=e.clientX-r.left;py=e.clientY-r.top});
table.addEventListener("pointerleave",()=>{px=py=-1e4});
const draw=()=>{m.style.transform=`translate(${(x-34).toFixed(1)}px,${(y-34).toFixed(1)}px) rotate(${ang.toFixed(1)}deg)`};
if(reduce){x=W*.62;y=H*.32;ang=-18;m.classList.add("is-rest");draw();return}
const step=now=>{raf=on?requestAnimationFrame(step):0;const dt=Math.min(.05,(now-(last||now))/1000);last=now;const t=(now-t0)/1000;
  const dpx=x-px,dpy=y-py,dist=Math.hypot(dpx,dpy);
  if(dist<110){ // startled: dart away from the cursor
    if(mode==="rest")takeOff();const k=900/(dist+20);vx+=dpx/dist*k*dt*60;vy+=dpy/dist*k*dt*60}
  if(mode==="fly"){timer-=dt;
    // drawn to the light: loop around the bright centre with a wobble, plus jitter
    const cx=W*.5+Math.cos(t*.7)*W*.26+Math.sin(t*1.9)*W*.06,cy=H*.46+Math.sin(t*1.1)*H*.24+Math.cos(t*2.3)*H*.05;
    vx+=(cx-x)*1.6*dt+rand(-1,1)*260*dt;vy+=(cy-y)*1.6*dt+rand(-1,1)*260*dt;
    const sp=Math.hypot(vx,vy),max=dist<110?620:240;if(sp>max){vx*=max/sp;vy*=max/sp}
    vx*=Math.exp(-1.2*dt);vy*=Math.exp(-1.2*dt);
    x+=vx*dt;y+=vy*dt;
    if(x<24||x>W-24){vx*=-.6;x=clamp(x,24,W-24)}if(y<24||y>H-24){vy*=-.6;y=clamp(y,24,H-24)}
    const want=Math.atan2(vy,vx)*180/Math.PI+90;let d=((want-ang+540)%360)-180;ang+=d*Math.min(1,dt*6);
    if(timer<=0&&dist>160)land()}
  else{timer-=dt;ang+=Math.sin(t*.8)*.05;if(timer<=0)takeOff()}
  draw()};
new IntersectionObserver(es=>{on=es[0].isIntersecting;if(on&&!raf){last=0;raf=requestAnimationFrame(step)}}).observe(table)})();
