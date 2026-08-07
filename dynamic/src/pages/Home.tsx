import { useEffect, useState, lazy, Suspense } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SEOHead from '@/components/SEOHead';
import HeroFullScreen from '@/components/HeroFullScreen';
import GSAPReveal from '@/components/GSAPReveal';
import { propertiesApi } from '@/lib/propertiesApi';
import { Property } from '@/types/property';

// Everything below the hero, code-split the same way App.tsx splits whole
// routes. These 7 components (~1100 lines, plus gsap/framer-motion/lucide
// usage) were all static imports before, which means their code had to be
// parsed and *evaluated* - not just downloaded - before React could even
// commit the first paint, since a plain `import` is resolved up front
// regardless of whether the component is actually on-screen yet. On
// Lighthouse's throttled-mobile CPU simulation that showed up as ~2.6s of
// "Script Evaluation" gating LCP even though only HeroFullScreen is
// visible at first paint. Moving them behind lazy() means React can commit
// Hero immediately and let these mount into their own Suspense boundaries
// as their chunks resolve - the onIdle prefetch below (same pattern as
// App.tsx's route prefetch) means that resolution happens in the background
// almost immediately after first paint, well before a user has scrolled
// this far, rather than as a visible pop-in.
const importStoryJourney = () => import('@/components/StoryJourney');
const importImmersiveCategories = () => import('@/components/ImmersiveCategories');
const importOurStory = () => import('@/components/OurStory');
const importImmersivePropertyShowcase = () => import('@/components/ImmersivePropertyShowcase');
const importManagementTeam = () => import('@/components/ManagementTeam');
const importFranchiseHighlight = () => import('@/components/FranchiseHighlight');
const importCTASection = () => import('@/components/CTASection');

const StoryJourney = lazy(importStoryJourney);
const ImmersiveCategories = lazy(importImmersiveCategories);
const OurStory = lazy(importOurStory);
const ImmersivePropertyShowcase = lazy(importImmersivePropertyShowcase);
const ManagementTeam = lazy(importManagementTeam);
const FranchiseHighlight = lazy(importFranchiseHighlight);
const CTASection = lazy(importCTASection);

const onIdle = (cb: () => void) =>
  'requestIdleCallback' in window ? window.requestIdleCallback(cb) : setTimeout(cb, 200);

export default function HomePage() {
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);

  useEffect(() => {
    loadProperties();

    // Prefetch every below-fold chunk once the hero has had its first paint,
    // so scrolling down never has to wait on a cold dynamic import. Three of
    // these sections (ImmersivePropertyShowcase, FranchiseHighlight,
    // CTASection) sit inside GSAPReveal, which registers a ScrollTrigger
    // against its wrapper div's position on mount - before its lazy child
    // has actually rendered any height into that div. Refreshing once every
    // chunk has resolved (and therefore laid out its real content) recalcs
    // those trigger positions against final layout instead of leaving them
    // pinned to the near-empty Suspense-fallback layout.
    onIdle(() => {
      Promise.all([
        importStoryJourney(), importImmersiveCategories(), importOurStory(),
        importImmersivePropertyShowcase(), importManagementTeam(),
        importFranchiseHighlight(), importCTASection(),
      ]).then(() => ScrollTrigger.refresh());
    });
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
      <Suspense fallback={null}>
        <StoryJourney />
      </Suspense>

      {/* Categories - Visual showcase */}
      <Suspense fallback={null}>
        <ImmersiveCategories />
      </Suspense>

      {/* Our Story with Animated Stats */}
      <Suspense fallback={null}>
        <OurStory />
      </Suspense>

      {/* Featured Properties - Immersive showcase */}
      <GSAPReveal direction="up" distance={50}>
        <Suspense fallback={null}>
          <ImmersivePropertyShowcase
            properties={featuredProperties}
          />
        </Suspense>
      </GSAPReveal>

      {/* Management Team */}
      <Suspense fallback={null}>
        <ManagementTeam />
      </Suspense>

      {/* Franchise Opportunity Highlight */}
      <GSAPReveal direction="up" distance={50}>
        <Suspense fallback={null}>
          <FranchiseHighlight />
        </Suspense>
      </GSAPReveal>

      {/* CTA Section */}
      <GSAPReveal direction="up" distance={50}>
        <Suspense fallback={null}>
          <CTASection />
        </Suspense>
      </GSAPReveal>
    </>
  );
}
