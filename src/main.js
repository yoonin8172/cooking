import "./style.css";

const recipes = [
  {
    id: "apple",
    name: "애플 젤 슬라이스",
    objective: "사과 젤을 빠르게 슬라이스해 분자 디저트 베이스를 완성하세요.",
  },
  {
    id: "foam",
    name: "레몬 에어 폼",
    objective: "블렌더를 드래그해 공기를 충분히 주입하세요.",
  },
  {
    id: "gel",
    name: "토마토 젤 큐브",
    objective: "완벽한 온도 타이밍에 맞춰 스페이스바를 누르세요.",
  },
  {
    id: "snow",
    name: "요거트 스노우",
    objective: "빠르게 연타해 급속 냉각 후 눈결처럼 부수세요.",
  },
];

let stage = "intro";
let activeRecipe = null;
let finished = false;
let gameState = {};

const runtime = {
  gelTimer: null,
  applePreviewTimer: null,
  applePressTimer: null,
};

const app = document.querySelector("#app");

const shuffleArray = (array) => {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const shuffleDifferent = (array) => {
  const original = array.join(",");
  let candidate = shuffleArray(array);
  let guard = 0;
  while (candidate.join(",") === original && guard < 8) {
    candidate = shuffleArray(array);
    guard += 1;
  }
  return candidate;
};

const resetRunState = () => {
  if (runtime.gelTimer) {
    clearInterval(runtime.gelTimer);
    runtime.gelTimer = null;
  }
  if (runtime.applePreviewTimer) {
    clearTimeout(runtime.applePreviewTimer);
    runtime.applePreviewTimer = null;
  }
  if (runtime.applePressTimer) {
    clearTimeout(runtime.applePressTimer);
    runtime.applePressTimer = null;
  }
};

const goHome = () => {
  resetRunState();
  stage = "intro";
  activeRecipe = null;
  finished = false;
  gameState = {};
  render();
};

const goMenu = () => {
  resetRunState();
  stage = "menu";
  activeRecipe = null;
  finished = false;
  gameState = {};
  render();
};

const startRecipe = (recipeId) => {
  const recipe = recipes.find((item) => item.id === recipeId);
  if (!recipe) return;

  resetRunState();
  stage = "play";
  activeRecipe = recipe;
  finished = false;

  if (recipeId === "apple") {
    gameState = {
      steps: [
        "사과 퓌레에 알긴산을 완전히 풀어 점도를 맞춘다.",
        "칼슘 욕조 위에서 스포이드로 천천히 구슬을 떨어뜨린다.",
        "30초 후 찬물로 헹궈 표면의 잔여 칼슘을 제거한다.",
        "요거트 폼 위에 사과 젤 구슬을 올려 플레이팅한다.",
      ],
      sequence: [0, 1, 2, 3],
      shuffledOrder: [],
      previewIndex: -1,
      inputIndex: 0,
      phase: "preview",
      message: "문장 순서를 기억하세요.",
      pressedIndex: -1,
      pressedState: "",
    };
  }

  if (recipeId === "foam") {
    gameState = { progress: 0, bubbles: 0, lastAngle: null, cursorX: 50, cursorY: 50 };
  }

  if (recipeId === "gel") {
    gameState = { marker: 8, direction: 1, hits: 0, targetHits: 3, perfectMin: 45, perfectMax: 58 };

    runtime.gelTimer = setInterval(() => {
      if (stage !== "play" || !activeRecipe || activeRecipe.id !== "gel" || finished) return;

      gameState.marker += gameState.direction * 2.5;
      if (gameState.marker >= 96) {
        gameState.marker = 96;
        gameState.direction = -1;
      }
      if (gameState.marker <= 4) {
        gameState.marker = 4;
        gameState.direction = 1;
      }
      render();
    }, 35);
  }

  if (recipeId === "snow") {
    gameState = { phase: 1, freezeClicks: 0, crushClicks: 0, freezeTarget: 14, crushTarget: 14 };
  }

  render();

  if (recipeId === "apple") {
    startApplePreview();
  }
};

const completeRecipe = (bonus = 35) => {
  if (finished) return;
  finished = true;
  render();
};

const startApplePreview = () => {
  if (!activeRecipe || activeRecipe.id !== "apple") return;
  if (finished) return;

  if (runtime.applePreviewTimer) {
    clearTimeout(runtime.applePreviewTimer);
    runtime.applePreviewTimer = null;
  }

  gameState.phase = "preview";
  gameState.inputIndex = 0;
  gameState.previewIndex = -1;
  gameState.shuffledOrder = [...gameState.sequence];
  gameState.message = "처음 순서를 기억하세요.";
  render();

  let pointer = 0;

  const loop = () => {
    if (!activeRecipe || activeRecipe.id !== "apple" || stage !== "play" || finished) return;

    if (pointer >= gameState.sequence.length) {
      gameState.previewIndex = -1;
      gameState.phase = "input";
      gameState.shuffledOrder = shuffleDifferent(gameState.sequence);
      gameState.message = "카드가 섞였어요. 원래 순서대로 눌러보세요.";
      render();
      return;
    }

    gameState.previewIndex = gameState.sequence[pointer];
    render();

    runtime.applePreviewTimer = setTimeout(() => {
      gameState.previewIndex = -1;
      render();
      pointer += 1;
      runtime.applePreviewTimer = setTimeout(loop, 240);
    }, 700);
  };

  runtime.applePreviewTimer = setTimeout(loop, 450);
};

const appleMarkup = () => {
  const progress = Math.round((gameState.inputIndex / gameState.sequence.length) * 100);
  const displayOrder = gameState.phase === "preview" ? gameState.sequence : gameState.shuffledOrder;

  return `
    <div class="mini-game">
      <div class="art-board apple-board">
        <div class="memory-header">
          <strong>순서 기억 실험</strong>
          <span>${gameState.inputIndex}/${gameState.sequence.length}</span>
        </div>
        <div class="memory-steps">
          ${displayOrder
            .map((stepIdx) => {
              const step = gameState.steps[stepIdx];
              let classes = "memory-step";
              if (gameState.previewIndex === stepIdx) classes += " showing";
              if (gameState.pressedIndex === stepIdx) classes += ` pressed ${gameState.pressedState}`;
              return `<button class="${classes}" data-action="apple-step" data-index="${stepIdx}" ${gameState.phase !== "input" || finished ? "disabled" : ""}>${step}</button>`;
            })
            .join("")}
        </div>
      </div>
      <p class="hint">${gameState.message}</p>
      <div class="progress"><span style="width:${progress}%"></span></div>
    </div>
  `;
};

const foamMarkup = () => {
  const progress = Math.round(gameState.progress);
  const bubbles = Array.from({ length: gameState.bubbles }, (_, i) => {
    const size = 8 + ((i * 7) % 20);
    const left = ((i * 23) % 86) + 4;
    const bottom = ((i * 13) % 65) + 5;
    return `<span class="bubble" style="width:${size}px; height:${size}px; left:${left}%; bottom:${bottom}%"></span>`;
  }).join("");

  return `
    <div class="mini-game">
      <div class="art-board foam-board" data-zone="foam-zone">
        <div class="foam-surface">${bubbles}</div>
        <div class="circle-guide">
          <span class="ring"></span>
          <span class="center-dot"></span>
          <span class="cursor-dot" style="left:${gameState.cursorX}%; top:${gameState.cursorY}%"></span>
        </div>
      </div>
      <p class="hint">원형 가이드의 링을 따라 커서를 둥글게 돌리세요. (${progress}%)</p>
      <div class="progress"><span style="width:${progress}%"></span></div>
    </div>
  `;
};

const gelMarkup = () => {
  const marker = gameState.marker;
  const successText = `${gameState.hits}/${gameState.targetHits}`;

  return `
    <div class="mini-game">
      <div class="art-board gel-board">
        <div class="timing-track">
          <span class="perfect-zone" style="left:${gameState.perfectMin}%; width:${gameState.perfectMax - gameState.perfectMin}%"></span>
          <span class="marker" style="left:${marker}%"></span>
        </div>
      </div>
      <p class="hint">초록 존에 마커가 들어왔을 때 스페이스바를 누르세요. 성공 ${successText}</p>
      <div class="progress"><span style="width:${(gameState.hits / gameState.targetHits) * 100}%"></span></div>
    </div>
  `;
};

const snowMarkup = () => {
  const phaseLabel = gameState.phase === 1 ? "냉각" : "분쇄";
  const current = gameState.phase === 1 ? gameState.freezeClicks : gameState.crushClicks;
  const target = gameState.phase === 1 ? gameState.freezeTarget : gameState.crushTarget;
  const progress = Math.round((current / target) * 100);

  return `
    <div class="mini-game">
      <div class="art-board snow-board" data-action="snow-tap">
        <div class="tube"></div>
        <div class="snow-pile ${gameState.phase === 2 ? "ready" : ""}"></div>
      </div>
      <p class="hint">현재 단계: ${phaseLabel}. 아이콘/화면을 빠르게 연타하세요. (${current}/${target})</p>
      <div class="progress"><span style="width:${progress}%"></span></div>
    </div>
  `;
};

const renderPlay = () => {
  if (!activeRecipe) return "";

  let gameMarkup = "";
  if (activeRecipe.id === "apple") gameMarkup = appleMarkup();
  if (activeRecipe.id === "foam") gameMarkup = foamMarkup();
  if (activeRecipe.id === "gel") gameMarkup = gelMarkup();
  if (activeRecipe.id === "snow") gameMarkup = snowMarkup();

  return `
    <main class="screen play-screen">
      <div class="panel">
        <div class="play-top">
          <h2>${activeRecipe.name}</h2>
        </div>
        <p class="objective">${activeRecipe.objective}</p>
        ${finished ? '<div class="status-row"><span>실험 성공</span></div>' : ""}
        ${gameMarkup}
        <div class="action-row">
          <button class="ghost-btn" data-action="menu">메뉴로</button>
          ${finished ? '<button class="primary-btn" data-action="retry">다시 만들기</button>' : ""}
        </div>
      </div>
    </main>
  `;
};

const render = () => {
  if (!app) return;

  if (stage === "intro") {
    app.innerHTML = `
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
    `;
    return;
  }

  if (stage === "menu") {
    app.innerHTML = `
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
            ${recipes
              .map(
                (recipe) => `
                <button class="recipe-btn" data-recipe="${recipe.id}">
                  ${recipe.name}
                </button>
              `,
              )
              .join("")}
          </div>
        </div>
      </main>
    `;
    return;
  }

  app.innerHTML = renderPlay();
};

document.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;

  const actionTarget = target.closest("[data-action]");
  const action = actionTarget instanceof HTMLElement ? actionTarget.dataset.action : undefined;

  if (action === "start") {
    goMenu();
    return;
  }

  if (action === "home") {
    goHome();
    return;
  }

  if (action === "menu") {
    goMenu();
    return;
  }

  if (action === "retry" && activeRecipe) {
    startRecipe(activeRecipe.id);
    return;
  }

  if (!activeRecipe || stage !== "play") {
    const recipeTarget = target.closest("[data-recipe]");
    const recipeId = recipeTarget instanceof HTMLElement ? recipeTarget.dataset.recipe : undefined;
    if (recipeId) startRecipe(recipeId);
    return;
  }

  if (finished) return;

  if (action === "apple-step" && activeRecipe.id === "apple") {
    if (gameState.phase !== "input") return;

    const stepIndex = Number(actionTarget?.dataset.index);
    if (Number.isNaN(stepIndex)) return;

    const expected = gameState.sequence[gameState.inputIndex];
    const success = stepIndex === expected;

    gameState.pressedIndex = stepIndex;
    gameState.pressedState = success ? "good" : "bad";

    if (runtime.applePressTimer) clearTimeout(runtime.applePressTimer);
    runtime.applePressTimer = setTimeout(() => {
      gameState.pressedIndex = -1;
      gameState.pressedState = "";
      render();
    }, 180);

    if (success) {
      gameState.inputIndex += 1;

      if (gameState.inputIndex >= gameState.sequence.length) {
        gameState.message = "레시피 숙지 완료!";
        completeRecipe(35);
        return;
      }

      gameState.message = `좋아요! 다음 문장을 고르세요. (${gameState.inputIndex}/${gameState.sequence.length})`;
      render();
      return;
    }

    gameState.inputIndex = 0;
    gameState.shuffledOrder = shuffleArray(gameState.sequence);
    gameState.message = "순서가 달라요. 카드를 다시 섞었어요. 처음부터 다시!";
    gameState.phase = "preview";
    render();
    runtime.applePreviewTimer = setTimeout(() => {
      startApplePreview();
    }, 700);
    return;
  }

  if (action === "snow-tap" && activeRecipe.id === "snow") {
    if (gameState.phase === 1) {
      gameState.freezeClicks += 1;
      if (gameState.freezeClicks >= gameState.freezeTarget) {
        gameState.phase = 2;
      }
      render();
      return;
    }

    gameState.crushClicks += 1;
    if (gameState.crushClicks >= gameState.crushTarget) {
      completeRecipe(30);
      return;
    }

    render();
  }

  const recipeTarget = target.closest("[data-recipe]");
  const recipeId = recipeTarget instanceof HTMLElement ? recipeTarget.dataset.recipe : undefined;
  if (recipeId) startRecipe(recipeId);
});

document.addEventListener("pointermove", (event) => {
  if (stage !== "play" || !activeRecipe || activeRecipe.id !== "foam" || finished) return;

  const board = document.querySelector(".foam-board");
  if (!(board instanceof HTMLElement)) return;

  const rect = board.getBoundingClientRect();
  const inside =
    event.clientX >= rect.left &&
    event.clientX <= rect.right &&
    event.clientY >= rect.top &&
    event.clientY <= rect.bottom;
  if (!inside) {
    gameState.lastAngle = null;
    return;
  }

  const px = ((event.clientX - rect.left) / rect.width) * 100;
  const py = ((event.clientY - rect.top) / rect.height) * 100;
  gameState.cursorX = Math.max(0, Math.min(100, px));
  gameState.cursorY = Math.max(0, Math.min(100, py));

  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const dx = event.clientX - centerX;
  const dy = event.clientY - centerY;
  const distance = Math.hypot(dx, dy);

  const minDimension = Math.min(rect.width, rect.height);
  const innerRadius = minDimension * 0.16;
  const outerRadius = minDimension * 0.26;
  const onRing = distance >= innerRadius && distance <= outerRadius;

  if (!onRing) {
    gameState.lastAngle = null;
    render();
    return;
  }

  const angle = Math.atan2(dy, dx);
  if (gameState.lastAngle !== null) {
    let delta = angle - gameState.lastAngle;
    if (delta > Math.PI) delta -= Math.PI * 2;
    if (delta < -Math.PI) delta += Math.PI * 2;

    const spin = Math.abs(delta);
    if (spin <= 1.2) {
      gameState.progress = Math.min(100, gameState.progress + spin * 16);
      gameState.bubbles = Math.min(24, Math.floor(gameState.progress / 4));
    }
  }
  gameState.lastAngle = angle;

  if (gameState.progress >= 100) {
    completeRecipe(32);
    return;
  }

  render();
});

document.addEventListener("keydown", (event) => {
  if (event.code !== "Space") return;
  if (event.repeat) return;
  if (stage !== "play" || !activeRecipe || activeRecipe.id !== "gel" || finished) return;

  event.preventDefault();

  const isPerfect = gameState.marker >= gameState.perfectMin && gameState.marker <= gameState.perfectMax;

  if (isPerfect) {
    gameState.hits += 1;

    if (gameState.hits >= gameState.targetHits) {
      completeRecipe(35);
      return;
    }
  }

  render();
});

render();
