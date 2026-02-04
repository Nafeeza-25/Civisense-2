import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Loader2, ShieldCheck } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import ComplaintStepper from '@/components/complaint/ComplaintStepper';
import StepDescribeIssue from '@/components/complaint/StepDescribeIssue';
import StepServiceType from '@/components/complaint/StepServiceType';
import StepUrgency from '@/components/complaint/StepUrgency';
import StepVulnerability from '@/components/complaint/StepVulnerability';
import StepContact from '@/components/complaint/StepContact';
import SubmissionResult from '@/components/complaint/SubmissionResult';
import { api } from '@/services/api';
import type { ComplaintFormData, ComplaintSubmissionResult } from '@/lib/types';

const initialFormData: ComplaintFormData = {
  description: '',
  area: '',
  serviceType: 'other',
  urgency: 'medium',
  vulnerability: {
    seniorCitizen: false,
    lowIncome: false,
    disability: false
  },
  name: '',
  phone: '',
  email: '',
  consent: false
};

const stepLabels = ['Describe', 'Category', 'Urgency', 'Vulnerability', 'Contact'];

const CitizenComplaint = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ComplaintFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<ComplaintSubmissionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  const updateFormData = (updates: Partial<ComplaintFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return formData.description.trim().length > 10 && formData.area !== '';
      case 2:
        return formData.serviceType !== undefined;
      case 3:
        return formData.urgency !== undefined;
      case 4:
        return true; // Vulnerability is optional
      case 5:
        return (
          formData.name.trim().length > 0 &&
          formData.phone.length === 10 &&
          formData.consent
        );
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 5));
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(5)) {
      setError('Please fill in all required fields and accept the consent checkbox.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await api.submitComplaint(formData);
      setSubmissionResult(result);
    } catch (err) {
      setError('Failed to submit complaint. Please try again.');
      console.error('Submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewComplaint = () => {
    setFormData(initialFormData);
    setCurrentStep(1);
    setSubmissionResult(null);
    setError(null);
  };

  const renderStep = () => {
    return (
      <div className="animate-in">
        {(() => {
          switch (currentStep) {
            case 1:
              return <StepDescribeIssue data={formData} updateData={updateFormData} />;
            case 2:
              return <StepServiceType data={formData} updateData={updateFormData} />;
            case 3:
              return <StepUrgency data={formData} updateData={updateFormData} />;
            case 4:
              return <StepVulnerability data={formData} updateData={updateFormData} />;
            case 5:
              return <StepContact data={formData} updateData={updateFormData} />;
            default:
              return null;
          }
        })()}
      </div>
    );
  };

  // Show submission result
  if (submissionResult) {
    return (
      <Layout>
        <div className="container max-w-2xl mx-auto px-4 py-12">
          <SubmissionResult result={submissionResult} onNewComplaint={handleNewComplaint} />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] py-8 px-4">
        <div className="max-w-3xl w-full space-y-8">

          {/* Header Section */}
          <div className="text-center space-y-4 mb-8">
            <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-primary/10 mb-2">
              <ShieldCheck className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
              File a Grievance
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
              Your voice matters. Submit your concern and our AI-powered system will prioritize and route it to the right department.
            </p>
          </div>

          {/* Stepper */}
          <div className="glass-panel rounded-2xl p-6 shadow-sm">
            <ComplaintStepper
              currentStep={currentStep}
              totalSteps={5}
              stepLabels={stepLabels}
            />
          </div>

          {/* Form Card */}
          <div className="relative">
            <Card className="glass-panel border-0 shadow-2xl relative z-10 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50" />
              <CardContent className="p-8 md:p-10">
                {/* Step Content */}
                <div className="min-h-[300px]">
                  {renderStep()}
                </div>

                {/* Error Message */}
                {error && (
                  <div className="mt-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive font-medium flex items-center gap-3 animate-in" role="alert">
                    <div className="w-1.5 h-1.5 p-1 rounded-full bg-destructive" />
                    {error}
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-10 pt-8 border-t border-slate-200/50 dark:border-slate-700/50">
                  <Button
                    variant="ghost"
                    onClick={handlePrev}
                    disabled={currentStep === 1}
                    className="gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  >
                    <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                    Back
                  </Button>

                  {currentStep < 5 ? (
                    <Button
                      onClick={handleNext}
                      disabled={!validateStep(currentStep)}
                      className="gap-2 px-8 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300"
                      size="lg"
                    >
                      Next Step
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      disabled={!validateStep(5) || isSubmitting}
                      className="gap-2 px-8 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300"
                      size="lg"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                          Submitting...
                        </>
                      ) : (
                        'Submit Complaint'
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Decorative Elements */}
            <div className="absolute -z-10 top-1/2 -left-12 w-64 h-64 bg-primary/20 rounded-full blur-[100px]" />
            <div className="absolute -z-10 bottom-0 -right-12 w-64 h-64 bg-secondary/20 rounded-full blur-[100px]" />
          </div>

          {/* Skip vulnerability step hint */}
          {currentStep === 4 && (
            <p className="text-center text-sm text-slate-400 mt-4 animate-in">
              This step is completely optional. Your privacy is paramount.
            </p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CitizenComplaint;
