import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/home/hero"
import { About } from "@/components/home/about"
import { Categories } from "@/components/home/categories"
import { ReviewsCarousel } from "@/components/home/reviews-carousel"
import { RegistrationBanner } from "@/components/home/registration-banner"
import { CTA } from "@/components/home/cta"
import { SiteFooter } from "@/components/home/site-footer"

export default function Page() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <RegistrationBanner />
      <About />
      <Categories />
      <ReviewsCarousel />
      <CTA />
      <SiteFooter />
    </main>
  )
}
