/**
 * ==============================================================================
 * AESTHETIC BIRTHDAY SCRAPBOOK - INTERACTIVE CONTROLLER
 * Full Web Audio Synthesizer, Confetti Animations, Scrapbook Transitions & Photos
 * ==============================================================================
 */

(function () {
  'use strict';

  // State Management
  const state = {
    candlesBlown: false,
    answeredLove: false,
    girlfriendName: localStorage.getItem('scrapbook_gf_name') || 'My Love',
    isMusicPlaying: false,
    audioCtx: null,
    musicInterval: null,
    musicStep: 0,
    currentPage: 'page-welcome',
    openedGifts: JSON.parse(localStorage.getItem('scrapbook_opened_gifts') || '{"gift1":false,"gift2":false,"gift3":false}'),
    fourCandlesBlown: [false, false, false, false]
  };

  // DOM Elements Cache
  const elements = {
    // Pages
    pageWelcome: document.getElementById('page-welcome'),
    pageGifts: document.getElementById('page-gifts'),
    pageGift1: document.getElementById('page-gift-1'),
    pageGift2: document.getElementById('page-gift-2'),
    pageGift3: document.getElementById('page-gift-3'),
    pageFinalCake: document.getElementById('page-final-cake'),

    // Gifts Tracking & Unlocked Next Surprise
    allGiftsUnlockedSection: document.getElementById('allGiftsUnlockedSection'),
    btnGoToFinalCake: document.getElementById('btnGoToFinalCake'),
    giftsCountNum: document.getElementById('giftsCountNum'),
    badgeGift1: document.getElementById('badgeGift1'),
    badgeGift2: document.getElementById('badgeGift2'),
    badgeGift3: document.getElementById('badgeGift3'),
    shortcutNextSurprise1: document.getElementById('shortcutNextSurprise1'),
    shortcutNextSurprise2: document.getElementById('shortcutNextSurprise2'),
    shortcutNextSurprise3: document.getElementById('shortcutNextSurprise3'),

    // 4 Candles Cake & Wishes
    fourCakeAurora: document.getElementById('fourCakeAurora'),
    finalCandleUnits: [
      document.getElementById('finalCandleUnit1'),
      document.getElementById('finalCandleUnit2'),
      document.getElementById('finalCandleUnit3'),
      document.getElementById('finalCandleUnit4')
    ],
    finalFlames: [
      document.getElementById('finalFlame1'),
      document.getElementById('finalFlame2'),
      document.getElementById('finalFlame3'),
      document.getElementById('finalFlame4')
    ],
    finalSmokes: [
      document.getElementById('finalSmoke1'),
      document.getElementById('finalSmoke2'),
      document.getElementById('finalSmoke3'),
      document.getElementById('finalSmoke4')
    ],
    wishItems: [
      document.getElementById('wishItem1'),
      document.getElementById('wishItem2'),
      document.getElementById('wishItem3'),
      document.getElementById('wishItem4')
    ],
    btnBlowStepCandle: document.getElementById('btnBlowStepCandle'),
    btnBlowStepText: document.getElementById('btnBlowStepText'),
    candlesBlownStatusText: document.getElementById('candlesBlownStatusText'),
    grandFinaleCelebrationSheet: document.getElementById('grandFinaleCelebrationSheet'),
    btnRelightWishes: document.getElementById('btnRelightWishes'),

    // Last Special Gift & Stepped Videos (YOU & US)
    btnOpenVideoGift: document.getElementById('btnOpenVideoGift'),
    videoMemoriesTheater: document.getElementById('videoMemoriesTheater'),
    videoStepperTracker: document.getElementById('videoStepperTracker'),
    badgeStepYou: document.getElementById('badgeStepYou'),
    badgeStepUs: document.getElementById('badgeStepUs'),
    videoStepYouPane: document.getElementById('videoStepYouPane'),
    videoStepUsPane: document.getElementById('videoStepUsPane'),
    btnNextToUsVideo: document.getElementById('btnNextToUsVideo'),
    btnBackToYouVideo: document.getElementById('btnBackToYouVideo'),
    btnReplayUsVideo: document.getElementById('btnReplayUsVideo'),
    playerVideoYou: document.getElementById('playerVideoYou'),
    placeholderVideoYou: document.getElementById('placeholderVideoYou'),
    inputVideoYou: document.getElementById('inputVideoYou'),
    videoScreenYou: document.getElementById('videoScreenYou'),
    playerVideoUs: document.getElementById('playerVideoUs'),
    placeholderVideoUs: document.getElementById('placeholderVideoUs'),
    inputVideoUs: document.getElementById('inputVideoUs'),
    videoScreenUs: document.getElementById('videoScreenUs'),

    // Candles & Question
    btnBlowCandles: document.getElementById('btnBlowCandles'),
    blowButtonArea: document.getElementById('blowButtonArea'),
    afterBlowStage: document.getElementById('afterBlowStage'),
    cakeGlowAurora: document.getElementById('cakeGlowAurora'),
    flames: [
      document.getElementById('flame1'),
      document.getElementById('flame2'),
      document.getElementById('flame3')
    ],
    smokes: [
      document.getElementById('smoke1'),
      document.getElementById('smoke2'),
      document.getElementById('smoke3')
    ],
    loveQuestionBox: document.getElementById('loveQuestionBox'),
    btnLoveYes: document.getElementById('btnLoveYes'),
    btnLoveNo: document.getElementById('btnLoveNo'),
    yayYesMessage: document.getElementById('yayYesMessage'),

    // Gift Cards
    cardGift1: document.getElementById('cardGift1'),
    cardGift2: document.getElementById('cardGift2'),
    cardGift3: document.getElementById('cardGift3'),

    // Modals
    cryingModalOverlay: document.getElementById('cryingModalOverlay'),
    btnRetryLove: document.getElementById('btnRetryLove'),

    // Music Box
    musicBoxWidget: document.getElementById('musicBoxWidget'),
    musicToggleBtn: document.getElementById('musicToggleBtn'),
    playIcon: document.getElementById('playIcon'),
    pauseIcon: document.getElementById('pauseIcon'),
    musicStatusText: document.getElementById('musicStatusText'),

    // Dynamic Names
    displayNames: [
      document.getElementById('displayGirlfriendName1'),
      document.getElementById('letterNamePlaceholder'),
      document.getElementById('diaryCoverName')
    ],

    // Interactive Kitten
    kittenAvatar: document.getElementById('kittenAvatar'),
    kittenSpeechText: document.getElementById('kittenSpeechText'),

    // Text containers
    editableLetterText: document.getElementById('editableLetterText'),
    editableDiaryText: document.getElementById('editableDiaryText'),

    // Petals Container
    petalsContainer: document.getElementById('petalsContainer')
  };

  /* ==========================================================================
     WEB AUDIO API - MUSIC BOX & SOUND EFFECTS ENGINE
     Zero external dependencies. 100% reliable offline music box synthesis!
     ========================================================================== */

  function getAudioContext() {
    if (!state.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        state.audioCtx = new AudioContext();
      }
    }
    if (state.audioCtx && state.audioCtx.state === 'suspended') {
      state.audioCtx.resume();
    }
    return state.audioCtx;
  }

  // Play a delicate, bell-like music box note
  function playMusicBoxNote(frequency, duration = 0.8, volume = 0.25) {
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Sine wave with overtone creates that iconic antique toy music-box sound
      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);

      // Subtle overtone
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(frequency * 2, ctx.currentTime);

      const now = ctx.currentTime;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(volume, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      gain2.gain.setValueAtTime(0, now);
      gain2.gain.linearRampToValueAtTime(volume * 0.35, now + 0.015);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + duration * 0.7);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + duration);

      osc2.start(now);
      osc2.stop(now + duration);
    } catch (e) {
      console.warn('Audio note play error:', e);
    }
  }

  // Sound Effect: Candle Extinguish Whoosh
  function playWhooshSound() {
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const bufferSize = ctx.sampleRate * 0.5;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.4);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();
      noise.stop(ctx.currentTime + 0.4);
    } catch (e) {
      console.warn('Whoosh sound error:', e);
    }
  }

  // Sound Effect: Celebratory Chimes Arpeggio
  function playCelebrationChimes() {
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        playMusicBoxNote(freq, 1.2, 0.2);
      }, idx * 120);
    });
  }

  // Sound Effect: Soft Page Turn Rustle
  function playPageTurnSound() {
    playMusicBoxNote(440, 0.3, 0.08);
  }

  // Note frequency map for "Happy Birthday" melody in C Major / G Major
  const happyBirthdayMelody = [
    { f: 523.25, d: 350 }, // C5
    { f: 523.25, d: 250 }, // C5
    { f: 587.33, d: 600 }, // D5
    { f: 523.25, d: 600 }, // C5
    { f: 698.46, d: 600 }, // F5
    { f: 659.25, d: 1100 }, // E5
    { f: 0, d: 250 }, // rest

    { f: 523.25, d: 350 }, // C5
    { f: 523.25, d: 250 }, // C5
    { f: 587.33, d: 600 }, // D5
    { f: 523.25, d: 600 }, // C5
    { f: 783.99, d: 600 }, // G5
    { f: 698.46, d: 1100 }, // F5
    { f: 0, d: 250 }, // rest

    { f: 523.25, d: 350 }, // C5
    { f: 523.25, d: 250 }, // C5
    { f: 1046.50, d: 600 }, // C6
    { f: 880.00, d: 600 }, // A5
    { f: 698.46, d: 600 }, // F5
    { f: 659.25, d: 600 }, // E5
    { f: 587.33, d: 1100 }, // D5
    { f: 0, d: 250 }, // rest

    { f: 932.33, d: 350 }, // Bb5
    { f: 932.33, d: 250 }, // Bb5
    { f: 880.00, d: 600 }, // A5
    { f: 698.46, d: 600 }, // F5
    { f: 783.99, d: 600 }, // G5
    { f: 698.46, d: 1300 }, // F5
    { f: 0, d: 600 } // rest
  ];

  function startMusicBox() {
    state.isMusicPlaying = true;
    elements.playIcon.classList.add('hidden');
    elements.pauseIcon.classList.remove('hidden');
    elements.musicStatusText.textContent = 'Playing Happy Birthday 🎵';

    getAudioContext();

    function step() {
      if (!state.isMusicPlaying) return;
      const note = happyBirthdayMelody[state.musicStep];
      if (note.f > 0) {
        playMusicBoxNote(note.f, (note.d / 1000) * 1.5, 0.22);
      }
      state.musicStep = (state.musicStep + 1) % happyBirthdayMelody.length;
      state.musicInterval = setTimeout(step, note.d);
    }

    step();
  }

  function stopMusicBox() {
    state.isMusicPlaying = false;
    clearTimeout(state.musicInterval);
    elements.playIcon.classList.remove('hidden');
    elements.pauseIcon.classList.add('hidden');
    elements.musicStatusText.textContent = 'Tap to Play Melody 🎶';
  }

  function toggleMusicBox() {
    if (state.isMusicPlaying) {
      stopMusicBox();
    } else {
      startMusicBox();
    }
  }

  /* ==========================================================================
     CONFETTI & HEARTS BURST ENGINE
     ========================================================================== */

  function launchConfetti(originX = 0.5, originY = 0.6) {
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { x: originX, y: originY },
        colors: ['#ff8fa3', '#fb6f92', '#ffccd5', '#ffd166', '#a2d2ff', '#cdb4db', '#ffffff'],
        shapes: ['circle', 'square'],
        disableForReducedMotion: true
      });
    }
  }

  function launchHeartConfetti(originX = 0.5, originY = 0.6) {
    if (typeof confetti === 'function') {
      const scalar = 2;
      const heart = confetti.shapeFromPath({
        path: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'
      });

      confetti({
        particleCount: 40,
        spread: 100,
        origin: { x: originX, y: originY },
        shapes: [heart],
        scalar: scalar,
        colors: ['#ff4d6d', '#ff758f', '#ffb3c6', '#fb6f92']
      });
    }
  }

  /* ==========================================================================
     PAGE 1: CANDLE BLOWING & LOVE QUESTION INTERACTION
     ========================================================================== */

  function handleBlowCandles() {
    if (state.candlesBlown) return;
    state.candlesBlown = true;

    // Extinguish Sound & Animation
    playWhooshSound();

    // Extinguish candle flames
    elements.flames.forEach(flame => {
      if (flame) flame.classList.add('flame-extinguished');
    });

    // Dim cake glow
    if (elements.cakeGlowAurora) {
      elements.cakeGlowAurora.classList.add('aurora-off');
    }

    // Show smoke puffs
    elements.smokes.forEach(smoke => {
      if (smoke) smoke.classList.remove('hidden');
    });

    // Confetti celebration
    setTimeout(() => {
      launchConfetti(0.7, 0.5);
      launchHeartConfetti(0.7, 0.45);
      playCelebrationChimes();
    }, 300);

    // Hide blow button and reveal Yay banner + Love Question
    setTimeout(() => {
      if (elements.blowButtonArea) {
        elements.blowButtonArea.classList.add('hidden');
      }
      if (elements.afterBlowStage) {
        elements.afterBlowStage.classList.remove('hidden');
      }
    }, 700);

    // Auto-start soft music box if user hasn't toggled yet
    if (!state.isMusicPlaying) {
      setTimeout(() => {
        startMusicBox();
      }, 1200);
    }
  }

  // Love Question: "NO" Handler -> Show Crying Modal
  function handleLoveNo() {
    playMusicBoxNote(330, 0.4, 0.2); // sad note
    if (elements.cryingModalOverlay) {
      elements.cryingModalOverlay.classList.remove('hidden');
    }
  }

  function handleRetryLove() {
    if (elements.cryingModalOverlay) {
      elements.cryingModalOverlay.classList.add('hidden');
    }
    // Play gentle chime
    playMusicBoxNote(523.25, 0.5, 0.2);
  }

  // Love Question: "YES" Handler -> Celebrate & Transition to Page 2
  function handleLoveYes() {
    if (state.answeredLove) return;
    state.answeredLove = true;

    // Confetti explosion!
    launchConfetti(0.5, 0.5);
    launchHeartConfetti(0.5, 0.5);
    playCelebrationChimes();

    // Hide question box & show YAHHH! message
    if (elements.loveQuestionBox) {
      elements.loveQuestionBox.classList.add('hidden');
    }
    if (elements.yayYesMessage) {
      elements.yayYesMessage.classList.remove('hidden');
    }

    // Smooth transition to Page 2 (Choose Your Surprise) after 2.6 seconds
    setTimeout(() => {
      showPage('page-gifts');
      launchConfetti(0.5, 0.3);
    }, 2600);
  }

  /* ==========================================================================
     SCRAPBOOK PAGE ROUTING & NAVIGATION
     ========================================================================== */

  function showPage(pageId) {
    const allPages = [
      elements.pageWelcome,
      elements.pageGifts,
      elements.pageGift1,
      elements.pageGift2,
      elements.pageGift3,
      elements.pageFinalCake
    ];

    allPages.forEach(page => {
      if (!page) return;
      if (page.id === pageId) {
        page.classList.remove('page-hidden');
        page.classList.add('page-active');
      } else {
        page.classList.add('page-hidden');
        page.classList.remove('page-active');
      }
    });

    state.currentPage = pageId;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    playPageTurnSound();
  }

  // Setup Back to Gifts buttons
  function setupBackButtons() {
    const backBtns = document.querySelectorAll('.back-to-gifts-btn, .back-to-gifts-btn-large');
    backBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        showPage('page-gifts');
      });
    });
  }

  /* ==========================================================================
     GIFTS TRACKING & UNLOCKING NEXT SURPRISE
     ========================================================================== */

  function markGiftOpened(giftNum) {
    if (giftNum === 1) state.openedGifts.gift1 = true;
    if (giftNum === 2) state.openedGifts.gift2 = true;
    if (giftNum === 3) state.openedGifts.gift3 = true;

    try {
      localStorage.setItem('scrapbook_opened_gifts', JSON.stringify(state.openedGifts));
    } catch (e) {}

    updateGiftsUI();
  }

  function updateGiftsUI() {
    let openedCount = 0;
    if (state.openedGifts.gift1) {
      openedCount++;
      if (elements.badgeGift1) elements.badgeGift1.classList.remove('hidden');
    }
    if (state.openedGifts.gift2) {
      openedCount++;
      if (elements.badgeGift2) elements.badgeGift2.classList.remove('hidden');
    }
    if (state.openedGifts.gift3) {
      openedCount++;
      if (elements.badgeGift3) elements.badgeGift3.classList.remove('hidden');
    }

    if (elements.giftsCountNum) {
      elements.giftsCountNum.textContent = openedCount;
    }

    // Check if all 3 gifts are opened!
    if (openedCount === 3) {
      if (elements.allGiftsUnlockedSection) {
        elements.allGiftsUnlockedSection.classList.remove('hidden');
      }
      if (elements.shortcutNextSurprise1) elements.shortcutNextSurprise1.classList.remove('hidden');
      if (elements.shortcutNextSurprise2) elements.shortcutNextSurprise2.classList.remove('hidden');
      if (elements.shortcutNextSurprise3) elements.shortcutNextSurprise3.classList.remove('hidden');
    }
  }

  function setupNextSurpriseButtons() {
    const nextButtons = [
      elements.btnGoToFinalCake,
      elements.shortcutNextSurprise1,
      elements.shortcutNextSurprise2,
      elements.shortcutNextSurprise3
    ];

    nextButtons.forEach(btn => {
      if (btn) {
        btn.addEventListener('click', () => {
          showPage('page-final-cake');
          launchConfetti(0.5, 0.4);
        });
      }
    });
  }

  // Setup Gift Card click handlers
  function setupGiftCards() {
    if (elements.cardGift1) {
      elements.cardGift1.addEventListener('click', () => {
        markGiftOpened(1);
        showPage('page-gift-1');
        launchHeartConfetti(0.4, 0.3);
      });
      elements.cardGift1.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          markGiftOpened(1);
          showPage('page-gift-1');
        }
      });
    }

    if (elements.cardGift2) {
      elements.cardGift2.addEventListener('click', () => {
        markGiftOpened(2);
        showPage('page-gift-2');
        launchConfetti(0.5, 0.3);
      });
      elements.cardGift2.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          markGiftOpened(2);
          showPage('page-gift-2');
        }
      });
    }

    if (elements.cardGift3) {
      elements.cardGift3.addEventListener('click', () => {
        markGiftOpened(3);
        showPage('page-gift-3');
        launchHeartConfetti(0.6, 0.3);
      });
      elements.cardGift3.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          markGiftOpened(3);
          showPage('page-gift-3');
        }
      });
    }
  }

  /* ==========================================================================
     SCREEN 4: 4 CANDLES CAKE & WISHES INTERACTION
     ========================================================================== */

  function blowCandle(candleIndex) {
    if (state.fourCandlesBlown[candleIndex]) return;

    state.fourCandlesBlown[candleIndex] = true;

    // Extinguish Flame
    if (elements.finalFlames[candleIndex]) {
      elements.finalFlames[candleIndex].classList.add('flame-extinguished');
    }

    // Show smoke puff
    if (elements.finalSmokes[candleIndex]) {
      elements.finalSmokes[candleIndex].classList.remove('hidden');
    }

    // Mark unit
    if (elements.finalCandleUnits[candleIndex]) {
      elements.finalCandleUnits[candleIndex].classList.add('is-extinguished');
    }

    // Sound effect
    playWhooshSound();
    playMusicBoxNote(523.25 + candleIndex * 130, 0.7, 0.25);

    // Confetti
    launchConfetti(0.3 + candleIndex * 0.15, 0.4);

    // Reveal corresponding wish card
    setTimeout(() => {
      if (elements.wishItems[candleIndex]) {
        elements.wishItems[candleIndex].classList.remove('wish-hidden');
        elements.wishItems[candleIndex].classList.add('wish-visible');
      }
    }, 250);

    // Count blown
    const blownCount = state.fourCandlesBlown.filter(Boolean).length;
    if (elements.candlesBlownStatusText) {
      elements.candlesBlownStatusText.textContent = `Candles Blown: ${blownCount} / 4 🕯️`;
    }

    // Update Step Button
    if (blownCount < 4) {
      const nextIndex = state.fourCandlesBlown.indexOf(false);
      if (elements.btnBlowStepText && nextIndex !== -1) {
        elements.btnBlowStepText.textContent = `Blow Out Candle ${nextIndex + 1} 🕯️`;
      }
    } else {
      // ALL 4 CANDLES BLOWN!
      if (elements.btnBlowStepText) {
        elements.btnBlowStepText.textContent = 'All 4 Candles Blown! ✨';
      }
      if (elements.btnBlowStepCandle) {
        elements.btnBlowStepCandle.disabled = true;
        elements.btnBlowStepCandle.style.opacity = '0.7';
      }

      // Grand celebration trigger!
      setTimeout(() => {
        // Grand Confetti storm
        launchConfetti(0.5, 0.4);
        launchHeartConfetti(0.5, 0.4);
        setTimeout(() => launchConfetti(0.3, 0.5), 400);
        setTimeout(() => launchConfetti(0.7, 0.5), 800);
        playCelebrationChimes();

        // Dim aura slightly
        if (elements.fourCakeAurora) {
          elements.fourCakeAurora.classList.add('aurora-off');
        }

        // Show grand finale banner
        if (elements.grandFinaleCelebrationSheet) {
          elements.grandFinaleCelebrationSheet.classList.remove('hidden');
          elements.grandFinaleCelebrationSheet.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 700);
    }
  }

  function setupFourCandlesCake() {
    // Each candle unit clicked
    elements.finalCandleUnits.forEach((unit, idx) => {
      if (!unit) return;
      unit.addEventListener('click', () => {
        blowCandle(idx);
      });
      unit.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          blowCandle(idx);
        }
      });
    });

    // Step button clicked (finds first unblown candle and blows it)
    if (elements.btnBlowStepCandle) {
      elements.btnBlowStepCandle.addEventListener('click', () => {
        const nextIndex = state.fourCandlesBlown.indexOf(false);
        if (nextIndex !== -1) {
          blowCandle(nextIndex);
        }
      });
    }

    // Relight Candles & Make Wishes Again
    if (elements.btnRelightWishes) {
      elements.btnRelightWishes.addEventListener('click', () => {
        state.fourCandlesBlown = [false, false, false, false];

        elements.finalFlames.forEach(flame => {
          if (flame) flame.classList.remove('flame-extinguished');
        });
        elements.finalSmokes.forEach(smoke => {
          if (smoke) smoke.classList.add('hidden');
        });
        elements.finalCandleUnits.forEach(unit => {
          if (unit) unit.classList.remove('is-extinguished');
        });
        elements.wishItems.forEach(item => {
          if (item) {
            item.classList.add('wish-hidden');
            item.classList.remove('wish-visible');
          }
        });

        if (elements.fourCakeAurora) {
          elements.fourCakeAurora.classList.remove('aurora-off');
        }
        if (elements.grandFinaleCelebrationSheet) {
          elements.grandFinaleCelebrationSheet.classList.add('hidden');
        }

        if (elements.candlesBlownStatusText) {
          elements.candlesBlownStatusText.textContent = 'Candles Blown: 0 / 4 🕯️';
        }
        if (elements.btnBlowStepCandle) {
          elements.btnBlowStepCandle.disabled = false;
          elements.btnBlowStepCandle.style.opacity = '1';
        }
        if (elements.btnBlowStepText) {
          elements.btnBlowStepText.textContent = 'Blow Out Candle 1 🕯️';
        }

        playMusicBoxNote(659.25, 0.5, 0.2);
        launchHeartConfetti(0.5, 0.4);
      });
    }
  }

  /* ==========================================================================
     LAST SPECIAL GIFT & VIDEO MEMORIES THEATER (YOU & US)
     ========================================================================== */

  function setupVideoMemoriesTheater() {
    function goToVideoStep(stepNum) {
      if (stepNum === 1) {
        if (elements.playerVideoUs) elements.playerVideoUs.pause();
        if (elements.videoStepYouPane) {
          elements.videoStepYouPane.classList.remove('video-step-hidden');
          elements.videoStepYouPane.classList.add('video-step-active');
        }
        if (elements.videoStepUsPane) {
          elements.videoStepUsPane.classList.add('video-step-hidden');
          elements.videoStepUsPane.classList.remove('video-step-active');
        }
        if (elements.badgeStepYou) {
          elements.badgeStepYou.classList.add('active');
          elements.badgeStepYou.classList.remove('completed');
          elements.badgeStepYou.innerHTML = '<span class="stepper-dot">🌸</span><span class="stepper-label">Reel 1: YOU</span>';
        }
        if (elements.badgeStepUs) {
          elements.badgeStepUs.classList.remove('active');
        }
      } else if (stepNum === 2) {
        if (elements.playerVideoYou) elements.playerVideoYou.pause();
        if (elements.videoStepYouPane) {
          elements.videoStepYouPane.classList.add('video-step-hidden');
          elements.videoStepYouPane.classList.remove('video-step-active');
        }
        if (elements.videoStepUsPane) {
          elements.videoStepUsPane.classList.remove('video-step-hidden');
          elements.videoStepUsPane.classList.add('video-step-active');
        }
        if (elements.badgeStepYou) {
          elements.badgeStepYou.classList.remove('active');
          elements.badgeStepYou.classList.add('completed');
          elements.badgeStepYou.innerHTML = '<span class="stepper-dot">✓</span><span class="stepper-label">YOU 🌸</span>';
        }
        if (elements.badgeStepUs) {
          elements.badgeStepUs.classList.add('active');
        }
        if (elements.videoStepUsPane) {
          elements.videoStepUsPane.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
    }

    // Open Video Gift Click
    if (elements.btnOpenVideoGift) {
      elements.btnOpenVideoGift.addEventListener('click', () => {
        playCelebrationChimes();
        launchConfetti(0.5, 0.4);
        launchHeartConfetti(0.5, 0.4);

        if (elements.videoMemoriesTheater) {
          elements.videoMemoriesTheater.classList.remove('hidden');
          goToVideoStep(1);
          elements.videoMemoriesTheater.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
      elements.btnOpenVideoGift.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          elements.btnOpenVideoGift.click();
        }
      });
    }

    // Next Button: Step 1 ("YOU") -> Step 2 ("US")
    if (elements.btnNextToUsVideo) {
      elements.btnNextToUsVideo.addEventListener('click', () => {
        playCelebrationChimes();
        launchConfetti(0.5, 0.4);
        launchHeartConfetti(0.5, 0.4);
        goToVideoStep(2);
      });
    }

    // Video 1 Ended Event: Pulse the Next button
    if (elements.playerVideoYou) {
      elements.playerVideoYou.addEventListener('ended', () => {
        launchHeartConfetti(0.5, 0.5);
        if (elements.btnNextToUsVideo) {
          elements.btnNextToUsVideo.style.transform = 'scale(1.08)';
          setTimeout(() => {
            if (elements.btnNextToUsVideo) elements.btnNextToUsVideo.style.transform = '';
          }, 800);
        }
      });
    }

    // Back Button: Step 2 ("US") -> Step 1 ("YOU")
    if (elements.btnBackToYouVideo) {
      elements.btnBackToYouVideo.addEventListener('click', () => {
        playPageTurnSound();
        goToVideoStep(1);
        if (elements.videoStepYouPane) {
          elements.videoStepYouPane.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      });
    }

    // Replay US Video Button
    if (elements.btnReplayUsVideo) {
      elements.btnReplayUsVideo.addEventListener('click', () => {
        if (elements.playerVideoUs) {
          elements.playerVideoUs.currentTime = 0;
          elements.playerVideoUs.play().catch(() => {});
          launchHeartConfetti(0.5, 0.4);
        }
      });
    }

    // Video 1: YOU - Upload handler
    if (elements.inputVideoYou && elements.playerVideoYou) {
      elements.inputVideoYou.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
          const videoUrl = URL.createObjectURL(file);
          elements.playerVideoYou.src = videoUrl;
          elements.playerVideoYou.classList.add('has-video');
          if (elements.placeholderVideoYou) {
            elements.placeholderVideoYou.classList.add('hidden');
          }
          elements.playerVideoYou.play().catch(() => {});
          launchHeartConfetti(0.35, 0.5);
        }
      });

      // Clicking placeholder triggers file input
      if (elements.placeholderVideoYou) {
        elements.placeholderVideoYou.addEventListener('click', () => {
          elements.inputVideoYou.click();
        });
      }
    }

    // Video 2: US - Upload handler
    if (elements.inputVideoUs && elements.playerVideoUs) {
      elements.inputVideoUs.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
          const videoUrl = URL.createObjectURL(file);
          elements.playerVideoUs.src = videoUrl;
          elements.playerVideoUs.classList.add('has-video');
          if (elements.placeholderVideoUs) {
            elements.placeholderVideoUs.classList.add('hidden');
          }
          elements.playerVideoUs.play().catch(() => {});
          launchHeartConfetti(0.65, 0.5);
        }
      });

      // Clicking placeholder triggers file input
      if (elements.placeholderVideoUs) {
        elements.placeholderVideoUs.addEventListener('click', () => {
          elements.inputVideoUs.click();
        });
      }
    }
  }

  /* ==========================================================================
     INTERACTIVE KITTEN (GIFT 2)
     ========================================================================== */

  const kittenPurrPhrases = [
    "Purrrr... you are the most precious girl in the universe! 🐾💗",
    "Meow! Hope your birthday is as sweet as you are! 🌷✨",
    "Nuzzling you with endless love and flowers! 💐🐱",
    "Headpats detected! Birthday happiness overload! 🌸💕"
  ];

  let phraseIdx = 0;

  function handleKittenClick() {
    playMusicBoxNote(880, 0.4, 0.2);
    launchHeartConfetti(0.5, 0.4);

    phraseIdx = (phraseIdx + 1) % kittenPurrPhrases.length;
    if (elements.kittenSpeechText) {
      elements.kittenSpeechText.textContent = kittenPurrPhrases[phraseIdx];
    }
  }

  /* ==========================================================================
     PHOTO FRAMES & LOCAL STORAGE PERSISTENCE
     ========================================================================== */

  const photoFrameConfigs = [
    { boxId: 'photoBox1', fileInputId: 'fileInput1', imgId: 'imgPlaceholder1', artId: 'defaultArt1', storageKey: 'scrapbook_photo_1' },
    { boxId: 'photoBox2', fileInputId: 'fileInput2', imgId: 'imgPlaceholder2', artId: 'defaultArt2', storageKey: 'scrapbook_photo_2' },
    { boxId: 'flowerPhotoBox1', fileInputId: 'fileInputFlower1', imgId: 'imgFlower1', artId: 'defaultFlowerArt1', storageKey: 'scrapbook_photo_flower_1' },
    { boxId: 'flowerPhotoBox2', fileInputId: 'fileInputFlower2', imgId: 'imgFlower2', artId: 'defaultFlowerArt2', storageKey: 'scrapbook_photo_flower_2' },
    { boxId: 'flowerPhotoBox3', fileInputId: 'fileInputFlower3', imgId: 'imgFlower3', artId: 'defaultFlowerArt3', storageKey: 'scrapbook_photo_flower_3' }
  ];

  function setupPhotoFrames() {
    photoFrameConfigs.forEach(cfg => {
      const box = document.getElementById(cfg.boxId);
      const input = document.getElementById(cfg.fileInputId);
      const img = document.getElementById(cfg.imgId);
      const art = document.getElementById(cfg.artId);

      if (!box || !input || !img || !art) return;

      // Click to open file picker
      box.addEventListener('click', (e) => {
        // Prevent triggering if clicked directly on input
        if (e.target !== input) {
          input.click();
        }
      });

      // Handle file selection
      input.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = function (evt) {
            const dataUrl = evt.target.result;
            img.src = dataUrl;
            img.classList.add('has-photo');
            art.classList.add('hidden');
            try {
              localStorage.setItem(cfg.storageKey, dataUrl);
            } catch (err) {
              console.warn('LocalStorage limit reached for photo, displayed for current session only.', err);
            }
          };
          reader.readAsDataURL(file);
        }
      });

      // Load saved photo if exists
      const saved = localStorage.getItem(cfg.storageKey);
      if (saved) {
        img.src = saved;
        img.classList.add('has-photo');
        art.classList.add('hidden');
      }
    });
  }

  function resetAllPhotos() {
    photoFrameConfigs.forEach(cfg => {
      localStorage.removeItem(cfg.storageKey);
      const img = document.getElementById(cfg.imgId);
      const art = document.getElementById(cfg.artId);
      if (img) {
        img.src = '';
        img.classList.remove('has-photo');
      }
      if (art) {
        art.classList.remove('hidden');
      }
    });
    alert('Photos reset to default romantic illustrations! 🎨');
  }

  /* ==========================================================================
     ROMANTIC TEXT & SAVED CONTENT LOADER
     ========================================================================== */

  function applyGirlfriendName(name) {
    state.girlfriendName = name.trim() || 'My Love';
    elements.displayNames.forEach(el => {
      if (el) el.textContent = state.girlfriendName;
    });
  }

  function setupPersonalization() {
    // Apply romantic default name
    applyGirlfriendName(state.girlfriendName);

    // Load saved letter or diary if present
    if (elements.editableLetterText) {
      const savedLetter = localStorage.getItem('scrapbook_letter_text');
      if (savedLetter) {
        elements.editableLetterText.innerHTML = savedLetter;
      }
    }

    if (elements.editableDiaryText) {
      const savedDiary = localStorage.getItem('scrapbook_diary_text');
      if (savedDiary) {
        elements.editableDiaryText.innerHTML = savedDiary;
      }
    }
  }

  /* ==========================================================================
     FALLING FLOWER PETALS & AMBIENT HEARTS GENERATOR
     ========================================================================== */

  function generateAmbientPetals() {
    if (!elements.petalsContainer) return;

    const petalCount = 18;
    for (let i = 0; i < petalCount; i++) {
      const petal = document.createElement('div');
      petal.classList.add('falling-petal-node');

      const size = Math.random() * 12 + 10;
      const left = Math.random() * 100;
      const duration = Math.random() * 8 + 8;
      const delay = Math.random() * 12;

      petal.style.width = `${size}px`;
      petal.style.height = `${size * 1.3}px`;
      petal.style.left = `${left}%`;
      petal.style.animationDuration = `${duration}s`;
      petal.style.animationDelay = `${delay}s`;

      elements.petalsContainer.appendChild(petal);
    }
  }

  function generateAmbientHearts() {
    const ambientHeartsContainer = document.getElementById('ambientHearts');
    if (!ambientHeartsContainer) return;

    const heartSymbols = ['💖', '💕', '🌸', '✨'];
    const heartCount = 14;

    for (let i = 0; i < heartCount; i++) {
      const bubble = document.createElement('div');
      bubble.classList.add('ambient-heart-bubble');
      bubble.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];

      const left = Math.random() * 100;
      const duration = Math.random() * 9 + 8;
      const delay = Math.random() * 10;
      const size = Math.random() * 1 + 0.8;

      bubble.style.left = `${left}%`;
      bubble.style.animationDuration = `${duration}s`;
      bubble.style.animationDelay = `${delay}s`;
      bubble.style.fontSize = `${size}rem`;

      ambientHeartsContainer.appendChild(bubble);
    }
  }

  /* ==========================================================================
     INITIALIZATION & EVENT BINDINGS
     ========================================================================== */

  function init() {
    // Blow Candles Button
    if (elements.btnBlowCandles) {
      elements.btnBlowCandles.addEventListener('click', handleBlowCandles);
    }

    // Love Question Buttons
    if (elements.btnLoveYes) {
      elements.btnLoveYes.addEventListener('click', handleLoveYes);
    }

    if (elements.btnLoveNo) {
      elements.btnLoveNo.addEventListener('click', handleLoveNo);
      // Playful evasion: occasionally dodge slightly on hover
      elements.btnLoveNo.addEventListener('mouseenter', () => {
        const randX = (Math.random() * 40 - 20).toFixed(0);
        const randY = (Math.random() * 20 - 10).toFixed(0);
        elements.btnLoveNo.style.transform = `translate(${randX}px, ${randY}px)`;
      });
      elements.btnLoveNo.addEventListener('mouseleave', () => {
        elements.btnLoveNo.style.transform = '';
      });
    }

    if (elements.btnRetryLove) {
      elements.btnRetryLove.addEventListener('click', handleRetryLove);
    }

    // Music Box Widget
    if (elements.musicBoxWidget) {
      elements.musicBoxWidget.addEventListener('click', (e) => {
        toggleMusicBox();
      });
    }

    // Interactive Kitten
    if (elements.kittenAvatar) {
      elements.kittenAvatar.addEventListener('click', handleKittenClick);
    }

    // Setup Sub-systems
    setupGiftCards();
    setupBackButtons();
    setupPhotoFrames();
    setupPersonalization();
    generateAmbientPetals();
    generateAmbientHearts();
    updateGiftsUI();
    setupNextSurpriseButtons();
    setupFourCandlesCake();
    setupVideoMemoriesTheater();

    // Auto focus and gentle greeting log
    console.log('%c🎂 Scrapbook Birthday Surprise Loaded with Love! 💖', 'color: #ff4d6d; font-size: 16px; font-weight: bold;');
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
