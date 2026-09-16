
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import { ThemeProvider } from './context/ThemeContext';
import Loading from './components/Loading';

import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Downloads from './pages/Downloads';
import AllTools from './pages/AllTools';

// Tools (Lazy Loaded for Core Web Vitals & Code Splitting)
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
const HazardRateCalculator = lazy(() => import('./pages/Tools/HazardRateCalculator'));
const SystemReliabilityValidator = lazy(() => import('./pages/Tools/SystemReliabilityValidator'));
const FishboneDiagramGenerator = lazy(() => import('./pages/Tools/FishboneDiagramGenerator'));
const FaultTreeAnalysis = lazy(() => import('./pages/Tools/FaultTreeAnalysis'));
const MarkovChainTool = lazy(() => import('./pages/Tools/MarkovChainTool'));
const ReliabilityGrowth = lazy(() => import('./pages/Tools/ReliabilityGrowth'));
const WarrantyPrediction = lazy(() => import('./pages/Tools/WarrantyPrediction'));
const CostRiskOptimization = lazy(() => import('./pages/Tools/CostRiskOptimization'));
const GearboxReliability = lazy(() => import('./pages/Tools/GearboxReliability'));
const LubricantLifeOptimizer = lazy(() => import('./pages/Tools/LubricantLifeOptimizer'));
const DowntimeCostCalculator = lazy(() => import('./pages/Tools/DowntimeCostCalculator'));
const BearingLifeCalculator = lazy(() => import('./pages/Tools/BearingLifeCalculator'));
const VibrationSeverityChecker = lazy(() => import('./pages/Tools/VibrationSeverityChecker'));
const FiveWhyTool = lazy(() => import('./pages/Tools/FiveWhyTool'));
const ParetoChartTool = lazy(() => import('./pages/Tools/ParetoChartTool'));
const ReliabilityAllocationCalculator = lazy(() => import('./pages/Tools/ReliabilityAllocationCalculator'));
const SpcCalculator = lazy(() => import('./pages/Tools/SpcCalculator'));
const RcmDecisionWizard = lazy(() => import('./pages/Tools/RcmDecisionWizard'));

// Content & Legal
const LearningCenter = lazy(() => import('./pages/LearningCenter'));
const KnowledgeHub = lazy(() => import('./pages/KnowledgeHub'));
const InteractiveHub = lazy(() => import('./pages/InteractiveHub'));
const ArticleView = lazy(() => import('./pages/ArticleView'));
const IndustriesHub = lazy(() => import('./pages/IndustriesHub'));
const IndustryView = lazy(() => import('./pages/IndustryView'));
const ProfessorsToolkit = lazy(() => import('./pages/ProfessorsToolkit'));
const PressKit = lazy(() => import('./pages/PressKit'));
const WidgetBuilder = lazy(() => import('./pages/WidgetBuilder'));
const Faq = lazy(() => import('./pages/Faq'));
const Glossary = lazy(() => import('./pages/Glossary'));
const Methodology = lazy(() => import('./pages/Methodology'));
const PrivacyPolicy = lazy(() => import('./pages/Legal').then(module => ({ default: module.PrivacyPolicy })));
const TermsOfService = lazy(() => import('./pages/Legal').then(module => ({ default: module.TermsOfService })));
const CookiePolicy = lazy(() => import('./pages/Legal').then(module => ({ default: module.CookiePolicy })));

const EmbedView = lazy(() => import('./components/EmbedView'));

// Skill Test
const SkillTestLanding = lazy(() => import('./pages/SkillTest/Landing'));
const SkillTestQuiz = lazy(() => import('./pages/SkillTest/Quiz'));
const SkillTestResults = lazy(() => import('./pages/SkillTest/Results'));

import GoogleAnalyticsTracker from './components/GoogleAnalyticsTracker';
import ContextGlossary from './components/ContextGlossary';
import RedirectHandler from './components/RedirectHandler';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Router>
        <RedirectHandler />
        <GoogleAnalyticsTracker />
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="contact" element={<Contact />} />
              <Route path="downloads" element={<Downloads />} />

              {/* Canonical Tools Routing (/tools/[slug]/) */}
              <Route path="tools" element={<AllTools />} />
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
              <Route path="tools/optimal-replacement" element={<OptimalReplacement />} />
              <Route path="tools/eoq" element={<EoqCalculator />} />
              <Route path="tools/sil" element={<SilVerification />} />
              <Route path="tools/fmea" element={<FmeaCalculator />} />
              <Route path="tools/confidence-interval" element={<ConfidenceInterval />} />
              <Route path="tools/k-out-of-n" element={<KOutOfN />} />
              <Route path="tools/hazard-rate" element={<HazardRateCalculator />} />
              <Route path="tools/validator" element={<SystemReliabilityValidator />} />
              <Route path="tools/fishbone" element={<FishboneDiagramGenerator />} />
              <Route path="tools/fta" element={<FaultTreeAnalysis />} />
              <Route path="tools/markov" element={<MarkovChainTool />} />
              <Route path="tools/growth" element={<ReliabilityGrowth />} />
              <Route path="tools/warranty" element={<WarrantyPrediction />} />
              <Route path="tools/cost-risk" element={<CostRiskOptimization />} />
              <Route path="tools/gearbox" element={<GearboxReliability />} />
              <Route path="tools/lubricant-life" element={<LubricantLifeOptimizer />} />
              <Route path="tools/downtime-cost" element={<DowntimeCostCalculator />} />
              <Route path="tools/bearing-life" element={<BearingLifeCalculator />} />
              <Route path="tools/vibration-severity" element={<VibrationSeverityChecker />} />
              <Route path="tools/5-why" element={<FiveWhyTool />} />
              <Route path="tools/pareto" element={<ParetoChartTool />} />
              <Route path="tools/reliability-allocation" element={<ReliabilityAllocationCalculator />} />
              <Route path="tools/spc" element={<SpcCalculator />} />
              <Route path="tools/rcm-decision" element={<RcmDecisionWizard />} />

              {/* Content & Articles */}
              <Route path="learning" element={<LearningCenter />} />
              <Route path="articles" element={<LearningCenter />} />
              <Route path="blog" element={<LearningCenter />} />
              <Route path="knowledge-hub" element={<KnowledgeHub />} />
              <Route path="interactive-hub" element={<InteractiveHub />} />
              <Route path="industries" element={<IndustriesHub />} />
              <Route path="industries/:industrySlug" element={<IndustryView />} />
              <Route path="professors" element={<ProfessorsToolkit />} />
              <Route path="press" element={<PressKit />} />
              <Route path="embed" element={<WidgetBuilder />} />
              <Route path="learning/:articleId" element={<ArticleView />} />
              <Route path="articles/:articleId" element={<ArticleView />} />
              <Route path="blog/:articleId" element={<ArticleView />} />
              <Route path="faq" element={<Faq />} />
              <Route path="reliability-engineering-glossary" element={<Glossary />} />
              <Route path="methodology" element={<Methodology />} />

              {/* Legal */}
              <Route path="legal/privacy" element={<PrivacyPolicy />} />
              <Route path="legal/terms" element={<TermsOfService />} />
              <Route path="legal/cookies" element={<CookiePolicy />} />

              {/* Skill Test */}
              <Route path="skill-test" element={<SkillTestLanding />} />
              <Route path="skill-test/quiz" element={<SkillTestQuiz />} />
              <Route path="skill-test/results" element={<SkillTestResults />} />
            </Route>

            {/* Standalone Route for Embeds */}
            <Route path="/embed/:toolId" element={<EmbedView />} />
          </Routes>
        </Suspense>
        <ContextGlossary />
      </Router>
    </ThemeProvider>
  );
};

export default App;
