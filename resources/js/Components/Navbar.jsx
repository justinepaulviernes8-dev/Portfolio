export default function Navbar() {
    return (
        <header id="site-header" className="sticky top-0 z-40 border-b border-gray-200 bg-white/90 backdrop-blur transition-transform duration-300 dark:border-slate-800 dark:bg-slate-950/90">
    <nav className="mx-auto flex max-w-6xl 2xl:max-w-7xl items-center justify-between px-4 py-3 sm:px-6" aria-label="Main">
      <a href="#home" className="flex items-center gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600">
        
        <img src="/images/logo/logo.png" alt="" width="40" height="40" className="size-10 rounded-xl border border-gray-200 bg-white object-contain dark:border-slate-700 dark:invert" />
        <span className="sr-only">Home — </span>
        <span className="text-lg font-semibold whitespace-nowrap">Justine</span>
      </a>

      <div className="flex items-center gap-2">
        
        <ul className="hidden items-center gap-7 lg:flex">
          <li><a href="#home" data-nav="" className="border-b-2 border-transparent py-2 text-[15px] font-medium text-gray-600 hover:text-slate-900 aria-[current=page]:border-blue-600 aria-[current=page]:font-semibold aria-[current=page]:text-blue-700 dark:text-slate-400 dark:hover:text-white dark:aria-[current=page]:text-blue-300">Home</a></li>
          <li><a href="#about" data-nav="" className="border-b-2 border-transparent py-2 text-[15px] font-medium text-gray-600 hover:text-slate-900 aria-[current=page]:border-blue-600 aria-[current=page]:font-semibold aria-[current=page]:text-blue-700 dark:text-slate-400 dark:hover:text-white dark:aria-[current=page]:text-blue-300">About Me</a></li>
          <li><a href="#skills" data-nav="" className="border-b-2 border-transparent py-2 text-[15px] font-medium text-gray-600 hover:text-slate-900 aria-[current=page]:border-blue-600 aria-[current=page]:font-semibold aria-[current=page]:text-blue-700 dark:text-slate-400 dark:hover:text-white dark:aria-[current=page]:text-blue-300">Skills</a></li>
          <li><a href="#projects" data-nav="" className="border-b-2 border-transparent py-2 text-[15px] font-medium text-gray-600 hover:text-slate-900 aria-[current=page]:border-blue-600 aria-[current=page]:font-semibold aria-[current=page]:text-blue-700 dark:text-slate-400 dark:hover:text-white dark:aria-[current=page]:text-blue-300">Projects</a></li>
          <li><a href="#education" data-nav="" className="border-b-2 border-transparent py-2 text-[15px] font-medium text-gray-600 hover:text-slate-900 aria-[current=page]:border-blue-600 aria-[current=page]:font-semibold aria-[current=page]:text-blue-700 dark:text-slate-400 dark:hover:text-white dark:aria-[current=page]:text-blue-300">Education</a></li>
          <li><a href="#contact" data-nav="" className="border-b-2 border-transparent py-2 text-[15px] font-medium text-gray-600 hover:text-slate-900 aria-[current=page]:border-blue-600 aria-[current=page]:font-semibold aria-[current=page]:text-blue-700 dark:text-slate-400 dark:hover:text-white dark:aria-[current=page]:text-blue-300">Contact</a></li>
        </ul>

        
        <button id="theme-toggle" type="button" aria-label="Switch to dark mode" className="grid size-11 place-items-center overflow-hidden rounded-full border border-gray-200 transition duration-300 hover:scale-110 hover:bg-blue-50 active:scale-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 motion-reduce:transition-none dark:border-slate-700 dark:hover:bg-slate-800">
          
          
          <svg className="size-5 rotate-0 scale-100 text-blue-700 opacity-100 transition duration-500 ease-out [grid-area:1/1] motion-reduce:transition-none dark:-rotate-90 dark:scale-0 dark:opacity-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
          
          <svg className="size-5 rotate-90 scale-0 text-amber-300 opacity-0 transition duration-500 ease-out [grid-area:1/1] motion-reduce:transition-none dark:rotate-0 dark:scale-100 dark:opacity-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></svg>
        </button>

        
        <button id="menu-button" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-menu" className="group grid size-11 place-items-center rounded-xl bg-blue-600 text-white transition hover:bg-blue-700 active:scale-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 motion-reduce:transition-none lg:hidden">
          
          <span aria-hidden="true" className="h-0.5 w-5 -translate-y-1.5 rounded-full bg-current transition duration-300 ease-out [grid-area:1/1] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-45 motion-reduce:transition-none"></span>
          <span aria-hidden="true" className="h-0.5 w-5 rounded-full bg-current transition duration-300 ease-out [grid-area:1/1] group-aria-expanded:scale-x-0 group-aria-expanded:opacity-0 motion-reduce:transition-none"></span>
          <span aria-hidden="true" className="h-0.5 w-5 translate-y-1.5 rounded-full bg-current transition duration-300 ease-out [grid-area:1/1] group-aria-expanded:translate-y-0 group-aria-expanded:-rotate-45 motion-reduce:transition-none"></span>
        </button>
      </div>
    </nav>

    
    
    <div id="mobile-menu" data-open="false" inert className="group grid grid-rows-[0fr] opacity-0 transition-[grid-template-rows,opacity] duration-300 ease-out data-[open=true]:grid-rows-[1fr] data-[open=true]:opacity-100 motion-reduce:transition-none lg:hidden">
      <div className="overflow-hidden">
      <ul className="flex flex-col gap-1 border-t border-gray-200 px-4 pt-3 pb-4 dark:border-slate-800">
        <li className="-translate-y-2 opacity-0 transition duration-300 delay-[40ms] group-data-[open=true]:translate-y-0 group-data-[open=true]:opacity-100 motion-reduce:transition-none"><a href="#home" data-nav="" className="block rounded-xl px-4 py-3 font-medium hover:bg-blue-50 aria-[current=page]:bg-blue-50 aria-[current=page]:font-semibold aria-[current=page]:text-blue-700 dark:hover:bg-slate-800 dark:aria-[current=page]:bg-blue-950 dark:aria-[current=page]:text-blue-300">Home</a></li>
        <li className="-translate-y-2 opacity-0 transition duration-300 delay-[80ms] group-data-[open=true]:translate-y-0 group-data-[open=true]:opacity-100 motion-reduce:transition-none"><a href="#about" data-nav="" className="block rounded-xl px-4 py-3 font-medium hover:bg-blue-50 aria-[current=page]:bg-blue-50 aria-[current=page]:font-semibold aria-[current=page]:text-blue-700 dark:hover:bg-slate-800 dark:aria-[current=page]:bg-blue-950 dark:aria-[current=page]:text-blue-300">About Me</a></li>
        <li className="-translate-y-2 opacity-0 transition duration-300 delay-[120ms] group-data-[open=true]:translate-y-0 group-data-[open=true]:opacity-100 motion-reduce:transition-none"><a href="#skills" data-nav="" className="block rounded-xl px-4 py-3 font-medium hover:bg-blue-50 aria-[current=page]:bg-blue-50 aria-[current=page]:font-semibold aria-[current=page]:text-blue-700 dark:hover:bg-slate-800 dark:aria-[current=page]:bg-blue-950 dark:aria-[current=page]:text-blue-300">Skills</a></li>
        <li className="-translate-y-2 opacity-0 transition duration-300 delay-[160ms] group-data-[open=true]:translate-y-0 group-data-[open=true]:opacity-100 motion-reduce:transition-none"><a href="#projects" data-nav="" className="block rounded-xl px-4 py-3 font-medium hover:bg-blue-50 aria-[current=page]:bg-blue-50 aria-[current=page]:font-semibold aria-[current=page]:text-blue-700 dark:hover:bg-slate-800 dark:aria-[current=page]:bg-blue-950 dark:aria-[current=page]:text-blue-300">Projects</a></li>
        <li className="-translate-y-2 opacity-0 transition duration-300 delay-[200ms] group-data-[open=true]:translate-y-0 group-data-[open=true]:opacity-100 motion-reduce:transition-none"><a href="#education" data-nav="" className="block rounded-xl px-4 py-3 font-medium hover:bg-blue-50 aria-[current=page]:bg-blue-50 aria-[current=page]:font-semibold aria-[current=page]:text-blue-700 dark:hover:bg-slate-800 dark:aria-[current=page]:bg-blue-950 dark:aria-[current=page]:text-blue-300">Education</a></li>
        <li className="-translate-y-2 opacity-0 transition duration-300 delay-[240ms] group-data-[open=true]:translate-y-0 group-data-[open=true]:opacity-100 motion-reduce:transition-none"><a href="#contact" data-nav="" className="block rounded-xl px-4 py-3 font-medium hover:bg-blue-50 aria-[current=page]:bg-blue-50 aria-[current=page]:font-semibold aria-[current=page]:text-blue-700 dark:hover:bg-slate-800 dark:aria-[current=page]:bg-blue-950 dark:aria-[current=page]:text-blue-300">Contact</a></li>
      </ul>
      </div>
    </div>
  </header>
    );
}
