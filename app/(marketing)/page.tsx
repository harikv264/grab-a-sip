import { Hero } from "@/components/home/Hero";
import { Marquee } from "@/components/Marquee";
import { ServiceabilityCheck } from "@/components/ServiceabilityCheck";
import { Mission } from "@/components/home/Mission";
import { Benefits } from "@/components/home/Benefits";
import { IngredientBenefits } from "@/components/home/IngredientBenefits";
import { ProductsPreview } from "@/components/home/ProductsPreview";
import { HowItWorks } from "@/components/home/HowItWorks";
import { PlansPreview } from "@/components/home/PlansPreview";
import { JuiceShowcase } from "@/components/home/JuiceShowcase";
import { CTASection } from "@/components/home/CTASection";

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <ServiceabilityCheck />
      <Mission />
      <Benefits />
      <IngredientBenefits />
      <ProductsPreview />
      <HowItWorks />
      <PlansPreview />
      <JuiceShowcase />
      <CTASection />
    </>
  );
}
