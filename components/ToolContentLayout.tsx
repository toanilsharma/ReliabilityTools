import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ChevronDown, ChevronUp, Share2, Printer } from 'lucide-react';

interface FAQItem {
    question: string;
    answer: string;
}

interface ToolContentLayoutProps {
    title: string;
    description: string;
    toolComponent: React.ReactNode;
    content: React.ReactNode;
    faqs: FAQItem[];
    keywords?: string;
    schema?: any;
}

const ToolContentLayout: React.FC<ToolContentLayoutProps> = ({
    title,
    description,
    toolComponent,
    content,
    faqs,
    keywords,
    schema
}) => {
    const [openFaqIndex, setOpenFaqIndex] = React.useState<number | null>(null);

    const toggleFaq = (index: number) => {
        setOpenFaqIndex(openFaqIndex === index ? null : index);
    };

    const cleanDescription = description.replace(/<[^>]*>?/gm, '');

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* SEO */}
            <Helmet>
                <title>{`${title} | Reliability Tools`}</title>
                <meta name="description" content={cleanDescription} />
                {keywords && <meta name="keywords" content={keywords} />}
                <script type="application/ld+json">
                    {JSON.stringify(schema || {})}
                </script>
                <script type="application/ld+json">
                    {JSON.stringify(faqSchema)}
                </script>
            </Helmet>

            {/* Hero Section */}
            <div className="mb-10 text-center max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 leading-tight">
                    {title}
                </h1>
                <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
                    {description}
                </p>
                <div className="flex justify-center gap-4">
                    <button
                        onClick={() => window.scrollTo({ top: document.getElementById('tool-container')?.offsetTop! - 100, behavior: 'smooth' })}
                        className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-cyan-500/30 transition-all transform hover:-translate-y-1"
                    >
                        Use Tool Now
                    </button>
                    <button
                        onClick={() => {
                            if (navigator.share) {
                                navigator.share({
                                    title: title,
                                    text: description,
                                    url: window.location.href,
                                });
                            } else {
                                navigator.clipboard.writeText(window.location.href);
                                alert('Link copied to clipboard!');
                            }
                        }}
                        className="flex items-center gap-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-semibold py-3 px-6 rounded-full hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                    >
                        <Share2 className="w-5 h-5" /> Share
                    </button>
                </div>
            </div>

            {/* Tool Container */}
            <div id="tool-container" className="scroll-mt-24 mb-16">
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div className="p-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 opacity-20 dark:opacity-40"></div>
                    <div className="p-6 md:p-8">
                        {toolComponent}
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-4 gap-12">
                {/* Main Content */}
                <div className="lg:col-span-3 space-y-12">
                    {/* Article Section */}
                    <article className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:text-slate-900 dark:prose-headings:text-white prose-a:text-cyan-600 dark:prose-a:text-cyan-400 hover:prose-a:text-cyan-500">
                        {content}
                    </article>

                    {/* FAQ Section */}
                    <section className="pt-12 border-t border-slate-200 dark:border-slate-800">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Frequently Asked Questions</h2>
                        <div className="space-y-4">
                            {faqs.map((faq, index) => (
                                <div
                                    key={index}
                                    className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden transition-all duration-200 hover:border-cyan-500/50 dark:hover:border-cyan-500/50"
                                >
                                    <button
                                        onClick={() => toggleFaq(index)}
                                        className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                                    >
                                        <span className="text-lg font-semibold text-slate-900 dark:text-white pr-8">{faq.question}</span>
                                        {openFaqIndex === index ? (
                                            <ChevronUp className="w-5 h-5 text-cyan-500 flex-shrink-0" />
                                        ) : (
                                            <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                                        )}
                                    </button>
                                    <div
                                        className={`transition-all duration-300 ease-in-out ${openFaqIndex === index ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                                            }`}
                                    >
                                        <div className="px-6 pb-6 text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-700/50 pt-4 mt-2">
                                            <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="sticky top-24 space-y-8">
                        {/* Table of Contents or Ad space could go here */}
                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 border border-slate-100 dark:border-slate-700/50">
                            <h3 className="font-bold text-slate-900 dark:text-white mb-4">Table of Contents</h3>
                            <nav className="space-y-2 text-sm">
                                <a href="#" className="block text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Introduction</a>
                                <a href="#tool-container" className="block text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Calculator</a>
                                <a href="#how-to" className="block text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">How to Calculate</a>
                                <a href="#applications" className="block text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Applications</a>
                                <a href="#standards" className="block text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Standards</a>
                            </nav>
                        </div>

                        <div className="bg-gradient-to-br from-cyan-900 to-slate-900 rounded-xl p-6 text-white shadow-lg">
                            <h3 className="font-bold text-lg mb-2">Need Help?</h3>
                            <p className="text-cyan-100 text-sm mb-4">Get professional reliability consulting for your facility.</p>
                            <a href="/contact" className="block w-full bg-white text-cyan-900 text-center font-bold py-2 rounded-lg hover:bg-cyan-50 transition-colors">
                                Contact Us
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ToolContentLayout;
