import rawCredits from '../../public/credits.json';
import type {PhotoCredit} from './types';
export const credits=rawCredits as PhotoCredit[];
export const photoCredit=(id:number)=>credits.find(p=>p.id===id)!;
export const photoUrl=(id:number,small=false)=>`${import.meta.env.BASE_URL}photos/p${String(id).padStart(3,'0')}${small?'-small':''}.webp`;
export const sources={
 pushkinLiterature:{title:'Культура.РФ — роман в стихах',url:'https://www.culture.ru/s/slovo-dnya/roman-v-stihah/'},
 sculpture:{title:'V&A — коллекция скульптуры',url:'https://www.vam.ac.uk/collections/sculpture'},
 perspective:{title:'National Gallery — перспектива',url:'https://www.nationalgallery.org.uk/paintings/glossary/perspective'},
 composition:{title:'National Gallery — композиция',url:'https://www.nationalgallery.org.uk/paintings/glossary/composition'},
 plantSeeds:{title:'Kew — что такое семя',url:'https://www.kew.org/read-and-watch/what-is-a-seed'},
 ferns:{title:'Kew — папоротники Adiantum',url:'https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A328214-2/general-information'},
 seedCollection:{title:'Kew — семенная коллекция',url:'https://www.kew.org/science/collections-and-resources/collections/seed-collection'},
 gardenResearch:{title:'Донецкий ботанический сад — официальный сайт',url:'https://donbotsad.ru/история-дбс/'},
 garden:{title:'Фотографии Ботанического сада',url:'https://commons.wikimedia.org/wiki/Category:Donetsk_botanical_garden'},
 monument:{title:'Фотографии памятника Пушкину',url:'https://commons.wikimedia.org/wiki/Category:Bust_of_Pushkin_on_Pushkin_boulevard_in_Donetsk'},
 museum:{title:'Фотографии художественного музея',url:'https://commons.wikimedia.org/wiki/Category:Donetsk_Regional_Museum_of_Art_(Donetsk)'},
 park:{title:'Фотографии Парка кованых фигур',url:'https://commons.wikimedia.org/wiki/Category:Forged_figures_park_in_Donetsk'},
 steppe:{title:'Фотография цветения пионов в мае',url:'https://commons.wikimedia.org/wiki/File:Khomutovsky_Step_04.jpg'},
 stillLife:{title:'Натюрморт — словарь National Gallery',url:'https://www.nationalgallery.org.uk/paintings/glossary/still-lives'}
};
