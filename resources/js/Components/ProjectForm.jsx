import { Link, useForm, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import FormField, { inputClass } from './FormField';
import { primaryButton, secondaryButton } from '../Layouts/ManagementLayout';

export default function ProjectForm({ project = null, embedded = false, onSuccess, onCancel, onProcessingChange }) {
    const editing = Boolean(project);
    const { projects, projectOrders } = usePage().props;
    const form = useForm({
        title: project?.title ?? '', category: project?.category ?? '',
        description: project?.description ?? '', details: project?.details ?? '',
        tech_stack: project?.tech_stack ?? '', image_alt: project?.image_alt ?? '',
        image_fit: project?.image_fit ?? 'cover', display_order: String(project?.display_order ?? 0),
        image: null,
    });
    const formElement = useRef(null);
    const [submitted, setSubmitted] = useState(false);
    const orderValue = Number(form.data.display_order);
    const orderValid = form.data.display_order.trim() !== '' && Number.isInteger(orderValue) && orderValue >= 1 && orderValue <= 100;
    const orderTaken = orderValid
        && (projectOrders ?? projects ?? []).some((item) => item.id !== project?.id && Number(item.display_order) === orderValue);
    const orderError = submitted && !orderValid ? 'Choose a whole number from 1 to 100. 0 cannot be submitted.'
        : orderTaken ? 'This number is already taken. Choose a different display order.' : form.errors.display_order;
    const [preview, setPreview] = useState(project?.image_url ?? null);
    useEffect(() => { onProcessingChange?.(form.processing); }, [form.processing, onProcessingChange]);
    useEffect(() => {
        if (!form.data.image) { setPreview(project?.image_url ?? null); return; }
        const url = URL.createObjectURL(form.data.image);
        setPreview(url);
        return () => URL.revokeObjectURL(url);
    }, [form.data.image, project?.image_url]);

    function attributes(name, hint = false) {
        const error = name === 'display_order' ? orderError : form.errors[name];
        return {
            id: name, name, value: form.data[name],
            onChange: (event) => {
                form.setData(name, event.target.value);
                if (name === 'display_order') form.clearErrors('display_order');
            },
            className: inputClass, required: true,
            'aria-invalid': error ? true : undefined,
            'aria-describedby': [hint ? `${name}-hint` : '', error ? `${name}-error` : ''].filter(Boolean).join(' ') || undefined,
        };
    }
    function submit(event) {
        event.preventDefault();
        if (form.processing || (editing && !form.isDirty)) return;
        setSubmitted(true);
        if (!orderValid || orderTaken) {
            formElement.current?.querySelector('[name="display_order"]')?.focus();
            return;
        }
        // POST plus method spoofing lets PHP receive replacement images during updates.
        form.transform((data) => ({
            ...data,
            ...(editing ? { _method: 'put' } : {}),
            ...(embedded ? { return_to: 'portfolio' } : {}),
        }));
        form.post(editing ? `/projects/${project.id}` : '/projects', {
            forceFormData: true, preserveScroll: embedded ? true : 'errors',
            onSuccess,
            onError: (errors) => {
                requestAnimationFrame(() => formElement.current?.querySelector(`[name="${Object.keys(errors)[0]}"]`)?.focus());
            },
        });
    }

    return <form ref={formElement} onSubmit={submit} noValidate className={embedded ? 'space-y-6' : 'max-w-3xl space-y-6 rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-950'}>
        <p className="text-sm text-gray-600 dark:text-slate-400">Fields marked * are required. Changes appear in the public portfolio.</p>
        <FormField name="title" label="Project title" error={form.errors.title} hint="A unique title, up to 120 characters."><input {...attributes('title', true)} type="text" /></FormField>
        <div className="grid gap-6 sm:grid-cols-2">
            <FormField name="category" label="Category" error={form.errors.category} hint="For example: Web Development."><input {...attributes('category', true)} type="text" list="project-categories" /><datalist id="project-categories">{['Web Development','Mobile App','UI/UX Design','3D Modeling','Desktop App'].map((category) => <option key={category} value={category} />)}</datalist></FormField>
            <FormField name="display_order" label="Display order" error={orderError} hint="Choose a unique whole number from 1 to 100; lowest first."><input {...attributes('display_order', true)} type="number" min="1" max="100" step="1" /></FormField>
        </div>
        <FormField name="description" label="Short description" error={form.errors.description} hint="10–500 characters, shown below the carousel."><textarea {...attributes('description', true)} rows={3} /></FormField>
        <FormField name="details" label="Project details" error={form.errors.details} hint="20–3,000 characters, shown in the project popup."><textarea {...attributes('details', true)} rows={5} /></FormField>
        <FormField name="tech_stack" label="Tools / tech stack" error={form.errors.tech_stack} hint="Separate tools with commas, for example: Laravel, PHP, React. Maximum 200 characters."><input {...attributes('tech_stack', true)} type="text" /></FormField>
        <FormField name="image" label={editing ? 'Replace screenshot' : 'Project screenshot'} required={!editing} error={form.errors.image} hint={`JPG, PNG, or WebP. Maximum 4 MB.${editing ? ' Leave blank to keep the current image.' : ''}`}>
            <input id="image" name="image" type="file" accept="image/jpeg,image/png,image/webp" required={!editing} onChange={(event) => form.setData('image', event.target.files[0] ?? null)} aria-invalid={form.errors.image ? true : undefined} aria-describedby={`image-hint${form.errors.image ? ' image-error' : ''}`} className={`${inputClass} file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:text-blue-700`} />
            {preview && <img src={preview} alt="Selected project screenshot preview" className="mt-3 max-h-56 w-full rounded-xl bg-gray-100 object-contain dark:bg-slate-900" />}
        </FormField>
        <FormField name="image_alt" label="Image description (alt text)" error={form.errors.image_alt} hint="Describe the screenshot for screen-reader users. Maximum 255 characters."><input {...attributes('image_alt', true)} type="text" /></FormField>
        <FormField name="image_fit" label="Image fit" error={form.errors.image_fit} hint="Cover fills the card; Contain shows the entire screenshot."><select {...attributes('image_fit', true)}><option value="cover">Cover</option><option value="contain">Contain</option></select></FormField>
        {form.progress && <p role="status" className="text-sm text-blue-700 dark:text-blue-300">Uploading: {form.progress.percentage}%</p>}
        <div className="flex flex-wrap gap-3 border-t border-gray-200 pt-6 dark:border-slate-800">
            <button type="submit" disabled={form.processing || orderTaken || (editing && !form.isDirty)} className={primaryButton}>{form.processing ? 'Saving…' : editing ? 'Save changes' : 'Create project'}</button>
            {embedded ? <button type="button" disabled={form.processing} onClick={onCancel} className={secondaryButton}>Cancel</button> : <Link href="/projects" className={secondaryButton}>Cancel</Link>}
        </div>
    </form>;
}
