import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { CheckCircle2, XCircle, AlertCircle, ArrowRight, Clock, ShieldAlert } from 'lucide-react';
import { quizQuestions } from '../../data/quizQuestions';
import { QuizQuestion } from '../../types';
import SEO from '../../components/SEO';

// Fisher-Yates shuffle
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

const Quiz: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const name = location.state?.name;
  const discipline = location.state?.discipline || 'general';

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  // Anti-Cheat & Strict Mode
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent F12
      if (e.key === 'F12') { e.preventDefault(); return false; }
      // Prevent Ctrl/Cmd + Shift + I/J
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && ['i', 'I', 'j', 'J'].includes(e.key)) { e.preventDefault(); return false; }
      // Prevent Ctrl/Cmd + U (Source)
      if ((e.ctrlKey || e.metaKey) && ['u', 'U'].includes(e.key)) { e.preventDefault(); return false; }
      // Prevent Ctrl/Cmd + K (Search/Palettes)
      if ((e.ctrlKey || e.metaKey) && ['k', 'K'].includes(e.key)) { e.preventDefault(); return false; }
      // Prevent Ctrl/Cmd + C (Copy)
      if ((e.ctrlKey || e.metaKey) && ['c', 'C'].includes(e.key)) { e.preventDefault(); return false; }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Initialize Questions
  useEffect(() => {
    // Filter by difficulty
    const easyPool = quizQuestions.filter(q => q.difficulty === 'easy');
    const diffPool = quizQuestions.filter(q => q.difficulty === 'difficult');
    const veryDiffPool = quizQuestions.filter(q => q.difficulty === 'very_difficult');

    // Helper to blend general and discipline-specific questions
    const getQuestions = (pool: QuizQuestion[], count: number) => {
      const specific = shuffleArray(pool.filter(q => q.discipline === discipline));
      const general = shuffleArray(pool.filter(q => !q.discipline || q.discipline === 'general'));
      
      if (discipline === 'general') {
        return shuffleArray(general).slice(0, count);
      } else {
        // Force 50% of the questions to be specific to the discipline, if available
        const specificCount = Math.min(specific.length, Math.ceil(count / 2));
        const generalCount = count - specificCount;
        return shuffleArray([...specific.slice(0, specificCount), ...general.slice(0, generalCount)]);
      }
    };

    const easy = getQuestions(easyPool, 8);
    const difficult = getQuestions(diffPool, 6);
    const veryDifficult = getQuestions(veryDiffPool, 6);

    const combined = shuffleArray([...easy, ...difficult, ...veryDifficult]);
    setQuestions(combined);
  }, [discipline]);

  // Timer Logic
  useEffect(() => {
    if (questions.length === 0 || isAnswered) return;

    if (timeLeft <= 0) {
      handleTimeout();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isAnswered, questions]);

  const handleTimeout = () => {
    if (isAnswered) return;
    setSelectedOption(-1); // -1 signifies timeout/incorrect
    setIsAnswered(true);
  };

  if (!name) {
    return <Navigate to="/skill-test" replace />;
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-500">
        Preparing your secure assessment...
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  const handleOptionClick = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    if (index === currentQ.correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      navigate('/skill-test/results', { 
        state: { name, score: score + (selectedOption === currentQ.correctAnswer ? 1 : 0), total: questions.length } 
      });
    } else {
      setSelectedOption(null);
      setIsAnswered(false);
      setTimeLeft(30); // Reset timer for next question
      setCurrentIndex(prev => prev + 1);
    }
  };

  const progressPercentage = ((currentIndex + 1) / questions.length) * 100;
  const timePercentage = (timeLeft / 30) * 100;
  
  const isTimeCritical = timeLeft <= 5;

  return (
    <div className="min-h-[calc(100vh-100px)] bg-slate-50 dark:bg-slate-950 py-1 px-2 md:px-4 flex flex-col select-none">
      <SEO title="Reliability Skill Test In Progress" description="Secure reliability engineering assessment." />
      
      <div className="max-w-4xl w-full mx-auto flex-grow flex flex-col pt-2">
        
        {/* Header / Progress */}
        <div className="mb-3">
          <div className="flex justify-between items-end mb-1.5">
            <div>
              <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-0.5">
                Question {currentIndex + 1} of {questions.length}
              </p>
              <h2 className="text-base md:text-lg font-black text-slate-800 dark:text-slate-200 leading-none">
                {currentQ.difficulty === 'easy' ? 'Level 1: Essential' : currentQ.difficulty === 'difficult' ? 'Level 2: Advanced' : 'Level 3: Expert'}
              </h2>
            </div>
            <div className="text-right">
              <div className={`flex items-center justify-end gap-1 text-lg md:text-xl font-black tabular-nums leading-none transition-colors ${isTimeCritical && !isAnswered ? 'text-red-600 dark:text-red-500 animate-pulse' : 'text-slate-900 dark:text-white'}`}>
                <Clock className="w-4 h-4 md:w-5 md:h-5" /> 00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-1.5">
             {/* Overall Progress */}
             <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1 overflow-hidden">
               <div className="bg-blue-600 h-1 rounded-full transition-all duration-500 ease-out" style={{ width: `${progressPercentage}%` }}></div>
             </div>
             
             {/* Timer Bar */}
             {!isAnswered && (
               <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1 overflow-hidden">
                 <div 
                    className={`h-1 rounded-full transition-all duration-1000 ease-linear ${isTimeCritical ? 'bg-red-500' : 'bg-cyan-500'}`} 
                    style={{ width: `${timePercentage}%` }}
                 ></div>
               </div>
             )}
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 p-3 md:p-5 flex-grow flex flex-col mb-4">
          <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-white mb-3 leading-snug">
            {currentQ.text}
          </h3>

          <div className="space-y-2 flex-grow">
            {currentQ.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentQ.correctAnswer;
              
              let btnClass = "w-full text-left p-2.5 px-4 rounded-lg border transition-all font-medium text-sm flex items-center justify-between group ";
              
              if (!isAnswered) {
                btnClass += "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-cyan-500 dark:hover:border-cyan-500 hover:bg-cyan-50 dark:hover:bg-cyan-900/20";
              } else {
                if (isCorrect) {
                  btnClass += "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-200";
                } else if (isSelected && !isCorrect) {
                  btnClass += "border-rose-500 bg-rose-50 dark:bg-rose-900/20 text-rose-800 dark:text-rose-200";
                } else {
                  btnClass += "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-400 dark:text-slate-600 opacity-50";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleOptionClick(idx)}
                  disabled={isAnswered}
                  className={btnClass}
                >
                  <span className="flex-1">{option}</span>
                  {isAnswered && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 ml-3" />}
                  {isAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-500 shrink-0 ml-3" />}
                </button>
              );
            })}
          </div>

          {/* Inline Timeout / Explanation & Next Button */}
          {isAnswered && (
            <div className="mt-3 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
              <div className={`p-2.5 md:p-3 rounded-lg flex gap-2.5 flex-1 border ${selectedOption === currentQ.correctAnswer ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/50' : 'bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800/50'}`}>
                <AlertCircle className={`w-5 h-5 shrink-0 mt-0.5 ${selectedOption === currentQ.correctAnswer ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`} />
                <div>
                  <p className={`font-bold text-xs md:text-sm mb-0.5 ${selectedOption === currentQ.correctAnswer ? 'text-emerald-800 dark:text-emerald-300' : 'text-rose-800 dark:text-rose-300'}`}>
                    {selectedOption === currentQ.correctAnswer ? 'Correct!' : selectedOption === -1 ? 'Time Expired!' : 'Incorrect'}
                  </p>
                  <p className="text-slate-700 dark:text-slate-300 text-[11px] md:text-xs leading-snug">
                    {currentQ.explanation}
                  </p>
                </div>
              </div>
              
              <button
                onClick={handleNext}
                className="px-5 py-2.5 shrink-0 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-bold text-sm hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors flex items-center justify-center gap-2 shadow-md h-full md:min-h-[60px]"
              >
                {isLastQuestion ? 'Complete Assessment' : 'Next Question'} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
