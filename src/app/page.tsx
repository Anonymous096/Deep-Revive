"use client";

import React from "react";
import { HeroHighlight, Highlight } from "@/components/ui/hero-highlight";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { motion } from "framer-motion";
import Link from "next/link";
import { HeroScrollDemo } from "@/components/hero-scroll-animation";
import { HeroImages } from "@/components/hero-images";
import { FeaturesSectionDemo } from "@/components/ui/features";
import { useAuth } from "@clerk/nextjs";

export default function Home() {
  const { isSignedIn } = useAuth();

  return (
    <div className="flex flex-col min-h-screen items-center w-full">
      <HeroHighlight>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: [20, -5, 0] }}
          transition={{ duration: 0.5, ease: [0.4, 0.0, 0.2, 1] }}
          className="text-3xl lg:text-5xl lg:leading-tight max-w-5xl mx-auto text-center tracking-tight font-bold text-black dark:text-white"
        >
          Enhance{" "}
          <Highlight className="text-white">Restore and Relive</Highlight> your
          memories
        </motion.h1>
      </HeroHighlight>

      <div className="text-lg text-center font-semibold mb-4">
        200,000+ image restorations and enhancements
      </div>

      <Link
        href={isSignedIn ? "/dashboard" : "/auth/sign-up"}
        className="mb-10"
      >
        <HoverBorderGradient
          containerClassName="rounded-full"
          as="button"
          className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2"
        >
          Open the app
        </HoverBorderGradient>
      </Link>
      <div className="flex flex-col min-h-screen items-center w-full">
        <HeroScrollDemo />
        <HeroImages />
      </div>

      <div className="flex flex-col min-h-screen items-center w-full">
        <FeaturesSectionDemo />
      </div>
    </div>
  );
}
