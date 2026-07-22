(function () {
  'use strict';

  /* =========================================================
     DATA
  ========================================================= */

  var topics = [
    'Viajes', 'Trabajo', 'Amor', 'Amistad', 'Familia', 'Dinero', 'Tecnología',
    'Mascotas', 'Comida', 'Estudios', 'Vacaciones', 'Mudanza', 'Fama', 'Compras',
    'Redes sociales', 'Hobbies', 'Deportes', 'Música', 'Cine', 'Emprendimientos',
    'Inventos', 'Descubrimientos', 'Casa', 'Vecinos', 'Transporte', 'Cumpleaños',
    'Moda', 'Salud', 'Sueños', 'Obsesiones', 'Superpoderes', 'Vida cotidiana',
    'Internet', 'Inteligencia artificial', 'Futuro laboral', 'Relaciones',
    'Nuevas habilidades', 'Decisiones extrañas', 'Éxito inesperado', 'Fracaso absurdo'
  ];

  var requiredElements = [
    'Un pato', 'Una pizza', 'Un robot', 'Un dinosaurio', 'Una media perdida',
    'Un cactus', 'Una paloma', 'Un extraterrestre', 'Un glitter', 'Una tostadora',
    'Un perro', 'Un gato', 'Una planta', 'Un fantasma', 'Un meteorito',
    'Una bicicleta', 'Un paraguas', 'Un disfraz', 'Una llamada inesperada',
    'Un mensaje enviado por error', 'Una canción', 'Un helado', 'Una celebridad',
    'Una abuela', 'Un vecino', 'Un insecto', 'Una valija', 'Una alarma',
    'Un espejo', 'Una llave', 'Una foto vieja', 'Un objeto inútil',
    'Una compra impulsiva', 'Una aplicación desconocida', 'Una discusión ridícula',
    'Un regalo inexplicable', 'Una confusión', 'Una mascota ajena',
    'Un tutorial de internet', 'Una máquina absurda'
  ];

  var contexts = [
    'En un ascensor', 'En la playa', 'Durante una boda', 'En un aeropuerto',
    'En otro país', 'En un supermercado', 'En una videollamada', 'En una fiesta',
    'Durante un apagón', 'En un recital', 'En una entrevista laboral', 'En una cita',
    'En una reunión familiar', 'En una estación de tren', 'En un hospital',
    'En una clase', 'En una oficina', 'Durante unas vacaciones', 'En la montaña',
    'En un baño público', 'En una fila', 'En un taxi', 'Durante una mudanza',
    'En una plaza', 'En un restaurante', 'En un museo', 'En un cumpleaños',
    'En una aplicación de citas', 'En una entrega de premios', 'En medio de una tormenta',
    'Durante un viaje', 'En una casa desconocida', 'En una reunión de trabajo',
    'Durante una transmisión en vivo', 'En una tienda', 'En una terraza',
    'En un karaoke', 'En un parque', 'En un hotel',
    'En una situación completamente cotidiana'
  ];

  var STORAGE_KEY = 'generadorFuturosBorders';
  var TARGETS = ['Lina', 'Yo'];

  /* =========================================================
     STATE
  ========================================================= */

  var gameState = {
    currentScreen: 1,
    firstTarget: null,
    currentTarget: null,
    completedTargets: [],
    currentChallenge: { topic: null, element: null, context: null },
    usedCombos: [],
    predictions: [],
    carouselFinished: false,
    draftText: ''
  };

  var isSaving = false;
  var pendingHomeAction = null;
  var isExportingImage = false;

  /* =========================================================
     PREDICTION IMAGE EXPORT
  ========================================================= */

  function pad2(n) {
    return n < 10 ? '0' + n : '' + n;
  }

  function predictionImageFileName() {
    var d = new Date();
    return 'prediccion-dudosa-' + d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate()) + '.png';
  }

  function captureSavedPredictionCanvas() {
    var screenEl = document.getElementById('screen-13');
    var node = screenEl ? $('.screen-inner', screenEl) : null;
    if (!screenEl || !node || typeof html2canvas !== 'function') {
      return Promise.reject(new Error('export target unavailable'));
    }
    var bg = window.getComputedStyle(screenEl).backgroundColor;
    return html2canvas(node, {
      backgroundColor: bg,
      scale: 2,
      useCORS: true,
      onclone: function (clonedDoc) {
        var clonedQuote = clonedDoc.getElementById('saved-prediction-text');
        if (clonedQuote) {
          clonedQuote.style.maxHeight = 'none';
          clonedQuote.style.overflow = 'visible';
        }
      }
    });
  }

  function canvasToPngBlob(canvas) {
    return new Promise(function (resolve, reject) {
      canvas.toBlob(function (blob) {
        if (blob) resolve(blob); else reject(new Error('toBlob failed'));
      }, 'image/png');
    });
  }

  function saveCurrentPredictionImage() {
    if (isExportingImage) return;
    isExportingImage = true;
    var btn = document.getElementById('save-image-btn');
    if (btn) btn.disabled = true;
    captureSavedPredictionCanvas()
      .then(canvasToPngBlob)
      .then(function (blob) {
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = predictionImageFileName();
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(function () { URL.revokeObjectURL(url); }, 2000);
      })
      .catch(function () { /* fallo silencioso: no exponemos errores técnicos al usuario */ })
      .then(function () {
        isExportingImage = false;
        if (btn) btn.disabled = false;
      });
  }

  function shareCurrentPredictionImage() {
    if (isExportingImage) return;
    isExportingImage = true;
    var btn = document.getElementById('share-image-btn');
    if (btn) btn.disabled = true;
    captureSavedPredictionCanvas()
      .then(canvasToPngBlob)
      .then(function (blob) {
        var file = new File([blob], predictionImageFileName(), { type: 'image/png' });
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
          return navigator.share({ files: [file], title: 'Generador de Futuros Borders' });
        }
      })
      .catch(function () { /* el usuario pudo cancelar el share, o no hay soporte: no mostramos error */ })
      .then(function () {
        isExportingImage = false;
        if (btn) btn.disabled = false;
      });
  }

  function canShareFiles() {
    if (!navigator.share || !navigator.canShare) return false;
    try {
      var testFile = new File(['test'], 'test.png', { type: 'image/png' });
      return navigator.canShare({ files: [testFile] });
    } catch (e) {
      return false;
    }
  }

  function setupImageExportUI() {
    var shareBtn = document.getElementById('share-image-btn');
    var fallbackMsg = document.getElementById('share-fallback-msg');
    if (!shareBtn) return;
    var supportsShare = canShareFiles();
    shareBtn.hidden = !supportsShare;
    if (fallbackMsg) fallbackMsg.hidden = supportsShare;
  }

  /* =========================================================
     PERSISTENCE
  ========================================================= */

  function saveGameState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
    } catch (e) {
      /* localStorage unavailable — game still works in-memory */
    }
  }

  function loadGameState() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      var saved = JSON.parse(raw);
      if (!saved || typeof saved !== 'object') return;
      gameState.firstTarget = saved.firstTarget || null;
      gameState.currentTarget = saved.currentTarget || null;
      gameState.completedTargets = Array.isArray(saved.completedTargets) ? saved.completedTargets : [];
      gameState.currentChallenge = saved.currentChallenge || { topic: null, element: null, context: null };
      gameState.usedCombos = Array.isArray(saved.usedCombos) ? saved.usedCombos : [];
      gameState.predictions = Array.isArray(saved.predictions) ? saved.predictions : [];
      gameState.draftText = typeof saved.draftText === 'string' ? saved.draftText : '';
      gameState.currentScreen = typeof saved.currentScreen === 'number' ? saved.currentScreen : 1;
    } catch (e) {
      /* corrupted state — start fresh */
    }
  }

  /* =========================================================
     HELPERS
  ========================================================= */

  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function comboKey(c) {
    return c.topic + '|' + c.element + '|' + c.context;
  }

  function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function otherTarget(target) {
    return target === 'Lina' ? 'Yo' : 'Lina';
  }

  function $(selector, scope) {
    return (scope || document).querySelector(selector);
  }

  function $all(selector, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
  }

  /* =========================================================
     CHALLENGE GENERATION
  ========================================================= */

  function generateChallenge(excludeCombo) {
    var challenge;
    var attempts = 0;
    do {
      challenge = {
        topic: pickRandom(topics),
        element: pickRandom(requiredElements),
        context: pickRandom(contexts)
      };
      attempts++;
    } while (excludeCombo && comboKey(challenge) === comboKey(excludeCombo) && attempts < 60);
    return challenge;
  }

  function resetCurrentChallenge() {
    gameState.currentChallenge = { topic: null, element: null, context: null };
    gameState.carouselFinished = false;
  }

  /* =========================================================
     CAROUSEL ANIMATION
  ========================================================= */

  function runCarousel(trackEl, pool, finalValue, startDelay, onComplete) {
    var reduced = prefersReducedMotion();
    var stepCount = reduced ? 3 : (13 + Math.floor(Math.random() * 4));
    var sequence = [];
    for (var i = 0; i < stepCount; i++) {
      sequence.push(pickRandom(pool));
    }
    sequence.push(finalValue);

    trackEl.innerHTML = '';
    trackEl.style.transform = 'translateX(0)';
    sequence.forEach(function (val) {
      var card = document.createElement('div');
      card.className = 'carousel-card';
      card.textContent = val;
      trackEl.appendChild(card);
    });

    setTimeout(function () {
      var index = 0;
      var totalSteps = sequence.length - 1;

      function step() {
        var cardEl = trackEl.children[index];
        if (cardEl) {
          trackEl.style.transform = 'translateX(-' + cardEl.offsetLeft + 'px)';
        }
        if (index >= totalSteps) {
          if (onComplete) onComplete();
          return;
        }
        var progress = index / totalSteps;
        var delay = reduced ? 90 : (55 + Math.pow(progress, 2) * 360);
        index++;
        setTimeout(step, delay);
      }
      step();
    }, reduced ? 0 : startDelay);
  }

  function startCarouselAnimation(container, challenge, liveRegionId, onAllDone) {
    var tracks = {
      topic: $('[data-track="topic"]', container),
      element: $('[data-track="element"]', container),
      context: $('[data-track="context"]', container)
    };

    var doneCount = 0;
    function partDone() {
      doneCount++;
      if (doneCount === 3) {
        gameState.carouselFinished = true;
        var live = document.getElementById(liveRegionId);
        if (live) {
          live.textContent = 'Tu desafío está listo: ' + challenge.topic + ', ' +
            challenge.element.toLowerCase() + ', ' + challenge.context.toLowerCase() + '.';
        }
        if (onAllDone) onAllDone();
      }
    }

    runCarousel(tracks.topic, topics, challenge.topic, 0, partDone);
    runCarousel(tracks.element, requiredElements, challenge.element, 150, partDone);
    runCarousel(tracks.context, contexts, challenge.context, 300, partDone);
  }

  /* =========================================================
     RENDER
  ========================================================= */

  function renderChallenge(container, challenge) {
    $('[data-field="topic"]', container).textContent = challenge.topic;
    $('[data-field="element"]', container).textContent = challenge.element;
    $('[data-field="context"]', container).textContent = challenge.context;
  }

  function renderChips(container, challenge) {
    container.innerHTML =
      '<span class="chip chip-topic">' + challenge.topic + '</span>' +
      '<span class="chip chip-element">' + challenge.element + '</span>' +
      '<span class="chip chip-context">' + challenge.context + '</span>';
  }

  function renderSummary() {
    var list = document.getElementById('summary-list');
    list.innerHTML = '';
    gameState.predictions.forEach(function (p) {
      var card = document.createElement('div');
      card.className = 'summary-card';
      card.innerHTML =
        '<p class="note-header">Predicción <span class="summary-target">' + p.target + '</span></p>' +
        '<p class="summary-text"></p>';
      card.querySelector('.summary-text').textContent = p.text;
      list.appendChild(card);
    });
  }

  /* =========================================================
     NAVIGATION
  ========================================================= */

  function goToScreen(n) {
    $all('.screen').forEach(function (s) {
      s.hidden = true;
    });
    var target = document.getElementById('screen-' + n);
    if (target) {
      target.hidden = false;
      target.scrollTop = 0;
    }
    gameState.currentScreen = n;
    saveGameState();
  }

  function applyRealTheme(target) {
    var yo = target === 'Yo';
    ['screen-10', 'screen-11', 'screen-12'].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      el.classList.toggle('theme-bg-yo', yo);
      el.classList.toggle('theme-bg-lina', !yo);
    });
    ['screen-13', 'screen-14'].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      el.classList.toggle('theme-flat-yo', yo);
      el.classList.toggle('theme-flat-lina', !yo);
    });
    var card = document.getElementById('real-challenge-card');
    if (card) card.classList.toggle('theme-yo', yo);
  }

  function setRadioSelection(cards, selectedCard) {
    cards.forEach(function (card) {
      var isSelected = card === selectedCard;
      card.classList.toggle('is-selected', isSelected);
      card.setAttribute('aria-checked', isSelected ? 'true' : 'false');
      var box = $('.checkbox', card);
      if (box) box.textContent = isSelected ? '✓' : '';
    });
  }

  /* =========================================================
     GAME FLOW ACTIONS
  ========================================================= */

  function startOnboarding() {
    goToScreen(2);
  }

  function goToRealGameIntro() {
    goToScreen(8);
  }

  function startRealGame() {
    gameState.firstTarget = null;
    gameState.currentTarget = null;
    gameState.completedTargets = [];
    gameState.usedCombos = [];
    resetCurrentChallenge();
    gameState.draftText = '';
    saveGameState();

    var cards = $all('.option-card', document.getElementById('screen-9'));
    setRadioSelection(cards, null);
    document.getElementById('target-continue-btn').disabled = true;
    goToScreen(9);
  }

  function selectRealTarget(target, clickedCard) {
    var cards = $all('.option-card', document.getElementById('screen-9'));
    setRadioSelection(cards, clickedCard);
    gameState.currentTarget = target;
    document.getElementById('target-continue-btn').disabled = false;
  }

  function confirmRealTarget() {
    if (!gameState.currentTarget) return;
    gameState.firstTarget = gameState.currentTarget;
    applyRealTheme(gameState.currentTarget);
    saveGameState();
    generateAndAnimateRealChallenge();
  }

  function generateAndAnimateRealChallenge() {
    var exclude = gameState.usedCombos.length ? gameState.usedCombos[0] : null;
    var challenge = generateChallenge(exclude);
    gameState.currentChallenge = challenge;
    gameState.carouselFinished = false;
    saveGameState();

    goToScreen(10);
    var btn = document.getElementById('real-next-btn');
    btn.disabled = true;
    var container = document.getElementById('screen-10');
    startCarouselAnimation(container, challenge, 'real-live', function () {
      btn.disabled = false;
      saveGameState();
    });
  }

  function goToRealResult() {
    if (!gameState.carouselFinished) return;
    renderChallenge(document.getElementById('screen-11'), gameState.currentChallenge);
    goToScreen(11);
  }

  function goToWriteScreen() {
    renderChips(document.getElementById('write-chip-row'), gameState.currentChallenge);
    var textarea = document.getElementById('prediction-input');
    textarea.value = gameState.draftText || '';
    updateSaveButtonState();
    goToScreen(12);
    setTimeout(function () { textarea.focus(); }, 300);
  }

  function updateSaveButtonState() {
    var textarea = document.getElementById('prediction-input');
    var btn = document.getElementById('save-prediction-btn');
    btn.disabled = textarea.value.trim().length === 0;
  }

  function savePrediction() {
    if (isSaving) return;
    var textarea = document.getElementById('prediction-input');
    var text = textarea.value.trim();
    if (!text) return;

    isSaving = true;
    var btn = document.getElementById('save-prediction-btn');
    btn.disabled = true;

    var prediction = {
      id: 'prediction-' + Date.now(),
      target: gameState.currentTarget,
      topic: gameState.currentChallenge.topic,
      requiredElement: gameState.currentChallenge.element,
      context: gameState.currentChallenge.context,
      text: text,
      order: gameState.predictions.length + 1,
      createdAt: new Date().toISOString()
    };

    gameState.predictions.push(prediction);
    gameState.usedCombos.push({
      topic: gameState.currentChallenge.topic,
      element: gameState.currentChallenge.element,
      context: gameState.currentChallenge.context
    });
    gameState.completedTargets.push(gameState.currentTarget);
    gameState.draftText = '';
    saveGameState();

    document.getElementById('saved-prediction-text').textContent = '“' + text + '”';
    var afterBtn = document.getElementById('after-save-btn');
    afterBtn.textContent = gameState.completedTargets.length < 2 ? 'Continuar' : 'Ver mis predicciones';

    goToScreen(13);
    isSaving = false;
  }

  function afterSaveContinue() {
    if (gameState.completedTargets.length < 2) {
      goToScreen(14);
    } else {
      renderSummary();
      goToScreen(15);
    }
  }

  function startSecondPrediction() {
    gameState.currentTarget = otherTarget(gameState.firstTarget);
    applyRealTheme(gameState.currentTarget);
    resetCurrentChallenge();
    generateAndAnimateRealChallenge();
  }

  function goToTransition() {
    goToScreen(16);
  }

  function finishGame() {
    saveGameState();
    goToScreen(17);
  }

  function backToHome() {
    goToScreen(1);
  }

  /* =========================================================
     HOME MODAL
  ========================================================= */

  function requestHome() {
    var current = gameState.currentScreen;
    var onboardingScreens = [2, 8];
    var hasUnsavedDraft = current === 12 &&
      document.getElementById('prediction-input').value.trim().length > 0;
    var midRealRound = [9, 10, 11, 12, 14].indexOf(current) !== -1 && gameState.completedTargets.length < 2;

    if (onboardingScreens.indexOf(current) !== -1 && !hasUnsavedDraft) {
      backToHome();
      return;
    }
    if (hasUnsavedDraft || midRealRound) {
      pendingHomeAction = confirmGoHome;
      document.getElementById('home-modal').hidden = false;
      return;
    }
    backToHome();
  }

  function confirmGoHome() {
    gameState.draftText = '';
    resetCurrentChallenge();
    backToHome();
  }

  function hideModal() {
    document.getElementById('home-modal').hidden = true;
    pendingHomeAction = null;
  }

  /* =========================================================
     EVENT WIRING
  ========================================================= */

  document.addEventListener('DOMContentLoaded', function () {
    loadGameState();
    // Always start a fresh visit at the intro screen; saved predictions persist regardless.
    goToScreen(1);
    setupImageExportUI();

    var textarea = document.getElementById('prediction-input');
    textarea.addEventListener('input', function () {
      gameState.draftText = textarea.value;
      updateSaveButtonState();
      saveGameState();
    });

    document.addEventListener('click', function (e) {
      var realCard = e.target.closest('[data-real-target]');
      if (realCard) {
        selectRealTarget(realCard.dataset.realTarget, realCard);
        return;
      }

      var actionEl = e.target.closest('[data-action]');
      if (!actionEl) return;
      var action = actionEl.dataset.action;

      switch (action) {
        case 'start-onboarding': startOnboarding(); break;
        case 'goto-screen-8': goToRealGameIntro(); break;
        case 'start-real-game': startRealGame(); break;
        case 'confirm-real-target': confirmRealTarget(); break;
        case 'goto-real-result': goToRealResult(); break;
        case 'goto-write': goToWriteScreen(); break;
        case 'save-prediction': savePrediction(); break;
        case 'after-save-continue': afterSaveContinue(); break;
        case 'save-prediction-image': saveCurrentPredictionImage(); break;
        case 'share-prediction-image': shareCurrentPredictionImage(); break;
        case 'start-second-prediction': startSecondPrediction(); break;
        case 'goto-transition': goToTransition(); break;
        case 'finish-game': finishGame(); break;
        case 'back-to-home': backToHome(); break;
        case 'request-home': requestHome(); break;
        case 'modal-cancel': hideModal(); break;
        case 'modal-confirm':
          var pending = pendingHomeAction;
          hideModal();
          if (pending) pending();
          break;
      }
    });
  });
})();
