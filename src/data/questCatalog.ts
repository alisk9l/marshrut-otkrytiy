import type {LocationId,QuestId,SecondaryQuestId} from './types';
export const locationQuests:Record<LocationId,readonly [QuestId,SecondaryQuestId]>={
 garden:['garden-search','garden-lab'],monument:['monument-quiz','monument-details'],museum:['museum-quiz','museum-pairs'],'forged-park':['forged-puzzle','forged-memory'],steppe:['steppe-quiz','steppe-fragments']
};
export const questTitles:Record<QuestId,string>={
 'garden-search':'Дело о пяти растениях','garden-lab':'Ботаническая лаборатория',
 'monument-quiz':'История в деталях','monument-details':'Прочитай памятник',
 'museum-quiz':'Искусство замечать','museum-pairs':'Словарь куратора',
 'forged-puzzle':'Собери композицию','forged-memory':'Память мастера',
 'steppe-quiz':'Дневник степного наблюдателя','steppe-fragments':'Узнай пейзаж по фрагменту'
};
export const activityTaskIds:Record<SecondaryQuestId,readonly string[]>={
 'garden-lab':['seed','fruit','dry-fruit','cone','spore','food'],
 'monument-details':['portrait','plinth','column'],
 'museum-pairs':['still-life','perspective','composition','light'],
 'forged-memory':['arch','clock','square'],
 'steppe-fragments':['wide','flowers','stone']
};
export const isActivityQuest=(id:QuestId):id is SecondaryQuestId=>id in activityTaskIds;
export const questLocations=Object.fromEntries(Object.entries(locationQuests).flatMap(([location,ids])=>ids.map(id=>[id,location]))) as Record<QuestId,LocationId>;
