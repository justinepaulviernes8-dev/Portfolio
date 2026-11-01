export default function SectionTitle({ label, title }) {
    return <div data-reveal="" className="mb-12 text-center">
        <p className="text-sm font-semibold tracking-[0.12em] text-blue-700 dark:text-blue-300">{label}</p>
        <h2 className="mt-2 text-3xl font-bold sm:text-4xl">{title}</h2>
    </div>;
}
