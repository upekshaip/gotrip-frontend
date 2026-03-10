/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState, use } from "react";
import UseFetch from "@/hooks/UseFetch";
import {
  MapPin, Star, ShieldCheck, ChevronLeft, Wifi,
  Coffee, Car, Utensils, Clock, Calendar as CalendarIcon,
  MessageSquare, Loader2, Map
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

const TransportReservation = ({ params }) => {
  const resolvedParams = use(params);
  const router = useRouter();
  const [transport, setTransport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [provider, setProvider] = useState("Service Provider");

  // Transport Specific Booking State
  const [bookingData, setBookingData] = useState({
    checkInDate: "",
    checkOutDate: "",
    checkInTime: "08:00",
    checkOutTime: "20:00",
    pickupLocation: "",
    dropoffLocation: "",
    requestMessage: "",
  });

  const [summary, setSummary] = useState({
    totalAmount: 0,
    finalAmount: 0,
    duration: 0,
    durationUnit: "day",
  });

  useEffect(() => {
    const fetchTransport = async () => {
      try {
        const data = await UseFetch("GET", `/transport-service/${resolvedParams.transportId}`);
        if (data) {
            // Support both wrapped response or flat model
            setTransport(data.transport || data); 
            if (data.providerContact?.name) setProvider(data.providerContact.name);
        } else {
          toast.error("Vehicle not found.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchTransport();
  }, [resolvedParams.transportId]);

  // Real-time Calculation Engine
  useEffect(() => {
    if (!transport) return;

    const { checkInDate, checkOutDate, checkInTime, checkOutTime } = bookingData;
    const price = transport.price || 0;
    let calculatedTotal = 0;
    let durationVal = 0;

    if (checkInDate && checkOutDate) {
      const startDateTime = new Date(`${checkInDate}T${checkInTime}`);
      const endDateTime = new Date(`${checkOutDate}T${checkOutTime}`);

      if (endDateTime > startDateTime) {
        const diffTime = Math.abs(endDateTime - startDateTime);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        durationVal = diffDays > 0 ? diffDays : 1;
        calculatedTotal = price * durationVal;
      }
    }

    setSummary({
      totalAmount: calculatedTotal,
      finalAmount: calculatedTotal,
      duration: durationVal,
      durationUnit: "day",
    });
  }, [bookingData, transport]);

  const handleInputChange = (field, value) => {
    setBookingData((prev) => ({ ...prev, [field]: value }));
  };

  const handleReservation = async () => {
    if (!bookingData.checkInDate || !bookingData.checkOutDate || !bookingData.pickupLocation) {
      toast.error("Please fill in dates and pickup location.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        transportId: transport.transportId,
        pickupLocation: bookingData.pickupLocation,
        dropoffLocation: bookingData.dropoffLocation,
        startingDate: bookingData.checkInDate,
        startingTime: bookingData.checkInTime,
        endingDate: bookingData.checkOutDate,
        endingTime: bookingData.checkOutTime,
        requestMessage: bookingData.requestMessage || "Standard Booking",
      };

      const response = await UseFetch("POST", "/transport-service/bookings/request", payload);

      if (response && !response.error && !response.timestamp) {
        toast.success("Ride request sent successfully!");
        router.push(routes.traveller.myBookings.url);
      } else {
        toast.error("Failed to create ride request.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><span className="loading loading-spinner loading-lg text-primary"></span></div>;
  if (!transport) return <div className="min-h-screen flex items-center justify-center">Vehicle Unavailable</div>;

  return (
    <div className="bg-base-100 min-h-screen pb-20 font-sans text-base-content">
      {/* Hero Section */}
      <div className="relative h-[60vh] w-full group">
        <img src={transport.imageUrl || "https://placehold.co/1200x600?text=Vehicle"} alt={transport.vehicleModel} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-base-100/90"></div>

        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start">
          <button onClick={() => router.back()} className="btn btn-circle btn-ghost bg-white/20 backdrop-blur-md text-white hover:bg-white/40 border-none">
            <ChevronLeft size={24} />
          </button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 px-6 lg:px-12 pb-12 pt-24">
          <div className="max-w-7xl mx-auto">
            <span className="badge badge-accent badge-lg font-bold uppercase tracking-wider mb-2">
              {transport.vehicleType}
            </span>
            <h1 className="text-3xl md:text-5xl font-black text-base-content leading-tight">
              {transport.vehicleMake} {transport.vehicleModel}
            </h1>
            <div className="flex items-center gap-4 text-base-content/80 font-medium mt-2">
              <span className="flex items-center gap-1"><MapPin size={18} className="text-primary" /> {transport.city}</span>
              <span className="flex items-center gap-1"><Car size={18} className="text-primary" /> {transport.capacity} Seats</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto px-6 lg:px-8 mt-8 grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-12">
          <div className="flex items-center justify-between border-b border-base-200 pb-8">
            <div className="space-y-1">
              <h3 className="text-xl font-bold">Maintained by {provider}</h3>
              <p className="opacity-60 text-sm">Verified Partner • Top Rated Vehicle</p>
            </div>
            <div className="avatar placeholder">
              <ProfileImage name={provider} size={40} />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-2xl font-bold">About this vehicle</h3>
            <p className="leading-relaxed opacity-80">{transport.description}</p>
          </div>

          <div className="h-[300px] w-full rounded-3xl overflow-hidden shadow-lg border border-base-200 relative">
            <MapSelector lat={transport.latitude} lng={transport.longitude} onChange={() => {}} />
          </div>
        </div>

        {/* Right Column: Calculator */}
        <div className="relative h-full">
          <div className="sticky top-24">
            <div className="card bg-base-100 shadow-2xl border border-base-200 overflow-hidden">
              <div className="card-body p-6 md:p-8 space-y-6">
                
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="text-3xl font-black text-primary">{formatPrice(transport.price)}</span>
                    <span className="text-sm opacity-60 font-medium uppercase tracking-wide ml-1">
                      {transport.priceUnit === "PER_HOUR" ? "/ hour" : "/ day"}
                    </span>
                  </div>
                </div>

                <div className="border border-base-300 rounded-2xl overflow-hidden bg-base-100">
                  {/* Dates */}
                  <div className="grid grid-cols-2 border-b border-base-300">
                    <div className="p-3 hover:bg-base-200 transition-colors border-r border-base-300">
                      <label className="text-[10px] uppercase font-bold opacity-50 flex items-center gap-1 mb-1"><CalendarIcon size={10} /> Pick-up Date</label>
                      <input type="date" className="w-full bg-transparent text-sm font-bold focus:outline-none" onChange={(e) => handleInputChange("checkInDate", e.target.value)} min={new Date().toISOString().split("T")[0]} />
                    </div>
                    <div className="p-3 hover:bg-base-200 transition-colors">
                      <label className="text-[10px] uppercase font-bold opacity-50 flex items-center gap-1 mb-1"><CalendarIcon size={10} /> Drop-off Date</label>
                      <input type="date" className="w-full bg-transparent text-sm font-bold focus:outline-none" onChange={(e) => handleInputChange("checkOutDate", e.target.value)} min={bookingData.checkInDate} />
                    </div>
                  </div>

                  {/* Times */}
                  <div className="grid grid-cols-2 border-b border-base-300">
                    <div className="p-3 hover:bg-base-200 transition-colors border-r border-base-300">
                      <label className="text-[10px] uppercase font-bold opacity-50 flex items-center gap-1 mb-1"><Clock size={10} /> Pick-up Time</label>
                      <input type="time" value={bookingData.checkInTime} className="w-full bg-transparent text-sm font-bold focus:outline-none" onChange={(e) => handleInputChange("checkInTime", e.target.value)} />
                    </div>
                    <div className="p-3 hover:bg-base-200 transition-colors">
                      <label className="text-[10px] uppercase font-bold opacity-50 flex items-center gap-1 mb-1"><Clock size={10} /> Drop-off Time</label>
                      <input type="time" value={bookingData.checkOutTime} className="w-full bg-transparent text-sm font-bold focus:outline-none" onChange={(e) => handleInputChange("checkOutTime", e.target.value)} />
                    </div>
                  </div>

                  {/* Locations */}
                  <div className="grid grid-cols-1 border-b border-base-300">
                    <div className="p-3 hover:bg-base-200 transition-colors border-b border-base-300">
                      <label className="text-[10px] uppercase font-bold opacity-50 flex items-center gap-1 mb-1"><Map size={10} /> Pick-up Location</label>
                      <input type="text" placeholder="Airport, Hotel name, etc." className="w-full bg-transparent text-sm font-bold focus:outline-none" onChange={(e) => handleInputChange("pickupLocation", e.target.value)} />
                    </div>
                    <div className="p-3 hover:bg-base-200 transition-colors">
                      <label className="text-[10px] uppercase font-bold opacity-50 flex items-center gap-1 mb-1"><MapPin size={10} /> Drop-off Location</label>
                      <input type="text" placeholder="Final destination" className="w-full bg-transparent text-sm font-bold focus:outline-none" onChange={(e) => handleInputChange("dropoffLocation", e.target.value)} />
                    </div>
                  </div>

                  {/* Message */}
                  <div className="p-3 hover:bg-base-200 transition-colors">
                    <label className="text-[10px] uppercase font-bold opacity-50 flex items-center gap-1 mb-1"><MessageSquare size={10} /> Special Request</label>
                    <textarea className="textarea textarea-ghost w-full bg-transparent text-sm p-0 min-h-[3rem] focus:outline-none resize-none leading-tight" placeholder="e.g. Need baby seat, extra luggage..." value={bookingData.requestMessage} onChange={(e) => handleInputChange("requestMessage", e.target.value)} />
                  </div>
                </div>

                <button onClick={handleReservation} disabled={submitting || summary.finalAmount <= 0} className="btn btn-primary w-full btn-lg rounded-xl shadow-lg shadow-primary/20 text-lg font-bold disabled:bg-base-300 disabled:text-base-content/30">
                  {submitting ? <><Loader2 className="animate-spin mr-2" /> Processing...</> : "Request Ride"}
                </button>
                <p className="text-center text-xs opacity-50 font-medium">You won&apos;t be charged yet</p>

                {summary.totalAmount > 0 && (
                  <div className="space-y-3 pt-2 animate-in fade-in slide-in-from-top-2">
                    <div className="flex justify-between text-sm opacity-80">
                      <span className="underline decoration-dotted">{formatPrice(transport.price)} x {summary.duration} {summary.durationUnit}s</span>
                      <span>{formatPrice(summary.totalAmount)}</span>
                    </div>
                    <div className="divider my-2"></div>
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>{formatPrice(summary.finalAmount)}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransportReservation;