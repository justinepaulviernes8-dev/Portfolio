import { Head, Link, usePage } from '@inertiajs/react';
import SuccessMessage from '../Components/SuccessMessage';

export const primaryButton = 'inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-default disabled:opacity-60';
export const secondaryButton = 'inline-flex items-center justify-center rounded-xl border border-gray-300 px-5 py-3 font-semibold hover:border-blue-600 hover:text-blue-700 dark:border-slate-700 dark:hover:text-blue-300';

export default function ManagementLayout({ title, children }) {
    const { management } = usePage().props;
    return <>
        <Head title={title} />
        <header className="border-b border-gray-200 dark:border-slate-800">
            <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-5 sm:px-6" aria-label="Project management">
                <Link href="/projects" className="flex items-center gap-3 font-semibold"><img src="/images/logo/logo.png" alt="" className="size-10 rounded-xl border border-gray-200 dark:invert" />Justine / Projects</Link>
                <Link href="/" className="text-sm font-medium text-blue-700 hover:underline dark:text-blue-300">View portfolio →</Link>
                {management?.authRequired && management?.canManage && <Link href="/logout" method="post" as="button" className="text-sm font-medium text-blue-700 hover:underline dark:text-blue-300">Sign out</Link>}
            </nav>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
            <p className="text-sm font-semibold tracking-[0.12em] text-blue-700 dark:text-blue-300">PROJECT MANAGEMENT</p>
            <h1 className="mt-2 mb-8 text-3xl font-bold sm:text-4xl">{title}</h1>
            <SuccessMessage className="mb-6 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300" />
            {children}
        </main>
    </>;
}
