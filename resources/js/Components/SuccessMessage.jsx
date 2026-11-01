import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function SuccessMessage({ className }) {
    const { flash } = usePage().props;
    const [visible, setVisible] = useState(Boolean(flash?.success));

    useEffect(() => {
        setVisible(Boolean(flash?.success));
        if (!flash?.success) return;
        const timer = setTimeout(() => setVisible(false), 4000);
        return () => clearTimeout(timer);
    }, [flash]);

    return visible && flash?.success ? <p role="status" className={className}>{flash.success}</p> : null;
}
