import React from 'react';
import { Mail, MapPin, Phone, MessageSquare, Clock, Globe } from 'lucide-react';
import { CONTACT_EMAIL } from '../constants';
import SEO from '../components/SEO';

const Contact: React.FC = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact Reliability Tools",
    "description": "Get in touch with our engineering team for questions about our reliability calculators.",
    "mainEntity": {
      "@type": "Organization",
      "name": "Reliability Tools",
      "email": CONTACT_EMAIL,
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer support",
        "email": CONTACT_EMAIL
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <SEO schema={schema} />

      <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-6">
          Get in Touch
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto px-4 leading-relaxed">
          Have a question about a calculation formula? Found a bug? Or just want to suggest a new tool? We'd love to hear from you.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Contact Information */}
        <div className="space-y-8">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg">
             <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Contact Information</h2>
             
             <div className="space-y-6">
               <div className="flex items-start gap-4">
                 <div className="p-3 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg text-cyan-600 dark:text-cyan-400">
                   <Mail className="w-6 h-6" />
                 </div>
                 <div>
                   <h3 className="font-bold text-slate-900 dark:text-white">Email Us</h3>
                   <p className="text-slate-500 dark:text-slate-400 text-sm mb-1">For general inquiries and support</p>
                   <a href={`mailto:${CONTACT_EMAIL}`} className="text-lg font-medium text-cyan-600 dark:text-cyan-400 hover:underline">
                     {CONTACT_EMAIL}
                   </a>
                 </div>
               </div>

               <div className="flex items-start gap-4">
                 <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
                   <MessageSquare className="w-6 h-6" />
                 </div>
                 <div>
                   <h3 className="font-bold text-slate-900 dark:text-white">Community</h3>
                   <p className="text-slate-500 dark:text-slate-400 text-sm">
                     Join the discussion on reliability engineering topics.
                   </p>
                   <div className="mt-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                     Response time: Within 24 hours
                   </div>
                 </div>
               </div>

               <div className="flex items-start gap-4">
                 <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg text-emerald-600 dark:text-emerald-400">
                   <Clock className="w-6 h-6" />
                 </div>
                 <div>
                   <h3 className="font-bold text-slate-900 dark:text-white">Operating Hours</h3>
                   <p className="text-slate-500 dark:text-slate-400 text-sm">
                     Mon - Fri: 9:00 AM - 5:00 PM (EST)
                   </p>
                 </div>
               </div>
             </div>
          </div>

          <div className="bg-slate-100 dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800">
             <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
               <Globe className="w-5 h-5" /> Global Availability
             </h3>
             <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
               Reliability Tools is a digital-first platform accessible worldwide. While we are based in the United States, our tools are built to comply with international standards including IEC, ISO, and IEEE.
             </p>
          </div>
        </div>

        {/* Contact Form Simulation */}
        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Send a Message</h2>
          <form className="space-y-6" onSubmit={(e) => {
            e.preventDefault();
            alert("Thank you! Your message has been simulated. Please use the email link to contact us directly.");
          }}>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">First Name</label>
                <input type="text" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-3 outline-none focus:ring-2 focus:ring-cyan-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Last Name</label>
                <input type="text" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-3 outline-none focus:ring-2 focus:ring-cyan-500" required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
              <input type="email" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-3 outline-none focus:ring-2 focus:ring-cyan-500" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Subject</label>
              <select className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-3 outline-none focus:ring-2 focus:ring-cyan-500">
                <option>General Inquiry</option>
                <option>Report a Bug</option>
                <option>Suggestion</option>
                <option>Partnership</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Message</label>
              <textarea rows={5} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-3 outline-none focus:ring-2 focus:ring-cyan-500" required></textarea>
            </div>

            <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-cyan-500/25">
              Send Message
            </button>
            
            <p className="text-xs text-center text-slate-500 dark:text-slate-400">
              By sending this message, you agree to our <a href="#/legal/privacy" className="underline">Privacy Policy</a>.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;