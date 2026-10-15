import {useEffect,useRef,useState} from 'react';
import {LoaderCircle,Volume2,VolumeX} from 'lucide-react';
import {locationMusic} from '../data/music';
import {questLocations} from '../data/questCatalog';
import type {LocationId,QuestId} from '../data/types';

function LocationMusic({location,title,file,volume}:{location:LocationId;title:string;file:string;volume:number}){
 const media=useRef<HTMLAudioElement>(null);
 const wanted=useRef(false),revision=useRef(0);
 const [status,setStatus]=useState<'idle'|'loading'|'playing'|'error'>('idle');
 const active=status==='loading'||status==='playing';
 useEffect(()=>{
  const audio=media.current!;audio.volume=volume;
  return()=>{wanted.current=false;revision.current++;audio.pause();audio.removeAttribute('src');audio.load();};
 },[volume]);
 async function toggle(){
  const audio=media.current;if(!audio)return;
  if(wanted.current){wanted.current=false;revision.current++;audio.pause();setStatus('idle');return;}
  wanted.current=true;const request=++revision.current;setStatus('loading');
  // No src is assigned until an explicit user gesture: MP3 never delays the demo.
  if(!audio.getAttribute('src'))audio.src=import.meta.env.BASE_URL+'audio/'+file;
  else if(audio.error)audio.load();
  try{
   await audio.play();
   if(request===revision.current&&wanted.current)setStatus('playing');
   else if(!wanted.current)audio.pause();
  }catch{
   if(request===revision.current&&wanted.current){wanted.current=false;setStatus('error');}
  }
 }
 return <div className="quest-music-strip"><div className="quest-music-control"><button type="button" className={'quest-music-button '+(active?'is-on':'')} aria-pressed={active} aria-label={(active?'Выключить музыку: ':status==='error'?'Повторить включение музыки: ':'Включить музыку: ')+title} onClick={toggle}>
  {status==='loading'?<LoaderCircle className="music-loading-icon" size={19} aria-hidden="true"/>:active?<Volume2 size={19} aria-hidden="true"/>:<VolumeX size={19} aria-hidden="true"/>}<span>{status==='loading'?'Загрузка…':'Музыка'}</span>
 </button>{status==='error'&&<p className="quest-music-error" role="alert">Не удалось включить музыку. Попробуй ещё раз.</p>}</div><audio ref={media} preload="none" loop playsInline data-music-location={location} aria-hidden="true" onPlaying={()=>{if(wanted.current)setStatus('playing');else media.current?.pause();}} onWaiting={()=>{if(wanted.current)setStatus('loading');}} onPause={()=>{if(media.current?.paused&&wanted.current){wanted.current=false;revision.current++;setStatus('idle');}}} onError={()=>{if(wanted.current){wanted.current=false;revision.current++;setStatus('error');}}}/></div>;
}
/** This stays outside the keyed quest page, so a location's two games share one player. */
export function QuestMusic({route}:{route:string}){
 const id=route.startsWith('/quests/')?route.slice(8):'';
 if(!Object.hasOwn(questLocations,id))return null;
 const location=questLocations[id as QuestId],track=locationMusic[location];
 return track?<LocationMusic key={location} location={location} title={track.title} file={track.file} volume={track.volume}/>:null;
}
