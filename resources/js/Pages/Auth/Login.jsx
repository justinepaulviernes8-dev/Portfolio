import { Head, Link, useForm } from '@inertiajs/react';
import FormField, { inputClass } from '../../Components/FormField';
import { primaryButton } from '../../Layouts/ManagementLayout';

export default function Login() {
    const form = useForm({ email: '', password: '' });
    function submit(event) {
        event.preventDefault();
        form.post('/login', { onFinish: () => form.reset('password') });
    }
    return <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-12">
        <Head title="Owner login" />
        <h1 className="mb-6 text-3xl font-bold">Owner login</h1>
        <form onSubmit={submit} className="space-y-6">
            <FormField name="email" label="Email" error={form.errors.email}>
                <input id="email" name="email" type="email" autoComplete="username" required value={form.data.email} onChange={(event) => form.setData('email', event.target.value)} aria-invalid={Boolean(form.errors.email)} aria-describedby={form.errors.email ? 'email-error' : undefined} className={inputClass} />
            </FormField>
            <FormField name="password" label="Password" error={form.errors.password}>
                <input id="password" name="password" type="password" autoComplete="current-password" required value={form.data.password} onChange={(event) => form.setData('password', event.target.value)} aria-invalid={Boolean(form.errors.password)} aria-describedby={form.errors.password ? 'password-error' : undefined} className={inputClass} />
            </FormField>
            <button type="submit" disabled={form.processing} className={primaryButton}>{form.processing ? 'Signing in…' : 'Sign in'}</button>
        </form>
        <Link href="/" className="mt-6 text-blue-700 hover:underline dark:text-blue-300">Back to portfolio</Link>
    </main>;
}
