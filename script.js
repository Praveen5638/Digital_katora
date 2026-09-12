/**
 * DIGITAL KATORA — NEO-DESI MOTION & DYNAMIC APPLICATION ENGINE
 * Ultra-Premium Glassmorphism + Authentic Gareeb Ka Katora UI System
 */

// 1. Audio Engine (Web Audio API Synthesizer)
function playCoinChime() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    // High-pitched coin pickup chime (B5 -> E6)
    osc.frequency.setValueAtTime(987.77, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1318.51, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.35, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.45);
  } catch (e) {
    console.warn('Audio Context not allowed or supported:', e);
  }
}

// 2. Confetti Particle Engine
function launchConfetti(x = 0.5, y = 0.5, count = 50) {
  const colors = ['#6C5CE7', '#FFB800', '#00B894', '#FF6B6B', '#A29BFE', '#FFD93D'];
  for (let i = 0; i < count; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti-particle';
    const bg = colors[Math.floor(Math.random() * colors.length)];
    const size = Math.random() * 8 + 6;
    
    confetti.style.cssText = `
      position: fixed;
      left: ${x * 100}vw;
      top: ${y * 100}vh;
      width: ${size}px;
      height: ${size}px;
      background: ${bg};
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
      pointer-events: none;
      z-index: 99999;
      transform: translate(-50%, -50%);
    `;
    document.body.appendChild(confetti);

    const angle = Math.random() * Math.PI * 2;
    const velocity = Math.random() * 220 + 80;
    const destX = Math.cos(angle) * velocity;
    const destY = Math.sin(angle) * velocity - 100;
    const rotation = Math.random() * 720;

    confetti.animate([
      { transform: 'translate(-50%, -50%) scale(1) rotate(0deg)', opacity: 1 },
      { transform: `translate(calc(-50% + ${destX}px), calc(-50% + ${destY}px)) scale(0.6) rotate(${rotation}deg)`, opacity: 0 }
    ], {
      duration: 1200 + Math.random() * 600,
      easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
    }).onfinish = () => confetti.remove();
  }
}

// 3. Toast Notification System
function showToast(message, type = 'success') {
  let container = document.querySelector('.toast-wrap-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-wrap-container';
    container.style.cssText = `
      position: fixed;
      top: 24px;
      right: 24px;
      z-index: 100000;
      display: flex;
      flex-direction: column;
      gap: 10px;
      pointer-events: none;
    `;
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  const borderCol = type === 'success' ? 'var(--green)' : 'var(--primary)';
  toast.style.cssText = `
    background: var(--bg-surface);
    border: 1px solid var(--border-subtle);
    border-left: 4px solid ${borderCol};
    border-radius: var(--radius-md);
    padding: 1rem 1.4rem;
    color: var(--text-primary);
    box-shadow: var(--shadow-hover);
    font-weight: 600;
    font-size: 0.95rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    pointer-events: auto;
    animation: slideFeedElastic 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  `;
  toast.innerHTML = `<span>${type === 'success' ? '🪙' : '✨'}</span> <div>${message}</div>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// 4. Modal Donation Management (2-Step UPI QR Cinema)
let currentModalKatoraId = 'katora-chai-fund';
let selectedAmount = 51;
let uploadedQrDataUrl = null;

function openDonationModal(recipientName = 'Rahul 🥣', katoraId = 'katora-chai-fund', defaultAmount = 51) {
  currentModalKatoraId = katoraId;
  selectedAmount = defaultAmount;

  const modal = document.getElementById('donation-modal-overlay');
  const titleElem = document.getElementById('modal-recipient-name');
  const customField = document.getElementById('modal-custom-amount');

  if (titleElem) titleElem.textContent = recipientName;
  if (customField) customField.value = selectedAmount;

  // Reset to Step 1
  goToModalStep1();

  document.querySelectorAll('.modal-overlay .amount-pill-btn').forEach(pill => {
    pill.classList.remove('active');
    if (parseInt(pill.dataset.amount || pill.textContent.replace('₹', '')) === selectedAmount) {
      pill.classList.add('active');
    }
  });

  if (modal) modal.classList.add('active');
  if (navigator.vibrate) navigator.vibrate(25);
}

function closeDonationModal() {
  const modal = document.getElementById('donation-modal-overlay');
  if (modal) {
    modal.classList.remove('active');
    // Clean up animation classes after close transition
    setTimeout(() => {
      const coin = document.getElementById('modalAnimFlyingCoin');
      const beggar = document.getElementById('modalAnimBeggar');
      const bowl = document.getElementById('modalKatoraBowl');
      const ting = document.getElementById('modalTingShockwave');
      if (coin) coin.classList.remove('animate');
      if (beggar) beggar.classList.remove('happy');
      if (bowl) bowl.classList.remove('shake');
      if (ting) ting.classList.remove('show');
    }, 400);
  }
}

function goToModalStep1() {
  const s1 = document.getElementById('modal-step-1');
  const s2 = document.getElementById('modal-step-2');
  const s3 = document.getElementById('modal-step-3');
  if (s1) s1.style.display = 'block';
  if (s2) s2.style.display = 'none';
  if (s3) s3.style.display = 'none';
}

function goToModalStep2() {
  const customField = document.getElementById('modal-custom-amount');
  const amount = parseInt(customField ? customField.value : selectedAmount) || 51;
  selectedAmount = amount;

  const katora = window.dataStore?.getKatoraById(currentModalKatoraId);
  const upiId = katora?.upiId || 'rahul.tapri@okhdfcbank';
  const creator = katora?.creator || 'Digital Beggar';

  // Populate Step 2 Elements
  const amtDisplay = document.getElementById('modal-qr-amount-display');
  const upiDisplay = document.getElementById('modal-beggar-upi-id');
  const intentLink = document.getElementById('modal-upi-intent-link');
  const qrImg = document.getElementById('modal-beggar-qr-img');

  if (amtDisplay) amtDisplay.textContent = `₹${amount}`;
  if (upiDisplay) upiDisplay.textContent = upiId;

  // Standard UPI URI format supported by GPay, PhonePe, Paytm, BHIM, CRED
  const upiUri = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(creator)}&am=${amount}&cu=INR&tn=${encodeURIComponent('Digital Katora Punya Donation')}`;
  
  if (intentLink) intentLink.href = upiUri;

  // Set QR image (use beggar's custom uploaded QR if available, otherwise dynamic live vector QR code)
  if (qrImg) {
    if (katora?.customQr) {
      qrImg.src = katora.customQr;
    } else {
      qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=4&data=${encodeURIComponent(upiUri)}`;
    }
  }

  // Switch views
  const s1 = document.getElementById('modal-step-1');
  const s2 = document.getElementById('modal-step-2');
  const s3 = document.getElementById('modal-step-3');
  if (s1) s1.style.display = 'none';
  if (s2) s2.style.display = 'block';
  if (s3) s3.style.display = 'none';
}

function copyModalUpiId() {
  const upiDisplay = document.getElementById('modal-beggar-upi-id');
  const text = upiDisplay?.textContent || 'rahul@upi';
  navigator.clipboard.writeText(text).then(() => {
    showToast(`📋 UPI ID "${text}" copied to clipboard!`);
  }).catch(() => {
    showToast(`UPI ID: ${text}`);
  });
}

// 🎬 MAIN DONATION POPUP ANIMATION ENGINE
let modalAutoCloseTimer = null;

function verifyAndSubmitPayment() {
  const s1 = document.getElementById('modal-step-1');
  const s2 = document.getElementById('modal-step-2');
  const s3 = document.getElementById('modal-step-3');

  if (s1) s1.style.display = 'none';
  if (s2) s2.style.display = 'none';
  if (s3) s3.style.display = 'block';

  const donorNameField = document.getElementById('modal-donor-name');
  const donorMsgField = document.getElementById('modal-donor-message');

  const donorName = (donorNameField && donorNameField.value.trim()) || 'Generous Friend';
  const message = (donorMsgField && donorMsgField.value.trim()) || 'Katora ko pyaar mila ❤️';

  const katora = window.dataStore?.getKatoraById(currentModalKatoraId);
  const beggarName = katora?.creator || 'राहुल';
  const beggarImg = katora?.image || 'mascot-beggar-3d.jpg';
  const earnedPunya = 102;

  // 1. Populate dynamic celebration stage elements (Social Action / Thank-You)
  const amtDisp = document.getElementById('modalSuccessAmtDisplay');
  const subDisp = document.getElementById('modalSuccessSub');
  const beggarNameDisp = document.getElementById('modalAnimBeggarName');
  const beggarImgDisp = document.getElementById('modalAnimBeggarImg');
  const punyaPtsDisp = document.getElementById('modalEarnedPunyaPts');

  if (amtDisp) amtDisp.textContent = `❤️ I Helped!`;
  if (subDisp) subDisp.textContent = `${beggarName} ke katore ko aapki taraf se dher sara pyaar mila! ✨`;
  if (beggarNameDisp) beggarNameDisp.textContent = `🥺 ${beggarName.split(' ')[0]}`;
  if (beggarImgDisp) beggarImgDisp.src = beggarImg;
  if (punyaPtsDisp) punyaPtsDisp.textContent = `+${earnedPunya} Karma`;

  // 2. Play Audio & Confetti
  playCoinChime();
  launchConfetti(0.5, 0.45, 75);

  // 3. Trigger In-Modal Parabolic Coin Flight & Happy Mascot Reaction
  const coin = document.getElementById('modalAnimFlyingCoin');
  const beggar = document.getElementById('modalAnimBeggar');
  const bowl = document.getElementById('modalKatoraBowl');
  const ting = document.getElementById('modalTingShockwave');

  if (coin) {
    coin.classList.remove('animate');
    void coin.offsetWidth;
    coin.classList.add('animate');
  }

  // Coin Landing & Impact Reactivity (at 500ms)
  setTimeout(() => {
    if (bowl) {
      bowl.classList.remove('shake');
      void bowl.offsetWidth;
      bowl.classList.add('shake');
    }
    if (beggar) beggar.classList.add('happy');
    if (ting) {
      ting.classList.remove('show');
      void ting.offsetWidth;
      ting.classList.add('show');
    }
  }, 500);

  // 4. Save Social Cheer to DataStore (does not falsely manipulate verified financial numbers)
  window.dataStore?.addSocialCheer(currentModalKatoraId, {
    donorName,
    message
  });

  // 5. Instantly Refresh Live Page Cards & Stats
  if (window.location.pathname.includes('katora-detail.html')) {
    renderKatoraDetailPage();
  } else if (window.location.pathname.includes('katoras.html')) {
    renderExploreKatorasPage();
  } else if (window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/') || window.location.pathname === '') {
    renderIndexPage();
  }

  // 6. Broadcast Data Update Event
  window.dispatchEvent(new CustomEvent('dk_data_updated', { detail: { katoraId: currentModalKatoraId } }));

  // 7. Auto-Dismiss Modal after 2.8 seconds of celebration
  if (modalAutoCloseTimer) clearTimeout(modalAutoCloseTimer);
  modalAutoCloseTimer = setTimeout(() => {
    closeDonationModal();
    showToast(`🎉 ${beggarName} ke katore ko aapki taraf se dher sara pyaar mila! ✨`);
  }, 2800);
}

// Global helper for legacy onclick="donate('Rahul')"
window.donate = function(name, amount = 51) {
  const katoras = window.dataStore?.getKatoras() || [];
  const found = katoras.find(k => k.creator.toLowerCase().includes(name.toLowerCase()) || k.title.toLowerCase().includes(name.toLowerCase()));
  const kId = found ? found.id : (katoras[0]?.id || 'katora-chai-fund');
  openDonationModal(name + ' 🥣', kId, amount);
};

window.customDonate = function(name) {
  window.donate(name, 101);
};

// 5. Live Feed Insertion
function addFeedItem(message) {
  const feed = document.getElementById('live-donation-feed-list') || document.querySelector('.feed-scroll-box');
  if (!feed) return;

  const item = document.createElement('div');
  item.className = 'feed-item-card';
  item.innerHTML = `
    <div class="feed-item-left" style="display:flex; align-items:center; gap:0.5rem;">
      <span class="feed-coin-icon">🪙</span>
      <span style="font-size: 0.92rem; font-weight: 600;">${message}</span>
    </div>
    <span class="feed-amount-badge">LIVE</span>
  `;

  feed.prepend(item);
  if (feed.children.length > 8) {
    feed.removeChild(feed.lastChild);
  }
}

// 6. Theme Engine
function initTheme() {
  const saved = localStorage.getItem('dk_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);

  const toggleBtn = document.getElementById('theme-toggle-btn') || document.getElementById('themeToggleBtn');
  if (toggleBtn) {
    updateThemeIcon(toggleBtn, saved);
    toggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('dk_theme', next);
      updateThemeIcon(toggleBtn, next);
    });
  }
}

function updateThemeIcon(btn, theme) {
  const icon = btn.querySelector('.theme-icon') || btn;
  if (!icon) return;
  if (theme === 'dark') {
    icon.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="5" fill="currentColor"/><path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>';
  } else {
    icon.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" fill="currentColor"/></svg>';
  }
}

// 7. QR Upload Handler for Beggars (create-katora.html)
window.handleQrImageUpload = function(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    showToast('Kripya image file (PNG/JPG) hi upload karein!', 'error');
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    uploadedQrDataUrl = e.target.result;
    const placeholder = document.getElementById('qr-upload-placeholder');
    const previewWrap = document.getElementById('qr-upload-preview-wrap');
    const previewImg = document.getElementById('qr-preview-img');

    if (placeholder) placeholder.style.display = 'none';
    if (previewWrap) previewWrap.style.display = 'flex';
    if (previewImg) previewImg.src = uploadedQrDataUrl;

    showToast('📸 QR Code Image successfully attached!');
  };
  reader.readAsDataURL(file);
};

// 8. Helper: Generate Gareeb Ka Katora Card HTML
function createGareebCardHTML(k) {
  const current = k.currentAmount || 0;
  const target = k.targetAmount || 1000;
  const pct = Math.min(100, Math.round((current / target) * 100));
  const tapeTexts = ['🩹 100% असली गरीब', '🪡 फटा हुआ जेब', '📉 खाली वॉलेट', '☕ चाय की कमी', '🍕 भूखी आत्मा'];
  const tapeText = tapeTexts[Math.abs(k.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % tapeTexts.length];
  
  const avatarContent = k.image ? 
    `<img src="${k.image}" alt="${k.creator}" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">` : 
    `<span style="font-size: 1.6rem;">${k.avatar || '🥣'}</span>`;

  return `
    <div class="katora-card bhikhari-card" style="display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
          <span class="katora-cat-pill">${k.categoryName || 'मीम और देसी'}</span>
          <span class="garib-pill-badge bhikhari-tape-tag">${tapeText}</span>
        </div>

        <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.85rem;">
          <div class="avatar-ring-garib" title="${k.creator}">
            <div class="avatar-inner-garib">
              ${avatarContent}
            </div>
          </div>
          <div style="flex: 1; min-width: 0;">
            <h4 class="katora-creator-name" style="margin: 0; font-size: 1.05rem;">
              <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: inline-block; max-width: 150px;">${k.creator}</span>
              <span style="color: var(--green); font-size: 0.85rem;" title="Verified Beggar">✓</span>
            </h4>
            <span style="font-size: 0.75rem; color: var(--text-muted); font-family: var(--font-mono);">UPI: ${k.upiId}</span>
          </div>
        </div>

        <h3 class="katora-headline" style="font-size: 1.1rem; margin-bottom: 0.4rem; line-height: 1.3;">${k.title}</h3>
        <p class="katora-story-snippet" style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1rem; line-height: 1.4;">"${k.tagline || k.story}"</p>
      </div>

      <div>
        <div class="garib-progress-wrap" style="margin-bottom: 1rem;">
          <div class="garib-progress-labels" style="font-size: 0.8rem; margin-bottom: 0.35rem;">
            <span class="garib-raised-val" style="font-weight: 700;">₹${current.toLocaleString('en-IN')} <small style="font-weight: 500; font-size: 0.75rem; color: var(--text-muted);">/ ₹${target.toLocaleString('en-IN')}</small></span>
            <span class="garib-goal-val" style="font-weight: 800; color: ${pct >= 100 ? 'var(--green-light)' : 'var(--gold-light)'};">${pct}% भरा 🥣</span>
          </div>
          <div class="garib-meter-track" style="height: 7px; background: rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden;">
            <div class="garib-meter-fill" style="width: ${pct}%; height: 100%; background: ${pct >= 100 ? 'var(--green-gradient)' : 'var(--gold-gradient)'}; border-radius: 4px;"></div>
          </div>
          <div class="garib-status-pill" style="display: flex; justify-content: space-between; font-size: 0.75rem; margin-top: 0.4rem; color: var(--text-muted);">
            <span>👥 ${k.donations ? k.donations.length : 0} दयालु दानी</span>
            <span>${pct >= 100 ? '🎉 पूरा हुआ' : `⚡ ₹${Math.max(0, target - current).toLocaleString('en-IN')} बाकी`}</span>
          </div>
        </div>

        <div class="quick-chanda-chips" style="display: flex; gap: 0.4rem; align-items: center; margin-bottom: 0.85rem; flex-wrap: wrap;">
          <span class="chanda-chip-label" style="font-size: 0.75rem; color: var(--text-muted);">🪙 शगुन:</span>
          <button class="chanda-chip-btn" onclick="openDonationModal('${k.creator.replace(/'/g, "\\'")}', '${k.id}', 10)">₹10</button>
          <button class="chanda-chip-btn" onclick="openDonationModal('${k.creator.replace(/'/g, "\\'")}', '${k.id}', 21)">₹21</button>
          <button class="chanda-chip-btn" onclick="openDonationModal('${k.creator.replace(/'/g, "\\'")}', '${k.id}', 51)">₹51</button>
          <button class="chanda-chip-btn" onclick="openDonationModal('${k.creator.replace(/'/g, "\\'")}', '${k.id}', 101)">₹101</button>
        </div>

        <div style="display: flex; gap: 0.4rem;">
          <a href="katora-detail.html?id=${k.id}" class="btn btn-glass" style="flex: 1; padding: 0.5rem 0.4rem; font-size: 0.8rem; min-height: 38px; text-align: center;">
            कटोरा देखें 🥣
          </a>
          <button class="btn btn-paisa-green" style="flex: 1.2; padding: 0.5rem 0.5rem; font-size: 0.82rem; min-height: 38px;" onclick="openDonationModal('${k.creator.replace(/'/g, "\\'")}', '${k.id}', 51)">
            <span>🪙</span> डालें ₹51
          </button>
          <button class="btn btn-glass" style="padding: 0.5rem 0.6rem; min-width: 38px; min-height: 38px;" onclick="openShareKatoraModal('${k.id}')" title="Share Katora">
            <span>📤</span>
          </button>
        </div>
      </div>
    </div>
  `;
}

// 9. Page Renderers

// A. INDEX.HTML
function renderIndexPage() {
  const stats = window.dataStore?.getGlobalStats();
  
  // Animate count-up stats
  const actEl = document.getElementById('statActiveKatoras') || document.getElementById('activeKatoras');
  const colEl = document.getElementById('statTotalCollected') || document.getElementById('totalCollected');
  const donEl = document.getElementById('statTotalDonors') || document.getElementById('totalDonors');
  const hapEl = document.getElementById('statHappyMoments');

  if (stats) {
    if (colEl) colEl.textContent = `₹${stats.totalCollected.toLocaleString('en-IN')}`;
    if (donEl) donEl.textContent = `${stats.totalDonors.toLocaleString('en-IN')}+`;
    if (actEl) actEl.textContent = `${stats.activeKatoras.toLocaleString('en-IN')}+`;
    if (hapEl) hapEl.textContent = stats.activeKatoras > 0 ? `${(stats.totalDonors * 3).toLocaleString('en-IN')}+` : '0';
  }

  // Render Trending Katoras Cards if present
  const trendingGrid = document.getElementById('indexKatorasGrid') || document.querySelector('.trending-katoras-grid') || document.querySelector('.katora-grid');
  if (trendingGrid) {
    const trending = window.dataStore?.getKatoras({ sort: 'trending' }) || [];
    if (trending.length > 0) {
      trendingGrid.innerHTML = trending.map(k => createGareebCardHTML(k)).join('');
    } else {
      trendingGrid.innerHTML = `
        <div class="empty-katora-state" style="grid-column: 1 / -1; text-align: center; padding: 3.5rem 1.5rem; background: var(--bg-surface); border-radius: var(--radius-lg); border: 2px dashed rgba(108, 92, 231, 0.35); box-shadow: var(--shadow-card);">
          <div style="font-size: 3.8rem; margin-bottom: 0.75rem; animation: floatMascot 3s infinite ease-in-out;">🥣 ✨</div>
          <h3 style="font-size: 1.6rem; margin-bottom: 0.5rem; color: var(--text-primary);">Abhi Koi Katora Nahi Bana Hai!</h3>
          <p style="color: var(--text-secondary); max-width: 500px; margin: 0 auto 1.75rem; font-size: 1rem; line-height: 1.6;">
            Sabse pehle apna digital katora banayein aur dosto ke sath share karke seedha UPI chanda paayein! 😂
          </p>
          <a href="create-katora.html" class="btn btn-primary-gradient btn-lg btn-glow-pulse" style="font-size: 1.05rem; padding: 0.85rem 2.2rem; display: inline-flex; align-items: center; gap: 0.5rem;">
            <span>🥣</span> Apna Katora Banao (30s) &rarr;
          </a>
        </div>
      `;
    }
  }

  // Auto Hero Coin-to-Katora Loop
  initHeroAnimationLoop();
}

function initHeroAnimationLoop() {
  const coin = document.getElementById('heroFlyingCoin');
  const beggar = document.getElementById('heroBeggarActor');
  const katora = document.getElementById('heroKatoraBowl');
  const emote = document.getElementById('heroEmotionBubble');

  if (!coin || !beggar || !katora) return;

  setInterval(() => {
    // Katora micro-bounce
    katora.classList.remove('shake');
    void katora.offsetWidth; // trigger reflow
    katora.classList.add('shake');

    // Emote bubble pulse
    if (emote) {
      emote.classList.add('show');
      setTimeout(() => emote.classList.remove('show'), 1800);
    }
  }, 2400);
}

// 5. Signature Interactive Showcase Coin Transfer
window.selectedShowcaseAmt = 51;
window.triggerShowcaseTransfer = function(amt = 51) {
  window.selectedShowcaseAmt = amt;
  document.querySelectorAll('.showcase-pill-btn').forEach(btn => {
    if (btn.textContent.includes('₹' + amt)) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  playCoinChime();
  launchConfetti(0.5, 0.55, 35);

  // Animate donor phone
  const donorAvatar = document.getElementById('showcaseDonorAvatar');
  if (donorAvatar) {
    donorAvatar.style.transform = 'scale(1.1) rotate(-6deg)';
    donorAvatar.style.transition = 'transform 0.25s ease';
    setTimeout(() => donorAvatar.style.transform = 'scale(1) rotate(0deg)', 300);
  }

  // Create flying coin across showcase
  const stage = document.getElementById('showcaseStage');
  if (stage) {
    const coin = document.createElement('div');
    coin.className = 'interactive-flying-coin';
    coin.textContent = '₹';
    coin.style.cssText = `
      position: absolute;
      left: 18%;
      top: 32%;
      width: 48px;
      height: 48px;
      background: radial-gradient(circle at 35% 35%, #FFD93D, #FFB800 65%, #E67E22);
      border: 2px solid #FFF;
      border-radius: 50%;
      box-shadow: 0 0 25px rgba(255, 217, 61, 0.9);
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: var(--font-mono);
      font-size: 22px;
      font-weight: 900;
      color: #8B4513;
      z-index: 100;
      pointer-events: none;
    `;
    stage.appendChild(coin);

    coin.animate([
      { left: '18%', top: '35%', transform: 'scale(0.5) rotate(0deg)', opacity: 1 },
      { left: '50%', top: '8%', transform: 'scale(1.25) rotate(360deg)', opacity: 1 },
      { left: '80%', top: '35%', transform: 'scale(0.8) rotate(720deg)', opacity: 1 },
      { left: '80%', top: '45%', transform: 'scale(0.2) rotate(900deg)', opacity: 0 }
    ], {
      duration: 750,
      easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
    }).onfinish = () => {
      coin.remove();
      // Beggar avatar celebration
      const beggarAvatar = document.getElementById('showcaseBeggarAvatar');
      if (beggarAvatar) {
        beggarAvatar.style.transform = 'scale(1.15) rotate(6deg)';
        beggarAvatar.style.boxShadow = '0 0 35px var(--green-glow)';
        beggarAvatar.style.transition = 'all 0.3s ease';
        setTimeout(() => {
          beggarAvatar.style.transform = 'scale(1) rotate(0deg)';
          beggarAvatar.style.boxShadow = '0 0 25px var(--gold-glow)';
        }, 500);
      }
      
      // Update Punya Points
      const punyaEl = document.getElementById('showcase-punya-pts');
      const fillEl = document.getElementById('showcase-ghada-fill');
      const pctEl = document.getElementById('showcase-ghada-pct');
      const tierEl = document.getElementById('showcase-ghada-tier');

      const extraPunya = amt * 2;
      showToast(`🪙 ₹${amt} Katora mein gira! +${extraPunya} Punya Points Prapt Hue! 🌟`);

      if (punyaEl) punyaEl.textContent = `✨ +${extraPunya} Punya`;
      if (fillEl && pctEl) {
        let currentPct = parseInt(pctEl.textContent) || 65;
        currentPct = Math.min(100, currentPct + Math.max(4, Math.round(amt / 12)));
        fillEl.style.width = `${currentPct}%`;
        pctEl.textContent = `${currentPct}% Full`;
        if (currentPct >= 100 && tierEl) {
          tierEl.textContent = '🌟 Swarg VIP Pass / Moksha!';
          tierEl.style.color = 'var(--gold-light)';
        }
      }
    };
  }
};

// 7. Donor Achievement Social Flex Handlers
window.shareOnWhatsApp = function() {
  const text = encodeURIComponent('Maine Digital Katora par ₹5,001 daan karke "👑 Maha-Daani Samrat #1" badge jeeta hai! Aap bhi gareeb dosto ke katora me sikke dalo: https://digitalkatora.fun');
  window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
};

window.shareOnInstagram = function() {
  playCoinChime();
  showToast('📸 Screenshot this golden badge & tag @DigitalKatora on your Instagram Story!');
};

window.downloadCertificate = function() {
  playCoinChime();
  launchConfetti(0.5, 0.5, 60);
  showToast('🏆 Downloading official Digital Katora Maha-Daani NFT Certificate...');
};

window.copyFlexLink = function() {
  navigator.clipboard?.writeText('https://digitalkatora.fun/achievement/sameer-rao-mahadaani');
  showToast('📋 Achievement Flex link copied to clipboard!');
};

// B. KATORAS.HTML (EXPLORE PAGE SYSTEM)
let exploreActiveCategory = 'all';
let exploreSearchQuery = '';
let exploreSortOrder = 'trending';
let exploreVisibleLimit = 8;

function createExploreCardHTML(k) {
  const pct = Math.min(100, Math.round((k.currentAmount / k.targetAmount) * 100));
  const isComplete = pct >= 100;
  const isAlmost = pct >= 75 && !isComplete;

  const defaultBadges = ['🩹 100% असली गरीब', '🪡 फटा हुआ जेब', '📉 खाली वॉलेट', '☕ चाय की कमी', '🍗 भूखी आत्मा'];
  const badgeText = isComplete ? '🎉 लक्ष्य पूरा!' : isAlmost ? '⚡ पूरा होने वाला है' : defaultBadges[Math.abs(k.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % defaultBadges.length];

  const imgSource = k.image || 'mascot-beggar-3d.jpg';

  return `
    <div class="katora-card-explore" data-id="${k.id}">
      <!-- Top Badges -->
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span class="katora-cat-pill">${k.categoryName || 'मीम और देसी'}</span>
        <span class="garib-pill-badge">${badgeText}</span>
      </div>

      <!-- Fixed Media Container (No face cropping) -->
      <div class="katora-media-box">
        <img src="${imgSource}" alt="${k.creator}" loading="lazy">
        
        <!-- Mini Golden Katora with Hover Coin Drop -->
        <div class="mini-katora-hover-box" title="Drop Coin Into Katora">
          <span class="mini-hover-coin">🪙</span>
          <span>✨</span>
        </div>
      </div>

      <!-- Creator Identity -->
      <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 0.15rem;">
        <h4 class="katora-creator-name">
          <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 170px;">${k.creator}</span>
          <span style="color: var(--green); font-size: 0.82rem;" title="Verified Beggar">✓</span>
        </h4>
        <span style="font-size: 0.75rem; color: var(--text-muted); font-family: var(--font-mono);">
          👥 ${k.donations ? k.donations.length : 0} Donors
        </span>
      </div>

      <!-- Funny Headline & Short Snippet -->
      <h3 class="katora-headline" style="font-size: 0.98rem; min-height: 2.6rem;">${k.title}</h3>
      <p class="katora-story-snippet" style="font-size: 0.82rem; min-height: 2.4rem;">"${k.tagline || k.story}"</p>

      <!-- Progress Track & Values -->
      <div class="garib-progress-wrap" style="margin-top: auto;">
        <div class="garib-progress-labels">
          <span class="garib-raised-val" style="font-size: 0.95rem;">
            ₹${k.currentAmount.toLocaleString('en-IN')} 
            <small style="font-weight: 500; font-size: 0.75rem; color: var(--text-muted);">/ ₹${k.targetAmount.toLocaleString('en-IN')}</small>
          </span>
          <span class="garib-goal-val" style="color: ${isComplete ? 'var(--green-light)' : 'var(--gold-light)'}; font-weight: 700;">
            ${pct}%
          </span>
        </div>
        <div class="garib-meter-track" style="height: 8px;">
          <div class="garib-meter-fill" style="width: ${pct}%; background: ${isComplete ? 'var(--green-gradient)' : 'var(--gold-gradient)'};"></div>
        </div>
      </div>

      <!-- Primary Card CTA -->
      <div style="display: flex; gap: 0.4rem; margin-top: 0.5rem;">
        <a href="katora-detail.html?id=${k.id}" class="btn btn-glass btn-sm" style="flex: 1; min-height: 38px; font-size: 0.8rem; padding: 0.4rem 0.5rem;" title="View Details">
          🥣 देखें
        </a>
        <button class="btn btn-primary-gradient btn-sm" style="flex: 1.3; min-height: 38px; font-size: 0.82rem; padding: 0.4rem 0.5rem;" onclick="openDonationModal('${k.creator.replace(/'/g, "\\'")}', '${k.id}', 1)">
          <span>🪙</span> DALO ₹1 😂
        </button>
        <button class="btn btn-glass btn-sm" style="padding: 0.4rem 0.6rem; min-width: 38px;" onclick="openShareKatoraModal('${k.id}')" title="Share Katora">
          <span>📤</span>
        </button>
      </div>
    </div>
  `;
}

function renderFeaturedKatora() {
  const featuredBox = document.getElementById('featuredKatoraContainer');
  if (!featuredBox || !window.dataStore) return;

  const katoras = window.dataStore.getKatoras({ sort: 'trending' });
  const featured = katoras.find(k => k.featured) || katoras[0];
  if (!featured) {
    featuredBox.style.display = 'none';
    return;
  }
  featuredBox.style.display = 'block';

  const pct = Math.min(100, Math.round(((featured.currentAmount || 0) / (featured.targetAmount || 1)) * 100));

  featuredBox.innerHTML = `
    <div class="featured-katora-banner">
      <div class="featured-katora-grid">
        <!-- Left: 3D Mascot Character -->
        <div class="featured-mascot-box">
          <img src="${featured.image || 'mascot-beggar-3d.jpg'}" alt="${featured.creator}">
          <div class="featured-golden-bowl">
            <span>✨</span>
          </div>
        </div>

        <!-- Right: Story Details & Action -->
        <div style="display: flex; flex-direction: column; gap: 0.75rem; text-align: left;">
          <div style="display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap;">
            <span class="hero-pill-badge" style="margin-bottom: 0; padding: 0.25rem 0.8rem; font-size: 0.78rem;">
              🔥 FEATURED SPOTLIGHT #1
            </span>
            <span class="garib-pill-badge">🩹 100% असली गरीब</span>
          </div>

          <h2 class="text-h2" style="font-size: clamp(1.6rem, 2.5vw, 2.2rem); margin: 0.2rem 0;">
            ${featured.title}
          </h2>

          <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.95rem; color: var(--gold);">
            <strong>${featured.creator}</strong>
            <span style="color: var(--green); font-size: 0.85rem;" title="Verified Beggar">✓ Verified</span>
          </div>

          <p style="color: var(--text-secondary); font-size: 1rem; line-height: 1.6; margin: 0.25rem 0;">
            "${featured.story || featured.tagline}"
          </p>

          <!-- Progress -->
          <div class="garib-progress-wrap" style="max-width: 480px; margin: 0.5rem 0;">
            <div class="garib-progress-labels">
              <span class="garib-raised-val" style="font-size: 1.15rem;">
                ₹${(featured.currentAmount || 0).toLocaleString('en-IN')} 
                <small style="font-weight: 500; font-size: 0.82rem; color: var(--text-muted);">/ ₹${(featured.targetAmount || 1000).toLocaleString('en-IN')} इकट्ठा हुआ</small>
              </span>
              <span class="garib-goal-val" style="font-size: 0.95rem; font-weight: 800; color: var(--gold-light);">${pct}%</span>
            </div>
            <div class="garib-meter-track" style="height: 10px;">
              <div class="garib-meter-fill" style="width: ${pct}%;"></div>
            </div>
            <div class="garib-status-pill">
              <span>👥 ${featured.donations ? featured.donations.length : 0} Donors</span>
              <span>⚡ ${pct >= 100 ? 'पूरा हुआ' : 'मदद चालू है'}</span>
            </div>
          </div>

          <!-- Large CTA -->
          <div class="featured-cta-row" style="display: flex; gap: 0.85rem; align-items: center; flex-wrap: wrap; margin-top: 0.5rem;">
            <button class="btn btn-primary-gradient btn-lg btn-glow-pulse" onclick="openDonationModal('${featured.creator.replace(/'/g, "\\'")}', '${featured.id}', 1)" style="font-size: 1.1rem; padding: 0.9rem 2.2rem;">
              <span>🥣</span> DALO ₹1 😂
            </button>
            <a href="katora-detail.html?id=${featured.id}" class="btn btn-glass btn-lg" style="font-size: 0.95rem;">
              पूरा कटोरा देखें &rarr;
            </a>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderRecentlyHelped() {
  const track = document.getElementById('recentlyHelpedTrack');
  const section = document.querySelector('.recently-helped-section');
  if (!track || !window.dataStore) return;

  const katoras = window.dataStore.getKatoras();
  const helped = katoras.filter(k => k.donations && k.donations.length > 0).slice(0, 6);

  if (helped.length === 0) {
    if (section) section.style.display = 'none';
    return;
  }
  if (section) section.style.display = 'block';

  track.innerHTML = helped.map(k => {
    const recentDonation = k.donations[k.donations.length - 1] || { amount: 51, donorName: 'Anonymous' };
    return `
      <div class="recently-helped-card" onclick="openDonationModal('${k.creator.replace(/'/g, "\\'")}', '${k.id}', 1)" style="cursor: pointer;">
        <div class="avatar-ring-garib" style="width: 44px; height: 44px; flex-shrink: 0;">
          <div class="avatar-inner-garib">
            <img src="${k.image || 'mascot-beggar-3d.jpg'}" alt="${k.creator}" style="width: 100%; height: 100%; object-fit: cover;">
          </div>
        </div>
        <div style="flex: 1; min-width: 0;">
          <div style="font-size: 0.88rem; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
            ${k.creator}
          </div>
          <div style="font-size: 0.75rem; color: var(--green-light); font-family: var(--font-mono); font-weight: 600;">
            +₹${recentDonation.amount} received ✨
          </div>
          <div style="font-size: 0.7rem; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
            ${k.title}
          </div>
        </div>
        <span style="font-size: 1.2rem; flex-shrink: 0;">🥣</span>
      </div>
    `;
  }).join('');
}

function renderExploreKatorasPage() {
  if (!window.location.pathname.includes('katoras.html')) return;
  const container = document.getElementById('exploreKatorasGrid') || document.querySelector('.katora-grid-4col') || document.querySelector('.katora-grid');
  if (!container || !window.dataStore) return;

  renderFeaturedKatora();
  renderRecentlyHelped();

  const list = window.dataStore.getKatoras({
    category: exploreActiveCategory,
    search: exploreSearchQuery,
    sort: exploreSortOrder
  });

  if (list.length === 0) {
    container.innerHTML = `
      <div class="empty-katora-state">
        <div style="font-size: 4rem; margin-bottom: 0.75rem; animation: floatMascot 3s infinite ease-in-out;">🥣 💨</div>
        <h3 style="font-size: 1.6rem; margin-bottom: 0.5rem; color: var(--text-primary);">Arey! Koi Gareeb Katora Nahi Mila 😂</h3>
        <p style="color: var(--text-secondary); max-width: 480px; margin: 0 auto 1.75rem; font-size: 0.98rem; line-height: 1.6;">
          "${exploreSearchQuery ? `"${exploreSearchQuery}"` : 'Is category'}" ke sath koi katora match nahi hua. Search clear karein ya apna khud ka naya katora banayein!
        </p>
        <div style="display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap;">
          <button type="button" class="btn btn-glass" onclick="clearExploreSearch()">
            <span>🔄</span> Clear Search / Sabhi Katore
          </button>
          <a href="create-katora.html" class="btn btn-primary-gradient">
            <span>🥣</span> Mera Katora Banao
          </a>
        </div>
      </div>
    `;
    const loadMoreBtn = document.getElementById('loadMoreKatorasBtn');
    if (loadMoreBtn) loadMoreBtn.style.display = 'none';
    return;
  }

  const visibleItems = list.slice(0, exploreVisibleLimit);
  container.innerHTML = visibleItems.map(k => createExploreCardHTML(k)).join('');

  const loadMoreBtn = document.getElementById('loadMoreKatorasBtn');
  if (loadMoreBtn) {
    if (list.length <= exploreVisibleLimit) {
      loadMoreBtn.style.display = 'none';
    } else {
      loadMoreBtn.style.display = 'inline-flex';
      loadMoreBtn.innerHTML = `<span>🔄</span> Load More Katoras (${list.length - exploreVisibleLimit} Baaki) &darr;`;
    }
  }

  if (window.init3DCardTilt) window.init3DCardTilt();
}

window.clearExploreSearch = function() {
  const searchInput = document.getElementById('exploreSearchInput') || document.querySelector('.explore-search-input');
  const clearBtn = document.getElementById('searchClearBtn');
  if (searchInput) {
    searchInput.value = '';
    exploreSearchQuery = '';
    if (clearBtn) clearBtn.style.display = 'none';
    renderExploreKatorasPage();
  }
};

window.loadMoreKatoras = function() {
  const grid = document.getElementById('exploreKatorasGrid') || document.querySelector('.katora-grid-4col') || document.querySelector('.katora-grid');
  const btn = document.getElementById('loadMoreKatorasBtn');
  if (!grid || !window.dataStore) return;

  if (btn) {
    btn.innerHTML = `<span>⏳</span> Loading aur katore...`;
    btn.disabled = true;
  }

  // Create 4 skeleton cards matching real card dimensions
  const skeletonHtml = Array(4).fill(0).map(() => `
    <div class="skeleton-card">
      <div class="skeleton-box" style="height: 20px; width: 45%;"></div>
      <div class="skeleton-box" style="height: 175px; width: 100%;"></div>
      <div class="skeleton-box" style="height: 18px; width: 70%;"></div>
      <div class="skeleton-box" style="height: 32px; width: 90%;"></div>
      <div class="skeleton-box" style="height: 10px; width: 100%; margin-top: auto;"></div>
      <div class="skeleton-box" style="height: 38px; width: 100%;"></div>
    </div>
  `).join('');

  const tempSkeleton = document.createElement('div');
  tempSkeleton.id = 'tempSkeletonGroup';
  tempSkeleton.style.display = 'contents';
  tempSkeleton.innerHTML = skeletonHtml;
  grid.appendChild(tempSkeleton);

  setTimeout(() => {
    const skel = document.getElementById('tempSkeletonGroup');
    if (skel) skel.remove();

    exploreVisibleLimit += 4;
    renderExploreKatorasPage();

    if (btn) btn.disabled = false;
  }, 400);
};

function initExploreControls() {
  const searchInput = document.getElementById('exploreSearchInput') || document.querySelector('.explore-search-input') || document.querySelector('.search-bar');
  const clearBtn = document.getElementById('searchClearBtn');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      exploreSearchQuery = e.target.value;
      if (clearBtn) {
        clearBtn.style.display = exploreSearchQuery.trim().length > 0 ? 'flex' : 'none';
      }
      renderExploreKatorasPage();
    });
  }

  const filterButtons = document.querySelectorAll('.explore-filter-chip, .filters .filter-btn');
  const catMap = {
    '🔥 Trending': { cat: 'all', sort: 'trending' },
    '🆕 New': { cat: 'all', sort: 'newest' },
    '💰 Most Funded': { cat: 'all', sort: 'funded' },
    '😂 Funniest': { cat: 'meme', sort: 'trending' },
    '🎯 Almost Complete': { cat: 'almost-complete', sort: 'funded' },
    '🥣 Recently Helped': { cat: 'recently-helped', sort: 'trending' }
  };

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const text = btn.textContent.trim();
      if (catMap[text]) {
        exploreActiveCategory = catMap[text].cat;
        exploreSortOrder = catMap[text].sort;
      } else {
        exploreActiveCategory = 'all';
        exploreSortOrder = 'trending';
      }
      exploreVisibleLimit = 8;
      renderExploreKatorasPage();
    });
  });
}

// C. KATORA-DETAIL.HTML
function renderKatoraDetailPage() {
  if (!window.location.pathname.includes('katora-detail.html') || !window.dataStore) return;

  const urlParams = new URLSearchParams(window.location.search);
  const kId = urlParams.get('id') || 'katora-chai-fund';
  const katora = window.dataStore.getKatoraById(kId);

  if (!katora) return;
  currentModalKatoraId = katora.id;

  // Title, Creator, Story
  const nameEl = document.querySelector('.katora-profile h1');
  const reasonEl = document.querySelector('.reason-large');
  const avatarEl = document.querySelector('.avatar-inner');
  const amountEl = document.querySelector('.katora-amount');
  const fillEl = document.querySelector('.progress-fill');
  const donorCountEl = document.querySelector('.donor-count');

  if (nameEl) nameEl.textContent = katora.creator;
  if (reasonEl) reasonEl.textContent = `"${katora.story || katora.tagline}"`;
  if (avatarEl) {
    if (katora.image) {
      avatarEl.innerHTML = `<img src="${katora.image}" alt="${katora.creator}" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">`;
    } else {
      avatarEl.textContent = katora.avatar || '🥣';
    }
  }

  const pct = Math.min(100, Math.round((katora.currentAmount / katora.targetAmount) * 100));
  if (amountEl) {
    amountEl.innerHTML = `<span class="amount" style="color: var(--green-light); font-weight: 800;">₹${katora.currentAmount.toLocaleString('en-IN')}</span> / <span class="goal" style="color: var(--text-muted);">₹${katora.targetAmount.toLocaleString('en-IN')}</span>`;
  }
  if (fillEl) fillEl.style.width = `${pct}%`;
  if (donorCountEl) {
    donorCountEl.innerHTML = `👥 ${katora.donations ? katora.donations.length : 0} Generous Donors &bull; <strong>UPI:</strong> <span style="font-family: var(--font-mono); color: var(--primary-light);">${katora.upiId}</span>`;
  }

  // Update Detail Beggar QR & UPI
  const detailQrImg = document.getElementById('detail-beggar-qr-img');
  const detailUpiId = document.getElementById('detail-beggar-upi-id');
  if (detailUpiId) detailUpiId.textContent = katora.upiId;
  if (detailQrImg) {
    if (katora.customQr) {
      detailQrImg.src = katora.customQr;
    } else {
      const upiUri = `upi://pay?pa=${encodeURIComponent(katora.upiId)}&pn=${encodeURIComponent(katora.creator)}&am=51&cu=INR`;
      detailQrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&margin=2&data=${encodeURIComponent(upiUri)}`;
    }
  }

  // Update Recent Donations Feed
  const feedBox = document.querySelector('.feed-scroll-box');
  if (feedBox) {
    if (katora.donations && katora.donations.length > 0) {
      feedBox.innerHTML = katora.donations.map(d => `
        <div class="feed-item-card" style="background:var(--bg-surface); padding:0.75rem 1rem; border-radius:var(--radius-sm); margin-bottom:0.5rem; display:flex; justify-content:space-between; align-items:center; border:1px solid var(--border-subtle);">
          <div style="display:flex; flex-direction:column;">
            <span style="font-weight: 700; color: var(--text-primary); font-size:0.9rem;">${d.donorName}: "${d.message || 'Punya!'}"</span>
            <span style="font-size: 0.75rem; color: var(--text-muted); font-family: var(--font-mono);">${new Date(d.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <span class="feed-amount-badge" style="background:rgba(0,184,148,0.15); color:var(--green-light); font-weight:800; font-family:var(--font-mono); padding:0.2rem 0.5rem; border-radius:var(--radius-pill);">+₹${d.amount}</span>
        </div>
      `).join('');
    } else {
      feedBox.innerHTML = `<div style="text-align:center; padding:1.5rem; color:var(--text-muted);">Be the first generous daanveer to drop coins in this katora! 🪙</div>`;
    }
  }

  // Bind Main Donate Button
  const mainDonateBtn = document.querySelector('.donation-options .btn-paisa-green');
  if (mainDonateBtn) {
    mainDonateBtn.onclick = () => openDonationModal(katora.creator, katora.id, 51);
  }

  // Bind amount pills on detail page
  document.querySelectorAll('.donation-options .amount-pill-btn').forEach(btn => {
    btn.onclick = () => {
      const amt = parseInt(btn.textContent.replace('₹', '')) || 51;
      openDonationModal(katora.creator, katora.id, amt);
    };
  });
}

// D. CREATE-KATORA.HTML (Handled by section 18 below)

// E. LEADERBOARD.HTML (Handled by section 17 below)

// F. PROFILE.HTML
function renderProfilePage() {
  if (!window.location.pathname.includes('profile.html') || !window.dataStore) return;

  const user = window.dataStore.getUserProfile();
  const katoras = window.dataStore.getKatoras();

  const userKatoras = katoras.filter(k => k.creator.toLowerCase().includes(user.name.toLowerCase()) || k.creator.toLowerCase() === 'aapka naam');

  // Stats Counters
  const balanceEl = document.getElementById('profile-balance');
  if (balanceEl) balanceEl.textContent = `₹${(user.totalReceived || 0).toLocaleString('en-IN')}`;

  const withdrawBtn = document.getElementById('withdraw-funds-btn');
  if (withdrawBtn) {
    withdrawBtn.onclick = () => window.withdrawFunds(user.totalReceived || 0);
  }

  // User Katoras Grid
  const grid = document.querySelector('.profile-katoras-grid') || document.querySelector('.katora-grid');
  if (grid && window.location.pathname.includes('profile.html')) {
    if (userKatoras.length > 0) {
      grid.innerHTML = userKatoras.map(k => createGareebCardHTML(k)).join('');
    } else {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1.5rem; background: var(--bg-surface); border-radius: var(--radius-lg); border: 1.5px dashed var(--border-glow);">
          <div style="font-size: 3rem; margin-bottom: 0.5rem;">🥣</div>
          <h4 style="margin-bottom: 0.5rem; font-size: 1.2rem;">Aapne abhi tak koi katora nahi banaya hai</h4>
          <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1.25rem;">Apna katora banayein aur seedha UPI par chanda paayein!</p>
          <a href="create-katora.html" class="btn btn-primary-gradient"><span>🥣</span> Apna Katora Banao</a>
        </div>
      `;
    }
  }
}

window.withdrawFunds = function(amount = 391) {
  if (amount <= 0) {
    showToast('Katora khali hai! Pehle donation collect karo 😂', 'error');
    return;
  }
  playCoinChime();
  launchConfetti(0.5, 0.5, 50);
  showToast(`💸 ₹${amount.toLocaleString('en-IN')} successfully transferred to linked UPI account! Ref: UPI-${Date.now().toString(36).toUpperCase()}`);
};

// G. ACHIEVEMENTS.HTML
function renderAchievementsPage() {
  if (!window.location.pathname.includes('achievements.html') || !window.dataStore) return;

  const user = window.dataStore.getUserProfile();
  const unlocked = user.unlockedAchievements || [];

  document.querySelectorAll('.badge-item-card, .badge-card').forEach(card => {
    const badgeId = card.dataset.badge;
    if (badgeId && unlocked.includes(badgeId)) {
      card.classList.add('unlocked');
      const statusTag = card.querySelector('.badge');
      if (statusTag) statusTag.textContent = '✅ Unlocked';
    }
  });
}

window.filterBadges = function(category, btn) {
  document.querySelectorAll('.filter-pill-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');

  const cards = document.querySelectorAll('.badge-item-card');
  cards.forEach(card => {
    const cat = card.dataset.category || '';
    if (category === 'all' || cat.includes(category)) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
};

window.openBadgeDetail = function(icon, title, desc, unlockedAt, rarity, isUnlocked) {
  playCoinChime();
  if (isUnlocked) launchConfetti(0.5, 0.4, 40);
  showToast(`🏆 ${title}: ${desc}`);
};

// H. ADMIN.HTML
function renderAdminPage() {
  if (!window.location.pathname.includes('admin.html') || !window.dataStore) return;

  const katoras = window.dataStore.getKatoras();
  const tbody = document.querySelector('.admin-katoras-table tbody') || document.querySelector('tbody');

  if (tbody) {
    tbody.innerHTML = katoras.map(k => `
      <tr style="border-bottom: 1px solid var(--border-subtle);">
        <td style="padding: 1rem; font-weight: 700;">${k.creator}</td>
        <td style="padding: 1rem;">${k.title}</td>
        <td style="padding: 1rem; font-family: var(--font-mono); color: var(--green-light);">₹${k.currentAmount} / ₹${k.targetAmount}</td>
        <td style="padding: 1rem;">
          <button class="btn btn-glass" style="padding: 0.3rem 0.6rem; font-size: 0.75rem;" onclick="toggleFeatureKatora('${k.id}')">
            ${k.featured ? '⭐ Featured' : '☆ Feature'}
          </button>
          <button class="btn btn-glass" style="padding: 0.3rem 0.6rem; font-size: 0.75rem; color: var(--coral);" onclick="deleteKatoraAdmin('${k.id}')">
            🗑️ Delete
          </button>
        </td>
      </tr>
    `).join('');
  }
}

window.toggleFeatureKatora = function(id) {
  window.dataStore?.toggleFeatured(id);
  renderAdminPage();
  showToast('Katora featured status updated!');
};

window.deleteKatoraAdmin = function(id) {
  if (confirm('Kya aap sach me is katora ko delete karna chahte hain?')) {
    window.dataStore?.deleteKatora(id);
    renderAdminPage();
    showToast('Katora deleted successfully!');
  }
};

// I. CONTACT.HTML
window.setTopic = function(btn, topic) {
  document.querySelectorAll('.preset-amount-pill').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  const hiddenInput = document.getElementById('cTopic');
  if (hiddenInput) hiddenInput.value = topic;
};

window.handleContactSubmit = function(e) {
  if (e) e.preventDefault();
  playCoinChime();
  launchConfetti(0.5, 0.4, 50);
  showToast('📬 Shukriya! Aapka sandesh Tapri HQ tak pahunch gaya hai! Chai ready rakhiye!');
  const form = document.getElementById('contactForm');
  if (form) form.reset();
};

// J. FAQ.HTML ACCORDION
function initFAQAccordion() {
  document.querySelectorAll('.faq-item, .faq-card').forEach(item => {
    item.addEventListener('click', () => {
      item.classList.toggle('open');
      const ans = item.querySelector('.faq-answer');
      if (ans) {
        ans.style.display = ans.style.display === 'block' ? 'none' : 'block';
      }
    });
  });
}

// 10. 3D Card Tilt Interaction (Desktop)
function init3DCardTilt() {
  if (window.innerWidth <= 768) return;

  const cards = document.querySelectorAll('.katora-card, .step-card, .podium-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.01)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)';
    });
  });
}

// 11. Custom Cursor (Desktop)
function initCustomCursor() {
  if (window.innerWidth <= 768) return;

  const cursor = document.createElement('div');
  cursor.className = 'custom-cursor-dot';
  document.body.appendChild(cursor);

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let cursorX = mouseX;
  let cursorY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function loopCursor() {
    cursorX += (mouseX - cursorX) * 0.22;
    cursorY += (mouseY - cursorY) * 0.22;
    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;
    requestAnimationFrame(loopCursor);
  }
  loopCursor();

  document.querySelectorAll('a, button, .katora-card').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
  });
}

// 11B. Native Mobile Bottom App Navigation
function initMobileBottomNav() {
  if (document.getElementById('mobileBottomNavBar')) return;
  const path = window.location.pathname.toLowerCase();
  const isHome = path.endsWith('index.html') || path.endsWith('/') || path === '';
  const isExplore = path.includes('katoras.html');
  const isCreate = path.includes('create-katora.html');
  const isLeaderboard = path.includes('leaderboard.html');
  const isProfile = path.includes('profile.html');

  const nav = document.createElement('nav');
  nav.id = 'mobileBottomNavBar';
  nav.className = 'mobile-bottom-nav';
  nav.setAttribute('aria-label', 'Mobile Bottom Navigation');
  nav.innerHTML = `
    <a href="index.html" class="mobile-nav-item ${isHome ? 'active' : ''}">
      <span class="mobile-nav-icon">🏠</span>
      <span class="mobile-nav-label">Home</span>
    </a>
    <a href="katoras.html" class="mobile-nav-item ${isExplore ? 'active' : ''}">
      <span class="mobile-nav-icon">🔍</span>
      <span class="mobile-nav-label">Katore</span>
    </a>
    <a href="create-katora.html" class="mobile-nav-item mobile-nav-center ${isCreate ? 'active' : ''}">
      <div class="mobile-nav-bowl-btn">
        <span>🥣</span>
      </div>
      <span class="mobile-nav-label" style="font-weight: 800; color: #FFD93D;">Banao</span>
    </a>
    <a href="leaderboard.html" class="mobile-nav-item ${isLeaderboard ? 'active' : ''}">
      <span class="mobile-nav-icon">👑</span>
      <span class="mobile-nav-label">Top Daan</span>
    </a>
    <a href="profile.html" class="mobile-nav-item ${isProfile ? 'active' : ''}">
      <span class="mobile-nav-icon">👤</span>
      <span class="mobile-nav-label">Profile</span>
    </a>
  `;
  document.body.appendChild(nav);
}

// 11C. Universal Mobile Navigation Drawer Engine
function initMobileNavDrawer() {
  // 1. Inject Hamburger Button into Navbar if not present
  const navWrap = document.querySelector('.navbar .nav-wrap') || document.querySelector('.navbar .container') || document.querySelector('.navbar');
  if (navWrap && !document.getElementById('mobileNavToggleBtn')) {
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'mobileNavToggleBtn';
    toggleBtn.className = 'mobile-nav-toggle-btn';
    toggleBtn.setAttribute('aria-label', 'Open Mobile Menu');
    toggleBtn.innerHTML = `<span>☰</span>`;
    
    const rightActions = navWrap.querySelector('.nav-right-actions');
    if (rightActions) {
      rightActions.insertBefore(toggleBtn, rightActions.firstChild);
    } else {
      navWrap.appendChild(toggleBtn);
    }

    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openMobileNavDrawer();
    });
  }

  // 2. Inject Drawer Overlay & Panel if not present
  if (!document.getElementById('mobileNavDrawerOverlay')) {
    const path = window.location.pathname.toLowerCase();
    const isHome = path.endsWith('index.html') || path.endsWith('/') || path === '';
    const isKatoras = path.includes('katoras.html');
    const isCreate = path.includes('create-katora.html');
    const isDemo = path.includes('donation-animation.html');
    const isLeaderboard = path.includes('leaderboard.html');
    const isProfile = path.includes('profile.html');
    const isAchievements = path.includes('achievements.html');
    const isAbout = path.includes('about.html');
    const isFaq = path.includes('faq.html');
    const isContact = path.includes('contact.html');

    const drawerOverlay = document.createElement('div');
    drawerOverlay.id = 'mobileNavDrawerOverlay';
    drawerOverlay.className = 'mobile-nav-drawer-overlay';
    drawerOverlay.innerHTML = `
      <div class="mobile-nav-drawer-panel" id="mobileNavDrawerPanel">
        <!-- Header -->
        <div class="drawer-header">
          <a href="index.html" class="brand-logo" style="text-decoration:none; display:flex; align-items:center; gap:0.5rem;">
            <div class="logo-bowl-glow" style="width:32px; height:32px; font-size:1.1rem; display:flex; align-items:center; justify-content:center;">🥣</div>
            <span style="font-weight:800; font-size:1.15rem; color:var(--text-primary);">Digital <span class="gradient-text">Katora</span></span>
          </a>
          <button class="drawer-close-btn" id="drawerCloseBtn" aria-label="Close Menu">✕</button>
        </div>

        <!-- Quick CTA -->
        <div class="drawer-cta-wrap">
          <a href="create-katora.html" class="btn btn-primary-gradient btn-glow-pulse" style="width:100%; justify-content:center; padding:0.75rem 1rem; font-size:0.95rem;">
            <span>🥣</span> Apna Katora Banao
          </a>
        </div>

        <!-- Navigation Links -->
        <div class="drawer-links-list">
          <a href="index.html" class="drawer-link-item ${isHome ? 'active' : ''}">
            <span class="drawer-link-icon">🏠</span>
            <span>Home</span>
          </a>
          <a href="katoras.html" class="drawer-link-item ${isKatoras ? 'active' : ''}">
            <span class="drawer-link-icon">🔍</span>
            <span>Explore Katoras</span>
          </a>
          <a href="create-katora.html" class="drawer-link-item ${isCreate ? 'active' : ''}">
            <span class="drawer-link-icon">🥣</span>
            <span>Create Katora</span>
          </a>
          <a href="donation-animation.html" class="drawer-link-item ${isDemo ? 'active' : ''}">
            <span class="drawer-link-icon">🪙</span>
            <span>Coin Cinema Demo</span>
          </a>
          <a href="leaderboard.html" class="drawer-link-item ${isLeaderboard ? 'active' : ''}">
            <span class="drawer-link-icon">👑</span>
            <span>Leaderboard</span>
          </a>
          <a href="profile.html" class="drawer-link-item ${isProfile ? 'active' : ''}">
            <span class="drawer-link-icon">👤</span>
            <span>My Profile & Wallet</span>
          </a>
          <a href="achievements.html" class="drawer-link-item ${isAchievements ? 'active' : ''}">
            <span class="drawer-link-icon">🏺</span>
            <span>Achievements</span>
          </a>
          <a href="about.html" class="drawer-link-item ${isAbout ? 'active' : ''}">
            <span class="drawer-link-icon">📖</span>
            <span>About Us</span>
          </a>
          <a href="faq.html" class="drawer-link-item ${isFaq ? 'active' : ''}">
            <span class="drawer-link-icon">❓</span>
            <span>FAQ & Rules</span>
          </a>
          <a href="contact.html" class="drawer-link-item ${isContact ? 'active' : ''}">
            <span class="drawer-link-icon">📬</span>
            <span>Contact Us</span>
          </a>
        </div>

        <!-- Footer -->
        <div class="drawer-footer">
          <button class="btn btn-glass btn-sm" onclick="toggleThemeGlobal()" style="width:100%; justify-content:center; gap:0.5rem;">
            <span>🌓</span> Theme Toggle
          </button>
          <div style="text-align:center; font-size:0.75rem; color:var(--text-muted);">
            Digital Katora &bull; India's #1 Meme Tip Jar
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(drawerOverlay);

    // Event handlers
    const closeBtn = document.getElementById('drawerCloseBtn');
    if (closeBtn) closeBtn.addEventListener('click', closeMobileNavDrawer);

    drawerOverlay.addEventListener('click', (e) => {
      if (e.target === drawerOverlay) closeMobileNavDrawer();
    });

    drawerOverlay.querySelectorAll('.drawer-link-item').forEach(link => {
      link.addEventListener('click', closeMobileNavDrawer);
    });
  }
}

function openMobileNavDrawer() {
  const drawer = document.getElementById('mobileNavDrawerOverlay');
  if (drawer) {
    drawer.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeMobileNavDrawer() {
  const drawer = document.getElementById('mobileNavDrawerOverlay');
  if (drawer) {
    drawer.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function toggleThemeGlobal() {
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('dk_theme', next);
  showToast(`🎨 Theme: ${next.toUpperCase()}`);
}

// ═════════════════════════════════════════════════════════════════════
// 11D. UNIVERSAL "SHARE MY KATORA" MODAL ENGINE
// ═════════════════════════════════════════════════════════════════════
window.activeShareData = null;

function initShareKatoraSystem() {
  if (document.getElementById('katoraShareModalOverlay')) return;

  const overlay = document.createElement('div');
  overlay.id = 'katoraShareModalOverlay';
  overlay.className = 'katora-share-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-labelledby', 'katoraShareModalTitle');
  overlay.innerHTML = `
    <div class="katora-share-modal" id="katoraShareModalPanel">
      <!-- Header -->
      <div class="share-modal-header">
        <div style="display:flex; align-items:center; gap:0.5rem;">
          <span style="font-size:1.4rem;">🥣</span>
          <div>
            <h3 id="katoraShareModalTitle" style="font-size:1.15rem; font-weight:800; margin:0; color:var(--text-primary);">Apna Katora Doston Tak Pahunchao 😂</h3>
            <span style="font-size:0.75rem; color:var(--gold-light); font-family:var(--font-mono); font-weight:700;">Jitne dost, utni khushi. 🥣❤️</span>
          </div>
        </div>
        <button class="drawer-close-btn" onclick="closeShareKatoraModal()" aria-label="Close Share Modal">✕</button>
      </div>

      <!-- Katora Live Preview Card -->
      <div class="share-preview-card" id="shareModalPreviewCard">
        <div class="share-preview-hero">
          <div class="share-preview-avatar">
            <img id="shareModalAvatar" src="mascot-beggar-3d.jpg" alt="Mascot">
          </div>
          <div style="flex:1; min-width:0;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <h4 id="shareModalCreator" style="font-size:1rem; font-weight:800; margin:0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:180px;">राहुल</h4>
              <span id="shareModalCategory" style="font-size:0.7rem; font-weight:700; color:var(--primary-light); background:rgba(108,92,231,0.15); padding:0.15rem 0.5rem; border-radius:var(--radius-pill);">🏷️ Chai</span>
            </div>
            <p id="shareModalHeadline" style="font-size:0.82rem; color:var(--text-secondary); margin:0.25rem 0 0; font-style:italic; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">"Sharma ji ke tapri par udhaar..."</p>
          </div>
        </div>

        <!-- Progress Mini Bar -->
        <div style="margin-top:0.25rem;">
          <div style="display:flex; justify-content:space-between; font-size:0.75rem; font-family:var(--font-mono); margin-bottom:0.25rem;">
            <span id="shareModalRaised" style="color:var(--green-light); font-weight:700;">₹391</span>
            <span id="shareModalGoal" style="color:var(--text-muted);">/ ₹500 (78%)</span>
          </div>
          <div style="height:6px; background:rgba(255,255,255,0.08); border-radius:4px; overflow:hidden;">
            <div id="shareModalFill" style="width:78%; height:100%; background:var(--gold-gradient); border-radius:4px;"></div>
          </div>
        </div>
      </div>

      <!-- Pre-formatted Viral Meme Copy -->
      <div class="share-copy-box">
        <div style="font-size:0.72rem; color:var(--text-muted); font-weight:700; font-family:var(--font-mono); margin-bottom:0.25rem; text-transform:uppercase;">💬 Viral Meme Message:</div>
        <div id="shareModalCopyText" style="font-size:0.85rem; color:var(--text-primary); line-height:1.45;">🥺 Bhai/Behen thoda daan kardo! Mere katore mein direct UPI se chanda daalo aur punya kamao!</div>
      </div>

      <!-- Primary Action Buttons (Grid 2x2) -->
      <div class="share-actions-grid">
        <button type="button" class="share-btn-platform share-btn-wa" onclick="executeKatoraShare('whatsapp')">
          <span style="font-size:1.2rem;">💬</span>
          <span>WhatsApp</span>
        </button>
        <button type="button" class="share-btn-platform share-btn-copy" id="shareModalCopyBtn" onclick="executeKatoraShare('copy')">
          <span style="font-size:1.1rem;">📋</span>
          <span id="shareModalCopyBtnLabel">Copy Link</span>
        </button>
        <button type="button" class="share-btn-platform share-btn-tw" onclick="executeKatoraShare('twitter')">
          <span style="font-size:1.1rem;">🐦</span>
          <span>Twitter / X</span>
        </button>
        <button type="button" class="share-btn-platform share-btn-native" onclick="executeKatoraShare('native')">
          <span style="font-size:1.1rem;">🚀</span>
          <span>More Apps</span>
        </button>
      </div>

      <!-- Direct URL Bar -->
      <div class="share-direct-url-box">
        <input type="text" id="shareModalUrlInput" readonly value="" onclick="this.select()">
        <button type="button" class="btn btn-glass btn-sm" onclick="executeKatoraShare('copy')" style="padding:0.35rem 0.75rem; font-size:0.78rem;">
          Copy
        </button>
      </div>

      <!-- QR Code Quick Toggle View -->
      <div style="margin-top:1rem; text-align:center;">
        <button type="button" class="btn btn-glass btn-sm" onclick="toggleShareQrPreview()" style="font-size:0.78rem; border-color:rgba(255,184,0,0.3); color:var(--gold-light) !important;">
          <span>📱</span> In-Person QR Code (Live Scan)
        </button>
        <div id="shareModalQrContainer" style="display:none; margin-top:0.75rem; padding:0.75rem; background:#FFF; border-radius:12px; width:160px; height:160px; margin-left:auto; margin-right:auto; box-shadow:0 8px 25px rgba(0,0,0,0.4);">
          <img id="shareModalQrImg" src="" alt="UPI QR Code" style="width:100%; height:100%; object-fit:contain;">
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeShareKatoraModal();
  });
}

window.openShareKatoraModal = function(katoraId, kObj) {
  initShareKatoraSystem();

  let k = kObj;
  if (!k && window.dataStore) {
    if (katoraId) {
      k = window.dataStore.getKatoraById(katoraId);
    }
    if (!k && window.currentDetailKatora) {
      k = window.currentDetailKatora;
    }
    if (!k) {
      const all = window.dataStore.getKatoras();
      k = all && all.length > 0 ? all[0] : null;
    }
  }

  if (!k) {
    showToast('कटोरा डेटा लोड नहीं हो सका!', 'error');
    return;
  }

  // Canonical shareable URL
  const kId = k.id || 'katora-chai-fund';
  const baseUrl = window.location.origin + window.location.pathname.replace(/[^/]*$/, '');
  const shareUrl = `${baseUrl}katora-detail.html?id=${encodeURIComponent(kId)}`;

  const raised = k.currentAmount || 0;
  const target = k.targetAmount || 1000;
  const pct = Math.min(100, Math.round((raised / target) * 100));

  const memeText = `Bhai 😂 mera Digital Katora dekh!

🥣 ${k.title || k.tagline || 'Digital Katora'}

"${k.tagline || k.story || 'Thoda daan yahan bhi gira do!'}"

Agar mann kare to help kar dena ❤️

👉 ${shareUrl}`;

  window.activeShareData = {
    katora: k,
    shareUrl: shareUrl,
    memeText: memeText
  };

  // Populate Modal Fields
  const avatar = document.getElementById('shareModalAvatar');
  const creator = document.getElementById('shareModalCreator');
  const cat = document.getElementById('shareModalCategory');
  const headline = document.getElementById('shareModalHeadline');
  const raisedEl = document.getElementById('shareModalRaised');
  const goalEl = document.getElementById('shareModalGoal');
  const fillEl = document.getElementById('shareModalFill');
  const copyText = document.getElementById('shareModalCopyText');
  const urlInput = document.getElementById('shareModalUrlInput');
  const qrImg = document.getElementById('shareModalQrImg');

  if (avatar) avatar.src = k.image || 'mascot-beggar-3d.jpg';
  if (creator) creator.textContent = k.creator || 'Gareeb Dost';
  if (cat) cat.textContent = `🏷️ ${k.categoryName || 'Desi'}`;
  if (headline) headline.textContent = `"${k.tagline || k.title}"`;
  if (raisedEl) raisedEl.textContent = `₹${raised.toLocaleString('en-IN')}`;
  if (goalEl) goalEl.textContent = `/ ₹${target.toLocaleString('en-IN')} (${pct}%)`;
  if (fillEl) fillEl.style.width = `${pct}%`;
  if (copyText) copyText.textContent = memeText;
  if (urlInput) urlInput.value = shareUrl;

  if (qrImg) {
    if (k.customQr) {
      qrImg.src = k.customQr;
    } else {
      const upiUri = `upi://pay?pa=${encodeURIComponent(k.upiId || 'katora@upi')}&pn=${encodeURIComponent(k.creator)}&am=51&cu=INR&tn=${encodeURIComponent('Digital Katora Donation')}`;
      qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&margin=2&data=${encodeURIComponent(upiUri)}`;
    }
  }

  // Show Modal
  const overlay = document.getElementById('katoraShareModalOverlay');
  if (overlay) {
    overlay.classList.add('active');
    if (navigator.vibrate) navigator.vibrate(25);
  }
};

window.closeShareKatoraModal = function() {
  const overlay = document.getElementById('katoraShareModalOverlay');
  if (overlay) overlay.classList.remove('active');
  const qrBox = document.getElementById('shareModalQrContainer');
  if (qrBox) qrBox.style.display = 'none';
};

window.toggleShareQrPreview = function() {
  const qrBox = document.getElementById('shareModalQrContainer');
  if (qrBox) {
    qrBox.style.display = qrBox.style.display === 'none' ? 'block' : 'none';
  }
};

window.executeKatoraShare = function(platform) {
  if (!window.activeShareData) {
    if (window.currentDetailKatora) {
      window.openShareKatoraModal(window.currentDetailKatora.id);
    } else {
      window.openShareKatoraModal();
    }
    if (!window.activeShareData) return;
  }

  const { shareUrl, memeText, katora } = window.activeShareData;

  if (platform === 'whatsapp') {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(memeText)}`, '_blank');
  } else if (platform === 'twitter') {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(memeText)}`, '_blank');
  } else if (platform === 'copy') {
    copyTextToClipboard(shareUrl, () => {
      playCoinChime();
      showToast('📋 कटोरा लिंक कॉपी हो गया! WhatsApp पर दोस्तों को भेजें!');
      const btn = document.getElementById('shareModalCopyBtn');
      const label = document.getElementById('shareModalCopyBtnLabel');
      if (btn && label) {
        btn.classList.add('copied');
        label.textContent = '✓ Copied!';
        setTimeout(() => {
          btn.classList.remove('copied');
          label.textContent = 'Copy Link';
        }, 2500);
      }
    });
  } else if (platform === 'native') {
    if (navigator.share) {
      navigator.share({
        title: `Digital Katora — ${katora.creator}`,
        text: memeText,
        url: shareUrl
      }).catch((err) => {
        if (err.name !== 'AbortError') {
          copyTextToClipboard(shareUrl);
        }
      });
    } else {
      copyTextToClipboard(shareUrl, () => {
        playCoinChime();
        showToast('📋 Link copied to clipboard! Share anywhere!');
      });
    }
  }
};

function copyTextToClipboard(text, onSuccess) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      if (onSuccess) onSuccess();
    }).catch(() => {
      fallbackCopyText(text, onSuccess);
    });
  } else {
    fallbackCopyText(text, onSuccess);
  }
}

function fallbackCopyText(text, onSuccess) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.top = '0';
  textArea.style.left = '0';
  textArea.style.opacity = '0';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    if (onSuccess) onSuccess();
  } catch (e) {
    prompt('Copy this link:', text);
  }
  document.body.removeChild(textArea);
}

// Global ESC hotkey for all modals
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeShareKatoraModal();
    closeMobileNavDrawer();
    closeDonationModal();
  }
});

// 12. Master Initialization
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initCustomCursor();
  initMobileBottomNav();
  initMobileNavDrawer();
  initShareKatoraSystem();
  init3DCardTilt();
  initFAQAccordion();
  startLiveActivityFeed();

  // Sticky Navbar Scroll Elevation
  const nav = document.getElementById('siteNavbar');
  if (nav) {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        nav.classList.add('scrolled');
        nav.style.background = 'var(--glass-bg)';
        nav.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.35)';
      } else {
        nav.classList.remove('scrolled');
        nav.style.boxShadow = 'none';
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // Page specific render triggers
  renderIndexPage();
  renderExploreKatorasPage();
  initExploreControls();
  renderKatoraDetailPage();
  renderLeaderboardPage();
  renderProfilePage();
  renderAchievementsPage();
  renderAdminPage();
  initCreateKatoraPage();

  // Bind amount pills in modal Step 1
  document.querySelectorAll('.modal-overlay .amount-pill-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.modal-overlay .amount-pill-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const amt = parseInt(btn.dataset.amount || btn.textContent.replace('₹', '')) || 51;
      selectedAmount = amt;
      const customField = document.getElementById('modal-custom-amount');
      if (customField) customField.value = amt;
    });
  });

  // Modal custom input listener
  const customField = document.getElementById('modal-custom-amount');
  if (customField) {
    customField.addEventListener('input', (e) => {
      selectedAmount = parseInt(e.target.value) || 0;
      document.querySelectorAll('.modal-overlay .amount-pill-btn').forEach(b => b.classList.remove('active'));
    });
  }

  // Global listeners for data updates
  window.addEventListener('dk_data_updated', () => {
    renderIndexPage();
    renderExploreKatorasPage();
    renderLeaderboardPage();
    renderAdminPage();
  });
});

function startLiveActivityFeed() {
  const feed = document.getElementById('liveActivityFeedList');
  if (!feed) return;

  const mockEvents = [
    { icon: '👑', text: 'विक्रमादित्य सिंघानिया ने ₹1,100 का महा-दान भेजा 👑', badge: '+₹1,100' },
    { icon: '☕', text: 'रोहन मल्होत्रा ने कटोरे में ₹101 डाले ☕', badge: '+₹101' },
    { icon: '🌟', text: 'प्रिया सुंदरम बनीं #2 महा-दानी 🌟', badge: 'RANK #2' },
    { icon: '💫', text: 'नेहा कुलकर्णी ने ₹251 का तुरंत शगुन भेजा ✨', badge: '+₹251' },
    { icon: '🚀', text: 'आदित्य वर्धन ने ₹501 का सहयोग दिया 🚀', badge: '+₹501' },
    { icon: '🌸', text: 'पूजा अग्रवाल ने ₹201 का पुण्य दान दिया 🌸', badge: '+₹201' },
    { icon: '🎯', text: 'कुणाल कश्यप ने कटोरा सपोर्टर बैज जीता 🎯', badge: 'BADGE' },
    { icon: '🤝', text: 'देवेंद्र पटेल ने ₹51 का दान अर्पित किया 🤝', badge: '+₹51' }
  ];

  let eventIdx = 0;
  setInterval(() => {
    eventIdx = (eventIdx + 1) % mockEvents.length;
    const evt = mockEvents[eventIdx];
    const item = document.createElement('div');
    item.className = 'feed-item-card';
    item.style.animation = 'slideFeedElastic 0.5s var(--ease-squash)';
    item.innerHTML = `
      <div class="feed-item-left">
        <span class="feed-coin-icon">${evt.icon}</span>
        <span style="font-size: 0.92rem; font-weight: 600;">${evt.text}</span>
      </div>
      <span class="feed-amount-badge">${evt.badge}</span>
    `;
    feed.prepend(item);
    if (feed.children.length > 4) {
      feed.lastElementChild.remove();
    }
  }, 4000);
}


// ═════════════════════════════════════════════════════════════════════
// 16. INDIVIDUAL KATORA PROFILE & INTERACTIVE DONATION ENGINE
// ═════════════════════════════════════════════════════════════════════

let currentDetailKatora = null;
let currentDetailSelectedAmount = 51;

function renderKatoraDetailPage() {
  const profileHero = document.getElementById('katoraProfileHero');
  if (!profileHero) return; // Not on katora-detail.html

  const params = new URLSearchParams(window.location.search);
  const katoraId = params.get('id');

  if (!window.dataStore) return;
  const katora = katoraId ? window.dataStore.getKatoraById(katoraId) : window.dataStore.getKatoras()[0];
  
  if (!katora) {
    if (profileHero) {
      profileHero.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1.5rem; background: var(--bg-surface); border-radius: var(--radius-lg); border: 1.5px dashed var(--border-glow);">
          <div style="font-size: 4rem; margin-bottom: 1rem; animation: floatMascot 3s infinite ease-in-out;">🥣 💨</div>
          <h2 style="font-size: 1.8rem; margin-bottom: 0.75rem; color: var(--text-primary);">Yeh Katora Abhi Maujood Nahi Hai!</h2>
          <p style="color: var(--text-secondary); max-width: 480px; margin: 0 auto 2rem; font-size: 1rem; line-height: 1.6;">
            Aap apna naya katora bana sakte hain ya home page par jaa kar doosre broke dosto ki madad kar sakte hain. 😂
          </p>
          <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
            <a href="index.html" class="btn btn-glass btn-lg"><span>🏠</span> Home Par Jayein</a>
            <a href="create-katora.html" class="btn btn-primary-gradient btn-lg btn-glow-pulse"><span>🥣</span> Apna Katora Banao</a>
          </div>
        </div>
      `;
    }
    return;
  }
  currentDetailKatora = katora;
  currentModalKatoraId = katora.id;

  // 1. Update Document Title
  document.title = `🥣 ${katora.creator} Ka Katora — Digital Katora`;

  // 2. Populate Hero Profile
  const mascotCard = document.getElementById('detailMascotCard');
  const mascotImg = document.getElementById('detailMascotImg');
  const emotionBadge = document.getElementById('detailEmotionBadge');
  const categoryTag = document.getElementById('detailCategoryTag');
  const verifiedBadge = document.getElementById('detailVerifiedBadge');
  const urgentBadge = document.getElementById('detailUrgentBadge');
  const creatorName = document.getElementById('detailCreatorName');
  const reasonQuote = document.getElementById('detailReasonQuote');
  const storyContent = document.getElementById('detailStoryContent');
  const raisedAmount = document.getElementById('detailRaisedAmount');
  const goalAmount = document.getElementById('detailGoalAmount');
  const pctBadge = document.getElementById('detailPctBadge');
  const progressBarFill = document.getElementById('detailProgressBarFill');
  const donorCount = document.getElementById('detailDonorCount');
  const upiIdDisplay = document.getElementById('detailUpiIdText');

  const raised = katora.currentAmount || 0;
  const target = katora.targetAmount || 1000;
  const pct = Math.min(100, Math.round((raised / target) * 100));
  const remaining = Math.max(0, target - raised);
  const donors = katora.donations ? katora.donations.length : 0;

  if (mascotImg) {
    mascotImg.src = katora.image || 'mascot-beggar-3d.jpg';
    mascotImg.alt = katora.creator;
  }
  if (categoryTag) categoryTag.innerHTML = `🏷️ ${katora.categoryName || 'Chai & Food'}`;
  if (creatorName) creatorName.textContent = katora.creator;
  if (reasonQuote) reasonQuote.textContent = `"${katora.tagline || katora.title}"`;
  if (storyContent) storyContent.textContent = katora.story || 'Hum bhi gareeb hain, kripya daan karein!';
  if (raisedAmount) raisedAmount.textContent = `₹${raised.toLocaleString('en-IN')}`;
  if (goalAmount) goalAmount.textContent = `/ ₹${target.toLocaleString('en-IN')} लक्ष्य`;
  if (pctBadge) pctBadge.textContent = `${pct}%`;
  if (progressBarFill) progressBarFill.style.width = `${pct}%`;
  if (donorCount) donorCount.textContent = `👥 ${donors} दानी दोस्तों ने भरा`;
  if (upiIdDisplay) upiIdDisplay.textContent = katora.upiId || 'katora@upi';

  if (urgentBadge) {
    urgentBadge.style.display = katora.urgent ? 'inline-flex' : 'none';
  }

  // Initial emotional state
  if (emotionBadge) {
    if (pct >= 100) {
      emotionBadge.innerHTML = '🥳 कटोरा पूरा भर गया! (Super Happy!)';
      emotionBadge.classList.add('happy');
    } else {
      emotionBadge.innerHTML = `🥺 Sad & Broke (₹${remaining.toLocaleString('en-IN')} बाकी)`;
      emotionBadge.classList.remove('happy');
    }
  }

  // 3. Populate Live Centerpiece Stage
  const stageReceiverImg = document.getElementById('stageReceiverImg');
  const stageReceiverName = document.getElementById('stageReceiverName');
  const stageTargetPct = document.getElementById('stageTargetPct');
  const stageRaisedLive = document.getElementById('stageRaisedLive');

  if (stageReceiverImg) stageReceiverImg.src = katora.image || 'mascot-beggar-3d.jpg';
  if (stageReceiverName) stageReceiverName.textContent = `🥺 ${katora.creator.split(' ')[0]}`;
  if (stageTargetPct) stageTargetPct.textContent = `${pct}%`;
  if (stageRaisedLive) stageRaisedLive.textContent = `₹${raised.toLocaleString('en-IN')}`;

  // 4. Render Donor Wall
  renderDonorWall(katora);

  // 5. Render Progress Breakdown Section
  renderProgressSection(katora, pct, remaining);

  // 6. Render Top Donors for This Person
  renderTopDonorsPodium(katora);

  // 7. Render Share Section
  renderShareSection(katora, pct);

  // 8. Render Similar Recommendations
  renderSimilarKatoras(katora);

  // 9. Auto trigger celebration & share sheet if freshly created or share param
  if (params.get('created') === '1' || params.get('share') === '1') {
    setTimeout(() => {
      playCoinChime();
      launchConfetti(0.5, 0.4, 75);
      showToast('🎉 आपका कटोरा लाइव है! अब दोस्तों के साथ शेयर करें!');
      openShareKatoraModal(katora.id);
    }, 450);
  }
}

// Donor Wall Rendering
function renderDonorWall(katora) {
  const wallGrid = document.getElementById('detailDonorWallGrid');
  if (!wallGrid) return;

  const donations = katora.donations || [];
  if (donations.length === 0) {
    wallGrid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: var(--text-muted); font-style: italic;">
        🥣 अभी तक कोई सिक्का नहीं गिरा! पहले महा-दानी आप बनिए!
      </div>
    `;
    return;
  }

  const avatars = ['😎', '💎', '👑', '🚀', '☕', '🔥', '🌟', '💖'];
  wallGrid.innerHTML = donations.map((d, idx) => {
    const avatar = avatars[idx % avatars.length];
    const timeAgo = formatTimeAgo(d.timestamp);
    return `
      <div class="donor-wall-card">
        <div class="donor-wall-left">
          <div class="donor-wall-avatar">${avatar}</div>
          <div>
            <div class="donor-wall-name">${d.donorName || 'Anonymous Daanveer'}</div>
            <div class="donor-wall-msg">"${d.message || 'Punya lo!'}" &bull; <small style="color: var(--text-muted);">${timeAgo}</small></div>
          </div>
        </div>
        <div class="donor-wall-badge">+₹${(d.amount || 0).toLocaleString('en-IN')}</div>
      </div>
    `;
  }).join('');
}

// Progress Breakdown Rendering
function renderProgressSection(katora, pct, remaining) {
  const pctEl = document.getElementById('progressSecPct');
  const barEl = document.getElementById('progressSecBar');
  const raisedEl = document.getElementById('progressSecRaised');
  const goalEl = document.getElementById('progressSecGoal');
  const remainingEl = document.getElementById('progressSecRemaining');
  const goalCelebrationBanner = document.getElementById('goalCelebrationBanner');

  if (pctEl) pctEl.textContent = `${pct}%`;
  if (barEl) barEl.style.width = `${pct}%`;
  if (raisedEl) raisedEl.textContent = `₹${(katora.currentAmount || 0).toLocaleString('en-IN')}`;
  if (goalEl) goalEl.textContent = `₹${(katora.targetAmount || 1000).toLocaleString('en-IN')}`;
  if (remainingEl) remainingEl.textContent = `₹${remaining.toLocaleString('en-IN')}`;

  if (goalCelebrationBanner) {
    goalCelebrationBanner.style.display = pct >= 100 ? 'block' : 'none';
  }
}

// Top Donors Podium (Specific to this katora)
function renderTopDonorsPodium(katora) {
  const podiumGrid = document.getElementById('detailTopDonorsGrid');
  if (!podiumGrid) return;

  const donations = katora.donations || [];
  // Aggregate by donor name
  const donorMap = {};
  donations.forEach(d => {
    const name = d.donorName || 'Anonymous Daanveer';
    donorMap[name] = (donorMap[name] || 0) + (d.amount || 0);
  });

  const sorted = Object.entries(donorMap)
    .map(([name, total]) => ({ name, total }))
    .sort((a, b) => b.total - a.total);

  if (sorted.length === 0) {
    podiumGrid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: var(--text-muted); font-style: italic;">
        👑 कोई टॉप दानी नहीं है अभी। पहला दान देकर #1 स्थान पाएं!
      </div>
    `;
    return;
  }

  const top3 = sorted.slice(0, 3);
  const ranks = [
    { rank: 1, icon: '👑 🥇', badge: 'GOLDEN MAHA-DAANI', class: 'rank-1' },
    { rank: 2, icon: '🥈', badge: 'SILVER BENEFACTOR', class: 'rank-2' },
    { rank: 3, icon: '🥉', badge: 'BRONZE HERO', class: 'rank-3' }
  ];

  podiumGrid.innerHTML = top3.map((d, idx) => {
    const r = ranks[idx] || { rank: idx + 1, icon: '🌟', badge: 'DAANVEER', class: '' };
    return `
      <div class="top-donor-podium-card ${r.class}">
        <div class="top-donor-rank-badge">${r.icon}</div>
        <div class="top-donor-name">${d.name}</div>
        <div class="top-donor-amount">₹${d.total.toLocaleString('en-IN')}</div>
        <span class="top-donor-title-pill">${r.badge}</span>
      </div>
    `;
  }).join('');
}

// Share Section Info
function renderShareSection(katora, pct) {
  const shareTitle = document.getElementById('sharePreviewTitle');
  const shareReason = document.getElementById('sharePreviewReason');
  const shareBar = document.getElementById('sharePreviewBar');

  if (shareTitle) shareTitle.textContent = `🥣 ${katora.creator} Ka Katora`;
  if (shareReason) shareReason.textContent = `"${katora.tagline || katora.title}"`;
  if (shareBar) shareBar.style.width = `${pct}%`;
}

// Similar Katoras Recommendations
function renderSimilarKatoras(currentKatora) {
  const grid = document.getElementById('detailSimilarKatorasGrid');
  if (!grid || !window.dataStore) return;

  const all = window.dataStore.getKatoras();
  const similar = all.filter(k => k.id !== currentKatora.id).slice(0, 3);

  if (similar.length === 0) {
    grid.innerHTML = '';
    return;
  }

  grid.innerHTML = similar.map(k => {
    if (typeof createExploreCardHTML === 'function') {
      return createExploreCardHTML(k);
    }
    const raised = k.currentAmount || 0;
    const target = k.targetAmount || 1000;
    const pct = Math.min(100, Math.round((raised / target) * 100));
    return `
      <article class="katora-card-explore" data-id="${k.id}">
        <div class="katora-media-box">
          <img src="${k.image || 'mascot-beggar-3d.jpg'}" alt="${k.creator}" class="katora-media-img" loading="lazy">
        </div>
        <div class="katora-card-body">
          <h3 class="katora-creator-name">${k.creator}</h3>
          <p class="katora-headline">${k.title}</p>
          <div class="garib-progress-wrap">
            <div class="garib-progress-labels">
              <span class="garib-raised-val">₹${raised}</span>
              <span class="garib-goal-val">${pct}%</span>
            </div>
            <div class="garib-meter-track"><div class="garib-meter-fill" style="width: ${pct}%;"></div></div>
          </div>
          <button class="btn btn-primary-gradient btn-sm" onclick="openDonationModal('${k.creator.replace(/'/g, "\'")}', '${k.id}', 51)">
            <span>🥣</span> DALO ₹1 😂
          </button>
        </div>
      </article>
    `;
  }).join('');
}

// Select Amount Pills on Detail Page
function selectDetailAmount(amount, btnElem) {
  currentDetailSelectedAmount = amount;
  document.querySelectorAll('.detail-amount-pill').forEach(b => b.classList.remove('active'));
  if (btnElem) btnElem.classList.add('active');

  const customField = document.getElementById('detailCustomAmountInput');
  if (customField) customField.value = amount;
}

// Trigger Page Centerpiece Animation
function triggerCenterpieceAnimation(amount = 51) {
  playCoinChime();
  launchConfetti(0.5, 0.45, 60);

  const coin = document.getElementById('centerpieceFlyingCoin');
  const ting = document.getElementById('centerpieceTingPop');
  const bowl = document.getElementById('stageGoldenKatoraBowl');
  const mascotCard = document.getElementById('detailMascotCard');
  const emotionBadge = document.getElementById('detailEmotionBadge');

  if (coin) {
    coin.classList.remove('fly');
    void coin.offsetWidth;
    coin.classList.add('fly');
  }

  setTimeout(() => {
    if (bowl) {
      bowl.classList.remove('shake');
      void bowl.offsetWidth;
      bowl.classList.add('shake');
    }
    if (ting) {
      ting.classList.remove('show');
      void ting.offsetWidth;
      ting.classList.add('show');
    }
    if (mascotCard) {
      mascotCard.classList.add('happy');
    }
    if (emotionBadge) {
      emotionBadge.innerHTML = '🥳 Super Happy & Blessed! (आशीर्वाद मिला!)';
      emotionBadge.classList.add('happy');
    }
  }, 600);
}

// Detail Page Donation Action
function donateFromDetailPage() {
  if (!currentDetailKatora) return;
  const customField = document.getElementById('detailCustomAmountInput');
  const amount = parseInt(customField ? customField.value : currentDetailSelectedAmount) || 51;
  openDonationModal(currentDetailKatora.creator, currentDetailKatora.id, amount);
}

// Share Functions
function shareOnWhatsApp() {
  if (!currentDetailKatora) return;
  const url = window.location.href;
  const text = `🥣 Please help "${currentDetailKatora.creator}" on Digital Katora!
Reason: ${currentDetailKatora.tagline}
Link: ${url}`;
  window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
}

function shareOnTwitter() {
  if (!currentDetailKatora) return;
  const url = window.location.href;
  const text = `🥣 Dropping coins for ${currentDetailKatora.creator} on Digital Katora 😂
"${currentDetailKatora.tagline}"
${url}`;
  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
}

function copyKatoraShareLink() {
  navigator.clipboard.writeText(window.location.href).then(() => {
    showToast('📋 कटोरा लिंक कॉपी हो गया! दोस्तों के साथ शेयर करें!');
  }).catch(() => {
    showToast(`Link: ${window.location.href}`);
  });
}

// Format relative timestamp helper
function formatTimeAgo(dateStr) {
  if (!dateStr) return 'Just now';
  try {
    const d = new Date(dateStr);
    const now = new Date();
    const diffSecs = Math.floor((now - d) / 1000);
    if (diffSecs < 60) return 'Just now';
    if (diffSecs < 3600) return `${Math.floor(diffSecs / 60)}m ago`;
    if (diffSecs < 86400) return `${Math.floor(diffSecs / 3600)}h ago`;
    return `${Math.floor(diffSecs / 86400)}d ago`;
  } catch (e) {
    return 'Recently';
  }
}


// ═════════════════════════════════════════════════════════════════════
// 17. TOP DONORS & GAMIFIED LEADERBOARD ENGINE
// ═════════════════════════════════════════════════════════════════════

let currentLeaderboardTimeframe = 'all';
let currentShareDonorData = null;

function renderLeaderboardPage(timeframe = 'all') {
  const container = document.getElementById('leaderboardPageWrap');
  if (!container || !window.dataStore) return; // Not on leaderboard.html

  currentLeaderboardTimeframe = timeframe;
  const { topDonors } = window.dataStore.getLeaderboard(timeframe);

  if (!topDonors || topDonors.length === 0) return;

  // 1. Set default share showcase donor (#1)
  if (!currentShareDonorData) {
    currentShareDonorData = {
      ...topDonors[0],
      rank: 1
    };
  }

  // 2. Render Top 3 Royal Podium
  renderTop3Podium(topDonors.slice(0, 3));

  // 3. Render Hall of Fame Cards
  renderHallOfFameGrid(topDonors.slice(0, 6));

  // 4. Render Full Leaderboard (Desktop Table & Mobile Cards)
  renderFullLeaderboardTable(topDonors);

  // 5. Render 9:16 Share Story Card
  updateShareStoryCard(currentShareDonorData);

  // 6. Dynamically update user's personal rank card
  const user = window.dataStore.getUserProfile();
  if (user) {
    const userRankIdx = topDonors.findIndex(d => d.name.toLowerCase() === (user.name || '').toLowerCase());
    const rankNum = userRankIdx >= 0 ? userRankIdx + 1 : topDonors.length + 1;
    const userRankElem = document.getElementById('userCurrentRankText');
    const userStatsElem = document.getElementById('userCurrentRankStats');
    if (userRankElem) {
      userRankElem.textContent = `#${rankNum} (${user.name || 'Aapka Naam'})`;
    }
    if (userStatsElem) {
      userStatsElem.innerHTML = `₹${(user.totalDonated || 0).toLocaleString('en-IN')} Donated &bull; ${user.donationsMadeCount || 0} Katoras Helped &bull; <span style="color: var(--gold-light); font-weight: 700;">${(user.punyaPoints || 0).toLocaleString('en-IN')} Punya Pts</span>`;
    }
  }
}

// Render Top 3 Royal Court Podium
function renderTop3Podium(top3) {
  const podiumWrap = document.getElementById('lbPodiumGrid');
  if (!podiumWrap || top3.length < 3) return;

  const [d1, d2, d3] = top3;

  podiumWrap.innerHTML = `
    <!-- #2 SILVER BENEFACTOR -->
    <div class="lb-podium-card rank-2">
      <span style="font-size: 2.2rem; display: block; margin-bottom: 0.5rem;">🥈</span>
      <div class="lb-podium-avatar-wrap">
        <div class="lb-podium-avatar" style="width: 80px; height: 80px; background: rgba(108, 92, 231, 0.15); display: flex; align-items: center; justify-content: center; font-size: 2.2rem; border-radius: 50%;">
          ${d2.avatar.endsWith('.png') || d2.avatar.endsWith('.jpg') ? `<img src="${d2.avatar}" alt="${d2.name}" style="width: 100%; height: 100%; object-fit: cover;">` : d2.avatar}
        </div>
      </div>
      <h3 class="lb-podium-donor-name">${d2.name}</h3>
      <div class="lb-podium-amount">₹${d2.total.toLocaleString('en-IN')}</div>
      <span class="lb-podium-badge-pill">${d2.title || '💎 महा-दानी'}</span>

      <div class="lb-podium-punya-box">
        <div style="display: flex; justify-content: space-between; font-size: 0.8rem; font-weight: 700; margin-bottom: 0.35rem;">
          <span style="color: #E2E8F0;">🏺 पुण्य का घड़ा</span>
          <span style="color: var(--gold-light); font-family: var(--font-mono);">+${d2.punya.toLocaleString('en-IN')} Pts</span>
        </div>
        <div class="ghada-meter-track" style="height: 8px;">
          <div class="ghada-meter-fill" style="width: 78%; background: #E2E8F0;"></div>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 0.72rem; color: var(--text-muted); margin-top: 0.3rem; font-family: var(--font-mono);">
          <span>78% Full</span>
          <span style="color: #E2E8F0; font-weight: 700;">👑 अगला जन्म राजा का</span>
        </div>
      </div>
    </div>

    <!-- #1 GOLDEN MAHA-DAANI SAMRAT (DOMINANT CENTER) -->
    <div class="lb-podium-card rank-1">
      <div class="lb-podium-avatar-wrap">
        <div class="lb-podium-crown">👑</div>
        <div class="lb-podium-avatar" style="width: 96px; height: 96px; border-radius: 50%; overflow: hidden; background: rgba(255, 184, 0, 0.2);">
          ${d1.avatar.endsWith('.png') || d1.avatar.endsWith('.jpg') ? `<img src="${d1.avatar}" alt="${d1.name}" style="width: 100%; height: 100%; object-fit: cover;">` : `<span style="font-size: 2.8rem; display: flex; height: 100%; align-items: center; justify-content: center;">${d1.avatar}</span>`}
        </div>
      </div>
      <h3 class="lb-podium-donor-name" style="font-size: 1.4rem;">${d1.name}</h3>
      <div class="lb-podium-amount">₹${d1.total.toLocaleString('en-IN')}</div>
      <span class="lb-podium-badge-pill">${d1.title || '👑 महा-दानी सम्राट #1'}</span>

      <div class="lb-podium-punya-box">
        <div style="display: flex; justify-content: space-between; font-size: 0.85rem; font-weight: 800; margin-bottom: 0.35rem;">
          <span style="color: var(--gold-light);">🏺 महा-पुण्य घड़ा</span>
          <span style="color: var(--gold-light); font-family: var(--font-mono);">+${d1.punya.toLocaleString('en-IN')} Pts</span>
        </div>
        <div class="ghada-meter-track" style="height: 10px;">
          <div class="ghada-meter-fill" style="width: 100%;"></div>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 0.72rem; margin-top: 0.35rem; font-family: var(--font-mono);">
          <span style="color: var(--gold-light); font-weight: 800;">100% फुल (ओवरफ्लो!)</span>
          <span style="color: var(--green-light); font-weight: 800;">🌟 स्वर्ग VIP पास!</span>
        </div>
      </div>
    </div>

    <!-- #3 BRONZE HERO -->
    <div class="lb-podium-card rank-3">
      <span style="font-size: 2.2rem; display: block; margin-bottom: 0.5rem;">🥉</span>
      <div class="lb-podium-avatar-wrap">
        <div class="lb-podium-avatar" style="width: 80px; height: 80px; background: rgba(108, 92, 231, 0.15); display: flex; align-items: center; justify-content: center; font-size: 2.2rem; border-radius: 50%;">
          ${d3.avatar.endsWith('.png') || d3.avatar.endsWith('.jpg') ? `<img src="${d3.avatar}" alt="${d3.name}" style="width: 100%; height: 100%; object-fit: cover;">` : d3.avatar}
        </div>
      </div>
      <h3 class="lb-podium-donor-name">${d3.name}</h3>
      <div class="lb-podium-amount">₹${d3.total.toLocaleString('en-IN')}</div>
      <span class="lb-podium-badge-pill">${d3.title || '🏆 लेजेंड'}</span>

      <div class="lb-podium-punya-box">
        <div style="display: flex; justify-content: space-between; font-size: 0.8rem; font-weight: 700; margin-bottom: 0.35rem;">
          <span style="color: #F6AD55;">🏺 पुण्य का घड़ा</span>
          <span style="color: var(--gold-light); font-family: var(--font-mono);">+${d3.punya.toLocaleString('en-IN')} Pts</span>
        </div>
        <div class="ghada-meter-track" style="height: 8px;">
          <div class="ghada-meter-fill" style="width: 52%; background: #F6AD55;"></div>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 0.72rem; color: var(--text-muted); margin-top: 0.3rem; font-family: var(--font-mono);">
          <span>52% Full</span>
          <span style="color: #F6AD55; font-weight: 700;">⚖️ कर्मा बैलेंस ठीक</span>
        </div>
      </div>
    </div>
  `;
}

// Render Hall of Fame Cards Grid
function renderHallOfFameGrid(donors) {
  const grid = document.getElementById('lbHallOfFameGrid');
  if (!grid) return;

  grid.innerHTML = donors.map((d, idx) => {
    const rank = idx + 1;
    const rankIcon = rank === 1 ? '🥇' : (rank === 2 ? '🥈' : (rank === 3 ? '🥉' : `#${rank}`));
    return `
      <div class="lb-hall-card">
        <div class="lb-hall-top-row">
          <div class="lb-hall-avatar-wrap">
            <div class="lb-hall-avatar">
              ${d.avatar.endsWith('.png') || d.avatar.endsWith('.jpg') ? `<img src="${d.avatar}" alt="${d.name}">` : d.avatar}
            </div>
            <div>
              <div style="font-weight: 800; font-size: 1rem; color: var(--text-primary);">${d.name}</div>
              <div style="font-size: 0.78rem; color: var(--text-muted);">${d.count} बार कटोरा भरा &bull; ${d.title || 'Daanveer'}</div>
            </div>
          </div>
          <span class="lb-hall-rank-num" style="color: ${rank === 1 ? 'var(--gold-light)' : (rank === 2 ? '#E2E8F0' : (rank === 3 ? '#F6AD55' : 'var(--text-muted)'))};">${rankIcon}</span>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-subtle); padding-top: 0.75rem;">
          <div>
            <div style="font-size: 0.72rem; color: var(--text-muted); font-family: var(--font-mono); font-weight: 700;">TOTAL CONTRIBUTION</div>
            <div class="lb-hall-amount">₹${d.total.toLocaleString('en-IN')}</div>
          </div>
          <button type="button" class="btn btn-glass btn-sm" onclick="selectShareDonor(${idx})" style="font-size: 0.82rem; padding: 0.35rem 0.85rem;">
            <span>📸</span> Flex Card
          </button>
        </div>
      </div>
    `;
  }).join('');
}

// Render Full Leaderboard Table (Desktop & Mobile)
function renderFullLeaderboardTable(donors) {
  const tbody = document.getElementById('lbTableBodyDesktop');
  const mobileList = document.getElementById('lbMobileCardsList');

  if (tbody) {
    tbody.innerHTML = donors.map((d, idx) => {
      const rank = idx + 1;
      const rankClass = rank <= 3 ? 'rank-top' : '';
      return `
        <tr>
          <td>
            <span class="lb-table-rank-pill ${rankClass}">#${rank}</span>
          </td>
          <td>
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <span style="font-size: 1.4rem;">${d.avatar.endsWith('.png') || d.avatar.endsWith('.jpg') ? '👑' : d.avatar}</span>
              <div>
                <strong>${d.name}</strong>
                <div style="font-size: 0.75rem; color: var(--text-muted);">${d.title || 'Daanveer'}</div>
              </div>
            </div>
          </td>
          <td>
            <span class="badge" style="font-size: 0.78rem; font-weight: 700; background: rgba(108, 92, 231, 0.12); color: var(--primary-light); border: 1px solid rgba(108, 92, 231, 0.3);">
              ${d.badge}
            </span>
          </td>
          <td>
            <strong style="font-family: var(--font-mono); font-size: 1.1rem; color: var(--green-light);">₹${d.total.toLocaleString('en-IN')}</strong>
          </td>
          <td>
            <span style="font-family: var(--font-mono); color: var(--text-secondary); font-size: 0.9rem;">${d.count} दान</span>
          </td>
          <td>
            <button type="button" class="btn btn-glass btn-sm" onclick="selectShareDonor(${idx})" style="font-size: 0.8rem; padding: 0.3rem 0.75rem;">
              <span>📸</span> Flex
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  if (mobileList) {
    mobileList.innerHTML = donors.map((d, idx) => {
      const rank = idx + 1;
      return `
        <div class="lb-mobile-row-card">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <span style="font-family: var(--font-mono); font-weight: 800; font-size: 1.1rem; color: ${rank <= 3 ? 'var(--gold-light)' : 'var(--text-muted)'}; min-width: 32px;">#${rank}</span>
            <div>
              <div style="font-weight: 700; font-size: 0.95rem; color: var(--text-primary);">${d.name}</div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">${d.badge} &bull; ${d.count} दान</div>
            </div>
          </div>
          <div style="text-align: right;">
            <div style="font-family: var(--font-mono); font-weight: 800; color: var(--green-light); font-size: 1.05rem;">₹${d.total.toLocaleString('en-IN')}</div>
            <button type="button" class="btn btn-glass btn-sm" onclick="selectShareDonor(${idx})" style="font-size: 0.72rem; padding: 0.2rem 0.6rem; margin-top: 0.25rem;">
              Flex 📸
            </button>
          </div>
        </div>
      `;
    }).join('');
  }
}

// Select a donor to display on 9:16 Share Card
function selectShareDonor(index) {
  if (!window.dataStore) return;
  const { topDonors } = window.dataStore.getLeaderboard(currentLeaderboardTimeframe);
  if (topDonors && topDonors[index]) {
    currentShareDonorData = {
      ...topDonors[index],
      rank: index + 1
    };
    updateShareStoryCard(currentShareDonorData);
    
    // Smooth scroll to showcase
    const shareSec = document.getElementById('lbShareShowcaseSection');
    if (shareSec) {
      shareSec.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
}

// Update 9:16 Share Story Card Details
function updateShareStoryCard(donor) {
  if (!donor) return;

  const nameEl = document.getElementById('shareStoryDonorName');
  const rankEl = document.getElementById('shareStoryRankBadge');
  const amtEl = document.getElementById('shareStoryTotalAmount');
  const badgeEl = document.getElementById('shareStoryBadgeName');
  const punyaEl = document.getElementById('shareStoryPunyaPoints');
  const avatarEl = document.getElementById('shareStoryAvatarBox');

  if (nameEl) nameEl.textContent = donor.name;
  if (rankEl) rankEl.textContent = `RANK #${donor.rank || 1} • ${donor.title || 'MAHA-DAANI'}`;
  if (amtEl) amtEl.textContent = `₹${(donor.total || 0).toLocaleString('en-IN')}`;
  if (badgeEl) badgeEl.textContent = `🏆 ${donor.badge || 'Katora King'}`;
  if (punyaEl) punyaEl.textContent = `+${((donor.total || 0) * 2).toLocaleString('en-IN')} Punya Points`;

  if (avatarEl) {
    if (donor.avatar && (donor.avatar.endsWith('.png') || donor.avatar.endsWith('.jpg'))) {
      avatarEl.innerHTML = `<img src="${donor.avatar}" alt="${donor.name}">`;
    } else {
      avatarEl.innerHTML = `<span style="font-size: 3rem; display: flex; height: 100%; align-items: center; justify-content: center;">${donor.avatar || '👑'}</span>`;
    }
  }
}

// Time Filter Click Listener
function setLeaderboardFilter(timeframe, btnElem) {
  document.querySelectorAll('.lb-filter-btn').forEach(b => b.classList.remove('active'));
  if (btnElem) btnElem.classList.add('active');
  renderLeaderboardPage(timeframe);
}

// Social Share Triggers
function shareLeaderboardInstagram() {
  const d = currentShareDonorData || { name: 'Samir Rao', total: 25001, rank: 1 };
  showToast(`📸 Instagram Story preview ready for ${d.name} (Rank #${d.rank})! Screenshot this 9:16 card to post! 🌟`);
}

function shareLeaderboardWhatsApp() {
  const d = currentShareDonorData || { name: 'Samir Rao', total: 25001, rank: 1 };
  const text = `👑 Check out my rank on Digital Katora Leaderboard!
Rank: #${d.rank} (${d.name})
Total Donated: ₹${d.total.toLocaleString('en-IN')}
View live at: ${window.location.href}`;
  window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
}

function shareLeaderboardTwitter() {
  const d = currentShareDonorData || { name: 'Samir Rao', total: 25001, rank: 1 };
  const text = `👑 Ranked #${d.rank} Mahadaani on @DigitalKatora with ₹${d.total.toLocaleString('en-IN')} in digital coins dropped! 😂🥣
${window.location.href}`;
  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
}

function downloadShareCard() {
  const d = currentShareDonorData || { name: 'Samir Rao', rank: 1 };
  showToast(`💾 Story card image for "${d.name}" generated! Right click / long-press to save image!`);
}

function copyLeaderboardShareLink() {
  navigator.clipboard.writeText(window.location.href).then(() => {
    showToast('📋 लीडरबोर्ड लिंक कॉपी हो गया! दोस्तों को चैलेंज करें!');
  }).catch(() => {
    showToast(`Link: ${window.location.href}`);
  });
}


// ═════════════════════════════════════════════════════════════════════
// 18. CREATE YOUR KATORA INTERACTIVE WORKSPACE ENGINE
// ═════════════════════════════════════════════════════════════════════

let createFormData = {
  name: '',
  category: 'chai',
  categoryName: 'Chai & Food',
  reason: '',
  story: '',
  targetAmount: 2000,
  paymentMethod: 'upi',
  upiId: '',
  qrDataUrl: null,
  image: 'mascot-beggar-3d.jpg'
};

let qrCameraStream = null;

function initCreateKatoraPage() {
  const formWrap = document.getElementById('createKatoraFormWrap') || document.getElementById('katoraCreationForm') || document.getElementById('createNameInput');
  if (!formWrap) return; // Not on create-katora.html

  // 1. Text & Numeric Input Listeners
  const nameInput = document.getElementById('createNameInput');
  const catInput = document.getElementById('createCategorySelect');
  const reasonInput = document.getElementById('createReasonInput');
  const storyInput = document.getElementById('createStoryInput');
  const goalInput = document.getElementById('createGoalInput');
  const upiInput = document.getElementById('createUpiInput');

  if (nameInput) {
    nameInput.addEventListener('input', (e) => {
      createFormData.name = e.target.value.trim();
      updateLivePreview();
      updateStepperProgress();
    });
  }

  if (catInput) {
    catInput.addEventListener('change', (e) => {
      createFormData.category = e.target.value;
      const catNames = {
        'chai': 'Chai & Food',
        'tech': 'Tech & Coding',
        'hostel': 'Hostel Life',
        'meme': 'Heartbreak & Drama',
        'urgent': 'Urgent Punya'
      };
      createFormData.categoryName = catNames[e.target.value] || 'Chai & Food';
      updateLivePreview();
    });
  }

  if (reasonInput) {
    reasonInput.addEventListener('input', (e) => {
      createFormData.reason = e.target.value.trim();
      const countEl = document.getElementById('reasonCharCount');
      if (countEl) countEl.textContent = `${e.target.value.length} / 120`;
      updateLivePreview();
      updateStepperProgress();
    });
  }

  if (storyInput) {
    storyInput.addEventListener('input', (e) => {
      createFormData.story = e.target.value.trim();
      const countEl = document.getElementById('storyCharCount');
      if (countEl) countEl.textContent = `${e.target.value.length} / 350`;
      updateLivePreview();
      updateStepperProgress();
    });
  }

  if (goalInput) {
    goalInput.addEventListener('input', (e) => {
      const val = parseInt(e.target.value) || 0;
      createFormData.targetAmount = val > 0 ? val : 1000;
      updateLivePreview();
      updateStepperProgress();
    });
  }

  if (upiInput) {
    upiInput.addEventListener('input', (e) => {
      const val = e.target.value.trim();
      createFormData.upiId = val;
      const isValid = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/.test(val);
      const indicator = document.getElementById('upiValidationIndicator');
      if (indicator) {
        if (isValid) {
          indicator.innerHTML = '<span style="color: var(--green-light); font-weight: 700;">✓ मान्य UPI ID (Valid UPI ID)</span>';
        } else if (val.length > 0) {
          indicator.innerHTML = '<span style="color: var(--coral-light); font-size: 0.8rem;">कृपया सही UPI ID डालें (उदा: name@okhdfcbank)</span>';
        } else {
          indicator.innerHTML = '';
        }
      }
      updateLivePreview();
      updateStepperProgress();
    });
  }

  // Setup Photo Drag & Drop
  setupPhotoDropzone();

  // Attach explicit submit listener on form if present
  const formElem = document.getElementById('katoraCreationForm');
  if (formElem) {
    formElem.onsubmit = submitKatora;
  }

  // Initial Render
  updateLivePreview();
  updateStepperProgress();
}

// Drag & Drop Photo Upload
function setupPhotoDropzone() {
  const dropzone = document.getElementById('photoDropzone');
  const fileInput = document.getElementById('photoFileInput');
  if (!dropzone || !fileInput) return;

  dropzone.addEventListener('click', () => fileInput.click());

  dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('dragover');
  });

  dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));

  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('dragover');
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleSelectedPhotoFile(e.dataTransfer.files[0]);
    }
  });

  fileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      handleSelectedPhotoFile(e.target.files[0]);
    }
  });
}

function handleSelectedPhotoFile(file) {
  if (!file.type.startsWith('image/')) {
    showToast('कृपया केवल इमेज फाइल (JPG, PNG) अपलोड करें!', 'error');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    createFormData.image = e.target.result;
    
    // Update Photo preview box
    const previewImg = document.getElementById('photoUploadPreviewImg');
    const placeholder = document.getElementById('photoUploadPlaceholder');
    const previewWrap = document.getElementById('photoUploadPreviewWrap');

    if (previewImg) previewImg.src = e.target.result;
    if (placeholder) placeholder.style.display = 'none';
    if (previewWrap) previewWrap.style.display = 'block';

    updateLivePreview();
    updateStepperProgress();
    showToast('📸 फोटो सफलतापूर्वक अपलोड हुई!');
  };
  reader.readAsDataURL(file);
}

function selectPresetMascot(imgSrc, pillElem) {
  createFormData.image = imgSrc;
  document.querySelectorAll('.preset-mascot-pill').forEach(p => p.classList.remove('active'));
  if (pillElem) pillElem.classList.add('active');

  const previewImg = document.getElementById('photoUploadPreviewImg');
  const placeholder = document.getElementById('photoUploadPlaceholder');
  const previewWrap = document.getElementById('photoUploadPreviewWrap');

  if (previewImg) previewImg.src = imgSrc;
  if (placeholder) placeholder.style.display = 'none';
  if (previewWrap) previewWrap.style.display = 'block';

  updateLivePreview();
  updateStepperProgress();
}

function removeUploadedPhoto(e) {
  if (e) e.stopPropagation();
  createFormData.image = 'mascot-beggar-3d.jpg';

  const placeholder = document.getElementById('photoUploadPlaceholder');
  const previewWrap = document.getElementById('photoUploadPreviewWrap');

  if (placeholder) placeholder.style.display = 'block';
  if (previewWrap) previewWrap.style.display = 'none';

  updateLivePreview();
  updateStepperProgress();
}

// Set Goal Preset Pills
function setGoalPreset(amount) {
  createFormData.targetAmount = amount;
  const goalInput = document.getElementById('createGoalInput');
  if (goalInput) goalInput.value = amount;
  updateLivePreview();
  updateStepperProgress();
}

// Payment Tabs Switcher
function switchPaymentTab(tab) {
  createFormData.paymentMethod = tab;
  document.querySelectorAll('.payment-tab-btn').forEach(b => b.classList.remove('active'));
  const activeBtn = document.getElementById(`tabBtn_${tab}`);
  if (activeBtn) activeBtn.classList.add('active');

  const scanView = document.getElementById('payView_scan');
  const uploadView = document.getElementById('payView_upload');
  const upiView = document.getElementById('payView_upi');

  if (scanView) scanView.style.display = tab === 'scan' ? 'block' : 'none';
  if (uploadView) uploadView.style.display = tab === 'upload' ? 'block' : 'none';
  if (upiView) upiView.style.display = tab === 'upi' ? 'block' : 'none';

  if (tab !== 'scan' && qrCameraStream) {
    stopQrCameraScanner();
  }
}

// QR Camera Scanner
function startQrCameraScanner() {
  const video = document.getElementById('qrScannerVideo');
  const statusEl = document.getElementById('qrScannerStatus');

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    if (statusEl) statusEl.innerHTML = '<span style="color: var(--coral-light);">कैमरा उपलब्ध नहीं है। कृपया QR अपलोड विकल्प चुनें।</span>';
    return;
  }

  if (statusEl) statusEl.textContent = '📷 कैमरा चालू हो रहा है...';

  navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
    .then((stream) => {
      qrCameraStream = stream;
      if (video) {
        video.srcObject = stream;
        video.play();
      }
      if (statusEl) statusEl.innerHTML = '<span style="color: var(--green-light); font-weight: 700;">✓ कैमरा तैयार है! QR कोड सामने लाएं।</span>';
      
      // Simulated detection after 3s for smooth user feedback
      setTimeout(() => {
        simulateQrDetection();
      }, 3000);
    })
    .catch((err) => {
      console.warn('Camera permission denied:', err);
      if (statusEl) statusEl.innerHTML = '<span style="color: var(--coral-light);">कैमरा अनुमति नहीं मिली। कृपया "Upload QR" या "UPI ID" विकल्प चुनें।</span>';
    });
}

function stopQrCameraScanner() {
  if (qrCameraStream) {
    qrCameraStream.getTracks().forEach(track => track.stop());
    qrCameraStream = null;
  }
}

function simulateQrDetection() {
  stopQrCameraScanner();
  const detectedUpi = 'scanned.katora@okhdfcbank';
  createFormData.upiId = detectedUpi;
  createFormData.customQr = 'mascot-donor-3d.png';

  const resultBox = document.getElementById('qrDetectedResultBox');
  const resultUpi = document.getElementById('qrDetectedUpiDisplay');

  if (resultUpi) resultUpi.textContent = detectedUpi;
  if (resultBox) resultBox.style.display = 'block';

  showToast('⚡ QR कोड सफलतापूर्वक डिटेक्ट हुआ!');
  updateLivePreview();
  updateStepperProgress();
}

function handleQrImageUpload(event) {
  if (event.target.files && event.target.files[0]) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      createFormData.customQr = e.target.result;
      createFormData.upiId = createFormData.upiId || 'uploaded.qr@upi';

      const previewImg = document.getElementById('qrUploadPreviewImg');
      const placeholder = document.getElementById('qrUploadPlaceholder');
      const previewWrap = document.getElementById('qrUploadPreviewWrap');

      if (previewImg) previewImg.src = e.target.result;
      if (placeholder) placeholder.style.display = 'none';
      if (previewWrap) previewWrap.style.display = 'flex';

      showToast('📲 UPI QR कोड सफलतापूर्वक लोड हुआ!');
      updateLivePreview();
      updateStepperProgress();
    };
    reader.readAsDataURL(file);
  }
}

// Live Katora Preview Synchronizer
function updateLivePreview() {
  const pImg = document.getElementById('prevMediaImg');
  const pName = document.getElementById('prevCreatorName');
  const pCat = document.getElementById('prevCategoryTag');
  const pReason = document.getElementById('prevReasonText');
  const pStory = document.getElementById('prevStoryText');
  const pRaised = document.getElementById('prevRaisedVal');
  const pGoal = document.getElementById('prevGoalVal');
  const pProgressFill = document.getElementById('prevProgressFill');
  const pMood = document.getElementById('prevMoodAvatar');
  const pMoodText = document.getElementById('prevMoodText');

  const name = createFormData.name || 'आपका शुभ नाम (Rahul)';
  const reason = createFormData.reason || '"Sharma ji ke tapri par udhaar ho gaya hai..."';
  const story = createFormData.story || 'Doston, thoda daan karke ek student ki chai bachao! 🙏';
  const goal = createFormData.targetAmount || 2000;

  if (pImg) pImg.src = createFormData.image || 'mascot-beggar-3d.jpg';
  if (pName) pName.textContent = name;
  if (pCat) pCat.textContent = `🏷️ ${createFormData.categoryName || 'Chai & Food'}`;
  if (pReason) pReason.textContent = `"${reason}"`;
  if (pStory) pStory.textContent = story;
  if (pRaised) pRaised.textContent = '₹0';
  if (pGoal) pGoal.textContent = `/ ₹${goal.toLocaleString('en-IN')} लक्ष्य`;
  if (pProgressFill) pProgressFill.style.width = '5%';

  // Update Character Mood
  const filledCount = [createFormData.name, createFormData.reason, createFormData.story, createFormData.upiId].filter(Boolean).length;
  if (pMood && pMoodText) {
    if (filledCount >= 3) {
      pMood.textContent = '🥳';
      pMoodText.textContent = 'Super Happy & Ready to Beg! (कटोरा तैयार है!)';
    } else if (filledCount >= 1) {
      pMood.textContent = '🙂';
      pMoodText.textContent = 'Hopeful (उम्मीद जाग रही है...)';
    } else {
      pMood.textContent = '🥺';
      pMoodText.textContent = 'Nervous & Broke (भूखा और परेशान)';
    }
  }

  // Update Review Summary Box
  const rName = document.getElementById('revSumName');
  const rCat = document.getElementById('revSumCat');
  const rReason = document.getElementById('revSumReason');
  const rGoal = document.getElementById('revSumGoal');
  const rPayment = document.getElementById('revSumPayment');

  if (rName) rName.textContent = createFormData.name || '— (नाम डालें)';
  if (rCat) rCat.textContent = createFormData.categoryName || 'Chai & Food';
  if (rReason) rReason.textContent = createFormData.reason ? `"${createFormData.reason}"` : '— (कारण डालें)';
  if (rGoal) rGoal.textContent = `₹${goal.toLocaleString('en-IN')}`;
  if (rPayment) rPayment.textContent = createFormData.upiId ? `UPI: ${createFormData.upiId}` : '— (पेमेंट सेट करें)';
}

// Stepper Progress Indicators
function updateStepperProgress() {
  const sPhoto = document.getElementById('stepNode_photo');
  const sInfo = document.getElementById('stepNode_info');
  const sStory = document.getElementById('stepNode_story');
  const sGoal = document.getElementById('stepNode_goal');
  const sPayment = document.getElementById('stepNode_payment');
  const sReview = document.getElementById('stepNode_review');

  if (sPhoto) sPhoto.className = `stepper-node ${createFormData.image ? 'completed' : 'active'}`;
  if (sInfo) sInfo.className = `stepper-node ${createFormData.name ? 'completed' : 'active'}`;
  if (sStory) sStory.className = `stepper-node ${createFormData.reason && createFormData.story ? 'completed' : ''}`;
  if (sGoal) sGoal.className = `stepper-node ${createFormData.targetAmount > 0 ? 'completed' : ''}`;
  if (sPayment) sPayment.className = `stepper-node ${createFormData.upiId ? 'completed' : ''}`;
  
  const allReady = createFormData.name && createFormData.reason && createFormData.upiId;
  if (sReview) sReview.className = `stepper-node ${allReady ? 'active' : ''}`;
}

// Submit Form Handler
let isSubmittingKatora = false;

function submitKatora(event) {
  if (event) event.preventDefault();
  if (isSubmittingKatora) return;

  const nameVal = (document.getElementById('createNameInput')?.value || createFormData.name || '').trim();
  const reasonVal = (document.getElementById('createReasonInput')?.value || createFormData.reason || '').trim();
  const storyVal = (document.getElementById('createStoryInput')?.value || createFormData.story || reasonVal || '').trim();
  const goalVal = parseInt(document.getElementById('createGoalInput')?.value) || createFormData.targetAmount || 1000;
  const upiVal = (document.getElementById('createUpiInput')?.value || createFormData.upiId || '').trim();
  const categoryVal = document.getElementById('createCategorySelect')?.value || createFormData.category || 'chai';

  if (!nameVal) {
    showToast('कृपया अपना नाम या उपनाम डालें!', 'error');
    document.getElementById('createNameInput')?.focus();
    return;
  }
  if (!reasonVal) {
    showToast('कृपया पैसे क्यों चाहिए उसका कारण लिखें!', 'error');
    document.getElementById('createReasonInput')?.focus();
    return;
  }
  if (!upiVal) {
    showToast('कृपया अपनी UPI ID दर्ज करें ताकि दान सीधा आपको मिले!', 'error');
    document.getElementById('createUpiInput')?.focus();
    return;
  }

  isSubmittingKatora = true;
  const submitBtn = document.getElementById('submitKatoraBtn');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>⏳</span> कटोरा प्रोसेस हो रहा है...';
  }

  // 1. Save to Persistent LocalStorage DataStore
  const newKatora = window.dataStore ? window.dataStore.createKatora({
    title: reasonVal,
    tagline: reasonVal,
    creator: nameVal,
    category: categoryVal,
    targetAmount: goalVal,
    upiId: upiVal,
    story: storyVal || reasonVal,
    image: createFormData.image || 'mascot-beggar-3d.jpg',
    customQr: createFormData.customQr || null,
    urgent: false
  }) : { id: 'katora-' + Date.now() };

  // 2. Play Audio & Confetti
  playCoinChime();
  launchConfetti(0.5, 0.45, 80);
  showToast('🎉 बधाई हो! कटोरा सफलतापूर्वक बन गया!');

  // 3. Open Success Celebration Modal if available
  const modal = document.getElementById('submissionSuccessModal');
  const succName = document.getElementById('succKatoraName');
  const succLink = document.getElementById('succViewKatoraLink');
  const succShareBtn = document.getElementById('succShareKatoraBtn');

  if (succName) succName.textContent = nameVal;
  if (succLink && newKatora) {
    succLink.href = `katora-detail.html?id=${newKatora.id}`;
  }
  if (succShareBtn && newKatora) {
    succShareBtn.onclick = () => openShareKatoraModal(newKatora.id);
  }

  if (modal) modal.classList.add('active');

  // 4. Redirect after short celebration animation (with created=1 param to trigger auto-celebration & share sheet)
  setTimeout(() => {
    isSubmittingKatora = false;
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<span>🥣</span> Katora Jama Karo &rarr;';
    }
    if (newKatora && newKatora.id) {
      window.location.href = `katora-detail.html?id=${newKatora.id}&created=1`;
    } else {
      window.location.href = 'katoras.html';
    }
  }, 1800);
}


// ═════════════════════════════════════════════════════════════════════
// 19. ADMIN APPROVAL & MODERATION DASHBOARD ENGINE
// ═════════════════════════════════════════════════════════════════════

let currentAdminReviewKatora = null;
let adminAuditLogs = [
  { time: '10:42 AM', action: 'Approved Katora "WiFi Bill Debt"', admin: 'Admin Sahab', id: 'katora-wifi-bill' },
  { time: '10:15 AM', action: 'Verified UPI QR for @rahul.tapri', admin: 'Moderator Pintu', id: 'katora-chai-fund' },
  { time: '09:30 AM', action: 'Requested Better Photo from Kabir Singh', admin: 'Admin Sahab', id: 'katora-breakup-biryani' },
  { time: '08:45 AM', action: 'System Flagged Suspicious Target Goal', admin: 'Automod', id: 'katora-startup-idea' }
];

let adminSelectedKatoraIds = new Set();
let adminCurrentFilter = {
  search: '',
  status: 'pending',
  payment: 'all',
  priority: 'all',
  sort: 'newest'
};

function renderAdminPage() {
  const queueWrap = document.getElementById('adminQueueTableBody');
  if (!queueWrap || !window.dataStore) return; // Not on admin.html

  const allKatoras = window.dataStore.getKatoras();

  // 1. Calculate & Populate 4 Stats Cards
  const pendingCount = allKatoras.filter(k => k.status === 'pending_approval' || !k.status || k.status === 'pending').length;
  const approvedCount = allKatoras.filter(k => k.status === 'approved' || k.verified).length;
  const changesCount = allKatoras.filter(k => k.status === 'changes_requested').length;
  const rejectedCount = allKatoras.filter(k => k.status === 'rejected').length;

  const statPending = document.getElementById('adminStatPending');
  const statApproved = document.getElementById('adminStatApproved');
  const statChanges = document.getElementById('adminStatChanges');
  const statRejected = document.getElementById('adminStatRejected');
  const navBadge = document.getElementById('adminNavPendingBadge');
  const alertBanner = document.getElementById('adminPriorityAlertBanner');

  if (statPending) statPending.textContent = pendingCount;
  if (statApproved) statApproved.textContent = approvedCount + 12;
  if (statChanges) statChanges.textContent = changesCount;
  if (statRejected) statRejected.textContent = rejectedCount;
  if (navBadge) navBadge.textContent = pendingCount;

  if (alertBanner) {
    alertBanner.style.display = pendingCount > 0 ? 'flex' : 'none';
  }

  // 2. Filter & Sort Katoras
  let list = [...allKatoras];

  if (adminCurrentFilter.status !== 'all') {
    if (adminCurrentFilter.status === 'pending') {
      list = list.filter(k => k.status === 'pending_approval' || !k.status || k.status === 'pending');
    } else if (adminCurrentFilter.status === 'approved') {
      list = list.filter(k => k.status === 'approved' || k.verified);
    } else {
      list = list.filter(k => k.status === adminCurrentFilter.status);
    }
  }

  if (adminCurrentFilter.search) {
    const q = adminCurrentFilter.search.toLowerCase();
    list = list.filter(k => 
      (k.creator && k.creator.toLowerCase().includes(q)) ||
      (k.title && k.title.toLowerCase().includes(q)) ||
      (k.id && k.id.toLowerCase().includes(q))
    );
  }

  // Render Table Rows
  if (list.length === 0) {
    queueWrap.innerHTML = `
      <tr>
        <td colspan="8" style="text-align: center; padding: 3rem; color: var(--text-muted); font-style: italic;">
          🎉 कोई कटोरा नहीं मिला! सभी रिव्यू पूरे हो चुके हैं।
        </td>
      </tr>
    `;
  } else {
    queueWrap.innerHTML = list.map((k, idx) => {
      const priority = k.urgent ? 'urgent' : (idx % 2 === 0 ? 'high' : 'normal');
      const priorityLabel = priority === 'urgent' ? '⚠ Urgent' : (priority === 'high' ? '▲ High' : '● Normal');
      const isChecked = adminSelectedKatoraIds.has(k.id);
      const isApproved = k.status === 'approved' || k.verified;

      return `
        <tr data-id="${k.id}">
          <td>
            <input type="checkbox" onchange="toggleAdminRowSelect('${k.id}', this)" ${isChecked ? 'checked' : ''} style="accent-color: var(--primary); width: 16px; height: 16px; cursor: pointer;">
          </td>
          <td>
            <div style="width: 44px; height: 44px; border-radius: 12px; overflow: hidden; background: var(--bg-surface);">
              <img src="${k.image || 'mascot-beggar-3d.jpg'}" alt="${k.creator}" style="width: 100%; height: 100%; object-fit: cover; object-position: center 15%;">
            </div>
          </td>
          <td>
            <div style="font-weight: 800; font-size: 0.95rem; color: var(--text-primary);">${k.creator}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted); font-family: var(--font-mono);">${k.id}</div>
          </td>
          <td style="max-width: 260px;">
            <div style="font-weight: 600; font-size: 0.88rem; line-height: 1.35; margin-bottom: 0.2rem; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden;">
              "${k.tagline || k.title}"
            </div>
            <div style="font-size: 0.8rem; color: var(--text-muted);">Goal: <strong style="color: var(--gold-light); font-family: var(--font-mono);">₹${(k.targetAmount || 1000).toLocaleString('en-IN')}</strong></div>
          </td>
          <td>
            <span class="badge" style="font-size: 0.75rem; background: rgba(0, 184, 148, 0.12); color: var(--green-light); border: 1px solid rgba(0, 184, 148, 0.3);">
              ${k.customQr ? '📲 QR + UPI' : '🆔 UPI Direct'}
            </span>
          </td>
          <td>
            <span class="priority-pill ${priority}">${priorityLabel}</span>
          </td>
          <td>
            <span class="badge" style="font-size: 0.78rem; font-weight: 700; ${isApproved ? 'background: rgba(0, 184, 148, 0.15); color: var(--green-light); border: 1px solid var(--green);' : 'background: rgba(255, 184, 0, 0.15); color: var(--gold-light); border: 1px solid var(--gold);'}">
              ${isApproved ? '✓ Approved' : '◷ Pending'}
            </span>
          </td>
          <td style="text-align: right;">
            <div style="display: inline-flex; gap: 0.4rem;">
              <button type="button" class="btn btn-primary-gradient btn-sm" onclick="openAdminReviewModal('${k.id}')" style="font-size: 0.8rem; padding: 0.35rem 0.85rem;">
                <span>🔍</span> Review
              </button>
              <button type="button" class="btn btn-glass btn-sm" onclick="openShareKatoraModal('${k.id}')" title="Share Katora" style="font-size: 0.8rem; padding: 0.35rem 0.6rem;">
                <span>📤</span>
              </button>
              ${!isApproved ? `
                <button type="button" class="btn btn-glass btn-sm" onclick="adminQuickApprove('${k.id}')" style="font-size: 0.8rem; padding: 0.35rem 0.65rem; color: var(--green-light) !important; border-color: rgba(0, 184, 148, 0.3);">
                  ✓
                </button>
              ` : ''}
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  // 3. Render Audit Log Feed
  renderAdminAuditLogs();
}

// Open 3-Column Review Workspace
function openAdminReviewModal(katoraId) {
  if (!window.dataStore) return;
  const katora = window.dataStore.getKatoraById(katoraId);
  if (!katora) return;

  currentAdminReviewKatora = katora;

  // 1. Populate Left Column (Submission Data)
  const mPhoto = document.getElementById('modPhotoImg');
  const mName = document.getElementById('modCreatorName');
  const mId = document.getElementById('modKatoraId');
  const mCategory = document.getElementById('modCategoryTag');
  const mReason = document.getElementById('modReasonQuote');
  const mStory = document.getElementById('modStoryFull');
  const mGoal = document.getElementById('modTargetGoal');
  const mUpi = document.getElementById('modUpiText');
  const mDate = document.getElementById('modDateSubmitted');

  if (mPhoto) mPhoto.src = katora.image || 'mascot-beggar-3d.jpg';
  if (mName) mName.textContent = katora.creator;
  if (mId) mId.textContent = katora.id;
  if (mCategory) mCategory.textContent = `🏷️ ${katora.categoryName || 'Chai & Food'}`;
  if (mReason) mReason.textContent = `"${katora.tagline || katora.title}"`;
  if (mStory) mStory.textContent = katora.story || 'Hum bhi gareeb hain!';
  if (mGoal) mGoal.textContent = `₹${(katora.targetAmount || 1000).toLocaleString('en-IN')}`;
  if (mUpi) mUpi.textContent = katora.upiId || 'katora@upi';
  if (mDate) mDate.textContent = formatTimeAgo(katora.createdAt || new Date());

  // 2. Populate Center Column (Live Public Preview)
  const prevImg = document.getElementById('modPrevCardImg');
  const prevName = document.getElementById('modPrevCardName');
  const prevReason = document.getElementById('modPrevCardReason');
  const prevGoal = document.getElementById('modPrevCardGoal');
  const prevLink = document.getElementById('modOpenFullPrevLink');

  if (prevImg) prevImg.src = katora.image || 'mascot-beggar-3d.jpg';
  if (prevName) prevName.textContent = katora.creator;
  if (prevReason) prevReason.textContent = `"${katora.tagline || katora.title}"`;
  if (prevGoal) prevGoal.textContent = `₹${(katora.targetAmount || 1000).toLocaleString('en-IN')}`;
  if (prevLink) prevLink.href = `katora-detail.html?id=${katora.id}`;

  // 3. Populate Right Column (Payment Verification)
  const qrImg = document.getElementById('modQrThumbImg');
  const detectedUpi = document.getElementById('modDetectedUpiDisplay');
  if (qrImg) {
    qrImg.src = katora.customQr || `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=upi://pay?pa=${encodeURIComponent(katora.upiId || 'katora@upi')}`;
  }
  if (detectedUpi) detectedUpi.textContent = katora.upiId || 'katora@upi';

  // Reset checkboxes
  document.querySelectorAll('.mod-check-item input[type="checkbox"]').forEach(c => c.checked = false);
  updateModerationApproveButtonState();

  // Open Modal
  const modal = document.getElementById('adminReviewModalOverlay');
  if (modal) modal.classList.add('active');
}

function closeAdminReviewModal() {
  const modal = document.getElementById('adminReviewModalOverlay');
  if (modal) modal.classList.remove('active');
  currentAdminReviewKatora = null;
}

// Moderation Checklist State
function updateModerationApproveButtonState() {
  const checkboxes = document.querySelectorAll('.mod-check-item input[type="checkbox"]');
  const allChecked = Array.from(checkboxes).slice(0, 4).every(c => c.checked);
  const approveBtn = document.getElementById('adminModalApproveBtn');
  if (approveBtn) {
    approveBtn.disabled = !allChecked;
    approveBtn.style.opacity = allChecked ? '1' : '0.6';
  }
}

// Admin Action: Approve
function adminApproveCurrentKatora() {
  if (!currentAdminReviewKatora) return;

  currentAdminReviewKatora.status = 'approved';
  currentAdminReviewKatora.verified = true;

  // Persist update
  const all = window.dataStore.getKatoras();
  const found = all.find(k => k.id === currentAdminReviewKatora.id);
  if (found) {
    found.status = 'approved';
    found.verified = true;
    localStorage.setItem(window.dataStore.storageKey, JSON.stringify(all));
  }

  // Audit Log
  adminAuditLogs.unshift({
    time: 'Just now',
    action: `Approved Katora "${currentAdminReviewKatora.creator}"`,
    admin: 'Admin Sahab',
    id: currentAdminReviewKatora.id
  });

  playCoinChime();
  launchConfetti(0.5, 0.4, 75);
  showToast(`✅ "${currentAdminReviewKatora.creator}" का कटोरा लाइव कर दिया गया! (Katora is now Live!)`);

  closeAdminReviewModal();
  renderAdminPage();
}

function adminQuickApprove(id) {
  const katora = window.dataStore?.getKatoraById(id);
  if (!katora) return;

  katora.status = 'approved';
  katora.verified = true;

  const all = window.dataStore.getKatoras();
  const found = all.find(k => k.id === id);
  if (found) {
    found.status = 'approved';
    found.verified = true;
    localStorage.setItem(window.dataStore.storageKey, JSON.stringify(all));
  }

  playCoinChime();
  launchConfetti(0.5, 0.5, 50);
  showToast(`✓ "${katora.creator}" approved!`);
  renderAdminPage();
}

// Admin Action: Request Changes
function adminRequestChangesCurrentKatora() {
  if (!currentAdminReviewKatora) return;

  const reason = prompt('User ko kya badlaav (changes) karne hain likhein:', 'Kripya clear photo lagayein aur story thodi badi karein.');
  if (reason === null) return;

  currentAdminReviewKatora.status = 'changes_requested';
  currentAdminReviewKatora.modNotes = reason;

  const all = window.dataStore.getKatoras();
  const found = all.find(k => k.id === currentAdminReviewKatora.id);
  if (found) {
    found.status = 'changes_requested';
    localStorage.setItem(window.dataStore.storageKey, JSON.stringify(all));
  }

  adminAuditLogs.unshift({
    time: 'Just now',
    action: `Requested Changes: "${reason.substring(0, 30)}..."`,
    admin: 'Admin Sahab',
    id: currentAdminReviewKatora.id
  });

  showToast(`✏️ User ko changes ke liye notify kar diya gaya!`);
  closeAdminReviewModal();
  renderAdminPage();
}

// Admin Action: Reject
function adminRejectCurrentKatora() {
  if (!currentAdminReviewKatora) return;

  const reason = prompt('Katora reject karne ka kaaran likhein:', 'Spam / Inappropriate Content');
  if (reason === null) return;

  currentAdminReviewKatora.status = 'rejected';
  currentAdminReviewKatora.modNotes = reason;

  const all = window.dataStore.getKatoras();
  const found = all.find(k => k.id === currentAdminReviewKatora.id);
  if (found) {
    found.status = 'rejected';
    localStorage.setItem(window.dataStore.storageKey, JSON.stringify(all));
  }

  adminAuditLogs.unshift({
    time: 'Just now',
    action: `Rejected Katora: "${reason}"`,
    admin: 'Admin Sahab',
    id: currentAdminReviewKatora.id
  });

  showToast(`🚫 Katora reject kar diya gaya.`);
  closeAdminReviewModal();
  renderAdminPage();
}

// Add Private Internal Note
function addAdminInternalNote() {
  const input = document.getElementById('adminNoteInput');
  const text = input ? input.value.trim() : '';
  if (!text) return;

  const list = document.getElementById('adminNotesHistoryList');
  if (list) {
    const item = document.createElement('div');
    item.style.cssText = 'padding: 0.5rem 0.75rem; background: var(--bg-surface); border-radius: 8px; font-size: 0.8rem; border: 1px solid var(--border-subtle);';
    item.innerHTML = `<strong>Admin Sahab:</strong> ${text} <small style="color: var(--text-muted); float: right;">Just now</small>`;
    list.prepend(item);
  }

  if (input) input.value = '';
  showToast('📝 नोट सुरक्षित किया गया!');
}

// Render Audit Logs
function renderAdminAuditLogs() {
  const container = document.getElementById('adminAuditLogsFeed');
  if (!container) return;

  container.innerHTML = adminAuditLogs.map(log => `
    <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.65rem 0.85rem; background: var(--bg-elevated); border-radius: 10px; font-family: var(--font-mono); font-size: 0.82rem;">
      <div>
        <span style="color: var(--primary-light); font-weight: 700;">[${log.time}]</span>
        <span style="color: var(--text-primary); margin-left: 0.5rem;">${log.action}</span>
      </div>
      <span style="color: var(--text-muted); font-size: 0.75rem;">by ${log.admin}</span>
    </div>
  `).join('');
}

// Selection Checkbox Handler
function toggleAdminRowSelect(id, checkbox) {
  if (checkbox.checked) {
    adminSelectedKatoraIds.add(id);
  } else {
    adminSelectedKatoraIds.delete(id);
  }
}

function toggleAdminSelectAll(masterCheckbox) {
  const rows = document.querySelectorAll('#adminQueueTableBody tr');
  rows.forEach(r => {
    const id = r.getAttribute('data-id');
    const cb = r.querySelector('input[type="checkbox"]');
    if (cb && id) {
      cb.checked = masterCheckbox.checked;
      if (masterCheckbox.checked) adminSelectedKatoraIds.add(id);
      else adminSelectedKatoraIds.delete(id);
    }
  });
}

function adminBulkApproveSelected() {
  if (adminSelectedKatoraIds.size === 0) {
    showToast('कृपया पहले कटोरे सिलेक्ट करें!', 'error');
    return;
  }
  adminSelectedKatoraIds.forEach(id => {
    const found = window.dataStore?.getKatoraById(id);
    if (found) {
      found.status = 'approved';
      found.verified = true;
    }
  });
  playCoinChime();
  launchConfetti(0.5, 0.45, 60);
  showToast(`✅ ${adminSelectedKatoraIds.size} Katoras Bulk Approved!`);
  adminSelectedKatoraIds.clear();
  renderAdminPage();
}

// Filter Control Handlers
function filterAdminQueueStatus(status, btn) {
  adminCurrentFilter.status = status;
  document.querySelectorAll('.admin-status-tab-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderAdminPage();
}

function handleAdminSearchInput(e) {
  adminCurrentFilter.search = e.target.value.trim();
  renderAdminPage();
}

function clearAdminFilters() {
  adminCurrentFilter = { search: '', status: 'all', payment: 'all', priority: 'all', sort: 'newest' };
  const sInput = document.getElementById('adminSearchInput');
  if (sInput) sInput.value = '';
  document.querySelectorAll('.admin-status-tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('adminTabAll')?.classList.add('active');
  renderAdminPage();
}

// Keyboard Hotkeys
document.addEventListener('keydown', (e) => {
  const modal = document.getElementById('adminReviewModalOverlay');
  if (!modal || !modal.classList.contains('active')) return;

  if (e.key === 'Escape') {
    closeAdminReviewModal();
  } else if (e.key.toLowerCase() === 'a' && !e.target.matches('input, textarea')) {
    adminApproveCurrentKatora();
  } else if (e.key.toLowerCase() === 'c' && !e.target.matches('input, textarea')) {
    adminRequestChangesCurrentKatora();
  } else if (e.key.toLowerCase() === 'r' && !e.target.matches('input, textarea')) {
    adminRejectCurrentKatora();
  }
});

function toggleAdminSidebar() {
  const sidebar = document.getElementById('adminSidebar');
  if (sidebar) sidebar.classList.toggle('collapsed');
}

function toggleAdminNotifications() {
  const box = document.getElementById('adminNotificationBox');
  if (box) box.classList.toggle('active');
}
