"use client";

import React, { useEffect, useState, use } from "react";
import UseFetch from "@/hooks/UseFetch";
import {
  MapPin,
  Star,
  ShieldCheck,
  ChevronLeft,
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

const formatPrice = (price) => {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 2,
  }).format(price);
};

const RestaurantReservation = ({ params }) => {
  const resolvedParams = use(params);
  const router = useRouter();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [provider, setProvider] = useState("");

  const [bookingData, setBookingData] = useState({
    checkInDate: "",
    checkOutDate: "",
    checkInTime: "12:00",
    checkOutTime: "14:00",
    guests: 1,
    tables: 1,
    requestMessage: "",
  });

  const [summary, setSummary] = useState({
    totalAmount: 0,
    discountAmount: 0,
    finalAmount: 0,
    duration: 0,
    durationUnit: "day",
  });

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const data = await UseFetch(
          "GET",
          `/restaurant-service/traveller/${resolvedParams.restaurantId}`,
        );
        if (data && !data.timestamp) {
          setRestaurant(data.hotel || data.restaurant);
          setProvider(data.provider);
        } else {
          toast.error("Restaurant not found.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurant();
  }, [resolvedParams.restaurantId]);

  useEffect(() => {
    if (!restaurant) return;

    const {
      checkInDate,
      checkOutDate,
      checkInTime,
      checkOutTime,
      guests,
      tables,
    } = bookingData;
    const price = restaurant.price || 0;
    const discount = restaurant.discount || 0;
    let calculatedTotal = 0;
    let durationVal = 0;
    let unitLabel = "day";

    if (checkInDate && checkOutDate) {
      const startDateTime = new Date(`${checkInDate}T${checkInTime}`);
      const endDateTime = new Date(`${checkOutDate}T${checkOutTime}`);

      if (endDateTime > startDateTime) {
        if (restaurant.priceUnit === "PER_DAY") {
          const diffTime = Math.abs(endDateTime - startDateTime);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          durationVal = diffDays > 0 ? diffDays : 1;
          calculatedTotal = price * tables * durationVal;
          unitLabel = "day";
        } else if (restaurant.priceUnit === "PER_HOUR") {
          const diffTime = Math.abs(endDateTime - startDateTime);
          const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
          durationVal = diffHours > 0 ? diffHours : 1;
          calculatedTotal = price * tables * durationVal;
          unitLabel = "hour";
        } else if (restaurant.priceUnit === "PER_PERSON") {
          const diffTime = Math.abs(endDateTime - startDateTime);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          durationVal = diffDays > 0 ? diffDays : 1;
          calculatedTotal = price * guests * durationVal;
          unitLabel = "day";
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
  }, [bookingData, restaurant]);

  const handleInputChange = (field, value) => {
    setBookingData((prev) => ({ ...prev, [field]: value }));
  };

  const handleReservation = async () => {
    if (!bookingData.checkInDate || !bookingData.checkOutDate) {
      toast.error("Please select reservation dates.");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        restaurantId: restaurant.restaurantId,
        personCount: bookingData.guests,
        startingDate: bookingData.checkInDate,
        startingTime: bookingData.checkInTime,
        endingDate: bookingData.checkOutDate,
        endingTime: bookingData.checkOutTime,
        requestMessage: bookingData.requestMessage || "No special requests",
        roomCount: bookingData.tables,
      };

      const response = await UseFetch(
        "POST",
        "/restaurant-booking/request",
        payload,
      );

      if (response && !response.error && !response.timestamp) {
        toast.success("Reservation request sent successfully!");
        router.push(routes.traveller.myBookings.url);
      } else {
        toast.error(response.message || "Failed to create reservation request.");
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
  if (!restaurant)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Restaurant Unavailable
      </div>
    );

  const amenities = [
    { icon: <Wifi size={18} />, label: "Fast Wifi" },
    { icon: <Coffee size={18} />, label: "Beverages" },
    { icon: <Car size={18} />, label: "Parking" },
    { icon: <Utensils size={18} />, label: "Fine Dining" },
  ];

  return (
    <div className="bg-base-100 min-h-screen pb-20 font-sans text-base-content">
      {/* Hero Image */}
      <div className="relative h-[60vh] w-full group">
        <img
          src={restaurant.imageUrl}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-base-100/90"></div>

        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start">
          <button
            onClick={() => router.back()}
            className="btn btn-circle btn-ghost bg-white/20 backdrop-blur-md text-white hover:bg-white/40 border-none"
          >
            <ChevronLeft size={24} />
          </button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 px-6 lg:px-12 pb-12 pt-24">
          <div className="max-w-7xl mx-auto">
            {restaurant.featured && (
              <span className="badge badge-accent badge-lg font-bold uppercase tracking-wider mb-2">
                Featured
              </span>
            )}
            <h1 className="text-3xl md:text-5xl font-black text-base-content leading-tight">
              {restaurant.name}
            </h1>
            <div className="flex items-center gap-4 text-base-content/80 font-medium mt-2">
              <span className="flex items-center gap-1">
                <MapPin size={18} className="text-primary" /> {restaurant.city}, Sri
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

      {/* Main Grid */}
      <div className="mx-auto px-6 lg:px-8 mt-8 grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left: Info */}
        <div className="lg:col-span-2 space-y-12">
          <div className="flex items-center justify-between border-b border-base-200 pb-8">
            <div className="space-y-1">
              <h3 className="text-xl font-bold">Managed by {provider}</h3>
              <p className="opacity-60 text-sm">Top Rated • Quality Assured</p>
            </div>
            <div className="avatar placeholder">
              <ProfileImage name={provider} size={40} />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-2xl font-bold">About this restaurant</h3>
            <p className="leading-relaxed opacity-80">{restaurant.description}</p>
          </div>

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

          <div className="h-[300px] w-full rounded-3xl overflow-hidden shadow-lg border border-base-200 relative">
            <MapSelector
              lat={restaurant.latitude}
              lng={restaurant.longitude}
              onChange={() => {}}
            />
          </div>
        </div>

        {/* Right: Booking Calculator */}
        <div className="relative h-full">
          <div className="sticky top-24">
            <div className="card bg-base-100 shadow-2xl border border-base-200 overflow-hidden">
              <div className="card-body p-6 md:p-8 space-y-6">
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="text-3xl font-black text-primary">
                      {formatPrice(restaurant.price)}
                    </span>
                    <span className="text-sm opacity-60 font-medium uppercase tracking-wide ml-1">
                      {restaurant.priceUnit === "PER_HOUR"
                        ? "/ hour"
                        : restaurant.priceUnit === "PER_PERSON"
                          ? "/ person"
                          : "/ day"}
                    </span>
                  </div>
                </div>

                <div className="border border-base-300 rounded-2xl overflow-hidden bg-base-100">
                  {/* Dates */}
                  <div className="grid grid-cols-2 border-b border-base-300">
                    <div className="p-3 hover:bg-base-200 transition-colors border-r border-base-300 relative">
                      <label className="text-[10px] uppercase font-bold opacity-50 block mb-1 flex items-center gap-1">
                        <CalendarIcon size={10} /> From
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
                        <CalendarIcon size={10} /> To
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

                  {/* Times */}
                  {restaurant.priceUnit === "PER_HOUR" && (
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

                  {/* Guests & Tables */}
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
                        Tables
                      </label>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold">
                          {bookingData.tables}
                        </span>
                        <div className="flex gap-1">
                          <button
                            onClick={() =>
                              handleInputChange(
                                "tables",
                                Math.max(1, bookingData.tables - 1),
                              )
                            }
                            className="btn btn-xs btn-circle btn-ghost border-base-300"
                          >
                            -
                          </button>
                          <button
                            onClick={() =>
                              handleInputChange("tables", bookingData.tables + 1)
                            }
                            className="btn btn-xs btn-circle btn-ghost border-base-300"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="p-3 hover:bg-base-200 transition-colors">
                    <label className="text-[10px] uppercase font-bold opacity-50 block mb-1 flex items-center gap-1">
                      <MessageSquare size={10} /> Special Request
                    </label>
                    <textarea
                      className="textarea textarea-ghost w-full bg-transparent text-sm p-0 min-h-[3rem] focus:outline-none resize-none leading-tight"
                      placeholder="e.g. Window seat, dietary needs..."
                      value={bookingData.requestMessage}
                      onChange={(e) =>
                        handleInputChange("requestMessage", e.target.value)
                      }
                    />
                  </div>
                </div>

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

                {summary.totalAmount > 0 && (
                  <div className="space-y-3 pt-2 animate-in fade-in slide-in-from-top-2">
                    <div className="flex justify-between text-sm opacity-80">
                      <span className="underline decoration-dotted text-xs sm:text-sm">
                        {restaurant.priceUnit === "PER_PERSON"
                          ? `${formatPrice(restaurant.price)} x ${bookingData.guests} guests x ${summary.duration} ${summary.durationUnit}s`
                          : `${formatPrice(restaurant.price)} x ${bookingData.tables} tables x ${summary.duration} ${summary.durationUnit}s`}
                      </span>
                      <span>{formatPrice(summary.totalAmount)}</span>
                    </div>

                    {summary.discountAmount > 0 && (
                      <div className="flex justify-between text-sm text-success font-medium">
                        <span>Discount applied</span>
                        <span>- {formatPrice(summary.discountAmount)}</span>
                      </div>
                    )}

                    <div className="divider my-2"></div>

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

export default RestaurantReservation;
