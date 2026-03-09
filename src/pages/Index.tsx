import HeroSection from "@/components/HeroSection";
import ExamplePrompts from "@/components/ExamplePrompts";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import StatsBar from "@/components/StatsBar";
import Testimonials from "@/components/Testimonials";
import RoadmapPreview from "@/components/RoadmapPreview";
import CallToAction from "@/components/CallToAction";
import AnimatedBackground from "@/components/AnimatedBackground";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <AnimatedBackground />
      <Navbar />
      <HeroSection />
      <StatsBar />
      <ExamplePrompts />
      <HowItWorks />
      <RoadmapPreview />
      <Features />
      <Testimonials />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default Index;
