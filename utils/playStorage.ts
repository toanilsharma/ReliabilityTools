/**
 * LocalStorage management for the /play Hub Games and Leaderboard
 */

export interface TermleStats {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  guessDistribution: Record<number, number>; // 1 to 6 attempts
  lastPlayedDate: string; // YYYY-MM-DD
  history: {
    dayNumber: number;
    word: string;
    attempts: number;
    won: boolean;
    date: string;
  }[];
}

export interface GuessBetaStats {
  gamesPlayed: number;
  highScore: number; // Max 5000
  totalScore: number;
  averageAccuracy: number;
  lastPlayedDate: string;
  bestRounds: {
    score: number;
    date: string;
    details: string;
  }[];
}

export interface FlashcardCardState {
  term: string;
  intervalDays: number;
  easeFactor: number;
  dueDate: string; // YYYY-MM-DD
  reviews: number;
  consecutiveCorrect: number;
}

export interface FlashcardStats {
  totalReviews: number;
  cardsMastered: number; // cards with interval > 14 days
  studyStreakDays: number;
  lastStudiedDate: string; // YYYY-MM-DD
  cards: Record<string, FlashcardCardState>;
}

export interface PlayerProfile {
  name: string;
  title: string;
}

const STORAGE_KEYS = {
  PLAYER: 'rt_play_player',
  TERMLE_STATS: 'rt_termle_stats',
  TERMLE_DAILY_STATE: 'rt_termle_daily_',
  GUESS_BETA_STATS: 'rt_guess_beta_stats',
  FLASHCARD_STATS: 'rt_flashcard_stats',
  LEADERBOARD: 'rt_play_leaderboard'
};

// Safe LocalStorage helpers
function getStoredJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    console.warn(`Failed to read ${key} from localStorage`, e);
    return fallback;
  }
}

function setStoredJson<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Failed to write ${key} to localStorage`, e);
  }
}

// ----------------------------------------------------
// Player Profile
// ----------------------------------------------------
export function getPlayerProfile(): PlayerProfile {
  return getStoredJson<PlayerProfile>(STORAGE_KEYS.PLAYER, {
    name: 'Reliability Engineer',
    title: 'Asset Champion'
  });
}

export function savePlayerProfile(profile: Partial<PlayerProfile>): PlayerProfile {
  const current = getPlayerProfile();
  const updated = { ...current, ...profile };
  setStoredJson(STORAGE_KEYS.PLAYER, updated);
  return updated;
}

// ----------------------------------------------------
// Termle Game Storage
// ----------------------------------------------------
export function getTermleStats(): TermleStats {
  return getStoredJson<TermleStats>(STORAGE_KEYS.TERMLE_STATS, {
    gamesPlayed: 0,
    gamesWon: 0,
    currentStreak: 0,
    maxStreak: 0,
    guessDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
    lastPlayedDate: '',
    history: []
  });
}

export function saveTermleGame(
  dayNumber: number,
  word: string,
  attempts: number,
  won: boolean
): { stats: TermleStats; streakExtended: boolean } {
  const stats = getTermleStats();
  const todayStr = new Date().toISOString().slice(0, 10);
  
  // Calculate Streak
  let streak = stats.currentStreak;
  let streakExtended = false;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().slice(0, 10);

  if (won) {
    if (stats.lastPlayedDate === yesterdayStr) {
      streak += 1;
      streakExtended = true;
    } else if (stats.lastPlayedDate === todayStr) {
      // Already played today, maintain
    } else {
      streak = 1;
      streakExtended = true;
    }
  } else {
    streak = 0;
  }

  const maxStreak = Math.max(stats.maxStreak, streak);
  const distribution = { ...stats.guessDistribution };
  if (won && attempts >= 1 && attempts <= 6) {
    distribution[attempts] = (distribution[attempts] || 0) + 1;
  }

  const updated: TermleStats = {
    gamesPlayed: stats.gamesPlayed + 1,
    gamesWon: stats.gamesWon + (won ? 1 : 0),
    currentStreak: streak,
    maxStreak,
    guessDistribution: distribution,
    lastPlayedDate: todayStr,
    history: [
      { dayNumber, word, attempts, won, date: todayStr },
      ...stats.history.slice(0, 29)
    ]
  };

  setStoredJson(STORAGE_KEYS.TERMLE_STATS, updated);
  addLeaderboardEntry('termle', won ? 1000 - (attempts - 1) * 150 : 0, `${won ? `${attempts}/6` : 'X/6'} (${streak}🔥 streak)`);

  return { stats: updated, streakExtended };
}

export interface TermleDailyState {
  guesses: string[];
  isComplete: boolean;
  won: boolean;
}

export function getTermleDailyState(dayNumber: number): TermleDailyState | null {
  return getStoredJson<TermleDailyState | null>(`${STORAGE_KEYS.TERMLE_DAILY_STATE}${dayNumber}`, null);
}

export function saveTermleDailyState(dayNumber: number, state: TermleDailyState): void {
  setStoredJson(`${STORAGE_KEYS.TERMLE_DAILY_STATE}${dayNumber}`, state);
}

// ----------------------------------------------------
// Guess the Beta Storage
// ----------------------------------------------------
export function getGuessBetaStats(): GuessBetaStats {
  return getStoredJson<GuessBetaStats>(STORAGE_KEYS.GUESS_BETA_STATS, {
    gamesPlayed: 0,
    highScore: 0,
    totalScore: 0,
    averageAccuracy: 0,
    lastPlayedDate: '',
    bestRounds: []
  });
}

export function saveGuessBetaGame(finalScore: number, accuracyPercent: number): GuessBetaStats {
  const stats = getGuessBetaStats();
  const todayStr = new Date().toISOString().slice(0, 10);

  const games = stats.gamesPlayed + 1;
  const highScore = Math.max(stats.highScore, finalScore);
  const avgAcc = Math.round((stats.averageAccuracy * stats.gamesPlayed + accuracyPercent) / games);

  const updated: GuessBetaStats = {
    gamesPlayed: games,
    highScore,
    totalScore: stats.totalScore + finalScore,
    averageAccuracy: avgAcc,
    lastPlayedDate: todayStr,
    bestRounds: [
      { score: finalScore, date: todayStr, details: `${accuracyPercent}% accuracy` },
      ...stats.bestRounds
    ].sort((a, b) => b.score - a.score).slice(0, 10)
  };

  setStoredJson(STORAGE_KEYS.GUESS_BETA_STATS, updated);
  addLeaderboardEntry('guess_the_beta', finalScore, `${accuracyPercent}% accuracy`);

  return updated;
}

// ----------------------------------------------------
// Flashcards Spaced Repetition (SM-2 Algorithm)
// ----------------------------------------------------
export function getFlashcardStats(): FlashcardStats {
  return getStoredJson<FlashcardStats>(STORAGE_KEYS.FLASHCARD_STATS, {
    totalReviews: 0,
    cardsMastered: 0,
    studyStreakDays: 0,
    lastStudiedDate: '',
    cards: {}
  });
}

export type ReviewRating = 'again' | 'hard' | 'good' | 'easy';

/**
 * SuperMemo SM-2 interval scheduler for flashcards
 */
export function recordFlashcardReview(
  term: string,
  rating: ReviewRating
): { stats: FlashcardStats; streakExtended: boolean } {
  const stats = getFlashcardStats();
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);

  // Check study streak flame
  let streak = stats.studyStreakDays;
  let streakExtended = false;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().slice(0, 10);

  if (stats.lastStudiedDate === yesterdayStr) {
    streak += 1;
    streakExtended = true;
  } else if (stats.lastStudiedDate === todayStr) {
    // Already studied today
  } else {
    streak = 1;
    streakExtended = true;
  }

  // SM-2 Interval Calculation
  const card: FlashcardCardState = stats.cards[term] || {
    term,
    intervalDays: 1,
    easeFactor: 2.5,
    dueDate: todayStr,
    reviews: 0,
    consecutiveCorrect: 0
  };

  let newInterval = 1;
  let newEase = card.easeFactor;
  let consecutive = card.consecutiveCorrect;

  switch (rating) {
    case 'again':
      newInterval = 1;
      consecutive = 0;
      newEase = Math.max(1.3, card.easeFactor - 0.2);
      break;
    case 'hard':
      newInterval = Math.max(1, Math.round(card.intervalDays * 1.2));
      consecutive += 1;
      newEase = Math.max(1.3, card.easeFactor - 0.15);
      break;
    case 'good':
      if (consecutive === 0) newInterval = 1;
      else if (consecutive === 1) newInterval = 3;
      else newInterval = Math.round(card.intervalDays * card.easeFactor);
      consecutive += 1;
      break;
    case 'easy':
      if (consecutive === 0) newInterval = 2;
      else if (consecutive === 1) newInterval = 5;
      else newInterval = Math.round(card.intervalDays * card.easeFactor * 1.4);
      consecutive += 1;
      newEase = Math.min(3.0, card.easeFactor + 0.15);
      break;
  }

  const nextDue = new Date();
  nextDue.setDate(nextDue.getDate() + newInterval);
  const dueDateStr = nextDue.toISOString().slice(0, 10);

  const updatedCards = {
    ...stats.cards,
    [term]: {
      term,
      intervalDays: newInterval,
      easeFactor: Number(newEase.toFixed(2)),
      dueDate: dueDateStr,
      reviews: card.reviews + 1,
      consecutiveCorrect: consecutive
    }
  };

  const masteredCount = Object.values(updatedCards).filter(c => c.intervalDays >= 14).length;

  const updatedStats: FlashcardStats = {
    totalReviews: stats.totalReviews + 1,
    cardsMastered: masteredCount,
    studyStreakDays: streak,
    lastStudiedDate: todayStr,
    cards: updatedCards
  };

  setStoredJson(STORAGE_KEYS.FLASHCARD_STATS, updatedStats);
  addLeaderboardEntry('flashcards', updatedStats.totalReviews, `${streak}🔥 Day Streak (${masteredCount} Mastered)`);

  return { stats: updatedStats, streakExtended };
}

// ----------------------------------------------------
// Play Hub Local Leaderboard
// ----------------------------------------------------
export interface LeaderboardEntry {
  id: string;
  game: 'termle' | 'guess_the_beta' | 'flashcards';
  playerName: string;
  score: number;
  highlight: string;
  date: string;
}

export function getLeaderboard(): LeaderboardEntry[] {
  return getStoredJson<LeaderboardEntry[]>(STORAGE_KEYS.LEADERBOARD, []);
}

export function addLeaderboardEntry(
  game: 'termle' | 'guess_the_beta' | 'flashcards',
  score: number,
  highlight: string
): void {
  const profile = getPlayerProfile();
  const current = getLeaderboard();
  const newEntry: LeaderboardEntry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    game,
    playerName: profile.name || 'Reliability Engineer',
    score,
    highlight,
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  };

  const updated = [newEntry, ...current].slice(0, 100);
  setStoredJson(STORAGE_KEYS.LEADERBOARD, updated);
}

export function clearLeaderboard(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEYS.LEADERBOARD);
  }
}
