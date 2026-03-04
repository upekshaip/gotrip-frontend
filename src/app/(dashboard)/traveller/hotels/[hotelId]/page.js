"use client";

import React, { useEffect, useState, use } from "react";
import UseFetch from "@/hooks/UseFetch";
import {
  MapPin,
  Star,
  ShieldCheck,
  ChevronLeft,
  Share2,
  Heart,
  Wifi,
  Coffee,
  Car,
  Utensils,
  CheckCircle2,
  Clock,
  Calendar as CalendarIcon,
  MessageSquare,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import MapSelector from "@/components/maps/MapSelector";
import ProfileImage from "@/components/reusable/ProfileImage";
import { routes } from "@/config/routes";

// Helper for currency formatting
const formatPrice = (price) => {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 2,
  }).format(price);
};

const HotelReservation = ({ params }) => {
  const resolvedParams = use(params);
  const router = useRouter();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [provider, setProvider] = useState("");

  // --- Reservation State ---
  const [bookingData, setBookingData] = useState({
    checkInDate: "",
    checkOutDate: "",
    checkInTime: "12:00",
    checkOutTime: "12:00",
    guests: 1,
    rooms: 1,
    requestMessage: "",
  });

  // --- Calculation State ---
  const [summary, setSummary] = useState({
    totalAmount: 0,
    discountAmount: 0,
    finalAmount: 0,
    duration: 0,
    durationUnit: "night",
  });

  // 1. Fetch Hotel Data
  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const data = await UseFetch(
          "GET",
          `/hotel-service/traveller/${resolvedParams.hotelId}`,
        );
        if (data && !data.timestamp) {
          setHotel(data.hotel);
          setProvider(data.provider);
        } else {
          toast.error("Hotel not found.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchHotel();
  }, [resolvedParams.hotelId]);

  // 2. Real-time Calculation Engine
  useEffect(() => {
    if (!hotel) return;

    const {
      checkInDate,
      checkOutDate,
      checkInTime,
      checkOutTime,
      guests,
      rooms,
    } = bookingData;
    const price = hotel.price || 0;
    const discount = hotel.discount || 0;
    let calculatedTotal = 0;
    let durationVal = 0;
    let unitLabel = "night";

    if (checkInDate && checkOutDate) {
      const startDateTime = new Date(`${checkInDate}T${checkInTime}`);
      const endDateTime = new Date(`${checkOutDate}T${checkOutTime}`);

      if (endDateTime > startDateTime) {
        if (hotel.priceUnit === "PER_DAY") {
          const diffTime = Math.abs(endDateTime - startDateTime);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          durationVal = diffDays > 0 ? diffDays : 1;
          calculatedTotal = price * rooms * durationVal;
          unitLabel = "night";
        } else if (hotel.priceUnit === "PER_HOUR") {
          const diffTime = Math.abs(endDateTime - startDateTime);
          const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
          durationVal = diffHours > 0 ? diffHours : 1;
          calculatedTotal = price * rooms * durationVal;
          unitLabel = "hour";
        } else if (hotel.priceUnit === "PER_PERSON") {
          const diffTime = Math.abs(endDateTime - startDateTime);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          durationVal = diffDays > 0 ? diffDays : 1;
          calculatedTotal = price * guests * durationVal;
          unitLabel = "night";
        }
      }
    }

    let final = calculatedTotal - discount;
    if (final < 0) final = 0;

    if (calculatedTotal === 0) {
      setSummary({
        totalAmount: 0,
        discountAmount: discount,
        finalAmount: 0,
        duration: 0,
        durationUnit: unitLabel,
      });
    } else {
      setSummary({
        totalAmount: calculatedTotal,
        discountAmount: discount,
        finalAmount: final,
        duration: durationVal,
        durationUnit: unitLabel,
      });
    }
  }, [bookingData, hotel]);

  const handleInputChange = (field, value) => {
    setBookingData((prev) => ({ ...prev, [field]: value }));
  };

  // --- 3. SUBMIT HANDLER ---
  const handleReservation = async () => {
    if (!bookingData.checkInDate || !bookingData.checkOutDate) {
      toast.error("Please select Check-in and Check-out dates.");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        hotelId: hotel.hotelId,
        personCount: bookingData.guests,
        startingDate: bookingData.checkInDate,
        startingTime: bookingData.checkInTime, // Input type="time" gives HH:mm
        endingDate: bookingData.checkOutDate,
        endingTime: bookingData.checkOutTime,
        requestMessage: bookingData.requestMessage || "No special requests",
        roomCount: bookingData.rooms,
      };

      const response = await UseFetch(
        "POST",
        "/hotel-booking/request",
        payload,
      );

      if (response && !response.error && !response.timestamp) {
        toast.success("Booking request sent successfully!");
        // Redirect to My Bookings page
        router.push(routes.traveller.myBookings.url);
      } else {
        toast.error(response.message || "Failed to create booking request.");
      }
    } catch (error) {
      console.error("Booking Error:", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  if (!hotel)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Property Unavailable
      </div>
    );

  const amenities = [
    { icon: <Wifi size={18} />, label: "Fast Wifi" },
    { icon: <Coffee size={18} />, label: "Breakfast" },
    { icon: <Car size={18} />, label: "Parking" },
    { icon: <Utensils size={18} />, label: "Dining" },
  ];

  return (
    <div className="bg-base-100 min-h-screen pb-20 font-sans text-base-content">
      {/* --- HERO IMAGE SECTION --- */}
      <div className="relative h-[60vh] w-full group">
        <img
          src={hotel.imageUrl}
          alt={hotel.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-base-100/90"></div>

        {/* Nav */}
        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start">
          <button
            onClick={() => router.back()}
            className="btn btn-circle btn-ghost bg-white/20 backdrop-blur-md text-white hover:bg-white/40 border-none"
          >
            <ChevronLeft size={24} />
          </button>
        </div>

        {/* Hero Text */}
        <div className="absolute bottom-0 left-0 right-0 px-6 lg:px-12 pb-12 pt-24">
          <div className="max-w-7xl mx-auto">
            {hotel.featured && (
              <span className="badge badge-accent badge-lg font-bold uppercase tracking-wider mb-2">
                Featured
              </span>
            )}
            <h1 className="text-3xl md:text-5xl font-black text-base-content leading-tight">
              {hotel.name}
            </h1>
            <div className="flex items-center gap-4 text-base-content/80 font-medium mt-2">
              <span className="flex items-center gap-1">
                <MapPin size={18} className="text-primary" /> {hotel.city}, Sri
                Lanka
              </span>
              <span className="flex items-center gap-1">
                <Star size={18} className="fill-warning text-warning" /> 4.92
                (128 reviews)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* --- MAIN GRID LAYOUT --- */}
      <div className="mx-auto px-6 lg:px-8 mt-8 grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* LEFT COLUMN: INFO */}
        <div className="lg:col-span-2 space-y-12">
          {/* Host */}
          <div className="flex items-center justify-between border-b border-base-200 pb-8">
            <div className="space-y-1">
              <h3 className="text-xl font-bold">Hosted by {provider}</h3>
              <p className="opacity-60 text-sm">Superhost • 5 years hosting</p>
            </div>
            <div className="avatar placeholder">
              <ProfileImage name={provider} size={40} />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">About this place</h3>
            <p className="leading-relaxed opacity-80">{hotel.description}</p>
          </div>

          {/* Amenities Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {amenities.map((item, i) => (
              <div
                key={i}
                className="flex flex-col items-center justify-center p-6 border border-base-200 rounded-2xl hover:bg-base-200/50 transition-all"
              >
                <div className="mb-3 opacity-70">{item.icon}</div>
                <span className="font-bold text-sm">{item.label}</span>
              </div>
            ))}
          </div>

          {/* Map */}
          <div className="h-[300px] w-full rounded-3xl overflow-hidden shadow-lg border border-base-200 relative">
            <MapSelector
              lat={hotel.latitude}
              lng={hotel.longitude}
              onChange={() => {}}
            />
          </div>
        </div>

        {/* RIGHT COLUMN: BOOKING CALCULATOR */}
        <div className="relative h-full">
          <div className="sticky top-24">
            <div className="card bg-base-100 shadow-2xl border border-base-200 overflow-hidden">
              <div className="card-body p-6 md:p-8 space-y-6">
                {/* Header: Price per Unit */}
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="text-3xl font-black text-primary">
                      {formatPrice(hotel.price)}
                    </span>
                    <span className="text-sm opacity-60 font-medium uppercase tracking-wide ml-1">
                      {hotel.priceUnit === "PER_HOUR"
                        ? "/ hour"
                        : hotel.priceUnit === "PER_PERSON"
                          ? "/ person"
                          : "/ night"}
                    </span>
                  </div>
                </div>

                {/* --- DYNAMIC INPUT GROUP --- */}
                <div className="border border-base-300 rounded-2xl overflow-hidden bg-base-100">
                  {/* Row 1: Dates */}
                  <div className="grid grid-cols-2 border-b border-base-300">
                    <div className="p-3 hover:bg-base-200 transition-colors border-r border-base-300 relative">
                      <label className="text-[10px] uppercase font-bold opacity-50 block mb-1 flex items-center gap-1">
                        <CalendarIcon size={10} /> Check-in
                      </label>
                      <input
                        type="date"
                        className="w-full bg-transparent text-sm font-bold focus:outline-none"
                        onChange={(e) =>
                          handleInputChange("checkInDate", e.target.value)
                        }
                        min={new Date().toISOString().split("T")[0]}
                      />
                    </div>
                    <div className="p-3 hover:bg-base-200 transition-colors relative">
                      <label className="text-[10px] uppercase font-bold opacity-50 block mb-1 flex items-center gap-1">
                        <CalendarIcon size={10} /> Check-out
                      </label>
                      <input
                        type="date"
                        className="w-full bg-transparent text-sm font-bold focus:outline-none"
                        onChange={(e) =>
                          handleInputChange("checkOutDate", e.target.value)
                        }
                        min={bookingData.checkInDate}
                      />
                    </div>
                  </div>

                  {/* Row 2: Times (Only if PER_HOUR) */}
                  {hotel.priceUnit === "PER_HOUR" && (
                    <div className="grid grid-cols-2 border-b border-base-300">
                      <div className="p-3 hover:bg-base-200 transition-colors border-r border-base-300">
                        <label className="text-[10px] uppercase font-bold opacity-50 block mb-1 flex items-center gap-1">
                          <Clock size={10} /> Time In
                        </label>
                        <input
                          type="time"
                          value={bookingData.checkInTime}
                          className="w-full bg-transparent text-sm font-bold focus:outline-none"
                          onChange={(e) =>
                            handleInputChange("checkInTime", e.target.value)
                          }
                        />
                      </div>
                      <div className="p-3 hover:bg-base-200 transition-colors">
                        <label className="text-[10px] uppercase font-bold opacity-50 block mb-1 flex items-center gap-1">
                          <Clock size={10} /> Time Out
                        </label>
                        <input
                          type="time"
                          value={bookingData.checkOutTime}
                          className="w-full bg-transparent text-sm font-bold focus:outline-none"
                          onChange={(e) =>
                            handleInputChange("checkOutTime", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  )}

                  {/* Row 3: Counts (Guests & Rooms) */}
                  <div className="grid grid-cols-2 border-b border-base-300">
                    <div className="p-3 hover:bg-base-200 transition-colors border-r border-base-300 flex flex-col justify-center">
                      <label className="text-[10px] uppercase font-bold opacity-50 block mb-1">
                        Guests
                      </label>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold">
                          {bookingData.guests}
                        </span>
                        <div className="flex gap-1">
                          <button
                            onClick={() =>
                              handleInputChange(
                                "guests",
                                Math.max(1, bookingData.guests - 1),
                              )
                            }
                            className="btn btn-xs btn-circle btn-ghost border-base-300"
                          >
                            -
                          </button>
                          <button
                            onClick={() =>
                              handleInputChange(
                                "guests",
                                bookingData.guests + 1,
                              )
                            }
                            className="btn btn-xs btn-circle btn-ghost border-base-300"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 hover:bg-base-200 transition-colors flex flex-col justify-center">
                      <label className="text-[10px] uppercase font-bold opacity-50 block mb-1">
                        Rooms
                      </label>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold">
                          {bookingData.rooms}
                        </span>
                        <div className="flex gap-1">
                          <button
                            onClick={() =>
                              handleInputChange(
                                "rooms",
                                Math.max(1, bookingData.rooms - 1),
                              )
                            }
                            className="btn btn-xs btn-circle btn-ghost border-base-300"
                          >
                            -
                          </button>
                          <button
                            onClick={() =>
                              handleInputChange("rooms", bookingData.rooms + 1)
                            }
                            className="btn btn-xs btn-circle btn-ghost border-base-300"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Row 4: Message (Textarea) */}
                  <div className="p-3 hover:bg-base-200 transition-colors">
                    <label className="text-[10px] uppercase font-bold opacity-50 block mb-1 flex items-center gap-1">
                      <MessageSquare size={10} /> Special Request
                    </label>
                    <textarea
                      className="textarea textarea-ghost w-full bg-transparent text-sm p-0 min-h-[3rem] focus:outline-none resize-none leading-tight"
                      placeholder="e.g. Late check-in, extra pillows..."
                      value={bookingData.requestMessage}
                      onChange={(e) =>
                        handleInputChange("requestMessage", e.target.value)
                      }
                    />
                  </div>
                </div>

                {/* Calculate/Submit Button */}
                <button
                  onClick={handleReservation}
                  disabled={submitting || summary.finalAmount <= 0}
                  className="btn btn-primary w-full btn-lg rounded-xl shadow-lg shadow-primary/20 text-lg font-bold disabled:bg-base-300 disabled:text-base-content/30"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="animate-spin mr-2" /> Processing...
                    </>
                  ) : (
                    "Reserve now"
                  )}
                </button>
                <p className="text-center text-xs opacity-50 font-medium">
                  You won&apos;t be charged yet
                </p>

                {/* --- PRICE BREAKDOWN --- */}
                {summary.totalAmount > 0 && (
                  <div className="space-y-3 pt-2 animate-in fade-in slide-in-from-top-2">
                    {/* Line Item: Base Calculation */}
                    <div className="flex justify-between text-sm opacity-80">
                      <span className="underline decoration-dotted text-xs sm:text-sm">
                        {hotel.priceUnit === "PER_PERSON"
                          ? `${formatPrice(hotel.price)} x ${bookingData.guests} guests x ${summary.duration} ${summary.durationUnit}s`
                          : `${formatPrice(hotel.price)} x ${bookingData.rooms} rooms x ${summary.duration} ${summary.durationUnit}s`}
                      </span>
                      <span>{formatPrice(summary.totalAmount)}</span>
                    </div>

                    {/* Discount */}
                    {summary.discountAmount > 0 && (
                      <div className="flex justify-between text-sm text-success font-medium">
                        <span>Discount applied</span>
                        <span>- {formatPrice(summary.discountAmount)}</span>
                      </div>
                    )}

                    <div className="divider my-2"></div>

                    {/* Final Total */}
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>{formatPrice(summary.finalAmount)}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-base-200/50 p-4 text-center">
                <div className="flex items-center justify-center gap-2 text-xs opacity-60 font-bold uppercase tracking-wider">
                  <ShieldCheck size={14} /> Secure Transaction
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelReservation;
