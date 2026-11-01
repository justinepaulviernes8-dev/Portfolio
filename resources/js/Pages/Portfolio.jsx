import { Head } from '@inertiajs/react';
import usePortfolioEffects from '../Hooks/usePortfolioEffects';
import Navbar from '../Components/Navbar';
import Home from '../Components/Home';
import About from '../Components/About';
import Skills from '../Components/Skills';
import Education from '../Components/Education';
import Contact from '../Components/Contact';
import Footer from '../Components/Footer';
import BackToTop from '../Components/BackToTop';
import ProjectsCarousel from '../Components/ProjectsCarousel';

export default function Portfolio({ projects }) {
    usePortfolioEffects();
    return <>
        <Head title="Portfolio" />
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-white">Skip to content</a>
        <Navbar />
        <main id="main">
            <Home />
            <About />
            <Skills />
            <ProjectsCarousel projects={projects} />
            <Education />
            <Contact />
        </main>
        <Footer />
        <BackToTop />
    </>;
}
