import {createContext,useContext,useEffect,useState,type ReactNode} from 'react';
import type {LocationId,Progress,QuestId,QuestProgress} from '../../data/types';
import {completeQuest,initialProgress} from './progress';
import {loadProgress,resetProgress,saveProgress} from './storage';
type Store={progress:Progress;notice:string;visit:(id:LocationId)=>void;updateQuest:(id:QuestId,state:QuestProgress)=>void;award:(id:QuestId)=>void;reset:()=>void};
const Context=createContext<Store|null>(null);
export function ProgressProvider({children}:{children:ReactNode}){
 const [loaded]=useState(loadProgress);const [progress,setProgress]=useState(loaded.progress);const [notice,setNotice]=useState(loaded.notice??'');
 useEffect(()=>{if(!saveProgress(progress))setNotice('Не удалось сохранить прогресс. Не закрывай эту вкладку, пока проходишь маршрут.');},[progress]);
 const visit=(id:LocationId)=>setProgress(p=>p.lastLocationId===id&&p.visitedLocationIds.includes(id)?p:{...p,lastLocationId:id,visitedLocationIds:[...new Set([...p.visitedLocationIds,id])],updatedAt:new Date().toISOString()});
 const updateQuest=(id:QuestId,state:QuestProgress)=>setProgress(p=>({...p,questProgress:{...p.questProgress,[id]:state},updatedAt:new Date().toISOString()}));
 const award=(id:QuestId)=>setProgress(p=>completeQuest(p,id,new Date().toISOString()));
 const reset=()=>{resetProgress();setProgress(initialProgress());};
 return <Context.Provider value={{progress,notice,visit,updateQuest,award,reset}}>{children}</Context.Provider>;
}
export function useProgress(){const value=useContext(Context);if(!value)throw Error('ProgressProvider required');return value;}
