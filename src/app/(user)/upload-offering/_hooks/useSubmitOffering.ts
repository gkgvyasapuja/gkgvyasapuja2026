import { useState } from "react";
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
) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [isFixingText, setIsFixingText] = useState(false);

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

    const result = await submitOffering({
      ...formData,
      offeringText: finalHtml,
    });
    setIsSubmitting(false);

    if (result.success) {
      setSuccess(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setError(result.error || "Failed to submit offering.");
    }
  };

  const handleAutoCorrection = async (
    setExtractedText: (text: string) => void,
    onSuccess?: () => void
  ) => {
    if (!validateStep2()) return;

    if (!isReviewing) {
      setIsFixingText(true);
      setError(null);
      try {
        const result = await fixGrammar(extractedText);
        if (result.success && result.text) {
          setExtractedText(result.text);
          if (result.language) {
            setFormData((prev) => ({ ...prev, language: result.language }));
          }

          if (result.text.includes("ai-correction")) {
            toast.success("We have updated some changes in the offering, if you don't want them please reject it.", {
              className: "bg-[#0a2540] text-white border border-white/20",
            });
          } else {
            toast.success("All good! No changes from our side.", {
              className: "bg-[#0a2540] text-white border border-white/20",
            });
          }
        }
      } catch (err) {
        console.error("Grammar fix failed", err);
      } finally {
        setIsFixingText(false);
        setIsReviewing(true);
        if (onSuccess) onSuccess();
        // Ensure user can see the updated text
        window.scrollBy({ top: 300, behavior: "smooth" });
      }
    } else {
      await submitFinal();
    }
  };

  return {
    isSubmitting,
    success,
    submitFinal,
    validateForm,
    validateStep1,
    validateStep2,
    handleAutoCorrection,
    isReviewing,
    isFixingText,
    setIsReviewing,
  };
}
