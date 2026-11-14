/* Shared click-to-reveal guidance; approved content remains readable without scripting. */
window.CyberSafeExamples?.mount('incident');
const printButton=document.querySelector('[data-ir-print]');if(printButton&&typeof window.print==='function'){printButton.addEventListener('click',()=>window.print());printButton.hidden=false;}
