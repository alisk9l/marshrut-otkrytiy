import {BookOpen} from 'lucide-react';
import type {LocationId} from '../data/types';
import {lessonNotes} from '../data/learning';
import {SourceLink} from './UI';
export function LearningNotes({locationId,compact=false}:{locationId:LocationId;compact?:boolean}){
 return <details className={'learning-notes '+(compact?'quest-theory':'location-theory')}><summary><BookOpen size={20}/>{compact?<span>Изучить теорию · 3 раздела</span>:<h2>Разберёмся перед заданием</h2>}<span className="learning-toggle">Открыть</span></summary><div className="learning-content">{lessonNotes[locationId].map(note=><article key={note.title}><h3>{note.title}</h3>{note.paragraphs.map(p=><p key={p}>{p}</p>)}<SourceLink id={note.sourceId}/></article>)}</div></details>;
}
