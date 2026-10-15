import type {CSSProperties} from 'react';

export function Logo({size=48,className=''}:{size?:number;className?:string}){
 return <img src={`${import.meta.env.BASE_URL}logo.png`} className={`project-logo ${className}`} alt="" aria-hidden="true" width={136} height={132} style={{'--logo-size':`${size}px`} as CSSProperties}/>;
}
