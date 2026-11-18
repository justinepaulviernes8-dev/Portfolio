import SectionTitle from './SectionTitle';

export default function About() {
    return (
        <section id="about" className="scroll-mt-20 bg-gray-100 py-20 md:py-24 dark:bg-slate-900">
      <div className="mx-auto max-w-6xl 2xl:max-w-7xl px-4 sm:px-6">
        <SectionTitle label="ABOUT ME" title="Get to know me" />

        <div className="grid items-start gap-6 md:gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-6">
          <div data-reveal="" className="w-full max-w-[440px] justify-self-center md:w-72 lg:w-full">
            <img src="/images/profile/Formal_Portrait_with_Red_Tie-removebg-preview.png" alt="Justine Paul Viernes in a black suit and red tie" className="aspect-square w-full object-contain dark:hidden" />
            <img src="/images/profile/Formal_White_and_Grey_Circular-removebg-preview.png" alt="Justine Paul Viernes in a white suit and grey tie" className="hidden aspect-square w-full object-contain dark:block" />
          </div>

          <div className="grid w-full gap-6 md:grid-cols-2 lg:grid-cols-1">
            <article data-reveal="" className="rounded-3xl border border-gray-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-950">
              <div className="mb-4 flex items-center gap-3">
                <span className="grid size-12 place-items-center rounded-2xl bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  <svg className="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                </span>
                <h3 className="text-xl font-semibold">Introduction</h3>
              </div>
              <p className="text-gray-600 dark:text-slate-400">Hi! I'm Justine Viernes an aspiring web designer currently studying and learning how to create websites that are both visually appealing and user-friendly. I became interested in web design because I enjoy being creative, exploring new technologies, and turning ideas into digital experiences. I'm always eager to learn new skills and improve my designs.</p>
              <p className="mt-3 text-gray-600 dark:text-slate-400">I'm a curious and creative person who enjoys learning through practice, experimenting with ideas, and finding ways to improve my work.</p>
            </article>

            <article data-reveal="" className="rounded-3xl border border-gray-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-950">
              <div className="mb-4 flex items-center gap-3">
                <span className="grid size-12 place-items-center rounded-2xl bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  <svg className="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>
                </span>
                <h3 className="text-xl font-semibold">Goals &amp; Interests</h3>
              </div>
              <ul className="list-disc space-y-1 pl-5 text-gray-600 dark:text-slate-400">
                <li>Improve my web design skills this school year by learning more about HTML, CSS, and JavaScript and creating better website projects.</li>
                <li>Become a professional web designer who creates creative, user-friendly, and responsive websites for different clients and businesses.</li>
              </ul>
              <ul className="mt-4 flex flex-wrap gap-2" aria-label="Interests">
                <li className="rounded-full bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-300">Web Design</li>
                <li className="rounded-full bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-300">UI/UX</li>
                <li className="rounded-full bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-300">3D Modeling</li>
                <li className="rounded-full bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-300">Coding</li>
              </ul>
            </article>
          </div>
        </div>
      </div>
    </section>
    );
}
