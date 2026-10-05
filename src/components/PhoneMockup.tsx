"use client";

import React, { useState, useEffect } from "react";
import ProfileView from "@/components/ProfileView";
import { Profile, LinkItem } from "@/types";
import { Wifi, Battery, Signal } from "lucide-react";

interface PhoneMockupProps {
  profile: Profile;
  links: LinkItem[];
}

export default function PhoneMockup({ profile, links }: PhoneMockupProps) {
  const [time, setTime] = useState("09:41");

  useEffect(() => {
    const updateCurrentTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      setTime(`${hours}:${minutes}`);
    };
    updateCurrentTime();
    const timer = setInterval(updateCurrentTime, 30000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative mx-auto flex items-center justify-center">
      {/* Outer Phone Shell */}
      <div className="relative w-[340px] sm:w-[380px] h-[720px] bg-zinc-900 rounded-[52px] p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.1),inset_0_0_0_2px_rgba(255,255,255,0.05)] border-[4px] border-zinc-800">
        {/* Physical Button Accents */}
        <div className="absolute -left-[7px] top-28 w-[3px] h-10 bg-zinc-700 rounded-l-md" />
        <div className="absolute -left-[7px] top-42 w-[3px] h-12 bg-zinc-700 rounded-l-md" />
        <div className="absolute -left-[7px] top-58 w-[3px] h-12 bg-zinc-700 rounded-l-md" />
        <div className="absolute -right-[7px] top-36 w-[3px] h-16 bg-zinc-700 rounded-r-md" />

        {/* Inner Screen Bezel */}
        <div className="relative w-full h-full bg-black rounded-[42px] overflow-hidden flex flex-col border border-black shadow-inner">
          {/* Status Bar */}
          <div className="absolute top-0 left-0 right-0 z-30 h-11 px-7 flex items-center justify-between text-white text-[13px] font-semibold pointer-events-none drop-shadow">
            <span className="font-medium tracking-tight pl-1">{time}</span>

            {/* Dynamic Island Pill */}
            <div className="w-24 h-5 bg-black rounded-full mx-auto flex items-center justify-end px-2">
              <div className="w-2 h-2 rounded-full bg-zinc-800/80 mr-1" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#0a1020] ring-1 ring-zinc-700/50" />
            </div>

            <div className="flex items-center gap-1.5 pr-1">
              <Signal className="w-3.5 h-3.5" />
              <Wifi className="w-3.5 h-3.5" />
              <Battery className="w-4 h-4" />
            </div>
          </div>

          {/* Scrollable Screen Content */}
          <div className="w-full h-full overflow-y-auto pt-10 scrollbar-none">
            <ProfileView profile={profile} links={links} isPreview={true} />
          </div>

          {/* Home Indicator Bar */}
          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/40 rounded-full pointer-events-none z-30" />
        </div>
      </div>
    </div>
  );
}
