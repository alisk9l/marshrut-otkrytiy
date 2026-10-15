import type {LocationId} from './types';
export const locationMusic:Partial<Record<LocationId,{title:string;file:string;volume:number}>>={
 garden:{title:'Ботанический сад',file:'garden.mp3',volume:1},
 monument:{title:'Памятник Пушкину',file:'monument.mp3',volume:.35},
 museum:{title:'Художественный музей',file:'museum.mp3',volume:1},
 steppe:{title:'Хомутовская степь',file:'steppe.mp3',volume:.35}
};
