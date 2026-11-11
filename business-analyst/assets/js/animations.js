window.addEventListener('DOMContentLoaded',()=>{
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;const paused=()=>window.SiteState?.isPaused() ?? reduced;
const magneticButtons=document.querySelectorAll('.pill,.contact-cta a,.round-arrow');const hoverFine=matchMedia('(hover:hover) and (pointer:fine)').matches;if(hoverFine&&!reduced){magneticButtons.forEach(el=>{el.classList.add('magnetic');el.addEventListener('pointermove',e=>{if(paused())return;const r=el.getBoundingClientRect(),dx=(e.clientX-r.left-r.width/2)*.24,dy=(e.clientY-r.top-r.height/2)*.24;if(window.gsap)gsap.to(el,{x:dx,y:dy,duration:.3,overwrite:'auto',ease:'power3.out'});else el.style.transform=`translate(${dx}px,${dy}px)`});el.addEventListener('pointerleave',()=>{if(window.gsap)gsap.to(el,{x:0,y:0,duration:.65,overwrite:'auto',ease:'elastic.out(1,.45)'});else el.style.transform='translate(0,0)'})})}
if(!reduced&&window.gsap){gsap.registerPlugin(ScrollTrigger);/* Native browser scrolling; Lenis intentionally disabled for performance. */
const splitTitle=(el)=>{const text=el.textContent;el.setAttribute('aria-label',text);el.textContent='';const wrapper=document.createElement('span');wrapper.className='split-line';[...text].forEach(letter=>{const c=document.createElement('span');c.className='split-char'+(letter===' '?' space':'');c.textContent=letter===' '?'\u00a0':letter;c.setAttribute('aria-hidden','true');wrapper.appendChild(c)});el.appendChild(wrapper);return [...wrapper.querySelectorAll('.split-char')]};
const heroLines=[...document.querySelectorAll('.hero-heading > div')];gsap.from(heroLines,{y:110,opacity:0,stagger:.16,duration:1.3,ease:'power4.out'});gsap.from('.hero-art',{scale:.7,opacity:0,rotate:-18,duration:1.8,delay:.25,ease:'power3.out'});
gsap.to('#motionMeter',{scaleX:1,ease:'none',scrollTrigger:{start:0,end:'max',scrub:.15}});
gsap.to('.hero-art',{yPercent:35,rotate:25,scale:.77,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:1}});
gsap.to('.hero-heading',{yPercent:-19,opacity:.12,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:1}});
gsap.utils.toArray('.reveal').forEach(el=>{gsap.fromTo(el,{y:60,autoAlpha:0},{y:0,autoAlpha:1,duration:1,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 88%',once:true}})});
const workHead=document.querySelector('.section-head h2');if(workHead){gsap.from(splitTitle(workHead),{yPercent:120,rotate:7,stagger:.025,duration:.9,ease:'power4.out',scrollTrigger:{trigger:workHead,start:'top 88%',once:true}})}
if(hoverFine) gsap.utils.toArray('.work-img img').forEach(el=>{gsap.fromTo(el,{yPercent:-8,scale:1.12},{yPercent:8,scale:1.02,ease:'none',scrollTrigger:{trigger:el.closest('.work-img'),start:'top bottom',end:'bottom top',scrub:1}})});
const acts=gsap.utils.toArray('.scene-act'),scene=document.querySelector('.scene'),progress=scene.querySelectorAll('.scene-progress span'),chapter=document.querySelector('#chapterNum');acts.forEach((act,i)=>gsap.set(act,{autoAlpha:i===0?1:0}));
const chalkPath=document.querySelector('#chalkTrail'),bridgePath=document.querySelector('#bridgeLine'),bridgePath2=document.querySelector('#bridgeLine2');
[chalkPath,bridgePath,bridgePath2].forEach(p=>{const length=p.getTotalLength();p.style.strokeDasharray=String(length);p.style.strokeDashoffset=String(length)});
const story=gsap.timeline({defaults:{ease:'none'},scrollTrigger:{trigger:scene,start:'top top',end:()=>'+='+Math.max(innerHeight*3.2,1900),pin:true,scrub:1,anticipatePin:1,invalidateOnRefresh:true,onUpdate:self=>{let index=Math.min(2,Math.floor(self.progress*3));chapter.textContent=`CHAPTER 0${index+1} / 03`;document.querySelector('#motionStatus').textContent=['DISCOVER','ANALYSE','DELIVER'][index];progress.forEach((segment,i)=>segment.style.setProperty('--fill',String(Math.max(0,Math.min(1,self.progress*3-i)))));window.ChalkEngine?.setStory(self.progress);window.ChalkLettering?.setStory(self.progress);if(window.chalkSynthOn&&index!==window.chalkLastChapter){window.chalkLastChapter=index;window.playChalkNote([261.63,329.63,392][index])}}}});
story.to('.record-disc',{rotate:540,duration:3},0).to('.chalk-instrument',{rotateY:180,rotateX:18,scale:.77,xPercent:17,duration:1.4},.1).to('.chalk-instrument',{rotateY:370,rotateX:-14,scale:1.1,xPercent:-12,duration:1.5},1.5).to('.score-notes',{x:-40,y:-23,rotate:12,duration:3},0).to('.chalk-dec-one',{x:140,y:-140,rotate:130,duration:3},0).to('.chalk-dec-two',{x:-140,y:110,rotate:-125,duration:3},0)
;


gsap.to('#bigtext',{xPercent:-11,ease:'none',scrollTrigger:{trigger:'.interlude',start:'top bottom',end:'bottom top',scrub:1}});
gsap.fromTo('.interlude .massive',{clipPath:'inset(0 100% 0 0)'},{clipPath:'inset(0 0% 0 0)',ease:'none',scrollTrigger:{trigger:'.interlude',start:'top 75%',end:'center center',scrub:1}});
const aboutCopy=document.querySelector('.about-copy');if(aboutCopy){gsap.fromTo(aboutCopy,{opacity:.5},{opacity:1,scrollTrigger:{trigger:aboutCopy,start:'top 88%',end:'top 48%',scrub:.25}})}
const processRows=gsap.utils.toArray('.timeline-row');processRows.forEach((el,i)=>gsap.to(el,{x:i%2?23:-23,ease:'none',scrollTrigger:{trigger:el,start:'top bottom',end:'top 20%',scrub:1}}));
const contactTitle=document.querySelector('.contact h2');gsap.fromTo(contactTitle,{scale:.76,rotate:-6,opacity:.25},{scale:1,rotate:0,opacity:1,ease:'none',scrollTrigger:{trigger:'.contact',start:'top 85%',end:'center center',scrub:1}});
const status=()=>{if(window.scrollY<window.innerHeight*.5)document.querySelector('#motionStatus').textContent='SCROLL TO DIRECT THE STORY'};window.addEventListener('scroll',status,{passive:true});
}else{document.querySelector('#motionStatus').textContent=reduced?'REDUCED MOTION MODE':'STATIC MOTION FALLBACK';}



});