export const SECTION_SCROLL_OFFSET = 108;

export function scrollToSection(sectionId: string, behavior: ScrollBehavior = "smooth") {
  if (typeof window === "undefined") {
    return;
  }

  const target = document.getElementById(sectionId);

  if (!target) {
    return;
  }

  const targetPosition = target.getBoundingClientRect().top + window.scrollY - SECTION_SCROLL_OFFSET;

  window.scrollTo({
    top: Math.max(targetPosition, 0),
    behavior,
  });
}