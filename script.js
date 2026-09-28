/**
 * 「似是而非」速答挑戰 — Game Engine
 * 完全依照規範：
 * - True 題：選對 +10 / 選錯 -10，直接下一題
 * - False 題：選 True → -10 直接下一題
 *           選 False → +10，再進入進階四選一（答對再 +10，答錯 +0）
 * - 分數下限 0
 * - 速答 10 秒、進階 15 秒
 */

(function () {
  'use strict';

  const TIME_TF = 10;      // 速答階段秒數
  const TIME_ADV = 15;     // 進階四選一秒數
  const POINTS = 10;

  // State
  let queue = [];
  let idx = 0;
  let score = 0;
  let correctFirst = 0;    // 第一階段答對數
  let totalFirst = 0;
  let correctAdv = 0;
  let totalAdv = 0;
  let totalTime = 0;
  let timerId = null;
  let timeLeft = 0;
  let stageStart = 0;
  let locked = false;
  let currentQ = null;

  // DOM
  const screens = {
    home: document.getElementById('home'),
    game: document.getElementById('game'),
    results: document.getElementById('results')
  };

  const $ = (id) => document.getElementById(id);
  const els = {
    score: $('score'),
    timer: $('timer'),
    timerRing: $('timer-ring'),
    progress: $('progress'),
    category: $('category'),
    statement: $('statement'),
    stageTf: $('stage-tf'),
    stageAdv: $('stage-adv'),
    advPrompt: $('adv-prompt'),
    advOptions: $('adv-options'),
    feedback: $('feedback'),
    btnTrue: $('btn-true'),
    btnFalse: $('btn-false'),
    finalScore: $('final-score'),
    finalAcc: $('final-acc'),
    finalTime: $('final-time'),
    verdict: $('verdict'),
    btnStart: $('btn-start'),
    btnAgain: $('btn-again'),
    btnHome: $('btn-home')
  };

  function show(name) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[name].classList.add('active');
  }

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function clampScore(v) {
    return Math.max(0, v);
  }

  function stopTimer() {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
  }

  function startTimer(seconds, onTimeout) {
    stopTimer();
    timeLeft = seconds;
    stageStart = Date.now();
    els.timer.textContent = timeLeft;
    els.timerRing.classList.remove('urgent');

    timerId = setInterval(() => {
      timeLeft--;
      els.timer.textContent = Math.max(0, timeLeft);
      if (timeLeft <= 3) els.timerRing.classList.add('urgent');
      if (timeLeft <= 0) {
        stopTimer();
        onTimeout();
      }
    }, 1000);
  }

  function addTimeUsed() {
    const elapsed = Math.min(
      (currentQ && locked === false ? TIME_TF : TIME_ADV),
      Math.round((Date.now() - stageStart) / 1000)
    );
    totalTime += elapsed;
  }

  // ----- Game flow -----
  function startGame() {
    const bank = (window.QUESTIONS && Array.isArray(window.QUESTIONS)) ? window.QUESTIONS : [];
    if (!bank.length) {
      alert('題庫為空，請先在 questions.js 加入題目');
      return;
    }
    queue = shuffle(bank);
    idx = 0;
    score = 0;
    correctFirst = 0;
    totalFirst = 0;
    correctAdv = 0;
    totalAdv = 0;
    totalTime = 0;
    locked = false;
    show('game');
    loadQuestion();
  }

  function loadQuestion() {
    locked = false;
    currentQ = queue[idx];
    els.feedback.classList.add('hidden');
    els.feedback.innerHTML = '';
    els.stageAdv.classList.add('hidden');
    els.stageTf.classList.remove('hidden');

    els.category.textContent = currentQ.category || '—';
    els.statement.textContent = currentQ.statement;
    els.score.textContent = score;
    els.progress.textContent = `${idx + 1}/${queue.length}`;

    els.btnTrue.disabled = false;
    els.btnFalse.disabled = false;

    startTimer(TIME_TF, () => handleTF(null)); // timeout = wrong
  }

  function handleTF(choice) {
    // choice: true / false / null (timeout)
    if (locked) return;
    locked = true;
    stopTimer();
    addTimeUsed();

    els.btnTrue.disabled = true;
    els.btnFalse.disabled = true;

    totalFirst++;
    const isTrueStatement = currentQ.isTrue;
    let firstCorrect = false;

    if (choice === null) {
      // 超時視同答錯
      score = clampScore(score - POINTS);
      showFeedback(false, '時間到！', false);
      setTimeout(nextOrEnd, 1800);
      return;
    }

    if (isTrueStatement) {
      // True 題
      if (choice === true) {
        firstCorrect = true;
        correctFirst++;
        score += POINTS;
        showFeedback(true, null, false);
        setTimeout(nextOrEnd, 2200);
      } else {
        score = clampScore(score - POINTS);
        showFeedback(false, null, false);
        setTimeout(nextOrEnd, 2200);
      }
    } else {
      // False 題
      if (choice === true) {
        // 誤信迷思
        score = clampScore(score - POINTS);
        showFeedback(false, null, false);
        setTimeout(nextOrEnd, 2200);
      } else {
        // 成功識破！
        firstCorrect = true;
        correctFirst++;
        score += POINTS;
        els.score.textContent = score;
        // 進入進階
        enterAdvanced();
      }
    }
    els.score.textContent = score;
  }

  function enterAdvanced() {
    els.stageTf.classList.add('hidden');
    els.stageAdv.classList.remove('hidden');
    els.advPrompt.textContent = currentQ.advancedQuestion || '那麼實際真相是什麼？';

    els.advOptions.innerHTML = '';
    const letters = ['A', 'B', 'C', 'D'];
    currentQ.options.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'opt-btn';
      btn.innerHTML = `<span class="letter">${letters[i]}.</span>${opt}`;
      btn.addEventListener('click', () => handleAdv(i));
      els.advOptions.appendChild(btn);
    });

    locked = false;
    startTimer(TIME_ADV, () => handleAdv(null));
  }

  function handleAdv(selected) {
    if (locked) return;
    locked = true;
    stopTimer();
    addTimeUsed();

    totalAdv++;
    const buttons = els.advOptions.querySelectorAll('.opt-btn');
    buttons.forEach((b, i) => {
      b.disabled = true;
      if (i === currentQ.correct) b.classList.add('correct');
      if (selected !== null && i === selected && i !== currentQ.correct) b.classList.add('wrong');
    });

    let advCorrect = false;
    if (selected !== null && selected === currentQ.correct) {
      advCorrect = true;
      correctAdv++;
      score += POINTS;
      els.score.textContent = score;
    }
    // 答錯或超時：不加也不扣（保護第一階段分數）

    showFeedback(advCorrect, null, true);
    // 玩家需點「下一題」才繼續（閱讀解釋）
  }

  function showFeedback(isGood, customMsg, isAdv) {
    els.feedback.classList.remove('hidden');
    els.feedback.className = 'feedback ' + (isGood ? 'ok' : 'bad');

    let html = '';
    if (customMsg) {
      html += `<div>${customMsg}</div>`;
    } else if (isAdv) {
      html += `<div>${isGood ? '進階答對！+10' : '進階未中，但第一階段分數已保留'}</div>`;
    } else {
      html += `<div>${isGood ? '答對！+10' : '答錯 -10'}</div>`;
    }

    html += `<div style="margin-top:0.45rem">${currentQ.explanation}</div>`;
    if (currentQ.funFact) {
      html += `<div class="fun">💡 ${currentQ.funFact}</div>`;
    }

    // 進階階段結束後，給「下一題」按鈕讓玩家讀完再走
    if (isAdv || (!currentQ.isTrue && isGood === false) || currentQ.isTrue) {
      // 對於 True 題或 False 選錯，自動跳；進階則手動
      if (isAdv) {
        html += `<button class="btn primary next-btn" id="btn-next">下一題</button>`;
        els.feedback.innerHTML = html;
        document.getElementById('btn-next').addEventListener('click', nextOrEnd);
        return;
      }
    }

    els.feedback.innerHTML = html;
  }

  function nextOrEnd() {
    idx++;
    if (idx >= queue.length) {
      endGame();
    } else {
      loadQuestion();
    }
  }

  function endGame() {
    stopTimer();
    show('results');

    els.finalScore.textContent = score;
    els.finalTime.textContent = totalTime + 's';

    // 準確率：第一階段 + 進階階段綜合
    const totalAttempts = totalFirst + totalAdv;
    const totalHits = correctFirst + correctAdv;
    const acc = totalAttempts ? Math.round((totalHits / totalAttempts) * 100) : 0;
    els.finalAcc.textContent = acc + '%';

    let verdict = '';
    if (acc >= 90) verdict = '神話終結者！你幾乎識破所有迷思。';
    else if (acc >= 70) verdict = '優秀偵探，真相大多逃不過你的眼睛。';
    else if (acc >= 50) verdict = '還不錯，繼續累積知識就能成為達人。';
    else verdict = '迷思還在潜伏，再挑戰一次吧！';
    els.verdict.textContent = verdict;
  }

  // Events
  els.btnStart.addEventListener('click', startGame);
  els.btnAgain.addEventListener('click', startGame);
  els.btnHome.addEventListener('click', () => {
    stopTimer();
    show('home');
  });
  els.btnTrue.addEventListener('click', () => handleTF(true));
  els.btnFalse.addEventListener('click', () => handleTF(false));

  document.addEventListener('dblclick', e => e.preventDefault(), { passive: false });
})();
