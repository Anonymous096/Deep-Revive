"use client";
import React, { useRef } from "react";
import { motion } from "motion/react";

export const ContainerScroll = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const checkMobile = () => {
      // Handle mobile detection if needed
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  return (
    <div
      className="h-[60rem] md:h-[50rem] flex items-center justify-center relative p-2 md:p-20"
      ref={containerRef}
    >
      <div
        className="py-10 md:py-40 w-full relative"
        style={{
          perspective: "1000px",
        }}
      >
        <Card>{children}</Card>
      </div>
    </div>
  );
};

interface HeaderProps {
  translate: number;
  titleComponent: React.ReactNode;
}

export const Header = ({ translate, titleComponent }: HeaderProps) => {
  return (
    <motion.div
      style={{
        translateY: translate,
      }}
      className="div max-w-5xl mx-auto text-center"
    >
      {titleComponent}
    </motion.div>
  );
};

export const Card = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div className="max-w-7xl -mt-6 mx-auto h-[30rem] md:h-[45rem] w-full p-2 md:p-6 bg-[#222222] rounded-[30px] shadow-lg">
      <div className="h-full w-full overflow-hidden rounded-2xl bg-gray-100 dark:bg-zinc-900 md:rounded-2xl md:p-4">
        {children}
      </div>
    </motion.div>
  );
};
