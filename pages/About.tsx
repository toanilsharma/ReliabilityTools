
import React from 'react';
import { AUTHOR_NAME, AUTHOR_BIO, CONTACT_EMAIL } from '../constants';
import { User, Mail } from 'lucide-react';

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
        <div className="flex items-start gap-6">
          <div className="bg-slate-100 dark:bg-slate-700 p-4 rounded-full hidden sm:block">
            <User className="w-8 h-8 text-cyan-600 dark:text-cyan-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">About the Author</h2>
            <h3 className="text-lg text-cyan-600 dark:text-cyan-400 font-medium mb-4">{AUTHOR_NAME}</h3>
            <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
              {AUTHOR_BIO}
            </p>
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-white transition-colors">
              <Mail className="w-4 h-4" />
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
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
