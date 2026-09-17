
import React from 'react';
import { AUTHOR_NAME, AUTHOR_BIO, CONTACT_EMAIL, AUTHOR_LINKEDIN } from '../constants';
import { User, Mail, Linkedin, Award, ShieldCheck } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <section>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">About Reliability Tools</h1>
        <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
          <p>
            Reliability Tools was created to bridge the gap between complex, expensive enterprise software and the need for quick, accessible calculations in the field. 
            Whether you are a student learning the basics of Weibull analysis or a maintenance manager needing a quick MTBF verification, this platform is designed for you.
          </p>
          <p>
            Our mission is to democratize reliability engineering knowledge by providing open, transparent, and standard-compliant tools that run directly in your browser.
            No data is sent to servers—all calculations happen locally on your device, ensuring privacy and speed.
          </p>
        </div>
      </section>

      <section className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-lg">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div className="bg-gradient-to-br from-cyan-500/20 to-blue-600/20 p-5 rounded-2xl border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 shrink-0">
            <User className="w-10 h-10" />
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-xs font-bold text-cyan-600 dark:text-cyan-400 mb-2">
                <ShieldCheck className="w-3.5 h-3.5" /> Reliability & Asset Management Expert
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">{AUTHOR_NAME}</h2>
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                Over 25+ Years Industrial Plant Experience &middot; Continuous Process Industries
              </p>
            </div>
            
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              {AUTHOR_BIO}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <a
                href={AUTHOR_LINKEDIN}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#0A66C2] hover:bg-[#004182] text-white text-sm font-bold rounded-xl shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5"
              >
                <Linkedin className="w-4 h-4" />
                Connect on LinkedIn
              </a>

              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-sm font-medium rounded-xl transition-colors"
              >
                <Mail className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                {CONTACT_EMAIL}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Data Privacy</h2>
        <p className="text-slate-600 dark:text-slate-400">
          We believe in privacy by design. None of the data you enter into the calculators (failure counts, operational hours, Weibull datasets) is transmitted to any backend database. 
          Calculations are performed using JavaScript within your own browser session.
        </p>
      </section>
    </div>
  );
};

export default About;
