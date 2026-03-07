import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Sparkles, CheckCircle2 } from 'lucide-react';

interface WizardStep {
  title: string;
  description?: string;
  content: React.ReactNode;
  isValid: boolean;
}

interface WizardWrapperProps {
  steps: WizardStep[];
  onFinish: () => void;
  isLoading?: boolean;
  finishText?: string;
  finishIcon?: React.ReactNode;
}

const WizardWrapper: React.FC<WizardWrapperProps> = ({ 
  steps, 
  onFinish, 
  isLoading = false, 
  finishText = 'Calculate', 
  finishIcon 
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  const next = () => setCurrentStep(s => Math.min(steps.length - 1, s + 1));
  const back = () => setCurrentStep(s => Math.max(0, s - 1));

  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center px-1">
        <div className="flex gap-1.5">
          {steps.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentStep ? 'w-8 bg-cyan-600' : idx < currentStep ? 'w-4 bg-emerald-500' : 'w-4 bg-slate-200 dark:bg-slate-700'
              }`}
            />
          ))}
        </div>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          Step {currentStep + 1} of {steps.length}
        </span>
      </div>

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden transition-all">
        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center gap-3 bg-slate-50/50 dark:bg-slate-800/50">
          <div className="p-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm">
            <Sparkles className="w-5 h-5 text-cyan-500" />
          </div>
          <div>
            <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-tight text-sm">
              {steps[currentStep].title}
            </h3>
            {steps[currentStep].description && (
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                {steps[currentStep].description}
              </p>
            )}
          </div>
        </div>

        <div className="p-6 min-h-[160px]">
          {steps[currentStep].content}
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center gap-4">
          <button
            onClick={back}
            disabled={currentStep === 0}
            className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 disabled:opacity-30 disabled:pointer-events-none flex items-center gap-2 transition-all"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>

          <div className="flex items-center gap-2">
            {!isLastStep ? (
              <button
                onClick={next}
                disabled={!steps[currentStep].isValid}
                className="px-6 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-slate-200 dark:shadow-none hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all"
              >
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onFinish}
                disabled={!steps[currentStep].isValid || isLoading}
                className="px-6 py-2 bg-cyan-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-cyan-200 dark:shadow-none hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Calculating...
                  </span>
                ) : (
                  <>
                    {finishIcon || <CheckCircle2 className="w-4 h-4" />}
                    {finishText}
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WizardWrapper;
