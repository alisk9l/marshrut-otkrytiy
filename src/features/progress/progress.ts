import {locationIds,type LocationId,type Progress,type QuestId,type QuestProgress} from '../../data/types';
import {activityTaskIds,isActivityQuest,locationQuests,questLocations} from '../../data/questCatalog';
import {isSolvedPuzzle,isValidPuzzle} from '../quests/questRules';
export {questLocations};
export const questIds=Object.keys(questLocations) as QuestId[];
export const searchIds=['plant-1','plant-2','plant-3','plant-4','plant-5'];
const primaryIds=locationIds.map(id=>locationQuests[id][0]);
const questionIds=(id:QuestId)=>[1,2,3].map(i=>id.replace('-quiz','')+'-'+i);
const distinctKnown=(value:unknown,known:readonly string[]):value is string[]=>Array.isArray(value)&&value.every(v=>typeof v==='string'&&known.includes(v))&&new Set(value).size===value.length;
export const initialProgress=():Progress=>{const date=new Date().toISOString();return {schemaVersion:1,contentVersion:2,legacyStampLocationIds:[],startedAt:date,updatedAt:date,completedAt:null,lastLocationId:null,visitedLocationIds:[],completedQuestIds:[],stampLocationIds:[],questProgress:{}};};
export function isValidQuestProgress(id:QuestId,state:unknown):state is QuestProgress{
 if(!state||typeof state!=='object')return false;const q=state as QuestProgress;
 if(isActivityQuest(id))return q.kind==='activity'&&distinctKnown(q.solvedTaskIds,activityTaskIds[id]);
 if(id==='garden-search')return q.kind==='search'&&distinctKnown(q.foundTargetIds,searchIds)&&[q.mistakes,q.hintsUsed].every(n=>n===undefined||(Number.isInteger(n)&&n>=0))&&(q.hintsUsed===undefined||q.hintsUsed<=3);
 if(id==='forged-puzzle')return q.kind==='puzzle'&&isValidPuzzle(q.tileOrder);
 return q.kind==='quiz'&&distinctKnown(q.solvedQuestionIds,questionIds(id))&&Number.isInteger(q.currentQuestionIndex)&&q.currentQuestionIndex>=0&&q.currentQuestionIndex<3;
}
export function isQuestComplete(id:QuestId,state:QuestProgress|undefined):boolean{
 if(!isValidQuestProgress(id,state))return false;
 if(state.kind==='activity')return isActivityQuest(id)&&state.solvedTaskIds.length===activityTaskIds[id].length;
 if(state.kind==='search')return state.foundTargetIds.length===5;
 if(state.kind==='puzzle')return isSolvedPuzzle(state.tileOrder);
 return state.solvedQuestionIds.length===3;
}
export const isLocationComplete=(p:Progress,id:LocationId):boolean=>p.legacyStampLocationIds.includes(id)||locationQuests[id].every(q=>p.completedQuestIds.includes(q)&&isQuestComplete(q,p.questProgress[q]));
export const getCompletionPercent=(p:Progress):number=>new Set(p.stampLocationIds.filter(id=>locationIds.includes(id))).size*20;
export const canIssueCertificate=(p:Progress):boolean=>locationIds.every(id=>p.stampLocationIds.includes(id)&&isLocationComplete(p,id));
export function completeQuest(p:Progress,id:QuestId,date:string):Progress{
 if(!isQuestComplete(id,p.questProgress[id])||p.completedQuestIds.includes(id))return p;
 const next={...p,updatedAt:date,completedQuestIds:[...p.completedQuestIds,id]};
 const location=questLocations[id];
 if(isLocationComplete(next,location)&&!next.stampLocationIds.includes(location))next.stampLocationIds=[...next.stampLocationIds,location];
 if(canIssueCertificate(next))next.completedAt=p.completedAt??date;
 return next;
}
/** Preserve verified old awards without claiming newly added activities were played. */
export function parseProgress(raw:string|null):Progress|null{
 try{
  if(!raw)return null;const data=JSON.parse(raw);
  if(!data||data.schemaVersion!==1||![1,2].includes(data.contentVersion))return null;
  const old=data.contentVersion===1;
  const p={...data,contentVersion:2,legacyStampLocationIds:old?data.stampLocationIds:data.legacyStampLocationIds} as Progress;
  if(typeof p.startedAt!=='string'||!Number.isFinite(Date.parse(p.startedAt))||typeof p.updatedAt!=='string'||!Number.isFinite(Date.parse(p.updatedAt)))return null;
  if(p.completedAt!==null&&(typeof p.completedAt!=='string'||!Number.isFinite(Date.parse(p.completedAt))))return null;
  if(p.lastLocationId!==null&&!locationIds.includes(p.lastLocationId))return null;
  if(!distinctKnown(p.visitedLocationIds,locationIds)||!distinctKnown(p.stampLocationIds,locationIds)||!distinctKnown(p.legacyStampLocationIds,locationIds)||!distinctKnown(p.completedQuestIds,old?primaryIds:questIds))return null;
  if(!p.questProgress||typeof p.questProgress!=='object'||Array.isArray(p.questProgress))return null;
  for(const [id,state] of Object.entries(p.questProgress))if(!(old?primaryIds:questIds).includes(id as QuestId)||!isValidQuestProgress(id as QuestId,state))return null;
  if(p.completedQuestIds.some(id=>!isQuestComplete(id,p.questProgress[id])))return null;
  if(old&&(p.stampLocationIds.length!==p.completedQuestIds.length||p.completedQuestIds.some(q=>!p.stampLocationIds.includes(questLocations[q]))))return null;
  if(p.legacyStampLocationIds.some(id=>!p.stampLocationIds.includes(id)||!p.completedQuestIds.includes(locationQuests[id][0])))return null;
  if(p.stampLocationIds.some(id=>!isLocationComplete(p,id)))return null;
  if(locationIds.some(id=>isLocationComplete(p,id)&&!p.stampLocationIds.includes(id)))return null;
  if((p.completedAt!==null)!==canIssueCertificate(p))return null;
  return p;
 }catch{return null;}
}
