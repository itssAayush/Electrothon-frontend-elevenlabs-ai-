"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";

type SearchFormProps = {
  initialValue?: string;
  className?: string;
  inputClassName?: string;
  buttonClassName?: string;
  placeholder?: string;
  submitLabel?: string;
};

const PINCODE_PATTERN = /^\d{6}$/;

export function SearchForm({
  initialValue = "",
  className,
  inputClassName,
  buttonClassName,
  placeholder = "Enter your pincode...",
  submitLabel = "Search",
}: SearchFormProps) {
  const [pincode, setPincode] = useState(initialValue);
  const router = useRouter();

  useEffect(() => {
    setPincode(initialValue);
  }, [initialValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedPincode = pincode.trim();

    if (!PINCODE_PATTERN.test(normalizedPincode)) {
      toast({
        title: "Invalid pincode",
        description: "Enter a valid 6-digit pincode to find nearby hospitals.",
        variant: "destructive",
      });
      return;
    }

    router.push(`/hospitals?pincode=${encodeURIComponent(normalizedPincode)}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("w-full max-w-xl mx-auto px-4 sm:px-0", className)}
    >
      <div className="relative flex items-center">
        <div className="relative w-full">
          <Input
            type="text"
            inputMode="numeric"
            maxLength={6}
            pattern="\d{6}"
            placeholder={placeholder}
            value={pincode}
            onChange={(e) =>
              setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))
            }
            className={cn(
              "w-full h-12 rounded-xl border-[#d9ded3] bg-white pr-28 pl-4 text-base text-slate-900 shadow-[0_14px_30px_rgba(15,23,42,0.05)] placeholder:text-slate-400 focus-visible:ring-[#5b6ee1]/35 sm:h-14 sm:rounded-2xl sm:pl-5",
              inputClassName
            )}
          />
          <Button
            type="submit"
            size="lg"
            className={cn(
              "absolute right-1 top-1 h-10 rounded-lg px-3 text-sm font-medium sm:right-1.5 sm:top-1.5 sm:h-11 sm:rounded-xl sm:px-4 sm:text-base",
              buttonClassName
            )}
          >
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline">{submitLabel}</span>
          </Button>
        </div>
      </div>
    </form>
  );
}
