import { Helmet } from 'react-helmet-async';

export default function PrivacyPage() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | Gani Properties</title>
        <meta name="description" content="Privacy Policy for Gani Properties - Learn how we collect, use, and protect your personal information." />
      </Helmet>

      <div className="pt-32 pb-20 bg-gradient-to-b from-gp-surface/5 via-white to-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-gp-accent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-gp-gold rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 lg:px-6 relative z-10">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-gp-ink mb-8">Privacy Policy</h1>
            <div className="prose prose-lg max-w-none text-gp-ink-muted leading-relaxed space-y-6">
              <p className="text-sm text-gp-ink-muted/80">Last updated: {new Date().toLocaleDateString('en-IN')}</p>
              <p>
                At Gani Properties Pvt. Ltd., we take your privacy seriously. This Privacy Policy explains how we 
                collect, use, disclose, and safeguard your information when you visit our website.
              </p>
              <h2 className="text-2xl font-display font-bold text-gp-ink mt-8 mb-4">Information We Collect</h2>
              <p>
                We may collect information that you provide directly to us, including:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Name and contact information (phone, email)</li>
                <li>Property inquiries and preferences</li>
                <li>Any other information you choose to provide</li>
              </ul>
              <h2 className="text-2xl font-display font-bold text-gp-ink mt-8 mb-4">How We Use Your Information</h2>
              <p>
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Respond to your inquiries and provide customer service</li>
                <li>Send you updates about properties that match your interests</li>
                <li>Improve our website and services</li>
                <li>Comply with legal obligations</li>
              </ul>
              <h2 className="text-2xl font-display font-bold text-gp-ink mt-8 mb-4">Information Sharing</h2>
              <p>
                We do not sell, trade, or rent your personal information to third parties. We may share your 
                information only with trusted service providers who assist us in operating our website and 
                conducting our business.
              </p>
              <h2 className="text-2xl font-display font-bold text-gp-ink mt-8 mb-4">Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your personal information 
                against unauthorized access, alteration, disclosure, or destruction.
              </p>
              <h2 className="text-2xl font-display font-bold text-gp-ink mt-8 mb-4">Your Rights</h2>
              <p>
                You have the right to access, update, or delete your personal information at any time. If you 
                would like to exercise these rights, please contact us using the information provided below.
              </p>
              <h2 className="text-2xl font-display font-bold text-gp-ink mt-8 mb-4">Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <p className="ml-4">
                Email: <a href="mailto:marketing@ourganiproperties.com" className="text-gp-accent hover:underline">marketing@ourganiproperties.com</a><br />
                Phone: <a href="tel:+919900570799" className="text-gp-accent hover:underline">+91 99005 70799</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
