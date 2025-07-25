import FeatureSection from "@/components/Features"
import Hero from "@/components/Hero"
import TestimonialSection from "@/components/Testimonials"

const page = () => {
  return (
    <div className="flex flex-col gap-20 min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <Hero />
      <FeatureSection />
      <TestimonialSection/>
    </div>
  )
}

export default page
