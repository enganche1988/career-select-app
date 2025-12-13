import HeroSection from './_components/HeroSection';
import TopConsultantsSection from './_components/TopConsultantsSection';
import ProblemSection from './_components/ProblemSection';
import BenefitSection from './_components/BenefitSection';
import HowItWorksSection from './_components/HowItWorksSection';
import CTASection from './_components/CTASection';
import Footer from './_components/Footer';

export default function Home() {
  return (
    <>
      <HeroSection />
      <ProblemSection />
      <BenefitSection />
      <TopConsultantsSection />
      <HowItWorksSection />
      <CTASection />
      <Footer />
    </>
  );
}
