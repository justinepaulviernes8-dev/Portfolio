export const inputClass = 'w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 placeholder:text-gray-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/30 focus:outline-none aria-invalid:border-red-600 dark:border-slate-700 dark:bg-slate-900 dark:placeholder:text-slate-500 dark:aria-invalid:border-red-400';

export default function FormField({ name, label, error, hint, required = true, children }) {
    return <div className="flex flex-col gap-1.5">
        <label htmlFor={name} className="text-sm font-medium">{label}{required && <span aria-hidden="true" className="text-blue-700 dark:text-blue-300"> *</span>}</label>
        {hint && <p id={`${name}-hint`} className="text-sm text-gray-500 dark:text-slate-400">{hint}</p>}
        {children}
        {error && <p id={`${name}-error`} role="alert" className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p>}
    </div>;
}
