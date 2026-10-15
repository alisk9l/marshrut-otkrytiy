export const searchOrder=['plant-3','plant-1','plant-5','plant-2','plant-4'];
export const nextSearchTarget=(found:string[]):string|null=>searchOrder.find(id=>!found.includes(id))??null;
export const evaluateSearchChoice=(active:string|null,choice:string,found:string[]):'found'|'miss'|'already-found'=>found.includes(choice)?'already-found':active===choice?'found':'miss';
export const searchScore=(found:number,mistakes:number,hints:number):number=>Math.max(0,found*100-mistakes*10-hints*25);
