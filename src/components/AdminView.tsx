import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Activity, 
  CreditCard,
  TrendingUp,
  BarChart,
  Eye,
  Rocket
} from 'lucide-react';
import { collection, query, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase';

interface AdminViewProps {
  language: 'en' | 'ar';
}

export default function AdminView({ language }: AdminViewProps) {
  const isRtl = language === 'ar';
  
  const [stats, setStats] = useState({
    totalUsers: 0,
    premiumUsers: 0,
    totalGenerations: 0,
    totalProjects: 0,
    totalViews: 0,
    revenue: 0 // Estimated
  });
  
  const [loading, setLoading] = useState(true);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);

  useEffect(() => {
    fetchRealStats();
  }, []);

  const fetchRealStats = async () => {
    try {
      setLoading(true);
      // Fetch users
      const usersSnap = await getDocs(collection(db, 'users'));
      let tUsers = 0;
      let pUsers = 0;
      let gens = 0;
      const recent: any[] = [];
      
      usersSnap.forEach(doc => {
        tUsers++;
        const d = doc.data();
        if (d.isPremium) pUsers++;
        const uStats = d.usageStats || {};
        gens += (uStats.appsGenerated || 0) + (uStats.imagesGenerated || 0) + (uStats.videosGenerated || 0);
        
        recent.push({
          id: doc.id,
          name: d.name || 'Unknown',
          email: d.email || 'No email',
          joined: d.joinedDate || new Date().toISOString(),
          isPremium: d.isPremium || false
        });
      });
      
      // Sort recent users
      recent.sort((a, b) => new Date(b.joined).getTime() - new Date(a.joined).getTime());

      // Fetch projects
      const projSnap = await getDocs(collection(db, 'marketplace'));
      let tProj = 0;
      let tViews = 0;
      projSnap.forEach(doc => {
        tProj++;
        tViews += (doc.data().views || 0);
      });

      setStats({
        totalUsers: tUsers,
        premiumUsers: pUsers,
        totalGenerations: gens,
        totalProjects: tProj,
        totalViews: tViews,
        revenue: pUsers * 70 // 70 is the pro plan cost
      });
      
      setRecentUsers(recent.slice(0, 10));

    } catch (e) {
      console.error("Failed to load admin stats", e);
    } finally {
      setLoading(false);
    }
  };

  const dashboardCards = [
    { title: isRtl ? 'إجمالي المستخدمين' : 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
    { title: isRtl ? 'المشتركين المميزين' : 'Active Subscribers', value: stats.premiumUsers, icon: CreditCard, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { title: isRtl ? 'إجمالي التوليد (GPT)' : 'Total Generations', value: stats.totalGenerations, icon: Activity, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { title: isRtl ? 'أرباح المنصة (تقديري)' : 'Est. Revenue', value: '$' + stats.revenue, icon: TrendingUp, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { title: isRtl ? 'المشاريع المنشورة' : 'Published Projects', value: stats.totalProjects, icon: Rocket, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    { title: isRtl ? 'مشاهدات المشاريع' : 'Project Views', value: stats.totalViews, icon: Eye, color: 'text-pink-400', bg: 'bg-pink-500/10' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <div className="flex items-center justify-between border-b border-neutral-900 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">
            {isRtl ? 'لوحة تحكم الإدارة' : 'Admin Dashboard'}
          </h1>
          <p className="text-sm text-neutral-400">
            {isRtl ? 'إحصائيات المنصة الحية والتحليلات' : 'Live platform metrics and analytics'}
          </p>
        </div>
        <button 
          onClick={fetchRealStats}
          className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 rounded-lg text-sm font-medium transition"
        >
          {isRtl ? 'تحديث البيانات' : 'Refresh Data'}
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="bg-neutral-900/40 border border-neutral-800/50 p-6 rounded-2xl h-32 animate-pulse">
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardCards.map((card, idx) => (
            <div key={idx} className="bg-neutral-900/60 border border-neutral-800 p-6 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-500 font-medium mb-1">{card.title}</p>
                <h3 className="text-3xl font-bold text-white">{card.value}</h3>
              </div>
              <div className={`w-12 h-12 rounded-xl ${card.bg} flex items-center justify-center`}>
                <card.icon className={`w-6 h-6 ${card.color}`} />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-10">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-cyan-500" />
          {isRtl ? 'أحدث المستخدمين' : 'Recent Users'}
        </h2>
        
        <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-neutral-400">
              <thead className="bg-neutral-900/80 text-neutral-300 border-b border-neutral-800">
                <tr>
                  <th className="px-6 py-4 font-medium uppercase text-[11px] tracking-wider">{isRtl ? 'المستخدم' : 'User'}</th>
                  <th className="px-6 py-4 font-medium uppercase text-[11px] tracking-wider">{isRtl ? 'البريد الإلكتروني' : 'Email'}</th>
                  <th className="px-6 py-4 font-medium uppercase text-[11px] tracking-wider">{isRtl ? 'تاريخ الانضمام' : 'Joined'}</th>
                  <th className="px-6 py-4 font-medium uppercase text-[11px] tracking-wider">{isRtl ? 'الخطة' : 'Plan'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {recentUsers.map(user => (
                  <tr key={user.id} className="hover:bg-neutral-900/40 transition">
                    <td className="px-6 py-4 text-white font-medium">{user.name}</td>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4">{new Date(user.joined).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      {user.isPremium ? (
                        <span className="px-2 py-1 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-400 text-xs rounded-md">Pro</span>
                      ) : (
                        <span className="px-2 py-1 bg-neutral-800 text-neutral-400 text-xs rounded-md border border-neutral-700">Free</span>
                      )}
                    </td>
                  </tr>
                ))}
                {recentUsers.length === 0 && !loading && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-neutral-500">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
