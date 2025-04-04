"use client";
import React from "react";

import POV from "@/public/00_00.png";
import Ride from "@/public/10045_02.png";
import SF from "@/public/Blake_Lively_00.png";
import Goats from "@/public/Blake_Lively_01.png";
import { LayoutGrid } from "./ui/layout-grid";

export function HeroImages() {
  return (
    <div className="h-screen w-full">
      <LayoutGrid cards={cards} />
    </div>
  );
}

const SkeletonOne = () => {
  return (
    <div>
      <p className="font-bold md:text-4xl text-xl text-white">
        POV: A Moment Captured
      </p>
      <p className="font-normal text-base text-white"></p>
      <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
        Experience the beauty of the moment with this captivating view. The text
        behind the image effect enhances the scene, drawing you into the
        experience.
      </p>
    </div>
  );
};

const SkeletonThree = () => {
  return (
    <div>
      <p className="font-bold md:text-4xl text-xl text-white">
        Rexan Wong: The Creator with the inspiration (Daniel Dalen)
      </p>
      <p className="font-normal text-base text-white"></p>
      <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
        Hey, it&apos;s Rexan! I&apos;m the creator of this website and I&apos;m
        so glad you&apos;re here. I got the inspiration to build this app from
        Daniel&apos;s thumbnails.
      </p>
    </div>
  );
};

const SkeletonTwo = () => {
  return (
    <div>
      <p className="font-bold md:text-4xl text-xl text-white">
        Ride: Adventure Awaits
      </p>
      <p className="font-normal text-base text-white"></p>
      <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
        Embrace the thrill of adventure. The text behind the image effect
        enhances the excitement, inviting you to join the journey.
      </p>
    </div>
  );
};

const SkeletonFour = () => {
  return (
    <div>
      <p className="font-bold md:text-4xl text-xl text-white">
        SF: City by the Bay
      </p>
      <p className="font-normal text-base text-white"></p>
      <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
        Discover the charm of San Francisco. The text behind the image effect
        beautifully complements the iconic skyline, enriching the urban
        experience.
      </p>
    </div>
  );
};

const cards = [
  {
    id: 1,
    content: <SkeletonOne />,
    className: "md:col-span-2",
    thumbnail: POV,
  },
  {
    id: 2,
    content: <SkeletonTwo />,
    className: "col-span-1",
    thumbnail: Ride,
  },
  {
    id: 3,
    content: <SkeletonThree />,
    className: "col-span-1",
    thumbnail: SF,
  },

  {
    id: 4,
    content: <SkeletonFour />,
    className: "md:col-span-2",
    thumbnail: Goats,
  },
];
