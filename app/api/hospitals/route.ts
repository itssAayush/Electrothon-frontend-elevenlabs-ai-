import { NextRequest, NextResponse } from "next/server";
import {
  formatHospitalData,
  getHospitalsNearby,
  getPincodeCoordinates,
} from "@/lib/openstreetmap";

const PINCODE_PATTERN = /^\d{6}$/;
const isFiniteNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

export async function GET(request: NextRequest) {
  const pincode = request.nextUrl.searchParams.get("pincode")?.trim() ?? "";

  if (!pincode) {
    return NextResponse.json(
      { error: "Pincode is required." },
      { status: 400 }
    );
  }

  if (!PINCODE_PATTERN.test(pincode)) {
    return NextResponse.json(
      { error: "Enter a valid 6-digit pincode." },
      { status: 400 }
    );
  }

  try {
    const coordinates = await getPincodeCoordinates(pincode);
    const nearbyHospitals = await getHospitalsNearby(coordinates);

    const hospitals = nearbyHospitals
      .map((hospital) =>
        formatHospitalData(hospital, coordinates.lat, coordinates.lon)
      )
      .filter(
        (hospital) =>
          Boolean(hospital.id) &&
          Boolean(hospital.name) &&
          isFiniteNumber(hospital.distance) &&
          isFiniteNumber(hospital.coordinates?.lat) &&
          isFiniteNumber(hospital.coordinates?.lon)
      )
      .sort((left, right) => left.distance - right.distance)
      .filter(
        (hospital, index, allHospitals) =>
          allHospitals.findIndex(
            (candidate) =>
              candidate.name === hospital.name &&
              candidate.coordinates.lat === hospital.coordinates.lat &&
              candidate.coordinates.lon === hospital.coordinates.lon
          ) === index
      );

    return NextResponse.json({
      pincode,
      coordinates,
      hospitals,
    });
  } catch (error) {
    console.error("Hospital lookup failed:", error);

    const message =
      error instanceof Error ? error.message : "Failed to fetch hospitals.";

    if (message === "Pincode not found") {
      return NextResponse.json(
        { error: "We could not find that pincode." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Hospital lookup is temporarily unavailable." },
      { status: 502 }
    );
  }
}
