// Tab-scoped Kenny state. Scores and answers remain in the game page only.
const COMPLETION='cybersafe.kenny.completed',NOTICES='cybersafe.kenny.page-notices',RETURN='cybersafe.kenny.reading-return';
let completed=false,notices=new Set(),readingReturn='';
function read(key){try{return JSON.parse(window.sessionStorage.getItem(key));}catch{return null;}}
function write(key,value){try{window.sessionStorage.setItem(key,JSON.stringify(value));}catch{}}
export function hasCompletedActivity(){const saved=read(COMPLETION);if(saved===true)completed=true;return completed;}
export function markActivityCompleted(){completed=true;write(COMPLETION,true);window.dispatchEvent(new CustomEvent('kenny-activity-completed'));}
export function hasSeenPageNotice(path){const saved=read(NOTICES);if(Array.isArray(saved))for(const item of saved)if(typeof item==='string')notices.add(item);return notices.has(path);}
export function markPageNoticeSeen(path){notices.add(path);write(NOTICES,[...notices]);}
export function safeReadingPath(value){if(typeof value!=="string"||!value.trim())return "";try{const url=new URL(value,location.origin);if(url.origin!==location.origin||url.pathname.replace(/\/$/,'')==='/learn/spot-the-scam'||url.pathname.startsWith('/assets/'))return '';return url.pathname+url.search+url.hash;}catch{return '';}}
export function rememberReadingReturn(path){readingReturn=safeReadingPath(path);if(readingReturn)write(RETURN,readingReturn);}
export function getReadingReturn(){return safeReadingPath(read(RETURN)||readingReturn);}
