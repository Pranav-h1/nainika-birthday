/* =========================================================
   Nainika's 6th Birthday — Interactions
   Vanilla JS. No dependencies. No frameworks.
   ========================================================= */
(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------
     Utility
  --------------------------------------------------------- */
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $all(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function rand(min, max) { return Math.random() * (max - min) + min; }
  function randInt(min, max) { return Math.floor(rand(min, max + 1)); }
  function pick(arr) { return arr[randInt(0, arr.length - 1)]; }
  function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }

  /* ===========================================================
     CONFETTI SYSTEM
     Lightweight DOM-based confetti with auto-cleanup.
  =========================================================== */
  var confettiLayer = $("#confetti-layer");
  var CONFETTI_COLORS = ["#ff8fb1", "#c9b6ff", "#7fd4ff", "#ffd166", "#ff6f91", "#b39ddb"];
  var CONFETTI_SHAPES = ["circle", "square", "ribbon"];

  function launchConfetti(opts) {
    if (!confettiLayer) return;
    opts = opts || {};
    var count = prefersReducedMotion ? Math.min(18, opts.count || 40) : (opts.count || 60);
    var originX = opts.originX != null ? opts.originX : 50; // % of viewport width
    var spread = opts.spread || 100;
    var duration = opts.duration || 3200;

    for (var i = 0; i < count; i++) {
      (function () {
        var piece = document.createElement("span");
        piece.className = "confetti-piece";
        var shape = pick(CONFETTI_SHAPES);
        var color = pick(CONFETTI_COLORS);
        var size = rand(6, 12);
        var startX = clamp(originX + rand(-spread / 2, spread / 2), 0, 100);
        var fallDistance = window.innerHeight + 80;
        var driftX = rand(-90, 90);
        var rotateStart = rand(0, 360);
        var rotateEnd = rotateStart + rand(180, 720) * (Math.random() < 0.5 ? -1 : 1);
        var fallDuration = rand(duration * 0.7, duration * 1.3);
        var delay = rand(0, 300);

        piece.style.left = startX + "%";
        piece.style.width = size + "px";
        piece.style.height = (shape === "ribbon" ? size * 2.4 : size) + "px";
        piece.style.background = color;
        piece.style.borderRadius = shape === "circle" ? "50%" : shape === "square" ? "3px" : "2px";
        piece.style.opacity = "0.95";
        piece.style.transform = "translate3d(0,0,0) rotate(" + rotateStart + "deg)";
        piece.style.transition = "transform " + fallDuration + "ms cubic-bezier(0.25,0.46,0.45,0.94) " + delay + "ms, opacity " + fallDuration + "ms ease-in " + delay + "ms";

        confettiLayer.appendChild(piece);

        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            piece.style.transform = "translate3d(" + driftX + "px," + fallDistance + "px,0) rotate(" + rotateEnd + "deg)";
            piece.style.opacity = "0";
          });
        });

        setTimeout(function () {
          if (piece.parentNode) piece.parentNode.removeChild(piece);
        }, fallDuration + delay + 200);
      })();
    }
  }

  /* ===========================================================
     NAVIGATION
  =========================================================== */
  var navToggle = $("#navToggle");
  var navLinks = $("#navLinks");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      var isOpen = navLinks.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
    $all(".nav-pill", navLinks).forEach(function (link) {
      link.addEventListener("click", function () {
        navLinks.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ===========================================================
     HERO: Open the Magic
  =========================================================== */
  var openMagicBtn = $("#openMagicBtn");
  if (openMagicBtn) {
    openMagicBtn.addEventListener("click", function () {
      launchConfetti({ count: 90, originX: 50, spread: 140 });
      playChime();
      var target = $("#memories") || document.querySelector(".music-section");
      if (target) {
        setTimeout(function () {
          target.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
        }, 350);
      }
    });
  }
  var scrollHintBtn = $("#scrollHintBtn");
  if (scrollHintBtn) {
    scrollHintBtn.addEventListener("click", function () {
      var next = document.querySelector(".music-section");
      if (next) next.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
    });
  }

  /* ===========================================================
     AUDIO: tiny celebratory chime + birthday melody (Web Audio API)
  =========================================================== */
  var audioCtx = null;
  function getAudioCtx() {
    try {
      if (!audioCtx) {
        var Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return null;
        audioCtx = new Ctx();
      }
      if (audioCtx.state === "suspended") audioCtx.resume();
      return audioCtx;
    } catch (e) {
      return null;
    }
  }

  function playChime() {
    try {
      var ctx = getAudioCtx();
      if (!ctx) return;
      var notes = [523.25, 659.25, 783.99]; // C5 E5 G5
      var t = ctx.currentTime;
      notes.forEach(function (freq, i) {
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.0001, t + i * 0.09);
        gain.gain.linearRampToValueAtTime(0.14, t + i * 0.09 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.09 + 0.35);
        osc.connect(gain).connect(ctx.destination);
        osc.start(t + i * 0.09);
        osc.stop(t + i * 0.09 + 0.4);
      });
    } catch (e) { /* ignore audio errors */ }
  }

  // Simple birthday-style melody: note (Hz) + duration (beats)
  var MELODY = [
    [392.00, 0.75], [392.00, 0.25], [440.00, 1], [392.00, 1], [523.25, 1], [493.88, 2],
    [392.00, 0.75], [392.00, 0.25], [440.00, 1], [392.00, 1], [587.33, 1], [523.25, 2],
    [392.00, 0.75], [392.00, 0.25], [783.99, 1], [659.25, 1], [523.25, 1], [493.88, 1], [440.00, 2],
    [698.46, 0.75], [698.46, 0.25], [659.25, 1], [523.25, 1], [587.33, 1], [523.25, 2]
  ];

  var musicState = { playing: false, timeouts: [], mode: null, mp3Checked: false, mp3Available: false };
  var bgAudio = $("#bgAudio");
  var musicBtn = $("#musicBtn");
  var equalizer = $("#equalizer");

  function clearMelodyTimeouts() {
    musicState.timeouts.forEach(function (id) { clearTimeout(id); });
    musicState.timeouts = [];
  }

  function scheduleMelody() {
    var ctx = getAudioCtx();
    if (!ctx) return;
    var t = ctx.currentTime + 0.05;
    var beatMs = 340;
    var elapsed = 0;
    MELODY.forEach(function (note) {
      var freq = note[0];
      var beats = note[1];
      var dur = beats * beatMs / 1000;
      var startAt = t + elapsed;
      try {
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.0001, startAt);
        gain.gain.linearRampToValueAtTime(0.16, startAt + 0.04);
        gain.gain.setValueAtTime(0.16, startAt + dur * 0.6);
        gain.gain.exponentialRampToValueAtTime(0.0001, startAt + dur);
        osc.connect(gain).connect(ctx.destination);
        osc.start(startAt);
        osc.stop(startAt + dur + 0.02);
      } catch (e) { /* ignore */ }
      elapsed += beats * beatMs / 1000;
    });
    var totalMs = elapsed * 1000;
    var loopId = setTimeout(function () {
      if (musicState.playing && musicState.mode === "synth") scheduleMelody();
    }, totalMs);
    musicState.timeouts.push(loopId);
  }

  function setEqualizer(on) {
    if (equalizer) equalizer.classList.toggle("playing", !!on);
  }
  function setMusicButtonState(playing) {
    if (!musicBtn) return;
    musicBtn.setAttribute("aria-pressed", playing ? "true" : "false");
    var label = musicBtn.querySelector(".music-label");
    var icon = musicBtn.querySelector(".music-icon");
    if (label) label.textContent = playing ? "Pause Music" : "Birthday Music";
    if (icon) icon.textContent = playing ? "⏸️" : "🎵";
    setEqualizer(playing);
  }

  function checkMp3Availability(cb) {
    if (musicState.mp3Checked) { cb(musicState.mp3Available); return; }
    if (!bgAudio) { musicState.mp3Checked = true; musicState.mp3Available = false; cb(false); return; }
    var settled = false;
    function done(ok) {
      if (settled) return;
      settled = true;
      musicState.mp3Checked = true;
      musicState.mp3Available = ok;
      cb(ok);
    }
    bgAudio.addEventListener("error", function () { done(false); }, { once: true });
    bgAudio.addEventListener("loadedmetadata", function () { done(true); }, { once: true });
    try {
      bgAudio.load();
    } catch (e) { done(false); }
    // Safety timeout in case neither event fires (e.g. file:// restrictions)
    setTimeout(function () { done(false); }, 1200);
  }

  function startMusic() {
    checkMp3Availability(function (mp3Ok) {
      if (mp3Ok && bgAudio) {
        musicState.mode = "mp3";
        bgAudio.currentTime = 0;
        var playPromise = bgAudio.play();
        if (playPromise && playPromise.catch) {
          playPromise.catch(function () {
            // Autoplay/file issue — fall back to synth melody
            musicState.mode = "synth";
            scheduleMelody();
          });
        }
      } else {
        musicState.mode = "synth";
        var ctx = getAudioCtx();
        if (!ctx) return; // Web Audio unsupported — silently no-op
        scheduleMelody();
      }
      musicState.playing = true;
      setMusicButtonState(true);
    });
  }

  function stopMusic() {
    musicState.playing = false;
    clearMelodyTimeouts();
    if (bgAudio) {
      try { bgAudio.pause(); } catch (e) { /* ignore */ }
    }
    setMusicButtonState(false);
  }

  if (musicBtn) {
    musicBtn.addEventListener("click", function () {
      if (musicState.playing) stopMusic();
      else startMusic();
    });
  }
  if (bgAudio) {
    bgAudio.addEventListener("ended", function () {
      if (musicState.mode === "mp3") { musicState.playing = false; setMusicButtonState(false); }
    });
  }

  /* ===========================================================
     BIRTHDAY CARD FLIP
  =========================================================== */
  var birthdayCard = $("#birthdayCard");
  if (birthdayCard) {
    birthdayCard.addEventListener("click", function () {
      var isOpen = birthdayCard.getAttribute("aria-expanded") === "true";
      birthdayCard.setAttribute("aria-expanded", isOpen ? "false" : "true");
      if (!isOpen) {
        launchConfetti({ count: 30, originX: 50, spread: 60, duration: 2400 });
      }
    });
  }

  /* ===========================================================
     SCROLL REVEAL (IntersectionObserver)
  =========================================================== */
  var revealEls = $all(".reveal");
  if (revealEls.length) {
    if ("IntersectionObserver" in window && !prefersReducedMotion) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
      revealEls.forEach(function (el) { io.observe(el); });
    } else {
      revealEls.forEach(function (el) { el.classList.add("is-visible"); });
    }
  }

  /* ===========================================================
     GAME 1 — POP THE BALLOONS
  =========================================================== */
  (function balloonGame() {
    var stage = $("#balloonStage");
    var scoreEl = $("#balloonScore");
    var startBtn = $("#balloonStartBtn");
    var restartBtn = $("#balloonRestartBtn");
    var idleMsg = $("#balloonIdleMsg");
    if (!stage) return;

    var GOAL = 10;
    var COLORS = ["#ff8fb1", "#c9b6ff", "#7fd4ff", "#ffd166", "#ff6f91", "#9b7ee8"];
    var score = 0;
    var spawnTimer = null;
    var running = false;
    var activeBalloons = [];

    function updateScore() {
      if (scoreEl) scoreEl.textContent = "Score: " + score + " / " + GOAL;
    }

    function clearStage() {
      activeBalloons.forEach(function (b) {
        if (b.el && b.el.parentNode) b.el.parentNode.removeChild(b.el);
        if (b.raf) cancelAnimationFrame(b.raf);
      });
      activeBalloons = [];
      $all(".game-complete-msg", stage).forEach(function (m) { m.remove(); });
    }

    function spawnBalloon() {
      if (!running) return;
      var el = document.createElement("button");
      el.type = "button";
      el.className = "game-balloon";
      el.setAttribute("aria-label", "Pop balloon");
      var stageWidth = stage.clientWidth || 300;
      var left = rand(20, Math.max(21, stageWidth - 76));
      el.style.left = left + "px";
      el.style.setProperty("--balloon-color", pick(COLORS));

      var stageHeight = stage.clientHeight || 380;
      var duration = rand(prefersReducedMotion ? 8 : 5.5, prefersReducedMotion ? 11 : 8.5);
      var startTime = null;
      var record = { el: el, popped: false, raf: null };

      function frame(ts) {
        if (!startTime) startTime = ts;
        var elapsed = (ts - startTime) / 1000;
        var progress = elapsed / duration;
        if (progress >= 1 || record.popped) {
          if (!record.popped && el.parentNode) el.parentNode.removeChild(el);
          var idx = activeBalloons.indexOf(record);
          if (idx > -1) activeBalloons.splice(idx, 1);
          return;
        }
        var y = -progress * (stageHeight + 100);
        var wobble = Math.sin(elapsed * 2 + left) * 12;
        el.style.transform = "translate(" + wobble + "px," + y + "px)";
        record.raf = requestAnimationFrame(frame);
      }
      record.raf = requestAnimationFrame(frame);

      function pop() {
        if (record.popped || !running) return;
        record.popped = true;
        el.classList.add("pop");
        el.disabled = true;
        score++;
        updateScore();
        var rect = el.getBoundingClientRect();
        launchConfetti({ count: 10, originX: (rect.left / window.innerWidth) * 100, spread: 20, duration: 1400 });
        setTimeout(function () {
          if (el.parentNode) el.parentNode.removeChild(el);
          var idx = activeBalloons.indexOf(record);
          if (idx > -1) activeBalloons.splice(idx, 1);
        }, 380);

        if (score >= GOAL) {
          finishGame();
        }
      }

      el.addEventListener("click", pop);
      stage.appendChild(el);
      activeBalloons.push(record);
    }

    function finishGame() {
      running = false;
      if (spawnTimer) clearInterval(spawnTimer);
      activeBalloons.forEach(function (b) {
        if (b.raf) cancelAnimationFrame(b.raf);
        if (b.el && b.el.parentNode) b.el.parentNode.removeChild(b.el);
      });
      activeBalloons = [];
      var msg = document.createElement("div");
      msg.className = "game-complete-msg";
      msg.innerHTML = '<span style="font-size:2.4rem;">🎉</span><span class="big-msg">All popped!</span><p>You reached ' + GOAL + '/' + GOAL + ' — amazing!</p>';
      stage.appendChild(msg);
      launchConfetti({ count: 80, spread: 120 });
      restartBtn.hidden = false;
      startBtn.hidden = true;
    }

    function startGame() {
      score = 0;
      updateScore();
      clearStage();
      if (idleMsg) idleMsg.remove();
      running = true;
      startBtn.hidden = true;
      restartBtn.hidden = false;
      var interval = prefersReducedMotion ? 1400 : 900;
      spawnBalloon();
      spawnTimer = setInterval(spawnBalloon, interval);
    }

    function resetGame() {
      running = false;
      if (spawnTimer) clearInterval(spawnTimer);
      clearStage();
      score = 0;
      updateScore();
      startGame();
    }

    startBtn.addEventListener("click", startGame);
    restartBtn.addEventListener("click", resetGame);
    updateScore();
  })();

  /* ===========================================================
     GAME 2 — CATCH THE STARS
  =========================================================== */
  (function starGame() {
    var stage = $("#starStage");
    var scoreEl = $("#starScore");
    var startBtn = $("#starStartBtn");
    var restartBtn = $("#starRestartBtn");
    var idleMsg = $("#starIdleMsg");
    if (!stage) return;

    var GOAL = 15;
    var GLYPHS = ["⭐", "✨", "🌟"];
    var score = 0;
    var running = false;
    var spawnTimer = null;
    var elapsedSeconds = 0;
    var difficultyTimer = null;
    var activeStars = [];
    var currentInterval = 1100;

    function updateScore() {
      if (scoreEl) scoreEl.textContent = "Score: " + score + " / " + GOAL;
    }

    function clearStage() {
      activeStars.forEach(function (s) {
        if (s.raf) cancelAnimationFrame(s.raf);
        if (s.el && s.el.parentNode) s.el.parentNode.removeChild(s.el);
      });
      activeStars = [];
      $all(".game-complete-msg", stage).forEach(function (m) { m.remove(); });
    }

    function spawnStar() {
      if (!running) return;
      var el = document.createElement("button");
      el.type = "button";
      el.className = "game-star";
      el.setAttribute("aria-label", "Catch star");
      el.textContent = pick(GLYPHS);
      var stageWidth = stage.clientWidth || 300;
      var left = rand(10, Math.max(11, stageWidth - 40));
      el.style.left = left + "px";

      var stageHeight = stage.clientHeight || 380;
      var duration = rand(prefersReducedMotion ? 5 : 3, prefersReducedMotion ? 7 : 4.6);
      var startTime = null;
      var record = { el: el, caught: false, raf: null };

      function frame(ts) {
        if (!startTime) startTime = ts;
        var elapsed = (ts - startTime) / 1000;
        var progress = elapsed / duration;
        if (progress >= 1 || record.caught) {
          if (!record.caught && el.parentNode) el.parentNode.removeChild(el);
          var idx = activeStars.indexOf(record);
          if (idx > -1) activeStars.splice(idx, 1);
          return;
        }
        var y = progress * (stageHeight + 60);
        el.style.transform = "translateY(" + y + "px) rotate(" + (progress * 200) + "deg)";
        record.raf = requestAnimationFrame(frame);
      }
      record.raf = requestAnimationFrame(frame);

      function catchStar() {
        if (record.caught || !running) return;
        record.caught = true;
        el.classList.add("caught");
        el.disabled = true;
        score++;
        updateScore();
        setTimeout(function () {
          if (el.parentNode) el.parentNode.removeChild(el);
          var idx = activeStars.indexOf(record);
          if (idx > -1) activeStars.splice(idx, 1);
        }, 400);
        if (score >= GOAL) finishGame();
      }

      el.addEventListener("click", catchStar);
      stage.appendChild(el);
      activeStars.push(record);
    }

    function finishGame() {
      running = false;
      if (spawnTimer) clearInterval(spawnTimer);
      if (difficultyTimer) clearInterval(difficultyTimer);
      activeStars.forEach(function (s) {
        if (s.raf) cancelAnimationFrame(s.raf);
        if (s.el && s.el.parentNode) s.el.parentNode.removeChild(s.el);
      });
      activeStars = [];
      var msg = document.createElement("div");
      msg.className = "game-complete-msg";
      msg.innerHTML = '<span style="font-size:2.4rem;">🌟</span><span class="big-msg">STAR CATCHER!</span><p>You caught all ' + GOAL + ' stars!</p>';
      stage.appendChild(msg);
      launchConfetti({ count: 80, spread: 120 });
      restartBtn.hidden = false;
      startBtn.hidden = true;
    }

    function startGame() {
      score = 0;
      elapsedSeconds = 0;
      currentInterval = 1100;
      updateScore();
      clearStage();
      if (idleMsg) idleMsg.remove();
      running = true;
      startBtn.hidden = true;
      restartBtn.hidden = false;

      function scheduleNext() {
        if (!running) return;
        spawnStar();
        spawnTimer = setTimeout(scheduleNext, currentInterval);
      }
      scheduleNext();

      difficultyTimer = setInterval(function () {
        elapsedSeconds += 1;
        currentInterval = Math.max(prefersReducedMotion ? 700 : 480, currentInterval - 35);
      }, 1000);
    }

    function resetGame() {
      running = false;
      if (spawnTimer) clearTimeout(spawnTimer);
      if (difficultyTimer) clearInterval(difficultyTimer);
      clearStage();
      startGame();
    }

    startBtn.addEventListener("click", startGame);
    restartBtn.addEventListener("click", resetGame);
    updateScore();
  })();

  /* ===========================================================
     GAME 3 — MYSTERY PRESENT
  =========================================================== */
  (function mysteryGift() {
    var giftBox = $("#giftBox");
    var giftMessage = $("#giftMessage");
    if (!giftBox) return;

    var MESSAGES = [
      "✨ Birthday power unlocked!",
      "🦄 A unicorn officially approves this birthday.",
      "🎂 Cake time!",
      "💖 You make every day brighter.",
      "🌈 Somewhere, a rainbow just got extra colorful for you.",
      "🎉 Confetti cannons are now legally required."
    ];
    var busy = false;

    giftBox.addEventListener("click", function () {
      if (busy) return;
      busy = true;
      giftBox.classList.add("opened");
      giftMessage.classList.remove("show");
      var msg = pick(MESSAGES);
      var rect = giftBox.getBoundingClientRect();
      launchConfetti({ count: 40, originX: (rect.left / window.innerWidth) * 100, spread: 50, duration: 2200 });

      setTimeout(function () {
        giftMessage.textContent = msg;
        giftMessage.classList.add("show");
      }, 200);

      setTimeout(function () {
        giftBox.classList.remove("opened");
        busy = false;
      }, 1800);
    });
  })();

  /* ===========================================================
     BIRTHDAY QUIZ
  =========================================================== */
  (function quiz() {
    var container = $("#quizContainer");
    var progressEl = $("#quizProgress");
    if (!container) return;

    var QUESTIONS = [
      {
        q: "What absolutely belongs at a birthday party?",
        options: ["A giant cake 🎂", "A snow shovel 🧤", "A sleepy textbook 📚"],
        correct: 0
      },
      {
        q: "What's the best way to blow out candles?",
        options: ["Ignore them completely", "Make a wish and blow! 🌬️", "Ask them politely to leave"],
        correct: 1
      },
      {
        q: "Which animal would make the silliest birthday guest?",
        options: ["A dancing penguin 🐧", "A regular rock 🪨", "An empty box 📦"],
        correct: 0
      },
      {
        q: "What sound does a party make?",
        options: ["Complete silence", "Balloons popping and giggles 🎈😄", "A vacuum cleaner"],
        correct: 1
      },
      {
        q: "How many candles for a 6th birthday?",
        options: ["Zero", "One hundred", "Six! 🕯️🕯️🕯️🕯️🕯️🕯️"],
        correct: 2
      }
    ];

    var current = 0;
    var answered = false;

    function render() {
      var total = QUESTIONS.length;
      if (current >= total) {
        if (progressEl) progressEl.textContent = "Complete!";
        container.innerHTML =
          '<div class="quiz-done">' +
            '<div class="big-msg">🎉 Quiz Complete!</div>' +
            '<p>You know exactly what makes a birthday great.</p>' +
          '</div>';
        launchConfetti({ count: 50, spread: 90 });
        return;
      }
      if (progressEl) progressEl.textContent = "Question " + (current + 1) + " / " + total;
      var data = QUESTIONS[current];
      answered = false;

      var html = '<div class="quiz-question">';
      html += '<p class="quiz-q-text">' + data.q + '</p>';
      html += '<div class="quiz-options" role="group" aria-label="Answer options">';
      data.options.forEach(function (opt, i) {
        html += '<button type="button" class="quiz-option" data-index="' + i + '">' + opt + '</button>';
      });
      html += '</div>';
      html += '<p class="quiz-feedback" aria-live="polite"></p>';
      html += '<button type="button" class="btn btn-secondary quiz-next-btn" hidden>Next Question →</button>';
      html += '</div>';
      container.innerHTML = html;

      var feedback = $(".quiz-feedback", container);
      var nextBtn = $(".quiz-next-btn", container);

      $all(".quiz-option", container).forEach(function (btn) {
        btn.addEventListener("click", function () {
          if (answered) return;
          answered = true;
          var idx = parseInt(btn.getAttribute("data-index"), 10);
          var allOptions = $all(".quiz-option", container);
          allOptions.forEach(function (b) { b.disabled = true; });

          if (idx === data.correct) {
            btn.classList.add("correct");
            feedback.textContent = "🎉 Correct! You got it!";
            feedback.className = "quiz-feedback correct-text";
            launchConfetti({ count: 24, originX: 50, spread: 60, duration: 1600 });
          } else {
            btn.classList.add("incorrect");
            allOptions[data.correct].classList.add("correct");
            feedback.textContent = "Almost! The right answer is highlighted. 💡";
            feedback.className = "quiz-feedback incorrect-text";
          }
          nextBtn.hidden = false;
          nextBtn.focus();
        });
      });

      nextBtn.addEventListener("click", function () {
        current++;
        render();
      });
    }

    render();
  })();

  /* ===========================================================
     FINALE: Celebrate Again
  =========================================================== */
  var celebrateAgainBtn = $("#celebrateAgainBtn");
  if (celebrateAgainBtn) {
    celebrateAgainBtn.addEventListener("click", function () {
      launchConfetti({ count: 120, spread: 160, duration: 3600 });
      launchConfetti({ count: 60, originX: 15, spread: 40, duration: 3000 });
      launchConfetti({ count: 60, originX: 85, spread: 40, duration: 3000 });
    });
  }

  /* ===========================================================
     Safety net: prevent uncaught errors from breaking the page
  =========================================================== */
  window.addEventListener("error", function () {
    // Swallow to avoid console spam breaking the experience for the user;
    // functionality is designed to degrade gracefully without this file.
  });

})();
