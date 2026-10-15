import {initialProgress,parseProgress} from './progress';
import type {Progress} from '../../data/types';
export const storageKey='marshrut-otkrytiy:progress:v1';
export function loadProgress():{progress:Progress;persistence:'local'|'memory';notice?:string}{
 try{const raw=localStorage.getItem(storageKey);if(!raw)return {progress:initialProgress(),persistence:'local'};const progress=parseProgress(raw);if(progress)return {progress,persistence:'local'};localStorage.removeItem(storageKey);return {progress:initialProgress(),persistence:'local',notice:'Сохранение не удалось прочитать. Начат новый маршрут.'};}
 catch{return {progress:initialProgress(),persistence:'memory',notice:'Браузер не разрешает сохранение. Прогресс доступен до закрытия этой вкладки.'};}
}
export function saveProgress(progress:Progress):boolean{try{localStorage.setItem(storageKey,JSON.stringify(progress));return true;}catch{return false;}}
export function resetProgress():boolean{try{localStorage.removeItem(storageKey);return true;}catch{return false;}}
