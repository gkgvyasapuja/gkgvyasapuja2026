"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, FileText, Sparkles } from "lucide-react";
import { Toaster } from "sonner";

import { useOfferingForm } from "../_hooks/useOfferingForm";
import { useLocationData } from "../_hooks/useLocationData";
import { useDocumentHandling } from "../_hooks/useDocumentHandling";
import { useSubmitOffering } from "../_hooks/useSubmitOffering";

import { PersonalInfoSection } from "./PersonalInfoSection";
import { InitiationSection } from "./InitiationSection";
import { LocationSection } from "./LocationSection";
import { DocumentSection } from "./DocumentSection";
import { SuccessState } from "./SuccessState";

// ─── Friendly processing messages shown while AI works silently ───────────────
// These rotate every ~1.5s so the user feels progress without knowing it's AI.
const PROCESSING_MESSAGES = [
  "Reading your document…",
  "Checking the formatting…",
  "Reviewing the content…",
  "Almost ready for you…",
];

function useRotatingMessage(messages: string[], active: boolean) {
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    if (!active) { setIndex(0); return; }
    const id = setInterval(() => setIndex((i) => (i + 1) % messages.length), 1500);
    return () => clearInterval(id);
  }, [active, messages.length]);

  return messages[index];
}

// ─── Step indicator ────────────────────────────────────────────────────────────
const STEPS = [
  { num: 1 as const, label: "Your Details" },
  { num: 2 as const, label: "Your Document" },
  { num: 3 as const, label: "Final Review" },
];

// ─── Main component ────────────────────────────────────────────────────────────
export default function UploadOfferingForm() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [error, setError] = useState<string | null>(null);

  const { formData, setFormData, handleInputChange, handleSelectChange } =
    useOfferingForm();
  const { countries, states, cities, temples } = useLocationData(formData, setFormData);
  const { file, extractedText, setExtractedText, isParsing, handleFileChange } =
    useDocumentHandling(setError);

  const {
    isSubmitting,
    success,
    submitFinal,
    validateStep1,
    validateStep2,
    handleAutoCorrection,
    isFixingText,
    setIsReviewing,
  } = useSubmitOffering(formData, setFormData, file, extractedText, setError);

  // Rotate friendly message while the system is working quietly behind the scenes
  const processingMessage = useRotatingMessage(PROCESSING_MESSAGES, isFixingText);

  // ─── Success screen ──────────────────────────────────────────────────────────
  if (success) {
    return <SuccessState onReturnHome={() => router.push("/")} />;
  }

  // ─── Derived UI state ────────────────────────────────────────────────────────
  const isWorking = isSubmitting || isParsing || isFixingText;
  const nextButtonDisabled =
    isWorking || (step === 2 && (!file || !extractedText));

  function getNextButtonLabel() {
    if (isFixingText) {
      // User sees a friendly preparation message, not "AI is correcting spelling"
      return (
        <>
          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          {processingMessage}
        </>
      );
    }
    if (isSubmitting) {
      return (
        <>
          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          Submitting your offering…
        </>
      );
    }
    if (step === 1) return "Continue to Document →";
    if (step === 2) return "Review My Offering →";
    return "Submit My Offering";
  }

  function handleNext() {
    if (step === 1) {
      if (validateStep1()) {
        setStep(2);
        scrollToTop();
      }
    } else if (step === 2) {
      if (validateStep2()) {
        // AI correction runs here — user just sees the friendly rotating message
        handleAutoCorrection(setExtractedText, () => {
          setStep(3);
          scrollToTop();
        });
      }
    } else {
      submitFinal();
    }
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <>
      <Toaster />
      <div className="w-full max-w-4xl mx-auto bg-[#0a2540] rounded-3xl shadow-2xl overflow-hidden font-sans border border-white/10 relative">
        <div className="p-8 md:p-14">

          {/* ── Step indicator ─────────────────────────────────────────────── */}
          <div className="flex items-center justify-between mb-12 relative px-4 md:px-10">
            {/* Track background */}
            <div className="absolute left-10 right-10 top-5 h-0.5 bg-white/10 -z-10" />
            {/* Progress fill */}
            <div
              className="absolute left-10 top-5 h-0.5 bg-blue-500 transition-all duration-500 -z-10"
              style={{ width: `calc(${((step - 1) / 2) * 100}% - 40px)` }}
            />
            {STEPS.map((s) => (
              <div key={s.num} className="flex flex-col items-center gap-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-xl transition-all duration-300 ${
                    step === s.num
                      ? "bg-blue-500 text-white ring-4 ring-blue-500/20"
                      : step > s.num
                        ? "bg-green-500 text-white"
                        : "bg-[#0a2540] text-gray-400 border-2 border-white/20"
                  }`}
                >
                  {step > s.num ? "✓" : s.num}
                </div>
                <span
                  className={`text-xs font-medium transition-colors duration-300 ${
                    step === s.num
                      ? "text-blue-400"
                      : step > s.num
                        ? "text-green-400"
                        : "text-gray-500"
                  }`}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>

          {/* ── Inline error message ────────────────────────────────────────── */}
          {error && (
            <div className="mb-10 p-5 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-medium flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                !
              </div>
              <p>{error}</p>
            </div>
          )}

          {/* ── Form content ────────────────────────────────────────────────── */}
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* Step 1 ── personal, initiation, location */}
            {step === 1 && (
              <>
                <PersonalInfoSection
                  formData={formData}
                  handleInputChange={handleInputChange}
                  handleSelectChange={handleSelectChange}
                />
                <InitiationSection
                  formData={formData}
                  handleInputChange={handleInputChange}
                  handleSelectChange={handleSelectChange}
                />
                <LocationSection
                  formData={formData}
                  handleSelectChange={handleSelectChange}
                  countries={countries}
                  states={states}
                  cities={cities}
                  temples={temples}
                />
              </>
            )}

            {/* Steps 2 & 3 ── document upload + editor */}
            {(step === 2 || step === 3) && (
              <DocumentSection
                file={file}
                handleFileChange={(e) => {
                  handleFileChange(e);
                  setIsReviewing(false);
                  setStep(2);
                }}
                isParsing={isParsing}
                extractedText={extractedText}
                setExtractedText={(text) => {
                  setExtractedText(text);
                  setIsReviewing(false);
                  setStep(2);
                }}
                formData={formData}
                handleSelectChange={handleSelectChange}
              />
            )}

            {/* ── Step 3 ── friendly review notice (no AI language) ─────────── */}
            {step === 3 && !isFixingText && (
              <div className="p-5 bg-green-500/10 border border-green-400/30 rounded-2xl flex items-start gap-4 animate-in fade-in slide-in-from-bottom-2">
                <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1">
                  <p className="font-semibold text-green-200">
                    Your document is ready
                  </p>
                  <p className="text-sm text-green-100/80 leading-relaxed">
                    We've reviewed your document and it looks great. Please read
                    through the text below — you can still make any changes you'd
                    like. When you're happy, click{" "}
                    <span className="font-semibold text-green-200">
                      "Submit My Offering"
                    </span>{" "}
                    to send it in.
                  </p>
                </div>
              </div>
            )}

            {/* ── Inline processing overlay shown during AI work ───────────── */}
            {/*
             *  This is the key UX change: instead of showing "Pending Changes"
             *  with AI terminology, we show a single calm progress message.
             *  The corrections are applied silently before the user lands on Step 3.
             */}
            {isFixingText && (
              <div className="p-6 bg-blue-500/10 border border-blue-400/20 rounded-2xl flex items-center gap-4 animate-in fade-in duration-300">
                <div className="relative shrink-0">
                  <FileText className="w-8 h-8 text-blue-300" />
                  <Sparkles className="w-4 h-4 text-yellow-300 absolute -top-1 -right-1 animate-pulse" />
                </div>
                <div>
                  <p className="font-semibold text-blue-200 text-sm">
                    {processingMessage}
                  </p>
                  <p className="text-xs text-blue-100/60 mt-0.5">
                    This usually takes just a moment.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Footer actions ───────────────────────────────────────────────── */}
        <div className="bg-black/20 backdrop-blur-sm p-8 md:px-14 border-t border-white/10 flex justify-between sticky bottom-0 z-10 items-center">

          {/* Back button — hidden on step 1 */}
          {step > 1 ? (
            <Button
              onClick={() => {
                if (step === 3) setIsReviewing(false);
                setStep((prev) => (prev - 1) as 1 | 2);
                scrollToTop();
              }}
              variant="ghost"
              disabled={isWorking}
              className="text-white hover:bg-white/10 px-6 py-7 text-base rounded-2xl"
            >
              ← Back
            </Button>
          ) : (
            <div /> // keeps flex alignment when Back is hidden
          )}

          {/* Primary action */}
          <Button
            onClick={handleNext}
            disabled={nextButtonDisabled}
            size="lg"
            className={`px-10 py-7 text-lg rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed
              font-medium w-full sm:w-auto shadow-xl shadow-black/20 transition-all hover:-translate-y-0.5
              ${step === 3
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-white text-[#0a2540] hover:bg-gray-100"
              }`}
          >
            {getNextButtonLabel()}
          </Button>
        </div>
      </div>
    </>
  );
}