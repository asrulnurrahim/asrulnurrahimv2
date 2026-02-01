"use client";

import React, { useState } from "react";
import Image from "next/image";

const apps = [
  {
    id: "chat",
    title: "Chat",
    desc: "Power your web apps with the conceptual chat app of able pro dashboard template.",
    img: "/assets/images/landing/chat.png",
  },
  {
    id: "ecommerce",
    title: "E-commerce",
    desc: "Collection, filter, product detail, add new product, and checkout pages makes your e-commerce app complete.",
    img: "/assets/images/landing/e-commerce.png",
  },
  {
    id: "inbox",
    title: "Inbox",
    desc: "Compose message, list message (email), detailed inbox pages well suited for any conversation based web apps.",
    img: "/assets/images/landing/mail.png",
  },
  {
    id: "user",
    title: "User Management",
    desc: "Detailed pages for user management like profile settings, role, account settings, social profile and more.",
    img: "/assets/images/landing/social.png",
  },
];

export function WorkingApps() {
  const [activeApp, setActiveApp] = useState(apps[0]);

  return (
    <section className="bg-primary py-10 sm:py-[100px] overflow-hidden">
      <div className="container mx-auto px-4 mb-12">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="mb-3 text-3xl font-bold text-white">
            Working Conceptual Apps
          </h2>
          <p className="text-white/75">
            Each App is carefully crafted to achieve the best feature rich
            working concept for your project.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            {apps.map((app) => (
              <div
                key={app.id}
                className={`p-6 rounded-xl cursor-pointer transition-all duration-300 ${activeApp.id === app.id ? "bg-white/10 shadow-lg" : "hover:bg-white/5"}`}
                onClick={() => setActiveApp(app)}
              >
                <h4 className="text-xl font-medium text-white mb-2">
                  {app.title}
                </h4>
                <p className="text-white/75 m-0 text-sm leading-relaxed">
                  {app.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="relative h-[400px] w-full hidden md:block">
            <div className="absolute inset-0 transition-opacity duration-500 ease-in-out">
              <img
                src={activeApp.img}
                alt={activeApp.title}
                className="rounded-lg shadow-2xl w-full h-auto object-contain max-h-[500px]"
              />
            </div>
          </div>
          {/* Mobile view image */}
          <div className="md:hidden">
            <img
              src={activeApp.img}
              alt={activeApp.title}
              className="rounded-lg shadow-2xl w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
