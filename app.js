(function () {
  'use strict';

  /* =========================================================
     DATA
  ========================================================= */

  /* =========================================================
     DOCUMENTO EDITORIAL
     =========================================================

     REGLA MAESTRA
     Cada variable tiene que ser divertida ANTES de combinarse.
     Si leída sola no despierta ninguna imagen, no pertenece
     al universo Borders.

     ---------------------------------------------------------
     LA PRUEBA DE UNIVERSALIDAD (dos filos)
     ---------------------------------------------------------
     El juego es abierto: cada jugador escribe los nombres de las
     personas sobre las que va a predecir. Puede ser un amigo, la
     abuela, un compañero de trabajo, un sobrino de nueve años.
     Nunca sabemos quién es la persona elegida.

     Por eso todo disparador tiene que pasar DOS filtros:

     1. UNIVERSAL EN LA RELACIÓN
        Cualquier jugador tiene que poder imaginar rápido a la
        persona elegida dentro de esa situación, sin conocer su
        vida privada.
        Falla: "el grupo del secundario" (si no lo conozco, no
        veo nada). Pasa: "su vecino de arriba".

     2. UNIVERSAL EN LA ETAPA DE LA VIDA
        Tiene que funcionar igual si la persona elegida tiene
        nueve años o ochenta.
        Falla: "su perfil de LinkedIn", "su renuncia".
        Pasa: "quien le da órdenes", "su heladera".

     Si un ítem falla cualquiera de los dos, no entra.

     ---------------------------------------------------------
     REGLA DEL POSESIVO (para TOPICS)
     ---------------------------------------------------------
     Todo tema tiene que poder llevar "su" adelante sin sonar
     raro. Eso lo mantiene enganchado a la persona elegida, sea
     quien sea.

     Si es un personaje suelto sin relación con ella (un político,
     un vendedor ambulante), no es tema: es un intruso, y va en
     ELEMENTS.

     Si podría ser una categoría de encuesta ("Viajes", "Amor",
     "Salud"), tampoco entra. Tiene que ser algo que se pueda
     señalar con el dedo.

     ---------------------------------------------------------
     REGLA DEL ADJETIVO (para ELEMENTS)
     ---------------------------------------------------------
     No rechazamos la fantasía. Rechazamos el adjetivo que le da
     personalidad al objeto.

     - Si el adjetivo lo vuelve más FÍSICO (inflable, roto,
       descartable, chiquito), entra: eso es distopía patética.
     - Si lo vuelve más SIMPÁTICO (tímido, resentido, educado),
       no entra: ese chiste ya viene hecho y al jugador no le
       queda nada por construir.

     Un dinosaurio es fantasía. Un dinosaurio inflable es una
     pelopincho en un estacionamiento. Esa es la diferencia.

     Como los otros dos ejes son SIEMPRE mundanos, cualquier
     elemento fantástico cae obligatoriamente en un marco banal:
     al extraterrestre nunca le toca una nave, le toca la fila
     del supermercado. La arquitectura deflaciona la fantasía
     sola. Por eso el eje del intruso puede ser más raro de lo
     que parecería prudente. Proporción objetivo: ~1 de cada 4.

     ---------------------------------------------------------
     REGLA DE LA SALA
     ---------------------------------------------------------
     Esto se juega en un cumpleaños. Evitamos material que pueda
     enfriar la mesa aunque sea gracioso en abstracto: velorios,
     hospitales, enfermedad, y política partidaria.

     ---------------------------------------------------------
     PREGUNTAS PARA ADMITIR UN ÍTEM
     ---------------------------------------------------------
     1. ¿Produce una imagen mental inmediata?
     2. ¿Tiene tensión implícita (poder, vergüenza, deuda, deseo)?
     3. ¿Invita a exagerarlo?
     4. ¿Funciona con cualquier persona elegida, de cualquier edad?
     5. ¿Deja algo por construir, o ya trae el chiste puesto?

     Preferimos 26 excelentes a 80 correctas. Con 26 por eje y
     4 tiradas por partida, el mazo aguanta 13 partidas sin
     repetir ningún ítem.
  ========================================================= */
  var TOPICS = [
    { t: 'Su vecino de arriba',                  f: 'casa' },
    { t: 'El portero de su edificio',            f: 'casa' },
    { t: 'La reunión de consorcio',              f: 'casa' },
    { t: 'Su heladera',                          f: 'casa' },
    { t: 'Su mudanza',                           f: 'casa' },
    { t: 'Quien le da órdenes',                  f: 'trabajo' },
    { t: 'Lo que hace todos los días a las ocho',f: 'trabajo' },
    { t: 'Su peor decisión reciente',            f: 'trabajo' },
    { t: 'La plata que le deben',                 f: 'plata' },
    { t: 'Su herencia',                          f: 'plata' },
    { t: 'Lo que compró y nunca usó',            f: 'plata' },
    { t: 'Su ex',                                f: 'amor' },
    { t: 'Su cita a ciegas',                     f: 'amor' },
    { t: 'La persona que le gusta',               f: 'amor' },
    { t: 'Su familia política',                  f: 'familia' },
    { t: 'El grupo de WhatsApp de la familia',   f: 'familia' },
    { t: 'Su apodo familiar',                    f: 'familia' },
    { t: 'Su corte de pelo',                     f: 'cuerpo' },
    { t: 'Su tatuaje',                           f: 'cuerpo' },
    { t: 'Lo que le da vergüenza',                f: 'cuerpo' },
    { t: 'Su celular viejo',                     f: 'tech' },
    { t: 'Lo que postea a las tres de la mañana',f: 'tech' },
    { t: 'Su horóscopo',                         f: 'ocio' },
    { t: 'Su documento vencido',                 f: 'tramite' },
    { t: 'Su plan de vacaciones',                f: 'viaje' },
    { t: 'Su reputación',                        f: 'social' }
  ];

  var ELEMENTS = [
    /* núcleo extraño sin remate */
    { t: 'Un pato',                              f: 'none' },
    { t: 'Un maniquí',                           f: 'none' },
    { t: 'Una planta que se mueve sola',         f: 'none' },
    { t: 'Un caracol',                           f: 'none' },
    /* fantasía desnuda: sustantivo solo, sin personalidad */
    { t: 'Un fantasma',                          f: 'none' },
    { t: 'Un extraterrestre',                    f: 'none' },
    { t: 'Un robot',                             f: 'none' },
    /* fantasía deflacionada: el adjetivo la baja a la realidad */
    { t: 'Un dinosaurio inflable',               f: 'none' },
    { t: 'Un meteorito muy chiquito',            f: 'none' },
    { t: 'Un inflable gigante',                  f: 'none' },
    /* objetos cotidianos vueltos absurdamente importantes */
    { t: 'Una bufanda tejida a mano',            f: 'none' },
    { t: 'Un tupper que nadie reclama',          f: 'none' },
    { t: 'Una tostadora',                        f: 'none' },
    { t: 'Un paquete sin remitente',             f: 'none' },
    { t: 'Una llave que no abre nada',           f: 'none' },
    { t: 'Un trofeo de algo que nadie ganó',     f: 'none' },
    { t: 'Una carta que llegó veinte años tarde',f: 'none' },
    { t: 'Un contrato firmado sin leer',         f: 'none' },
    { t: 'Una cámara descartable',               f: 'none' },
    { t: 'Un paraguas roto',                     f: 'none' },
    { t: 'Un bidón lleno de algo',               f: 'none' },
    { t: 'Una escoba',                           f: 'none' },
    { t: 'Un megáfono',                          f: 'none' },
    { t: 'Una media perdida',                    f: 'none' },
    { t: 'Un audio de catorce minutos',          f: 'none' },
    { t: 'Glitter',                              f: 'none' }
  ];

  var CONTEXTS = [
    { t: 'En un ascensor',                       f: 'casa' },
    { t: 'En una reunión de consorcio',          f: 'casa' },
    { t: 'En plena mudanza',                     f: 'casa' },
    { t: 'En un estacionamiento',                f: 'viaje' },
    { t: 'En un peaje',                          f: 'viaje' },
    { t: 'En un colectivo lleno',                f: 'viaje' },
    { t: 'En un aeropuerto a las cinco de la mañana', f: 'viaje' },
    { t: 'En un hotel barato',                   f: 'viaje' },
    { t: 'En una sala de espera',                f: 'tramite' },
    { t: 'En un locutorio',                      f: 'tramite' },
    { t: 'En un examen de manejo',               f: 'tramite' },
    { t: 'En un call center',                    f: 'trabajo' },
    { t: 'En una videollamada',                  f: 'trabajo' },
    { t: 'En un karaoke',                        f: 'ocio' },
    { t: 'En una clase de yoga',                 f: 'cuerpo' },
    { t: 'En un probador de ropa',               f: 'cuerpo' },
    { t: 'En una peluquería',                    f: 'cuerpo' },
    { t: 'En la fila del supermercado',          f: 'social' },
    { t: 'En un casamiento ajeno',               f: 'social' },
    { t: 'En un cumpleaños infantil',            f: 'social' },
    { t: 'En un baño público',                   f: 'social' },
    { t: 'En una entrega de premios',            f: 'social' },
    { t: 'En una fiesta que ya terminó',         f: 'social' },
    { t: 'En un shopping que está cerrando',     f: 'social' },
    { t: 'En la puerta de un cajero',            f: 'plata' },
    { t: 'En un asado familiar',                 f: 'familia' }
  ];

  /* Arrays planos de texto para el carrusel (runCarousel espera strings). */
  function textsOf(list) {
    var out = [];
    for (var i = 0; i < list.length; i++) out.push(list[i].t);
    return out;
  }

  var topics = textsOf(TOPICS);
  var requiredElements = textsOf(ELEMENTS);
  var contexts = textsOf(CONTEXTS);

  var STORAGE_KEY = 'generadorFuturosBorders';

  /* =========================================================
     STATE
  ========================================================= */

  var gameState = {
    currentScreen: 1,
    players: [
      { id: 'player-1', name: '' },
      { id: 'player-2', name: '' }
    ],
    firstTarget: null,
    currentTarget: null,
    completedTargets: [],
    currentChallenge: { topic: null, element: null, context: null },
    predictions: [],
    carouselFinished: false,
    drafts: { 'player-1': '', 'player-2': '' },
    sessionId: null
  };

  var screenHistory = [];
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
      gameState.players = normalizePlayers(saved.players);
      gameState.firstTarget = saved.firstTarget || null;
      gameState.currentTarget = saved.currentTarget || null;
      gameState.completedTargets = Array.isArray(saved.completedTargets) ? saved.completedTargets : [];
      gameState.currentChallenge = saved.currentChallenge || { topic: null, element: null, context: null };
      gameState.predictions = Array.isArray(saved.predictions) ? saved.predictions : [];
      gameState.drafts = normalizeDrafts(saved.drafts);
      gameState.currentScreen = typeof saved.currentScreen === 'number' ? saved.currentScreen : 1;
      gameState.sessionId = typeof saved.sessionId === 'string' ? saved.sessionId : null;
    } catch (e) {
      /* corrupted state — start fresh */
    }
  }

  /* Si el localStorage viene de una versión anterior (sin `players`,
     o con datos corruptos), devuelve el par por defecto en vez de
     romper el arranque. Los datos viejos de predicciones no se tocan. */
  function normalizePlayers(raw) {
    var defaults = [{ id: 'player-1', name: '' }, { id: 'player-2', name: '' }];
    if (!Array.isArray(raw) || raw.length !== 2) return defaults;
    var out = [];
    for (var i = 0; i < 2; i++) {
      var entry = raw[i];
      var name = (entry && typeof entry.name === 'string') ? entry.name : '';
      out.push({ id: defaults[i].id, name: name });
    }
    return out;
  }

  /* Migración equivalente para los borradores por jugador: si el
     localStorage viene de antes de este cambio (sin `drafts`, o con
     el viejo `draftText` compartido), arranca con los dos vacíos. */
  function normalizeDrafts(raw) {
    var defaults = { 'player-1': '', 'player-2': '' };
    if (!raw || typeof raw !== 'object') return defaults;
    return {
      'player-1': typeof raw['player-1'] === 'string' ? raw['player-1'] : '',
      'player-2': typeof raw['player-2'] === 'string' ? raw['player-2'] : ''
    };
  }

  /* =========================================================
     HELPERS
  ========================================================= */

  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function getPlayer(id) {
    for (var i = 0; i < gameState.players.length; i++) {
      if (gameState.players[i].id === id) return gameState.players[i];
    }
    return null;
  }

  function getPlayerName(id) {
    var player = getPlayer(id);
    return player ? player.name : '';
  }

  function otherTarget(target) {
    return target === 'player-1' ? 'player-2' : 'player-1';
  }

  var PLAYER_NAME_MAX = 20;
  var PLAYER_NAME_PATTERN = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/;

  function sanitizePlayerName(raw) {
    return (raw || '').trim();
  }

  /* Devuelve { valid, name, error }. `otherName` es el nombre ya
     cargado del otro jugador (o null si todavía no existe), para
     poder rechazar nombres duplicados. */
  function validatePlayerName(raw, otherName) {
    var name = sanitizePlayerName(raw);
    if (!name) {
      return { valid: false, error: 'Escribí un nombre para continuar.' };
    }
    if (name.length > PLAYER_NAME_MAX) {
      return { valid: false, error: 'Máximo ' + PLAYER_NAME_MAX + ' caracteres.' };
    }
    if (!PLAYER_NAME_PATTERN.test(name)) {
      return { valid: false, error: 'Usá solo letras, espacios, apóstrofes o guiones.' };
    }
    if (otherName && name.toLowerCase() === sanitizePlayerName(otherName).toLowerCase()) {
      return { valid: false, error: 'Los dos nombres no pueden ser iguales.' };
    }
    return { valid: true, name: name, error: null };
  }

  function showFieldError(id, message) {
    var el = document.getElementById(id);
    if (!el) return;
    el.textContent = message;
    el.hidden = false;
  }

  function hideFieldError(id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.hidden = true;
    el.textContent = '';
  }

  function $(selector, scope) {
    return (scope || document).querySelector(selector);
  }

  function $all(selector, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
  }

  /* =========================================================
     CHALLENGE GENERATION
     Bolsas barajadas (Fisher-Yates) sin reposición, con
     persistencia en localStorage para no repetir entre partidas.
  ========================================================= */

  var BAGS_KEY = 'gfb_bags_v3';
  var SEEN_KEY = 'gfb_seen_v3';
  var SEEN_MAX = 60; // cuántas ternas recordamos antes de olvidar las viejas
  var CONTEXT_RETRY_LIMIT = 40; // más que el tamaño del mazo de contexts

  var bags = { topic: [], element: [], context: [] };
  var lastDrawn = { topic: null, element: null, context: null };
  var seenCombos = [];

  function shuffle(arr) {
    var copy = arr.slice();
    for (var i = copy.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = copy[i];
      copy[i] = copy[j];
      copy[j] = tmp;
    }
    return copy;
  }

  function poolFor(axis) {
    if (axis === 'topic') return TOPICS;
    if (axis === 'element') return ELEMENTS;
    return CONTEXTS;
  }

  function loadGenerator() {
    try {
      var rawBags = localStorage.getItem(BAGS_KEY);
      if (rawBags) {
        var parsed = JSON.parse(rawBags);
        if (parsed && typeof parsed === 'object') {
          bags.topic = Array.isArray(parsed.topic) ? parsed.topic : [];
          bags.element = Array.isArray(parsed.element) ? parsed.element : [];
          bags.context = Array.isArray(parsed.context) ? parsed.context : [];
          lastDrawn = parsed.last || lastDrawn;
        }
      }
      var rawSeen = localStorage.getItem(SEEN_KEY);
      if (rawSeen) {
        var s = JSON.parse(rawSeen);
        if (Array.isArray(s)) seenCombos = s;
      }
    } catch (e) {
      /* storage bloqueado o data corrupta: el juego sigue con mazos nuevos */
    }
  }

  function saveGenerator() {
    try {
      localStorage.setItem(BAGS_KEY, JSON.stringify({
        topic: bags.topic, element: bags.element, context: bags.context, last: lastDrawn
      }));
      localStorage.setItem(SEEN_KEY, JSON.stringify(seenCombos.slice(-SEEN_MAX)));
    } catch (e) {
      /* sin persistencia el juego funciona igual, solo puede repetir entre partidas */
    }
  }

  /* Saca un ítem del mazo. Si el mazo está vacío lo rebaraja, y si
     la primera carta del mazo nuevo es la última que salió, la
     manda al fondo (evita repetir justo en el borde). */
  function drawFrom(axis) {
    var pool = poolFor(axis);
    if (!bags[axis] || bags[axis].length === 0) {
      var indices = [];
      for (var i = 0; i < pool.length; i++) indices.push(i);
      var fresh = shuffle(indices);
      if (fresh.length > 1 && pool[fresh[0]].t === lastDrawn[axis]) {
        fresh.push(fresh.shift());
      }
      bags[axis] = fresh;
    }
    var item = pool[bags[axis].shift()];
    lastDrawn[axis] = item.t;
    return item;
  }

  /* Devuelve la carta al FINAL del mazo (no al frente): así no se
     vuelve a sacar de inmediato en el próximo intento, y sigue
     circulando en vez de perderse. */
  function putBack(axis, item) {
    var pool = poolFor(axis);
    for (var i = 0; i < pool.length; i++) {
      if (pool[i].t === item.t) { bags[axis].push(i); return; }
    }
  }

  /* Saca el índice de una carta puntual del mazo, si está ahí.
     La usa el fallback determinístico (forceValidContext) para no
     dejar la carta duplicada entre el mazo y la que ya está en uso. */
  function removeFromBag(axis, item) {
    var pool = poolFor(axis);
    for (var i = 0; i < pool.length; i++) {
      if (pool[i].t === item.t) {
        var idx = bags[axis].indexOf(i);
        if (idx !== -1) bags[axis].splice(idx, 1);
        return;
      }
    }
  }

  function comboKey(c) {
    return c.topic + '|' + c.element + '|' + c.context;
  }

  /* Rechaza la terna si tema y contexto son de la misma familia
     (frase plana) o si la terna exacta ya salió antes. */
  function isBadCombo(topic, element, context) {
    if (topic.f === context.f) return true;
    var key = topic.t + '|' + element.t + '|' + context.t;
    return seenCombos.indexOf(key) !== -1;
  }

  /* Barrido determinístico sobre TODO el mazo de contexts (no solo
     lo que queda en la bolsa). Nunca devuelve un context de la
     misma familia que topic: eso se descarta sí o sí. Entre los
     de familia distinta, prioriza uno que no esté en seenCombos;
     solo si no queda ninguno sin usar (caso extremo) acepta uno
     ya visto, para garantizar que la función siempre termina. */
  function forceValidContext(topic, element) {
    var strictMatch = null;
    var familySafeMatch = null;
    for (var i = 0; i < CONTEXTS.length; i++) {
      var candidate = CONTEXTS[i];
      if (candidate.f === topic.f) continue;
      if (!familySafeMatch) familySafeMatch = candidate;
      var key = topic.t + '|' + element.t + '|' + candidate.t;
      if (seenCombos.indexOf(key) === -1) { strictMatch = candidate; break; }
    }
    var chosen = strictMatch || familySafeMatch;
    removeFromBag('context', chosen);
    return chosen;
  }

  /* topic y element se sortean una única vez por generación (nunca
     entran en conflicto entre sí). Solo context se reintenta, ya
     que es el único eje que puede colisionar con topic. Los
     contextos rechazados se acumulan y vuelven al mazo recién al
     final (no se pierden, solo pierden el turno). Si el tope de
     intentos no alcanza, el barrido determinístico de
     forceValidContext garantiza que igual nunca se acepte una
     colisión de familia ni un bucle infinito. */
  function generateChallenge() {
    var topic = drawFrom('topic');
    var element = drawFrom('element');
    var context = drawFrom('context');
    var rejected = [];
    var attempts = 0;

    while (isBadCombo(topic, element, context) && attempts < CONTEXT_RETRY_LIMIT) {
      rejected.push(context);
      context = drawFrom('context');
      attempts++;
    }

    for (var i = 0; i < rejected.length; i++) {
      putBack('context', rejected[i]);
    }

    if (isBadCombo(topic, element, context)) {
      putBack('context', context);
      context = forceValidContext(topic, element);
    }

    var challenge = { topic: topic.t, element: element.t, context: context.t };
    seenCombos.push(comboKey(challenge));
    if (seenCombos.length > SEEN_MAX) seenCombos = seenCombos.slice(-SEEN_MAX);
    saveGenerator();
    return challenge;
  }

  function resetCurrentChallenge() {
    gameState.currentChallenge = { topic: null, element: null, context: null };
    gameState.carouselFinished = false;
  }

  /* =========================================================
     PREDICTION TEMPLATE
  ========================================================= */

  function buildPredictionTemplate(name) {
    return 'En 202__, ' + name + ' va a...\nporque ___________________.';
  }

  /* Reduce el texto a una firma comparable: el año (escrito o en
     blanco) cuenta como un mismo token, cualquier tira de guiones
     bajos se colapsa a una sola, y se ignoran signos y espacios.
     Así "completar el año" o "tocar los guiones" nunca cuenta como
     predicción real. */
  function normalizeForTemplateCheck(text) {
    return (text || '')
      .replace(/^En\s+202[\d_]*,/i, 'En 202X,')
      .replace(/_+/g, '_')
      .replace(/[.,!¡¿?;:\-–—'"“”‘’…]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
  }

  /* La comparación siempre reconstruye la plantilla con el nombre
     dinámico del jugador actual: nunca depende de un nombre fijo. */
  function isTemplateUnfilled(value, name) {
    return normalizeForTemplateCheck(value) === normalizeForTemplateCheck(buildPredictionTemplate(name));
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
    var currentSessionPredictions = gameState.predictions.filter(function (p) {
      return p.session === gameState.sessionId;
    });
    currentSessionPredictions.forEach(function (p) {
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

  /* isBack=true evita empujar la pantalla actual al historial (la
     estamos abandonando hacia atrás, no hacia adelante) y evita
     que se vuelva a apilar la que goBack() ya sacó del tope. */
  function goToScreen(n, isBack) {
    if (!isBack && gameState.currentScreen && gameState.currentScreen !== n) {
      screenHistory.push(gameState.currentScreen);
    }
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
    if (n === 9) renderPlayerSelectOptions();
  }

  /* "Atrás": retrocede exactamente un paso siguiendo el recorrido
     real (no reinicia nada, no borra nombres ni predicciones). */
  function goBack() {
    var previous = screenHistory.pop();
    if (previous == null) {
      goToScreen(1);
      return;
    }
    goToScreen(previous, true);
  }

  function applyRealTheme(target) {
    /* Tema estable por jugador (player-1 / player-2), no por quién
       empieza primero: cada persona conserva su color toda la partida. */
    var isPlayerOne = target === 'player-1';
    ['screen-10', 'screen-11', 'screen-12'].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      el.classList.toggle('theme-bg-yo', !isPlayerOne);
      el.classList.toggle('theme-bg-lina', isPlayerOne);
    });
    ['screen-13', 'screen-14'].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      el.classList.toggle('theme-flat-yo', !isPlayerOne);
      el.classList.toggle('theme-flat-lina', isPlayerOne);
    });
    var card = document.getElementById('real-challenge-card');
    if (card) card.classList.toggle('theme-yo', !isPlayerOne);
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
    gameState.players = [
      { id: 'player-1', name: '' },
      { id: 'player-2', name: '' }
    ];
    gameState.firstTarget = null;
    gameState.currentTarget = null;
    gameState.completedTargets = [];
    gameState.sessionId = 'p-' + Date.now();
    resetCurrentChallenge();
    gameState.drafts = { 'player-1': '', 'player-2': '' };
    saveGameState();

    var nameOneInput = document.getElementById('player-one-name');
    if (nameOneInput) nameOneInput.value = '';
    hideFieldError('player-one-error');
    var nameTwoInput = document.getElementById('player-two-name');
    if (nameTwoInput) nameTwoInput.value = '';
    hideFieldError('player-two-error');

    var cards = $all('.option-card', document.getElementById('screen-9'));
    setRadioSelection(cards, null);
    document.getElementById('target-continue-btn').disabled = true;
    goToScreen(18);
  }

  function confirmPlayerOneName() {
    var input = document.getElementById('player-one-name');
    var result = validatePlayerName(input.value, null);
    if (!result.valid) {
      showFieldError('player-one-error', result.error);
      return;
    }
    hideFieldError('player-one-error');
    gameState.players[0].name = result.name;
    input.value = result.name;
    saveGameState();
    goToScreen(19);
  }

  function confirmPlayerTwoName() {
    var input = document.getElementById('player-two-name');
    var result = validatePlayerName(input.value, gameState.players[0].name);
    if (!result.valid) {
      showFieldError('player-two-error', result.error);
      return;
    }
    hideFieldError('player-two-error');
    gameState.players[1].name = result.name;
    input.value = result.name;
    saveGameState();
    goToScreen(9);
  }

  function renderPlayerSelectOptions() {
    var container = document.getElementById('real-target-options');
    if (!container) return;
    $all('.option-player-name', container).forEach(function (el) {
      el.textContent = getPlayerName(el.dataset.playerId);
    });
    var cards = $all('.option-card', container);
    var selected = null;
    if (gameState.currentTarget) {
      selected = cards.filter(function (c) { return c.dataset.realTarget === gameState.currentTarget; })[0] || null;
    }
    setRadioSelection(cards, selected);
    document.getElementById('target-continue-btn').disabled = !selected;
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
    var challenge = generateChallenge();
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
    var existingDraft = gameState.drafts[gameState.currentTarget] || '';
    var isFirstEntry = existingDraft === '';
    var value = existingDraft;

    if (isFirstEntry) {
      value = buildPredictionTemplate(getPlayerName(gameState.currentTarget));
      gameState.drafts[gameState.currentTarget] = value;
      saveGameState();
    }

    textarea.value = value;
    updateSaveButtonState();
    goToScreen(12);
    setTimeout(function () {
      textarea.focus();
      if (isFirstEntry && typeof textarea.setSelectionRange === 'function') {
        var cursorPos = value.indexOf('_');
        if (cursorPos === -1) cursorPos = value.length;
        textarea.setSelectionRange(cursorPos, cursorPos);
      }
    }, 300);
  }

  function updateSaveButtonState() {
    var textarea = document.getElementById('prediction-input');
    var btn = document.getElementById('save-prediction-btn');
    var value = textarea.value;
    var isEmpty = value.trim().length === 0;
    var isUnfilledTemplate = !isEmpty && isTemplateUnfilled(value, getPlayerName(gameState.currentTarget));
    btn.disabled = isEmpty || isUnfilledTemplate;
  }

  function savePrediction() {
    if (isSaving) return;
    var textarea = document.getElementById('prediction-input');
    var text = textarea.value.trim();
    if (!text) return;

    isSaving = true;
    var btn = document.getElementById('save-prediction-btn');
    btn.disabled = true;

    var playerName = getPlayerName(gameState.currentTarget);

    var prediction = {
      id: 'prediction-' + Date.now(),
      target: playerName,
      topic: gameState.currentChallenge.topic,
      requiredElement: gameState.currentChallenge.element,
      context: gameState.currentChallenge.context,
      text: text,
      order: gameState.predictions.length + 1,
      createdAt: new Date().toISOString(),
      session: gameState.sessionId
    };

    gameState.predictions.push(prediction);
    gameState.completedTargets.push(gameState.currentTarget);
    gameState.drafts[gameState.currentTarget] = '';
    saveGameState();

    document.getElementById('saved-prediction-text').textContent = '“' + text + '”';
    var ownerLabel = document.getElementById('prediction-owner-label');
    if (ownerLabel) ownerLabel.textContent = 'La predicción de ' + playerName;
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
    screenHistory = [];
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
    loadGenerator();
    loadGameState();
    // Always start a fresh visit at the intro screen; saved predictions persist regardless.
    screenHistory = [];
    goToScreen(1);
    setupImageExportUI();

    var textarea = document.getElementById('prediction-input');
    textarea.addEventListener('input', function () {
      gameState.drafts[gameState.currentTarget] = textarea.value;
      updateSaveButtonState();
      saveGameState();
    });

    var playerOneInput = document.getElementById('player-one-name');
    if (playerOneInput) {
      playerOneInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') { e.preventDefault(); confirmPlayerOneName(); }
      });
    }
    var playerTwoInput = document.getElementById('player-two-name');
    if (playerTwoInput) {
      playerTwoInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') { e.preventDefault(); confirmPlayerTwoName(); }
      });
    }

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
        case 'confirm-player-one': confirmPlayerOneName(); break;
        case 'confirm-player-two': confirmPlayerTwoName(); break;
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
        case 'go-back': goBack(); break;
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
