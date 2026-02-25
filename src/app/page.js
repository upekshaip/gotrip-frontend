"use client";

import React from "react";
import {
  PlaneTakeoff,
  Hotel,
  MapPin,
  Ticket,
  Clock,
  CheckCircle,
} from "lucide-react";
import Logo from "@/components/reusable/Logo";
import Navbar from "@/components/reusable/Navbar";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-base-100 font-sans">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="hero min-h-[70vh] bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-2xl">
            <div className="badge badge-outline badge-primary mb-4 gap-2">
              <Clock size={14} /> 4-Hour Response Guarantee
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6">
              Your Journey,{" "}
              <span className="text-primary italic">Perfectly</span>{" "}
              Orchestrated.
            </h1>
            <p className="text-lg opacity-80 mb-8">
              Book hotels, custom transport, and local experiences in one
              unified itinerary. Real people, real bookings, ready when you are.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button className="btn btn-primary btn-lg rounded-full px-8">
                Start Your Trip Group
              </button>
              <button className="btn btn-outline btn-lg rounded-full px-8">
                View Experiences
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features / Services */}
      <section className="py-20 px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Stays */}
          <div className="card bg-base-100 border border-base-200 shadow-xl hover:shadow-2xl transition-all">
            <div className="card-body">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-4">
                <Hotel size={24} />
              </div>
              <h2 className="card-title text-2xl">Curated Stays</h2>
              <p className="opacity-70">
                Hand-picked local hotels tailored to your specific travel vibe
                and budget.
              </p>
            </div>
          </div>

          {/* Transport */}
          <div className="card bg-base-100 border border-base-200 shadow-xl hover:shadow-2xl transition-all">
            <div className="card-body">
              <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-lg flex items-center justify-center mb-4">
                <MapPin size={24} />
              </div>
              <h2 className="card-title text-2xl">Smart Transit</h2>
              <p className="opacity-70">
                Integrated Google Maps routing for precise pickups and
                stress-free destinations.
              </p>
            </div>
          </div>

          {/* Experiences */}
          <div className="card bg-base-100 border border-base-200 shadow-xl hover:shadow-2xl transition-all">
            <div className="card-body">
              <div className="w-12 h-12 bg-accent/10 text-accent rounded-lg flex items-center justify-center mb-4">
                <Ticket size={24} />
              </div>
              <h2 className="card-title text-2xl">Local Rentals</h2>
              <p className="opacity-70">
                Unique activities and specialized rentals you won't find
                anywhere else.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works / The 4-Hour Logic */}
      <section className="py-20 bg-neutral text-neutral-content">
        <div className="max-w-4xl mx-auto px-8">
          <h2 className="text-4xl font-bold text-center mb-16 italic">
            How goTrip Works
          </h2>
          <ul className="steps steps-vertical lg:steps-horizontal w-full">
            <li className="step step-primary">Build Your Group</li>
            <li className="step step-primary">Submit Request</li>
            <li className="step step-primary">4-Hour Confirmation</li>
            <li className="step">Enjoy Your Trip!</li>
          </ul>

          <div className="mt-16 bg-base-100/10 p-8 rounded-3xl border border-white/10 backdrop-blur-sm">
            <div className="flex gap-4 items-start">
              <CheckCircle className="text-success mt-1" />
              <div>
                <h3 className="text-xl font-bold">
                  The Request-Response Model
                </h3>
                <p className="opacity-70 mt-2">
                  To ensure quality, our providers manually confirm every
                  booking. By maintaining a 4-hour lead time, we guarantee that
                  your car is ready and your room is waiting.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer p-10 bg-base-200 text-base-content border-t border-base-300">
        <aside>
          <Logo />
          <p className="mt-2">Redefining local travel since 2025.</p>
        </aside>
        <nav>
          <h6 className="footer-title">Services</h6>
          <a className="link link-hover">Hotels</a>
          <a className="link link-hover">Transport</a>
          <a className="link link-hover">Rentals</a>
        </nav>
        <nav>
          <h6 className="footer-title">Company</h6>
          <a className="link link-hover">About us</a>
          <a className="link link-hover">Contact</a>
          <a className="link link-hover">Privacy Policy</a>
        </nav>
      </footer>
    </div>
  );
}
