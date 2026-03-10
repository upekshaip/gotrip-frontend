"use client";

import React, { useEffect, useState } from "react";
import { 
  getIncomingTransportRequests, 
  respondToBooking, 
  createTransport,
  markBookingCompleted
} from "@/hooks/TransportApi";
import { 
  Car, Calendar, MapPin, CheckCircle, XCircle, 
  Clock, User, MessageSquare, Loader2, PlusCircle, Inbox
} from "lucide-react";
import toast from "react-hot-toast";

export default function TransportManagementPage() {
  const [activeTab, setActiveTab] = useState("requests"); // "requests" | "add"
  
  // Requests State
  const [requests, setRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  // Add Vehicle State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [vehicleData, setVehicleData] = useState({
    vehicleMake: "",
    vehicleModel: "",
    vehicleType: "Car",
    description: "",
    city: "",
    priceUnit: "PER_DAY",
    price: "",
    capacity: "",
    imageUrl: "",
    isFeatured: false
  });

  // Fetch incoming requests on load
  useEffect(() => {
    if (activeTab === "requests") {
      fetchRequests();
    }
  }, [activeTab]);

  const fetchRequests = async () => {
    setLoadingRequests(true);
    try {
      const data = await getIncomingTransportRequests();
      
      console.log("Backend Response:", data); // Helpful for debugging!

      // Smart check: Ensure we only set an array to prevent .filter() crashes
      if (Array.isArray(data)) {
        setRequests(data);
      } else if (data && Array.isArray(data.content)) {
        // If Spring Boot wraps the array in a pagination 'content' object
        setRequests(data.content);
      } else {
        // Fallback for errors or empty states
        setRequests([]); 
      }
    } catch (error) {
      toast.error("Failed to load booking requests");
      setRequests([]); // Fallback to empty array on network error
    } finally {
      setLoadingRequests(false);
    }
  };

  // --- ACCEPT / DECLINE BOOKING ---
  const handleAction = async (bookingId, newStatus) => {
    setProcessingId(bookingId);
    try {
      const message = newStatus === "ACCEPTED" 
        ? "Your ride has been confirmed! See you soon." 
        : "Sorry, this vehicle is unavailable for these dates.";
        
      const res = await respondToBooking(bookingId, newStatus, message);
      
      if (res && !res.error) {
        toast.success(`Booking ${newStatus.toLowerCase()} successfully!`);
        setRequests(prev => prev.filter(req => req.booking.bookingId !== bookingId));
      } else {
        toast.error("Failed to update booking status");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setProcessingId(null);
    }
  };

  // --- ADD NEW VEHICLE ---
  const handleAddVehicle = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await createTransport(vehicleData);
      
      // Checking for an error property from your UseFetch hook
      if (res && !res.error && !res.status?.toString().startsWith('4') && !res.status?.toString().startsWith('5')) {
        toast.success("Vehicle published successfully!");
        setVehicleData({
          vehicleMake: "", vehicleModel: "", vehicleType: "Car",
          description: "", city: "", priceUnit: "PER_DAY",
          price: "", capacity: "", imageUrl: "", isFeatured: false
        });
        setActiveTab("requests"); 
      } else {
        toast.error(res?.message || res?.error || "Failed to add vehicle");
      }
    } catch (err) {
      toast.error("An error occurred while adding the vehicle");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-base-content tracking-tight">Transport Management</h1>
        <p className="text-base-content/60 mt-1">Manage your fleet and incoming ride requests</p>
      </div>

      {/* Custom Tabs */}
      <div className="flex space-x-2 mb-8 bg-base-200 p-1 rounded-xl inline-flex">
        <button 
          onClick={() => setActiveTab("requests")}
          className={`px-6 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${activeTab === "requests" ? "bg-white text-primary shadow-sm" : "text-base-content/60 hover:text-base-content"}`}
        >
          <Inbox size={18} /> Booking Requests
          {requests.length > 0 && <span className="badge badge-primary badge-sm">{requests.length}</span>}
        </button>
        <button 
          onClick={() => setActiveTab("add")}
          className={`px-6 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${activeTab === "add" ? "bg-white text-primary shadow-sm" : "text-base-content/60 hover:text-base-content"}`}
        >
          <PlusCircle size={18} /> Add New Vehicle
        </button>
      </div>

      {/* --- BOOKING REQUESTS --- */}
      {activeTab === "requests" && (
        <div className="space-y-6">
          {loadingRequests ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary size-10" /></div>
          ) : requests.filter(r => r.booking.status === "PENDING" || r.booking.status === "ACCEPTED").length === 0 ? (
            <div className="text-center py-20 bg-base-100 rounded-2xl border border-dashed border-base-300">
              <CheckCircle className="mx-auto size-16 text-success/40 mb-4" />
              <h3 className="text-xl font-bold">You're all caught up!</h3>
              <p className="text-base-content/50">No pending booking requests at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {requests.filter(r => r.booking.status === "PENDING" || r.booking.status === "ACCEPTED").map((req) => (
                <div key={req.booking.bookingId} className="card bg-base-100 shadow-xl border border-base-200">
                  <div className="card-body p-6">
                    {/* Header: Traveler Info */}
                    <div className="flex justify-between items-start border-b border-base-200 pb-4 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="avatar placeholder">
                          <div className="bg-primary text-primary-content rounded-full w-12 font-bold text-lg">
                            {req.travellerContact?.name?.charAt(0) || "U"}
                          </div>
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{req.travellerContact?.name || "Traveler"}</h3>
                          <p className="text-xs text-base-content/60 flex items-center gap-1">
                            <User size={12}/> {req.travellerContact?.email || "No email"}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xl font-black text-primary">LKR {req.booking.totalAmount}</span>
                        <p className="text-xs opacity-60 font-medium">Total Payout</p>
                      </div>
                    </div>

                    {/* Booking Details Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div>
                        <p className="text-xs opacity-50 font-bold uppercase mb-1 flex items-center gap-1"><Calendar size={12}/> Dates</p>
                        <p className="font-medium">{req.booking.startingDate} to {req.booking.endingDate}</p>
                      </div>
                      <div>
                        <p className="text-xs opacity-50 font-bold uppercase mb-1 flex items-center gap-1"><Clock size={12}/> Times</p>
                        <p className="font-medium">{req.booking.startingTime} - {req.booking.endingTime}</p>
                      </div>
                      <div className="col-span-2 bg-base-200/50 p-3 rounded-xl border border-base-200">
                        <div className="flex items-start gap-2 mb-2">
                          <MapPin size={16} className="text-success mt-0.5 shrink-0" />
                          <div>
                            <span className="text-xs opacity-60 block">Pick-up</span>
                            <span className="font-semibold">{req.booking.pickupLocation}</span>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <MapPin size={16} className="text-error mt-0.5 shrink-0" />
                          <div>
                            <span className="text-xs opacity-60 block">Drop-off</span>
                            <span className="font-semibold">{req.booking.dropoffLocation}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {req.booking.requestMessage && (
                      <div className="bg-warning/10 text-warning-content p-3 rounded-lg flex gap-2 items-start text-sm mb-4">
                        <MessageSquare size={16} className="shrink-0 mt-0.5 text-warning" />
                        <p>"{req.booking.requestMessage}"</p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="card-actions justify-end mt-2 pt-4 border-t border-base-200 gap-3">
                      {req.booking.status === "PENDING" && (
                        <>
                          <button 
                            onClick={() => handleAction(req.booking.bookingId, "DECLINED")}
                            disabled={processingId === req.booking.bookingId}
                            className="btn btn-outline btn-error hover:!text-white flex-1 sm:flex-none"
                          >
                            <XCircle size={18} /> Decline
                          </button>
                          <button 
                            onClick={() => handleAction(req.booking.bookingId, "ACCEPTED")}
                            disabled={processingId === req.booking.bookingId}
                            className="btn btn-primary flex-1 sm:flex-none"
                          >
                            {processingId === req.booking.bookingId ? <Loader2 className="animate-spin" size={18}/> : <CheckCircle size={18} />} 
                            Accept Ride
                          </button>
                        </>
                      )}
                      
                      {req.booking.status === "ACCEPTED" && (
                        <button 
                          onClick={async () => {
                            setProcessingId(req.booking.bookingId);
                            try {
                              const res = await markBookingCompleted(req.booking.bookingId);
                              if (res && !res.error) {
                                toast.success("Ride marked as Completed!");
                                fetchRequests(); 
                              } else {
                                toast.error("Failed to complete ride");
                              }
                            } catch(e) { 
                              toast.error("Error completing ride"); 
                            } finally {
                              setProcessingId(null);
                            }
                          }}
                          disabled={processingId === req.booking.bookingId}
                          className="btn btn-info text-white flex-1 sm:flex-none"
                        >
                          {processingId === req.booking.bookingId ? <Loader2 className="animate-spin" size={18}/> : <CheckCircle size={18} />} 
                          Mark as Completed
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ---ADD NEW VEHICLE --- */}
      {activeTab === "add" && (
        <div className="card bg-base-100 shadow-xl border border-base-200 max-w-3xl">
          <div className="card-body p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Car className="text-primary" /> Publish a Vehicle
            </h2>
            
            <form onSubmit={handleAddVehicle} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="form-control">
                  <label className="label"><span className="label-text font-bold">Make</span></label>
                  <input type="text" placeholder="e.g. Toyota" required className="input input-bordered w-full"
                    value={vehicleData.vehicleMake} onChange={e => setVehicleData({...vehicleData, vehicleMake: e.target.value})} />
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text font-bold">Model</span></label>
                  <input type="text" placeholder="e.g. Hiace" required className="input input-bordered w-full"
                    value={vehicleData.vehicleModel} onChange={e => setVehicleData({...vehicleData, vehicleModel: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="form-control">
                  <label className="label"><span className="label-text font-bold">Vehicle Type</span></label>
                  <select className="select select-bordered w-full" value={vehicleData.vehicleType} onChange={e => setVehicleData({...vehicleData, vehicleType: e.target.value})}>
                    <option value="Car">Car</option>
                    <option value="Van">Van</option>
                    <option value="SUV">SUV</option>
                    <option value="TukTuk">TukTuk</option>
                    <option value="Bus">Bus</option>
                  </select>
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text font-bold">City Location</span></label>
                  <input type="text" placeholder="e.g. Colombo" required className="input input-bordered w-full"
                    value={vehicleData.city} onChange={e => setVehicleData({...vehicleData, city: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="form-control">
                  <label className="label"><span className="label-text font-bold">Price</span></label>
                  <input type="number" placeholder="15000" required className="input input-bordered w-full"
                    value={vehicleData.price} onChange={e => setVehicleData({...vehicleData, price: e.target.value})} />
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text font-bold">Pricing Unit</span></label>
                  <select className="select select-bordered w-full" value={vehicleData.priceUnit} onChange={e => setVehicleData({...vehicleData, priceUnit: e.target.value})}>
                    <option value="PER_DAY">Per Day</option>
                    <option value="PER_HOUR">Per Hour</option>
                    <option value="PER_KM">Per KM</option>
                  </select>
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text font-bold">Capacity (Seats)</span></label>
                  <input type="number" placeholder="4" required className="input input-bordered w-full"
                    value={vehicleData.capacity} onChange={e => setVehicleData({...vehicleData, capacity: e.target.value})} />
                </div>
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text font-bold">Description</span></label>
                <textarea required className="textarea textarea-bordered h-24" placeholder="Describe the vehicle condition, AC availability, restrictions..."
                  value={vehicleData.description} onChange={e => setVehicleData({...vehicleData, description: e.target.value})} />
              </div>

              <div className="form-control mb-6">
                <label className="label"><span className="label-text font-bold">Image URL</span></label>
                <input type="url" placeholder="https://..." required className="input input-bordered w-full"
                  value={vehicleData.imageUrl} onChange={e => setVehicleData({...vehicleData, imageUrl: e.target.value})} />
              </div>

              <button type="submit" disabled={isSubmitting} className="btn btn-primary w-full text-lg">
                {isSubmitting ? <Loader2 className="animate-spin" /> : "Publish Vehicle to Catalog"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}