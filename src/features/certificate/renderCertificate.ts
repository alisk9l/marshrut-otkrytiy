import type {LocationId} from '../../data/types';
export function downloadBlob(blob:Blob,filename:string){const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(url),10000);}
export function canvasBlob(canvas:HTMLCanvasElement):Promise<Blob>{return new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(Error('PNG не удалось создать')),'image/png'));}
export async function renderCertificate(input:{name:string;completedAt:string;stampLocationIds:LocationId[]}):Promise<Blob>{
 await document.fonts.ready;const canvas=document.createElement('canvas');canvas.width=1600;canvas.height=1000;const ctx=canvas.getContext('2d');if(!ctx)throw Error('Графика недоступна');
 ctx.fillStyle='#f7f3e9';ctx.fillRect(0,0,1600,1000);ctx.strokeStyle='#234c3a';ctx.lineWidth=2;ctx.strokeRect(38,38,1524,924);ctx.strokeRect(50,50,1500,900);
 ctx.textAlign='center';ctx.fillStyle='#234c3a';ctx.font='600 28px Manrope';ctx.fillText('МАРШРУТ ОТКРЫТИЙ',800,145);
 const logo=new Image();logo.src=`${import.meta.env.BASE_URL}logo.png`;await logo.decode();ctx.drawImage(logo,744,186,112,112*132/136);
 ctx.font='700 65px Manrope';ctx.fillText('Сертификат путешественника',800,380);
 const name=input.name.trim().slice(0,40)||'Путешественник';let size=68;ctx.font=`600 ${size}px Manrope`;while(ctx.measureText(name).width>1320&&size>24){size-=2;ctx.font=`600 ${size}px Manrope`;}ctx.fillStyle='#c15a28';ctx.fillText(name,800,510);
 ctx.fillStyle='#234c3a';ctx.font='400 27px Manrope';ctx.fillText('Исследовал пять мест и собрал все штампы маршрута',800,580);
 const labels=['Сад','История','Музей','Ремёсла','Степь'];for(let i=0;i<5;i++){const x=480+i*160;ctx.beginPath();ctx.arc(x,720,52,0,Math.PI*2);ctx.stroke();ctx.font='600 30px Manrope';ctx.fillText('0'+(i+1),x,730);ctx.font='400 18px Manrope';ctx.fillText(labels[i],x,800);}
 ctx.font='400 22px Manrope';ctx.fillText(new Date(input.completedAt).toLocaleDateString('ru-RU')+' · 5 из 5 локаций',800,900);
 return canvasBlob(canvas);
}
