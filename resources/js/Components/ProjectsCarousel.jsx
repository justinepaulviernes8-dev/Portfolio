import { useEffect, useRef, useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import SectionTitle from './SectionTitle';
import ProjectModal from './ProjectModal';
import ProjectEditorDialog from './ProjectEditorDialog';
import DeleteConfirmation from './DeleteConfirmation';
import SuccessMessage from './SuccessMessage';
import { primaryButton } from '../Layouts/ManagementLayout';

const positions = {
    0: { x: 0, s: 1, r: 0, o: 1, b: 1, z: 5 },
    1: { x: 62, s: 0.78, r: -28, o: 0.9, b: 0.55, z: 4 },
    2: { x: 108, s: 0.6, r: -38, o: 0.55, b: 0.4, z: 3 },
    hidden: { x: 140, s: 0.5, r: -45, o: 0, b: 0.3, z: 1 },
};
export const toolsFor = (project) => project.tech_stack.split(',').map((tool) => tool.trim()).filter(Boolean);

export default function ProjectsCarousel({ projects }) {
    const { management } = usePage().props;
    const canManage = management?.canManage ?? false;
    const [active, setActive] = useState(0);
    const [selected, setSelected] = useState(null);
    const [infoIndex, setInfoIndex] = useState(0);
    const [fading, setFading] = useState(false);
    const [editor, setEditor] = useState(null);
    const [deleting, setDeleting] = useState(null);
    const [processingDelete, setProcessingDelete] = useState(false);
    const [deleteError, setDeleteError] = useState('');
    const addButton = useRef(null);
    const stage = useRef(null);
    const startX = useRef(null);
    const swiped = useRef(false);
    const safeIndex = Math.min(active, Math.max(0, projects.length - 1));
    const info = projects[Math.min(infoIndex, Math.max(0, projects.length - 1))];

    useEffect(() => {
        setFading(true);
        const timeout = setTimeout(() => { setInfoIndex(safeIndex); setFading(false); }, 200);
        return () => clearTimeout(timeout);
    }, [safeIndex]);

    function goTo(index) {
        if (projects.length) setActive((index + projects.length) % projects.length);
    }
    function openActive() { if (projects[safeIndex]) setSelected(projects[safeIndex]); }

    function closeEditor() {
        const wasEditing = Boolean(editor?.project);
        setEditor(null);
        requestAnimationFrame(() => (wasEditing ? stage.current : addButton.current)?.focus({ preventScroll: true }));
    }

    function deleteProject() {
        if (!deleting || processingDelete) return;
        setProcessingDelete(true);
        router.delete(`/projects/${deleting.id}`, {
            data: { return_to: 'portfolio' },
            preserveScroll: true,
            onSuccess: () => { setDeleting(null); addButton.current?.focus({ preventScroll: true }); },
            onError: () => setDeleteError('The project could not be deleted. Please try again.'),
            onFinish: () => setProcessingDelete(false),
        });
    }

    const arrowClass = 'grid size-11 place-items-center rounded-full border border-gray-300 bg-white transition lg:hidden hover:scale-110 hover:border-blue-600 hover:text-blue-700 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:border-slate-700 dark:bg-slate-950 dark:hover:text-blue-300';

    return <>
        <section id="projects" className="scroll-mt-20 overflow-x-clip bg-gray-100 py-20 md:py-24 dark:bg-slate-900">
            <div className="mx-auto max-w-6xl 2xl:max-w-7xl px-4 sm:px-6">
                <SectionTitle label="PROJECTS" title="School projects & activities" />
                <div className="mb-8 flex flex-col items-center gap-4">
                    {canManage && <button ref={addButton} type="button" onClick={() => setEditor({ project: null })} className={primaryButton}>Add project</button>}
                    <SuccessMessage className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300" />
                </div>
                <div data-reveal="">
                {projects.length === 0 ? <p className="py-12 text-center text-gray-600 dark:text-slate-400">Projects will appear here when they are added.</p> : <div>
                    <div id="project-carousel" ref={stage} tabIndex={0} aria-roledescription="carousel" aria-label="Projects (left and right arrow keys to browse, Enter to open)"
                        className="relative mx-auto h-[min(22rem,50vw)] touch-pan-y rounded-2xl [perspective:1200px] focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-blue-600"
                        onKeyDown={(event) => {
                            if (['ArrowLeft', 'ArrowRight', 'Enter'].includes(event.key)) event.preventDefault();
                            if (event.key === 'ArrowLeft') goTo(safeIndex - 1);
                            if (event.key === 'ArrowRight') goTo(safeIndex + 1);
                            if (event.key === 'Enter') openActive();
                        }}
                        onPointerDown={(event) => { startX.current = event.clientX; swiped.current = false; }}
                        onPointerCancel={() => { startX.current = null; }}
                        onPointerUp={(event) => {
                            if (startX.current === null) return;
                            const moved = event.clientX - startX.current;
                            startX.current = null;
                            if (Math.abs(moved) > 50) { swiped.current = true; goTo(safeIndex + (moved < 0 ? 1 : -1)); }
                        }}>
                        {projects.map((project, index) => {
                            let distance = (index - safeIndex + projects.length) % projects.length;
                            if (distance > projects.length / 2) distance -= projects.length;
                            const side = Math.sign(distance);
                            const p = positions[Math.abs(distance)] || positions.hidden;
                            return <article key={project.id} data-project="" aria-hidden={distance !== 0}
                                onClick={() => {
                                    if (swiped.current) { swiped.current = false; return; }
                                    if (index === safeIndex) openActive(); else goTo(index);
                                }}
                                style={{ transform: `translate(-50%, -50%) translateX(${p.x * side}%) scale(${p.s}) rotateY(${p.r * side}deg)`, opacity: p.o, filter: `brightness(${p.b})`, zIndex: p.z, pointerEvents: p.o === 0 ? 'none' : 'auto' }}
                                className={`absolute top-1/2 left-1/2 w-[min(36rem,78vw)] cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl shadow-slate-900/25 transition-[transform,opacity,filter,box-shadow] duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] select-none motion-reduce:transition-none dark:border-slate-700 dark:bg-slate-950 ${distance === 0 ? 'is-active' : ''}`}>
                                <img src={project.image_url} alt={project.image_alt} loading="lazy" draggable={false} className={`aspect-video w-full ${project.image_fit === 'contain' ? 'bg-[#e9ecdf] object-contain' : 'object-cover'}`} />
                            </article>;
                        })}
                    </div>
                    <div className="mt-8 flex items-center justify-center gap-5">
                        <button id="carousel-prev" type="button" aria-label="Previous project" className={arrowClass} onClick={() => goTo(safeIndex - 1)}>
                            <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                        </button>
                        <div id="carousel-dots" className="flex flex-wrap items-center justify-center gap-2">
                            {projects.map((project, index) => <button key={project.id} type="button" aria-label={`Show project ${index + 1}`} aria-current={index === safeIndex} onClick={() => goTo(index)} className="h-2.5 w-2.5 rounded-full bg-gray-300 transition-all duration-300 hover:bg-blue-400 aria-[current=true]:w-7 aria-[current=true]:bg-blue-600 dark:bg-slate-600" />)}
                        </div>
                        <button id="carousel-next" type="button" aria-label="Next project" className={arrowClass} onClick={() => goTo(safeIndex + 1)}>
                            <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                        </button>
                    </div>
                    {info && <div id="carousel-info" aria-live="polite" className={`mx-auto mt-8 flex max-w-3xl flex-col items-center gap-4 text-center transition-opacity duration-200 ${fading ? 'opacity-0' : ''}`}>
                        <span id="carousel-tag" className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">{info.category}</span>
                        <h3 id="carousel-title" className="text-2xl leading-snug font-bold sm:text-3xl">{info.title}</h3>
                        <p id="carousel-description" className="text-gray-600 dark:text-slate-400">{info.description}</p>
                        <ul id="carousel-tools" className="flex flex-wrap justify-center gap-2" aria-label="Tools used">{toolsFor(info).map((tool, i) => <li key={`${tool}-${i}`} className="rounded-md bg-white px-2.5 py-1 text-xs font-medium shadow-sm dark:bg-slate-800">{tool}</li>)}</ul>
                    </div>}
                </div>}
                </div>
            </div>
        </section>
        <ProjectModal project={selected} canManage={canManage}
            onClose={() => { setSelected(null); stage.current?.focus({ preventScroll: true }); }}
            onEdit={(project) => { setSelected(null); setEditor({ project }); }}
            onDelete={(project) => { setSelected(null); setDeleteError(''); setDeleting(project); }} />
        {editor && <ProjectEditorDialog editor={editor} onClose={closeEditor} />}
        <DeleteConfirmation project={deleting} processing={processingDelete} error={deleteError} onCancel={() => { setSelected(deleting); setDeleting(null); }} onConfirm={deleteProject} />
    </>;
}
