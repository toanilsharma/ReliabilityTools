
import React, { Suspense, lazy } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import { ThemeProvider } from './context/ThemeContext';
import Loading from './components/Loading';

// Lazy load pages to split code and improve initial load speed
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Downloads = lazy(() => import('./pages/Downloads'));

// Tools
const MtbfCalculator = lazy(() => import('./pages/Tools/MtbfCalculator'));
const WeibullAnalysis = lazy(() => import('./pages/Tools/WeibullAnalysis'));
const RbdTool = lazy(() => import('./pages/Tools/RbdTool'));
const AvailabilityCalculator = lazy(() => import('./pages/Tools/AvailabilityCalculator'));
const MttrCalculator = lazy(() => import('./pages/Tools/MttrCalculator'));
const SparePartEstimator = lazy(() => import('./pages/Tools/SparePartEstimator'));
const PmScheduler = lazy(() => import('./pages/Tools/PmScheduler'));
const LccCalculator = lazy(() => import('./pages/Tools/LccCalculator'));
const OeeCalculator = lazy(() => import('./pages/Tools/OeeCalculator'));
const TestPlanner = lazy(() => import('./pages/Tools/TestPlanner'));
const MaturityAssessment = lazy(() => import('./pages/Tools/MaturityAssessment'));
const UnitConverter = lazy(() => import('./pages/Tools/UnitConverter'));
// New Tools
const OptimalReplacement = lazy(() => import('./pages/Tools/OptimalReplacement'));
const EoqCalculator = lazy(() => import('./pages/Tools/EoqCalculator'));
const SilVerification = lazy(() => import('./pages/Tools/SilVerification'));
const FmeaCalculator = lazy(() => import('./pages/Tools/FmeaCalculator'));
const ConfidenceInterval = lazy(() => import('./pages/Tools/ConfidenceInterval'));
const KOutOfN = lazy(() => import('./pages/Tools/KOutOfN'));

// Content & Legal
const LearningCenter = lazy(() => import('./pages/LearningCenter'));
const KnowledgeHub = lazy(() => import('./pages/KnowledgeHub')); // New Import
const ArticleView = lazy(() => import('./pages/ArticleView'));
const Faq = lazy(() => import('./pages/Faq'));
const Glossary = lazy(() => import('./pages/Glossary'));
const PrivacyPolicy = lazy(() => import('./pages/Legal').then(module => ({ default: module.PrivacyPolicy })));
const TermsOfService = lazy(() => import('./pages/Legal').then(module => ({ default: module.TermsOfService })));
const CookiePolicy = lazy(() => import('./pages/Legal').then(module => ({ default: module.CookiePolicy })));

import GoogleAnalyticsTracker from './components/GoogleAnalyticsTracker';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Router>
        <GoogleAnalyticsTracker />
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="contact" element={<Contact />} />
              <Route path="downloads" element={<Downloads />} />

              {/* Tools */}
              <Route path="tools" element={<Home />} />
              <Route path="tools/mtbf" element={<MtbfCalculator />} />
              <Route path="tools/weibull" element={<WeibullAnalysis />} />
              <Route path="tools/rbd" element={<RbdTool />} />
              <Route path="tools/availability" element={<AvailabilityCalculator />} />
              <Route path="tools/mttr" element={<MttrCalculator />} />
              <Route path="tools/pm" element={<PmScheduler />} />
              <Route path="tools/spares" element={<SparePartEstimator />} />
              <Route path="tools/lcc" element={<LccCalculator />} />
              <Route path="tools/oee" element={<OeeCalculator />} />
              <Route path="tools/test-planner" element={<TestPlanner />} />
              <Route path="tools/assessment" element={<MaturityAssessment />} />
              <Route path="tools/converter" element={<UnitConverter />} />
              {/* New Routes */}
              <Route path="tools/optimal-replacement" element={<OptimalReplacement />} />
              <Route path="tools/eoq" element={<EoqCalculator />} />
              <Route path="tools/sil" element={<SilVerification />} />
              <Route path="tools/fmea" element={<FmeaCalculator />} />
              <Route path="tools/confidence-interval" element={<ConfidenceInterval />} />
              <Route path="tools/k-out-of-n" element={<KOutOfN />} />

              {/* Content */}
              <Route path="learning" element={<LearningCenter />} />
              <Route path="knowledge-hub" element={<KnowledgeHub />} /> {/* New Route */}
              <Route path="learning/:articleId" element={<ArticleView />} />
              <Route path="faq" element={<Faq />} />
              <Route path="glossary" element={<Glossary />} />

              {/* Legal */}
              <Route path="legal/privacy" element={<PrivacyPolicy />} />
              <Route path="legal/terms" element={<TermsOfService />} />
              <Route path="legal/cookies" element={<CookiePolicy />} />
            </Route>
          </Routes>
        </Suspense>
      </Router>
    </ThemeProvider>
  );
};

export default App;
