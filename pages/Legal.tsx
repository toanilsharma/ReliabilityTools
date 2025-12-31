import React from 'react';
import { CONTACT_EMAIL } from '../constants';

export const PrivacyPolicy: React.FC = () => (
  <div className="max-w-4xl mx-auto prose prose-slate dark:prose-invert pb-12">
    <h1>Privacy Policy</h1>
    <p className="text-sm text-slate-500">Last updated: {new Date().toLocaleDateString()}</p>
    
    <h2>1. Introduction</h2>
    <p>
      Reliability Tools ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how your personal information is collected, used, and disclosed by Reliability Tools. This policy applies to our website and its associated subdomains (collectively, our "Service"). By accessing or using our Service, you signify that you have read, understood, and agree to our collection, storage, use, and disclosure of your personal information as described in this Privacy Policy.
    </p>

    <h2>2. Data Collection and Usage</h2>
    <p>
      <strong>No Client Data Storage:</strong> We strictly adhere to a "Privacy by Design" philosophy. All engineering calculations (including MTBF, Weibull Analysis, RBD modeling, and Spare Part estimation) are performed <strong>client-side</strong> within your web browser using JavaScript. The data you enter into these forms is not transmitted to our servers, nor is it stored in any backend database controlled by us.
    </p>
    <p>
      <strong>Voluntary Information:</strong> We may collect personal information that you voluntarily provide to us when you contact us for support, such as your name and email address. This information is used solely to respond to your inquiries.
    </p>

    <h2>3. Cookies and Tracking Technologies</h2>
    <p>
      We use cookies and similar tracking technologies to track the activity on our Service and hold certain information. Cookies are files with small amount of data which may include an anonymous unique identifier.
    </p>
    <ul>
      <li><strong>Essential Cookies:</strong> We use these to remember your preferences (such as Dark Mode settings) and legal consents.</li>
      <li><strong>Analytics Cookies:</strong> We use third-party Service Providers, such as Google Analytics, to monitor and analyze the use of our Service. This helps us understand traffic patterns and improve our tools. Google Analytics collects data such as your IP address, browser type, and pages visited.</li>
      <li><strong>Advertising Cookies:</strong> We use Google AdSense to serve advertisements. Google and its partners use cookies to serve ads based on your prior visits to our website or other websites on the Internet. You may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>.</li>
    </ul>

    <h2>4. Third-Party Service Providers</h2>
    <p>
      We may employ third-party companies and individuals to facilitate our Service ("Service Providers"), to provide the Service on our behalf, to perform Service-related services, or to assist us in analyzing how our Service is used. These third parties have access to your Personal Data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.
    </p>

    <h2>5. Contact Us</h2>
    <p>
      If you have any questions about this Privacy Policy, please contact us at: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
    </p>
  </div>
);

export const TermsOfService: React.FC = () => (
  <div className="max-w-4xl mx-auto prose prose-slate dark:prose-invert pb-12">
    <h1>Terms of Service</h1>
    <p className="text-sm text-slate-500">Last updated: {new Date().toLocaleDateString()}</p>

    <h2>1. Acceptance of Terms</h2>
    <p>
      By accessing or using the website Reliability Tools (the "Service"), you agree to be bound by these Terms of Service. If you disagree with any part of the terms, then you may not access the Service.
    </p>

    <h2>2. Use License</h2>
    <p>
      Permission is granted to temporarily download one copy of the materials (information or software) on Reliability Tools' website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
    </p>
    <ul>
      <li>modify or copy the materials;</li>
      <li>use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
      <li>attempt to decompile or reverse engineer any software contained on the Reliability Tools website;</li>
      <li>remove any copyright or other proprietary notations from the materials; or</li>
      <li>transfer the materials to another person or "mirror" the materials on any other server.</li>
    </ul>
    <p>
      This license shall automatically terminate if you violate any of these restrictions and may be terminated by Reliability Tools at any time.
    </p>

    <h2>3. Disclaimer regarding Engineering Advice</h2>
    <p>
      <strong>Educational Purpose Only:</strong> The calculators, tools, templates, and content provided on this website are for educational and informational purposes only. They are designed to assist professionals in understanding reliability concepts.
    </p>
    <p>
      <strong>No Professional Liability:</strong> Reliability Tools makes no warranties, expressed or implied, regarding the accuracy, reliability, or completeness of the calculations provided. These tools should <strong>not</strong> be used for safety-critical engineering decisions, life-support system design, or financial investment decisions without independent verification by a qualified professional engineer licensed in your jurisdiction.
    </p>

    <h2>4. Limitation of Liability</h2>
    <p>
      In no event shall Reliability Tools or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Reliability Tools' website, even if Reliability Tools or a Reliability Tools authorized representative has been notified orally or in writing of the possibility of such damage.
    </p>

    <h2>5. Modifications</h2>
    <p>
      Reliability Tools may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these Terms of Service.
    </p>
  </div>
);

export const CookiePolicy: React.FC = () => (
  <div className="max-w-4xl mx-auto prose prose-slate dark:prose-invert pb-12">
    <h1>Cookie Policy</h1>
    <p className="text-sm text-slate-500">Last updated: {new Date().toLocaleDateString()}</p>

    <h2>1. What are cookies?</h2>
    <p>
      Cookies are small text files that are sent to your web browser by a website you visit. A cookie file is stored in your web browser and allows the Service or a third-party to recognize you and make your next visit easier and the Service more useful to you. Cookies can be "persistent" or "session" cookies.
    </p>

    <h2>2. How Reliability Tools uses cookies</h2>
    <p>
      When you use and access the Service, we may place a number of cookies files in your web browser. We use cookies for the following purposes:
    </p>
    <ul>
      <li><strong>Essential Cookies:</strong> To enable certain functions of the Service, such as remembering your Dark Mode preference or your acceptance of this Cookie Policy.</li>
      <li><strong>Analytics Cookies:</strong> To track information on how the Service is used so that we can make improvements. We may use third-party analytics providers like Google Analytics.</li>
      <li><strong>Advertising Cookies:</strong> To deliver advertisements on and through the Service and track the performance of these advertisements. These cookies are placed by third-party advertising networks like Google AdSense.</li>
    </ul>

    <h2>3. Your choices regarding cookies</h2>
    <p>
      If you'd like to delete cookies or instruct your web browser to delete or refuse cookies, please visit the help pages of your web browser.
      Please note, however, that if you delete cookies or refuse to accept them, you might not be able to use all of the features we offer, you may not be able to store your preferences, and some of our pages might not display properly.
    </p>
  </div>
);