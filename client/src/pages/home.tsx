import { Link } from "wouter";
import { User } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PageWrapper } from "@/components/page-wrapper";
import { personalInfo } from "@shared/portfolio";

export default function HomePage() {
  return (
    <PageWrapper>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2.5, ease: "easeOut" }}
        className="min-h-screen flex flex-col"
      >
        <Navbar />
        <main className="flex-1">
          <section className="relative min-h-[85vh] flex items-center justify-center pt-16">
            <div className="max-w-5xl mx-auto px-6 py-16 text-center">
              <h1
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight"
                data-testid="text-home-headline"
              >
                Building Data-Driven
                <br />
                Software and Scalable
                <br />
                Solutions
              </h1>

              <p
                className="mt-8 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto"
                data-testid="text-home-subtitle"
              >
                I'm Hratch, a full-stack developer and Data Science student at{" "}
                <span className="font-semibold text-foreground">UCSB</span>.
                <br />
                Graduating in{" "}
                <span className="font-semibold text-foreground">2026</span>.
              </p>

              <div className="mt-12">
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full px-6"
                  asChild
                  data-testid="button-about-link"
                >
                  <Link href="/about">
                    <User className="h-4 w-4 mr-2" />
                    About – {personalInfo.name}
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </motion.div>
    </PageWrapper>
  );
}
