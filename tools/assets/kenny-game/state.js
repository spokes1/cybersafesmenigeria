import { questions } from './scenarios.js';
import { ransomware } from './content.js';
export const initialState=()=>({screen:'welcome',game:null,index:0,selected:[],responses:[],attempts:0,correct:null,lesson:0});
export const items=s=>s.game==='scam'?questions:ransomware;
export const isSafe=(q,chosen)=>q.correct.length===chosen.length&&q.correct.every(id=>chosen.includes(id));
export function transition(s,action){
 const n=structuredClone(s);
 switch(action.type){
 case 'WELCOME':return initialState();
 case 'HUB':return {...initialState(),screen:'hub'};
 case 'INTRO':if(!['scam','ransom'].includes(action.game))return s;return {...initialState(),screen:'intro',game:action.game};
 case 'START':if(!['scam','ransom'].includes(s.game))return s;return {...initialState(),screen:'play',game:s.game};
 case 'SELECT':{
  if(s.screen!=='play')return s;const q=items(s)[s.index];if(!q.options.some(o=>o[0]===action.id))return s;
  if(q.mode==='multi'){const i=n.selected.indexOf(action.id);if(i>=0)n.selected.splice(i,1);else if(n.selected.length<q.correct.length)n.selected.push(action.id);}else n.selected=[action.id];return n;
 }
 case 'SUBMIT':{
  if(s.screen!=='play')return s;const q=items(s)[s.index];if(s.selected.length!==(q.mode==='multi'?q.correct.length:1))return s;
  n.correct=isSafe(q,s.selected);n.attempts++;n.screen='feedback';
  if(s.game==='scam'||n.correct)n.responses[s.index]={correct:n.correct,first:n.attempts===1,selected:[...s.selected]};return n;
 }
 case 'RETRY':if(s.screen!=='feedback'||s.game!=='ransom'||s.correct)return s;return {...n,screen:'play',selected:[],correct:null};
 case 'NEXT':if(s.screen!=='feedback'||(s.game==='ransom'&&!s.correct))return s;if(s.index===items(s).length-1)return {...n,screen:'results'};return {...n,screen:'play',index:s.index+1,selected:[],correct:null,attempts:0};
 case 'LESSON':if(s.screen!=='results'||!Number.isInteger(action.index)||action.index<0||action.index>=items(s).length)return s;return {...n,screen:'lesson',lesson:action.index};
 case 'RESULTS':return s.screen==='lesson'?{...n,screen:'results'}:s;
 case 'MOVES':return {...n,screen:'moves'};
 case 'COMPANION':return {...n,screen:'companion'};
 default:return s;
 }
}
