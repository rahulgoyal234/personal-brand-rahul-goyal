import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, CheckCircle, Mail, MapPin, Inbox, Clock, ChevronRight, AlertCircle, X, Trash2, ShieldCheck } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolio';
import { ContactSubmission } from '../types';

interface ContactProps {
  submissions: ContactSubmission[];
  onSubmitMessage: (msg: Omit<ContactSubmission, 'id' | 'timestamp' | 'read'>) => void;
  onMarkRead: (id: string) => void;
  onDeleteMessage: (id: string) => void;
  showInbox: boolean;
  setShowInbox: (show: boolean) => void;
}

export default function Contact({
  submissions,
  onSubmitMessage,
  onMarkRead,
  onDeleteMessage,
  showInbox,
  setShowInbox,
}: ContactProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (validationError) setValidationError(null);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Validation checks
    if (!formData.name.trim()) return setValidationError('Please fill in your name.');
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      return setValidationError('Please enter a valid email address.');
    }
    if (!formData.subject.trim()) return setValidationError('Please fill in a subject.');
    if (formData.message.trim().length < 10) {
      return setValidationError('Message must be at least 10 characters.');
    }

    setIsSubmitting(true);

    // Simulate database network payload
    setTimeout(() => {
      onSubmitMessage(formData);
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });

      // Clear success notification
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    }, 1200);
  };

  return (
    <section id="contact" className="py-20 md:py-28 border-t border-brand-200 bg-[#fcfcfc] relative">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left panel info column */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-3">
              <span className="text-[10px] uppercase tracking-[0.3em] text-neutral-400 font-bold block">
                Let's connect
              </span>
              <h2 className="font-sans text-3xl sm:text-4xl font-extralight tracking-tight text-neutral-900">
                Get in <span className="italic font-serif font-light">touch</span>
              </h2>
              <p className="text-neutral-500 font-light text-xs sm:text-sm leading-relaxed">
                Have a project idea, a position proposal, or simply want to chat about product architecture? Send a message and let's configure something.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-4 bg-[#fcfcfc] border border-neutral-200 p-4 rounded-none">
                <div className="p-2 border border-black text-black rounded-none">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-neutral-400 text-[8px] font-mono uppercase tracking-widest">Direct Email</span>
                  <a href={`mailto:${PERSONAL_INFO.email}`} className="text-neutral-800 hover:text-black font-semibold text-xs uppercase tracking-wider">
                    {PERSONAL_INFO.email}
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-4 bg-[#fcfcfc] border border-neutral-200 p-4 rounded-none">
                <div className="p-2 border border-black text-black rounded-none">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-neutral-400 text-[8px] font-mono uppercase tracking-widest">Based In</span>
                  <span className="text-neutral-800 font-semibold text-xs uppercase tracking-wider">
                    {PERSONAL_INFO.location}
                  </span>
                </div>
              </div>
            </div>

            {/* Simulated server stats (Privacy check) */}
            <div className="p-5 border border-dashed border-neutral-200 bg-transparent rounded-none space-y-3 text-xs text-neutral-500 font-light leading-relaxed">
              <div className="flex items-center space-x-2 text-neutral-800 font-mono font-bold uppercase tracking-wider text-[10px]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Privacy & Client Storage</span>
              </div>
              <p className="text-[11px]">
                This form submits inputs directly to your browser's persistent client-side storage engine. No telemetry, third-party cookies, or trackers are initialized.
              </p>
              <button
                id="view-submissions-trigger"
                onClick={() => setShowInbox(true)}
                className="inline-flex items-center space-x-1.5 text-black hover:underline font-mono font-bold uppercase tracking-wider text-[10px] cursor-pointer"
              >
                <span>Sent submissions ({submissions.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Form column */}
          <div className="lg:col-span-7 bg-[#fcfcfc] border border-neutral-200 rounded-none p-6 sm:p-10">
            <form id="contact-form" onSubmit={handleFormSubmit} className="space-y-6">
              
              {/* Form Validation alerts */}
              <AnimatePresence>
                {validationError && (
                  <motion.div
                    id="validation-error-alert"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-none text-xs font-medium flex items-center space-x-2"
                  >
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{validationError}</span>
                  </motion.div>
                )}

                {submitSuccess && (
                  <motion.div
                    id="submit-success-alert"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-none text-xs flex items-start space-x-3"
                  >
                    <CheckCircle className="w-4 h-4 flex-shrink-0 text-emerald-600 mt-0.5" />
                    <div>
                      <strong className="block font-bold uppercase tracking-wider">Message dispatched successfully!</strong>
                      <span className="font-light text-[11px] mt-0.5 block">
                        Your message has been safely saved in your browser storage. You can check it in the Inbox.
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Form Fields Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-[9px] font-mono font-bold text-neutral-400 uppercase tracking-widest">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Jane Doe"
                    disabled={isSubmitting}
                    className="w-full bg-white border border-neutral-200 rounded-none px-4 py-3 text-xs focus:outline-hidden focus:border-black transition-colors disabled:opacity-50"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="block text-[9px] font-mono font-bold text-neutral-400 uppercase tracking-widest">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="jane@company.com"
                    disabled={isSubmitting}
                    className="w-full bg-white border border-neutral-200 rounded-none px-4 py-3 text-xs focus:outline-hidden focus:border-black transition-colors disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="block text-[9px] font-mono font-bold text-neutral-400 uppercase tracking-widest">
                  Subject Topic
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="Engineering contract opportunity"
                  disabled={isSubmitting}
                  className="w-full bg-white border border-neutral-200 rounded-none px-4 py-3 text-xs focus:outline-hidden focus:border-black transition-colors disabled:opacity-50"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="block text-[9px] font-mono font-bold text-neutral-400 uppercase flex justify-between tracking-widest">
                  <span>Detailed Message</span>
                  <span className={`text-[9px] ${formData.message.trim().length >= 10 ? 'text-neutral-400' : 'text-red-400'}`}>
                    {formData.message.trim().length} Chars
                  </span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Describe your design needs, engineering tasks or ideas here..."
                  disabled={isSubmitting}
                  className="w-full bg-white border border-neutral-200 rounded-none px-4 py-3 text-xs focus:outline-hidden focus:border-black transition-colors resize-none disabled:opacity-50"
                />
              </div>

              <button
                type="submit"
                id="contact-submit-btn"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-black hover:bg-neutral-800 text-white font-bold text-[11px] uppercase tracking-widest transition-colors cursor-pointer rounded-none disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-3 h-3 border-2 border-white border-t-transparent animate-spin"></span>
                    <span>Delivering message packet...</span>
                  </>
                ) : (
                  <>
                    <span>Dispatch Message</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* SUBMISSIONS MESSAGES DRAWER / INBOX SLIDEOUT (Review sent messages) */}
      <AnimatePresence>
        {showInbox && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Drawer Backdrop Overlay */}
            <motion.div
              id="inbox-drawer-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowInbox(false)}
              className="absolute inset-0 bg-black"
            />

            {/* Drawer Sheet */}
            <motion.div
              id="inbox-drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative bg-white border-l border-neutral-200 w-full max-w-md h-full flex flex-col z-10 shadow-none"
            >
              {/* Inbox Header */}
              <div className="p-6 border-b border-neutral-200 flex items-center justify-between bg-neutral-50 rounded-none">
                <div className="flex items-center space-x-2">
                  <Inbox className="w-4 h-4 text-neutral-700" />
                  <h3 className="text-xs uppercase tracking-widest font-bold text-neutral-900">Message Dispatcher Logs</h3>
                </div>
                <button
                  id="close-inbox-btn"
                  onClick={() => setShowInbox(false)}
                  className="p-1 border border-neutral-200 text-neutral-400 hover:text-black hover:border-black cursor-pointer rounded-none"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Submissions List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {submissions.length === 0 ? (
                  <div className="text-center py-12 space-y-3">
                    <Clock className="w-10 h-10 text-neutral-300 mx-auto" />
                    <p className="text-neutral-500 font-light text-xs uppercase tracking-wider">No dispatched messages found.</p>
                    <p className="text-neutral-400 text-[10px] uppercase tracking-wider">Submit a contact form to populate this log.</p>
                  </div>
                ) : (
                  submissions.map((sub) => (
                    <div
                      id={`inbox-item-${sub.id}`}
                      key={sub.id}
                      className={`border rounded-none p-4 space-y-3 transition-colors ${
                        sub.read ? 'bg-[#fcfcfc] border-neutral-200' : 'bg-neutral-50 border-neutral-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <strong className="block text-neutral-900 text-xs font-bold uppercase tracking-wider">{sub.name}</strong>
                          <span className="text-neutral-400 text-[9px] font-mono leading-none">{sub.email}</span>
                        </div>

                        <div className="flex items-center space-x-2">
                          {!sub.read && (
                            <button
                              id={`mark-read-btn-${sub.id}`}
                              onClick={() => onMarkRead(sub.id)}
                              className="text-[9px] font-mono font-bold uppercase text-emerald-600 hover:underline cursor-pointer"
                            >
                              Mark read
                            </button>
                          )}
                          <button
                            id={`delete-msg-btn-${sub.id}`}
                            onClick={() => onDeleteMessage(sub.id)}
                            className="text-neutral-400 hover:text-red-600 transition-colors p-1"
                            title="Delete message"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="block text-xs font-semibold text-neutral-800">{sub.subject}</span>
                        <p className="text-xs text-neutral-600 font-light leading-relaxed whitespace-pre-wrap">
                          {sub.message}
                        </p>
                      </div>

                      <span className="block text-[8px] text-neutral-400 font-mono text-right uppercase tracking-wider">
                        {new Date(sub.timestamp).toLocaleString()}
                      </span>
                    </div>
                  ))
                )}
              </div>

              {/* Drawer footer info */}
              <div className="p-4 border-t border-neutral-200 text-center text-[9px] font-mono text-neutral-400 bg-neutral-50 uppercase tracking-widest rounded-none">
                Stored locally in browser state.
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
