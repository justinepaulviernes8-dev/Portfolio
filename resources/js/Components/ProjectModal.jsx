import { useEffect, useRef, useState } from 'react';

export default function ProjectModal({ project, onClose }) {
    const dialog = useRef(null);
    const timeout = useRef(null);
    const [closing, setClosing] = useState(false);
    useEffect(() => {
        if (project) {
            setClosing(false);
            dialog.current.showModal();
            document.documentElement.classList.add('overflow-hidden');
        }
        return () => {
            clearTimeout(timeout.current);
            dialog.current?.close();
            document.documentElement.classList.remove('overflow-hidden');
        };
    }, [project]);

    function close() {
        if (closing) return;
        if (matchMedia('(prefers-reduced-motion: reduce)').matches) { onClose(); return; }
        setClosing(true);
        timeout.current = setTimeout(onClose, 200);
    }

    return <dialog ref={dialog} id="project-modal" aria-labelledby="modal-title"
        onCancel={(event) => { event.preventDefault(); close(); }}
        onClick={(event) => { if (event.target === event.currentTarget) close(); }}
        className={`m-auto max-h-[calc(100svh-2rem)] w-[min(56rem,calc(100%-2rem))] overflow-y-auto [scrollbar-width:none] rounded-3xl [&::-webkit-scrollbar]:hidden bg-white p-0 text-slate-900 shadow-2xl backdrop:bg-slate-950/60 backdrop:backdrop-blur-sm dark:bg-slate-900 dark:text-slate-100 ${closing ? 'is-closing' : ''}`}>
        {project && <>
            <div className="relative">
                <img id="modal-image" src={project.image_url} alt={project.image_alt} className="aspect-video w-full bg-slate-950 object-contain" />
                <button type="button" aria-label="Close project" onClick={close} className="absolute top-4 right-4 grid size-11 place-items-center rounded-full bg-white/90 text-slate-900 shadow-md transition hover:scale-105 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
                    <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" /></svg>
                </button>
            </div>
            <div className="flex flex-col gap-4 p-6 sm:p-8">
                <span id="modal-tag" className="self-start rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">{project.category}</span>
                <h3 id="modal-title" className="text-2xl font-bold sm:text-3xl">{project.title}</h3>
                <p id="modal-description" className="text-gray-600 dark:text-slate-400">{project.description}</p>
                <p id="modal-details" className="whitespace-pre-line text-gray-600 dark:text-slate-400">{project.details}</p>
                <div><p className="mb-2 text-sm font-semibold">Tools used</p>
                    <ul id="modal-tools" className="flex flex-wrap gap-2">{project.tech_stack.split(',').map((tool, i) => <li key={i} className="rounded-lg bg-gray-100 px-3 py-1 text-sm font-medium dark:bg-slate-800">{tool.trim()}</li>)}</ul>
                </div>
            </div>
        </>}
    </dialog>;
}
