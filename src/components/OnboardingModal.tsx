'use client';

import { useState, useEffect } from 'react';
import { X, ChevronRight, Sparkles, Flame, Shield, Zap, Target, Globe } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../lib/store';

export default function OnboardingModal() {
  const { isConnected, address } = useSelector((state: RootState) => state.user);
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (isConnected && address) {
      const hasOnboarded = localStorage.getItem(`gm_onboarded_${address}`);
      if (!hasOnboarded) {
        setIsOpen(true);
      }
    }
  }, [isConnected, address]);

  const closeOnboarding = () => {
    if (address) {
      localStorage.setItem(`gm_onboarded_${address}`, 'true');
    }
    setIsOpen(false);
  };

  if (!isOpen) return null;

  const steps = [
    {
      title: "The GM Protocol",
      desc: "Welcome to the world's first decentralized social reputation layer on Stacks. Here, your consistency is your currency.",
      icon: <Globe className="h-10 w-10 text-indigo-500" />,
      color: "bg-indigo-500/10"
    },
    {
      title: "The Streak Mechanic",
      desc: "Say 'GM' every 24 hours to build your streak. Higher streaks unlock greater $GM emissions and protocol multipliers.",
      icon: <Flame className="h-10 w-10 text-orange-500" />,
      color: "bg-orange-500/10"
    },
    {
      title: "Reputation (RP)",
      desc: "Earn RP by interacting, tipping authors, and staying active. Your RP determines your voting power in the Governance Hub.",
      icon: <Target className="h-10 w-10 text-blue-500" />,
      color: "bg-blue-500/10"
    },
    {
      title: "Sovereign Identity",
      desc: "Your profile is fully on-chain. Customize your identity in Settings to stand out in the global leaderboard.",
      icon: <Shield className="h-10 w-10 text-green-500" />,
      color: "bg-green-500/10"
    }
  ];

  const currentStep = steps[step - 1];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-500">
      <div className="glass-card max-w-xl w-full p-10 md:p-16 space-y-10 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent"></div>
        
        <button 
          onClick={closeOnboarding}
          className="absolute top-8 right-8 p-2 text-gray-700 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="relative z-10 flex flex-col items-center text-center space-y-8">
           <div className={`p-6 rounded-[2rem] ${currentStep.color} border border-white/5 animate-in zoom-in duration-500`}>
              {currentStep.icon}
           </div>

           <div className="space-y-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                 {steps.map((_, i) => (
                   <div 
                    key={i} 
                    className={`h-1.5 rounded-full transition-all duration-500 ${i + 1 === step ? 'w-8 bg-white' : 'w-2 bg-white/10'}`} 
                   />
                 ))}
              </div>
              <h2 className="text-3xl font-black text-white tracking-tighter">{currentStep.title}</h2>
              <p className="text-gray-500 font-medium leading-relaxed">{currentStep.desc}</p>
           </div>

           <div className="pt-6 w-full">
              <button 
                onClick={() => step < 4 ? setStep(step + 1) : closeOnboarding()}
                className="w-full bg-white text-black font-black py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-gray-100 transition-all active:scale-95 shadow-2xl group/btn"
              >
                {step < 4 ? 'Next Insight' : 'Enter Protocol'}
                <ChevronRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
              </button>
           </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -bottom-20 -left-20 h-64 w-64 bg-indigo-500/10 blur-[100px] rounded-full"></div>
      </div>
    </div>
  );
}
