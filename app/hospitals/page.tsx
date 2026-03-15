"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchForm } from "@/components/search-form";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import {
  ArrowLeft,
  ExternalLink,
  Hospital,
  MapPin,
  MessageSquare,
  Navigation,
} from "lucide-react";

type HospitalCard = {
  id: string;
  name: string;
  distance: number | null;
  address: string;
  coordinates: {
    lat: number | null;
    lon: number | null;
  };
};

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

const normalizeHospital = (
  hospital: Record<string, unknown>,
  index: number
): HospitalCard => {
  const coordinates =
    typeof hospital.coordinates === "object" && hospital.coordinates !== null
      ? hospital.coordinates
      : {};

  return {
    id:
      typeof hospital.id === "string" && hospital.id.trim()
        ? hospital.id
        : `hospital-${index}`,
    name:
      typeof hospital.name === "string" && hospital.name.trim()
        ? hospital.name
        : "Unnamed hospital",
    distance: isFiniteNumber(hospital.distance) ? hospital.distance : null,
    address:
      typeof hospital.address === "string" && hospital.address.trim()
        ? hospital.address
        : "Address not available",
    coordinates: {
      lat: isFiniteNumber((coordinates as { lat?: unknown }).lat)
        ? (coordinates as { lat: number }).lat
        : null,
      lon: isFiniteNumber((coordinates as { lon?: unknown }).lon)
        ? (coordinates as { lon: number }).lon
        : null,
    },
  };
};

const getDistanceLabel = (distance: number | null) =>
  isFiniteNumber(distance) ? `${distance.toFixed(1)} km away` : "Distance unavailable";

const getHospitalMapHref = (hospital: HospitalCard) =>
  isFiniteNumber(hospital.coordinates.lat) &&
  isFiniteNumber(hospital.coordinates.lon)
    ? `https://www.google.com/maps/search/?api=1&query=${hospital.coordinates.lat},${hospital.coordinates.lon}`
    : null;

function HospitalSkeleton() {
  return (
    <div className="rounded-[1.75rem] border border-[#e6dfd6] bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
      <div className="animate-pulse space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-3">
            <div className="h-7 w-52 rounded bg-[#eee8de]" />
            <div className="h-4 w-72 rounded bg-[#f3eee6]" />
          </div>
          <div className="h-8 w-20 rounded-full bg-[#eef3ff]" />
        </div>
        <div className="h-4 w-32 rounded bg-[#f3eee6]" />
        <div className="flex gap-3">
          <div className="h-11 w-32 rounded-full bg-[#eef3ff]" />
          <div className="h-11 w-36 rounded-full bg-[#f4f1eb]" />
        </div>
      </div>
    </div>
  );
}

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[1.9rem] border border-dashed border-[#ddd6ca] bg-white/80 px-6 py-12 text-center shadow-[0_16px_40px_rgba(15,23,42,0.04)]">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#eef3ff] text-[#4c65da]">
        <Hospital className="h-7 w-7" />
      </div>
      <h2 className="mt-5 text-2xl font-semibold tracking-tight text-slate-950">
        {title}
      </h2>
      <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-slate-600">
        {description}
      </p>
    </div>
  );
}

function HospitalsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pincode = searchParams.get("pincode")?.trim() ?? "";
  const [hospitals, setHospitals] = useState<HospitalCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!pincode) {
      setHospitals([]);
      setError(null);
      setLoading(false);
      return;
    }

    let isActive = true;
    const controller = new AbortController();

    const fetchHospitals = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/hospitals?pincode=${encodeURIComponent(pincode)}`,
          {
            cache: "no-store",
            signal: controller.signal,
          }
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch hospitals.");
        }

        if (!isActive) {
          return;
        }

        const normalizedHospitals = Array.isArray(data.hospitals)
          ? (data.hospitals as unknown[]).map((hospital, index) => {
              const hospitalRecord =
                typeof hospital === "object" && hospital !== null
                  ? (hospital as Record<string, unknown>)
                  : ({} as Record<string, unknown>);

              return normalizeHospital(hospitalRecord, index);
            })
          : [];

        setHospitals(normalizedHospitals);
      } catch (error) {
        if (controller.signal.aborted || !isActive) {
          return;
        }

        console.error("Error fetching hospitals:", error);

        const message =
          error instanceof Error
            ? error.message
            : "Failed to fetch hospitals. Please try again.";

        setHospitals([]);
        setError(message);

        toast({
          title: "Hospital lookup failed",
          description: message,
          variant: "destructive",
        });
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    void fetchHospitals();

    return () => {
      isActive = false;
      controller.abort();
    };
  }, [pincode]);

  const handleChatClick = (hospitalId: string) => {
    router.push(`/app?hospital=${hospitalId}`);
  };

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-96px)] w-full max-w-6xl flex-col px-4 pb-16 pt-8">
      <div className="rounded-[2.25rem] border border-[#e7dfd4] bg-white/84 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.06)] backdrop-blur sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-[#e5ddd2] bg-[#faf8f4] px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-white hover:text-slate-950"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to website
            </Link>

            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#dbe4ff] bg-[#eef3ff] px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#4861d3]">
              <Navigation className="h-3.5 w-3.5" />
              Hospital finder
            </div>

            <h1 className="font-display mt-6 text-4xl leading-tight tracking-[-0.04em] text-slate-950 sm:text-5xl">
              Find nearby hospitals from a pincode that actually works.
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
              Enter a 6-digit pincode to search for nearby hospitals, open the
              result in maps, or continue into the MedConnect assistant for the
              next step.
            </p>
          </div>

          <div className="w-full max-w-xl">
            <SearchForm
              initialValue={pincode}
              className="max-w-none px-0"
              placeholder="Enter a 6-digit pincode"
              submitLabel="Find"
              inputClassName="h-14 rounded-2xl border-[#d9ded3] bg-[#fcfbf8] pr-28 text-base"
              buttonClassName="rounded-xl border border-[#d9e3ff] bg-[#edf2ff] text-[#2748b7] hover:bg-[#e5ecff]"
            />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {[
            "Live hospital proximity lookup",
            "Google Maps handoff",
            "Continue into MedConnect AI chat",
          ].map((item) => (
            <div
              key={item}
              className="rounded-full border border-[#ebe4da] bg-white px-4 py-2 text-sm font-medium text-slate-600"
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        {!pincode ? (
          <EmptyState
            title="Search by pincode"
            description="This page no longer depends on a hidden query flow. Enter a pincode above and MedConnect will return nearby hospitals here."
          />
        ) : loading ? (
          <div className="space-y-4">
            <HospitalSkeleton />
            <HospitalSkeleton />
            <HospitalSkeleton />
          </div>
        ) : error ? (
          <EmptyState
            title="We couldn't complete that lookup"
            description={error}
          />
        ) : hospitals.length === 0 ? (
          <EmptyState
            title={`No hospitals found near ${pincode}`}
            description="Try a nearby pincode or search again. Data is sourced live, so result density can vary by location."
          />
        ) : (
          <div>
            <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500">
                  Search results
                </p>
                <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
                  {hospitals.length} hospitals near {pincode}
                </h2>
              </div>
              <div className="rounded-full border border-[#dde5ff] bg-[#eef3ff] px-4 py-2 text-sm font-medium text-[#2748b7]">
                Results sorted by distance
              </div>
            </div>

            <div className="space-y-4">
              {hospitals.map((hospital) => {
                const mapHref = getHospitalMapHref(hospital);

                return (
                  <div
                    key={hospital.id}
                    className="rounded-[1.75rem] border border-[#e6dfd6] bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.05)] transition-shadow hover:shadow-[0_20px_48px_rgba(15,23,42,0.08)]"
                  >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-xl font-semibold tracking-tight text-slate-950">
                            {hospital.name}
                          </h3>
                          <div className="rounded-full border border-[#dbe4ff] bg-[#eef3ff] px-3 py-1 text-sm font-medium text-[#2748b7]">
                            {getDistanceLabel(hospital.distance)}
                          </div>
                        </div>

                        <div className="mt-4 flex items-start gap-3 text-slate-600">
                          <MapPin className="mt-1 h-4 w-4 shrink-0 text-slate-400" />
                          <span className="text-base leading-7">
                            {hospital.address}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <Button
                          variant="outline"
                          className="h-11 rounded-full border-[#d9e3ff] bg-[#edf2ff] px-5 text-[#2748b7] hover:bg-[#e5ecff]"
                          onClick={() => handleChatClick(hospital.id)}
                        >
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Chat with MedConnect
                        </Button>

                        {mapHref ? (
                          <Button
                            asChild
                            variant="outline"
                            className="h-11 rounded-full border-[#e5ddd2] bg-white px-5 text-slate-900 hover:bg-[#fcfbf8]"
                          >
                            <a
                              href={mapHref}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Open in Maps
                              <ExternalLink className="ml-2 h-4 w-4" />
                            </a>
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            disabled
                            className="h-11 rounded-full border-[#e5ddd2] bg-white px-5 text-slate-500"
                          >
                            Map unavailable
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function HospitalsPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto flex min-h-[calc(100dvh-96px)] w-full max-w-6xl flex-col px-4 pb-16 pt-8">
          <div className="rounded-[2.25rem] border border-[#e7dfd4] bg-white/84 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.06)] backdrop-blur sm:p-8">
            <div className="animate-pulse space-y-4">
              <div className="h-10 w-40 rounded bg-[#eee8de]" />
              <div className="h-12 w-full max-w-2xl rounded bg-[#f3eee6]" />
              <div className="h-6 w-full max-w-3xl rounded bg-[#f3eee6]" />
              <div className="h-14 w-full max-w-xl rounded-2xl bg-[#eef3ff]" />
            </div>
          </div>
        </div>
      }
    >
      <HospitalsContent />
    </Suspense>
  );
}
