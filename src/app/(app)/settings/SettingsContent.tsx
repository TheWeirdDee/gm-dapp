'use client';

import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/store';
import { 
  Settings, Bell, Palette, Globe, Shield, Sliders, 
  ChevronRight, Sun, Moon, Monitor, Check, ExternalLink,
  Zap, Clock, Eye, EyeOff
} from 'lucide-react';
import Link from 'next/link';

type SettingsTab = 'appearance' | 'notifications' | 'privacy' | 'network' | 'advanced';

const SETTINGS_TABS: { id: SettingsTab; label: string; icon: any; desc: string }[] = [
  { id: 'appearance', label: 'Appearance', icon: Palette, desc: 'Themes, fonts, density' },
  { id: 'notifications', label: 'Notifications', icon: Bell, desc: 'Alerts and reminders' },
  { id: 'privacy', label: 'Privacy', icon: Eye, desc: 'Visibility and data' },
  { id: 'network', label: 'Network', icon: Globe, desc: 'RPC, chain settings' },
  { id: 'advanced', label: 'Advanced', icon: Sliders, desc: 'Dev and debug tools' },
];

function ToggleSwitch({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`w-12 h-6 rounded-full transition-all relative shrink-0 ${enabled ? 'bg-white' : 'bg-white/10'}`}
    >
      <div className={`absolute top-1 w-4 h-4 rounded-full transition-all ${enabled ? 'right-1 bg-black' : 'left-1 bg-gray-600'}`} />
    </button>
  );
}

function SettingRow({ 
  label, 
  description, 
  children 
}: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between p-5 bg-white/[0.02] border border-white/5 rounded-2xl group hover:border-white/10 transition-all">
      <div className="flex-1 mr-6">
        <p className="text-sm font-bold text-white">{label}</p>
        {description && <p className="text-xs text-gray-500 font-medium mt-0.5">{description}</p>}
      </div>
      {children}
    </div>
  );
}

export default function SettingsContent() {
  const { address, isConnected } = useSelector((state: RootState) => state.user);
  const [activeTab, setActiveTab] = useState<SettingsTab>('appearance');
  const [theme, setTheme] = useState<'dark' | 'system'>('dark');
  const [density, setDensity] = useState<'comfortable' | 'compact'>('comfortable');

  const [notifs, setNotifs] = useState({
    dailyGm: true, streakAlerts: true, follows: false, mentions: true, proDrops: true,
  });
  const [privacy, setPrivacy] = useState({
    publicProfile: true, showStreak: true, showReputation: true, allowFollow: true,
  });
  const [advanced, setAdvanced] = useState({
    simulationMode: false, debugConsole: false, betaFeatures: false,
  });

  if (!isConnected) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6 text-center">
        <div className="bg-[#0A0A0A] border border-white/5 max-w-md w-full rounded-[3rem] p-12 space-y-6">
          <div className="h-16 w-16 rounded-full bg-white/[0.03] border border-white/5 flex items-center justify-center mx-auto">
            <Settings className="h-7 w-7 text-gray-700" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-black text-white tracking-tighter">Settings</h1>
            <p className="text-gray-500 text-sm font-medium">Connect your wallet to manage your protocol settings.</p>
          </div>
          <Link href="/" className="inline-block bg-white text-black font-black py-3 px-10 rounded-2xl hover:bg-gray-200 transition-all text-sm uppercase tracking-widest">
            Connect Wallet
          </Link>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'appearance':
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-700">
            <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-8">
              <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-6">Theme</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { id: 'dark', label: 'Shadow Matte', icon: Moon, desc: 'Deep black, premium feel' },
                  { id: 'system', label: 'System Default', icon: Monitor, desc: 'Match your OS preference' },
                ].map((opt) => {
                  const Icon = opt.icon;
                  const isActive = theme === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setTheme(opt.id as any)}
                      className={`p-5 rounded-2xl border text-left transition-all ${
                        isActive ? 'border-white/20 bg-white/5 ring-1 ring-white/10' : 'border-white/5 bg-white/[0.02] hover:border-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-gray-600'}`} />
                        <span className={`text-xs font-black uppercase tracking-widest ${isActive ? 'text-white' : 'text-gray-500'}`}>{opt.label}</span>
                        {isActive && <Check className="h-3 w-3 text-white ml-auto" />}
                      </div>
                      <p className="text-[10px] text-gray-600 font-medium">{opt.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-8">
              <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-6">Layout Density</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { id: 'comfortable', label: 'Comfortable', desc: 'More breathing room' },
                  { id: 'compact', label: 'Compact', desc: 'Fit more content' },
                ].map((opt) => {
                  const isActive = density === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setDensity(opt.id as any)}
                      className={`p-5 rounded-2xl border text-left transition-all ${
                        isActive ? 'border-white/20 bg-white/5 ring-1 ring-white/10' : 'border-white/5 bg-white/[0.02] hover:border-white/10'
                      }`}
                    >
                      <p className={`text-xs font-black uppercase tracking-widest mb-1 ${isActive ? 'text-white' : 'text-gray-500'}`}>{opt.label}</p>
                      <p className="text-[10px] text-gray-600 font-medium">{opt.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-700">
            <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 space-y-4">
              <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-6">Alert Preferences</h3>
              {[
                { key: 'dailyGm', label: 'Daily GM Window', desc: 'Notify me when my GM window opens each day' },
                { key: 'streakAlerts', label: 'Streak Alerts', desc: 'Warn me before my streak is at risk of breaking' },
                { key: 'follows', label: 'New Followers', desc: 'Alert when someone connects to my address' },
                { key: 'mentions', label: 'On-Chain Mentions', desc: 'Notify when my address appears in protocol events' },
                { key: 'proDrops', label: 'Pro & Rewards', desc: 'Early notice on drops, multiplier boosts, and upgrades' },
              ].map(({ key, label, desc }) => (
                <SettingRow key={key} label={label} description={desc}>
                  <ToggleSwitch
                    enabled={notifs[key as keyof typeof notifs]}
                    onToggle={() => setNotifs(n => ({ ...n, [key]: !n[key as keyof typeof notifs] }))}
                  />
                </SettingRow>
              ))}
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-700">
            <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 space-y-4">
              <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-6">Profile Visibility</h3>
              {[
                { key: 'publicProfile', label: 'Public Profile', desc: 'Others can view your on-chain identity page' },
                { key: 'showStreak', label: 'Show Streak Count', desc: 'Display your daily streak on your public profile' },
                { key: 'showReputation', label: 'Show Reputation', desc: 'Display your RP score to other participants' },
                { key: 'allowFollow', label: 'Allow Connections', desc: 'Let others follow your on-chain address' },
              ].map(({ key, label, desc }) => (
                <SettingRow key={key} label={label} description={desc}>
                  <ToggleSwitch
                    enabled={privacy[key as keyof typeof privacy]}
                    onToggle={() => setPrivacy(p => ({ ...p, [key]: !p[key as keyof typeof privacy] }))}
                  />
                </SettingRow>
              ))}
            </div>

            <div className="bg-amber-500/5 border border-amber-500/10 rounded-3xl p-6">
              <div className="flex items-start gap-4">
                <Shield className="h-5 w-5 text-amber-500/60 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-amber-400/80 mb-1 uppercase tracking-widest">Blockchain Notice</p>
                  <p className="text-xs text-amber-900/60 font-medium leading-relaxed">
                    Gm protocol data is permanently stored on the Stacks blockchain. Visibility settings only affect how this dApp presents your data — they do not remove on-chain records.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'network':
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-700">
            <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 space-y-6">
              <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-2">Network Configuration</h3>
              <p className="text-[10px] text-gray-600 font-medium mb-6">The contract address is the same for all users — it's the shared protocol deployer, not your personal wallet.</p>
              
              <SettingRow label="Active Network" description="The Stacks chain this dApp interacts with">
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                  <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Testnet</span>
                </div>
              </SettingRow>

              <SettingRow label="RPC Endpoint" description="API node used for blockchain calls">
                <div className="text-[10px] font-mono text-gray-600 text-right max-w-[200px] truncate">
                  stacks-node-api.testnet.stacks.co
                </div>
              </SettingRow>

              <SettingRow 
                label="Protocol Contract" 
                description="Shared contract deployed by the Gm protocol — same for all users"
              >
                <a
                  href="https://explorer.hiro.so/address/ST1MQE0HMB765Z9EVF0CM6SPMMKW4VPDDSVRTT2RF?chain=testnet"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-[10px] font-black text-gray-500 hover:text-white transition-colors uppercase tracking-widest whitespace-nowrap"
                >
                  View Contract
                  <ExternalLink className="h-3 w-3" />
                </a>
              </SettingRow>

              <SettingRow 
                label="Your On-Chain Profile" 
                description="Your personal wallet address on the Stacks testnet explorer"
              >
                <a
                  href={`https://explorer.hiro.so/address/${address}?chain=testnet`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-[10px] font-black text-[var(--color-accent)] hover:opacity-80 transition-opacity uppercase tracking-widest whitespace-nowrap"
                >
                  View Profile
                  <ExternalLink className="h-3 w-3" />
                </a>
              </SettingRow>

              <SettingRow label="Block Sync Strategy" description="How the app fetches current block height">
                <div className="text-[10px] font-bold text-gray-600 text-right">
                  Contract → API → Time Estimate
                </div>
              </SettingRow>
            </div>
          </div>
        );

      case 'advanced':
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-700">
            <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 space-y-4">
              <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-2">Developer Tools</h3>
              <p className="text-xs text-gray-600 font-medium mb-6">⚠️ These options are intended for testing only. Disable before production use.</p>

              {[
                { key: 'simulationMode', label: 'Simulation Mode', desc: 'Bypass blockchain reads — use local mock state only' },
                { key: 'debugConsole', label: 'Debug Console Logs', desc: 'Print verbose Redux and sync logs to the browser console' },
                { key: 'betaFeatures', label: 'Beta Features', desc: 'Opt in to unreleased experimental functionality' },
              ].map(({ key, label, desc }) => (
                <SettingRow key={key} label={label} description={desc}>
                  <ToggleSwitch
                    enabled={advanced[key as keyof typeof advanced]}
                    onToggle={() => setAdvanced(a => ({ ...a, [key]: !a[key as keyof typeof advanced] }))}
                  />
                </SettingRow>
              ))}
            </div>

            <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 space-y-4">
              <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-6">Session Tools</h3>
              <SettingRow label="Clear Local Cache" description="Wipe all locally stored streak and simulation data">
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/5 border border-red-500/10 text-[10px] font-black uppercase tracking-widest text-red-900/60 hover:text-red-500 hover:border-red-500/30 transition-all">
                  Clear Cache
                </button>
              </SettingRow>
              <SettingRow label="App Version" description="Current dApp build">
                <span className="text-[10px] font-mono text-gray-700">v1.0.0-testnet</span>
              </SettingRow>
            </div>
          </div>
        );
    }
  };

  const activeTabInfo = SETTINGS_TABS.find(t => t.id === activeTab)!;

  return (
    <div className="max-w-[1400px] mx-auto py-10 px-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header */}
      <div className="mb-10 px-4">
        <h1 className="text-2xl font-black text-white tracking-widest uppercase opacity-40">Settings</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Settings Sidebar */}
        <div className="hidden lg:block lg:col-span-3">
          <div className="flex flex-col space-y-1 sticky top-10">
            {SETTINGS_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-start gap-3 px-4 py-3.5 rounded-xl text-left transition-all ${
                    isActive ? 'bg-white/[0.04] ring-1 ring-white/5' : 'hover:bg-white/[0.02]'
                  }`}
                >
                  <Icon className={`h-4 w-4 mt-0.5 shrink-0 ${isActive ? 'text-white' : 'text-gray-600'}`} />
                  <div>
                    <p className={`text-sm font-bold ${isActive ? 'text-white' : 'text-gray-500 hover:text-white'}`}>{tab.label}</p>
                    <p className="text-[10px] text-gray-700">{tab.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile tabs */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide lg:hidden">
          {SETTINGS_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                  isActive ? 'bg-white text-black' : 'bg-white/[0.03] text-gray-500 border border-white/5'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-9">
          <div className="mb-6 hidden lg:block">
            <h2 className="text-xs font-black text-gray-600 uppercase tracking-[0.2em]">{activeTabInfo.label}</h2>
          </div>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
