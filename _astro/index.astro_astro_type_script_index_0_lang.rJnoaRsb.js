(()=>{const i=document.querySelector("[data-hero-canvas]"),t=i?.getContext("2d");if(!i||!t)return;const l=matchMedia("(prefers-reduced-motion: reduce)").matches,r=(1+Math.sqrt(5))/2,s=1/r,d=[[1,1,1],[1,1,-1],[1,-1,1],[1,-1,-1],[-1,1,1],[-1,1,-1],[-1,-1,1],[-1,-1,-1],[0,s,r],[0,s,-r],[0,-s,r],[0,-s,-r],[s,r,0],[s,-r,0],[-s,r,0],[-s,-r,0],[r,0,s],[r,0,-s],[-r,0,s],[-r,0,-s]],g=2*s,o=[];for(let e=0;e<d.length;e++)for(let p=e+1;p<d.length;p++){const M=Math.hypot(d[e][0]-d[p][0],d[e][1]-d[p][1],d[e][2]-d[p][2]);Math.abs(M-g)<.05&&o.push([e,p])}let a=-.42,n=.62,v=-.42,c=.62;l||addEventListener("pointermove",e=>{c=.62+(e.clientX/innerWidth-.5)*1.6,v=-.42+(e.clientY/innerHeight-.5)*1.1},{passive:!0});let h=0,f=0,u=1;const I=()=>{h=i.clientWidth,f=i.clientHeight,u=Math.min(2,window.devicePixelRatio||1),i.width=Math.max(1,Math.round(h*u)),i.height=Math.max(1,Math.round(f*u))};"ResizeObserver"in window?new ResizeObserver(I).observe(i):addEventListener("resize",I),I();const L=e=>{const p=Math.cos(n),M=Math.sin(n),E=e[0]*p+e[2]*M,y=-e[0]*M+e[2]*p,S=Math.cos(a),w=Math.sin(a);return[E,e[1]*S-y*w,e[1]*w+y*S]},b=performance.now(),m=e=>{const p=(e-b)/1e3;l||(a+=(v-a)*.05,n+=(c+p*.22-n)*.05),t.setTransform(u,0,0,u,0,0),t.clearRect(0,0,h,f);const M=h/2,E=f/2,y=Math.min(h,f)*.25,S=d.map(L);let w=1/0,z=-1/0;for(const x of S)x[2]<w&&(w=x[2]),x[2]>z&&(z=x[2]);const k=z-w||1;t.strokeStyle="rgba(14,27,48,0.16)",t.lineWidth=1,t.setLineDash([4,7]),t.beginPath(),t.arc(M,E,y*1.6,0,Math.PI*2),t.stroke(),t.setLineDash([]);for(const[x,q]of o){const O=S[x],P=S[q],A=((O[2]+P[2])/2-w)/k;t.strokeStyle=`rgba(43,92,255,${(.12+A*.82).toFixed(3)})`,t.lineWidth=.7+A*1.7,t.beginPath(),t.moveTo(M+O[0]*y,E-O[1]*y),t.lineTo(M+P[0]*y,E-P[1]*y),t.stroke()}for(const x of S){const q=(x[2]-w)/k;t.fillStyle=q>.5?"rgba(14,27,48,0.9)":"rgba(14,27,48,0.3)",t.beginPath(),t.arc(M+x[0]*y,E-x[1]*y,1.1+q*2.3,0,Math.PI*2),t.fill()}l||requestAnimationFrame(m)};requestAnimationFrame(m)})();(()=>{const i=document.querySelector("[data-playground]");if(!i||matchMedia("(prefers-reduced-motion: reduce)").matches)return;const t=(i.dataset.playground||"").split("|").filter(Boolean);if(t.length<2)return;const l=o=>{const a=/\/([^/]+)\/p(\d+)(?:_\d+)?\.webp/.exec(o)??[];return(a[1]??"playground").replace(/_/g," ")+" · p"+(a[2]??"")},r=new Map,s=o=>{if(r.has(o))return;const a=new Image;a.src=o,r.set(o,a)};if("IntersectionObserver"in window){const o=new IntersectionObserver(a=>{a.some(n=>n.isIntersecting)&&(t.forEach(s),o.disconnect())},{rootMargin:"600px 0px"});o.observe(i)}else t.forEach(s);const d=[...i.querySelectorAll(".mosaic__item")],g=new Set;d.forEach((o,a)=>{const n=o.querySelector("img"),v=o.querySelector(".mosaic__cap");if(!n)return;let c=n.getAttribute("src")||t[0];g.add(c);const h=()=>{n.naturalWidth&&n.naturalHeight&&(n.style.aspectRatio=`${n.naturalWidth} / ${n.naturalHeight}`)};n.complete&&n.naturalWidth?h():n.addEventListener("load",h,{once:!0});let f=0;const u=()=>{let b=t.filter(e=>e!==c&&!g.has(e));b.length||(b=t.filter(e=>e!==c));const m=b[Math.floor(Math.random()*b.length)];!m||m===c||(g.delete(c),g.add(m),c=m,o.classList.remove("is-flick"),o.offsetWidth,n.addEventListener("load",h,{once:!0}),n.src=m,n.alt=l(m),v&&(v.textContent=l(m)),o.classList.add("is-flick"))},I=()=>{f||(f=window.setInterval(u,2200+a%5*420))},L=()=>{clearInterval(f),f=0};"IntersectionObserver"in window?new IntersectionObserver(b=>b.forEach(m=>m.isIntersecting?I():L()),{rootMargin:"0px 0px -10% 0px"}).observe(o):I()})})();(()=>{
const stage=document.querySelector("[data-intro-stage]"),copy=stage?.querySelector("[data-intro-copy]"),demo=stage?.querySelector("[data-intro-demo]"),frame=stage?.querySelector("[data-intro-frame]");
if(!stage||!copy||!demo)return;
const SRC="/decahedron-net-designer.html",reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
const box=stage.querySelector(".introswap"),orb=stage.querySelector("[data-orb]"),slot=stage.querySelector("[data-orb-slot]"),target=stage.querySelector("[data-orb-target]"),unfold=stage.querySelector("[data-intro-unfold]"),title=stage.querySelector("[data-scramble]"),label=stage.querySelector("[data-orb-label]");
const clamp=v=>Math.min(1,Math.max(0,v)),ease=v=>v<.5?4*v*v*v:1-Math.pow(-2*v+2,3)/2,lerp=(a,b,t)=>a+(b-a)*t;
const rel=el=>{const r=el.getBoundingClientRect(),b=box.getBoundingClientRect();return{x:r.left-b.left+r.width/2,y:r.top-b.top+r.height/2,w:r.width,h:r.height}};
// the orb flies only when it is displayed (desktop); otherwise fall back to a plain fade
const flying=()=>orb&&target&&slot&&orb.offsetWidth>0&&slot.offsetWidth>0;
const placeOrb=(x,y,s)=>{const w=orb.offsetWidth;orb.style.transform=`translate(${(x-w/2).toFixed(1)}px,${(y-w/2).toFixed(1)}px) scale(${s.toFixed(4)})`;orb.style.visibility="visible"};
// heading decodes letter by letter as q goes 0 → 1
const text=title?.textContent||"",GLYPHS="ABCDEFGHJKLMNPQRSTUVWXYZ";let lastN=-1;
const scramble=q=>{if(!title)return;const n=Math.round(q*text.length);if(n===lastN&&q>=1)return;lastN=n;
title.textContent=[...text].map((c,i)=>i<n||c===" "?c:GLYPHS[Math.random()*GLYPHS.length|0]).join("")};
let loaded=!1,queued=!1,shift=0;
const load=()=>{!loaded&&frame&&(loaded=!0,frame.setAttribute("src",SRC))};
if(reduce){load();demo.style.opacity="1";demo.style.pointerEvents="auto";
const still=()=>{if(!flying())return;const a=rel(slot);placeOrb(a.x,a.y,a.w/orb.offsetWidth)};
label&&(label.style.opacity="1");addEventListener("resize",still,{passive:!0});still();return}
const render=()=>{queued=!1;
const span=stage.offsetHeight-innerHeight,p=span>0?clamp(-stage.getBoundingClientRect().top/span):0;
// scene 1: intro copy slides up and away
const f=clamp(p/.28);shift=-f*80;copy.style.opacity=String(1-f);copy.style.transform=`translateY(${shift.toFixed(1)}px)`;
// scene 2: heading + chrome fade in, heading decodes
const u=clamp((p-.3)/.15);demo.style.opacity=String(u);scramble(clamp((p-.32)/.3));
p>.08&&load();
if(!flying()){demo.style.transform=`translateY(${((1-u)*60).toFixed(1)}px)`;unfold&&(unfold.style.clipPath="");demo.style.pointerEvents=u>.6?"auto":"none";return}
demo.style.transform="";
// the decahedron: slot → centre of the designer (grows) → docks big beside it, then its tag appears
const w=orb.offsetWidth,a=rel(slot),c=rel(unfold||demo),t=rel(target);a.y-=shift;
const s0=a.w/w,s1=Math.min(1.15,Math.min(c.w,c.h)*.95/w),s2=t.w/w;
const t1=ease(clamp((p-.04)/.34)),t2=ease(clamp((p-.5)/.25));
const x=lerp(lerp(a.x,c.x,t1),t.x,t2),y=lerp(lerp(a.y,c.y,t1),t.y,t2),sc=lerp(lerp(s0,s1,t1),s2,t2);
placeOrb(x,y,sc);label&&(label.style.opacity=t2>.92?"1":"0");
// the designer unfolds out of the decahedron's centre
if(unfold){const k=ease(clamp((p-.42)/.22));unfold.style.clipPath=k>=1?"none":`circle(${(k*75).toFixed(2)}% at 50% 50%)`}
demo.style.pointerEvents=p>.64?"auto":"none"};
const req=()=>{queued||(queued=!0,requestAnimationFrame(render))};
addEventListener("scroll",req,{passive:!0});addEventListener("resize",req,{passive:!0});render()})();
