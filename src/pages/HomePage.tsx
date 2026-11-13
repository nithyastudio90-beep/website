import React from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { FeaturedServices } from '../components/home/FeaturedServices';
import { AboutOverview } from '../components/home/AboutOverview';
import { FeaturedPortfolio } from '../components/home/FeaturedPortfolio';
import { YouTubeShowcase } from '../components/home/YouTubeShowcase';
import { InstagramSection } from '../components/home/InstagramSection';
import { TestimonialsSection } from '../components/home/TestimonialsSection';
import { QuickContactSection } from '../components/home/QuickContactSection';

export const HomePage: React.FC = () => {
  return (
    <div className="animate-fade-in">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Featured Services */}
      <FeaturedServices />

      {/* 3. About the Studio */}
      <AboutOverview />

      {/* 4. Featured Portfolio / Photography Gallery */}
      <FeaturedPortfolio />

      {/* 5. YouTube Video Showcase */}
      <YouTubeShowcase />

      {/* 6. Instagram Section */}
      <InstagramSection />

      {/* 7. Customer Testimonials */}
      <TestimonialsSection />

      {/* 8. Quick Contact Section */}
      <QuickContactSection />
    </div>
  );
};
