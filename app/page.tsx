import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/home/hero"
import { About } from "@/components/home/about"
import { Categories } from "@/components/home/categories"
import { ReviewsCarousel } from "@/components/home/reviews-carousel"
import { RegistrationBanner } from "@/components/home/registration-banner"
import { CTA } from "@/components/home/cta"
import { SiteFooter } from "@/components/home/site-footer"
import { RecommendedCars } from "@/components/RecommendedCars"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export default async function Page() {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id || "guest"

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <div className="container mx-auto px-4">
        <RecommendedCars userId={userId} />
      </div>
      <RegistrationBanner />
      <About />
      <Categories />
      <ReviewsCarousel />
      <CTA />
      <SiteFooter />
    </main>
  )
}
