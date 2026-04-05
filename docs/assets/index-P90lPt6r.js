(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))a(n);new MutationObserver(n=>{for(const c of n)if(c.type==="childList")for(const p of c.addedNodes)p.tagName==="LINK"&&p.rel==="modulepreload"&&a(p)}).observe(document,{childList:!0,subtree:!0});function s(n){const c={};return n.integrity&&(c.integrity=n.integrity),n.referrerPolicy&&(c.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?c.credentials="include":n.crossOrigin==="anonymous"?c.credentials="omit":c.credentials="same-origin",c}function a(n){if(n.ep)return;n.ep=!0;const c=s(n);fetch(n.href,c)}})();const I=[{id:"apple",name:"애플 젤 슬라이스",objective:"사과 젤을 빠르게 슬라이스해 분자 디저트 베이스를 완성하세요."},{id:"foam",name:"레몬 에어 폼",objective:"블렌더를 드래그해 공기를 충분히 주입하세요."},{id:"gel",name:"토마토 젤 큐브",objective:"완벽한 온도 타이밍에 맞춰 스페이스바를 누르세요."},{id:"snow",name:"요거트 스노우",objective:"빠르게 연타해 급속 냉각 후 눈결처럼 부수세요."}];let u="intro",i=null,d=!1,e={};const o={gelTimer:null,applePreviewTimer:null,applePressTimer:null},g=document.querySelector("#app"),T=t=>{const r=[...t];for(let s=r.length-1;s>0;s-=1){const a=Math.floor(Math.random()*(s+1));[r[s],r[a]]=[r[a],r[s]]}return r},j=t=>{const r=t.join(",");let s=T(t),a=0;for(;s.join(",")===r&&a<8;)s=T(t),a+=1;return s},w=()=>{o.gelTimer&&(clearInterval(o.gelTimer),o.gelTimer=null),o.applePreviewTimer&&(clearTimeout(o.applePreviewTimer),o.applePreviewTimer=null),o.applePressTimer&&(clearTimeout(o.applePressTimer),o.applePressTimer=null)},z=()=>{w(),u="intro",i=null,d=!1,e={},l()},k=()=>{w(),u="menu",i=null,d=!1,e={},l()},b=t=>{const r=I.find(s=>s.id===t);r&&(w(),u="play",i=r,d=!1,t==="apple"&&(e={steps:["사과 퓌레에 알긴산을 완전히 풀어 점도를 맞춘다.","칼슘 욕조 위에서 스포이드로 천천히 구슬을 떨어뜨린다.","30초 후 찬물로 헹궈 표면의 잔여 칼슘을 제거한다.","요거트 폼 위에 사과 젤 구슬을 올려 플레이팅한다."],sequence:[0,1,2,3],shuffledOrder:[],previewIndex:-1,inputIndex:0,phase:"preview",message:"문장 순서를 기억하세요.",pressedIndex:-1,pressedState:""}),t==="foam"&&(e={progress:0,bubbles:0,lastAngle:null,cursorX:50,cursorY:50}),t==="gel"&&(e={marker:8,direction:1,hits:0,targetHits:3,perfectMin:45,perfectMax:58},o.gelTimer=setInterval(()=>{u!=="play"||!i||i.id!=="gel"||d||(e.marker+=e.direction*2.5,e.marker>=96&&(e.marker=96,e.direction=-1),e.marker<=4&&(e.marker=4,e.direction=1),l())},35)),t==="snow"&&(e={phase:1,freezeClicks:0,crushClicks:0,freezeTarget:14,crushTarget:14}),l(),t==="apple"&&L())},v=(t=35)=>{d||(d=!0,l())},L=()=>{if(!i||i.id!=="apple"||d)return;o.applePreviewTimer&&(clearTimeout(o.applePreviewTimer),o.applePreviewTimer=null),e.phase="preview",e.inputIndex=0,e.previewIndex=-1,e.shuffledOrder=[...e.sequence],e.message="처음 순서를 기억하세요.",l();let t=0;const r=()=>{if(!(!i||i.id!=="apple"||u!=="play"||d)){if(t>=e.sequence.length){e.previewIndex=-1,e.phase="input",e.shuffledOrder=j(e.sequence),e.message="카드가 섞였어요. 원래 순서대로 눌러보세요.",l();return}e.previewIndex=e.sequence[t],l(),o.applePreviewTimer=setTimeout(()=>{e.previewIndex=-1,l(),t+=1,o.applePreviewTimer=setTimeout(r,240)},700)}};o.applePreviewTimer=setTimeout(r,450)},O=()=>{const t=Math.round(e.inputIndex/e.sequence.length*100),r=e.phase==="preview"?e.sequence:e.shuffledOrder;return`
    <div class="mini-game">
      <div class="art-board apple-board">
        <div class="memory-header">
          <strong>순서 기억 실험</strong>
          <span>${e.inputIndex}/${e.sequence.length}</span>
        </div>
        <div class="memory-steps">
          ${r.map(s=>{const a=e.steps[s];let n="memory-step";return e.previewIndex===s&&(n+=" showing"),e.pressedIndex===s&&(n+=` pressed ${e.pressedState}`),`<button class="${n}" data-action="apple-step" data-index="${s}" ${e.phase!=="input"||d?"disabled":""}>${a}</button>`}).join("")}
        </div>
      </div>
      <p class="hint">${e.message}</p>
      <div class="progress"><span style="width:${t}%"></span></div>
    </div>
  `},A=()=>{const t=Math.round(e.progress);return`
    <div class="mini-game">
      <div class="art-board foam-board" data-zone="foam-zone">
        <div class="foam-surface">${Array.from({length:e.bubbles},(s,a)=>{const n=8+a*7%20,c=a*23%86+4,p=a*13%65+5;return`<span class="bubble" style="width:${n}px; height:${n}px; left:${c}%; bottom:${p}%"></span>`}).join("")}</div>
        <div class="circle-guide">
          <span class="ring"></span>
          <span class="center-dot"></span>
          <span class="cursor-dot" style="left:${e.cursorX}%; top:${e.cursorY}%"></span>
        </div>
      </div>
      <p class="hint">원형 가이드의 링을 따라 커서를 둥글게 돌리세요. (${t}%)</p>
      <div class="progress"><span style="width:${t}%"></span></div>
    </div>
  `},S=()=>{const t=e.marker,r=`${e.hits}/${e.targetHits}`;return`
    <div class="mini-game">
      <div class="art-board gel-board">
        <div class="timing-track">
          <span class="perfect-zone" style="left:${e.perfectMin}%; width:${e.perfectMax-e.perfectMin}%"></span>
          <span class="marker" style="left:${t}%"></span>
        </div>
      </div>
      <p class="hint">초록 존에 마커가 들어왔을 때 스페이스바를 누르세요. 성공 ${r}</p>
      <div class="progress"><span style="width:${e.hits/e.targetHits*100}%"></span></div>
    </div>
  `},R=()=>{const t=e.phase===1?"냉각":"분쇄",r=e.phase===1?e.freezeClicks:e.crushClicks,s=e.phase===1?e.freezeTarget:e.crushTarget,a=Math.round(r/s*100);return`
    <div class="mini-game">
      <div class="art-board snow-board" data-action="snow-tap">
        <div class="tube"></div>
        <div class="snow-pile ${e.phase===2?"ready":""}"></div>
      </div>
      <p class="hint">현재 단계: ${t}. 아이콘/화면을 빠르게 연타하세요. (${r}/${s})</p>
      <div class="progress"><span style="width:${a}%"></span></div>
    </div>
  `},C=()=>{if(!i)return"";let t="";return i.id==="apple"&&(t=O()),i.id==="foam"&&(t=A()),i.id==="gel"&&(t=S()),i.id==="snow"&&(t=R()),`
    <main class="screen play-screen">
      <div class="panel">
        <div class="play-top">
          <h2>${i.name}</h2>
        </div>
        <p class="objective">${i.objective}</p>
        ${d?'<div class="status-row"><span>실험 성공</span></div>':""}
        ${t}
        <div class="action-row">
          <button class="ghost-btn" data-action="menu">메뉴로</button>
          ${d?'<button class="primary-btn" data-action="retry">다시 만들기</button>':""}
        </div>
      </div>
    </main>
  `},l=()=>{if(g){if(u==="intro"){g.innerHTML=`
      <main class="screen intro-screen">
        <div class="panel">
          <h1>분자요리 실험소</h1>
          <p class="intro-copy">
            <span class="intro-line-fixed">분자요리는 재료의 분자적 성질을 활용해 맛은 살리고 형태와 식감을 새롭게 바꾸는 과학 요리입니다.</span><br>
            같은 재료도 구슬, 거품, 젤 형태로 변신하며 완전히 다른 미식 경험을 만듭니다.
          </p>
          <button class="primary-btn" data-action="start">START</button>
        </div>
      </main>
    `;return}if(u==="menu"){g.innerHTML=`
      <main class="screen menu-screen">
        <div class="panel">
          <div class="top-nav">
            <button class="ghost-btn home-btn" data-action="home" aria-label="홈으로 이동">
              <svg class="home-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M3 11.2 12 4l9 7.2v8.8a1 1 0 0 1-1 1h-5.2a1 1 0 0 1-1-1v-4.6h-3.6V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/>
              </svg>
            </button>
          </div>
          <h2>실험 메뉴 선택</h2>
          <p class="sub">만들고 싶은 분자요리를 골라보세요.</p>
          <div class="recipe-grid">
            ${I.map(t=>`
                <button class="recipe-btn" data-recipe="${t.id}">
                  ${t.name}
                </button>
              `).join("")}
          </div>
        </div>
      </main>
    `;return}g.innerHTML=C()}};document.addEventListener("click",t=>{const r=t.target;if(!(r instanceof HTMLElement))return;const s=r.closest("[data-action]"),a=s instanceof HTMLElement?s.dataset.action:void 0;if(a==="start"){k();return}if(a==="home"){z();return}if(a==="menu"){k();return}if(a==="retry"&&i){b(i.id);return}if(!i||u!=="play"){const p=r.closest("[data-recipe]"),f=p instanceof HTMLElement?p.dataset.recipe:void 0;f&&b(f);return}if(d)return;if(a==="apple-step"&&i.id==="apple"){if(e.phase!=="input")return;const p=Number(s==null?void 0:s.dataset.index);if(Number.isNaN(p))return;const f=e.sequence[e.inputIndex],m=p===f;if(e.pressedIndex=p,e.pressedState=m?"good":"bad",o.applePressTimer&&clearTimeout(o.applePressTimer),o.applePressTimer=setTimeout(()=>{e.pressedIndex=-1,e.pressedState="",l()},180),m){if(e.inputIndex+=1,e.inputIndex>=e.sequence.length){e.message="레시피 숙지 완료!",v(35);return}e.message=`좋아요! 다음 문장을 고르세요. (${e.inputIndex}/${e.sequence.length})`,l();return}e.inputIndex=0,e.shuffledOrder=T(e.sequence),e.message="순서가 달라요. 카드를 다시 섞었어요. 처음부터 다시!",e.phase="preview",l(),o.applePreviewTimer=setTimeout(()=>{L()},700);return}if(a==="snow-tap"&&i.id==="snow"){if(e.phase===1){e.freezeClicks+=1,e.freezeClicks>=e.freezeTarget&&(e.phase=2),l();return}if(e.crushClicks+=1,e.crushClicks>=e.crushTarget){v(30);return}l()}const n=r.closest("[data-recipe]"),c=n instanceof HTMLElement?n.dataset.recipe:void 0;c&&b(c)});document.addEventListener("pointermove",t=>{if(u!=="play"||!i||i.id!=="foam"||d)return;const r=document.querySelector(".foam-board");if(!(r instanceof HTMLElement))return;const s=r.getBoundingClientRect();if(!(t.clientX>=s.left&&t.clientX<=s.right&&t.clientY>=s.top&&t.clientY<=s.bottom)){e.lastAngle=null;return}const n=(t.clientX-s.left)/s.width*100,c=(t.clientY-s.top)/s.height*100;e.cursorX=Math.max(0,Math.min(100,n)),e.cursorY=Math.max(0,Math.min(100,c));const p=s.left+s.width/2,f=s.top+s.height/2,m=t.clientX-p,y=t.clientY-f,M=Math.hypot(m,y),$=Math.min(s.width,s.height),q=$*.16,H=$*.26;if(!(M>=q&&M<=H)){e.lastAngle=null,l();return}const x=Math.atan2(y,m);if(e.lastAngle!==null){let h=x-e.lastAngle;h>Math.PI&&(h-=Math.PI*2),h<-Math.PI&&(h+=Math.PI*2);const P=Math.abs(h);P<=1.2&&(e.progress=Math.min(100,e.progress+P*16),e.bubbles=Math.min(24,Math.floor(e.progress/4)))}if(e.lastAngle=x,e.progress>=100){v(32);return}l()});document.addEventListener("keydown",t=>{if(t.code!=="Space"||t.repeat||u!=="play"||!i||i.id!=="gel"||d)return;if(t.preventDefault(),e.marker>=e.perfectMin&&e.marker<=e.perfectMax&&(e.hits+=1,e.hits>=e.targetHits)){v(35);return}l()});l();
