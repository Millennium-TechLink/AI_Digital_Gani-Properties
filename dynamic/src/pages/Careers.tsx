import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { careersApi, Career } from '@/lib/careersApi';
import {
  Briefcase,
  Building2,
  Users,
  Wrench,
  HardHat,
  Calculator,
  Truck,
  ClipboardCheck,
  Loader2,
  X,
  User,
  Mail,
  Phone,
  FileText,
  Send,
  AlertCircle,
  CheckCircle,
  Upload,
  Link2,
  MapPin,
  Clock,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import SEOHead from '@/components/SEOHead';

interface ApplyFormData {
  name: string;
  email: string;
  phone: string;
  coverLetter: string;
  resumeLink: string;
}

const EMPTY_FORM: ApplyFormData = { name: '', email: '', phone: '', coverLetter: '', resumeLink: '' };

const CATEGORY_ICONS: Record<string, any> = {
  'Procurement & Finance': Calculator,
  'Engineering & Operations': HardHat,
  'Skilled Trades & Support': Wrench,
  'Vendors & Partners': Truck,
};

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  'Procurement & Finance': 'Join our back-office team ensuring the smooth financial and supply chain operations.',
  'Engineering & Operations': 'The backbone of our construction projects, ensuring structural integrity and on-site excellence.',
  'Skilled Trades & Support': 'Our expert craftsmen and support staff who bring our architectural visions to life.',
  'Vendors & Partners': 'We collaborate with the best-in-class vendors and contractors for mutual growth.',
};

export default function CareersPage() {
  const [jobs, setJobs] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Apply modal state
  const [selectedJob, setSelectedJob] = useState<Career | null>(null);
  const [formData, setFormData] = useState<ApplyFormData>(EMPTY_FORM);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeMode, setResumeMode] = useState<'file' | 'link'>('file');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await careersApi.getAll();
        setJobs(data);
      } catch (error) {
        console.error('Failed to fetch jobs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // Group jobs by category
  const groupedJobs = jobs.reduce((acc, job) => {
    if (!acc[job.category]) acc[job.category] = [];
    acc[job.category].push(job);
    return acc;
  }, {} as Record<string, Career[]>);

  const openApply = (job: Career) => {
    setSelectedJob(job);
    setFormData(EMPTY_FORM);
    setResumeFile(null);
    setResumeMode('file');
    setSubmitSuccess(false);
    setSubmitError(null);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedJob(null);
    setSubmitSuccess(false);
    setSubmitError(null);
    document.body.style.overflow = '';
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setSubmitError('File size must be under 5MB.');
      return;
    }
    setResumeFile(file);
    setSubmitError(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;

    if (resumeMode === 'file' && !resumeFile) {
      setSubmitError('Please upload your resume.');
      return;
    }
    if (resumeMode === 'link' && (!formData.resumeLink || formData.resumeLink.trim() === '')) {
      setSubmitError('Please provide a link to your resume.');
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    try {
      const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:3000/api' : '/api');
      const fd = new FormData();
      fd.append('name', formData.name);
      fd.append('email', formData.email);
      fd.append('phone', formData.phone);
      fd.append('coverLetter', formData.coverLetter);
      fd.append('jobTitle', selectedJob.title);
      fd.append('jobCategory', selectedJob.category);
      if (resumeMode === 'link' && formData.resumeLink) fd.append('resumeLink', formData.resumeLink);
      if (resumeMode === 'file' && resumeFile) fd.append('resumeFile', resumeFile);

      const res = await fetch(`${API_URL}/careers/${selectedJob.id}/apply`, {
        method: 'POST',
        body: fd,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Submission failed' }));
        throw new Error(err.error || 'Submission failed');
      }
      setSubmitSuccess(true);
    } catch (err: any) {
      setSubmitError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <SEOHead
        title="Careers | Gani Properties - Join our Growing Team"
        description="Explore career opportunities at Gani Properties. Join a team of professionals dedicated to excellence in Bangalore's real estate."
        keywords={['careers', 'job openings', 'civil engineer jobs Bangalore', 'Gani Properties careers']}
        url={`${import.meta.env.VITE_SITE_URL || 'https://ganiproperties.com'}/careers`}
      />

      {/* Hero Section */}
      <div className="pt-32 pb-20 bg-gradient-to-b from-[#1A1A1A]/10 via-white to-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#1A1A1A] rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#DD2B1C] rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 lg:px-6 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-4xl mx-auto">
            <span className="text-sm font-medium text-[#1A1A1A] uppercase tracking-wider mb-4 block">JOIN OUR MISSION</span>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-[#1A1A1A] mb-6">Build Your Future with Us</h1>
            <p className="text-xl md:text-2xl text-gp-ink-muted leading-relaxed">
              Join a team of professionals dedicated to excellence in Bangalore&apos;s real estate.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Job Listings */}
      <section className="py-20 bg-white min-h-[400px]">
        <div className="container mx-auto px-4 lg:px-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-gp-ink-muted">
              <Loader2 className="animate-spin mb-4" size={40} />
              <p>Loading current openings...</p>
            </div>
          ) : Object.keys(groupedJobs).length === 0 ? (
            <div className="text-center py-20 bg-gp-surface/5 rounded-3xl border-2 border-dashed border-gp-ink/10">
              <Briefcase className="mx-auto text-gp-ink-muted mb-4 opacity-20" size={48} />
              <h2 className="text-2xl font-bold text-gp-ink">No Current Openings</h2>
              <p className="text-gp-ink-muted mt-2">Check back soon for new opportunities!</p>
            </div>
          ) : (
            <div className="space-y-24 max-w-7xl mx-auto">
              {Object.entries(groupedJobs).map(([category, roles]) => {
                const Icon = CATEGORY_ICONS[category] || Briefcase;
                return (
                  <motion.div key={category} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
                    <div className="flex flex-col lg:flex-row gap-12 items-start">
                      <div className="lg:w-1/3">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#1A1A1A]/10 text-[#1A1A1A] mb-6">
                          <Icon size={32} />
                        </div>
                        <h2 className="text-3xl font-display font-bold text-gp-ink mb-4">{category}</h2>
                        <p className="text-lg text-gp-ink-muted leading-relaxed">{CATEGORY_DESCRIPTIONS[category] || ''}</p>
                      </div>

                      <div className="lg:w-2/3 flex flex-col gap-4 w-full">
                        {roles.map((job) => (
                          <div key={job.id} className="bg-white rounded-2xl border border-gp-ink/10 hover:border-[#1A1A1A]/30 hover:shadow-xl transition-all duration-300 overflow-hidden">
                            {/* Card Header */}
                            <div
                              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 cursor-pointer"
                              onClick={() => setExpandedId(expandedId === job.id ? null : job.id)}
                            >
                              <div className="flex-1">
                                <div className="flex items-center gap-2 flex-wrap mb-2">
                                  {(job.state || job.city) && (
                                    <span className="flex items-center gap-1 text-xs text-gp-ink-muted">
                                      <MapPin size={11} className="text-[#1A1A1A]" />
                                      {[job.city, job.state].filter(Boolean).join(', ')}
                                    </span>
                                  )}
                                  <span className="flex items-center gap-1 text-xs text-gp-ink-muted">
                                    <Clock size={11} />
                                    {new Date(job.postedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                  </span>
                                </div>
                                <h3 className="text-xl font-bold text-gp-ink group-hover:text-[#1A1A1A] transition-colors">{job.title}</h3>
                              </div>
                              <div className="flex items-center gap-3 shrink-0">
                                <button
                                  onClick={(e) => { e.stopPropagation(); openApply(job); }}
                                  className="px-5 py-2 bg-[#DD2B1C] hover:bg-red-700 text-white text-sm font-bold rounded-xl transition-all"
                                >
                                  Apply Now
                                </button>
                                {expandedId === job.id
                                  ? <ChevronUp size={18} className="text-gp-ink-muted" />
                                  : <ChevronDown size={18} className="text-gp-ink-muted" />
                                }
                              </div>
                            </div>

                            {/* Expanded */}
                            <AnimatePresence>
                              {expandedId === job.id && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.25 }}
                                  className="overflow-hidden"
                                >
                                  <div className="px-6 pb-6 pt-4 border-t border-gp-ink/10 space-y-4">
                                    <p className="text-gp-ink-muted leading-relaxed">{job.description}</p>
                                    {job.requirements?.length > 0 && (
                                      <div>
                                        <p className="text-xs font-bold uppercase tracking-wider text-[#DD2B1C] mb-2">Requirements</p>
                                        <ul className="space-y-1.5">
                                          {job.requirements.map((req, i) => (
                                            <li key={i} className="text-sm text-gp-ink-muted flex items-start gap-2">
                                              <span className="w-1.5 h-1.5 rounded-full bg-[#DD2B1C] mt-1.5 shrink-0" />
                                              {req}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                    <button
                                      onClick={() => openApply(job)}
                                      className="flex items-center gap-2 px-6 py-2.5 bg-[#DD2B1C] text-white font-bold rounded-xl text-sm hover:bg-red-700 transition-all shadow-lg"
                                    >
                                      <Send size={14} /> Apply for this Position
                                    </button>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Why Join Us */}
      <section className="py-32 bg-gp-surface/5">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-gp-ink mb-6">Why Join Gani Properties?</h2>
            <p className="text-xl text-gp-ink-muted">A culture built on trust, innovation, and career growth.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {[
              { title: 'Growth Mindset', desc: 'Continuous learning and professional development mapping.', icon: Building2 },
              { title: 'Full Transparency', desc: 'Clear communication channels and honest work culture.', icon: ClipboardCheck },
              { title: 'Team Excellence', desc: 'Work with the best in the industry on landmark projects.', icon: Users }
            ].map((f, i) => (
              <div key={i} className="bg-white p-10 rounded-3xl border border-gp-ink/10 text-center hover:shadow-xl transition-all">
                <div className="w-16 h-16 mx-auto bg-[#1A1A1A]/5 text-[#1A1A1A] rounded-2xl flex items-center justify-center mb-6">
                  <f.icon size={30} />
                </div>
                <h3 className="text-2xl font-bold mb-4">{f.title}</h3>
                <p className="text-gp-ink-muted leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Banner */}
      <section className="py-24 bg-[#1A1A1A] relative overflow-hidden text-center text-white">
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-4xl font-display font-bold mb-6">Partner With Us</h2>
          <p className="max-w-2xl mx-auto text-white/70 mb-10">Searching for vendors and contractors to build the future of Bengaluru.</p>
          <a href="/contact" className="px-10 py-4 bg-[#DD2B1C] text-white rounded-xl font-bold hover:bg-red-700 transition-all uppercase tracking-widest text-sm shadow-xl">Become a Partner</a>
        </div>
      </section>

      {/* ======== APPLY MODAL ======== */}
      {createPortal(
        <AnimatePresence>
          {selectedJob && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
              onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
            >
              <motion.div
                initial={{ scale: 0.92, opacity: 0, y: 24 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.92, opacity: 0, y: 24 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="bg-white rounded-3xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header - Fixed at Top */}
                <div className="shrink-0 bg-white z-20 px-6 py-5 border-b border-gp-ink/10">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-bold text-[#DD2B1C] uppercase tracking-widest mb-1">{selectedJob.category}</p>
                      <h3 className="text-xl font-bold text-[#1A1A1A]">{selectedJob.title}</h3>
                      {(selectedJob.city || selectedJob.state) && (
                        <p className="flex items-center gap-1 text-sm text-gp-ink-muted mt-1">
                          <MapPin size={12} className="text-[#1A1A1A]" />
                          {[selectedJob.city, selectedJob.state].filter(Boolean).join(', ')}
                        </p>
                      )}
                    </div>
                    <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-xl transition-colors mt-1">
                      <X size={20} className="text-gp-ink-muted" />
                    </button>
                  </div>
                </div>

                {/* Body - Scrollable */}
                <div className="flex-1 overflow-y-auto px-6 py-6 pb-8">
                  {submitSuccess ? (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
                      <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5">
                        <CheckCircle size={40} className="text-green-500" />
                      </div>
                      <h4 className="text-2xl font-bold text-gp-ink mb-2">Application Sent! 🎉</h4>
                      <p className="text-gp-ink-muted leading-relaxed">
                        Thank you for applying for <strong>{selectedJob.title}</strong>. Our team will review your application and get back to you shortly.
                      </p>
                      <button
                        onClick={closeModal}
                        className="mt-6 px-8 py-3 bg-[#1A1A1A] text-white font-bold rounded-xl hover:opacity-90 transition-all"
                      >
                        Close
                      </button>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      {submitError && (
                        <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm flex items-center gap-2">
                          <AlertCircle size={15} /> {submitError}
                        </div>
                      )}

                      {/* Full Name */}
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gp-ink flex items-center gap-1.5">
                          <User size={13} className="text-[#1A1A1A]" /> Full Name *
                        </label>
                        <input
                          className="w-full px-3 py-2.5 border border-gp-ink/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]/30 focus:border-[#1A1A1A] transition-all"
                          value={formData.name}
                          onChange={e => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. Rahul Sharma"
                          required
                        />
                      </div>

                      {/* Email */}
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gp-ink flex items-center gap-1.5">
                          <Mail size={13} className="text-[#1A1A1A]" /> Email Address *
                        </label>
                        <input
                          type="email"
                          className="w-full px-3 py-2.5 border border-gp-ink/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]/30 focus:border-[#1A1A1A] transition-all"
                          value={formData.email}
                          onChange={e => setFormData({ ...formData, email: e.target.value })}
                          placeholder="your@email.com"
                          required
                        />
                      </div>

                      {/* Phone */}
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gp-ink flex items-center gap-1.5">
                          <Phone size={13} className="text-[#1A1A1A]" /> Phone Number *
                        </label>
                        <div className="flex w-full items-center border border-gp-ink/20 rounded-xl focus-within:ring-2 focus-within:ring-[#1A1A1A]/30 focus-within:border-[#1A1A1A] transition-all overflow-hidden bg-white">
                          <span className="pl-3 pr-2 py-2.5 text-sm font-medium text-gp-ink-muted border-r border-gp-ink/20 bg-gray-50 flex items-center shrink-0">
                            +91
                          </span>
                          <input
                            type="tel"
                            pattern="[0-9]{10}"
                            maxLength={10}
                            className="w-full px-3 py-2.5 text-sm focus:outline-none bg-transparent"
                            value={formData.phone}
                            onChange={e => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
                            placeholder="9876543210"
                            required
                          />
                        </div>
                      </div>

                      {/* Resume toggle */}
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gp-ink flex items-center gap-1.5">
                          <FileText size={13} className="text-[#1A1A1A]" /> Resume *
                        </label>
                        <div className="flex gap-1 p-1 bg-gray-100 rounded-xl w-fit">
                          <button type="button" onClick={() => setResumeMode('file')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${resumeMode === 'file' ? 'bg-white text-gp-ink shadow-sm' : 'text-gp-ink-muted hover:text-gp-ink'}`}>
                            <Upload size={12} /> Upload PDF
                          </button>
                          <button type="button" onClick={() => setResumeMode('link')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${resumeMode === 'link' ? 'bg-white text-gp-ink shadow-sm' : 'text-gp-ink-muted hover:text-gp-ink'}`}>
                            <Link2 size={12} /> Share Link
                          </button>
                        </div>

                        {resumeMode === 'file' ? (
                          <>
                            <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} className="hidden" />
                            {resumeFile ? (
                              <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-xl">
                                <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                                  <FileText size={16} className="text-green-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold text-gp-ink truncate">{resumeFile.name}</p>
                                  <p className="text-xs text-gp-ink-muted">{formatFileSize(resumeFile.size)}</p>
                                </div>
                                <button type="button" onClick={() => { setResumeFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }} className="p-1.5 hover:bg-green-100 rounded-lg">
                                  <X size={14} className="text-gp-ink-muted" />
                                </button>
                              </div>
                            ) : (
                              <button type="button" onClick={() => fileInputRef.current?.click()}
                                className="w-full border-2 border-dashed border-gp-ink/20 hover:border-[#1A1A1A]/40 rounded-xl p-5 text-center transition-all hover:bg-[#1A1A1A]/5 group">
                                <Upload size={22} className="mx-auto mb-1.5 text-gp-ink-muted group-hover:text-[#1A1A1A] transition-colors" />
                                <p className="text-sm font-semibold text-gp-ink">Click to upload your resume</p>
                                <p className="text-xs text-gp-ink-muted mt-0.5">PDF, DOC, DOCX • Max 5 MB</p>
                              </button>
                            )}
                          </>
                        ) : (
                          <input
                            type="url"
                            className="w-full px-3 py-2.5 border border-gp-ink/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]/30 focus:border-[#1A1A1A] transition-all"
                            value={formData.resumeLink}
                            onChange={e => setFormData({ ...formData, resumeLink: e.target.value })}
                            placeholder="https://drive.google.com/your-resume or LinkedIn URL"
                          />
                        )}
                      </div>

                      {/* Cover Letter */}
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gp-ink flex items-center gap-1.5">
                          <Send size={13} className="text-[#1A1A1A]" /> Cover Letter
                        </label>
                        <textarea
                          className="w-full px-3 py-2.5 border border-gp-ink/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]/30 focus:border-[#1A1A1A] transition-all resize-none"
                          rows={5}
                          value={formData.coverLetter}
                          onChange={e => setFormData({ ...formData, coverLetter: e.target.value })}
                          placeholder="Tell us why you're a great fit for this role and your relevant experience..."
                        />
                      </div>

                      <div className="pt-1 flex gap-3">
                        <button type="button" onClick={closeModal}
                          className="flex-1 px-4 py-2.5 border border-gp-ink/20 rounded-xl text-sm font-semibold text-gp-ink hover:bg-gray-50 transition-all">
                          Cancel
                        </button>
                        <button type="submit" disabled={submitting}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#DD2B1C] text-white font-bold rounded-xl text-sm hover:bg-red-700 transition-all shadow-lg disabled:opacity-60">
                          {submitting
                            ? <><Loader2 size={15} className="animate-spin" /> Sending...</>
                            : <><Send size={15} /> Submit Application</>
                          }
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
