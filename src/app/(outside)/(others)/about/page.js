"use client";

import {
  Target,
  Lightbulb,
  Users,
  Shield,
  TrendingUp,
  Heart,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="flex flex-col gap-20 pb-12">
      {/* 1. Hero / Mission Section */}
      <div className="hero min-h-[40vh] bg-base-200 rounded-3xl overflow-hidden shadow-inner">
        <div className="hero-content text-center">
          <div className="max-w-3xl">
            <div className="badge badge-primary badge-outline mb-4 p-4 font-bold">
              {"missionLabel" || "Our Mission"}
            </div>
            <h2 className="text-4xl lg:text-5xl font-extrabold mb-6 text-base-content">
              {"missionTitle"}
            </h2>
            <p className="py-2 text-xl text-base-content/70 leading-relaxed">
              {"missionContent"}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Stats Section */}
      <div className="flex justify-center w-full -mt-6">
        <div className="stats stats-vertical lg:stats-horizontal shadow-2xl bg-base-100 w-full max-w-5xl border border-base-200">
          <div className="stat place-items-center">
            <div className="stat-title uppercase tracking-wider text-xs font-bold opacity-60">
              {"statsStudents"}
            </div>
            <div className="stat-value text-primary">10K+</div>
            <div className="stat-desc opacity-60">Active Learners</div>
          </div>

          <div className="stat place-items-center">
            <div className="stat-title uppercase tracking-wider text-xs font-bold opacity-60">
              {"statsCourses"}
            </div>
            <div className="stat-value text-secondary">500+</div>
            <div className="stat-desc opacity-60">Quality Courses</div>
          </div>

          <div className="stat place-items-center">
            <div className="stat-title uppercase tracking-wider text-xs font-bold opacity-60">
              {"statsInstructors"}
            </div>
            <div className="stat-value text-accent">100+</div>
            <div className="stat-desc opacity-60">Expert Mentors</div>
          </div>

          <div className="stat place-items-center">
            <div className="stat-title uppercase tracking-wider text-xs font-bold opacity-60">
              {"statsSatisfaction"}
            </div>
            <div className="stat-value text-success">98%</div>
            <div className="stat-desc opacity-60">5-Star Ratings</div>
          </div>
        </div>
      </div>

      {/* 3. Our Journey (Timeline) */}
      <section className="max-w-4xl mx-auto w-full px-4">
        <div className="flex flex-col items-center mb-12 text-center">
          <h2 className="text-3xl font-bold mb-3 text-base-content">
            {"journeyTitle" || "Our Journey"}
          </h2>
          <p className="text-base-content/60 max-w-lg">
            How we started and where we are going.
          </p>
        </div>

        <ul className="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical">
          <li>
            <div className="timeline-middle">
              <CheckCircle2 className="w-5 h-5 text-primary" />
            </div>
            <div className="timeline-start md:text-end mb-10">
              <time className="font-mono italic opacity-50">2020</time>
              <div className="text-lg font-black text-base-content">
                Inception
              </div>
              <p className="text-base-content/70">
                {"journey.2020" ||
                  "The idea was born to create an accessible learning platform for everyone, everywhere."}
              </p>
            </div>
            <hr className="bg-primary" />
          </li>
          <li>
            <hr className="bg-primary" />
            <div className="timeline-middle">
              <CheckCircle2 className="w-5 h-5 text-primary" />
            </div>
            <div className="timeline-end mb-10">
              <time className="font-mono italic opacity-50">2021</time>
              <div className="text-lg font-black text-base-content">
                First 1,000 Students
              </div>
              <p className="text-base-content/70">
                {"journey.2021" ||
                  "We launched our first set of courses and the community response was overwhelming."}
              </p>
            </div>
            <hr className="bg-primary" />
          </li>
          <li>
            <hr className="bg-primary" />
            <div className="timeline-middle">
              <CheckCircle2 className="w-5 h-5 text-primary" />
            </div>
            <div className="timeline-start md:text-end mb-10">
              <time className="font-mono italic opacity-50">2023</time>
              <div className="text-lg font-black text-base-content">
                Global Expansion
              </div>
              <p className="text-base-content/70">
                {"journey.2023" ||
                  "Partnered with international instructors to bring diverse content to our students."}
              </p>
            </div>
            <hr />
          </li>
          <li>
            <hr />
            <div className="timeline-middle">
              <CheckCircle2 className="w-5 h-5 text-base-300" />
            </div>
            <div className="timeline-end mb-10">
              <time className="font-mono italic opacity-50">Future</time>
              <div className="text-lg font-black text-base-content">
                AI Integration
              </div>
              <p className="text-base-content/70">
                {"journey.future" ||
                  "Developing smart learning paths personalized for every single student."}
              </p>
            </div>
          </li>
        </ul>
      </section>

      {/* 4. Values Grid */}
      <section>
        <div className="flex flex-col items-center mb-10">
          <h2 className="text-3xl font-bold mb-2 text-base-content">
            {"valuesTitle"}
          </h2>
          <div className="h-1 w-20 bg-primary rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { key: "excellence", icon: Target, color: "text-primary" },
            { key: "innovation", icon: Lightbulb, color: "text-warning" },
            { key: "accessibility", icon: Users, color: "text-secondary" },
            { key: "community", icon: Heart, color: "text-error" },
            { key: "integrity", icon: Shield, color: "text-success" },
            { key: "growth", icon: TrendingUp, color: "text-info" },
          ].map(({ key, icon: Icon, color }) => (
            <div
              key={key}
              className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 border border-base-200"
            >
              <div className="card-body items-center text-center">
                <div className={`p-4 rounded-full bg-base-200/50 mb-2`}>
                  <Icon className={`w-8 h-8 ${color}`} />
                </div>
                <h3 className="card-title text-xl mb-1 text-base-content">
                  {`about.values.${key}.title`}
                </h3>
                <p className="text-base-content/70">
                  {`about.values.${key}.description`}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. CTA Section  */}
      <section className="mt-8">
        <div className="card bg-primary text-primary-content shadow-2xl overflow-hidden relative">
          {/* Background Pattern effect */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 rounded-full bg-white opacity-10 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 rounded-full bg-white opacity-10 blur-3xl"></div>

          <div className="card-body text-center py-16 px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {"Ready to Start Learning?"}
            </h2>
            <p className="mb-8 text-lg opacity-90 max-w-2xl mx-auto">
              {
                "Join our community today and explore thousands of courses. Have more questions? Check out our FAQ page."
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/faq"
                className="btn btn-outline btn-lg text-primary-content border-primary-content hover:bg-primary-content hover:text-primary"
              >
                {"Visit FAQ"}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
