import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFoundPage() {
  return (
    <>
      <Helmet>
        <title>404 - Page Not Found | Gani Properties</title>
        <meta name="description" content="The page you're looking for doesn't exist." />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center pt-20 pb-20">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-9xl font-display font-bold text-gp-accent mb-4">404</h1>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-gp-ink mb-6">
              Page Not Found
            </h2>
            <p className="text-xl text-gp-ink-muted mb-8">
              The page you're looking for doesn't exist or has been moved.
            </p>
            <Button asChild size="lg">
              <Link to="/">
                <Home className="h-5 w-5" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
