import { useEffect, useRef, useState } from 'react';

const START = 19;
const END = 33;

export default function ProfileVideoPreview() {
    const video = useRef(null);
    const [active, setActive] = useState(false);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const element = video.current;
        let frame;
        let cancelled = false;
        setReady(false);

        function startPlayback() {
            if (cancelled) return;
            if (element.seeking || Math.abs(element.currentTime - START) > 0.1) return;
            element.play().catch(() => { if (!cancelled) setActive(false); });
        }
        function playSegment() {
            if (cancelled) return;
            setReady(false);
            element.pause();
            element.currentTime = START;
            // Wait for the seek to finish before allowing any frame to appear.
            if (!element.seeking) startPlayback();
        }
        function showVideo() {
            if (!cancelled && !element.seeking && element.currentTime >= START && element.currentTime < END) setReady(true);
        }
        function keepWithinSegment() {
            if (cancelled) return;
            if (!element.seeking && (element.currentTime >= END || element.ended)) playSegment();
            frame = requestAnimationFrame(keepWithinSegment);
        }

        if (active) {
            element.addEventListener('seeked', startPlayback);
            element.addEventListener('playing', showVideo);
            if (element.readyState >= 1) playSegment();
            else element.addEventListener('loadedmetadata', playSegment, { once: true });
            frame = requestAnimationFrame(keepWithinSegment);
        }

        return () => {
            cancelled = true;
            cancelAnimationFrame(frame);
            element.removeEventListener('loadedmetadata', playSegment);
            element.removeEventListener('seeked', startPlayback);
            element.removeEventListener('playing', showVideo);
            element.pause();
        };
    }, [active]);

    return <button type="button"
        aria-label="Preview profile video, from 19 to 33 seconds"
        aria-pressed={active}
        onMouseEnter={() => setActive(true)} onMouseLeave={() => setActive(false)}
        onFocus={() => setActive(true)} onBlur={() => setActive(false)}
        onClick={() => setActive(true)}
        onKeyDown={(event) => { if (event.key === 'Escape') { event.preventDefault(); setActive(false); } }}
        className="absolute inset-6 rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600">
        <img src="/images/profile/profile-light.png" alt="Portrait of Justine Paul Viernes in a black suit and red tie" className="absolute inset-0 size-full rounded-full bg-blue-100 object-cover dark:hidden" />
        <img src="/images/profile/profile-dark.png" alt="Portrait of Justine Paul Viernes in a white suit and grey tie" className="absolute inset-0 hidden size-full rounded-full bg-blue-100 object-cover dark:block" />
        <span className={`pointer-events-none absolute inset-0 z-10 overflow-hidden rounded-full bg-slate-950 transition-opacity duration-300 ease-in-out motion-reduce:transition-none ${active && ready ? 'opacity-100' : 'opacity-0'}`}>
            <video ref={video} src="/media/profile-video" muted playsInline preload="metadata" aria-hidden="true" onError={() => setActive(false)} className="size-full object-cover" />
        </span>
    </button>;
}
