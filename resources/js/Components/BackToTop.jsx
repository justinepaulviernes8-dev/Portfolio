export default function BackToTop() {
    return (
        <a href="#home" id="back-to-top" aria-label="Back to top" className="pointer-events-none fixed right-5 bottom-5 z-40 grid size-12 place-items-center rounded-full bg-blue-600 text-white opacity-0 shadow-lg shadow-blue-600/40 transition-opacity hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:right-7 sm:bottom-7">
    <svg className="size-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
  </a>
    );
}
