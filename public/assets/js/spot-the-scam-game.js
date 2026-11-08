import { questions, learning } from './scenarios.js';
import { svgRobot, escapeHtml } from './mascot.js';
import { recordKennyGameStarted, recordKennyGameCompleted } from './kenny-session.js';

/** Mount only on the dedicated Spot the Scam page. All view state stays in memory/history, not server storage. */
export function mountSpotTheScam(root, options={}) {
  if (!(root instanceof HTMLElement)) throw new Error('Spot the Scam root element is required');
  if (root.__stsInstance) return root.__stsInstance;
  const $ = id => root.querySelector('#' + id);
  const escape = escapeHtml;
  const articleHref = path => options.articleHref ? options.articleHref(path) : path;
  const exitUrl = options.exitUrl || '/learn';
  // Honour the originating same-site article when launched from a reading page.
  // Never accept cross-origin or empty referers as a return destination.
  let returnUrl=options.returnUrl||'';
  if(!returnUrl) {
    try {
      const previous=new URL(document.referrer);
      if(previous.origin===window.location.origin && previous.pathname!==window.location.pathname)
        returnUrl=previous.pathname+previous.search+previous.hash;
    }catch(_){}
  }
  let state={view:'welcome',index:0,selected:[],submitted:false,results:[],lessonFrom:null,lessonIndex:0};
  let destroyed=false;
  const scrollGame = () => { if (options.scroll!==false) root.scrollIntoView({block:'start',behavior:'instant'}); };
  const makeSnapshot = () => JSON.parse(JSON.stringify(state));
  const validSnapshot = s => s && ['welcome','question','results','lesson','hub'].includes(s.view) && Number.isInteger(s.index) && s.index>=0 && s.index<5 && Array.isArray(s.selected) && Array.isArray(s.results) && s.results.length<=5 && (s.view!=='results'||s.results.length===5);
  function updateHistory(mode='push') {
    if (destroyed || options.history===false) return;
    const snapshot={...window.history.state,__stsV51:makeSnapshot()};
    const hash=state.view==='question'?`#challenge-${state.index+1}`:`#${state.view}`;
    const url=window.location.pathname + window.location.search + hash;
    try { window.history[mode==='replace'?'replaceState':'pushState'](snapshot,'',url); } catch(_) { /* graceful history fallback */ }
  }
  const onPop = e => {
    if(destroyed) return;
    if(validSnapshot(e.state?.__stsV51)) {
      state=JSON.parse(JSON.stringify(e.state.__stsV51));
      renderGame();scrollGame();
    } else {
      state={view:'welcome',index:0,selected:[],submitted:false,results:[],lessonFrom:null,lessonIndex:0};
      renderGame();
    }
  };
  window.addEventListener('popstate',onPop);
  function setView(view,mode='push') { state.view=view; renderGame();updateHistory(mode);scrollGame(); }
  function openWelcome() {state={view:'welcome',index:0,selected:[],submitted:false,results:[],lessonFrom:null,lessonIndex:0};setView('welcome');}
  function startGame() {
    recordKennyGameStarted();
    state={view:'question',index:0,selected:[],submitted:false,results:[],lessonFrom:null,lessonIndex:0};
    setView('question');
  }
    function renderGame(){
      if(state.view==='welcome') $('gameContent').innerHTML=`<section class="game-panel welcome" aria-labelledby="welcomeTitle">
        <div class="welcome-hero"><div class="welcome-copy"><div class="welcome-eyebrow">CyberSafe game lab · Edition 01</div><h1 id="welcomeTitle" tabindex="-1">Spot the Scam<span class="sts-title-dot">.</span></h1><p>Five everyday messages. Five moments to decide what happens next. Can you catch the warning signs before making the wrong move?</p></div><div class="welcome-robot-scene"><div id="welcomeRobot" class="welcome-robot"></div></div></div>
        <div class="welcome-footer"><div class="kenny-intro"><span class="kenny-dot" aria-hidden="true">K</span><span>I'm Kenny, your Cyber Guide.</span></div><div class="welcome-meta"><span>◎ 5 realistic scenarios</span><span>◷ 2–3 minutes</span><span>◇ No timer</span></div><p>Look at each simulated message, choose what you would do, then learn a safer habit. There is no rush and no sign-in.</p><button class="button button-primary" id="startBtn">Let's begin <span aria-hidden="true">↗</span></button><p class="safety-note">All messages and payment screens are fictional. This activity is educational, not a cybersecurity certification.</p></div></section>`;
      else if(state.view==='question') renderQuestion();
      else if(state.view==='results') renderResults();
      else if(state.view==='lesson') renderLesson();
      else if(state.view==='hub') renderHub();
      if(state.view==='welcome'){ $('welcomeRobot').innerHTML=svgRobot('Kenny, ready to guide the challenge', 'focused');$('startBtn').addEventListener('click',startGame);requestAnimationFrame(()=>$('welcomeTitle').focus({preventScroll:true}));$('welcomeTitle').setAttribute('tabindex','-1'); }
    }
    function visual(q){
      const kind={receipt:'PAYMENT SCREEN',chat:'CHAT TRANSCRIPT',email:'SUPPLIER EMAIL',sms:'TEXT MESSAGE',boss:'URGENT REQUEST'}[q.format];
      const caption=`<div class="scenario-caption"><span>Fictional example · Not interactive</span><span>${kind}</span></div>`;
      const clueClass=state.submitted?'clue-highlight':'';
      const clueNote=state.submitted?`<div class="scenario-clue"><strong>Clue to notice:</strong> ${escape(learning[q.id].clue)}</div>`:'';
      if(q.format==='receipt') return `<div class="scenario">${caption}<div class="receipt"><div class="receipt-icon" aria-hidden="true">✓</div><div class="receipt-status">Transfer successful</div><div class="receipt-amount">₦85,000</div><div class="muted sts-receipt-desc ${clueClass}">Customer-provided confirmation screen</div><div class="receipt-data"><span>Reference: EXAMPLE-017</span><span>Completed</span></div></div>${clueNote}</div>`;
      if(q.format==='chat') return `<div class="scenario">${caption}<div class="chat-frame"><div class="chat-top"><span class="avatar">?</span>Account Help <span class="muted sts-chat-meta">· Unverified sender</span></div><div class="chat-messages"><div class="bubble ${clueClass}">Hello. Your business account has a security issue. Reply with the six-digit verification code sent to your phone so it won't be blocked.<small>10:14</small></div><div class="bubble outgoing">Is this really WhatsApp support?<small>10:15</small></div><div class="bubble">Yes. Send the code now to avoid losing access.<small>10:15</small></div></div><div class="chat-input-fake">Message · Example only</div></div>${clueNote}</div>`;
      if(q.format==='email') return `<div class="scenario">${caption}<div class="email-frame"><div class="email-top"><div><strong>From:</strong> Supplier Accounts &lt;accounts@supplier.example&gt;</div><div><strong>Subject:</strong> Re: November packaging order</div></div><div class="email-body"><p>Hello,</p><p><span class="${clueClass}">We've updated the bank account for your next payment. Please use the new account shown on our invoice.</span></p><p><span class="${clueClass}">This is urgent. Please transfer today and don't involve anyone else until the payment has cleared.</span></p><p>Thanks,<br>Accounts Team</p></div></div>${clueNote}</div>`;
      if(q.format==='sms')return `<div class="scenario">${caption}<div class="sms-frame"><div class="sms-top">Messages · Delivery update</div><div class="sms-bubble">Your package is on hold. Sign in to confirm your delivery address now or it may be returned.<div class="sms-url sts-url-margin ${clueClass}">delivery-check.example</div></div><div class="sms-stamp">Received 11:22 · Fictional link, not clickable</div></div>${clueNote}</div>`;
      return `<div class="scenario">${caption}<div class="boss-frame"><div class="boss-avatar" aria-hidden="true">MD</div><div class="boss-card"><strong>Manager · Message request</strong><p>Hi, please send ₦120,000 to this new vendor immediately. <span class="${clueClass}">Must be done in 10 minutes. Don't involve Accounts.</span> I'll explain later.</p><div class="muted sts-boss-meta">Sent just now · Sender not independently verified</div></div></div>${clueNote}</div>`;
    }
    function renderQuestion(){
      const q=questions[state.index], num=state.index+1;
      const options=q.options.map(([id,text])=>`<button class="answer" type="button" data-option="${escape(id)}" aria-pressed="${state.selected.includes(id)}" ${state.submitted?'disabled':''}><span class="choice-mark" aria-hidden="true">✓</span><span class="choice-text">${escape(text)}</span></button>`).join('');
      const feedback=state.submitted?renderFeedback(q):'';
      $('gameContent').innerHTML=`<section class="game-panel" aria-labelledby="questionTitle"><div class="question-head"><div class="progress-head"><span class="eyebrow">Challenge ${num} of 5</span><span class="tiny-meta">${num}/5</span></div><div class="progress-track" aria-label="Question ${num} of 5">${questions.map((_,i)=>`<span class="progress-cell ${i<state.index?'done':i===state.index?'current':''}" aria-hidden="true"></span>`).join('')}</div><h2 id="questionTitle" tabindex="-1">${escape(q.title)}</h2><p>${escape(q.lead)}</p><div class="mission-tag">Pause · Examine · Decide</div></div><div class="question-body">${visual(q)}<div class="prompt-title">${escape(q.prompt)}</div>${q.mode==='multi'?'<p class="hint">Choose two answers. Tap a selected answer again to remove it.</p><p class="answer-limit-note" id="selectionCount" role="status">0 of 2 selected</p>':''}<div class="answers" role="group" aria-label="Answer choices">${options}</div><div id="feedbackRegion">${feedback}</div><div class="footer-actions">${state.submitted?`<button type="button" class="button button-primary" id="nextBtn">${state.index===4?'See my results':'Next challenge →'}</button>`:`<button type="button" class="button button-primary" id="checkBtn" ${state.selected.length!==(q.mode==='multi'?2:1)?'disabled':''}>Check my answer →</button>`}</div></div></section>`;
      $('gameContent').querySelectorAll('[data-option]').forEach(btn=>btn.addEventListener('click',()=>choose(btn.dataset.option)));
      if(state.submitted) {
        $('nextBtn').addEventListener('click',nextQuestion);
        const articleBtn=$('articleLink');if(articleBtn)articleBtn.addEventListener('click',()=>openLesson(state.index,'question'));
      } else $('checkBtn').addEventListener('click',submitAnswer);
      if(!state.submitted)$('questionTitle').focus({preventScroll:true});
    }
    function choose(id){
      if(state.submitted) return;
      const q=questions[state.index];
      if(q.mode==='multi'){
        const pos=state.selected.indexOf(id);
        if(pos>=0)state.selected.splice(pos,1);
        else if(state.selected.length<2)state.selected.push(id);
      } else state.selected=[id];
      $('gameContent').querySelectorAll('[data-option]').forEach(btn=>btn.setAttribute('aria-pressed',String(state.selected.includes(btn.dataset.option))));
      $('checkBtn').disabled=state.selected.length!==(q.mode==='multi'?2:1);
      if(q.mode==='multi')$('selectionCount').textContent=`${state.selected.length} of 2 selected`;
      updateHistory('replace');
    }
    function isCorrect(q){return q.correct.length===state.selected.length && q.correct.every(id=>state.selected.includes(id));}
    function submitAnswer(){
      const q=questions[state.index];
      if(state.selected.length!==(q.mode==='multi'?2:1)||state.submitted)return;
      state.submitted=true;
      state.results.push({id:q.id,correct:isCorrect(q),selected:[...state.selected]});
      renderQuestion();
      updateHistory('replace');
      requestAnimationFrame(()=>{$('feedbackCard')?.focus({preventScroll:false});});
    }
    function renderFeedback(q){
      const yes=isCorrect(q),lesson=learning[q.id];
      return `<div class="feedback ${yes?'':'incorrect'}" id="feedbackCard" tabindex="-1" role="region" aria-label="${yes?'Correct answer feedback':'Safer option feedback'}"><div class="feedback-kenny"><span class="feedback-robot" aria-hidden="true">${svgRobot('Kenny',yes?'celebrate':'supportive')}</span><div><div class="feedback-kicker">Kenny's debrief</div><div class="feedback-title">${yes?'Sharp thinking.':'A safer move to remember.'}</div></div></div><div class="feedback-heading">${yes?'Why this was safer':'A safer action'}</div><p class="safe-action">${escape(lesson.safer)}</p><p>${escape(q.explanation)}</p><div class="rule">Remember: ${escape(q.rule)}</div><a class="related-link" href="${escape(articleHref(q.path))}" target="_blank" rel="noopener noreferrer">Read full article: ${escape(q.article)} ↗</a><button type="button" class="related-link sts-recap-link" id="articleLink">Short in-game recap</button></div>`;
    }
    function openLesson(index,from){
      state.lessonIndex=index;
      state.lessonFrom=from;
      setView('lesson');
    }
    function renderLesson(){
      const q=questions[state.lessonIndex],lesson=learning[q.id];
      $('gameContent').innerHTML=`<section class="game-panel lesson-screen" aria-labelledby="lessonTitle"><span class="lesson-label">Safety habit · ${state.lessonIndex+1} of 5</span><h2 id="lessonTitle" tabindex="-1">${escape(q.article)}</h2><p>${escape(q.explanation)}</p><div class="lesson-key"><strong>Try this instead</strong><p>${escape(lesson.safer)}</p></div><p><strong>The rule:</strong> ${escape(q.rule)}</p><p class="habit-path">This is a short recap of the lesson.</p><p><a class="related-link" href="${escape(articleHref(q.path))}" target="_blank" rel="noopener noreferrer">Read full ${escape(q.article)} article ↗</a></p><div class="lesson-actions"><button id="lessonBack" type="button" class="button button-primary">← ${state.lessonFrom==='hub'?'Back to learning topics':state.lessonFrom==='results'?'Back to results':'Return to challenge'}</button></div></section>`;
      $('lessonBack').addEventListener('click',()=>setView(state.lessonFrom,'replace'));
      $('lessonTitle').focus({preventScroll:true});
    }
    function renderHub(){
      $('gameContent').innerHTML=`<section class="game-panel lesson-hub" aria-labelledby="hubTitle"><span class="lesson-label">Keep learning</span><h2 id="hubTitle" tabindex="-1">Five habits worth practising</h2><p>Choose a short refresher based on the five challenges. Use a quick recap or follow the link to the full CyberSafe article.</p><div class="lesson-links">${questions.map((q,i)=>`<button class="lesson-link" data-lesson="${i}" type="button"><strong>${escape(q.article)} ↗</strong><span>${escape(q.rule)}</span></button><a class="related-link" href="${escape(articleHref(q.path))}" target="_blank" rel="noopener noreferrer">Read full article ↗</a>`).join('')}</div><div class="lesson-actions"><button id="hubBack" type="button" class="button button-primary">← Back to results</button></div></section>`;
      $('gameContent').querySelectorAll('[data-lesson]').forEach(btn=>btn.addEventListener('click',()=>openLesson(Number(btn.dataset.lesson),'hub')));
      $('hubBack').addEventListener('click',()=>setView('results','replace'));
      $('hubTitle').focus({preventScroll:true});
    }
    function nextQuestion(){ if(state.index===4){recordKennyGameCompleted();setView('results');}else{state.index++;state.selected=[];state.submitted=false;setView('question');} }
    function renderResults(){
      const score=state.results.filter(x=>x.correct).length;
      const incorrect=state.results.map((r,i)=>({...r,tip:questions[i].tip})).filter(x=>!x.correct).slice(0,3);
      const pointers=incorrect.length?incorrect.map(r=>r.tip):['Keep verifying payment details independently.','Use trusted channels whenever an account is involved.','Share one useful lesson with a colleague.'];
      const headline=score===5?'Five thoughtful decisions. Well done.':score>=3?'Good instincts. Keep building on them.':'You have five useful lessons to take away.';
      const firstMiss=state.results.findIndex(r=>!r.correct);
      $('gameContent').innerHTML=`<section class="game-panel results" aria-labelledby="resultsTitle">
        <div class="results-hero"><span class="pill">Challenge complete · Kenny's debrief</span><div class="score-dial score-appearing" id="scoreDial" ><h1 id="resultsTitle" tabindex="-1" class="score">${score}<span class="sts-score-denom">/5</span><small>YOUR SCORE</small></h1></div><h2>${escape(headline)}</h2><p>You have finished five fictional scam situations. This is a practice score, not a measure of your overall cybersecurity ability.</p><div class="results-kenny"><div id="resultRobot"></div><span>Pause, check, decide. Those habits matter more than a perfect score.</span></div></div>
        <div class="result-bottom"><div class="learning-list"><h3>${incorrect.length?'Your next habits to practise':'Keep these good habits going'}</h3><ul>${pointers.map(p=>`<li>${escape(p)}</li>`).join('')}</ul></div><div class="result-actions">${firstMiss>=0?'<button type="button" id="firstMissBtn" class="button button-primary">Review a missed lesson ↗</button>':''}<button type="button" id="retryBtn" class="button ${firstMiss>=0?'button-quiet':'button-primary'}">Play again ↻</button><button type="button" id="learnBtn" class="button button-quiet">Keep learning ↗</button><button type="button" id="backResultBtn" class="button button-quiet">Back to reading</button></div><p class="result-note">No account needed. Your answers and score stay in this page and are not sent to a server.</p></div></section>`;
      $('resultRobot').innerHTML=svgRobot('Kenny encouraging thoughtful decisions',score===5?'celebrate':'encourage');
      if(firstMiss>=0)$('firstMissBtn').addEventListener('click',()=>openLesson(firstMiss,'results'));
      // The ring animates toward the *actual* score, never fabricating an earned result.
      requestAnimationFrame(()=>requestAnimationFrame(()=>{
        const dial=$('scoreDial');if(dial)dial.style.setProperty('--sts-score-pct',`${score*20}%`);
      }));
      $('retryBtn').addEventListener('click',startGame);
      $('learnBtn').addEventListener('click',()=>setView('hub'));
      $('backResultBtn').addEventListener('click',onExit);
      $('resultsTitle').focus({preventScroll:true});
    }

  const exitButton = $('backToBrowse');
  const onExit = () => { if (typeof options.onExit==='function') options.onExit(); else window.location.assign(returnUrl||exitUrl); };
  exitButton?.addEventListener('click',onExit);
  if (validSnapshot(window.history.state?.__stsV51)) state=JSON.parse(JSON.stringify(window.history.state.__stsV51));
  root.classList.add('sts-ready');
  renderGame();
  updateHistory('replace');
  const instance={
    getState:()=>makeSnapshot(),
    reset:()=>openWelcome(),
    destroy:()=>{
      destroyed=true;
      window.removeEventListener('popstate',onPop);
      exitButton?.removeEventListener('click',onExit);
      root.__stsInstance=null;
    }
  };
  root.__stsInstance=instance;
  return instance;
}
