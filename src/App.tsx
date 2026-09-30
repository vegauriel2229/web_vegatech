// src/App.tsx
import { useState } from "react";
import { useReducedMotion } from "motion/react";
import { About } from "./components/About";
import { Contact } from "./components/Contact";
import { ContactMap } from "./components/ContactMap";
import { DiagnosticWizard } from "./components/DiagnosticWizard";
import { Faq } from "./components/Faq";
import { Hero } from "./components/Hero";
import { Marquee } from "./components/Marquee";
import { MobileNav } from "./components/MobileNav";
import { Process } from "./components/Process";
import { ScreenRepair } from "./components/ScreenRepair";
import { Services } from "./components/Services";
import { Sidebar } from "./components/Sidebar";
import { SiteFooter, WhatsAppFab } from "./components/SiteChrome";
import { StarField } from "./components/StarField";
import { HERO_IMAGE_URL, MARQUEE_SERVICES } from "./lib/content";

export function App() {
  const reduceMotion = useReducedMotion() ?? false;
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  return (
    <>
      <StarField active reduceMotion={reduceMotion} />
      <Sidebar />
      <MobileNav />
      <main id="inicio" className="pt-16 md:pl-20 md:pt-0">
        <Hero imageUrl={HERO_IMAGE_URL} onStartDiagnosis={() => setIsWizardOpen(true)} />
        <Marquee items={MARQUEE_SERVICES} />
        <Services />
        <ScreenRepair />
        <Process />
        <About />
        <Faq />
        <ContactMap />
        <Contact />
      </main>
      <SiteFooter className="md:pl-20" />
      <WhatsAppFab />
      <DiagnosticWizard isOpen={isWizardOpen} onClose={() => setIsWizardOpen(false)} />
    </>
  );
}
