import { useEffect, useState } from "react";
import { submitOffering } from "@/app/(admin)/actions/offering";
import { fixGrammar } from "@/app/(admin)/actions/ai";
import { OfferingFormData } from "../_components/types";
import { toast } from "sonner";

export function useSubmitOffering(
  formData: OfferingFormData,
  setFormData: React.Dispatch<React.SetStateAction<OfferingFormData>>,
  file: File | null,
  extractedText: string,
  setError: (error: string | null) => void,
  hasImages = false,
) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [isFixingText, setIsFixingText] = useState(false);
  /** True when AI returned no usable text (or threw); hides the “review” info panel so submit stays primary. */
  const [aiGrammarFailed, setAiGrammarFailed] = useState(false);

  useEffect(() => {
    setAiGrammarFailed(false);
  }, [file]);

  const validateStep1 = () => {
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.phone ||
      !formData.gender
    ) {
      setError("Please fill in all required personal information fields.");
      return false;
    }
    if (formData.initiated) {
      if (
        !formData.initiatedName ||
        !formData.initiationType ||
        !formData.initiationYear
      ) {
        setError("Please fill in all initiation details.");
        return false;
      }
    }
    if (
      !formData.countryId ||
      !formData.stateId ||
      !formData.cityId ||
      !formData.templeId
    ) {
      setError(
        "Please complete your location selection (Country down to Temple).",
      );
      return false;
    }
    if (formData.templeId === "0" && !formData.otherTempleName.trim()) {
      setError(
        "Please enter the temple or center name for the \"Other\" option.",
      );
      return false;
    }
    setError(null);
    return true;
  };

  const validateStep2 = () => {
    if (!file || !extractedText) {
      setError("Please upload a valid .docx offering document.");
      return false;
    }
    setError(null);
    return true;
  };

  const validateForm = () => {
    return validateStep1() && validateStep2();
  };

  const submitFinal = async () => {
    if (!validateForm()) return;
    if (!file) return;

    setIsSubmitting(true);
    setError(null);

    // Clean up ai-correction tags before saving
    let finalHtml = extractedText;
    if (typeof window !== "undefined") {
      const parser = new DOMParser();
      const doc = parser.parseFromString(finalHtml, "text/html");
      const nodes = doc.querySelectorAll(".ai-correction");
      nodes.forEach((node) => {
        const textNode = doc.createTextNode(node.textContent || "");
        node.parentNode?.replaceChild(textNode, node);
      });
      finalHtml = doc.body.innerHTML;
    }

    const fd = new FormData();
    fd.append("firstName", formData.firstName);
    fd.append("lastName", formData.lastName);
    fd.append("gender", formData.gender);
    fd.append("email", formData.email);
    fd.append("phone", formData.phone);
    fd.append("countryId", formData.countryId);
    fd.append("stateId", formData.stateId);
    fd.append("cityId", formData.cityId);
    fd.append("templeId", formData.templeId);
    fd.append("otherTempleName", formData.otherTempleName.trim());
    fd.append("initiated", String(formData.initiated));
    fd.append("initiationType", formData.initiationType);
    fd.append("initiationYear", formData.initiationYear);
    fd.append("initiatedName", formData.initiatedName);
    fd.append("language", formData.language);
    fd.append("offeringText", finalHtml);
    fd.append("file", file);

    const result = await submitOffering(fd);
    setIsSubmitting(false);

    if (result.success) {
      setSuccess(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setError(result.error || "Failed to submit offering.");
    }
  };

  /** Runs AI grammar review on the given HTML (typically latest `extractedText`). Submit uses `submitFinal` separately. */
  const runGrammarReview = async (
    sourceHtml: string,
    setExtractedText: (text: string) => void,
    onComplete?: () => void,
  ) => {
    if (!file || !sourceHtml.trim()) {
      setError("Please upload a valid .docx offering document.");
      return;
    }

    // Images are not sent through AI review; user can submit after preview.
    if (hasImages) {
      setError(null);
      setAiGrammarFailed(false);
      setIsReviewing(true);
      onComplete?.();
      window.scrollBy({ top: 300, behavior: "smooth" });
      return;
    }

    setIsFixingText(true);
    setError(null);
    setAiGrammarFailed(false);
    try {
      const result = await fixGrammar(sourceHtml);
      if (result.success && result.text) {
        setExtractedText(result.text);
        if (result.language) {
          setFormData((prev) => ({ ...prev, language: result.language }));
        }

        if (result.text.includes("ai-correction")) {
          toast.success(
            "We have updated some changes in the offering, if you don't want them please reject it.",
            {
              className: "bg-[#0a2540] text-white border border-white/20",
            },
          );
        } else {
          toast.success("All good! No changes from our side.", {
            className: "bg-[#0a2540] text-white border border-white/20",
          });
        }
      } else {
        setAiGrammarFailed(true);
      }
    } catch (err) {
      console.error("Grammar fix failed", err);
      setAiGrammarFailed(true);
    } finally {
      setIsFixingText(false);
      setIsReviewing(true);
      onComplete?.();
      window.scrollBy({ top: 300, behavior: "smooth" });
    }
  };

  return {
    isSubmitting,
    success,
    setSuccess,
    submitFinal,
    validateForm,
    validateStep1,
    validateStep2,
    runGrammarReview,
    isReviewing,
    isFixingText,
    setIsReviewing,
    aiGrammarFailed,
  };
}
