"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import { scrollToSection } from "@/lib/section-scroll";

const PENDING_HASH_KEY = "ts-notebook-shop-pending-hash";

function scrollToHash(hash: string) {
  const normalizedHash = hash.startsWith("#") ? hash.slice(1) : hash;

  if (!normalizedHash) {
    return;
  }

  window.setTimeout(() => {
    scrollToSection(normalizedHash);
  }, 80);
}

export function HashScrollHandler() {
  const pathname = usePathname();

  useEffect(() => {
    const pendingHash = window.sessionStorage.getItem(PENDING_HASH_KEY);

    if (pendingHash) {
      window.sessionStorage.removeItem(PENDING_HASH_KEY);
      scrollToHash(pendingHash);
      return;
    }

    if (window.location.hash) {
      scrollToHash(window.location.hash);
    }
  }, [pathname]);

  return null;
}