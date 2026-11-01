import SectionTitle from './SectionTitle';

export default function Education() {
    return (
        <section id="education" className="scroll-mt-20 py-20 md:py-24">
      <div className="mx-auto max-w-6xl 2xl:max-w-7xl px-4 sm:px-6">
        <SectionTitle label="EDUCATION" title="Education & experience" />

        <div className="grid gap-6 md:grid-cols-2">
          <article data-reveal="" className="rounded-3xl border border-gray-200 p-8 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="mb-6 text-xl font-semibold">Education</h3>
            <ol className="space-y-6 border-l-2 border-blue-100 pl-6 dark:border-blue-900">
              <li className="relative">
                <span className="absolute top-1.5 -left-[31px] size-3 rounded-full bg-blue-600 ring-4 ring-white dark:ring-slate-900" aria-hidden="true"></span>
                <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">[2024] – Present</p>
                <p className="font-semibold">[BS Information Technology]</p>
                <p className="text-sm text-gray-600 dark:text-slate-400">[Urdaneta City University]</p>
              </li>
              <li className="relative">
                <span className="absolute top-1.5 -left-[31px] size-3 rounded-full bg-blue-600 ring-4 ring-white dark:ring-slate-900" aria-hidden="true"></span>
                <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">[2022] – [2023]</p>
                <p className="font-semibold">[Senior High School GAS Strand]</p>
                <p className="text-sm text-gray-600 dark:text-slate-400">[Cabuloan National High School]</p>
              </li>
            </ol>
          </article>

          <article data-reveal="" className="rounded-3xl border border-gray-200 p-8 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="mb-6 text-xl font-semibold">Trainings &amp; Certifications</h3>
            <ol className="space-y-6 border-l-2 border-blue-100 pl-6 dark:border-blue-900">
              <li className="relative">
                <span className="absolute top-1.5 -left-[31px] size-3 rounded-full bg-blue-600 ring-4 ring-white dark:ring-slate-900" aria-hidden="true"></span>
                <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">[Month Year]</p>
                <p className="font-semibold">[Seminar or Workshop Title]</p>
                <p className="text-sm text-gray-600 dark:text-slate-400">[Organizer]</p>
              </li>
              <li className="relative">
                <span className="absolute top-1.5 -left-[31px] size-3 rounded-full bg-blue-600 ring-4 ring-white dark:ring-slate-900" aria-hidden="true"></span>
                <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">[Month Year]</p>
                <p className="font-semibold">[Certification or Online Course]</p>
                <p className="text-sm text-gray-600 dark:text-slate-400">[Provider]</p>
              </li>
            </ol>
          </article>
        </div>
      </div>
    </section>
    );
}
