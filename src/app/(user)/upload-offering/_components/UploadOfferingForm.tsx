"use client";

import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";

import {
  checkUserByEmail,
  type ExistingUserProfile,
} from "@/app/(admin)/actions/offering";
import { useOfferingForm } from "../_hooks/useOfferingForm";
import { useLocationData } from "../_hooks/useLocationData";
import { useDocumentHandling } from "../_hooks/useDocumentHandling";
import { useSubmitOffering } from "../_hooks/useSubmitOffering";

import { PersonalInfoSection } from "./PersonalInfoSection";
import { InitiationSection } from "./InitiationSection";
import { LocationSection } from "./LocationSection";
import { DocumentSection } from "./DocumentSection";
import { ExistingUserModal } from "./ExistingUserModal";
import { OfferingFormData } from "./types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function profileToFormData(
  user: ExistingUserProfile,
  language: string,
): OfferingFormData {
  return {
    firstName: user.firstName,
    lastName: user.lastName,
    gender: user.gender,
    email: user.email,
    phone: user.phone,
    initiated: user.initiated,
    initiatedName: user.initiatedName,
    initiationType: user.initiationType,
    initiationYear: user.initiationYear,
    countryId: user.countryId,
    stateId: user.stateId,
    cityId: user.cityId,
    templeId: user.templeId,
    language,
  };
}

function emptyFormExceptEmail(email: string): OfferingFormData {
  return {
    firstName: "",
    lastName: "",
    gender: "",
    email,
    phone: "",
    initiated: false,
    initiatedName: "",
    initiationType: "",
    initiationYear: "",
    countryId: "",
    stateId: "",
    cityId: "",
    templeId: "",
    language: "English",
  };
}

// ─── Guidance content (Step 1) ───────────────────────────────────────────────
function GuidanceStep() {
  return (
    <div className="space-y-10">
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-semibold text-black mb-4 tracking-tight mt-4">
          Importance of Vyasa-puja for a Disciple
        </h2>
        <p className="py-3 text-slate-700">
          The appearance day of our dear Gurudeva, His Holiness Gopal Krishna
          Goswami Maharaja falls on the most auspicious day of Annada Ekadashi.
          It is a very special day not only for his disciples but for the entire
          ISKCON society, because he has won everyone&apos;s hearts by his
          compassionate nature.
        </p>
        <p className="py-3 text-slate-700">
          We are eternally indebted to Guru Maharaja for showing us the path of
          devotion and as a small gesture of love towards him, we attempt to
          write the Vyasa Puja offering and glorify him. Every year, disciples
          from all over the world mail these offerings in advance, then they are
          compiled into a book called the Vyasa Puja book of the year.
        </p>
        <p className="py-3 text-slate-700">
          On the auspicious day of Guru Maharaja&apos;s appearance, this book is
          presented to Gurudeva, who opens the book and reads the offerings.
          This is the moment which the disciples are anxiously waiting for,
          hoping that Guru Maharaja reads their offering. So in short, our love
          for our Guru is expressed through our Vyasa Puja offerings. Each of
          the offerings written by disciples comes straight from their heart,
          there is no doubt about it, but sharing some of the tips to make our
          offerings exceptionally good.
        </p>
      </div>

      <div className="w-full bg-white border border-slate-200 shadow-lg rounded-3xl p-8">
        <div className="text-center mb-6">
          <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-2 tracking-tight">
            How to Write Vyasa Puja Offering
          </h2>
          <p className="text-sm md:text-base text-slate-600 max-w-3xl mx-auto">
            Follow these steps for structuring a heartfelt and respectful
            offering.
          </p>
        </div>

        <div className="space-y-5 text-slate-700">
          <section className="bg-sky-50 border-l-4 border-sky-400 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-sky-700">Addressing</h3>
            <p className="mt-2">
              Start with a respectful salutation to Guru Maharaja (e.g. Dear
              Guru Maharaja), then ask for permission to offer humble obeisances
              at the dust of his lotus feet.
            </p>
          </section>

          <section className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-amber-700">
              Main Offering
            </h3>
            <p>
              Share your sincere experience, how wisdom from Guru Maharaja has
              touched you, and relate it to guru-pranamantra or a relevant
              shloka.
            </p>
            <blockquote className="mt-3 rounded-lg border border-amber-200 bg-white p-4 text-sm text-slate-800">
              <p className="mb-1">
                &ldquo;titiksavah karunikah, suhrdah sarva-dehinam&rdquo;
              </p>
              <p className="mb-0">
                &ldquo;ajata-satravah santah, sadhavah sadhu-bhusanah&rdquo;
              </p>
            </blockquote>
            <p className="mt-3 text-slate-600">
              (SB CANTO 3 CHAP 25 TEXT 21) – The symptoms of a sadhu are
              tolerance, mercy and friendliness. He is peaceful and follows
              scripture.
            </p>
          </section>

          <section className="bg-slate-100 border-l-4 border-slate-400 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-slate-900">
              Personal Gratitude
            </h3>
            <ul className="list-disc pl-5 space-y-2 text-slate-700">
              <li>
                Mention what Guru Maharaja has done for your spiritual growth
                and service.
              </li>
              <li>
                Highlight your devotional activities (preaching, book
                distribution, service).
              </li>
              <li>
                Keep it humble; this is an offering, not personal promotion.
              </li>
            </ul>
          </section>

          <section className="bg-gradient-to-r from-indigo-50 via-white to-blue-50 border border-blue-200 p-5 rounded-xl">
            <h3 className="text-lg font-semibold text-blue-900">Ending</h3>
            <p className="mt-2 text-slate-700">
              Close with prayer for Guru Maharaja&apos;s long life and health,
              then sign with your name and temple affiliation.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

// ─── Main form component ──────────────────────────────────────────────────────
export default function UploadOfferingForm() {
  const router = useRouter();
  const formContainerRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [error, setError] = useState<string | null>(null);
  const [existingUserModalOpen, setExistingUserModalOpen] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const savedProfileRef = useRef<ExistingUserProfile | null>(null);
  const dismissedModalEmailRef = useRef<string | null>(null);

  const { formData, setFormData, handleInputChange, handleSelectChange } =
    useOfferingForm();
  const { countries, states, cities, temples } = useLocationData(
    formData,
    setFormData,
  );
  const { file, extractedText, setExtractedText, isParsing, handleFileChange } =
    useDocumentHandling(setError);

  const [suggestionRequiresAction, setSuggestionRequiresAction] =
    useState(false);
  const [suggestionActionCompleted, setSuggestionActionCompleted] =
    useState(false);

  const {
    isSubmitting,
    success,
    setSuccess,
    submitFinal,
    validateStep1,
    validateStep2,
    handleAutoCorrection,
    isFixingText,
    setIsReviewing,
    isReviewing,
  } = useSubmitOffering(formData, setFormData, file, extractedText, setError);

  useEffect(() => {
    if (success) {
      setSuccessModalOpen(true);
    }
  }, [success]);

  const handleCloseModal = () => {
    setSuccessModalOpen(false);
    setSuccess(false);
    router.push("/");
  };

  const handleModalClose = (open: boolean) => {
    if (!open) {
      // Reset form to initial state
      setStep(1);
      setSuccess(false);
      setError(null);
      setFormData({
        firstName: "",
        lastName: "",
        gender: "",
        email: "",
        phone: "",
        initiated: false,
        initiatedName: "",
        initiationType: "",
        initiationYear: "",
        countryId: "",
        stateId: "",
        cityId: "",
        templeId: "",
        language: "English",
      });
      setExtractedText("");
      setSuggestionRequiresAction(false);
      setSuggestionActionCompleted(false);
      setIsReviewing(false);
      // Reset file input
      const fileInput = document.getElementById(
        "offering-doc-upload",
      ) as HTMLInputElement;
      if (fileInput) {
        fileInput.value = "";
      }
      // Refresh the page
      window.location.reload();
    }
  };

  const handleEmailChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    handleInputChange(e);
    if (e.target.name === "email") {
      dismissedModalEmailRef.current = null;
    }
  };

  const handleEmailBlur = async () => {
    const email = formData.email.trim();
    if (!email || !EMAIL_RE.test(email)) return;
    if (dismissedModalEmailRef.current === email.toLowerCase()) return;

    setCheckingEmail(true);
    setError(null);
    try {
      const result = await checkUserByEmail(email);
      if (!result.exists) {
        if ("error" in result && result.error) setError(result.error);
        return;
      }
      savedProfileRef.current = result.user;
      setExistingUserModalOpen(true);
    } finally {
      setCheckingEmail(false);
    }
  };

  const handleUseSavedProfile = () => {
    const profile = savedProfileRef.current;
    if (profile) {
      setFormData((prev) => profileToFormData(profile, prev.language));
    }
    dismissedModalEmailRef.current = formData.email.trim().toLowerCase();
    savedProfileRef.current = null;
  };

  const handleSkipAndReenter = () => {
    setFormData((prev) => emptyFormExceptEmail(prev.email.trim()));
    dismissedModalEmailRef.current = formData.email.trim().toLowerCase();
    savedProfileRef.current = null;
  };

  return (
    <>
      <ExistingUserModal
        open={existingUserModalOpen}
        onOpenChange={setExistingUserModalOpen}
        onUseSaved={handleUseSavedProfile}
        onSkipAndReenter={handleSkipAndReenter}
      />
      <Dialog
        open={successModalOpen}
        onOpenChange={handleModalClose}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center">
            <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <DialogTitle className="text-2xl font-bold text-gray-900">
              Hare Krishna!
            </DialogTitle>
            <DialogDescription className="text-gray-600 pt-2">
              Your offering for the Vyas Puja has been successfully submitted
              and stored.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center gap-3 pt-4 flex-col-reverse sm:flex-row">
            <Button
              onClick={() => handleModalClose(false)}
              variant="outline"
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCloseModal}
              className="bg-blue-600 text-white hover:bg-blue-700 w-full sm:w-auto"
            >
              Return to Home
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div
        ref={formContainerRef}
        className="w-full flex flex-col items-center gap-6"
      >
        {/* Stepper */}
        <div className="w-full max-w-md mx-auto">
          <div className="relative flex items-start justify-between px-6">
            <div className="absolute left-10 right-10 top-4 h-px bg-slate-200" />
            {STEPS.map((s) => {
              const isActive = step === s.num;
              const isDone = step > s.num;
              return (
                <div
                  key={s.num}
                  className="relative flex flex-col items-center"
                >
                  <div
                    className={[
                      "size-8 rounded-full flex items-center justify-center text-xs font-extrabold border transition-colors",
                      isActive
                        ? "bg-amber-400 border-amber-400 text-slate-900"
                        : isDone
                          ? "bg-slate-200 border-slate-200 text-slate-700"
                          : "bg-slate-100 border-slate-200 text-slate-500",
                    ].join(" ")}
                  >
                    {s.num}
                  </div>
                  <div
                    className={[
                      "mt-2 text-[10px] font-extrabold tracking-[0.18em]",
                      isActive ? "text-slate-800" : "text-slate-400",
                    ].join(" ")}
                  >
                    {s.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="w-full max-w-6xl mx-auto overflow-hidden font-sans">
          <div className="p-8 md:p-10">
            {error && (
              <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-700 text-sm font-medium flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5 text-red-700">
                  !
                </div>
                <p>{error}</p>
              </div>
            )}

            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {/* ── Step 1: Guidance ── */}
              {step === 1 && <GuidanceStep />}

              {/* ── Step 2: Identity ── */}
              {step === 2 && (
                <>
                  <PersonalInfoSection
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleSelectChange={handleSelectChange}
                    onEmailChange={handleEmailChange}
                    onEmailBlur={handleEmailBlur}
                    isCheckingEmail={checkingEmail}
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

              {/* ── Steps 3 & 4: Document / Confirm ── */}
              {(step === 3 || step === 4) && (
                <>
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
                    onSuggestionStateChange={(
                      requiresAction,
                      actionCompleted,
                    ) => {
                      setSuggestionRequiresAction(requiresAction);
                      setSuggestionActionCompleted(actionCompleted);
                    }}
                  />
                  {step === 4 && isReviewing && (
                    <div className="p-5 bg-blue-50 border border-blue-100 rounded-2xl text-slate-800 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2">
                      <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5 text-blue-700">
                        i
                      </div>
                      <div className="flex flex-col gap-1">
                        <p className="font-semibold text-slate-900">
                          Review your offering
                        </p>
                        <p className="text-md text-slate-700">
                          We have quickly checked your document&apos;s text to
                          ensure proper spelling and formatting. Please review
                          the text above to make sure it is correct. If you
                          agree, click &ldquo;Confirm &amp; Submit&rdquo; below.
                        </p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* ── Form Action Footer ── */}
          <div
            className={
              step > 1
                ? "bg-white p-6 md:px-10 border-t border-slate-100 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 w-full min-w-0"
                : "bg-white p-6 md:px-10 border-t border-slate-100 flex flex-row justify-end items-center gap-4 w-full min-w-0"
            }
          >
            {step > 1 ? (
              <Button
                onClick={() => {
                  if (step === 3) {
                    setIsReviewing(false);
                    setSuggestionRequiresAction(false);
                    setSuggestionActionCompleted(false);
                  }
                  setStep((prev) => (prev - 1) as 1 | 2);
                  // Scroll to form container
                  setTimeout(() => {
                    formContainerRef.current?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }, 0);
                }}
                variant="ghost"
                disabled={isSubmitting || isFixingText}
                className="text-slate-600 hover:bg-slate-100 px-2 py-2 text-sm rounded-full gap-1.5 self-start sm:self-auto shrink-0"
              >
                <ArrowLeft className="size-4 shrink-0" aria-hidden />
                Go Back
              </Button>
            ) : (
              <div />
            )}

            <Button
              onClick={() => {
                if (step === 1) {
                  if (validateStep1()) {
                    setStep(2);
                    // Scroll to form container
                    setTimeout(() => {
                      formContainerRef.current?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    }, 0);
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
                (step === 2 && (!file || !extractedText)) ||
                (step === 3 &&
                  suggestionRequiresAction &&
                  !suggestionActionCompleted)
              }
              size="lg"
              className={`h-12 px-8 rounded-full disabled:opacity-50 disabled:cursor-not-allowed font-semibold w-full sm:w-auto min-w-0 shadow-sm transition-colors ${step === 4
                ? "bg-slate-900 text-white hover:bg-slate-800"
                : "bg-amber-400 text-slate-900 hover:bg-amber-300"
                }`}
            >
              {isSubmitting || isFixingText ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />{" "}
                  {isFixingText ? "Reviewing text..." : "Submitting..."}
                </>
              ) : step === 1 ? (
                "Continue to Step 2"
              ) : step === 2 ? (
                "Verify Document"
              ) : (
                "Confirm & Submit"
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}