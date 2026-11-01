import { useEffect, useRef } from 'react';
import { secondaryButton } from '../Layouts/ManagementLayout';

export default function DeleteConfirmation({ project, processing, error, onCancel, onConfirm }) {
    const dialog = useRef(null);
    useEffect(() => {
        const element = dialog.current;
        if (project) element.showModal(); else element.close();
        return () => element.close();
    }, [project]);
    return <dialog ref={dialog} aria-labelledby="delete-title" aria-describedby="delete-description" onCancel={(event) => { event.preventDefault(); if (!processing) onCancel(); }} className="m-auto w-[min(30rem,calc(100%-2rem))] rounded-3xl bg-white p-7 text-slate-900 shadow-2xl backdrop:bg-slate-950/60 dark:bg-slate-900 dark:text-slate-100">
        <h2 id="delete-title" className="text-xl font-bold">Delete project?</h2>
        <p id="delete-description" className="mt-3 text-gray-600 dark:text-slate-400">“{project?.title}” will be removed from your portfolio. This cannot be undone.</p>
        {error && <p role="alert" className="mt-3 text-red-600">{error}</p>}
        <div className="mt-6 flex flex-wrap justify-end gap-3">
            <button type="button" autoFocus disabled={processing} onClick={onCancel} className={secondaryButton}>Cancel</button>
            <button type="button" disabled={processing} onClick={onConfirm} className="rounded-xl bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700 disabled:opacity-60">{processing ? 'Deleting…' : 'Delete project'}</button>
        </div>
    </dialog>;
}
