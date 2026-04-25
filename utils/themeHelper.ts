import React from 'react';
import {
  Activity, BarChart2, Clock, Settings, Calculator, Shield, CheckCircle,
  FileSpreadsheet, ExternalLink, Users, Zap, Wrench, Factory, GraduationCap,
  TrendingUp, AlertTriangle, Layers, ShieldCheck, Package, ArrowRightLeft,
  Banknote, Gauge, Network, Box, Calendar, ClipboardList, Droplets, Target,
  Briefcase as BriefcaseIcon
} from 'lucide-react';

export const IconMap: Record<string, React.ElementType> = {
  Activity, BarChart2, Clock, Settings, Calculator, Shield, CheckCircle,
  FileSpreadsheet, ExternalLink, Users, Zap, Wrench, Factory, GraduationCap,
  TrendingUp, AlertTriangle, Layers, ShieldCheck, Package, ArrowRightLeft,
  Banknote, Gauge, Network, Box, Calendar, ClipboardList, Droplets, Target,
  Briefcase: BriefcaseIcon
};

export const getThemeClasses = (theme?: string, category?: string) => {
  const getTheme = (t: string) => {
    switch(t) {
      case 'cyan': return { icon: 'bg-cyan-100 dark:bg-cyan-900/40 text-cyan-600 dark:text-cyan-400 group-hover:bg-cyan-200 dark:group-hover:bg-cyan-900/60', border: 'hover:border-cyan-500/50', text: 'group-hover:text-cyan-600 dark:group-hover:text-cyan-400' };
      case 'blue': return { icon: 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/60', border: 'hover:border-blue-500/50', text: 'group-hover:text-blue-600 dark:group-hover:text-blue-400' };
      case 'indigo': return { icon: 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-900/60', border: 'hover:border-indigo-500/50', text: 'group-hover:text-indigo-600 dark:group-hover:text-indigo-400' };
      case 'purple': return { icon: 'bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 group-hover:bg-purple-200 dark:group-hover:bg-purple-900/60', border: 'hover:border-purple-500/50', text: 'group-hover:text-purple-600 dark:group-hover:text-purple-400' };
      case 'fuchsia': return { icon: 'bg-fuchsia-100 dark:bg-fuchsia-900/40 text-fuchsia-600 dark:text-fuchsia-400 group-hover:bg-fuchsia-200 dark:group-hover:bg-fuchsia-900/60', border: 'hover:border-fuchsia-500/50', text: 'group-hover:text-fuchsia-600 dark:group-hover:text-fuchsia-400' };
      case 'rose': return { icon: 'bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 group-hover:bg-rose-200 dark:group-hover:bg-rose-900/60', border: 'hover:border-rose-500/50', text: 'group-hover:text-rose-600 dark:group-hover:text-rose-400' };
      case 'orange': return { icon: 'bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 group-hover:bg-orange-200 dark:group-hover:bg-orange-900/60', border: 'hover:border-orange-500/50', text: 'group-hover:text-orange-600 dark:group-hover:text-orange-400' };
      case 'amber': return { icon: 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 group-hover:bg-amber-200 dark:group-hover:bg-amber-900/60', border: 'hover:border-amber-500/50', text: 'group-hover:text-amber-600 dark:group-hover:text-amber-400' };
      case 'emerald': return { icon: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-900/60', border: 'hover:border-emerald-500/50', text: 'group-hover:text-emerald-600 dark:group-hover:text-emerald-400' };
      case 'teal': return { icon: 'bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400 group-hover:bg-teal-200 dark:group-hover:bg-teal-900/60', border: 'hover:border-teal-500/50', text: 'group-hover:text-teal-600 dark:group-hover:text-teal-400' };
      case 'slate': return { icon: 'bg-slate-100 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-slate-800/60', border: 'hover:border-slate-500/50', text: 'group-hover:text-slate-600 dark:group-hover:text-slate-400' };
      default: return null;
    }
  };

  const themeObj = theme ? getTheme(theme) : null;
  if (themeObj) return themeObj;

  // Fallbacks
  if (category === 'Analysis') return getTheme('indigo')!;
  if (category === 'Planning') return getTheme('amber')!;
  return getTheme('cyan')!;
};
