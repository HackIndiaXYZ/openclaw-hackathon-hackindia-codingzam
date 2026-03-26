import HomeNavbar from "../components/home/HomeNavbar";
import HeroSection from "../components/home/HeroSection";
import AboutSection from "../components/home/AboutSection";
import ModeSelectionSection from "../components/home/ModeSelectionSection";
import FeaturesSection from "../components/home/FeaturesSection";
import FAQSection from "../components/home/FAQSection";
import HomeFooter from "../components/home/HomeFooter";

function HomePage() {
  // Each section is wrapped so scrolling feels organized and clearly segmented.
  return (
    <main className="home-page">
      <HomeNavbar />

      <section className="home-scroll-section">
        <HeroSection />
      </section>

      <section className="home-scroll-section">
        <AboutSection />
      </section>

      <section className="home-scroll-section">
        <ModeSelectionSection />
      </section>

      <section className="home-scroll-section">
        <FeaturesSection />
      </section>

      <section className="home-scroll-section">
        <FAQSection />
      </section>

      <section className="home-scroll-section">
        <HomeFooter />
      </section>
    </main>
  );
}

export default HomePage;

