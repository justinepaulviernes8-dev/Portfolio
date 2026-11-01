import ProfileVideoPreview from './ProfileVideoPreview';

export default function Home() {
    return (
        <section id="home" className="flex min-h-[calc(100svh-69px)] scroll-mt-20 items-center">
      <div className="mx-auto grid w-full max-w-6xl 2xl:max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 md:py-16">
        <div data-reveal="" className="flex flex-col items-start gap-5">
          <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-300">
            <span className="size-2 rounded-full bg-blue-600" aria-hidden="true"></span>Welcome to my portfolio
          </span>
          <h1 className="text-4xl leading-tight font-bold sm:text-5xl">Hi, I'm <span className="text-blue-700 dark:text-blue-300">Justine Paul Viernes</span></h1>
          <p className="text-lg font-medium sm:text-xl">Student <span className="text-blue-600" aria-hidden="true">|</span> Aspiring Web Designer</p>
          <p className="max-w-md text-gray-600 dark:text-slate-400">Welcome to my creative space! As an aspiring web designer, I love exploring new ideas and creating clean, user-friendly designs.</p>
          <div className="flex flex-wrap gap-3 pt-2">
            <a href="#projects" className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
              View My Projects
              <svg className="size-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </a>
            <a href="#contact" className="inline-flex items-center rounded-xl border-[1.5px] border-gray-300 px-6 py-3.5 font-semibold hover:border-blue-600 hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:border-slate-700 dark:hover:text-blue-300">Contact Me</a>
          </div>
        </div>

        <div data-reveal="" className="flex justify-center">
          
          <div className="relative aspect-square w-[min(20rem,80vw,50svh)] lg:w-[min(26rem,52svh)]">
            <div className="absolute inset-0 rounded-full bg-blue-50 dark:bg-blue-950" aria-hidden="true"></div>
            
            <ProfileVideoPreview />
            <span className="pointer-events-none absolute -left-2 bottom-10 z-20 flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold shadow-lg shadow-slate-900/5 dark:border-slate-700 dark:bg-slate-900">
              <svg className="size-[18px] text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" /></svg>Web Design
            </span>
            <span className="pointer-events-none absolute -right-2 top-10 z-20 flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold shadow-lg shadow-slate-900/5 dark:border-slate-700 dark:bg-slate-900">
              <svg className="size-[18px] text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m16 18 6-6-6-6M8 6l-6 6 6 6" /></svg>HTML · Tailwind · JS
            </span>
          </div>
        </div>
      </div>
    </section>
    );
}
