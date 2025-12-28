import HeroSection from './_components/HeroSection';
import LatestQASection from './_components/LatestQASection';
import ActiveConsultantsSection from './_components/ActiveConsultantsSection';
import ServiceExplanationSection from './_components/ServiceExplanationSection';
import Footer from './_components/Footer';

export default function Home() {
  return (
    <>
      <HeroSection />
      <LatestQASection />
      <ActiveConsultantsSection />
      <ServiceExplanationSection />
      <Footer />
    </>
  );
}
