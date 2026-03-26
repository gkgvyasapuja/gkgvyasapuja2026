import React from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  onReturnHome: () => void;
}

export function SuccessState({ onReturnHome }: Props) {
  return (
    <div className="w-full max-w-3xl mx-auto bg-[#0a2540] rounded-3xl shadow-xl p-12 text-center transform transition-all animate-in fade-in zoom-in-95 font-sans">
      <div className="w-24 h-24 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-8">
        <CheckCircle2 className="w-12 h-12" />
      </div>
      <h2 className="text-4xl font-bold text-white mb-4">Hare Krishna!</h2>
      <p className="text-xl text-gray-300 max-w-md mx-auto mb-10">
        Your offering for the Vyas Puja has been successfully submitted and
        stored.
      </p>
      <Button
        onClick={onReturnHome}
        size="lg"
        className="bg-white text-[#0a2540] hover:bg-gray-100 px-8 py-6 text-lg rounded-xl font-medium w-full sm:w-auto"
      >
        Return to Home
      </Button>
    </div>
  );
}
