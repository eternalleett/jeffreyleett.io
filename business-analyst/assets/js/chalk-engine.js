window.addEventListener('DOMContentLoaded',()=>{
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;const paused=()=>window.SiteState?.isPaused() ?? reduced;
/* V4 Chalk Engine — deterministic physical-looking chalk strokes, animated tip, dust, and eraser.
   No image assets or WebGL required. Drawing is replayable in either scroll direction. */
(()=>{
 const pathItems=[
  {canvas:'storyChalkCanvas',selector:'#chalkTrail',colors:['--chalk-yellow','--chalk-blue','--chalk-pink'],scene:true},
  {canvas:'bridgeChalkCanvas',selector:'#bridgeLine',colors:['--chalk-bridge-yellow','--chalk-bridge-pink','--chalk-bridge-mint'],scene:false}
 ];
 const fract=x=>x-Math.floor(x),noise=x=>fract(Math.sin(x*127.1+43.72)*43758.5453);
 const clamp=x=>Math.max(0,Math.min(1,x));
 const hexRgb=(hex)=>[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16));
 const rendered=[]; const resolveColor=name=>getComputedStyle(document.documentElement).getPropertyValue(name).trim();
 pathItems.forEach(({canvas,selector,colors,scene})=>{
  const el=document.getElementById(canvas),path=document.querySelector(selector),svg=path?.ownerSVGElement;
  if(!el||!path||!svg)return;
  const ctx=el.getContext('2d',{alpha:true}),length=path.getTotalLength(),segments=scene?370:270;
  const points=Array.from({length:segments+1},(_,i)=>{const p=path.getPointAtLength(length*i/segments);return{x:p.x,y:p.y}});
  const model={el,path,svg,ctx,points,segments,colors:colors.map(resolveColor),scene,progress:reduced?1:0,last:-1,ratio:1,w:0,h:0,dpr:1,map:p=>p};
  function resize(){
   const r=el.getBoundingClientRect();if(!r.width||!r.height)return;
   const dpr=Math.min(window.devicePixelRatio||1,1.5),vw=scene?1200:1440,vh=scene?690:740;
   el.width=Math.round(r.width*dpr);el.height=Math.round(r.height*dpr);model.w=r.width;model.h=r.height;model.dpr=dpr;
   const scaleX=r.width/vw,scaleY=r.height/vh,scale=scene?Math.min(scaleX,scaleY):null;
   model.map=scene?p=>({x:(r.width-vw*scale)/2+p.x*scale,y:(r.height-vh*scale)/2+p.y*scale}):p=>({x:p.x*scaleX,y:p.y*scaleY});
   model.widthScale=scene?scale:Math.min(scaleX,scaleY);model.last=-1;draw();
  }
  function strokeBetween(start,end,colour,alpha=1){
   const a=Math.max(0,Math.floor(start*segments)),b=Math.min(segments,Math.ceil(end*segments));if(b<a)return;
   const [r,g,bv]=hexRgb(colour);
   ctx.save();ctx.lineCap='round';ctx.lineJoin='round';
   const w=Math.max(.85,model.widthScale*5.6);
   for(let layer=0;layer<3;layer++){ctx.beginPath();for(let k=a;k<=b;k++){if(k/segments>end)break;const p=model.map(points[k]),j=(noise(k*17+layer*19)-.5)*w*.34; if(k===a)ctx.moveTo(p.x+j,p.y-j*.45);else ctx.lineTo(p.x+j,p.y-j*.45)}
    ctx.strokeStyle=`rgba(${r},${g},${bv},${[.30,.22,.15][layer]*alpha})`;ctx.lineWidth=w*[1.4,.84,.38][layer];ctx.stroke();}
   // Chalk grain: every tiny particle is anchored to path coordinates, not frame time.
   for(let i=a;i<=b;i+=2){if(i/segments>end)break;const p=model.map(points[i]);for(let j=0;j<3;j++){const theta=noise(i*7+j*13)*6.283,radius=(noise(i*29+j*77)-.5)*w*2.4;ctx.fillStyle=`rgba(${r},${g},${bv},${(.19+noise(i*13+j*19)*.46)*alpha})`;ctx.beginPath();ctx.arc(p.x+Math.cos(theta)*radius,p.y+Math.sin(theta)*radius,.3+noise(i*29+j*33)*1.1,0,6.283);ctx.fill()}}
   ctx.restore();
  }
  function softEraser(cx,cy,amount,size){
   // Smudged erasure: partial scrub, dusty fringes and a moving felt eraser.
   const radius=Math.max(20,size*model.widthScale);ctx.save();ctx.globalCompositeOperation='destination-out';
   const g=ctx.createRadialGradient(cx,cy,0,cx,cy,radius);g.addColorStop(0,`rgba(0,0,0,${.80*amount})`);g.addColorStop(.55,`rgba(0,0,0,${.58*amount})`);g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.fillRect(cx-radius,cy-radius,radius*2,radius*2);ctx.restore();
   ctx.save();for(let i=0;i<32;i++){let angle=noise(i*17+cx)*6.28,dist=radius*(.3+noise(i*41+cy)*.85);ctx.fillStyle=`rgba(234,230,209,${.015+.09*noise(i*25)})`;ctx.fillRect(cx+Math.cos(angle)*dist,cy+Math.sin(angle)*dist,1.4,1.4)}ctx.restore();
  }
  function brushTip(p,progress,colour){
   const [r,g,b]=hexRgb(colour),sz=Math.max(9,model.widthScale*17);ctx.save();
   // A real-feeling slanted chalk nib, contact shadow, and a powder plume behind it.
   for(let i=0;i<(matchMedia('(max-width: 700px)').matches?10:22);i++){let seed=i+Math.floor(progress*160)*3,phase=noise(seed*23)*Math.PI*2,dist=sz*(.2+noise(seed*43)*2.2);ctx.fillStyle=`rgba(${r},${g},${b},${.045+.25*noise(seed*9)})`;ctx.beginPath();ctx.arc(p.x+Math.cos(phase)*dist-7,p.y+Math.sin(phase)*dist+6,.4+noise(seed*12)*1.8,0,6.283);ctx.fill()}
   ctx.translate(p.x,p.y);ctx.rotate(-.55);ctx.fillStyle='rgba(0,0,0,.32)';ctx.fillRect(-5,-sz+3,sz*.66,sz*1.7);ctx.fillStyle='#e9e1bc';ctx.fillRect(-7,-sz,sz*.57,sz*1.58);ctx.fillStyle='#faf5d7';ctx.fillRect(-7,sz*.38,sz*.57,sz*.23);ctx.fillStyle=`rgba(${r},${g},${b},.85)`;ctx.fillRect(-7,sz*.54,sz*.57,sz*.09);ctx.restore();
  }
  function draw(){
   if(!model.w||!model.h)return;ctx.setTransform(model.dpr,0,0,model.dpr,0,0);ctx.clearRect(0,0,model.w,model.h);
   const t=clamp(model.progress);if(reduced||paused()){strokeBetween(0,1,model.colors[0],.8);model.last=t;return}
   // Story timeline: first chalk phrase, erase, second phrase, erase, final performance.
   // The history is reconstructed from scroll progress, including reverse scrubbing.
   const phases=[{a:0,b:.34,from:0,to:.36,color:model.colors[0]},
     {a:.34,b:.69,from:.35,to:.73,color:model.colors[1]},
     {a:.69,b:1,from:.72,to:1,color:model.colors[2]}];
   phases.forEach((ph,i)=>{const local=clamp((t-ph.a)/(ph.b-ph.a));if(t>ph.a)strokeBetween(ph.from,ph.from+(ph.to-ph.from)*local,ph.color,1)});
   const wiping=[{at:.34,end:.45,start:.15,until:.38},{at:.69,end:.80,start:.48,until:.76}];
   wiping.forEach(w=>{if(t<=w.at)return;const u=clamp((t-w.at)/(w.end-w.at));const pos=w.start+(w.until-w.start)*u;for(let z=w.start;z<=pos;z+=.013){const q=model.map(points[Math.min(segments,Math.round(z*segments))]);softEraser(q.x,q.y,.7,25)}const p=model.map(points[Math.round(pos*segments)]);softEraser(p.x,p.y,1,48);
     // coarse felt duster while actively erasing, with visible smudged edge
     if(u>0&&u<1){ctx.save();ctx.translate(p.x,p.y);ctx.rotate(-.3);ctx.fillStyle='#d9c8a5';ctx.fillRect(-21,-9,42,18);ctx.fillStyle='#6e6658';ctx.fillRect(-21,-9,42,6);ctx.restore()}});
   const phase=t<.34?0:t<.69?1:2,ph=phases[phase],u=clamp((t-ph.a)/(ph.b-ph.a));
   if(t>.005&&t<.997){const p=model.map(points[Math.round((ph.from+(ph.to-ph.from)*u)*segments)]);brushTip(p,t,ph.color)}
   model.last=t;
  }
  model.renderProgress=(p)=>{const next=clamp(p);if(Math.abs(next-model.progress)<.002&&model.last>=0)return;model.progress=next;if(model.pending)return;model.pending=true;const now=performance.now();const elapsed=now-(model.lastDrawTime||0);setTimeout(()=>{model.pending=false;model.lastDrawTime=performance.now();if(document.visibilityState==='visible')draw()},Math.max(0,33-elapsed))};
  rendered.push(model);new ResizeObserver(resize).observe(el);resize();
 });
 window.ChalkEngine={setStory(p){rendered.find(r=>r.scene)?.renderProgress(p)},setBridge(p){rendered.find(r=>!r.scene)?.renderProgress(p)},getState(){return rendered.map(r=>({scene:r.scene,progress:r.progress,w:r.w,h:r.h}))}};
 // Fallback works even without GSAP CDN: route scroll progress through the same deterministic engine.
 if(reduced){window.ChalkEngine.setStory(1);window.ChalkEngine.setBridge(1)}
 else if(!window.gsap){let scheduled=false;const tick=()=>{scheduled=false;const sceneEl=document.querySelector('.scene'),bridgeEl=document.querySelector('.chalk-bridge');const sr=sceneEl.getBoundingClientRect(),br=bridgeEl.getBoundingClientRect();window.ChalkEngine.setStory(clamp((innerHeight*.85-sr.top)/(sr.height+innerHeight*.35)));window.ChalkEngine.setBridge(clamp((innerHeight*.85-br.top)/(br.height+innerHeight*.2)))};window.addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(tick)}},{passive:true});tick()}
 else {ScrollTrigger.create({trigger:'.chalk-bridge',start:'top 82%',end:'bottom 26%',onUpdate:self=>window.ChalkEngine.setBridge(self.progress)})}
})();


});