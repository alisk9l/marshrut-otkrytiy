import Phaser from 'phaser';

const SIZE=600;
const CELL=SIZE/3;
const GAP=7;
type Options={photoUrl:string;onSelect:(slot:number)=>void;onSwap:(from:number,to:number)=>void;onStatus:(ready:boolean)=>void};
export type PuzzleSceneHandle={update:(tiles:number[],selected:number|null)=>void;select:(slot:number)=>void;destroy:()=>void};

/** React owns persisted progress; Phaser owns textures, rendering and pointer input. */
export function startPhaserPuzzle(parent:HTMLElement,options:Options):PuzzleSceneHandle{
 let order:number[]=[];
 let selected:number|null=null;
 let ready=false;
 let disposed=false;
 class PuzzleScene extends Phaser.Scene{
  private pieces:Phaser.GameObjects.Image[]=[];
  private labels:Phaser.GameObjects.Text[]=[];
  private outline?:Phaser.GameObjects.Graphics;
  private gesture:{slot:number;x:number;y:number}|null=null;
  constructor(){super('photo-puzzle');}
  preload(){this.load.image('puzzle-photo',options.photoUrl);}
  create(){
   if(disposed)return;
   if(!this.textures.exists('puzzle-photo')){options.onStatus(false);return;}
   const texture=this.textures.get('puzzle-photo');
   const source=texture.getSourceImage() as HTMLImageElement;
   for(let tile=0;tile<9;tile++){
    const x=Math.round(tile%3*source.width/3),y=Math.round(Math.floor(tile/3)*source.height/3);
    const right=Math.round((tile%3+1)*source.width/3),bottom=Math.round((Math.floor(tile/3)+1)*source.height/3);
    texture.add(String(tile),0,x,y,right-x,bottom-y);
   }
   for(let slot=0;slot<9;slot++){
    const image=this.add.image(0,0,'puzzle-photo','0').setOrigin(0).setInteractive({useHandCursor:true});
    image.setData('slot',slot);
    this.pieces.push(image);
    this.labels.push(this.add.text(0,0,String(slot+1),{fontFamily:'Manrope, sans-serif',fontSize:'13px',color:'#203b30',backgroundColor:'#fffdf1',padding:{x:7,y:4}}).setOrigin(1));
   }
   this.outline=this.add.graphics().setDepth(20);
   this.input.on('gameobjectdown',(pointer:Phaser.Input.Pointer,object:Phaser.GameObjects.Image)=>{
    if(this.gesture)return;
    this.gesture={slot:object.getData('slot') as number,x:pointer.x,y:pointer.y};
   });
   this.input.on('pointermove',(pointer:Phaser.Input.Pointer)=>{
    if(!this.gesture||!pointer.isDown)return;
    const {slot,x,y}=this.gesture;
    if(Math.hypot(pointer.x-x,pointer.y-y)<8)return;
    this.pieces[slot].setPosition(slot%3*CELL+GAP/2+pointer.x-x,Math.floor(slot/3)*CELL+GAP/2+pointer.y-y).setDepth(10);
    this.labels[slot].setDepth(11);
   });
   this.input.on('pointerup',(pointer:Phaser.Input.Pointer)=>{
    const gesture=this.gesture;this.gesture=null;
    if(!gesture)return;
    this.draw();
    if(Math.hypot(pointer.x-gesture.x,pointer.y-gesture.y)<8){options.onSelect(gesture.slot);return;}
    if(pointer.x<0||pointer.y<0||pointer.x>=SIZE||pointer.y>=SIZE)return;
    const target=Math.floor(pointer.y/CELL)*3+Math.floor(pointer.x/CELL);
    if(target!==gesture.slot)options.onSwap(gesture.slot,target);
   });
   this.input.on('gameout',()=>{this.gesture=null;this.draw();});
   ready=true;this.draw();options.onStatus(true);
  }
  draw(){
   if(!ready||disposed)return;
   this.pieces.forEach((image,slot)=>{
    image.setFrame(String(order[slot]??slot)).setDisplaySize(CELL-GAP,CELL-GAP).setPosition(slot%3*CELL+GAP/2,Math.floor(slot/3)*CELL+GAP/2).setDepth(0);
    this.labels[slot].setPosition((slot%3+1)*CELL-10,(Math.floor(slot/3)+1)*CELL-10).setDepth(1);
   });
   this.outline?.clear();
   if(selected!==null)this.outline?.lineStyle(5,0xbd4d23,1).strokeRoundedRect(selected%3*CELL+3,Math.floor(selected/3)*CELL+3,CELL-6,CELL-6,5);
  }
 }
 const scene=new PuzzleScene();
 const game=new Phaser.Game({type:Phaser.AUTO,parent,width:SIZE,height:SIZE,backgroundColor:'#e3e9da',scene:[scene],audio:{noAudio:true},banner:false,scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH},input:{activePointers:1},render:{antialias:true}});
 return {
  update(tiles,selection){order=[...tiles];selected=selection;scene.draw();},
  select(slot){if(ready&&!disposed)options.onSelect(slot);},
  destroy(){disposed=true;ready=false;game.destroy(true);}
 };
}
