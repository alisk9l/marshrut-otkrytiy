import {useState,type ReactNode} from 'react';
import {Check,Lightbulb,Search,ZoomIn,ZoomOut} from 'lucide-react';
import {Eyebrow,Photo,PhotoCreditLine,ProgressBar} from '../../components/UI';
import {searchTargets} from '../../data/quests';
import {photoUrl} from '../../data/photos';
import {LearningNotes} from '../../components/LearningNotes';
import type {QuestId,QuestProgress} from '../../data/types';
import {useProgress} from '../progress/ProgressProvider';
import {evaluateSearchChoice,nextSearchTarget,searchOrder,searchScore} from './searchRules';


function PlantPhoto({target,onError,onLoad,revision=0}:{target:typeof searchTargets[number];onError?:()=>void;onLoad?:()=>void;revision?:number}){
 return <span className="botanical-photo"><img src={photoUrl(target.photoId)+'?crop='+revision} alt="" draggable={false} style={{left:(50-target.sourceX*1000)+'%',top:(50-target.sourceY*1000)+'%'}} onError={onError} onLoad={onLoad}/></span>;
}

export function ObjectSearch({id,finish}:{id:QuestId;finish:(disabled:boolean)=>ReactNode}){
 const {progress,updateQuest}=useProgress();const saved=progress.questProgress[id];
 type SearchState=Extract<QuestProgress,{kind:'search'}>;
 const [replay,setReplay]=useState<SearchState|null>(null);const earned=progress.completedQuestIds.includes(id);
 const state=replay??(saved?.kind==='search'?saved:{kind:'search' as const,foundTargetIds:[],mistakes:0,hintsUsed:0});
 const commit=(next:SearchState)=>{if(earned)setReplay(next);else updateQuest(id,next);};
 const found=state.foundTargetIds,mistakes=state.mistakes??0,hintsUsed=state.hintsUsed??0;
 const activeId=nextSearchTarget(found),active=searchTargets.find(t=>t.id===activeId);
 const [zoom,setZoom]=useState(false),[photoError,setPhotoError]=useState(false),[hint,setHint]=useState(''),[pulse,setPulse]=useState('');
 const [itemErrors,setItemErrors]=useState<string[]>([]),[itemRevision,setItemRevision]=useState(0);
 const blocked=photoError||itemErrors.length>0;
 const [message,setMessage]=useState('Прочитай загадку. Найди спрятанный фотофрагмент и нажми на неё.');
 const [lastFound,setLastFound]=useState<typeof searchTargets[number]|null>(null);
 const score=searchScore(found.length,mistakes,hintsUsed);
 function miss(){if(!active)return;commit({...state,mistakes:mistakes+1});setMessage('Это не тот след. Сравни цвет и форму с загадкой — попробуй ещё раз.');}
 function choose(target:typeof searchTargets[number]){
  const result=evaluateSearchChoice(activeId,target.id,found);
  if(result==='already-found'){setMessage('Этот след уже разгадан. Сейчас ищем другой фотофрагмент.');return;}
  if(result==='miss'){miss();return;}
  commit({...state,foundTargetIds:[...found,target.id]});setLastFound(target);setMessage('Верно! '+target.label+'. Открыта следующая загадка.');setHint('');setPulse('');
 }
 function help(){if(!active||hintsUsed>=3)return;commit({...state,hintsUsed:hintsUsed+1});setHint(active.hint);setMessage('Подсказка помогла сузить поиск. За неё вычитается 25 очков.');if(hint){setPulse(active.id);window.setTimeout(()=>setPulse(''),3500);}}
 return <section className="search-page hunt-page"><div className="section-heading"><div><Eyebrow>Ботанический сад · Дневник исследователя</Eyebrow><h1>Дело о пяти растениях</h1><p>Найди пять спрятанных фотофрагментов растений. Каждый совпадает с образцом в дневнике.</p></div><span className="tag">Найдено {found.length} из 5</span></div>
 <LearningNotes locationId="garden" compact/><div className="search-layout"><div><div className="hunt-toolbar"><span><Search size={17}/>Внимание к деталям</span><button className="text-button" onClick={()=>setZoom(!zoom)} aria-pressed={zoom}>{zoom?<ZoomOut size={17}/>:<ZoomIn size={17}/>} {zoom?'Обычный масштаб':'Увеличить фото'}</button></div><div className="hunt-photo-window"><div className="search-scene" style={{width:zoom?'200%':'100%'}} onClick={e=>{if(e.target===e.currentTarget||e.target instanceof HTMLImageElement)miss();}}><Photo id={13} alt="Настоящий цветник с пятью спрятанными фотофрагментами растений. Tab — выбор находки, Enter — проверка." priority onError={()=>setPhotoError(true)} onLoad={()=>setPhotoError(false)}/>{searchTargets.map((target,i)=><button key={target.id} data-target-id={target.id} className={'search-target '+(found.includes(target.id)?'found':'')+' '+(pulse===target.id?'hinted':'')} style={{left:target.x*100+'%',top:target.y*100+'%',width:target.radius*200+'%',height:target.radius*200+'%'}} aria-label={found.includes(target.id)?'Найдено: '+target.label:'Исследовать область '+(i+1)} onClick={e=>{e.stopPropagation();choose(target);}} disabled={blocked}><PlantPhoto target={target} revision={itemRevision} onError={()=>setItemErrors(prev=>[...new Set([...prev,target.id])])} onLoad={()=>setItemErrors(prev=>prev.filter(id=>id!==target.id))}/>{found.includes(target.id)&&<Check size={23}/>}</button>)}</div></div><PhotoCreditLine id={13}/>{lastFound&&<div className="field-discovery" role="status"><span className="discovery-icon"><Check size={21}/></span><div><small>ЗАПИСЬ В ДНЕВНИК</small><h3>{lastFound.label}</h3><p>{lastFound.observation}</p></div></div>}</div>
 <aside className="search-collection hunt-journal"><Eyebrow>Дневник наблюдений</Eyebrow>{active?<><p className="hunt-stage">Загадка {found.length+1} из 5</p><div className="hunt-reference"><PlantPhoto target={active} revision={itemRevision}/><div><small>ИЩИ ЭТОТ ОБРАЗЕЦ</small><h2>{active.riddleTitle}</h2></div></div><p className="hunt-riddle">{active.riddle}</p></>:<><h2>Расследование завершено!</h2><p className="hunt-riddle">Пять разных следов найдены. Твой взгляд стал внимательнее — забери штамп сада.</p></>}<div className="hunt-stats"><strong>{score} очков</strong><span>Ошибки: {mistakes}</span><span>Подсказки: {hintsUsed}/3</span></div><ProgressBar value={found.length*20}/><ol className="hunt-trail">{searchOrder.map((targetId,i)=>{const target=searchTargets.find(t=>t.id===targetId)!;const done=found.includes(targetId);return <li key={targetId} className={(done?'done ':'')+(targetId===activeId?'current':'')}><span>{done?<Check size={16}/>:String(i+1).padStart(2,'0')}</span><b>{done?target.label:targetId===activeId?'Текущий след':'След ещё впереди'}</b></li>;})}</ol><p className="search-message" role="status">{message}</p>{hint&&<div className="hunt-hint" role="status"><Lightbulb size={17}/><p>{hint}</p></div>}<button className="button secondary full" onClick={help} disabled={!active||hintsUsed>=3||blocked}><Lightbulb size={17}/>Подсказка · −25 очков</button>{itemErrors.length>0&&<div className="hunt-image-error" role="alert"><p>Не загрузился фотофрагмент. Поиск продолжится после повторной загрузки.</p><button className="button secondary" onClick={()=>setItemRevision(r=>r+1)}>Загрузить фотофрагменты снова</button></div>}{finish(blocked||!!active)}{earned&&<button className="button secondary full" onClick={()=>{setReplay({kind:'search',foundTargetIds:[],mistakes:0,hintsUsed:0});setLastFound(null);setHint('');setPulse('');setMessage('Новое расследование началось. Сохранённый результат остаётся в маршруте.');}}>Повторить расследование</button>}<p className="small-muted">+100 за находку · −10 за ошибку. За расследование доступны 3 подсказки. Очки не мешают получить штамп.</p>{earned&&<p className="small-muted">Повторная игра не меняет сохранённый результат. Для нового штампа нужны оба мини-квеста.</p>}<p className="small-muted">На телефоне увеличь кадр и перемещай его. С клавиатуры: Tab — находка, Enter — проверить. Цветы на исходном фото не являются игровыми целями — ищи добавленные фотофрагменты.</p></aside></div></section>;
}

