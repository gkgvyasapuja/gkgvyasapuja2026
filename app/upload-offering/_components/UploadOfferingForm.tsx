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
    handleAutoCorrection,
    isReviewing,
    isFixingText,
    setIsReviewing,
  } = useSubmitOffering(formData, setFormData, file, extractedText, setError);

  if (success) {
    return <SuccessState onReturnHome={() => router.push("/")} />;
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-[#0a2540] rounded-3xl shadow-2xl overflow-hidden font-sans border border-white/10">
      <div className="p-8 md:p-14">
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
                  We have quickly checked your document's text to ensure proper
                  spelling and formatting. Please review the text above to make
                  sure it is correct. If you agree, click "Confirm & Submit"
                  below.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Form Action Footer */}
      <div className="bg-black/20 backdrop-blur-sm p-8 md:px-14 border-t border-white/10 flex justify-end sticky bottom-0 z-10 transition-all">
        <Button
          onClick={() => handleAutoCorrection(setExtractedText)}
          disabled={
            isSubmitting || isParsing || isFixingText || !file || !extractedText
          }
          size="lg"
          className={`px-10 py-7 text-xl rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed font-medium w-full sm:w-auto shadow-xl shadow-black/20 transition-all hover:-translate-y-0.5 ${
            isReviewing
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-white text-[#0a2540] hover:bg-gray-100"
          }`}
        >
          {isSubmitting || isFixingText ? (
            <>
              <Loader2 className="w-6 h-6 mr-3 animate-spin" />{" "}
              {isFixingText ? "Reviewing text..." : "Submitting Offering..."}
            </>
          ) : isReviewing ? (
            "Confirm & Submit"
          ) : (
            "Submit Offering"
          )}
        </Button>
      </div>
    </div>
  );
}
