import { useEffect, useState } from 'react';
import SEOHead from '@/components/SEOHead';
import ImmersiveHero from '@/components/ImmersiveHero';
import ImmersiveCategories from '@/components/ImmersiveCategories';
import StoryJourney from '@/components/StoryJourney';
import OurStory from '@/components/OurStory';
import ImmersivePropertyShowcase from '@/components/ImmersivePropertyShowcase';
import ManagementTeam from '@/components/ManagementTeam';
import FranchiseHighlight from '@/components/FranchiseHighlight';
import CTASection from '@/components/CTASection';
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
      setFeaturedProperties(properties.slice(0, 6));
    } catch (error) {
      console.error('Error loading properties:', error);
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

      {/* Hero - Immersive entry point */}
      <ImmersiveHero />
      
      {/* Story Journey - Narrative flow */}
      <StoryJourney />

      {/* Categories - Visual showcase */}
      <ImmersiveCategories />

      {/* Our Story with Animated Stats */}
      <OurStory />

      {/* Featured Properties - Immersive showcase */}
      <ImmersivePropertyShowcase properties={featuredProperties} />

      {/* Management Team */}
      <ManagementTeam />

      {/* Franchise Opportunity Highlight */}
      <FranchiseHighlight />

      {/* CTA Section */}
      <CTASection />
    </>
  );
}
