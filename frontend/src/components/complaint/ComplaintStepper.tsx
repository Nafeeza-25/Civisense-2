import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ComplaintStepperProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
}

const ComplaintStepper = ({ currentStep, totalSteps, stepLabels }: ComplaintStepperProps) => {
  return (
    <div className="w-full">
      {/* Mobile: Simple progress bar */}
      <div className="md:hidden">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-semibold text-primary">
            Step {currentStep} <span className="text-muted-foreground font-normal">of {totalSteps}</span>
          </span>
          <span className="text-sm font-medium text-foreground">
            {stepLabels[currentStep - 1]}
          </span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-primary h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            role="progressbar"
            aria-valuenow={currentStep}
            aria-valuemin={1}
            aria-valuemax={totalSteps}
            aria-label={`Step ${currentStep} of ${totalSteps}: ${stepLabels[currentStep - 1]}`}
          />
        </div>
      </div>

      {/* Desktop: Full stepper */}
      <div className="hidden md:block">
        <ol className="flex items-center w-full" role="list">
          {stepLabels.map((label, index) => {
            const stepNum = index + 1;
            const isCompleted = stepNum < currentStep;
            const isCurrent = stepNum === currentStep;
            const isLast = stepNum === totalSteps;

            return (
              <li
                key={label}
                className={cn(
                  "flex items-center",
                  !isLast && "flex-1"
                )}
              >
                <div className="flex flex-col items-center relative group">
                  {/* Step circle */}
                  <div
                    className={cn(
                      "flex items-center justify-center w-11 h-11 rounded-full border-2 font-bold text-sm transition-all duration-300 relative z-10",
                      isCompleted && "bg-primary border-primary text-primary-foreground shadow-md shadow-primary/20 scale-100",
                      isCurrent && "border-primary text-primary bg-background ring-4 ring-primary/10 scale-110",
                      !isCompleted && !isCurrent && "border-slate-200 text-slate-400 bg-background"
                    )}
                    aria-current={isCurrent ? "step" : undefined}
                  >
                    {isCompleted ? (
                      <Check className="w-6 h-6 animate-in fade-in zoom-in duration-300" aria-hidden="true" />
                    ) : (
                      stepNum
                    )}
                  </div>

                  {/* Step label */}
                  <span
                    className={cn(
                      "mt-3 text-xs font-semibold uppercase tracking-wider text-center max-w-[100px] transition-colors duration-300",
                      isCurrent ? "text-primary" : "text-muted-foreground",
                      !isCurrent && !isCompleted && "text-slate-400"
                    )}
                  >
                    {label}
                  </span>
                </div>

                {/* Connector line */}
                {!isLast && (
                  <div
                    className={cn(
                      "flex-1 h-[2px] mx-4 -mt-6 transition-all duration-500",
                      isCompleted ? "bg-primary" : "bg-slate-200 dark:bg-slate-700"
                    )}
                    aria-hidden="true"
                  />
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
};

export default ComplaintStepper;
