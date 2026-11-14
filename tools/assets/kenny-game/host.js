import { getReadingReturn } from '../js/kenny-session.js';
export function returnToReading(){
 try{const ref=new URL(document.referrer);if(ref.origin===location.origin&&ref.pathname!=='/learn/spot-the-scam'&&ref.pathname!=='/learn/spot-the-scam/'&&!ref.pathname.startsWith('/assets/'))return ref.pathname+ref.search+ref.hash;}catch{}
 return getReadingReturn()||'/learn';
}
