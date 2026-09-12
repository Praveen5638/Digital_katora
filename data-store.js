/**
 * DIGITAL KATORA — CENTRAL DATA STORE & STATE ENGINE
 * Handles persistent LocalStorage CRUD, real user katoras, live calculations, and real-time state sync.
 */

const SEED_KATORAS = [];

const SEED_USER = {
  name: 'Aapka Naam',
  username: 'desi_beggar_king',
  avatar: '🥣',
  bio: 'Professional micro-tipper & certified digital beggar.',
  upiId: 'merekatora@upi',
  punyaPoints: 0,
  createdKatorasCount: 0,
  donationsMadeCount: 0,
  totalDonated: 0,
  totalReceived: 0,
  unlockedAchievements: []
};

const REALISTIC_BASE_DONORS = [
  {
    name: 'Vikramaditya Singhania',
    baseTotal: 25500,
    baseCount: 42,
    avatar: '👑',
    badge: 'Katora Legend',
    title: '👑 महा-दानी सम्राट'
  },
  {
    name: 'Priya Sundaram',
    baseTotal: 18400,
    baseCount: 31,
    avatar: '💎',
    badge: 'Katora Legend',
    title: '💎 महारानी दानवीर'
  },
  {
    name: 'Rohan Malhotra',
    baseTotal: 14200,
    baseCount: 28,
    avatar: '🚀',
    badge: 'Katora King',
    title: '🏆 पुण्य नायक'
  },
  {
    name: 'Neha Kulkarni',
    baseTotal: 9850,
    baseCount: 19,
    avatar: '🌟',
    badge: 'Katora King',
    title: '🌟 परम दानी'
  },
  {
    name: 'Aditya Vardhan',
    baseTotal: 7600,
    baseCount: 15,
    avatar: '🔥',
    badge: 'Katora King',
    title: '🔥 कर्मा किंग'
  },
  {
    name: 'Ananya Deshmukh',
    baseTotal: 5400,
    baseCount: 12,
    avatar: '💫',
    badge: 'Katora Legend',
    title: '💫 पुण्य शिरोमणि'
  },
  {
    name: 'Harshvardhan Joshi',
    baseTotal: 4150,
    baseCount: 9,
    avatar: '☕',
    badge: 'Maha-Daani',
    title: '☕ चाय स्पॉन्सर प्रो'
  },
  {
    name: 'Pooja Aggarwal',
    baseTotal: 3200,
    baseCount: 7,
    avatar: '🌸',
    badge: 'Maha-Daani',
    title: '🌿 नेक दिल दानी'
  },
  {
    name: 'Kunal Kashyap',
    baseTotal: 2450,
    baseCount: 6,
    avatar: '🎯',
    badge: 'Maha-Daani',
    title: '🎯 कटोरा मित्र'
  },
  {
    name: 'Devendra Patel',
    baseTotal: 1800,
    baseCount: 4,
    avatar: '🤝',
    badge: 'Katora Supporter',
    title: '🤝 हॉस्टल मसीहा'
  },
  {
    name: 'Simran Kaur',
    baseTotal: 1250,
    baseCount: 3,
    avatar: '💖',
    badge: 'Katora Supporter',
    title: '💖 हमदर्द दानी'
  },
  {
    name: 'Aarav Mehta',
    baseTotal: 950,
    baseCount: 2,
    avatar: '🎉',
    badge: 'Katora Friend',
    title: '✨ नया दानी'
  }
];

class DataStore {
  constructor() {
    this.storageKey = 'dk_katoras_data_v4';
    this.userKey = 'dk_user_profile_v3';
    this.globalStatsKey = 'dk_global_stats_v3';
    this.init();
  }

  init() {
    // Clear any previous legacy seed dummy data keys
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
          // Filter out any legacy dummy katoras
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

  // Get all katoras with optional filter, search, sort
  getKatoras({ category = 'all', search = '', sort = 'trending' } = {}) {
    try {
      let raw = localStorage.getItem(this.storageKey);
      let katoras = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(katoras)) katoras = [];

      // Filter out any legacy dummy katoras
      katoras = katoras.filter(k => k && k.id && !['katora-chai-fund', 'katora-rtx-4090', 'katora-breakup-biryani', 'katora-wifi-bill', 'katora-gym-protein', 'katora-startup-idea', 'katora-shadi-shagun', 'katora-bullet-service'].includes(k.id));
      
      // Filter by category
      if (category && category !== 'all') {
        if (category === 'urgent') {
          katoras = katoras.filter(k => k.urgent);
        } else if (category === 'almost-complete') {
          katoras = katoras.filter(k => ((k.currentAmount || 0) / (k.targetAmount || 1)) >= 0.75);
        } else if (category === 'recently-helped') {
          katoras = katoras.filter(k => k.donations && k.donations.length > 0);
        } else {
          katoras = katoras.filter(k => k.category === category);
        }
      }

      // Search keyword (matches Title, Creator name/nickname, Tagline, Story, Category)
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

      // Sort
      if (sort === 'trending') {
        katoras.sort((a, b) => (b.donations ? b.donations.length : 0) - (a.donations ? a.donations.length : 0));
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
      featured: true, // New katoras get featured
      verified: true,
      createdAt: new Date().toISOString(),
      story: data.story || 'Hum bhi gareeb hain, thoda daan yahan bhi gira do!',
      customQr: data.customQr || null,
      donations: []
    };

    katoras.unshift(newKatora);
    localStorage.setItem(this.storageKey, JSON.stringify(katoras));

    // Update user profile
    const user = this.getUserProfile();
    user.createdKatorasCount = (user.createdKatorasCount || 0) + 1;
    this.saveUserProfile(user);

    this.recomputeGlobalStats();
    window.dispatchEvent(new CustomEvent('dk_data_updated', { detail: { action: 'create', katora: newKatora } }));
    return newKatora;
  }

  addDonation(katoraId, { donorName = 'Generous Daanveer', amount = 51, message = 'Punya lo!' } = {}) {
    const katoras = this.getKatoras();
    const katora = katoras.find(k => k.id === katoraId);
    
    if (!katora) return null;

    const parsedAmount = parseInt(amount) || 51;
    const newDonation = {
      id: 'd-' + Date.now(),
      donorName: donorName.trim() || 'Anonymous Daanveer',
      amount: parsedAmount,
      message: message.trim() || 'Khush raho beta!',
      timestamp: new Date().toISOString()
    };

    katora.currentAmount = (katora.currentAmount || 0) + parsedAmount;
    if (!katora.donations) katora.donations = [];
    katora.donations.unshift(newDonation);

    localStorage.setItem(this.storageKey, JSON.stringify(katoras));

    // Update User Stats
    const user = this.getUserProfile();
    user.donationsMadeCount = (user.donationsMadeCount || 0) + 1;
    user.totalDonated = (user.totalDonated || 0) + parsedAmount;
    user.punyaPoints = (user.punyaPoints || 0) + Math.floor(parsedAmount * 1.5);
    this.saveUserProfile(user);

    this.recomputeGlobalStats();
    window.dispatchEvent(new CustomEvent('dk_donation_added', { detail: { katoraId, donation: newDonation, katora } }));
    return { katora, donation: newDonation };
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
    let totalDonors = 0;

    katoras.forEach(k => {
      totalCollected += (k.currentAmount || 0);
      totalDonors += (k.donations ? k.donations.length : 0);
    });

    const stats = {
      totalCollected: totalCollected,
      totalDonors: totalDonors,
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

  getLeaderboard(timeframe = 'all') {
    const katoras = this.getKatoras();
    
    // Top Beggars from real katoras
    const topBeggars = [...katoras]
      .sort((a, b) => (b.currentAmount || 0) - (a.currentAmount || 0))
      .slice(0, 10);

    const multipliers = {
      'today': { total: 0.18, count: 0.25 },
      'week': { total: 0.45, count: 0.5 },
      'month': { total: 0.8, count: 0.8 },
      'all': { total: 1.0, count: 1.0 }
    };

    const mult = multipliers[timeframe] || multipliers['all'];

    // Map base realistic donors
    const donorMap = {};
    REALISTIC_BASE_DONORS.forEach(donor => {
      const scaledTotal = Math.round((donor.baseTotal * mult.total) / 10) * 10;
      const scaledCount = Math.max(1, Math.round(donor.baseCount * mult.count));
      donorMap[donor.name.toLowerCase()] = {
        name: donor.name,
        total: scaledTotal,
        count: scaledCount,
        avatar: donor.avatar,
        badge: donor.badge,
        title: donor.title
      };
    });

    // Dynamic aggregated donor map from live donations in localStorage
    katoras.forEach(k => {
      if (k.donations && Array.isArray(k.donations)) {
        k.donations.forEach(d => {
          const donorName = (d.donorName || 'Anonymous Daanveer').trim();
          const key = donorName.toLowerCase();
          const amt = parseInt(d.amount) || 0;

          if (donorMap[key]) {
            donorMap[key].total += amt;
            donorMap[key].count += 1;
          } else {
            donorMap[key] = {
              name: donorName,
              total: amt,
              count: 1,
              avatar: '😎',
              badge: amt >= 5000 ? 'Katora Legend' : (amt >= 1000 ? 'Katora King' : (amt >= 500 ? 'Maha-Daani' : 'Katora Friend')),
              title: amt >= 1000 ? '👑 महा-दानी' : '✨ दानी'
            };
          }
        });
      }
    });

    const donorList = Object.values(donorMap).map(d => ({
      ...d,
      punya: d.total * 2
    }));

    donorList.sort((a, b) => b.total - a.total);

    return { topBeggars, topDonors: donorList };
  }
}

// Global Singleton
window.dataStore = new DataStore();
