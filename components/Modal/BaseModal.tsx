"use client";
import React from "react";
import { RemoveScroll } from "react-remove-scroll";
import { motion, MotionConfig } from "framer-motion";
import { twMerge } from "tailwind-merge";

const BaseModal = ({
  children,
  className,
  onClose: handleClose,
}: {
  children: React.ReactNode;
  className?: string;
  onClose?: () => void;
}) => {
  return (
    <MotionConfig transition={{ duration: 0.17, ease: "easeOut" }}>
      <motion.div
        className="fixed inset-0 z-50 flex items-end justify-center md:items-center"
        onClick={handleClose}
      >
        <RemoveScroll className="w-full" removeScrollBar={false}>
          <motion.div
            style={{ pointerEvents: "auto" }}
            className="absolute inset-0 -z-10 bg-black/20"
            initial={{
              opacity: 0.4,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
          ></motion.div>
          <motion.div
            className={twMerge(
              "container max-h-screen w-full overflow-y-auto rounded-t-2xl bg-white p-4 md:m-auto md:rounded-2xl md:p-10 md:px-14",
              className,
            )}
            onClick={(e) => e.stopPropagation()}
            initial={{
              opacity: 0.4,
              y: 8,
            }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {children}
          </motion.div>
        </RemoveScroll>
      </motion.div>
    </MotionConfig>
  );
};

export default BaseModal;
