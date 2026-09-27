import React, { useState } from 'react';
import { 
  Trophy, 
  Flame, 
  TrendingUp, 
  BookOpen, 
  User, 
  Check, 
  Trash2, 
  ArrowLeft, 
  Share2, 
  Award, 
  Sparkles,
  Zap,
  RotateCcw
} from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../../components/SEO';
import { 
  getPlayerProfile, 
  savePlayerProfile, 
  getTermleStats, 
  getGuessBetaStats, 
  getFlashcardStats, 
  getLeaderboard, 
  clearLeaderboard,
  LeaderboardEntry
} from '../../utils/playStorage';
import { trackResultShared } from '../../utils/analytics';

const Leaderboard: React.FC = () => {
  const [profile, setProfile] = useState(() => getPlayerProfile());
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [playerNameInput, setPlayerNameInput] = useState<string>(profile.name);
  const [nameSavedToast, setNameSavedToast] = useState<boolean>(false);

  const [termleStats, setTermleStats] = useState(() => getTermleStats());
  const [betaStats, setBetaStats] = useState(() => getGuessBetaStats());
  const [flashcardStats, setFlashcardStats] = useState(() => getFlashcardStats());
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() => getLeaderboard());

  const [activeTab, setActiveTab] = useState<'all' | 'termle' | 'guess_the_beta' | 'flashcards'>('all');
  const [copiedShare, setCopiedShare] = useState<boolean>(false);

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = savePlayerProfile({ name: playerNameInput.trim() || 'Reliability Engineer' });
    setProfile(updated);
    setIsEditingName(false);
    setNameSavedToast(true);
    setTimeout(() => setNameSavedToast(false), 2000);
  };

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to reset your local play records? This cannot be undone.')) {
      clearLeaderboard();
      setLeaderboard([]);
    }
  };

  const filteredEntries = leaderboard.filter(e => {
    if (activeTab === 'all') return true;
    return e.game === activeTab;
  });

  const overallScore = (termleStats.gamesWon * 500) + betaStats.totalScore + (flashcardStats.totalReviews * 10);

  const shareText = `🏆 Reliability Play Hub Achievements for ${profile.name}:\n` +
    `• Termle Streak: ${termleStats.currentStreak}🔥 (Max ${termleStats.maxStreak})\n` +
    `• Guess the Beta High Score: ${betaStats.highScore}/5000 pts\n` +
    `• Flashcards Mastered: ${flashcardStats.cardsMastered} terms (${flashcardStats.studyStreakDays}🔥 days)\n` +
    `Play: https://reliabilitytools.co.in/play/`;

  const copyShare = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopiedShare(true);
      trackResultShared('copy_leaderboard', 'Leaderboard');
      setTimeout(() => setCopiedShare(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* CRITICAL: Enforce noIndex for Leaderboard as specified in prompt */}
      <SEO 
        title="Play Leaderboard - Local Performance & Game Stats | Reliability Tools"
        description="Local best scores, streaks, and achievements across Termle, Guess the Beta, and Flashcards."
        noIndex={true}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <Link 
            to="/play" 
            className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-cyan-500 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <Trophy className="w-7 h-7 text-amber-500" />
              PLAY LEADERBOARD
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Personal Best Scores, Streak Records & Knowledge Mastery
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={copyShare}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
          >
            {copiedShare ? <Check className="w-4 h-4 text-emerald-300" /> : <Share2 className="w-4 h-4" />}
            <span>{copiedShare ? 'Copied Stats!' : 'Share Achievements'}</span>
          </button>
        </div>
      </div>

      {/* Player Call-Sign Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-850 border border-slate-800 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 text-2xl font-black">
            {profile.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              {isEditingName ? (
                <form onSubmit={handleSaveName} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={playerNameInput}
                    onChange={e => setPlayerNameInput(e.target.value)}
                    className="px-3 py-1 bg-slate-950 border border-cyan-500 rounded-lg text-sm text-white focus:outline-none"
                    autoFocus
                  />
                  <button type="submit" className="p-1.5 bg-cyan-600 rounded-lg text-xs font-bold">
                    <Check className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <>
                  <h2 className="text-xl font-black text-white">{profile.name}</h2>
                  <button 
                    onClick={() => setIsEditingName(true)}
                    className="text-[11px] text-cyan-400 hover:underline font-bold"
                  >
                    Edit Name
                  </button>
                </>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Title: <strong>{profile.title}</strong> • Saved locally in browser</p>
          </div>
        </div>

        <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Cumulative XP</span>
            <div className="text-2xl font-black text-cyan-400 font-mono">{overallScore.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {nameSavedToast && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-xl text-center animate-fadeIn">
          Player name updated!
        </div>
      )}

      {/* Game Performance Cards Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        
        {/* Termle Card */}
        <div className="bg-white dark:bg-slate-850 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="p-2 bg-amber-500/10 text-amber-500 rounded-xl">
                <Flame className="w-5 h-5 fill-amber-500" />
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Daily Guesser</span>
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">Termle</h3>
              <p className="text-xs text-slate-500">6-Attempt Reliability Wordle</p>
            </div>

            <div className="space-y-2 pt-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Current Streak:</span>
                <strong className="text-amber-500 font-mono font-black">{termleStats.currentStreak} Days 🔥</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Max Streak:</span>
                <strong className="text-slate-900 dark:text-white font-mono">{termleStats.maxStreak} Days</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Win Rate:</span>
                <strong className="text-emerald-500 font-mono">
                  {termleStats.gamesPlayed > 0 ? Math.round((termleStats.gamesWon / termleStats.gamesPlayed) * 100) : 0}%
                </strong>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Total Solved:</span>
                <strong className="text-slate-900 dark:text-white font-mono">{termleStats.gamesWon} / {termleStats.gamesPlayed}</strong>
              </div>
            </div>
          </div>

          <Link
            to="/play/termle"
            className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl transition-colors text-center shadow-sm"
          >
            Play Today's Termle
          </Link>
        </div>

        {/* Guess the Beta Card */}
        <div className="bg-white dark:bg-slate-850 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="p-2 bg-purple-500/10 text-purple-500 rounded-xl">
                <TrendingUp className="w-5 h-5" />
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Histogram Game</span>
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">Guess the Beta</h3>
              <p className="text-xs text-slate-500">Weibull Parameter Estimation</p>
            </div>

            <div className="space-y-2 pt-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Personal Best:</span>
                <strong className="text-purple-500 font-mono font-black">{betaStats.highScore} / 5000 Pts</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Average Accuracy:</span>
                <strong className="text-emerald-500 font-mono">{betaStats.averageAccuracy}%</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Rounds Completed:</span>
                <strong className="text-slate-900 dark:text-white font-mono">{betaStats.gamesPlayed * 5}</strong>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Cumulative Score:</span>
                <strong className="text-cyan-500 font-mono">{betaStats.totalScore.toLocaleString()}</strong>
              </div>
            </div>
          </div>

          <Link
            to="/play/guess-the-beta"
            className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-black text-xs rounded-xl transition-colors text-center shadow-sm"
          >
            Launch 5-Round Challenge
          </Link>
        </div>

        {/* Flashcards Card */}
        <div className="bg-white dark:bg-slate-850 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="p-2 bg-cyan-500/10 text-cyan-500 rounded-xl">
                <BookOpen className="w-5 h-5" />
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Retention Engine</span>
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">Glossary Cards</h3>
              <p className="text-xs text-slate-500">SM-2 Spaced Repetition</p>
            </div>

            <div className="space-y-2 pt-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Study Streak:</span>
                <strong className="text-amber-500 font-mono font-black">{flashcardStats.studyStreakDays} Days 🔥</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Terms Mastered:</span>
                <strong className="text-emerald-500 font-mono">{flashcardStats.cardsMastered} / 52</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Total Reviews:</span>
                <strong className="text-slate-900 dark:text-white font-mono">{flashcardStats.totalReviews}</strong>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Status:</span>
                <strong className="text-cyan-500 font-bold">
                  {flashcardStats.studyStreakDays > 0 ? 'Active Learner' : 'Ready for Review'}
                </strong>
              </div>
            </div>
          </div>

          <Link
            to="/play/flashcards"
            className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-black text-xs rounded-xl transition-colors text-center shadow-sm"
          >
            Review Flashcard Deck
          </Link>
        </div>

      </div>

      {/* Match History Table */}
      <div className="bg-white dark:bg-slate-850 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">Recent Match History</h3>
            <p className="text-xs text-slate-400">Tracked locally in your browser storage</p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1 rounded-lg transition-colors ${activeTab === 'all' ? 'bg-white dark:bg-slate-700 text-cyan-600 dark:text-cyan-400 shadow-sm' : 'text-slate-500'}`}
            >
              All
            </button>
            <button
              onClick={() => setActiveTab('termle')}
              className={`px-3 py-1 rounded-lg transition-colors ${activeTab === 'termle' ? 'bg-white dark:bg-slate-700 text-amber-500 shadow-sm' : 'text-slate-500'}`}
            >
              Termle
            </button>
            <button
              onClick={() => setActiveTab('guess_the_beta')}
              className={`px-3 py-1 rounded-lg transition-colors ${activeTab === 'guess_the_beta' ? 'bg-white dark:bg-slate-700 text-purple-500 shadow-sm' : 'text-slate-500'}`}
            >
              Beta
            </button>
            <button
              onClick={() => setActiveTab('flashcards')}
              className={`px-3 py-1 rounded-lg transition-colors ${activeTab === 'flashcards' ? 'bg-white dark:bg-slate-700 text-cyan-500 shadow-sm' : 'text-slate-500'}`}
            >
              Cards
            </button>
          </div>
        </div>

        {filteredEntries.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Game</th>
                  <th className="py-2.5 px-3">Score / Outcome</th>
                  <th className="py-2.5 px-3">Highlight</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredEntries.map(entry => (
                  <tr key={entry.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-2.5 px-3 text-slate-400 font-mono">{entry.date}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-800 dark:text-slate-200 capitalize">
                      {entry.game.replace(/_/g, ' ')}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-black text-cyan-600 dark:text-cyan-400">
                      {entry.score} pts
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">
                      {entry.highlight}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-slate-400 text-xs">
            No match history recorded yet. Complete a round in any game to start logging achievements!
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            onClick={handleClearHistory}
            className="flex items-center gap-1.5 text-xs text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 font-bold transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Local Play Records</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
