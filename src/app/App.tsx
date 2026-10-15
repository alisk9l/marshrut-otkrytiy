import {Component,lazy,Suspense,useEffect,useState,type ReactNode} from 'react';
import {Compass} from 'lucide-react';
import {Footer,Header,LinkButton} from '../components/UI';
import {locations} from '../data/locations';
import {HomePage} from '../features/home/HomePage';
import {MapPage} from '../features/map/MapPage';
import {LocationListPage,LocationPage} from '../features/locations/LocationPages';
import {AboutPage,HowToPlayPage,SourcesPage} from '../features/info/InfoPages';
import {PassportPage,RewardPage} from '../features/passport/PassportPages';
import {useProgress} from '../features/progress/ProgressProvider';
import {QuestMusic} from '../components/QuestMusic';
const QuestPage=lazy(()=>import('../features/quests/QuestPage'));
const CertificatePage=lazy(()=>import('../features/certificate/CertificatePage'));
function currentRoute(){return window.location.hash.slice(1)||'/';}
class PageBoundary extends Component<{children:ReactNode},{failed:boolean}>{state={failed:false};static getDerivedStateFromError(){return {failed:true};}render(){return this.state.failed?<section className="empty-state"><h1>Не удалось открыть экран</h1><p>Прогресс остаётся в браузере. Попробуй обновить страницу.</p><button className="button" onClick={()=>window.location.reload()}>Обновить страницу</button></section>:this.props.children;}}
export default function App(){const [route,setRoute]=useState(currentRoute);const {notice}=useProgress();useEffect(()=>{const change=()=>setRoute(currentRoute());window.addEventListener('hashchange',change);return()=>window.removeEventListener('hashchange',change);},[]);useEffect(()=>{window.scrollTo({top:0});document.title='Маршрут открытий — '+(route==='/'?'игровая экспедиция':route==='/passport'?'паспорт путешественника':route==='/map'?'карта маршрута':'твоё приключение');},[route]);
 let page:ReactNode;if(route==='/')page=<HomePage/>;else if(route==='/map')page=<MapPage/>;else if(route==='/locations')page=<LocationListPage/>;else if(route==='/passport')page=<PassportPage/>;else if(route==='/certificate')page=<CertificatePage/>;else if(route==='/how-to-play')page=<HowToPlayPage/>;else if(route==='/about')page=<AboutPage/>;else if(route==='/sources')page=<SourcesPage/>;else if(route.startsWith('/quests/'))page=<QuestPage key={route} id={route.slice(8)}/>;else if(route.startsWith('/locations/')||route.startsWith('/reward/')){const id=route.split('/')[2];const location=locations.find(l=>l.id===id);page=location?(route.startsWith('/reward/')?<RewardPage location={location}/>:<LocationPage key={id} location={location}/>):null;}
 if(!page)page=<section className="empty-state"><Compass size={50}/><h1>Здесь пока нет тропинки</h1><p>Вернись на карту — пять открытий уже ждут.</p><LinkButton to="/map">К карте</LinkButton></section>;
 return <><a className="skip-link" href="#main-content" onClick={e=>{e.preventDefault();const main=document.getElementById('main-content');main?.focus();main?.scrollIntoView();}}>К содержимому</a><Header route={route}/>{notice&&<div className="storage-notice" role="status">{notice}</div>}<main id="main-content" tabIndex={-1}><QuestMusic route={route}/><PageBoundary key={route}><Suspense fallback={<div className="loading-state" role="status"><Compass className="loading-compass" size={38}/>Открываем следующую историю…</div>}>{page}</Suspense></PageBoundary></main><Footer/></>;
}
