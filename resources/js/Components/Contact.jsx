import SectionTitle from './SectionTitle';

export default function Contact() {
    return (
        <section id="contact" className="scroll-mt-20 bg-gray-100 py-20 md:py-24 dark:bg-slate-900">
      <div className="mx-auto max-w-6xl 2xl:max-w-7xl px-4 sm:px-6">
        <SectionTitle label="CONTACT" title="Let's connect" />

        <div className="grid gap-6 md:grid-cols-2">
          
          <div data-reveal="" className="flex flex-col gap-6 rounded-3xl bg-blue-600 p-8 text-white sm:p-9">
            <h3 className="text-2xl font-semibold">Get in touch</h3>
            <p>Feel free to reach out if you'd like to collaborate on projects, work together on school activities, or share ideas about web design!</p>
            <ul className="flex flex-col gap-4">
              <li className="flex items-center gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white/20"><svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="6" y="2" width="12" height="20" rx="2" /><path d="M11 18h2" /></svg></span>
                <span><span className="block text-sm">Mobile number</span><span className="font-semibold">09811692176</span></span>
              </li>
              <li>
                <a href="mailto:your.email@example.com" className="flex items-center gap-4 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
                  <span className="grid size-11 place-items-center rounded-xl bg-white/20"><svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" /><path d="m22 6-10 7L2 6" /></svg></span>
                  <span><span className="block text-sm">Email</span><span className="font-semibold underline-offset-4 hover:underline">justinepaulviernes8@gmail.com</span></span>
                </a>
              </li>
              <li>
                <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
                  <span className="grid size-11 place-items-center rounded-xl bg-white/20"><svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" /></svg></span>
                  <span><span className="block text-sm">GitHub</span><span className="font-semibold underline-offset-4 hover:underline">github.com/justinepaulviernes8-dev</span></span>
                </a>
              </li>
            </ul>
          </div>

          
          <form data-reveal="" id="contact-form" noValidate className="flex flex-col gap-5 rounded-3xl border border-gray-200 bg-white p-8 sm:p-9 dark:border-slate-800 dark:bg-slate-950">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="text-sm font-medium">Name</label>
              <input id="name" name="name" type="text" autoComplete="name" placeholder="Your full name" aria-describedby="name-error" className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 placeholder:text-gray-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/30 focus:outline-none aria-invalid:border-red-600 dark:border-slate-700 dark:bg-slate-900 dark:placeholder:text-slate-500 dark:aria-invalid:border-red-400" />
              <p id="name-error" className="hidden text-sm font-medium text-red-600 dark:text-red-400"></p>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" aria-describedby="email-error" className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 placeholder:text-gray-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/30 focus:outline-none aria-invalid:border-red-600 dark:border-slate-700 dark:bg-slate-900 dark:placeholder:text-slate-500 dark:aria-invalid:border-red-400" />
              <p id="email-error" className="hidden text-sm font-medium text-red-600 dark:text-red-400"></p>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="message" className="text-sm font-medium">Message</label>
              <textarea id="message" name="message" rows="5" placeholder="Write your message…" aria-describedby="message-error" className="resize-y rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 placeholder:text-gray-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/30 focus:outline-none aria-invalid:border-red-600 dark:border-slate-700 dark:bg-slate-900 dark:placeholder:text-slate-500 dark:aria-invalid:border-red-400"></textarea>
              <p id="message-error" className="hidden text-sm font-medium text-red-600 dark:text-red-400"></p>
            </div>
            <button type="submit" className="inline-flex items-center gap-2 self-start rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
              Send Message
              <svg className="size-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4z" /></svg>
            </button>
            <p id="form-success" role="status" className="hidden rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300"></p>
          </form>
        </div>
      </div>
    </section>
    );
}
