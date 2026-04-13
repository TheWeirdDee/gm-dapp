import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { useSearchParams } from 'next/navigation';
import { 
  Search, 
  Users, 
  ArrowLeft, 
  MoreHorizontal, 
  UserCheck, 
  Heart, 
  MessageCircle, 
  Share2, 
  Archive, 
  Plus,
  Compass,
  ChevronDown,
  Filter
} from 'lucide-react';
import Link from 'next/link';
import IdentityAvatar from '@/components/IdentityAvatar';

type Tab = 'followers' | 'following' | 'suggestions';

const FILTERS = [
  { id: 'all', label: 'All', icon: Users },
  { id: 'new', label: 'New Posts', icon: Plus },
  { id: 'likes', label: 'Likes', icon: Heart },
  { id: 'comments', label: 'Comments', icon: MessageCircle },
  { id: 'shares', label: 'Shares', icon: Share2 },
  { id: 'archives', label: 'Archives', icon: Archive },
];

export default function FollowersContent() {
  const { address, followers, following } = useSelector((state: RootState) => state.user);
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<Tab>('followers');
  const [activeFilter, setActiveFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'suggestions' || tabParam === 'followers' || tabParam === 'following') {
      setActiveTab(tabParam as Tab);
    }
  }, [searchParams]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setShowFilters(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Pools are empty until Supabase/Indexer integration
  const displayList: string[] = [];

  const currentFilter = FILTERS.find(f => f.id === activeFilter) || FILTERS[0];

  const filtered = displayList.filter(addr => {
    return addr.toLowerCase().includes(search.toLowerCase());
  });

  const displayCount = activeTab === 'followers' ? followers : activeTab === 'following' ? following : 0;

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard" className="h-10 w-10 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/[0.06] transition-all">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-xl font-black text-white tracking-tight">Network</h1>
          <p className="text-xs text-gray-600 font-mono truncate max-w-[200px]">{address}</p>
        </div>
      </div>

      {/* Main Tabs and Filter */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 flex gap-1 p-1 bg-white/[0.02] border border-white/5 rounded-2xl">
          {([
            { id: 'followers', label: 'Followers', count: followers, icon: Users },
            { id: 'following', label: 'Following', count: following, icon: UserCheck },
            { id: 'suggestions', label: 'Suggestions', count: 0, icon: Compass },
          ] as { id: Tab; label: string; count: number; icon: any }[]).map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setActiveFilter('all'); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-black shadow-sm'
                  : 'text-gray-500 hover:text-white'
              }`}
            >
              <tab.icon className={`h-3.5 w-3.5 ${activeTab === tab.id ? 'text-black' : 'text-gray-600'} hidden sm:block`} />
              {tab.label}
              <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-black ${
                activeTab === tab.id ? 'bg-black/10' : 'bg-white/5'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Filter Dropdown */}
        <div className="relative" ref={filterRef}>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="h-12 w-12 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all shadow-xl"
            title={`Filter by: ${currentFilter.label}`}
          >
            <Filter className={`h-4 w-4 transition-transform ${showFilters ? 'scale-90 opacity-50' : ''}`} />
          </button>

          {showFilters && (
            <div className="absolute top-full right-0 mt-3 w-48 bg-[#0F0F0F] border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="px-4 py-3 border-b border-white/5">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-700">Filter By Interaction</p>
              </div>
              <div className="p-1">
                {FILTERS.map(filter => {
                  const Icon = filter.icon;
                  const isActive = activeFilter === filter.id;
                  return (
                    <button
                      key={filter.id}
                      onClick={() => { setActiveFilter(filter.id); setShowFilters(false); }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[10px] font-bold transition-all ${
                        isActive 
                          ? 'bg-white/10 text-white' 
                          : 'text-gray-500 hover:text-white hover:bg-white/[0.03]'
                      }`}
                    >
                      <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-white' : 'text-gray-700'}`} />
                      {filter.label}
                      {isActive && <div className="ml-auto w-1 h-1 rounded-full bg-[var(--color-accent)] shadow-[0_0_5px_var(--color-accent)]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600" />
        <input
          type="text"
          placeholder="Search by name or address..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-white/[0.02] border border-white/5 rounded-2xl pl-11 pr-4 py-3 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-white/20 transition-all"
        />
      </div>

      {/* Filter Status Badge (if active) */}
      {activeFilter !== 'all' && (
        <div className="flex items-center gap-2 mb-4 animate-in slide-in-from-left-2 fade-in">
           <div className="px-3 py-1 rounded-full bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 flex items-center gap-2">
              <currentFilter.icon className="h-2.5 w-2.5 text-[var(--color-accent)]" />
              <span className="text-[9px] font-black text-[var(--color-accent)] uppercase tracking-widest">
                Filtered: {currentFilter.label}
              </span>
              <button onClick={() => setActiveFilter('all')} className="ml-1 text-[var(--color-accent)] hover:text-white transition-colors">×</button>
           </div>
        </div>
      )}

      {/* List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          // Empty state
          <div className="py-20 flex flex-col items-center gap-5 text-center">
            <div className="h-20 w-20 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center">
              <Users className="h-9 w-9 text-gray-700" />
            </div>
            <div className="space-y-1">
              <p className="text-white font-bold text-base">
                {activeFilter !== 'all' ? `No ${currentFilter.label} found` : activeTab === 'followers' ? 'No followers yet' : 'Not following anyone'}
              </p>
              <p className="text-gray-600 text-sm font-medium">
                {activeFilter !== 'all' 
                  ? 'Try relaxing your interaction filter to see more nodes.'
                  : activeTab === 'followers'
                    ? 'When someone follows you, they\'ll show up here.'
                    : 'Explore the feed and connect with other participants.'}
              </p>
            </div>
          </div>
        ) : (
          filtered.map((addr, i) => (
            <div
              key={addr}
              className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] hover:border-white/10 hover:bg-white/[0.04] transition-all group animate-in fade-in"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <Link href={`/profile/${addr}`} className="shrink-0">
                <IdentityAvatar address={addr} size="md" className="h-12 w-12 !rounded-2xl" />
              </Link>
              <div className="flex-1 min-w-0">
                <Link href={`/profile/${addr}`} className="hover:underline">
                  <p className="text-sm font-bold text-white truncate">{addr.substring(0,10)}...</p>
                </Link>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white hover:text-black hover:border-transparent text-xs font-black uppercase tracking-widest text-gray-400 transition-all">
                  <UserCheck className="h-3.5 w-3.5" />
                  Connected
                </button>
                <button className="h-8 w-8 rounded-xl bg-white/[0.03] flex items-center justify-center text-gray-600 hover:text-white transition-colors">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
