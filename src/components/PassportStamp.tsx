import {useId} from 'react';
import type {Location} from '../data/types';
const drawings:Record<string,string>={
 garden:'M38 112H142M48 111V79H132V111M62 110V74Q90 30 118 74V110M62 75H118M90 51V111M77 58V111M103 58V111M49 83H62M118 83H132M53 96H62M118 96H128M33 113V91M30 95Q20 82 31 77Q42 84 33 95M148 113V88M147 92Q137 78 149 72Q162 81 147 92',
 monument:'M74 65Q72 46 88 43Q110 41 107 65L100 78L101 83Q117 86 123 98H60Q66 86 80 83V78ZM77 61L79 54L94 51L104 57M91 68L101 66M84 75Q91 80 98 73M77 101H107V120H77ZM68 122H116M60 127H123M45 128V90M135 128V90M39 88H51M129 88H141',
 museum:'M35 122H145M43 115H137M50 109H130M47 66H133L90 44ZM55 68V107M66 68V107M81 68V107M94 68V107M110 68V107M123 68V107M51 105H128M85 88H99V107M39 66H141M75 58H105',
 'forged-park':'M45 123V73Q46 38 90 39Q135 40 136 74V123M53 122V73Q55 48 90 48Q126 49 127 73V122M40 123H59M123 123H143M64 76Q66 59 78 66Q89 79 77 86Q61 92 62 109M115 76Q112 59 101 66Q90 79 102 86Q119 92 118 109M75 99Q92 81 105 98Q96 113 91 120Q80 113 75 99',
 steppe:'M32 115Q52 107 74 114T145 110M39 121Q91 115 141 122M68 111V72M64 69Q43 47 54 42Q67 38 68 66Q79 36 90 44Q99 58 72 70Q97 74 90 85Q79 95 69 74Q49 93 45 79Q44 69 64 69ZM111 111Q119 86 116 61M116 63L105 50M116 73L128 58M115 83L105 74M114 94L126 82M49 111L40 94M91 112L96 97'
};
export function PassportStamp({location,index,earned}:{location:Location;index:number;earned:boolean}){
 const arc='passport-arc-'+useId().replaceAll(':','');
 return <svg viewBox="0 0 180 180" aria-hidden="true" className="passport-ink-stamp"><defs><path id={arc} d="M25 91A65 65 0 0 1 155 91"/></defs><circle cx="90" cy="90" r="79"/><circle cx="90" cy="90" r="73" strokeWidth=".8"/><circle cx="90" cy="90" r="64" strokeWidth=".6" strokeDasharray="1 3"/><text className="stamp-place"><textPath href={'#'+arc} startOffset="50%" textAnchor="middle">{location.shortTitle.toUpperCase()}</textPath></text><path d={drawings[location.id]} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M41 132H139" strokeWidth=".7"/><text x="90" y="146" textAnchor="middle" className="stamp-caption">{earned?'ОТКРЫТИЕ · ': 'ОСТАНОВКА · '}0{index+1}</text></svg>;
}
