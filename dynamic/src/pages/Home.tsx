import { useEffect, useState } from 'react';
import SEOHead from '@/components/SEOHead';
import HeroFullScreen from '@/components/HeroFullScreen';
import ImmersiveCategories from '@/components/ImmersiveCategories';
import StoryJourney from '@/components/StoryJourney';
import OurStory from '@/components/OurStory';
import ImmersivePropertyShowcase from '@/components/ImmersivePropertyShowcase';
import ManagementTeam from '@/components/ManagementTeam';
import FranchiseHighlight from '@/components/FranchiseHighlight';
import CTASection from '@/components/CTASection';
import GSAPReveal from '@/components/GSAPReveal';
import { propertiesApi } from '@/lib/propertiesApi';
import { Property } from '@/types/property';

export default function HomePage() {
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      const properties = await propertiesApi.getAll();
      // Prioritize featured properties, then fill with others up to 6
      const featured = properties.filter(p => p.featured);
      const others = properties.filter(p => !p.featured);
      setFeaturedProperties([...featured, ...others].slice(0, 6));
    } catch (err) {
      console.error('Error loading properties:', err);
      // Silently fail - component will show empty state
    }
  };

  return (
    <>
      <SEOHead
        title="Premium Property Providers in Bangalore | Residential Plots, Farmland & Agricultural Lands"
        description="Leading property providers in Bangalore offering verified residential plots, farmland, and agricultural lands in Kattigenahalli, Yelahanka, Hunasamaranahalli, and Chikkaballapur. Trusted real estate dealer with transparent pricing and BBMP approved properties."
        keywords={[
          'property providers in Bangalore',
          'real estate Bangalore',
          'residential plots Bangalore',
          'farmland Bangalore',
          'plots in Kattigenahalli',
          'land in Yelahanka',
          'BBMP approved plots',
        ]}
        url={`${import.meta.env.VITE_SITE_URL || 'https://ganiproperties.com'}/`}
      />

      {/* Hero - Full Screen Cinematic FX */}
      <HeroFullScreen />
      
      {/* Story Journey - Narrative flow */}
      <GSAPReveal direction="up" distance={30}>
        <StoryJourney />
      </GSAPReveal>

      {/* Categories - Visual showcase */}
      <GSAPReveal direction="up" distance={50} delay={0.2}>
        <ImmersiveCategories />
      </GSAPReveal>

      {/* Our Story with Animated Stats */}
      <GSAPReveal direction="up" distance={50}>
        <OurStory />
      </GSAPReveal>

      {/* Featured Properties - Immersive showcase */}
      <GSAPReveal direction="up" distance={50}>
        <ImmersivePropertyShowcase 
          properties={featuredProperties} 
        />
      </GSAPReveal>

      {/* Management Team */}
      <GSAPReveal direction="up" distance={50}>
        <ManagementTeam />
      </GSAPReveal>

      {/* Franchise Opportunity Highlight */}
      <GSAPReveal direction="up" distance={50}>
        <FranchiseHighlight />
      </GSAPReveal>

      {/* CTA Section */}
      <GSAPReveal direction="up" distance={50}>
        <CTASection />
      </GSAPReveal>
    </>
  );
}
