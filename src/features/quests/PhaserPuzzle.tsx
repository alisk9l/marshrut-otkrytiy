import {useEffect,useRef,useState} from 'react';
import {photoUrl} from '../../data/photos';
import {useProgress} from '../progress/ProgressProvider';
import {saveProgress} from '../progress/storage';
import type {PuzzleSceneHandle} from './phaserPuzzleScene';

type Props={tiles:number[];selected:number|null;onSelect:(slot:number)=>void;onSwap:(from:number,to:number)=>void;onReadyChange:(ready:boolean)=>void};
export function PhaserPuzzle(props:Props){
 const {progress}=useProgress();
 const host=useRef<HTMLDivElement>(null);
 const engine=useRef<PuzzleSceneHandle|null>(null);
 const moduleFailed=useRef(false);
 const latest=useRef(props);latest.current=props;
 const [status,setStatus]=useState<'loading'|'ready'|'error'>('loading');
 const [attempt,setAttempt]=useState(0);
 const [retryWarning,setRetryWarning]=useState('');
 function retry(){
  if(!moduleFailed.current){setAttempt(a=>a+1);return;}
  // Browsers cache a rejected module import. Reload only after saving current progress.
  if(saveProgress(progress))window.location.reload();
  else setRetryWarning('Не удалось сохранить прогресс. Перезагрузка отменена, чтобы не потерять твои штампы.');
 }
 useEffect(()=>{
  let cancelled=false;
  moduleFailed.current=false;setStatus('loading');latest.current.onReadyChange(false);
  import('./phaserPuzzleScene').then(({startPhaserPuzzle})=>{
   if(cancelled||!host.current)return;
   engine.current=startPhaserPuzzle(host.current,{
    photoUrl:photoUrl(104)+(attempt?`?retry=${attempt}`:''),
    onSelect:slot=>latest.current.onSelect(slot),
    onSwap:(from,to)=>latest.current.onSwap(from,to),
    onStatus:ready=>{if(!cancelled){setStatus(ready?'ready':'error');latest.current.onReadyChange(ready);}}
   });
   engine.current.update(latest.current.tiles,latest.current.selected);
  }).catch(()=>{if(!cancelled){moduleFailed.current=true;setStatus('error');latest.current.onReadyChange(false);}});
  return()=>{cancelled=true;engine.current?.destroy();engine.current=null;};
 },[attempt]);
 useEffect(()=>{engine.current?.update(props.tiles,props.selected);},[props.tiles,props.selected]);
 return <div className="phaser-puzzle" data-engine="phaser" data-ready={status==='ready'} aria-busy={status==='loading'}>
  <div ref={host} className="phaser-puzzle-canvas" aria-hidden="true"/>
  <div className="puzzle-keyboard" role="group" aria-label="Пазл из девяти фрагментов: выбирай две плитки клавишей Enter">
   {props.tiles.map((tile,slot)=><button key={slot} className={'puzzle-tile '+(props.selected===slot?'selected':'')} data-tile={tile} data-slot={slot} aria-label={`Фрагмент ${tile+1}, место ${slot+1}`} aria-pressed={props.selected===slot} disabled={status!=='ready'} onClick={()=>engine.current?.select(slot)}/>) }
  </div>
  {status==='loading'&&<div className="phaser-puzzle-message" role="status">Собираем игровое поле…</div>}
  {status==='error'&&<div className="phaser-puzzle-message photo-error" role="alert"><p>Фото или игровое поле не загрузилось</p><button className="text-button" onClick={retry}>Попробовать снова</button>{retryWarning&&<p>{retryWarning}</p>}</div>}
 </div>;
}
