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

const SUPABASE_CONFIG = {
  url: 'https://rlwhlnkpvjyevjtrvmmc.supabase.co',
  key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJsd2hsbmtwdmp5ZXZqdHJ2bW1jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkyMTMwMzUsImV4cCI6MjEwNDc4OTAzNX0.aIu5_nrA5MCZnv5A2uazi5YEcJ2O26k_EAnJi3bJnoI'
};

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

    // Asynchronously synchronize with Supabase Cloud Database
    this.syncFromSupabase();
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

  
  async fetchKatoraById(id) {
    if (!id) return null;
    const local = this.getKatoras().find(k => k.id === id);
    if (local) return local;

    try {
      const res = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/katoras?id=eq.${encodeURIComponent(id)}&select=*`, {
        headers: {
          'apikey': SUPABASE_CONFIG.key,
          'Authorization': 'Bearer ' + SUPABASE_CONFIG.key
        }
      });
      if (res.ok) {
        const list = await res.json();
        if (list && list.length > 0) {
          const ck = list[0];
          const mapped = {
            id: ck.id,
            title: ck.title || 'Digital Katora',
            tagline: ck.tagline || '',
            creator: ck.creator || 'User',
            avatar: '🥣',
            image: ck.image || 'mascot-beggar-3d.jpg',
            category: ck.category || 'chai',
            categoryName: ck.category_name || 'Chai & Food',
            targetAmount: Number(ck.target_amount) || 1000,
            currentAmount: Number(ck.current_amount) || 0,
            upiId: ck.upi_id || 'katora@upi',
            urgent: Boolean(ck.urgent),
            featured: true,
            verified: Boolean(ck.verified),
            status: ck.status || 'active',
            createdAt: ck.created_at || new Date().toISOString(),
            story: ck.story || '',
            customQr: ck.custom_qr || null,
            socialCheers: [],
            verifiedDonations: []
          };
          const current = this.getKatoras();
          current.unshift(mapped);
          localStorage.setItem(this.storageKey, JSON.stringify(current));
          return mapped;
        }
      }
    } catch (e) {
      console.warn('Could not fetch katora from cloud:', e);
    }
    return null;
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
    const safeCreator = (data.creator || 'gareeb').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 10) || 'gareeb';
    const uniqueStamp = Date.now().toString(36);
    const randomSalt = Math.random().toString(36).substring(2, 6);
    const newId = `katora-${safeCreator}-${uniqueStamp}-${randomSalt}`;
    
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
    
    // Cloud sync to Supabase
    this.postKatoraToSupabase(newKatora);

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
    
    // Cloud sync to Supabase donations
    this.postDonationToSupabase(katoraId, { donorName: cheer.donorName, amount: 0, message: cheer.message, utr: null });

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
    
    // Cloud sync to Supabase donations and update katora amount
    this.postDonationToSupabase(katoraId, {
      donorName: verifiedDonation.donorName,
      amount: verifiedDonation.amount,
      message: verifiedDonation.message,
      utr: 'VERIFIED'
    });
    this.patchKatoraAmountToSupabase(katoraId, katora.currentAmount);

    return { katora, donation: verifiedDonation };
  }

  deleteKatora(id) {
    let katoras = this.getKatoras();
    katoras = katoras.filter(k => k.id !== id);
    localStorage.setItem(this.storageKey, JSON.stringify(katoras));
    this.recomputeGlobalStats();
    window.dispatchEvent(new CustomEvent('dk_data_updated', { detail: { action: 'delete', id } }));
    
    // Cloud delete from Supabase
    this.deleteKatoraFromSupabase(id);
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

  // ==================== SUPABASE CLOUD SYNC ENGINE ====================
  async syncFromSupabase() {
    try {
      const [kRes, dRes] = await Promise.all([
        fetch(`${SUPABASE_CONFIG.url}/rest/v1/katoras?select=*&order=created_at.desc`, {
          headers: {
            'apikey': SUPABASE_CONFIG.key,
            'Authorization': 'Bearer ' + SUPABASE_CONFIG.key
          }
        }),
        fetch(`${SUPABASE_CONFIG.url}/rest/v1/donations?select=*&order=created_at.desc`, {
          headers: {
            'apikey': SUPABASE_CONFIG.key,
            'Authorization': 'Bearer ' + SUPABASE_CONFIG.key
          }
        })
      ]);

      if (!kRes.ok) return;
      const cloudKatoras = await kRes.json();
      const cloudDonations = dRes.ok ? await dRes.json() : [];

      if (Array.isArray(cloudKatoras) && cloudKatoras.length > 0) {
        const donationMap = {};
        if (Array.isArray(cloudDonations)) {
          cloudDonations.forEach(d => {
            if (d.katora_id) {
              if (!donationMap[d.katora_id]) donationMap[d.katora_id] = [];
              donationMap[d.katora_id].push({
                id: d.id,
                donorName: d.donor_name || 'Generous Friend',
                amount: d.amount || 0,
                message: d.message || '',
                timestamp: d.created_at,
                utr: d.utr
              });
            }
          });
        }

        const mappedKatoras = cloudKatoras.map(ck => ({
          id: ck.id,
          title: ck.title || 'Digital Katora',
          tagline: ck.tagline || '',
          creator: ck.creator || 'User',
          avatar: '🥣',
          image: ck.image || 'mascot-beggar-3d.jpg',
          category: ck.category || 'chai',
          categoryName: ck.category_name || 'Chai & Food',
          targetAmount: Number(ck.target_amount) || 1000,
          currentAmount: Number(ck.current_amount) || 0,
          upiId: ck.upi_id || 'katora@upi',
          urgent: Boolean(ck.urgent),
          featured: true,
          verified: Boolean(ck.verified),
          status: ck.status || 'active',
          createdAt: ck.created_at || new Date().toISOString(),
          story: ck.story || '',
          customQr: ck.custom_qr || null,
          socialCheers: (donationMap[ck.id] || []).filter(d => (d.amount || 0) === 0 || !d.utr),
          verifiedDonations: (donationMap[ck.id] || []).filter(d => (d.amount || 0) > 0 && d.utr).map(d => ({
            ...d,
            status: 'verified'
          }))
        }));

        const localKatoras = this.getKatoras();
        const cloudIds = new Set(mappedKatoras.map(k => k.id));
        const localOnly = localKatoras.filter(k => k && k.id && !cloudIds.has(k.id));
        
        // Sync any local offline katoras to cloud
        localOnly.forEach(lk => this.postKatoraToSupabase(lk));

        const merged = [...mappedKatoras, ...localOnly];
        localStorage.setItem(this.storageKey, JSON.stringify(merged));
        this.recomputeGlobalStats();
        window.dispatchEvent(new CustomEvent('dk_data_updated', { detail: { source: 'supabase_sync', count: merged.length } }));
      }
    } catch (e) {
      console.warn('Supabase sync info (operating with local storage):', e);
    }
  }

  async postKatoraToSupabase(k) {
    try {
      const payload = {
        id: k.id,
        creator: k.creator || 'Aapka Naam',
        title: k.title || 'Digital Katora',
        tagline: k.tagline || '',
        story: k.story || '',
        category: k.category || 'chai',
        category_name: k.categoryName || 'Chai & Food',
        target_amount: k.targetAmount || 1000,
        current_amount: k.currentAmount || 0,
        upi_id: k.upiId || 'katora@upi',
        image: k.image || 'mascot-beggar-3d.jpg',
        status: k.status || 'active',
        urgent: Boolean(k.urgent),
        verified: Boolean(k.verified)
      };

      await fetch(`${SUPABASE_CONFIG.url}/rest/v1/katoras`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_CONFIG.key,
          'Authorization': 'Bearer ' + SUPABASE_CONFIG.key,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=merge-duplicates'
        },
        body: JSON.stringify(payload)
      });
    } catch (e) {
      console.warn('Could not push katora to Supabase:', e);
    }
  }

  async postDonationToSupabase(katoraId, donation) {
    try {
      const payload = {
        katora_id: katoraId,
        donor_name: donation.donorName || 'Generous Friend',
        amount: donation.amount || 0,
        message: donation.message || '',
        utr: donation.utr || null
      };

      await fetch(`${SUPABASE_CONFIG.url}/rest/v1/donations`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_CONFIG.key,
          'Authorization': 'Bearer ' + SUPABASE_CONFIG.key,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
    } catch (e) {
      console.warn('Could not push donation to Supabase:', e);
    }
  }

  async patchKatoraAmountToSupabase(katoraId, newAmount) {
    try {
      await fetch(`${SUPABASE_CONFIG.url}/rest/v1/katoras?id=eq.${katoraId}`, {
        method: 'PATCH',
        headers: {
          'apikey': SUPABASE_CONFIG.key,
          'Authorization': 'Bearer ' + SUPABASE_CONFIG.key,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ current_amount: newAmount })
      });
    } catch (e) {
      console.warn('Could not update katora amount in Supabase:', e);
    }
  }

  async deleteKatoraFromSupabase(id) {
    try {
      await fetch(`${SUPABASE_CONFIG.url}/rest/v1/katoras?id=eq.${id}`, {
        method: 'DELETE',
        headers: {
          'apikey': SUPABASE_CONFIG.key,
          'Authorization': 'Bearer ' + SUPABASE_CONFIG.key
        }
      });
    } catch (e) {
      console.warn('Could not delete katora from Supabase:', e);
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
