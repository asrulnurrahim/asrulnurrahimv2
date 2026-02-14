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
    <section className="bg-primary overflow-hidden py-10 sm:py-[100px]">
      <div className="container mx-auto mb-12 px-4">
        <div className="mx-auto max-w-2xl text-center">
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
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
          <div className="space-y-4">
            {apps.map((app) => (
              <div
                key={app.id}
                className={`cursor-pointer rounded-xl p-6 transition-all duration-300 ${activeApp.id === app.id ? "bg-white/10 shadow-lg" : "hover:bg-white/5"}`}
                onClick={() => setActiveApp(app)}
              >
                <h4 className="mb-2 text-xl font-medium text-white">
                  {app.title}
                </h4>
                <p className="m-0 text-sm leading-relaxed text-white/75">
                  {app.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="relative hidden h-[400px] w-full md:block">
            <div className="absolute inset-0 transition-opacity duration-500 ease-in-out">
              <Image
                src={activeApp.img}
                alt={activeApp.title}
                width={800}
                height={500}
                className="h-auto max-h-[500px] w-full rounded-lg object-contain shadow-2xl"
              />
            </div>
          </div>
          {/* Mobile view image */}
          <div className="md:hidden">
            <Image
              src={activeApp.img}
              alt={activeApp.title}
              width={600}
              height={400}
              className="h-auto w-full rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
