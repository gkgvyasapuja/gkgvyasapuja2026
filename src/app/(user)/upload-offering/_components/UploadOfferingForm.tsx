"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

import { useOfferingForm } from "../_hooks/useOfferingForm";
import { useLocationData } from "../_hooks/useLocationData";
import { useDocumentHandling } from "../_hooks/useDocumentHandling";
import { useSubmitOffering } from "../_hooks/useSubmitOffering";

import { PersonalInfoSection } from "./PersonalInfoSection";
import { InitiationSection } from "./InitiationSection";
import { LocationSection } from "./LocationSection";
import { DocumentSection } from "./DocumentSection";
import { SuccessState } from "./SuccessState";

export default function UploadOfferingForm() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [error, setError] = useState<string | null>(null);

  const { formData, setFormData, handleInputChange, handleSelectChange } =
    useOfferingForm();
  const { countries, states, cities, temples } = useLocationData(
    formData,
    setFormData,
  );
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
    isReviewing,
  } = useSubmitOffering(formData, setFormData, file, extractedText, setError);

  if (success) {
    return <SuccessState onReturnHome={() => router.push("/")} />;
  }

  return (
    <>
      <div className="w-full max-w-6xl mx-auto text-[#0b1a33] rounded-3xl shadow-sm overflow-hidden font-sans border border-black/10 bg-gradient-to-br from-white via-[#f8fbff] to-[#e7eeff] relative">
        <div className="p-6 md:p-10 lg:p-14">
          <div className="mb-8 p-6 rounded-2xl bg-white/90 shadow-sm border border-[#dce6f6]">
            <h2 className="text-3xl font-bold text-[#0a2540] mb-2">
              Upload Offering Form
            </h2>
            <p className="text-sm text-[#526c96]">
              Complete your details, upload the document, and submit your
              offering for review.
            </p>
          </div>
          {/* Stepper UI */}
          <div className="flex items-center justify-between mb-10 relative px-4 md:px-10">
            <div className="absolute left-10 right-10 top-5 h-0.5 bg-white/10 -z-10" />
            <div
              className="absolute left-10 top-5 h-0.5 bg-blue-500 transition-all duration-500 -z-10"
              style={{ width: `calc(${((step - 1) / 2) * 100}% - 40px)` }}
            />
            {[
              { num: 1, label: "Basic Details" },
              { num: 2, label: "Upload Document" },
              { num: 3, label: "Review & Submit" },
            ].map((s) => (
              <div
                key={s.num}
                className="flex flex-col items-center"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-xl transition-colors duration-300 ${
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
                  className={`text-xs mt-3 font-medium transition-colors duration-300 ${
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

          {error && (
            <div className="mb-10 p-5 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-medium flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
                !
              </div>
              <p>{error}</p>
            </div>
          )}

          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
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
            <DocumentSection
              file={file}
              handleFileChange={(e) => {
                handleFileChange(e);
                setIsReviewing(false);
              }}
              isParsing={isParsing}
              extractedText={extractedText}
              setExtractedText={(text) => {
                setExtractedText(text);
                setIsReviewing(false);
              }}
              formData={formData}
              handleSelectChange={handleSelectChange}
            />
            {isReviewing && (
              <div className="p-5 bg-blue-500/10 border border-blue-400/30 rounded-2xl text-blue-100 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2">
                <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 mt-0.5 text-blue-300">
                  i
                </div>
                <div className="flex flex-col gap-1">
                  <p className="font-semibold text-blue-200">
                    Review your offering
                  </p>
                  <p className="text-md text-blue-100/80">
                    We have quickly checked your document&apos;s text to ensure
                    proper spelling and formatting. Please review the text above
                    to make sure it is correct. If you agree, click
                    &ldquo;Confirm & Submit&rdquo; below.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Form Action Footer */}
        <div className="bg-white/90 backdrop-blur-sm p-5 md:p-7 border-t border-[#dce6f6] flex justify-between sticky bottom-0 z-10 transition-all items-center shadow-[0_-8px_30px_rgba(12,35,69,0.09)]">
          {step > 1 ? (
            <Button
              onClick={() => {
                if (step === 3) setIsReviewing(false);
                setStep((prev) => (prev - 1) as 1 | 2);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              variant="ghost"
              disabled={isSubmitting || isFixingText}
              className="text-white hover:bg-white/10 px-6 py-7 text-lg rounded-2xl"
            >
              Back
            </Button>
          ) : (
            <div /> // Placeholder to keep the flex alignment when there's no Back button
          )}

          <Button
            onClick={() => {
              if (step === 1) {
                if (validateStep1()) {
                  setStep(2);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              } else if (step === 2) {
                if (validateStep2()) {
                  handleAutoCorrection(setExtractedText, () => {
                    setStep(3);
                  });
                }
              } else if (step === 3) {
                submitFinal();
              }
            }}
            disabled={
              isSubmitting ||
              isParsing ||
              isFixingText ||
              (step === 2 && (!file || !extractedText))
            }
            size="lg"
            className={`px-10 py-7 text-xl rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed font-medium w-full sm:w-auto shadow-sm shadow-black/20 transition-all hover:-translate-y-0.5 ${
              step === 3
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-white text-[#0a2540] hover:bg-gray-100"
            }`}
          >
            {isSubmitting || isFixingText ? (
              <>
                <Loader2 className="w-6 h-6 mr-3 animate-spin" />{" "}
                {isFixingText ? "Reviewing text..." : "Submitting..."}
              </>
            ) : step === 1 ? (
              "Next: Upload Document"
            ) : step === 2 ? (
              "Process Document"
            ) : (
              "Confirm & Submit"
            )}
          </Button>
        </div>
      </div>
    </>
  );
}
