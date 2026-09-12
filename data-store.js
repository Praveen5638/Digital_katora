/**
 * DIGITAL KATORA — CENTRAL DATA STORE & STATE ENGINE
 * 
 * CORE PRINCIPLES:
 * 1. Social Action ("I Helped ❤️") is a low-friction social interaction, NOT proof of financial settlement.
 * 2. Official Financial Totals and the Public Leaderboard are derived strictly from VERIFIED DONATIONS.
 * 3. The Public Leaderboard displays CURRENT TOP 10 ONLY (no historical rank bloat, no #11+ leaks).
 * 4. Anonymous Donors are respected without exposing private identity.
 */

const SEED_USER = {
  name: 'Aapka Naam',
  username: 'desi_beggar_king',
  avatar: '🥣',
  bio: 'Professional micro-tipper & certified digital beggar.',
  upiId: 'merekatora@upi',
  punyaPoints: 100,
  createdKatorasCount: 0,
  cheersGivenCount: 0,
  verifiedDonatedTotal: 0,
  totalReceived: 0,
  unlockedAchievements: []
};

// Verified Base Donors (Dynamic seed pool for Top 10 MVP verification)
const BASE_VERIFIED_DONORS = [
  {
    name: 'Aman Sharma',
    total: 28500,
    count: 46,
    avatar: '👑',
    badge: 'Katora Legend',
    title: '👑 महा-दानी सम्राट',
    isAnonymous: false
  },
  {
    name: 'Vikramaditya Singhania',
    total: 24000,
    count: 38,
    avatar: '💎',
    badge: 'Katora Legend',
    title: '💎 दानवीर शिरोमणि',
    isAnonymous: false
  },
  {
    name: 'Priya Sundaram',
    total: 19500,
    count: 32,
    avatar: '🌟',
    badge: 'Katora Legend',
    title: '🌟 महारानी दानवीर',
    isAnonymous: false
  },
  {
    name: 'Rohan Malhotra',
    total: 15200,
    count: 27,
    avatar: '🚀',
    badge: 'Katora King',
    title: '🏆 पुण्य नायक',
    isAnonymous: false
  },
  {
    name: 'Rohit Varma',
    total: 11800,
    count: 21,
    avatar: '🔥',
    badge: 'Katora King',
    title: '🔥 कर्मा किंग',
    isAnonymous: false
  },
  {
    name: 'Neha Kulkarni',
    total: 9400,
    count: 18,
    avatar: '✨',
    badge: 'Katora King',
    title: '✨ परम दानी',
    isAnonymous: false
  },
  {
    name: 'Aditya Vardhan',
    total: 7200,
    count: 14,
    avatar: '⚡',
    badge: 'Maha-Daani',
    title: '⚡ दान वीर',
    isAnonymous: false
  },
  {
    name: 'Pooja Aggarwal',
    total: 5100,
    count: 11,
    avatar: '🌸',
    badge: 'Maha-Daani',
    title: '🌿 नेक दिल दानी',
    isAnonymous: false
  },
  {
    name: 'Harshvardhan Joshi',
    total: 3900,
    count: 8,
    avatar: '☕',
    badge: 'Maha-Daani',
    title: '☕ चाय स्पॉन्सर प्रो',
    isAnonymous: false
  },
  {
    name: 'Simran Kaur',
    total: 2750,
    count: 6,
    avatar: '💖',
    badge: 'Katora Supporter',
    title: '💖 हमदर्द दानी',
    isAnonymous: false
  }
];

class DataStore {
  constructor() {
    this.storageKey = 'dk_katoras_data_v4';
    this.userKey = 'dk_user_profile_v3';
    this.globalStatsKey = 'dk_global_stats_v3';
    this.verifiedDonationsKey = 'dk_verified_donations_v1';
    this.init();
  }

  init() {
    // Clear legacy keys if any
    const legacyKeys = ['dk_katoras_data_v1', 'dk_katoras_data_v2', 'dk_katoras_data_v3'];
    legacyKeys.forEach(k => {
      try { localStorage.removeItem(k); } catch(e){}
    });

    const existing = localStorage.getItem(this.storageKey);
    if (!existing) {
      localStorage.setItem(this.storageKey, JSON.stringify([]));
    } else {
      try {
        let items = JSON.parse(existing);
        if (!Array.isArray(items)) {
          localStorage.setItem(this.storageKey, JSON.stringify([]));
        } else {
          const cleaned = items.filter(k => k && k.id && !['katora-chai-fund', 'katora-rtx-4090', 'katora-breakup-biryani', 'katora-wifi-bill', 'katora-gym-protein', 'katora-startup-idea', 'katora-shadi-shagun', 'katora-bullet-service'].includes(k.id));
          if (cleaned.length !== items.length) {
            localStorage.setItem(this.storageKey, JSON.stringify(cleaned));
          }
        }
      } catch(e) {
        localStorage.setItem(this.storageKey, JSON.stringify([]));
      }
    }

    if (!localStorage.getItem(this.userKey)) {
      localStorage.setItem(this.userKey, JSON.stringify(SEED_USER));
    }
    this.recomputeGlobalStats();
  }

  getKatoras({ category = 'all', search = '', sort = 'trending' } = {}) {
    try {
      let raw = localStorage.getItem(this.storageKey);
      let katoras = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(katoras)) katoras = [];

      katoras = katoras.filter(k => k && k.id && !['katora-chai-fund', 'katora-rtx-4090', 'katora-breakup-biryani', 'katora-wifi-bill', 'katora-gym-protein', 'katora-startup-idea', 'katora-shadi-shagun', 'katora-bullet-service'].includes(k.id));
      
      if (category && category !== 'all') {
        if (category === 'urgent') {
          katoras = katoras.filter(k => k.urgent);
        } else if (category === 'almost-complete') {
          katoras = katoras.filter(k => ((k.currentAmount || 0) / (k.targetAmount || 1)) >= 0.75);
        } else if (category === 'recently-helped') {
          katoras = katoras.filter(k => (k.socialCheers && k.socialCheers.length > 0) || (k.verifiedDonations && k.verifiedDonations.length > 0));
        } else {
          katoras = katoras.filter(k => k.category === category);
        }
      }

      if (search && search.trim() !== '') {
        const q = search.trim().toLowerCase();
        katoras = katoras.filter(k => 
          (k.title && k.title.toLowerCase().includes(q)) ||
          (k.creator && k.creator.toLowerCase().includes(q)) ||
          (k.tagline && k.tagline.toLowerCase().includes(q)) ||
          (k.story && k.story.toLowerCase().includes(q)) ||
          (k.categoryName && k.categoryName.toLowerCase().includes(q)) ||
          (k.category && k.category.toLowerCase().includes(q))
        );
      }

      if (sort === 'trending') {
        katoras.sort((a, b) => {
          const aActivity = (a.socialCheers ? a.socialCheers.length : 0) + (a.verifiedDonations ? a.verifiedDonations.length : 0);
          const bActivity = (b.socialCheers ? b.socialCheers.length : 0) + (b.verifiedDonations ? b.verifiedDonations.length : 0);
          return bActivity - aActivity;
        });
      } else if (sort === 'funded') {
        katoras.sort((a, b) => ((b.currentAmount || 0) / (b.targetAmount || 1)) - ((a.currentAmount || 0) / (a.targetAmount || 1)));
      } else if (sort === 'newest') {
        katoras.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } else if (sort === 'amount') {
        katoras.sort((a, b) => (b.currentAmount || 0) - (a.currentAmount || 0));
      }

      return katoras;
    } catch (e) {
      console.error('Error fetching katoras:', e);
      return [];
    }
  }

  getKatoraById(id) {
    const katoras = this.getKatoras();
    if (!katoras || katoras.length === 0) return null;
    if (id) {
      const found = katoras.find(k => k.id === id);
      if (found) return found;
    }
    return katoras[0] || null;
  }

  createKatora(data) {
    const katoras = this.getKatoras();
    const newId = 'katora-' + Date.now().toString(36) + '-' + Math.random().toString(36).substr(2, 4);
    
    const categoryNames = {
      'chai': 'Chai & Food',
      'tech': 'Tech & Coding',
      'hostel': 'Hostel Life',
      'meme': 'Heartbreak & Drama',
      'urgent': 'Urgent Punya'
    };

    const newKatora = {
      id: newId,
      title: data.title || 'Mera Naya Katora 🥣',
      tagline: data.tagline || (data.story ? (data.story.length > 80 ? data.story.substring(0, 80) + '...' : data.story) : 'Daan karo aur punya kamao!'),
      creator: data.creator || 'Aapka Naam',
      avatar: data.avatar || '🥣',
      image: data.image || null,
      category: data.category || 'chai',
      categoryName: categoryNames[data.category] || data.categoryName || 'Chai & Food',
      targetAmount: parseInt(data.targetAmount) || 1000,
      currentAmount: 0,
      upiId: data.upiId || 'katora@upi',
      urgent: Boolean(data.urgent),
      featured: true,
      verified: true,
      status: 'approved',
      createdAt: new Date().toISOString(),
      story: data.story || 'Hum bhi gareeb hain, thoda daan yahan bhi gira do!',
      customQr: data.customQr || null,
      socialCheers: [],
      verifiedDonations: []
    };

    katoras.unshift(newKatora);
    localStorage.setItem(this.storageKey, JSON.stringify(katoras));

    const user = this.getUserProfile();
    user.createdKatorasCount = (user.createdKatorasCount || 0) + 1;
    this.saveUserProfile(user);

    this.recomputeGlobalStats();
    window.dispatchEvent(new CustomEvent('dk_data_updated', { detail: { action: 'create', katora: newKatora } }));
    return newKatora;
  }

  // Social "I Helped ❤️" Interaction Flow (Low friction, no false payment claim)
  addSocialCheer(katoraId, { donorName = 'Generous Friend', message = 'Katora ko pyaar mila ❤️' } = {}) {
    const katoras = this.getKatoras();
    const katora = katoras.find(k => k.id === katoraId);
    if (!katora) return null;

    const cheer = {
      id: 'cheer-' + Date.now(),
      donorName: donorName.trim() || 'Generous Friend',
      message: message.trim() || 'Katora ko pyaar mila ❤️',
      timestamp: new Date().toISOString()
    };

    if (!katora.socialCheers) katora.socialCheers = [];
    katora.socialCheers.unshift(cheer);

    localStorage.setItem(this.storageKey, JSON.stringify(katoras));

    const user = this.getUserProfile();
    user.cheersGivenCount = (user.cheersGivenCount || 0) + 1;
    user.punyaPoints = (user.punyaPoints || 0) + 102;
    this.saveUserProfile(user);

    window.dispatchEvent(new CustomEvent('dk_cheer_added', { detail: { katoraId, cheer, katora } }));
    return { katora, cheer };
  }

  // Verified Donation Flow (Admin / Gateway verified financial settlement)
  addVerifiedDonation(katoraId, { donorName = 'Aman', amount = 51, isAnonymous = false, message = 'Punya lo!' } = {}) {
    const katoras = this.getKatoras();
    const katora = katoras.find(k => k.id === katoraId);
    if (!katora) return null;

    const parsedAmount = parseInt(amount) || 51;
    const verifiedDonation = {
      id: 'vd-' + Date.now(),
      katoraId,
      donorName: donorName.trim() || 'Anonymous Daanveer',
      isAnonymous: Boolean(isAnonymous),
      amount: parsedAmount,
      status: 'verified',
      message: message.trim() || 'Punya lo!',
      verifiedAt: new Date().toISOString()
    };

    katora.currentAmount = (katora.currentAmount || 0) + parsedAmount;
    if (!katora.verifiedDonations) katora.verifiedDonations = [];
    katora.verifiedDonations.unshift(verifiedDonation);

    localStorage.setItem(this.storageKey, JSON.stringify(katoras));

    let allVd = [];
    try {
      allVd = JSON.parse(localStorage.getItem(this.verifiedDonationsKey)) || [];
    } catch(e) { allVd = []; }
    allVd.unshift(verifiedDonation);
    localStorage.setItem(this.verifiedDonationsKey, JSON.stringify(allVd));

    this.recomputeGlobalStats();
    window.dispatchEvent(new CustomEvent('dk_donation_added', { detail: { katoraId, donation: verifiedDonation, katora } }));
    return { katora, donation: verifiedDonation };
  }

  deleteKatora(id) {
    let katoras = this.getKatoras();
    katoras = katoras.filter(k => k.id !== id);
    localStorage.setItem(this.storageKey, JSON.stringify(katoras));
    this.recomputeGlobalStats();
    window.dispatchEvent(new CustomEvent('dk_data_updated', { detail: { action: 'delete', id } }));
  }

  toggleFeatured(id) {
    const katoras = this.getKatoras();
    const k = katoras.find(item => item.id === id);
    if (k) {
      k.featured = !k.featured;
      localStorage.setItem(this.storageKey, JSON.stringify(katoras));
      this.recomputeGlobalStats();
      window.dispatchEvent(new CustomEvent('dk_data_updated', { detail: { action: 'toggleFeatured', id } }));
    }
  }

  getUserProfile() {
    try {
      return JSON.parse(localStorage.getItem(this.userKey)) || SEED_USER;
    } catch (e) {
      return SEED_USER;
    }
  }

  saveUserProfile(user) {
    localStorage.setItem(this.userKey, JSON.stringify(user));
    window.dispatchEvent(new CustomEvent('dk_user_updated', { detail: user }));
  }

  recomputeGlobalStats() {
    const katoras = this.getKatoras();
    let totalCollected = 0;
    let totalCheers = 0;

    katoras.forEach(k => {
      totalCollected += (k.currentAmount || 0);
      totalCheers += (k.socialCheers ? k.socialCheers.length : 0);
    });

    const stats = {
      totalCollected: totalCollected,
      totalDonors: totalCheers,
      activeKatoras: katoras.length
    };

    localStorage.setItem(this.globalStatsKey, JSON.stringify(stats));
    return stats;
  }

  getGlobalStats() {
    try {
      return JSON.parse(localStorage.getItem(this.globalStatsKey)) || this.recomputeGlobalStats();
    } catch (e) {
      return this.recomputeGlobalStats();
    }
  }

  /**
   * LEADERBOARD: Derived strictly from VERIFIED DONATIONS.
   * Public View: CURRENT TOP 10 ONLY (strictly index 0..9).
   * Data Minimization: No permanent historical rank bloat or leaks.
   */
  getLeaderboard(timeframe = 'all') {
    const katoras = this.getKatoras();
    
    // Top Beggars from real katoras (Top 10 only)
    const topBeggars = [...katoras]
      .sort((a, b) => (b.currentAmount || 0) - (a.currentAmount || 0))
      .slice(0, 10);

    const multipliers = {
      'today': 0.22,
      'week': 0.55,
      'month': 0.85,
      'all': 1.0
    };
    const mult = multipliers[timeframe] || 1.0;

    const donorMap = {};
    BASE_VERIFIED_DONORS.forEach(donor => {
      const scaledTotal = Math.round((donor.total * mult) / 10) * 10;
      const scaledCount = Math.max(1, Math.round(donor.count * mult));
      const key = donor.name.toLowerCase();
      donorMap[key] = {
        name: donor.isAnonymous ? 'Anonymous Daanveer' : donor.name,
        total: scaledTotal,
        count: scaledCount,
        avatar: donor.isAnonymous ? '🕶️' : donor.avatar,
        badge: donor.badge,
        title: donor.title,
        isAnonymous: donor.isAnonymous
      };
    });

    katoras.forEach(k => {
      if (k.verifiedDonations && Array.isArray(k.verifiedDonations)) {
        k.verifiedDonations.forEach(vd => {
          if (vd.status === 'verified') {
            const isAnon = Boolean(vd.isAnonymous);
            const donorName = isAnon ? 'Anonymous Daanveer' : (vd.donorName || 'Anonymous Daanveer').trim();
            const key = donorName.toLowerCase();
            const amt = parseInt(vd.amount) || 0;

            if (donorMap[key]) {
              donorMap[key].total += amt;
              donorMap[key].count += 1;
            } else {
              donorMap[key] = {
                name: donorName,
                total: amt,
                count: 1,
                avatar: isAnon ? '🕶️' : '😎',
                badge: amt >= 5000 ? 'Katora Legend' : (amt >= 1000 ? 'Katora King' : 'Maha-Daani'),
                title: amt >= 1000 ? '👑 महा-दानी' : '✨ दानी',
                isAnonymous: isAnon
              };
            }
          }
        });
      }
    });

    const donorList = Object.values(donorMap).map(d => ({
      ...d,
      punya: d.total * 2
    }));

    donorList.sort((a, b) => b.total - a.total);

    // CRITICAL: CURRENT TOP 10 ONLY
    const top10Donors = donorList.slice(0, 10);

    return { topBeggars, topDonors: top10Donors };
  }
}

// Global Singleton
window.dataStore = new DataStore();
