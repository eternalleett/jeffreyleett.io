
/* Custom single-stroke chalk alphabet: paths follow real pen stroke order, not a text clipping mask. */
(()=>{
const glyph={
 A:['M0 40 L16 0 32 40','M5 26 L27 26'],B:['M0 0 L0 40','M0 0 Q32 -2 30 10 Q30 18 0 19','M0 19 Q37 18 31 32 Q29 42 0 40'],C:['M31 6 Q5 -6 0 20 Q-1 46 31 34'],D:['M0 0 L0 40','M0 0 Q36 -2 34 20 Q33 41 0 40'],E:['M30 0 L0 0 L0 40 L30 40','M0 19 L23 19'],F:['M0 40 L0 0 L31 0','M0 19 L23 19'],G:['M32 7 Q4 -5 1 19 Q-1 45 31 34 L31 23 L20 23'],H:['M0 0 L0 40','M33 0 L33 40','M0 20 L33 20'],I:['M0 0 L32 0','M16 0 L16 40','M0 40 L32 40'],J:['M32 0 L32 29 Q32 46 9 39 L2 33'],K:['M0 0 L0 40','M32 0 L0 23 L33 40'],L:['M0 0 L0 40 L30 40'],M:['M0 40 L0 0 L16 24 L32 0 L32 40'],N:['M0 40 L0 0 L32 40 L32 0'],O:['M17 0 C-5 0 -5 40 17 40 C39 40 39 0 17 0 Z'],P:['M0 40 L0 0 Q33 -3 32 12 Q32 26 0 22'],Q:['M17 0 C-5 0 -5 40 17 40 C39 40 39 0 17 0 Z','M22 29 L34 43'],R:['M0 40 L0 0 Q32 -2 32 12 Q31 25 0 23','M17 23 L33 40'],S:['M31 5 Q0 -8 0 11 Q-1 22 17 20 Q43 21 30 37 Q19 46 0 35'],T:['M0 0 L33 0','M17 0 L17 40'],U:['M0 0 L0 27 Q0 43 17 40 Q33 39 33 27 L33 0'],V:['M0 0 L16 40 L33 0'],W:['M0 0 L7 40 L17 15 L27 40 L34 0'],X:['M0 0 L33 40','M33 0 L0 40'],Y:['M0 0 L16 21 L33 0','M16 21 L16 40'],Z:['M0 0 L32 0 L0 40 L33 40'],'.':['M14 36 L17 40'],',':['M17 36 L13 45'],'!':['M17 0 L17 28','M17 36 L17 40'],'?':['M0 7 Q11 -5 27 3 Q42 16 17 27 L17 30','M17 36 L17 40']
};
const texts=[['LISTEN','FIRST.'],['MAP THE','FLOW.'],['MAKE IT','WORK.']];
const colors=['#f1c5b7','#b4dbeb','#e8e5a5'];
const svgns='http://www.w3.org/2000/svg',acts=[...document.querySelectorAll('.scene-act')];
const compiled=[];
texts.forEach((lines,index)=>{
const svg=acts[index]?.querySelector('.stroke-lettering');if(!svg)return;
const shapes=[];
lines.forEach((line,row)=>{
 const width=(line.length-1)*52+34;const left=Math.max(5,(820-width)/2);let x=left;
 for(const char of line){if(char===' '){x+=52;continue}for(const d of glyph[char]||[]){const el=document.createElementNS(svgns,'path');el.setAttribute('d',d);el.setAttribute('transform',`translate(${x} ${row*98+17}) scale(1.46)`);el.style.stroke=colors[index];svg.appendChild(el);const length=el.getTotalLength();el.style.strokeDasharray=length;el.style.strokeDashoffset=length;shapes.push({el,length});}x+=52;}
});compiled.push({svg,shapes,act:acts[index],eraser:acts[index].querySelector('.letter-eraser')});
});
const clip=x=>Math.max(0,Math.min(1,x));const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function setStory(t){t=clip(t);const turn=Math.min(2,Math.floor(t*3));compiled.forEach((chapter,i)=>{
const start=i/3,local=clip((t-start)*3);const write=clip(local/.72),wipe=clip((local-.72)/.28);
chapter.act.style.opacity=i===turn||local>0&&local<1?String(i===turn?1:1-wipe):'0';chapter.act.style.visibility=chapter.act.style.opacity==='0'?'hidden':'visible';
chapter.act.style.transform='none';chapter.act.style.filter='none';
const total=chapter.shapes.reduce((a,b)=>a+b.length,0);let cursor=write*total;
for(const shape of chapter.shapes){const visible=clip(cursor/shape.length);shape.el.style.strokeDashoffset=String(shape.length*(1-visible));cursor-=shape.length;}
const erased=clip(wipe);chapter.svg.style.clipPath=erased?`inset(0 0 0 ${erased*100}%)`:'none';
const er=chapter.eraser;er.style.opacity=erased>0&&erased<1?'1':'0';
const rect=chapter.svg.getBoundingClientRect(),parent=chapter.act.getBoundingClientRect();er.style.left=`${rect.left-parent.left+rect.width*erased}px`;er.style.top=`${rect.top-parent.top+rect.height*.43}px`;
});window.currentChalkChapter=turn;}
window.ChalkLettering={setStory,getState:()=>({chapter:window.currentChalkChapter,strokes:compiled.map(x=>x.shapes.length)})};
if(reduced){setStory(1);compiled.forEach((chapter,i)=>{chapter.act.style.opacity=i===2?'1':'0';chapter.svg.style.clipPath='none';chapter.shapes.forEach(p=>p.el.style.strokeDashoffset=0)})}
else if(!(window.gsap && window.ScrollTrigger)){let ticking=false;const onScroll=()=>{if(ticking)return;ticking=true;requestAnimationFrame(()=>{ticking=false;const el=document.querySelector('.scene');if(!el)return;const rect=el.getBoundingClientRect(),range=Math.max(innerHeight*3.2,1900);const prog=window.gsap&&window.ScrollTrigger?Math.max(0,Math.min(1,(0-rect.top)/range)):clip((innerHeight*.7-rect.top)/(rect.height+innerHeight*.3));setStory(prog);});};window.addEventListener('scroll',onScroll,{passive:true});onScroll();}
})();