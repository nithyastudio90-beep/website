import React from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { FeaturedServices } from '../components/home/FeaturedServices';
import { AboutOverview } from '../components/home/AboutOverview';
import { FeaturedPortfolio } from '../components/home/FeaturedPortfolio';
import { YouTubeShowcase } from '../components/home/YouTubeShowcase';
import { InstagramSection } from '../components/home/InstagramSection';
import { TestimonialsSection } from '../components/home/TestimonialsSection';
import { QuickContactSection } from '../components/home/QuickContactSection';
import { useStudio } from '../context/StudioContext';

export const HomePage: React.FC = () => {
  const { sections } = useStudio();

  return (
    <div className="animate-fade-in">
      {/* 1. Hero Section */}
      {sections.show_hero !== false && <HeroSection />}

      {/* 2. Featured Services */}
      {sections.show_services !== false && <FeaturedServices />}

      {/* 3. About the Studio */}
      {sections.show_about_overview !== false && <AboutOverview />}

      {/* 4. Featured Portfolio / Photography Gallery */}
      {sections.show_portfolio !== false && <FeaturedPortfolio />}

      {/* 5. YouTube Video Showcase */}
      {sections.show_youtube !== false && <YouTubeShowcase />}

      {/* 6. Instagram Section */}
      {sections.show_instagram !== false && <InstagramSection />}

      {/* 7. Customer Testimonials */}
      {sections.show_testimonials !== false && <TestimonialsSection />}

      {/* 8. Quick Contact Section */}
      {sections.show_quick_contact !== false && <QuickContactSection />}
    </div>
  );
};
