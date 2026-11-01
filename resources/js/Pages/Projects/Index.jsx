import { Link, router } from '@inertiajs/react';
import { useState } from 'react';
import ManagementLayout, { primaryButton } from '../../Layouts/ManagementLayout';
import DeleteConfirmation from '../../Components/DeleteConfirmation';

export default function Index({ projects }) {
    const [deleting, setDeleting] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');
    function remove() {
        if (!deleting || processing) return;
        setProcessing(true);
        router.delete(`/projects/${deleting.id}`, {
            preserveScroll: 'errors',
            onSuccess: () => setDeleting(null),
            onError: () => setError('The project could not be deleted. Please try again.'),
            onFinish: () => setProcessing(false),
        });
    }
    return <ManagementLayout title="Projects">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <p className="text-gray-600 dark:text-slate-400">{projects.length} {projects.length === 1 ? 'project' : 'projects'} · shown in display order</p>
            <Link href="/projects/create" className={primaryButton}>Add project</Link>
        </div>
        {projects.length === 0 ? <div className="rounded-3xl border border-dashed border-gray-300 p-12 text-center dark:border-slate-700"><h2 className="text-xl font-semibold">No projects yet</h2><p className="mt-2 text-gray-600 dark:text-slate-400">Add your first project to display it on your portfolio.</p></div> : <ul className="space-y-4">
            {projects.map((project) => <li key={project.id} className="flex flex-col gap-5 rounded-2xl border border-gray-200 bg-white p-5 sm:flex-row sm:items-center dark:border-slate-800 dark:bg-slate-950">
                <img src={project.image_url} alt={project.image_alt} className="aspect-video w-full rounded-xl bg-gray-100 object-contain sm:w-40 dark:bg-slate-900" />
                <div className="min-w-0 flex-1"><p className="text-xs font-semibold text-blue-700 dark:text-blue-300">{project.category} · Order {project.display_order}</p><h2 className="mt-1 text-lg font-semibold break-words">{project.title}</h2><p className="mt-1 text-sm text-gray-600 dark:text-slate-400">{project.description}</p><p className="mt-2 text-xs text-gray-500 dark:text-slate-400">{project.tech_stack}</p></div>
                <div className="flex shrink-0 gap-3"><Link href={`/projects/${project.id}/edit`} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold hover:border-blue-600 hover:text-blue-700 dark:border-slate-700 dark:hover:text-blue-300" aria-label={`Edit ${project.title}`}>Edit</Link><button type="button" onClick={() => { setError(''); setDeleting(project); }} className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950" aria-label={`Delete ${project.title}`}>Delete</button></div>
            </li>)}
        </ul>}
        <DeleteConfirmation project={deleting} processing={processing} error={error} onCancel={() => setDeleting(null)} onConfirm={remove} />
    </ManagementLayout>;
}
