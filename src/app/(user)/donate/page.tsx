"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

const bankDetails = [
  { label: "Account Name", value: "Karunasindhu" },
  { label: "Bank", value: "Indian Overseas Bank" },
  { label: "Branch", value: "ISKCON Juhu" },
  { label: "Account Number", value: "124501000010370" },
  { label: "IFSC Code", value: "IOBA0001245" },
];

export default function Donate() {

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Donate</h1>
        <p className="text-muted-foreground">
          Support us via bank transfer or UPI using the QR code
        </p>
      </div>

      <Tabs defaultValue="neft" className="w-full">
        <TabsList className="mb-6 h-10 w-full max-w-md">
          <TabsTrigger value="neft" className="flex-1">
            NEFT
          </TabsTrigger>
          <TabsTrigger value="qr" className="flex-1">
            QR Code
          </TabsTrigger>
        </TabsList>

        <TabsContent value="neft" className="mt-0">
          <Card className="rounded-2xl border border-border/80 shadow-md">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-bold">
                Donate via NEFT / RTGS
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
              <dl className="space-y-3 text-sm">
                {bankDetails.map((item) => (
                  <div key={item.label}>
                    <dt className="inline font-semibold text-foreground">
                      {item.label}:
                    </dt>{" "}
                    <dd className="inline font-normal text-foreground">
                      {item.value}
                    </dd>
                    <Separator className='my-3' />
                  </div>
                ))}
              </dl>

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
        </TabsContent>

        <TabsContent value="qr" className="mt-0">
          <Card className="rounded-2xl border border-border/80 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg font-bold">
                Donate using QR Code
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                <div className="relative mx-auto shrink-0 sm:mx-0">
                  <Image
                    src="/asset/qr.png"
                    alt="UPI QR code for donation"
                    width={200}
                    height={200}
                    className="rounded-lg border border-border bg-white p-1"
                    priority
                  />
                </div>
              </div>

              <div className="bg-muted p-4 rounded-xl text-sm">
                <p>
                  After donating, please send a screenshot along with your name
                  and address to{" "}
                  <span className="font-medium text-primary">
                    donations@vyasapuja.com
                  </span>{" "}
                  for a digital receipt.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
