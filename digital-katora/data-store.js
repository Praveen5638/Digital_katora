/**
 * DIGITAL KATORA — CENTRAL DATA STORE & STATE ENGINE
 * Handles persistent LocalStorage CRUD, seed data, live calculations, and real-time state sync.
 */

const SEED_KATORAS = [
  {
    id: 'katora-chai-fund',
    title: 'Tapri Ki Chai & Sutta Debt Repayment ☕',
    tagline: 'Sharma ji ke tapri par ₹340 ka udhaar ho gaya hai, dukan ke aage se nikal nahi pa raha!',
    creator: 'Rahul "Chai-Lover" Sharma',
    avatar: '🧔',
    image: 'mascot-beggar-3d.jpg',
    category: 'chai',
    categoryName: 'Chai & Food',
    targetAmount: 500,
    currentAmount: 391,
    upiId: 'rahul.tapri@okhdfcbank',
    urgent: true,
    featured: true,
    verified: true,
    createdAt: '2025-05-10T10:00:00Z',
    story: 'Doston, tapri wale Sharma uncle ne abhi tak 3 baar notice bhej diya hai WhatsApp par. Agar kal tak ₹340 nahi diye toh chai me paani mila ke denge. Punya kamao, ek student ki chai bachao! 🙏',
    donations: [
      { id: 'd-1', donorName: 'Rohan Gupta', amount: 51, message: 'Uncle ko bolna adrak daal ke pilaye! ☕', timestamp: '2025-05-11T09:12:00Z' },
      { id: 'd-2', donorName: 'Priya Verma', amount: 101, message: 'Study hard, chai slow! 😂', timestamp: '2025-05-11T10:30:00Z' },
      { id: 'd-3', donorName: 'Anonymous Daanveer', amount: 21, message: 'Bhai sutta mat peena!', timestamp: '2025-05-11T11:45:00Z' },
      { id: 'd-4', donorName: 'Hostel Senior', amount: 218, message: 'Udhaar chukao aur padhai karo.', timestamp: '2025-05-11T12:00:00Z' }
    ]
  },
  {
    id: 'katora-rtx-4090',
    title: 'Need RTX 4090 to Run Hello World in Python 💻',
    tagline: 'My laptop catches fire every time I import pandas. Please help my AI dreams!',
    creator: 'Aman "Bug-Hunter" Verma',
    avatar: '👨‍💻',
    category: 'tech',
    categoryName: 'Tech & Coding',
    targetAmount: 180000,
    currentAmount: 42560,
    upiId: 'aman.techie@paytm',
    urgent: false,
    featured: true,
    verified: true,
    createdAt: '2025-05-08T14:20:00Z',
    story: 'My current core i3 laptop takes 15 minutes to compile a basic React app. Fans sound like an airplane takeoff. I swear this RTX 4090 will only be used for Machine Learning and definitely NOT for GTA 6.',
    donations: [
      { id: 'd-5', donorName: 'Tech Bro 99', amount: 501, message: 'Kaggle Grandmaster ban ke aana!', timestamp: '2025-05-09T08:00:00Z' },
      { id: 'd-6', donorName: 'Dev Sharma', amount: 1001, message: 'For the GPU gods! ⚡', timestamp: '2025-05-09T14:15:00Z' },
      { id: 'd-7', donorName: 'Chai & Code', amount: 101, message: 'Buy cooler master first bro', timestamp: '2025-05-10T16:20:00Z' }
    ]
  },
  {
    id: 'katora-breakup-biryani',
    title: 'Breakup Hui Hai, Emotional Support Biryani Chahiye 🍗',
    tagline: 'Dil toota hai lekin bhookh nahi mari. Double masala leg piece will heal my soul.',
    creator: 'Kabir "Devdas" Singh',
    avatar: '💔',
    category: 'meme',
    categoryName: 'Heartbreak & Drama',
    targetAmount: 1200,
    currentAmount: 950,
    upiId: 'kabir.biryani@axisbank',
    urgent: true,
    featured: true,
    verified: true,
    createdAt: '2025-05-11T12:00:00Z',
    story: '3 saal ka relation khatam ho gaya ek text message se. Ab bas Hyderabadi Dum Biryani with extra raita hi meri aatma ko shanti de sakti hai. Blessing do dosto.',
    donations: [
      { id: 'd-8', donorName: 'Single Launda Club', amount: 151, message: 'Move on bro, biryani is loyal!', timestamp: '2025-05-11T13:00:00Z' },
      { id: 'd-9', donorName: 'Simran', amount: 250, message: 'Extra raita meri taraf se 😂', timestamp: '2025-05-11T14:20:00Z' },
      { id: 'd-10', donorName: 'Gym Bro', amount: 51, message: 'Kal se gym aaja!', timestamp: '2025-05-11T15:00:00Z' }
    ]
  },
  {
    id: 'katora-wifi-bill',
    title: 'Hostel Room 304 Ka WiFi Bill Khatam Ho Gaya 📶',
    tagline: '5 boys sharing 1.5GB daily mobile hotspot. Mid-sems in 2 days. Save our CGPA!',
    creator: 'Hostel 304 Wing',
    avatar: '🏕️',
    category: 'hostel',
    categoryName: 'Hostel Life',
    targetAmount: 1499,
    currentAmount: 1210,
    upiId: 'hostel304@icici',
    urgent: true,
    featured: false,
    verified: true,
    createdAt: '2025-05-09T18:00:00Z',
    story: 'Optical fiber connection cut ho gaya. YouTube lecture 144p par bhi buffer ho raha hai. WiFi recharge hoga toh hum sab engineer ban payenge.',
    donations: [
      { id: 'd-11', donorName: 'Warden Sir Fan', amount: 101, message: 'Padhai kar lo chup chap', timestamp: '2025-05-10T11:00:00Z' },
      { id: 'd-12', donorName: 'CR of Class', amount: 201, message: 'Notes bhej dena baad me!', timestamp: '2025-05-10T17:30:00Z' }
    ]
  },
  {
    id: 'katora-gym-protein',
    title: 'Biceps 16 Inch Karne Ke Liye Whey Protein Fund 💪',
    tagline: 'Desi diet se 14 inch pe atak gaya hu. Ek dabba Gold Standard dila do!',
    creator: 'Vikram "Bodybuilder" Yadav',
    avatar: '🏋️',
    category: 'urgent',
    categoryName: 'Urgent Punya',
    targetAmount: 6500,
    currentAmount: 3200,
    upiId: 'vikram.gym@sbi',
    urgent: false,
    featured: false,
    verified: true,
    createdAt: '2025-05-05T09:00:00Z',
    story: 'Gym trainer bolta hai "Bhai protein bina gains nahi aayenge". Ghar wale bolte hain "Chana khao". Beech me main phans gaya hu. Katora leke aana pada.',
    donations: [
      { id: 'd-13', donorName: 'Arnold Fanboy', amount: 501, message: 'No pain no gain! 💥', timestamp: '2025-05-06T10:00:00Z' },
      { id: 'd-14', donorName: 'Dietitian Diya', amount: 101, message: 'Eggs are cheaper bro', timestamp: '2025-05-07T14:00:00Z' }
    ]
  },
  {
    id: 'katora-startup-idea',
    title: 'AI Based Golgappa Dispenser Startup Seed Round 🥙',
    tagline: 'Disrupting the street food industry with personalized teekha-paani algorithms.',
    creator: 'Tanmay "VC-Seeker" Joshi',
    avatar: '🚀',
    image: 'mascot-beggar-3d.jpg',
    category: 'tech',
    categoryName: 'Tech & Coding',
    targetAmount: 50000,
    currentAmount: 18450,
    upiId: 'tanmay.pitch@kotak',
    urgent: false,
    featured: false,
    verified: true,
    createdAt: '2025-05-07T11:00:00Z',
    story: 'Why wait for the bhaiya to give meethi chutney when AI can predict your craving from your face scan? Pitch deck ready hai, bas initial katora funding chahiye.',
    donations: [
      { id: 'd-15', donorName: 'Angel Beggar', amount: 1001, message: '0.01% equity chahiye mujhe!', timestamp: '2025-05-08T19:00:00Z' },
      { id: 'd-16', donorName: 'Shark Tank Reject', amount: 501, message: 'Meri taraf se haan hai!', timestamp: '2025-05-09T21:00:00Z' }
    ]
  },
  {
    id: 'katora-shadi-shagun',
    title: 'Best Friend Ki Shaadi Me Shagun Envelope Fund 💌',
    tagline: 'Gareeb dost hu, ₹2100 ka shagun envelope daalna hai taaki izzat bachi rahe!',
    creator: 'Priya "Broke-Guest" Sen',
    avatar: '💌',
    image: 'mascot-donor-3d.png',
    category: 'meme',
    categoryName: 'Heartbreak & Drama',
    targetAmount: 2100,
    currentAmount: 1850,
    upiId: 'priya.shagun@icici',
    urgent: true,
    featured: false,
    verified: true,
    createdAt: '2025-05-11T16:00:00Z',
    story: 'School ke best friend ki shaadi hai. Khana dabake khana hai lekin bina shagun diye gaye toh log taane marenge. Shagun fund me ₹51 daal ke meri izzat bachayein!',
    donations: [
      { id: 'd-17', donorName: 'Barati Gang', amount: 251, message: 'Gulab jamun 4 khana!', timestamp: '2025-05-12T08:30:00Z' },
      { id: 'd-18', donorName: 'Uncle Ji', amount: 501, message: 'Shadi mubarak in advance', timestamp: '2025-05-12T09:15:00Z' }
    ]
  },
  {
    id: 'katora-bullet-service',
    title: 'Royal Enfield Dug-Dug Service & Petrol Fund 🏍️',
    tagline: 'Swag toh pura hai lekin petrol pump wale bhaiya udhaar nahi dete!',
    creator: 'Sunny "Rider" Chawla',
    avatar: '🏍️',
    image: 'mascot-beggar-3d.jpg',
    category: 'chai',
    categoryName: 'Chai & Food',
    targetAmount: 3500,
    currentAmount: 3500,
    upiId: 'sunny.bullet@paytm',
    urgent: false,
    featured: false,
    verified: true,
    createdAt: '2025-05-04T12:00:00Z',
    story: 'Bullet le li shauk me, ab mileage 25 km/l de rahi hai. Ladakh trip chhodkar bas tapri tak jaa pa raha hu. Thoda daan karke dug-dug chalu rakhein!',
    donations: [
      { id: 'd-19', donorName: 'Biker Bro', amount: 500, message: 'Helmet pehno bro!', timestamp: '2025-05-05T14:00:00Z' },
      { id: 'd-20', donorName: 'Petrol Pump Bhaiya', amount: 1000, message: 'Purana hisab clear hua! 😂', timestamp: '2025-05-06T18:00:00Z' }
    ]
  }
];

const SEED_USER = {
  name: 'Aapka Naam',
  username: 'desi_beggar_king',
  avatar: '🥣',
  bio: 'Professional micro-tipper & certified digital beggar.',
  upiId: 'merekatora@upi',
  punyaPoints: 850,
  createdKatorasCount: 2,
  donationsMadeCount: 14,
  totalDonated: 1250,
  totalReceived: 3450,
  unlockedAchievements: ['first-beg', 'first-coin', 'chai-master', 'speed-runner']
};

class DataStore {
  constructor() {
    this.storageKey = 'dk_katoras_data_v3';
    this.userKey = 'dk_user_profile_v2';
    this.globalStatsKey = 'dk_global_stats_v2';
    this.init();
  }

  init() {
    if (!localStorage.getItem(this.storageKey)) {
      localStorage.setItem(this.storageKey, JSON.stringify(SEED_KATORAS));
    }
    if (!localStorage.getItem(this.userKey)) {
      localStorage.setItem(this.userKey, JSON.stringify(SEED_USER));
    }
    if (!localStorage.getItem(this.globalStatsKey)) {
      this.recomputeGlobalStats();
    }
  }

  // Get all katoras with optional filter, search, sort
  getKatoras({ category = 'all', search = '', sort = 'trending' } = {}) {
    try {
      let katoras = JSON.parse(localStorage.getItem(this.storageKey)) || SEED_KATORAS;
      
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
      return SEED_KATORAS;
    }
  }

  getKatoraById(id) {
    const katoras = this.getKatoras();
    return katoras.find(k => k.id === id) || katoras[0];
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
      tagline: data.tagline || (data.story ? data.story.substring(0, 80) : 'Daan karo aur punya kamao!'),
      creator: data.creator || 'Aapka Naam',
      avatar: data.avatar || '🥣',
      category: data.category || 'chai',
      categoryName: categoryNames[data.category] || 'Chai & Food',
      targetAmount: parseInt(data.targetAmount) || 1000,
      currentAmount: 0,
      upiId: data.upiId || 'katora@upi',
      urgent: Boolean(data.urgent),
      featured: false,
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
      totalCollected: totalCollected + 145200,
      totalDonors: totalDonors + 1850,
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
    
    // Top Beggars
    const topBeggars = [...katoras]
      .sort((a, b) => (b.currentAmount || 0) - (a.currentAmount || 0))
      .slice(0, 10);

    // Multipliers or subsets for realistic timeframe changes
    const timeMultipliers = {
      'today': 0.15,
      'week': 0.45,
      'month': 0.75,
      'all': 1.0
    };
    const mult = timeMultipliers[timeframe] || 1.0;

    const baseDonors = [
      { name: 'समीर राव (Samir Rao)', baseTotal: 25001, count: 18, avatar: 'mascot-donor-3d.png', badge: 'Legendary Donor', title: '👑 महा-दानी सम्राट' },
      { name: 'अमन वर्मा (Aman Verma)', baseTotal: 18501, count: 14, avatar: '👨‍💻', badge: 'Katora Legend', title: '💎 महा-दानी' },
      { name: 'विकास सिंह (Vikas Singh)', baseTotal: 12101, count: 9, avatar: '🏋️', badge: 'Katora King', title: '🏆 लेजेंड' },
      { name: 'प्रिया शर्मा (Priya Sharma)', baseTotal: 9501, count: 8, avatar: '💌', badge: 'Katora King', title: '🌟 स्टार दानी' },
      { name: 'रोहित टेकिए (Rohit Techie)', baseTotal: 7201, count: 6, avatar: '💻', badge: 'Maha-Daani', title: '⚡ टेक दानी' },
      { name: 'स्नेहा अय्यर (Sneha Iyer)', baseTotal: 5101, count: 5, avatar: '👩‍🎓', badge: 'Maha-Daani', title: '💖 काइंड सोल' },
      { name: 'मुकेश अंबानी का फैन', baseTotal: 4201, count: 4, avatar: '🤑', badge: 'Katora Supporter', title: '💰 बिग शॉट' },
      { name: 'हॉस्टल का बड़ा भाई', baseTotal: 3101, count: 4, avatar: '🏕️', badge: 'Katora Supporter', title: '🛡️ सीनियर' },
      { name: 'बिरयानी लवर 420', baseTotal: 2101, count: 3, avatar: '🍗', badge: 'Katora Supporter', title: '🍛 फूडी दानी' },
      { name: 'राहुल गुप्ता (Rohan G.)', baseTotal: 1201, count: 2, avatar: '☕', badge: 'Katora Friend', title: '🍵 चाय लवर' }
    ];

    // Dynamic aggregated donor map from live donations in localStorage
    const liveDonationMap = {};
    katoras.forEach(k => {
      if (k.donations) {
        k.donations.forEach(d => {
          const donorName = d.donorName || 'Anonymous Daanveer';
          if (!liveDonationMap[donorName]) {
            liveDonationMap[donorName] = { total: 0, count: 0 };
          }
          liveDonationMap[donorName].total += (d.amount || 0);
          liveDonationMap[donorName].count += 1;
        });
      }
    });

    // Merge base donors with live donation activity
    const donorList = baseDonors.map(d => {
      const live = liveDonationMap[d.name] || { total: 0, count: 0 };
      const calculatedTotal = Math.round((d.baseTotal * mult) + live.total);
      const calculatedCount = Math.max(1, Math.round(d.count * (mult > 0.5 ? 1 : 0.5)) + live.count);
      return {
        ...d,
        total: calculatedTotal,
        count: calculatedCount,
        punya: calculatedTotal * 2
      };
    });

    // Also include any new unique live donors not in base list
    Object.keys(liveDonationMap).forEach(name => {
      if (!donorList.some(d => d.name === name)) {
        const live = liveDonationMap[name];
        donorList.push({
          name: name,
          total: live.total,
          count: live.count,
          punya: live.total * 2,
          avatar: '😎',
          badge: live.total >= 5000 ? 'Katora Legend' : (live.total >= 1000 ? 'Katora King' : (live.total >= 500 ? 'Maha-Daani' : 'Katora Friend')),
          title: '✨ नया दानी'
        });
      }
    });

    donorList.sort((a, b) => b.total - a.total);

    return { topBeggars, topDonors: donorList };
  }
}

// Global Singleton
window.dataStore = new DataStore();
