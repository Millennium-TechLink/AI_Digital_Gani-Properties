import { Helmet } from 'react-helmet-async';

export default function TermsPage() {
  return (
    <>
      <Helmet>
        <title>Terms of Service | Gani Properties</title>
        <meta name="description" content="Terms of Service for Gani Properties - Please read our terms before using our website." />
      </Helmet>

      <div className="pt-32 pb-20 bg-gradient-to-b from-gp-surface/5 via-white to-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-gp-accent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-gp-gold rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 lg:px-6 relative z-10">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-gp-ink mb-8">Terms of Service</h1>
            <div className="prose prose-lg max-w-none text-gp-ink-muted leading-relaxed space-y-6">
              <p className="text-sm text-gp-ink-muted/80">Last updated: {new Date().toLocaleDateString('en-IN')}</p>
              <p>
                Please read these Terms of Service carefully before using the Gani Properties website.
              </p>
              <h2 className="text-2xl font-display font-bold text-gp-ink mt-8 mb-4">Use of Website</h2>
              <p>
                By accessing this website, you agree to comply with and be bound by these terms. The content 
                on this website is for general information purposes only.
              </p>
              <h2 className="text-2xl font-display font-bold text-gp-ink mt-8 mb-4">Property Information</h2>
              <p>
                While we strive to provide accurate information about our properties, prices, and availability 
                are subject to change. We recommend verifying all details directly with our team before making 
                any decisions.
              </p>
              <h2 className="text-2xl font-display font-bold text-gp-ink mt-8 mb-4">Intellectual Property</h2>
              <p>
                All content on this website, including text, graphics, logos, and images, is the property of 
                Gani Properties Pvt. Ltd. and is protected by copyright laws.
              </p>
              <h2 className="text-2xl font-display font-bold text-gp-ink mt-8 mb-4">User Conduct</h2>
              <p>
                You agree not to use the website in any way that could damage, disable, overburden, or impair 
                the website or interfere with any other party's use of the website.
              </p>
              <h2 className="text-2xl font-display font-bold text-gp-ink mt-8 mb-4">Limitation of Liability</h2>
              <p>
                Gani Properties shall not be liable for any direct, indirect, incidental, or consequential 
                damages arising from the use of this website or the information contained herein.
              </p>
              <h2 className="text-2xl font-display font-bold text-gp-ink mt-8 mb-4">Changes to Terms</h2>
              <p>
                We reserve the right to modify these terms at any time. Your continued use of the website 
                after any changes constitutes your acceptance of the new terms.
              </p>
              <h2 className="text-2xl font-display font-bold text-gp-ink mt-8 mb-4">Contact Us</h2>
              <p>
                For questions about these Terms of Service, please contact us at:
              </p>
              <p className="ml-4">
                Email: <a href="mailto:info@ourganiproperties.com" className="text-gp-accent hover:underline">info@ourganiproperties.com</a><br />
                Phone: <a href="tel:+919900570799" className="text-gp-accent hover:underline">+91 99005 70799</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
