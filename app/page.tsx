import { Hero } from "@/components/home/Hero";
import { Marquee } from "@/components/Marquee";
import { Mission } from "@/components/home/Mission";
import { Benefits } from "@/components/home/Benefits";
import { ProductsPreview } from "@/components/home/ProductsPreview";
import { HowItWorks } from "@/components/home/HowItWorks";
import { PlansPreview } from "@/components/home/PlansPreview";
import { CTASection } from "@/components/home/CTASection";

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <Mission />
      <Benefits />
      <ProductsPreview />
      <HowItWorks />
      <PlansPreview />
      <CTASection />
    </>
  );
}
