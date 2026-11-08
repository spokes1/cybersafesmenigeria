// Production page entry; load only on the dedicated game route.
import { mountSpotTheScam } from './spot-the-scam-game.js';
const root=document.querySelector('[data-spot-game]');
if(root) mountSpotTheScam(root, {exitUrl:'/learn'});
