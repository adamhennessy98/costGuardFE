import { BenefitsSection } from "@/components/marketing/benefits-section";
import { FeaturesSection } from "@/components/marketing/features-section";
import { HeroSection } from "@/components/marketing/hero-section";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { MetricsSection } from "@/components/marketing/metrics-section";
import { ProductValueSection } from "@/components/marketing/product-value-section";
import { TestimonialsSection } from "@/components/marketing/testimonials-section";
import { UseCasesSection } from "@/components/marketing/use-cases-section";
import { WaitlistSection } from "@/components/marketing/waitlist-section";

export default function MarketingPage() {
  return (
    <>
      <MarketingHeader />
      <main id="main-content" role="main">
        <HeroSection />
        <ProductValueSection />
        <FeaturesSection />
        <BenefitsSection />
        <UseCasesSection />
        <MetricsSection />
        <TestimonialsSection />
        <WaitlistSection />
      </main>
      <MarketingFooter />
    </>
  );
}
