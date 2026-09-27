import React, { useState, useEffect, useCallback } from 'react';
import { 
  Trophy, 
  Flame, 
  HelpCircle, 
  BarChart2, 
  Share2, 
  Copy, 
  Check, 
  RotateCcw, 
  Sparkles, 
  Lightbulb, 
  ArrowLeft,
  X,
  ExternalLink,
  MessageCircle,
  Linkedin
} from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../../components/SEO';
import { 
  getDailyTerm, 
  TERMLE_WORDS, 
  VALID_GUESSES, 
  TermleWord 
} from '../../data/termleWords';
import { 
  getTermleStats, 
  saveTermleGame, 
  getTermleDailyState, 
  saveTermleDailyState, 
  TermleStats 
} from '../../utils/playStorage';
import { trackGameCompleted, trackStreakExtended, trackResultShared } from '../../utils/analytics';

const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫']
];

type LetterStatus = 'correct' | 'present' | 'absent' | 'empty';

const Termle: React.FC = () => {
  const [dailyData] = useState(() => getDailyTerm());
  const [targetWord, setTargetWord] = useState<TermleWord>(dailyData.term);
  const [dayNumber, setDayNumber] = useState<number>(dailyData.dayNumber);
  const [isPractice, setIsPractice] = useState<boolean>(false);

  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>('');
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [hasWon, setHasWon] = useState<boolean>(false);
  const [showClue, setShowClue] = useState<boolean>(false);
  const [shakeRow, setShakeRow] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [stats, setStats] = useState<TermleStats>(() => getTermleStats());
  const [showStatsModal, setShowStatsModal] = useState<boolean>(false);
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);
  const [copiedShare, setCopiedShare] = useState<boolean>(false);

  const wordLength = targetWord.word.length;
  const maxAttempts = 6;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Restore daily state from localStorage on mount (if playing today's puzzle)
  useEffect(() => {
    if (!isPractice) {
      const saved = getTermleDailyState(dayNumber);
      if (saved && saved.guesses) {
        setGuesses(saved.guesses);
        if (saved.isComplete) {
          setIsGameOver(true);
          setHasWon(saved.won);
        }
      }
    }
  }, [dayNumber, isPractice]);

  // Determine keyboard letter statuses
  const letterStatuses: Record<string, LetterStatus> = {};
  guesses.forEach(guess => {
    for (let i = 0; i < guess.length; i++) {
      const char = guess[i];
      if (targetWord.word[i] === char) {
        letterStatuses[char] = 'correct';
      } else if (targetWord.word.includes(char) && letterStatuses[char] !== 'correct') {
        letterStatuses[char] = 'present';
      } else if (!targetWord.word.includes(char) && !letterStatuses[char]) {
        letterStatuses[char] = 'absent';
      }
    }
  });

  const handleKeyInput = useCallback((key: string) => {
    if (isGameOver) return;

    if (key === 'ENTER') {
      if (currentGuess.length !== wordLength) {
        setShakeRow(true);
        setTimeout(() => setShakeRow(false), 500);
        showToast(`Word must be ${wordLength} letters`);
        return;
      }

      // Check if valid dictionary word or target word
      if (!VALID_GUESSES.has(currentGuess) && !TERMLE_WORDS.some(w => w.word === currentGuess)) {
        setShakeRow(true);
        setTimeout(() => setShakeRow(false), 500);
        showToast('Not in reliability dictionary');
        return;
      }

      const newGuesses = [...guesses, currentGuess];
      setGuesses(newGuesses);
      setCurrentGuess('');

      const won = currentGuess === targetWord.word;
      const finished = won || newGuesses.length >= maxAttempts;

      if (!isPractice) {
        saveTermleDailyState(dayNumber, {
          guesses: newGuesses,
          isComplete: finished,
          won
        });
      }

      if (finished) {
        setIsGameOver(true);
        setHasWon(won);

        if (!isPractice) {
          const { stats: updatedStats, streakExtended } = saveTermleGame(
            dayNumber,
            targetWord.word,
            newGuesses.length,
            won
          );
          setStats(updatedStats);

          trackGameCompleted('termle', won ? 1000 - (newGuesses.length - 1) * 150 : 0, {
            attempts: newGuesses.length,
            won,
            word: targetWord.word
          });

          if (streakExtended) {
            trackStreakExtended(updatedStats.currentStreak, 'termle');
          }
        } else {
          trackGameCompleted('termle_practice', won ? 500 : 0);
        }

        setTimeout(() => setShowStatsModal(true), 1200);
      }
    } else if (key === 'BACKSPACE' || key === '⌫') {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (/^[A-Z]$/.test(key)) {
      if (currentGuess.length < wordLength) {
        setCurrentGuess(prev => prev + key);
      }
    }
  }, [currentGuess, guesses, isGameOver, wordLength, targetWord, dayNumber, isPractice]);

  // Physical keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const key = e.key.toUpperCase();
      if (key === 'ENTER' || key === 'BACKSPACE' || /^[A-Z]$/.test(key)) {
        handleKeyInput(key);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyInput]);

  // Generate shareable emoji grid
  const generateShareGrid = () => {
    let grid = '';
    guesses.forEach(guess => {
      for (let i = 0; i < wordLength; i++) {
        const char = guess[i];
        if (targetWord.word[i] === char) {
          grid += '🟩';
        } else if (targetWord.word.includes(char)) {
          grid += '🟨';
        } else {
          grid += '⬛';
        }
      }
      grid += '\n';
    });
    return grid;
  };

  const getShareText = () => {
    const attemptText = hasWon ? `${guesses.length}/6` : 'X/6';
    const streakFlame = stats.currentStreak > 0 ? `🔥 Streak: ${stats.currentStreak} days\n` : '';
    return `Termle #${dayNumber} ${attemptText}\n\n` +
      generateShareGrid() + '\n' +
      streakFlame +
      `Play: https://reliabilitytools.co.in/play/termle`;
  };

  const copyShareResult = async () => {
    try {
      await navigator.clipboard.writeText(getShareText());
      setCopiedShare(true);
      trackResultShared('copy_termle', 'Termle');
      setTimeout(() => setCopiedShare(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const startPracticeRound = () => {
    const randomTerm = TERMLE_WORDS[Math.floor(Math.random() * TERMLE_WORDS.length)];
    setTargetWord(randomTerm);
    setIsPractice(true);
    setGuesses([]);
    setCurrentGuess('');
    setIsGameOver(false);
    setHasWon(false);
    setShowClue(false);
    setShowStatsModal(false);
  };

  const returnToDaily = () => {
    setTargetWord(dailyData.term);
    setIsPractice(false);
    setGuesses([]);
    setCurrentGuess('');
    setIsGameOver(false);
    setHasWon(false);
    setShowClue(false);
    setShowStatsModal(false);

    const saved = getTermleDailyState(dayNumber);
    if (saved && saved.guesses) {
      setGuesses(saved.guesses);
      if (saved.isComplete) {
        setIsGameOver(true);
        setHasWon(saved.won);
      }
    }
  };

  // Render tiles for an attempt row
  const renderRow = (rowIndex: number) => {
    const isCurrentRow = rowIndex === guesses.length;
    const guess = isCurrentRow ? currentGuess : guesses[rowIndex] || '';
    const isSubmitted = rowIndex < guesses.length;

    const tiles = [];
    for (let colIndex = 0; colIndex < wordLength; colIndex++) {
      const letter = guess[colIndex] || '';
      let statusClass = 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white';

      if (isSubmitted) {
        if (targetWord.word[colIndex] === letter) {
          statusClass = 'bg-emerald-600 border-emerald-600 text-white';
        } else if (targetWord.word.includes(letter)) {
          statusClass = 'bg-amber-500 border-amber-500 text-white';
        } else {
          statusClass = 'bg-slate-700 border-slate-700 text-slate-300';
        }
      } else if (letter) {
        statusClass = 'border-cyan-500 dark:border-cyan-400 bg-cyan-50/20 dark:bg-cyan-950/20 text-slate-900 dark:text-white scale-105';
      }

      tiles.push(
        <div
          key={colIndex}
          className={`w-12 h-12 sm:w-14 sm:h-14 border-2 rounded-xl flex items-center justify-center font-black text-xl sm:text-2xl transition-all duration-200 select-none shadow-sm ${statusClass}`}
        >
          {letter}
        </div>
      );
    }

    return (
      <div 
        key={rowIndex} 
        className={`flex justify-center gap-1.5 sm:gap-2 ${isCurrentRow && shakeRow ? 'animate-shake' : ''}`}
      >
        {tiles}
      </div>
    );
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-6 space-y-6">
      <SEO 
        title="Termle - Daily Reliability Engineering Word Puzzle | Reliability Tools"
        description="Test your industrial reliability vocabulary daily. Guess the 4-to-7 letter reliability engineering term in 6 attempts."
        canonicalUrl="https://reliabilitytools.co.in/play/termle/"
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-2xl border border-slate-700 animate-fadeIn">
          {toastMessage}
        </div>
      )}

      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <Link 
          to="/play" 
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Hub
        </Link>

        <div className="text-center">
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center justify-center gap-1.5">
            TERMLE
            {isPractice ? (
              <span className="text-[10px] bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/30 px-2 py-0.5 rounded-full font-bold">
                PRACTICE
              </span>
            ) : (
              <span className="text-[10px] bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded-full font-bold">
                #{dayNumber}
              </span>
            )}
          </h1>
          <p className="text-[11px] text-slate-400">Daily Reliability Engineering Term Guesser</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Streak Flame */}
          <div 
            className="flex items-center gap-1 px-2.5 py-1 bg-amber-500/10 dark:bg-amber-950/40 border border-amber-500/30 rounded-lg text-amber-600 dark:text-amber-400 text-xs font-black"
            title={`Current Streak: ${stats.currentStreak} Days`}
          >
            <Flame className="w-4 h-4 fill-amber-500 text-amber-500 animate-pulse" />
            <span>{stats.currentStreak}</span>
          </div>

          <button
            onClick={() => setShowHelpModal(true)}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="How to play"
          >
            <HelpCircle className="w-5 h-5" />
          </button>

          <button
            onClick={() => setShowStatsModal(true)}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Statistics"
          >
            <BarChart2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Clue & Word Length Banner */}
      <div className="bg-slate-100 dark:bg-slate-850 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <div className="px-2.5 py-1 bg-cyan-600 text-white rounded-lg font-mono font-bold text-[11px]">
            {wordLength} Letters
          </div>
          <span className="text-slate-600 dark:text-slate-300 font-medium">
            Category: <strong className="text-slate-900 dark:text-white">{targetWord.category}</strong>
          </span>
        </div>

        {/* Progressive Clue Button (Unlocks after 2 guesses) */}
        {guesses.length >= 2 ? (
          <button
            onClick={() => setShowClue(!showClue)}
            className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-700 dark:text-amber-300 border border-amber-500/40 rounded-xl font-bold transition-all"
          >
            <Lightbulb className="w-3.5 h-3.5 fill-amber-500" />
            <span>{showClue ? 'Hide Clue' : 'View Clue'}</span>
          </button>
        ) : (
          <span className="text-[10px] text-slate-400 italic">
            Clue unlocks in {2 - guesses.length} guess{2 - guesses.length > 1 ? 'es' : ''}
          </span>
        )}
      </div>

      {/* Unlocked Clue Box */}
      {showClue && (
        <div className="p-3.5 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/20 border border-amber-300/50 dark:border-amber-800/50 rounded-2xl text-xs text-amber-900 dark:text-amber-200 animate-fadeIn">
          <div className="font-bold flex items-center gap-1.5 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Reliability Clue:
          </div>
          <p className="leading-relaxed italic">"{targetWord.clue}"</p>
        </div>
      )}

      {/* Guess Grid (6 Attempts) */}
      <div className="space-y-1.5 sm:space-y-2 py-2">
        {Array.from({ length: maxAttempts }).map((_, idx) => renderRow(idx))}
      </div>

      {/* Virtual Keyboard */}
      <div className="space-y-1.5 pt-2 select-none">
        {KEYBOARD_ROWS.map((row, rIdx) => (
          <div key={rIdx} className="flex justify-center gap-1 sm:gap-1.5">
            {row.map(key => {
              const status = letterStatuses[key];
              let btnClass = 'bg-slate-200 dark:bg-slate-750 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700';

              if (status === 'correct') {
                btnClass = 'bg-emerald-600 text-white';
              } else if (status === 'present') {
                btnClass = 'bg-amber-500 text-white';
              } else if (status === 'absent') {
                btnClass = 'bg-slate-400/50 dark:bg-slate-900 text-slate-400 opacity-60';
              }

              const isWide = key === 'ENTER' || key === '⌫';

              return (
                <button
                  key={key}
                  onClick={() => handleKeyInput(key)}
                  className={`h-12 rounded-lg font-black text-xs sm:text-sm flex items-center justify-center transition-colors active:scale-95 ${
                    isWide ? 'px-3 sm:px-4 text-[11px] sm:text-xs' : 'flex-1 max-w-[42px]'
                  } ${btnClass}`}
                >
                  {key}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Post-Game Banner */}
      {isGameOver && (
        <div className="p-5 bg-white dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md space-y-4 text-center animate-fadeIn">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {hasWon ? 'Brilliant Observation!' : 'Challenge Concluded'}
            </span>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              The term was <span className="text-cyan-600 dark:text-cyan-400">{targetWord.word}</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-md mx-auto leading-relaxed">
              {targetWord.definition}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            <button
              onClick={copyShareResult}
              className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5"
            >
              {copiedShare ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              <span>{copiedShare ? 'Copied Emoji Grid!' : 'Share Result (Emoji Grid)'}</span>
            </button>

            <a
              href={`https://wa.me/?text=${encodeURIComponent(getShareText())}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-colors"
              title="Share on WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </a>

            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://reliabilitytools.co.in/play/termle')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
              title="Share on LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>

            {isPractice ? (
              <button
                onClick={returnToDaily}
                className="px-4 py-2.5 bg-slate-100 dark:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition-colors hover:bg-slate-200"
              >
                Back to Today's Daily Term
              </button>
            ) : (
              <button
                onClick={startPracticeRound}
                className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Play Practice Round</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Statistics Modal */}
      {showStatsModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn"
          onClick={() => setShowStatsModal(false)}
        >
          <div 
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" /> Termle Statistics
              </h3>
              <button 
                onClick={() => setShowStatsModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Stat Counters */}
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <div className="text-xl font-black text-slate-900 dark:text-white">{stats.gamesPlayed}</div>
                <div className="text-[10px] text-slate-400 font-bold uppercase">Played</div>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <div className="text-xl font-black text-emerald-500">
                  {stats.gamesPlayed > 0 ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) : 0}%
                </div>
                <div className="text-[10px] text-slate-400 font-bold uppercase">Win %</div>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <div className="text-xl font-black text-amber-500 flex items-center justify-center gap-1">
                  <Flame className="w-4 h-4 fill-amber-500" /> {stats.currentStreak}
                </div>
                <div className="text-[10px] text-slate-400 font-bold uppercase">Streak</div>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <div className="text-xl font-black text-cyan-500">{stats.maxStreak}</div>
                <div className="text-[10px] text-slate-400 font-bold uppercase">Max Streak</div>
              </div>
            </div>

            {/* Guess Distribution */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Guess Distribution
              </span>
              {[1, 2, 3, 4, 5, 6].map(num => {
                const count = stats.guessDistribution[num] || 0;
                const max = Math.max(1, ...Object.values(stats.guessDistribution));
                const pct = Math.max(8, (count / max) * 100);

                return (
                  <div key={num} className="flex items-center gap-2 text-xs">
                    <span className="w-3 font-bold text-slate-400">{num}</span>
                    <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-md h-5 overflow-hidden">
                      <div 
                        className={`h-full flex items-center justify-end pr-2 font-bold text-[11px] text-white rounded-md transition-all ${
                          hasWon && guesses.length === num ? 'bg-cyan-500' : 'bg-slate-600 dark:bg-slate-700'
                        }`}
                        style={{ width: `${pct}%` }}
                      >
                        {count}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={copyShareResult}
                className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                {copiedShare ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                <span>{copiedShare ? 'Copied Emoji Grid!' : 'Share Score (Emoji Grid)'}</span>
              </button>

              <Link
                to="/play/leaderboard"
                className="w-full py-2 text-center text-xs text-slate-500 dark:text-slate-400 hover:text-cyan-500 font-bold"
              >
                View Play Hub Leaderboard →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* How To Play Modal */}
      {showHelpModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn"
          onClick={() => setShowHelpModal(false)}
        >
          <div 
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-cyan-500" /> How To Play Termle
              </h3>
              <button 
                onClick={() => setShowHelpModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>Guess the daily reliability engineering term in <strong>6 attempts</strong>.</p>
              <p>Each guess must be a valid word from our industrial reliability vocabulary.</p>
              
              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-emerald-600 text-white font-bold rounded-lg flex items-center justify-center">M</div>
                  <span><strong>Green:</strong> Letter is in the term and in the correct spot.</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-amber-500 text-white font-bold rounded-lg flex items-center justify-center">T</div>
                  <span><strong>Yellow:</strong> Letter is in the term but in the wrong spot.</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-slate-700 text-slate-300 font-bold rounded-lg flex items-center justify-center">X</div>
                  <span><strong>Gray:</strong> Letter is not in the term at all.</span>
                </div>
              </div>

              <div className="p-3 bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800/40 rounded-xl text-cyan-900 dark:text-cyan-200">
                💡 <strong>Clues:</strong> After 2 guesses, an engineering clue drawn directly from our reliability glossary will unlock!
              </div>
            </div>

            <button
              onClick={() => setShowHelpModal(false)}
              className="w-full py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs rounded-xl"
            >
              Ready to Play
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Termle;
