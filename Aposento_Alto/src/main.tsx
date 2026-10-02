import React, {useEffect,useRef,useState} from 'react';
import {createRoot} from 'react-dom/client';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './style.css';
const content = {
 'Nosotros': {label:'NUESTRA ESENCIA',title:'Una iglesia.\nUna familia.',text:'Aposento Alto es un lugar para acercarnos a Dios, compartir la fe y caminar juntos. Creemos en una comunidad donde cada persona puede encontrar compañía, esperanza y un sentido de pertenencia.',foot:'Aquí hay un lugar para ti.'},
 'Nuestra fe': {label:'LO QUE NOS UNE',title:'Jesús, en el centro.',text:'Nuestra fe está puesta en Jesús. La oración, la Palabra de Dios y la adoración nos invitan a conocerlo y a vivir su amor cada día.',foot:'Fe que se vive. Amor que se comparte.'},
 'Comunidad': {label:'CAMINAMOS JUNTOS',title:'La fe se comparte.',text:'Crecer en la fe también es escuchar, acompañar y servir. Queremos ser una comunidad que se cuida, ora unida y lleva el amor de Dios a su vida cotidiana.',foot:'Nadie tiene que caminar solo.'},
 'Bienvenido': {label:'ESTÁS EN CASA',title:'Ven tal como eres.',text:'No necesitas tener todas las respuestas para acercarte a Dios. Ya sea que estés descubriendo la fe o buscando una comunidad, en Aposento Alto queremos darte la bienvenida.',foot:'Será un gusto conocerte.'}
};
type Topic = keyof typeof content;
function Mark(){return <img className="church-logo" src="/aposento-logo-transparent.png" alt="Aposento Alto · San Francisco de Campeche"/>}
const schedule = [
 {day:'Martes',name:'Enseñanza',time:'7:00',period:'p. m.'},
 {day:'Jueves',name:'Damas',time:'7:00',period:'p. m.'},
 {day:'Viernes',name:'Varones',time:'7:00',period:'p. m.'},
 {day:'Sábado',name:'Jóvenes',time:'6:00',period:'p. m.'},
 {day:'Domingo',name:'Reunión dominical',time:'11:30',period:'a. m.'}
];
function ChurchMap(){
 const element=useRef<HTMLDivElement>(null);
 const [failed,setFailed]=useState(false);
 useEffect(()=>{if(!element.current)return;
 const map=L.map(element.current,{scrollWheelZoom:false}).setView([19.8144358,-90.543677],17);
 const tiles=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>'}).addTo(map);
 tiles.on('tileerror',()=>setFailed(true));tiles.on('tileload',()=>setFailed(false));
 const icon=L.divIcon({className:'church-map-marker',html:'<div class="marker-gold"><img src="/aposento-logo-transparent.png" alt=""/></div><span class="marker-point"></span>',iconSize:[80,96],iconAnchor:[40,96],popupAnchor:[0,-90]});
 L.marker([19.8144358,-90.543677],{icon,title:'Aposento Alto',alt:'Ubicación exacta de la iglesia Aposento Alto'}).addTo(map).bindPopup('<strong>Aposento Alto</strong><p>C. 2a, Samulá (Ampliación), Samulá,<br/>24090 San Francisco de Campeche, Camp.</p><a href="https://maps.app.goo.gl/TxX8kD3fZV8KpLeD9" target="_blank" rel="noopener noreferrer">Cómo llegar en Google Maps</a>');
 const observer=new ResizeObserver(()=>map.invalidateSize());observer.observe(element.current);
 return()=>{observer.disconnect();map.remove()};},[]);
 return <div className="map-shell"><div ref={element} className="church-map" role="region" aria-label="Mapa de ubicación de Aposento Alto"/>{failed&&<p className="map-status">No se pudo cargar parte del mapa. Puedes abrir la ubicación en Google Maps.</p>}</div>
}
function App(){
 const [menu,setMenu]=useState(false),[topic,setTopic]=useState<Topic|null>(null);
 const hero=useRef<HTMLElement>(null),reveal=useRef<HTMLDivElement>(null),grid=useRef<HTMLDivElement>(null),dialog=useRef<HTMLDialogElement>(null),lastFocus=useRef<HTMLElement|null>(null);
 useEffect(()=>{if(topic){lastFocus.current=document.activeElement as HTMLElement;dialog.current?.showModal()}else if(dialog.current?.open){dialog.current.close();lastFocus.current?.focus()}},[topic]);
 useEffect(()=>{document.body.style.overflow=menu||topic?'hidden':'';return()=>{document.body.style.overflow=''}},[menu,topic]);
 useEffect(()=>{const el=hero.current;if(!el)return;const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;let frame=0;let x=innerWidth*.66,y=innerHeight*.72,tx=x,ty=y;
 const move=(e:PointerEvent)=>{const rect=el.getBoundingClientRect();tx=e.clientX-rect.left;ty=e.clientY-rect.top};el.addEventListener('pointermove',move);
 const animate=()=>{x+=(tx-x)*.1;y+=(ty-y)*.1;if(reveal.current)reveal.current.style.maskImage=`radial-gradient(circle 260px at ${x}px ${y}px, white 0%, white 40%, rgba(255,255,255,.75) 60%, rgba(255,255,255,.4) 75%, rgba(255,255,255,.12) 88%, transparent 100%)`;if(grid.current)grid.current.style.transform=`translate(${(x/innerWidth-.5)*16}px,${(y/innerHeight-.5)*16}px)`;if(!reduced)frame=requestAnimationFrame(animate)};animate();return()=>{cancelAnimationFrame(frame);el.removeEventListener('pointermove',move)}},[]);
 const open=(t:Topic)=>{setMenu(false);setTopic(t)};
 const showSchedule=()=>{setMenu(false);setTimeout(()=>{document.getElementById('horarios')?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});document.getElementById('horarios-title')?.focus({preventScroll:true})},0)};
 return <main><section ref={hero} id="inicio" className="hero font-helvetica-neue">
 <div className="base-image"/><div className="shade"/><div ref={grid} className="grid"/>
 <div ref={reveal} className="reveal" aria-hidden="true"><div className="light-image"/></div><div className="grain"/>
 <header className="fixed top-0 left-0 w-full flex items-center justify-between z-50 header"><button className="brand flex items-center gap-3" aria-label="Aposento Alto, inicio" onClick={()=>{setTopic(null);setMenu(false);window.scrollTo({top:0,behavior:"smooth"})}}><Mark/></button>
 <nav className="liquid-glass desktop-nav" aria-label="Navegación principal">{(['Nosotros','Nuestra fe','Comunidad'] as Topic[]).map(t=><button key={t} onClick={()=>open(t)}>{t}</button>)}<button onClick={showSchedule}>Horarios</button></nav>
 <button className="liquid-glass welcome desktop-cta" onClick={()=>open('Bienvenido')}>Eres bienvenido <span className="small-cross">✧</span></button>
 <button className="liquid-glass hamburger" aria-label="Abrir menú" aria-expanded={menu} onClick={()=>{lastFocus.current=document.activeElement as HTMLElement;setMenu(true);setTimeout(()=>document.getElementById('close-menu')?.focus(),0)}}><i/><i/></button>
 </header>
 <section className="hero-content" aria-label="Bienvenido a Aposento Alto"><p className="eyebrow">UN LUGAR PARA CREER. UNA FAMILIA PARA PERTENECER.</p><h1><span>Aposento</span> <em>Alto</em></h1><p className="hero-copy">Encontramos esperanza en Jesús.<br/>Y un hogar al caminar juntos.</p><button className="primary-button" onClick={showSchedule}>Encuentra tu lugar <span>✧</span></button></section>
 <footer className="footer"><div className="footer-left"><span className="fine-cross">✝</span><span>FE QUE NOS UNE.<br/><b>AMOR QUE NOS MUEVE.</b></span></div><p className="verse">“Donde están dos o tres congregados en mi nombre,<br className="desktop-break"/> allí estoy yo en medio de ellos.”<span>MATEO 18:20</span></p><button className="schedule-link" onClick={showSchedule}>Conoce nuestros horarios<span className="scroll-line" aria-hidden="true"/></button></footer>
 </section>
 <section id="horarios" className="schedule-section" aria-labelledby="horarios-title">
 <div className="schedule-heading"><div><p className="eyebrow">NOS REUNIMOS PARA CRECER JUNTOS</p><h2 id="horarios-title" tabIndex={-1}>Conoce nuestros <em>horarios.</em></h2></div><p>Un momento para acercarnos a Dios.<br/>Un lugar para compartir la vida.</p></div>
 <div className="schedule-layout"><figure className="community-photo"><img src="/congregacion.png" alt="Congregación reunida en la iglesia Aposento Alto en San Francisco de Campeche" loading="lazy"/><figcaption><span>NUESTRA IGLESIA</span><p>Juntos somos <em>familia.</em></p><small>San Francisco de Campeche</small></figcaption></figure>
 <div className="schedule-list" aria-label="Horarios semanales">{schedule.map((item,index)=><div className="schedule-row" key={item.day}><span className="day-number" aria-hidden="true">0{index+1}</span><div className="meeting"><span>{item.day}</span><h3>{item.name}</h3></div><p className="meeting-time">{item.time}<span>{item.period}</span></p></div>)}<p className="schedule-welcome">Ven tal como eres. Aquí hay un lugar para ti.</p></div></div>
 <section className="location-section" aria-labelledby="location-title"><div className="location-icon" aria-hidden="true"><svg width="32" height="38" viewBox="0 0 32 38" fill="none"><path d="M29 15c0 10-13 20-13 20S3 25 3 15a13 13 0 1 1 26 0Z" stroke="currentColor" strokeWidth="1.4"/><circle cx="16" cy="15" r="4" stroke="currentColor" strokeWidth="1.4"/></svg></div><div className="location-copy"><p className="eyebrow">VEN A CONOCERNOS</p><h2 id="location-title">Aquí te <em>esperamos.</em></h2><p>C. 2a, Samulá (Ampliación), Samulá,<br/>24090 San Francisco de Campeche, Camp.</p></div><a className="primary-button maps-link" href="https://maps.app.goo.gl/TxX8kD3fZV8KpLeD9" target="_blank" rel="noopener noreferrer" aria-label="Abrir ubicación de Aposento Alto en Google Maps, nueva pestaña">Ver ubicación en Google Maps</a></section>
 <ChurchMap/>
 <div className="site-footer"><Mark/><p>APOSENTO ALTO<span>Una iglesia. Una familia.</span></p><button onClick={()=>window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})}>Volver al inicio</button></div>
 </section>
 {menu&&<div className="mobile-menu" role="dialog" aria-modal="true" aria-label="Menú de navegación" onKeyDown={e=>{if(e.key==='Escape'){setMenu(false);lastFocus.current?.focus()}if(e.key==='Tab'){const buttons=Array.from(e.currentTarget.querySelectorAll('button'));const first=buttons[0],last=buttons[buttons.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}}}><button id="close-menu" className="liquid-glass close" aria-label="Cerrar menú" onClick={()=>{setMenu(false);lastFocus.current?.focus()}}>×</button><Mark/>{(Object.keys(content) as Topic[]).map((t,i)=><button style={{animationDelay:`${100+i*60}ms`}} key={t} onClick={()=>open(t)}>{t==='Bienvenido'?'Eres bienvenido':t}</button>)}<button style={{animationDelay:"340ms"}} onClick={showSchedule}>Horarios</button><p>APOSENTO ALTO</p></div>}
 <dialog ref={dialog} className="info-dialog" aria-label={topic??"Información de la iglesia"} onCancel={()=>setTopic(null)} onClick={e=>{if(e.target===e.currentTarget)setTopic(null)}}>{topic&&<article><button className="close liquid-glass" aria-label="Cerrar" onClick={()=>setTopic(null)}>×</button><Mark/><p className="eyebrow">{content[topic].label}</p><h2>{content[topic].title}</h2><p className="info-copy">{content[topic].text}</p><p className="info-foot">{content[topic].foot}</p><button className="primary-button" onClick={()=>setTopic(null)}>Volver al inicio</button></article>}</dialog>
 </main>
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
