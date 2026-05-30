import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Heart, 
  Eye, 
  ExternalLink,
  Code,
  Gamepad,
  LayoutTemplate,
  Rocket,
  Trash2,
  TrendingUp,
  Award,
  User,
  Settings2
} from 'lucide-react';
import { collection, query, orderBy, getDocs, where, limit as limitQuery, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';

interface Project {
  id: string;
  title: string;
  description: string;
  creatorId: string;
  creatorName: string;
  type: string;
  url: string;
  thumbnail?: string;
  views: number;
  likes: number;
  createdAt: string;
  category: string;
  featured: boolean;
}

export default function MarketplaceView({ language, userId }: { language: 'en' | 'ar', userId?: string }) {
  const isRtl = language === 'ar';
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: isRtl ? 'الكل' : 'All', icon: LayoutTemplate },
    { id: 'games', label: isRtl ? 'ألعاب' : 'Games', icon: Gamepad },
    { id: 'saas', label: isRtl ? 'تطبيقات SaaS' : 'SaaS Apps', icon: Rocket },
    { id: 'portfolios', label: isRtl ? 'مواقع شخصية' : 'Portfolios', icon: Code },
    { id: 'my_projects', label: isRtl ? 'مشاريعي' : 'My Projects', icon: User },
  ];

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const q = query(
        collection(db, 'marketplace'),
        orderBy('createdAt', 'desc'),
        limitQuery(100)
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(document => ({ id: document.id, ...document.data() } as Project));
      setProjects(data);
    } catch (err) {
      console.error('Failed to fetch marketplace projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter(p => {
    if (activeCategory === 'my_projects') {
      if (p.creatorId !== userId && p.creatorId !== 'user') return false; 
      // note: mock userId 'user' is used during publish when actual userId is missing
    } else if (activeCategory !== 'all' && p.category !== activeCategory) {
      return false;
    }
    
    if (searchQuery && !p.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if(window.confirm('Are you sure you want to take this deployment offline?')) {
      try {
        await deleteDoc(doc(db, 'marketplace', id));
        setProjects(prev => prev.filter(p => p.id !== id));
      } catch(e) {
        console.error("Delete failed:", e);
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 min-h-screen pb-10">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-neutral-900 border border-neutral-800 p-8 sm:p-12 text-center shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-cyan-500/10 z-0"></div>
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/20 blur-[100px] rounded-full z-0 pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-cyan-500/20 blur-[100px] rounded-full z-0 pointer-events-none"></div>
        
        <div className="relative z-10 max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            {isRtl ? 'المتجر العالمي للذكاء الاصطناعي' : 'Quantum App Marketplace'}
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            {isRtl ? 'اكتشف تطبيقات وألعاب مذهلة' : 'Discover amazing AI-generated apps & games'}
          </h1>
          <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
            {isRtl 
              ? 'تصفح العشرات من التطبيقات والمواقع والألعاب الجاهزة التي تم توليدها بواسطة رواد المنصة، جاهزة للتشغيل والاستخدام مباشرة.'
              : 'Browse dozens of community-generated SaaS applications, interactive games, and landing pages.'}
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-4 border-b border-neutral-900 pb-6">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input 
            type="text"
            placeholder={isRtl ? 'ابحث عن التطبيقات...' : 'Search applications...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full bg-neutral-950 border border-neutral-800 rounded-xl py-2.5 px-10 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all ${isRtl ? 'pl-4 pr-10' : ''}`}
          />
        </div>
        
        <div className="flex overflow-x-auto pb-2 sm:pb-0 hide-scrollbar w-full sm:w-auto gap-2">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                activeCategory === cat.id 
                  ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 border border-cyan-500/50 text-cyan-300 shadow-lg shadow-cyan-500/10' 
                  : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              <cat.icon className="w-3.5 h-3.5" />
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="bg-neutral-900/40 rounded-2xl border border-neutral-800/50 p-4 h-[280px] animate-pulse flex flex-col justify-between">
              <div className="w-full h-32 bg-neutral-800/50 rounded-xl mb-4"></div>
              <div className="space-y-3">
                <div className="h-5 w-3/4 bg-neutral-800/50 rounded"></div>
                <div className="h-4 w-1/2 bg-neutral-800/50 rounded"></div>
              </div>
              <div className="h-8 w-full bg-neutral-800/50 rounded-lg mt-4"></div>
            </div>
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="py-20 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-neutral-900 rounded-2xl flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-neutral-600" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">{isRtl ? 'لا يوجد نتائج' : 'No projects found'}</h3>
          <p className="text-sm text-neutral-500 max-w-xs mx-auto">
            {isRtl ? 'حاول استخدام كلمات بحث أخرى أو تغيير التصنيف.' : 'Try adjusting your search or filter criteria to find what you are looking for.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProjects.map((project) => (
            <div key={project.id} className="group bg-neutral-900/60 hover:bg-neutral-900 rounded-2xl border border-neutral-800 hover:border-cyan-500/50 transition-all duration-300 overflow-hidden flex flex-col hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/10">
              
              <div className="relative w-full aspect-[4/3] bg-neutral-950 flex items-center justify-center overflow-hidden">
                {project.thumbnail ? (
                  <img src={project.thumbnail} alt={project.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex flex-col items-center justify-center text-center p-6 border-b border-indigo-500/30">
                    {project.type === 'game' ? <Gamepad className="w-10 h-10 text-indigo-400 mb-2 opacity-50" /> : <LayoutTemplate className="w-10 h-10 text-cyan-400 mb-2 opacity-50" />}
                    <h4 className="text-white font-bold opacity-80 line-clamp-2">{project.title}</h4>
                  </div>
                )}
                {project.featured && (
                  <div className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[9px] font-bold px-2 py-1 rounded-md uppercase tracking-wider flex items-center gap-1 shadow-lg">
                    <Award className="w-3 h-3" />
                    {isRtl ? 'مميز' : 'Featured'}
                  </div>
                )}
              </div>

              <div className="p-4 flex-1 flex flex-col">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-white text-md line-clamp-1 group-hover:text-cyan-400 transition-colors" title={project.title}>
                    {project.title}
                  </h3>
                </div>
                
                <p className="text-xs text-neutral-400 line-clamp-2 mb-4 leading-relaxed flex-1" title={project.description}>
                  {project.description}
                </p>

                <div className="flex items-center gap-2 mb-4">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-[9px] text-white font-bold border border-neutral-700">
                    {project.creatorName.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-[10px] text-neutral-500 font-medium">By {project.creatorName}</span>
                </div>

                <div className="flex items-center justify-between border-t border-neutral-800/80 pt-3 mt-auto">
                  <div className="flex items-center gap-3 text-neutral-500 text-[10px]">
                    <div className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      <span>{project.views.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1 text-pink-500 opacity-80">
                      <Heart className="w-3 h-3 fill-pink-500" />
                      <span>{project.likes.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {(project.creatorId === userId || project.creatorId === 'user') && (
                      <button 
                        onClick={(e) => handleDelete(e, project.id)}
                        className="p-1.5 text-neutral-500 hover:text-red-400 hover:bg-neutral-900 rounded-lg transition"
                        title={isRtl ? 'حذف المشروع' : 'Delete Project'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <a 
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500 text-cyan-400 hover:text-neutral-950 font-bold text-[10px] uppercase rounded-lg transition-colors border border-cyan-500/20"
                    >
                      {isRtl ? 'تشغيل' : 'Launch'}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Sparkles icon replacement if missing from lucide-react import
const Sparkles = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>
  </svg>
);
