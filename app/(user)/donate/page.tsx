"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";

const bankDetails = [
  { label: "Account Name", value: "Karunasindhu" },
  { label: "Bank", value: "Indian Overseas Bank" },
  { label: "Branch", value: "ISKCON Juhu" },
  { label: "Account Number", value: "124501000010370" },
  { label: "IFSC Code", value: "IOBA0001245" },
];

export default function Donate() {
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Heading */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Donate</h1>
        <p className="text-muted-foreground">
          Support us via secure bank transfer
        </p>
      </div>

      {/* Card */}
      <Card className="rounded-2xl shadow-md">
        <CardHeader>
          <CardTitle>Bank Transfer</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {bankDetails.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between border-b pb-3"
            >
              <div>
                <p className="text-sm text-muted-foreground">{item.label}</p>
                <p className="font-medium">{item.value}</p>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleCopy(item.value)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          ))}

          {/* Note */}
          <div className="bg-muted p-4 rounded-xl text-sm">
            <p>
              After making the transfer, please send a screenshot along with
              your name and address to{" "}
              <span className="font-medium text-primary">
                donations@vyasapuja.com
              </span>{" "}
              for a digital receipt.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
