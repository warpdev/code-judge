"use client";
import React from "react";
import { RemoveScroll } from "react-remove-scroll";
import { motion, MotionConfig } from "framer-motion";
import { twMerge } from "tailwind-merge";
import { FocusOn } from "react-focus-on";

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
        className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 md:items-center"
        style={{ pointerEvents: "auto" }}
        initial={{
          opacity: 0.4,
        }}
        animate={{
          opacity: 1,
        }}
        exit={{
          opacity: 0,
        }}
      >
        <FocusOn
          className="w-full"
          onClickOutside={handleClose}
          onEscapeKey={handleClose}
          gapMode="padding"
        >
          <motion.div
            className={twMerge(
              "container max-h-screen w-full overflow-y-auto rounded-t-2xl bg-white p-4 md:m-auto md:rounded-2xl md:p-10 md:px-14",
              "dark:bg-neutral-900",
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
        </FocusOn>
      </motion.div>
    </MotionConfig>
  );
};

export default BaseModal;
