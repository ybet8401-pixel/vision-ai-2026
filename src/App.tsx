import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Menu, 
  X, 
  Cpu, 
  User, 
  BookOpen, 
  Unlock, 
  Mail, 
  Lock, 
  LogIn,
  Rocket
} from 'lucide-react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import NotificationsPanel from './components/NotificationsPanel';
import LandingPage from './components/LandingPage';
import DashboardView from './components/DashboardView';
import AIChatView from './components/AIChatView';
import AIImageView from './components/AIImageView';
import AIVideoView from './components/AIVideoView';
import AIVoiceView from './components/AIVoiceView';
import AICodeView from './components/AICodeView';
import AIWebsiteView from './components/AIWebsiteView';
import ProfileView from './components/ProfileView';
import SettingsView from './components/SettingsView';
import PricingView from './components/PricingView';
import AdminView from './components/AdminView';
import HistoryView from './components/HistoryView';
import AdBanner from './components/AdBanner';
import MandatoryAdModal from './components/ads/MandatoryAdModal';
import { UserProfile, Generation, AppSettings, Notification, Message } from './types';

// Firebase core integration imports
import { 
  auth, 
  db, 
  googleProvider, 
  handleFirestoreError, 
  OperationType 
} from './firebase';
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  addDoc, 
  deleteDoc, 
  getDocs, 
  onSnapshot 
} from 'firebase/firestore';

export default function App() {
  // Global States
  const [viewState, setViewState] = useState<'landing' | 'auth' | 'app'>('landing');
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // Normal Form login credentials fallback (simulation)
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Config States
  const [settings, setSettings] = useState<AppSettings>({
    language: 'en',
    apiMode: 'live',
    autoRetry: true,
    modelPreference: 'DeepSeek-V3 (Free)',
    soundEffects: false,
    quantumGlow: true
  });

  // User details registry
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Operator Beta',
    email: 'betaouafyassine7@gmail.com',
    tier: 'Quantum Pro',
    credits: 840,
    maxCredits: 1000,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    joinedDate: '2026-05-24',
    streakDays: 5
  });

  // Notifications Array
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 'n1',
      type: 'quantum',
      title: 'Quantum Synapse Calibration',
      message: 'All neural model ports successfully calibrated. Pipeline is live.',
      time: 'Just now',
      read: false
    }
  ]);

  // Saved Manifestations / History Array
  const [generations, setGenerations] = useState<Generation[]>([
    {
      id: 'g1',
      type: 'code',
      title: 'TypeScript Helper API',
      prompt: 'Write clean typescript fetch handler with exponential retry values',
      output: `export async function robustFetch<T>(url: string, retries = 3): Promise<T> {\n  try {\n    const res = await fetch(url);\n    if (!res.ok) throw new Error();\n    return await res.json();\n  } catch (err) {\n    if (retries > 0) return robustFetch(url, retries - 1);\n    throw err;\n  }\n}`,
      date: '2026-05-24',
      modelUsed: 'DeepSeek-V3 (Free)'
    }
  ]);

  // Chat memory synapse
  const [messages, setMessages] = useState<Message[]>([]);

  // Real-time listener registration
  useEffect(() => {
    let unsubGens = () => {};
    let unsubNotifs = () => {};
    let unsubMsgs = () => {};

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setAuthLoading(true);
      
      // Cleanup previous listeners if they exist
      unsubGens();
      unsubNotifs();
      unsubMsgs();

      if (firebaseUser) {
        setUserId(firebaseUser.uid);
        setViewState('app');

        // 1. Sync User Profile document
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        let freshProfile: UserProfile;

        try {
          const userSnap = await getDoc(userDocRef);
          if (userSnap.exists()) {
            freshProfile = userSnap.data() as UserProfile;
            
            // Revert premium status if expired
            if (freshProfile.isPremium && freshProfile.premiumUntil) {
              if (new Date(freshProfile.premiumUntil) < new Date()) {
                freshProfile.isPremium = false;
                freshProfile.tier = 'Free Trial';
                // Fire and forget update
                updateDoc(userDocRef, { isPremium: false, tier: 'Free Trial' }).catch(console.error);
              }
            }
          } else {
            freshProfile = {
              name: firebaseUser.displayName || 'Operator Alpha',
              email: firebaseUser.email || 'operator@omninexa.ai',
              tier: 'Free Trial', // Default to free instead of Pro
              credits: 1000,
              maxCredits: 1000,
              avatar: firebaseUser.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
              joinedDate: new Date().toISOString().split('T')[0],
              streakDays: 1,
              isPremium: false,
              usageStats: { appsGenerated: 0, imagesGenerated: 0, videosGenerated: 0, chatsSent: 0, adsWatched: 0 }
            };
            await setDoc(userDocRef, freshProfile);
          }
          setProfile(freshProfile);
        } catch (err) {
          handleFirestoreError(err, OperationType.GET, `users/${firebaseUser.uid}`);
        }

        // 2. Snaphot listener for Generations
        const gensCol = collection(db, 'users', firebaseUser.uid, 'generations');
        unsubGens = onSnapshot(gensCol, (snapshot) => {
          const tempGens: Generation[] = [];
          snapshot.forEach((docSnap) => {
            tempGens.push({
              ...(docSnap.data() as Omit<Generation, 'id'>),
              id: docSnap.id
            });
          });
          if (tempGens.length > 0) {
            setGenerations(tempGens.sort((a, b) => b.date.localeCompare(a.date)));
          }
        }, (err) => {
          handleFirestoreError(err, OperationType.LIST, `users/${firebaseUser.uid}/generations`);
        });

        // 3. Snapshot listener for Notifications
        const notifsCol = collection(db, 'users', firebaseUser.uid, 'notifications');
        unsubNotifs = onSnapshot(notifsCol, (snapshot) => {
          const tempNotifs: Notification[] = [];
          snapshot.forEach((docSnap) => {
            tempNotifs.push({
              ...(docSnap.data() as Omit<Notification, 'id'>),
              id: docSnap.id
            });
          });
          if (tempNotifs.length > 0) {
            setNotifications(tempNotifs);
          }
        }, (err) => {
          handleFirestoreError(err, OperationType.LIST, `users/${firebaseUser.uid}/notifications`);
        });

        // 4. Snapshot listener for chat Messages (Synapses)
        const msgsCol = collection(db, 'users', firebaseUser.uid, 'messages');
        unsubMsgs = onSnapshot(msgsCol, (snapshot) => {
          const tempMsgs: Message[] = [];
          snapshot.forEach((docSnap) => {
            tempMsgs.push({
              ...(docSnap.data() as Omit<Message, 'id'>),
              id: docSnap.id
            });
          });
          setMessages(tempMsgs.sort((a, b) => a.timestamp.localeCompare(b.timestamp)));
        }, (err) => {
          handleFirestoreError(err, OperationType.LIST, `users/${firebaseUser.uid}/messages`);
        });

        setAuthLoading(false);
      } else {
        setUserId(null);
        setViewState('landing');
        setAuthLoading(false);
      }
    });

    return () => {
      unsubscribe();
      unsubGens();
      unsubNotifs();
      unsubMsgs();
    };
  }, []);

  // --- PAYMENT CAPTURE (PAYPAL) ---
  useEffect(() => {
    const handlePaymentCapture = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const payment = urlParams.get('payment');
      const token = urlParams.get('token');

      if (payment === 'success' && token && userId) {
        // Clear params to prevent re-capturing
        window.history.replaceState({}, document.title, window.location.pathname);
        setAuthLoading(true); // show loader
        
        try {
          // 1. Verify via Backend
          const res = await fetch('/api/payments/capture', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token })
          });
          
          if (!res.ok) throw new Error("Verification failed");
          
          const data = await res.json();
          if (data.success) {
            // 2. Grant Premium in Firestore
            const premiumUntil = new Date();
            premiumUntil.setDate(premiumUntil.getDate() + 7); // 7 days premium
            
            const userRef = doc(db, 'users', userId);
            await updateDoc(userRef, {
              isPremium: true,
              premiumUntil: premiumUntil.toISOString(),
              lastPaymentId: data.transactionId || 'simulated',
              tier: 'Quantum Pro'
            });

            // Local Notification
            setNotifications(prev => [{
              id: Date.now().toString(),
              type: 'info',
              message: 'Payment Confirmed: Quantum Pro Activated! Enjoy unlimited generations without ads.',
              time: new Date().toLocaleTimeString(),
              read: false
            }, ...prev]);
            
          }
        } catch (err) {
          console.error("Payment Capture Failed", err);
          setNotifications(prev => [{
            id: Date.now().toString(),
            type: 'error',
            message: 'Payment verification failed. If you were charged, please contact support.',
            time: new Date().toLocaleTimeString(),
            read: false
          }, ...prev]);
        } finally {
          setAuthLoading(false);
          setViewState('app');
          setCurrentTab('dashboard');
        }
      } else if (payment === 'cancel') {
        window.history.replaceState({}, document.title, window.location.pathname);
        setNotifications(prev => [{
          id: Date.now().toString(),
          type: 'error',
          message: 'Payment was cancelled or interrupted.',
          time: new Date().toLocaleTimeString(),
          read: false
        }, ...prev]);
      }
    };
    
    if (userId) { // Try capture only when auth is established
        handlePaymentCapture();
    }
  }, [userId]);

  // --- USAGE LIMITS & AD MODAL ---
  const [showAdModal, setShowAdModal] = useState(false);
  const [blockedFeature, setBlockedFeature] = useState<'apps'|'images'|'videos'>('apps');

  const checkUsageLimit = async (featureType: 'apps'|'images'|'videos'): Promise<boolean> => {
    if (!profile && userId !== 'sandbox_operator') return true;
    
    // Sandbox default bypass
    if (userId === 'sandbox_operator') return true;

    if (profile?.isPremium) {
      if (profile.premiumUntil && new Date(profile.premiumUntil) > new Date()) {
        return true; 
      }
    }

    const stats = profile?.usageStats || { appsGenerated: 0, imagesGenerated: 0, videosGenerated: 0, chatsSent: 0, adsWatched: 0 };
    
    if (featureType === 'apps' && (stats.appsGenerated || 0) >= 4) {
      setBlockedFeature('apps');
      setShowAdModal(true);
      return false;
    }
    if (featureType === 'images' && (stats.imagesGenerated || 0) >= 2) {
      setBlockedFeature('images');
      setShowAdModal(true);
      return false;
    }
    if (featureType === 'videos' && (stats.videosGenerated || 0) >= 2) {
      setBlockedFeature('videos');
      setShowAdModal(true);
      return false;
    }

    try {
      if (userId && userId !== 'sandbox_operator') {
         const userRef = doc(db, 'users', userId);
         const updatedStats = { ...stats };
         if (featureType === 'apps') updatedStats.appsGenerated = (updatedStats.appsGenerated || 0) + 1;
         if (featureType === 'images') updatedStats.imagesGenerated = (updatedStats.imagesGenerated || 0) + 1;
         if (featureType === 'videos') updatedStats.videosGenerated = (updatedStats.videosGenerated || 0) + 1;
         await updateDoc(userRef, { usageStats: updatedStats });
      }
    } catch (e) {
      console.error("Usage track err", e);
    }
    return true;
  };

  const handleAdComplete = async () => {
    setShowAdModal(false);
    // Reset the blocked limit so they can do N more uses
    if (userId && userId !== 'sandbox_operator' && profile) {
      try {
        const userRef = doc(db, 'users', userId);
        const stats = { ...(profile.usageStats || { appsGenerated: 0, imagesGenerated: 0, videosGenerated: 0, chatsSent: 0, adsWatched: 0 }) };
        
        if (blockedFeature === 'apps') stats.appsGenerated = 0;
        if (blockedFeature === 'images') stats.imagesGenerated = 0;
        if (blockedFeature === 'videos') stats.videosGenerated = 0;
        stats.adsWatched = (stats.adsWatched || 0) + 1;

        await updateDoc(userRef, { usageStats: stats });
      } catch (e) {
        console.error("Ad reset err", e);
      }
    }
  };

  // Sync state mutation: Add a generation to state cleanly
  const addGeneration = async (gen: Omit<Generation, 'id' | 'date'>) => {
    const newGenData = {
      ...gen,
      id: `g_${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    };

    if (!userId || userId === 'sandbox_operator' || userId.startsWith('user_')) {
      // Sandbox fallback
      setGenerations(prev => [newGenData, ...prev]);
      setProfile(prev => ({ ...prev, credits: Math.max(0, prev.credits - 5) }));
      return;
    }

    try {
      const parentUserRef = doc(db, 'users', userId);
      const gensCol = collection(db, 'users', userId, 'generations');
      const notifsCol = collection(db, 'users', userId, 'notifications');

      await addDoc(gensCol, newGenData);

      const newNotifData = {
        id: `n_${Date.now()}`,
        type: 'success',
        title: 'Generation Sync Successful',
        message: `${gen.type.toUpperCase()} recorded into live neural backup.`,
        time: 'Just now',
        read: false
      };
      await addDoc(notifsCol, newNotifData);

      const nextCredits = Math.max(0, profile.credits - 5);
      await updateDoc(parentUserRef, { credits: nextCredits });
      setProfile(prev => ({ ...prev, credits: nextCredits }));

    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `users/${userId}/generations`);
    }
  };

  // Google Authentication Gate
  const handleGoogleSignIn = async () => {
    try {
      setAuthLoading(true);
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error("Google Authenticator Handshake Failed:", err);
    } finally {
      setAuthLoading(false);
    }
  };

  // Chat message Dispatcher - synced seamlessly with Firestore messages collection
  const updateMessages = async (action: React.SetStateAction<Message[]>) => {
    if (!userId || userId === 'sandbox_operator' || userId.startsWith('user_')) {
      if (typeof action === 'function') {
        setMessages(prev => action(prev));
      } else {
        setMessages(action);
      }
      return;
    }

    try {
      let nextMessages: Message[];
      if (typeof action === 'function') {
        nextMessages = action(messages);
      } else {
        nextMessages = action;
      }

      const msgsCol = collection(db, 'users', userId, 'messages');

      // Sync clear chat action
      if (nextMessages.length === 0) {
        setMessages([]);
        const snap = await getDocs(msgsCol);
        for (const docSnap of snap.docs) {
          await deleteDoc(doc(db, 'users', userId, 'messages', docSnap.id));
        }
        return;
      }

      // Sync user or assistant added thoughts
      const latestMsg = nextMessages[nextMessages.length - 1];
      if (latestMsg) {
        const msgDocRef = doc(db, 'users', userId, 'messages', latestMsg.id);
        const docCheck = await getDoc(msgDocRef);
        if (!docCheck.exists()) {
          await setDoc(msgDocRef, {
            id: latestMsg.id,
            role: latestMsg.role,
            content: latestMsg.content,
            timestamp: latestMsg.timestamp,
            ...(latestMsg.model ? { model: latestMsg.model } : {})
          });
        }
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `users/${userId}/messages`);
    }
  };

  // Perform standard fallback sandbox auth handshake
  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail.trim() || !authPassword.trim()) return;

    setUserId(`user_${Date.now()}`);
    setProfile(prev => ({
      ...prev,
      email: authEmail,
      name: authName.trim() || 'Operator Alpha'
    }));

    setViewState('app');

    setNotifications(prev => [
      {
        id: `n_reg_${Date.now()}`,
        type: 'quantum',
        title: 'Operator Authenticated (Simulated)',
        message: `Pipeline synced with local cognitive simulation.`,
        time: 'Just now',
        read: false
      },
      ...prev
    ]);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Logout state change bypassed:", err);
    }
    setUserId(null);
    setViewState('landing');
    setMessages([]);
  };

  // Test server-side API connection health upon booting
  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        console.log("OmniNexa AI Grid operational:", data);
        if (data.mode === 'live') {
          setSettings(prev => ({ ...prev, apiMode: 'live' }));
        } else {
          setSettings(prev => ({ ...prev, apiMode: 'simulation' }));
        }
      })
      .catch(err => {
        console.log("Health check standby:", err);
        setSettings(prev => ({ ...prev, apiMode: 'simulation' }));
      });
  }, []);

  // Set HTML RTL attribute dynamically based on parameters
  useEffect(() => {
    document.documentElement.dir = settings.language === 'ar' ? 'rtl' : 'ltr';
  }, [settings.language]);

  return (
    <div className={`min-h-screen bg-neutral-950 text-white selection:bg-cyan-500/30 selection:text-cyan-200 transition-all ${
      settings.quantumGlow ? 'glow-active' : ''
    }`}>
      
      {/* 1. PUBLIC LANDING PREVIEW */}
      {viewState === 'landing' && (
        <LandingPage 
          onLoginTrigger={() => {
            setIsRegistering(false);
            setViewState('auth');
          }}
          onExploreTrigger={() => {
            setUserId('sandbox_operator');
            setViewState('app');
          }}
          language={settings.language}
        />
      )}

      {/* 2. SECURITY AUTH CONSOLE (LOGIN / REGISTER) */}
      {viewState === 'auth' && (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-neutral-950">
          <div className="absolute top-1/4 left-1/4 w-[40%] h-[40%] rounded-full bg-indigo-900/10 blur-[130px] -z-10" />
          <div className="absolute bottom-1/4 right-1/4 w-[40%] h-[40%] rounded-full bg-cyan-900/10 blur-[130px] -z-10" />

          <div className="max-w-md w-full p-8 rounded-2xl bg-neutral-950/60 border border-neutral-900 backdrop-blur-xl relative z-10 space-y-6">
            <div className="text-center space-y-2">
              <div className="mx-auto w-11 h-11 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 mb-3">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white uppercase font-sans">
                OmniNexa <span className="text-cyan-400">AI</span> Console
              </h2>
              <p className="text-xs text-neutral-500">
                {settings.language === 'ar' 
                  ? 'قم بإرسال بيانات تسجيل الدخول وتوصيل خادم الحوسبة الطرفي.' 
                  : 'Establish a secure tunnel pipeline to direct compute nodes.'}
              </p>
            </div>

            {/* Google Authentication Section */}
            <div className="space-y-3.5">
              <button 
                onClick={handleGoogleSignIn}
                type="button"
                className="w-full py-3 px-4 rounded-xl bg-white text-neutral-900 hover:bg-neutral-100 text-xs sm:text-sm font-bold shadow-lg flex items-center justify-center gap-3 transition duration-300 transform active:scale-95 cursor-pointer border border-neutral-200"
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.62-.62-1.07-1.37-1.35-2.18z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>
                  {settings.language === 'ar' 
                    ? 'تسجيل الدخول بواسطة Google' 
                    : 'Sync with Google Account'}
                </span>
              </button>

              <div className="flex items-center my-4">
                <div className="flex-grow border-t border-neutral-900"></div>
                <span className="px-3 text-[10px] text-neutral-600 uppercase font-mono tracking-wider">
                  {settings.language === 'ar' ? 'أو الأداة المحلية' : 'OR LOCAL FALLBACK'}
                </span>
                <div className="flex-grow border-t border-neutral-900"></div>
              </div>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
              {isRegistering && (
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-neutral-400">
                    {settings.language === 'ar' ? 'اسم المستخدم مجهول الهوية:' : 'Operator Username:'}
                  </label>
                  <div className="flex items-center gap-2 px-3 py-2.5 bg-neutral-950 rounded-xl border border-neutral-850 focus-within:border-cyan-400/70 transition">
                    <User className="w-4 h-4 text-neutral-500" />
                    <input 
                      type="text"
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      placeholder="e.g. Operator Alpha"
                      required
                      className="bg-transparent text-xs sm:text-sm text-white outline-none flex-1 placeholder-neutral-700"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-neutral-400">
                  {settings.language === 'ar' ? 'البريد الإلكتروني للربط:' : 'Operator Email:'}
                </label>
                <div className="flex items-center gap-2 px-3 py-2.5 bg-neutral-950 rounded-xl border border-neutral-850 focus-within:border-cyan-400/70 transition">
                  <Mail className="w-4 h-4 text-neutral-500" />
                  <input 
                    type="email"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="operator@omninexa.ai"
                    required
                    className="bg-transparent text-xs sm:text-sm text-white outline-none flex-1 placeholder-neutral-700"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-neutral-400">
                  {settings.language === 'ar' ? 'كود المرور السري:' : 'Secure Pin Code:'}
                </label>
                <div className="flex items-center gap-2 px-3 py-2.5 bg-neutral-950 rounded-xl border border-neutral-850 focus-within:border-cyan-400/70 transition">
                  <Lock className="w-4 h-4 text-neutral-500" />
                  <input 
                    type="password"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="bg-transparent text-xs sm:text-sm text-white outline-none flex-1 placeholder-neutral-700"
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-neutral-850 to-neutral-800 hover:from-neutral-800 hover:to-neutral-750 text-neutral-300 hover:text-white border border-neutral-800 text-sm font-bold shadow-lg flex items-center justify-center gap-2 transition duration-300 transform active:scale-95 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>
                  {isRegistering 
                    ? (settings.language === 'ar' ? 'تزامن التسجيل المحلي' : 'Sync Local Sandbox') 
                    : (settings.language === 'ar' ? 'بروتوكول محاكاة الهوية' : 'Launch Simulation Mode')}
                </span>
              </button>
            </form>

            <div className="text-center">
              <button 
                onClick={() => setIsRegistering(!isRegistering)}
                className="text-xs text-neutral-400 hover:text-cyan-400 transition"
              >
                {isRegistering 
                  ? (settings.language === 'ar' ? 'بالفعل مسجل؟ الدخول المباشر' : 'Already verified? Execute normal handshake') 
                  : (settings.language === 'ar' ? 'ليس لديك حساب؟ إنشاء محاكاة محلية بسرعة' : 'Awaiting keys? Synchronize new registration')}
              </button>
            </div>
            
            <div className="text-center border-t border-neutral-900 pt-3">
              <button 
                onClick={() => setViewState('landing')}
                className="text-xs text-neutral-500 hover:text-white transition"
              >
                {settings.language === 'ar' ? '← العودة لمنصة الإطلاق' : '← Return to Launchpad'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. LOGGED-IN CONCENTRATE APP VIEW */}
      {viewState === 'app' && (
        <div className="min-h-screen flex">
          
          {/* Floating Glass Sidebar (EN/AR support) */}
          <Sidebar 
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
            userId={userId}
            onLogout={handleLogout}
            language={settings.language}
          />

          {/* Active Workspace Container */}
          <div className={`flex-1 flex flex-col min-w-0 min-h-screen transition-all duration-300 ${
            settings.language === 'ar' ? 'lg:mr-64' : 'lg:ml-64'
          }`}>
            
            {/* Nav Header */}
            <Header 
              sidebarOpen={isSidebarOpen}
              setSidebarOpen={setIsSidebarOpen}
              profile={profile}
              notifications={notifications}
              setNotifications={setNotifications}
              settings={settings}
              setSettings={setSettings}
              currentTab={currentTab}
              onOpenNotifications={() => setIsNotificationsOpen(true)}
            />

            {/* Viewport main slot */}
            <main className="flex-grow p-6 sm:p-8 max-w-7xl w-full mx-auto relative z-10">
              
              {currentTab === 'dashboard' && (
                <DashboardView 
                  profile={profile}
                  generations={generations}
                  setCurrentTab={setCurrentTab}
                  language={settings.language}
                />
              )}

              {currentTab === 'chat' && (
                <AIChatView 
                  messages={messages}
                  setMessages={updateMessages}
                  addGeneration={addGeneration}
                  language={settings.language}
                  checkUsageLimit={() => checkUsageLimit('apps')}
                />
              )}

              {currentTab === 'images' && (
                <AIImageView 
                  addGeneration={addGeneration}
                  language={settings.language}
                  checkUsageLimit={() => checkUsageLimit('images')}
                  isPremium={profile?.isPremium || false}
                />
              )}

              {currentTab === 'video' && (
                <AIVideoView 
                  addGeneration={addGeneration}
                  language={settings.language}
                  checkUsageLimit={() => checkUsageLimit('videos')}
                  isPremium={profile?.isPremium || false}
                />
              )}

              {currentTab === 'voice' && (
                <AIVoiceView 
                  addGeneration={addGeneration}
                  language={settings.language}
                />
              )}

              {currentTab === 'code' && (
                <AICodeView 
                  addGeneration={addGeneration}
                  language={settings.language}
                  checkUsageLimit={() => checkUsageLimit('apps')}
                />
              )}

              {currentTab === 'website' && (
                <AIWebsiteView 
                  addGeneration={addGeneration}
                  language={settings.language}
                  checkUsageLimit={() => checkUsageLimit('apps')}
                />
              )}

              {currentTab === 'profile' && (
                <ProfileView 
                  profile={profile}
                  language={settings.language}
                />
              )}

              {currentTab === 'settings' && (
                <SettingsView 
                  settings={settings}
                  setSettings={setSettings}
                  language={settings.language}
                />
              )}

              {currentTab === 'pricing' && (
                <PricingView 
                  language={settings.language}
                  userId={userId}
                />
              )}

              {currentTab === 'admin' && (
                <AdminView 
                  language={settings.language}
                />
              )}

              {currentTab === 'history' && (
                <HistoryView 
                  generations={generations}
                  setGenerations={setGenerations}
                  language={settings.language}
                />
              )}

              {/* Global Bottom Ad */}
              <div className="mt-8">
                <AdBanner 
                  adSlot="bottom_anchor"
                  isPremium={profile.tier === 'Quantum Pro' || profile.tier === 'Enterprise Cosmic'}
                />
              </div>

            </main>

            {/* Notifications Sidebar Slide panel overlay */}
            <NotificationsPanel 
              isOpen={isNotificationsOpen}
              onClose={() => setIsNotificationsOpen(false)}
              notifications={notifications}
              setNotifications={setNotifications}
              language={settings.language}
            />

          </div>

        </div>
      )}

      {/* Mandatory Ad Modal */}
      <MandatoryAdModal 
        isOpen={showAdModal}
        featureType={blockedFeature}
        onAdComplete={handleAdComplete}
        onUpgradeClick={() => {
          setShowAdModal(false);
          setCurrentTab('pricing');
        }}
      />
      
    </div>
  );
}
