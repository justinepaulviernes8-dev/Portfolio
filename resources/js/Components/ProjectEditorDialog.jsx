import { useEffect, useRef, useState } from 'react';
import ProjectForm from './ProjectForm';

export default function ProjectEditorDialog({ editor, onClose }) {
    const dialog = useRef(null);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        const element = dialog.current;
        if (editor) {
            element.showModal();
            document.documentElement.classList.add('overflow-hidden');
        }
        return () => {
            element.close();
            document.documentElement.classList.remove('overflow-hidden');
        };
    }, [editor]);

    return <dialog ref={dialog} aria-labelledby="project-editor-title"
        onCancel={(event) => { event.preventDefault(); if (!processing) onClose(); }}
        className="m-auto max-h-[calc(100svh-2rem)] w-[min(52rem,calc(100%-2rem))] overflow-y-auto rounded-3xl bg-white p-6 text-slate-900 shadow-2xl backdrop:bg-slate-950/60 backdrop:backdrop-blur-sm sm:p-8 dark:bg-slate-950 dark:text-slate-100">
        {editor && <>
            <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                    <p className="text-xs font-semibold tracking-[0.12em] text-blue-700 dark:text-blue-300">PROJECTS</p>
                    <h2 id="project-editor-title" className="mt-2 text-2xl font-bold">{editor.project ? 'Edit project' : 'Add project'}</h2>
                </div>
                <button type="button" aria-label="Close project form" disabled={processing} onClick={onClose} className="grid size-10 shrink-0 place-items-center rounded-full border border-gray-200 hover:bg-blue-50 disabled:opacity-50 dark:border-slate-700 dark:hover:bg-slate-800">
                    <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" /></svg>
                </button>
            </div>
            <ProjectForm key={editor.project?.id ?? 'create'} project={editor.project} embedded onSuccess={onClose} onCancel={onClose} onProcessingChange={setProcessing} />
        </>}
    </dialog>;
}
