"use client";
import React from "react";

const testimonials = [
  {
    name: "shahabblouch",
    role: "Code Quality",
    img: "/assets/images/user/avatar-1.jpg",
    quote:
      "Code quality is amazing. Design is astonishing. very easy to customize .. and any developer can use it with ease.",
  },
  {
    name: "menhook",
    role: "Feature Availability",
    img: "/assets/images/user/avatar-2.jpg",
    quote:
      "I get all what I need for my project from this template so I can focus to back end side. The template looks fantastic and the support is fast. Thank you.",
  },
  {
    name: "dimas_ferian",
    role: "Design Quality",
    img: "/assets/images/user/avatar-3.jpg",
    quote: "Design is very good.",
  },
  {
    name: "devbardbudist",
    role: "Customizability",
    img: "/assets/images/user/avatar-4.jpg",
    quote: "Amazing template for fast develop",
  },
  {
    name: "richitela",
    role: "Customer Support",
    img: "/assets/images/user/avatar-5.jpg",
    quote: "The author is very nice and solved my problem immediately",
  },
];

export function Testimonials() {
  return (
    <section className="py-10 sm:py-[100px] bg-slate-50 dark:bg-slate-950/30 overflow-hidden">
      <div className="container mx-auto px-4 mb-12">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="mb-3 text-3xl font-bold text-slate-900 dark:text-white">
            They <span className="text-primary">love</span> Able Pro, Now your
            turn 😍
          </h2>
          <p className="text-slate-500 dark:text-slate-400">
            We take pride in our Dashboard development, which has been
            consistently rated 4.7/5 by our satisfied customers. It brings us
            joy to share the positive feedback we have received.
          </p>
        </div>
      </div>

      {/* 
        Ideally use a marquee library, but for simplicity a horizontal scroll container 
        or a grid is better for this static implementation without external libs.
        I will use a grid to display them neatly. 
      */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="card border border-slate-200 dark:border-slate-800 rounded-lg p-6 bg-white dark:bg-slate-950 shadow-sm"
            >
              <div className="flex gap-4">
                <div className="shrink-0">
                  <img
                    src={t.img}
                    alt={t.name}
                    className="h-14 w-14 rounded-full"
                  />
                </div>
                <div className="grow">
                  <p className="mb-2 text-slate-600 dark:text-slate-300 italic">
                    “{t.quote}”
                  </p>
                  <div className="text-sm">
                    <span className="font-semibold text-slate-900 dark:text-white block">
                      {t.name}
                    </span>
                    <span className="text-xs text-slate-500">{t.role}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
