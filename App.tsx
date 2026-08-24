
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

// Tools
import MtbfCalculator from './pages/Tools/MtbfCalculator';
import WeibullAnalysis from './pages/Tools/WeibullAnalysis';
import RbdTool from './pages/Tools/RbdTool';
import AvailabilityCalculator from './pages/Tools/AvailabilityCalculator';
import MttrCalculator from './pages/Tools/MttrCalculator';
import SparePartEstimator from './pages/Tools/SparePartEstimator';
import PmScheduler from './pages/Tools/PmScheduler';
import LccCalculator from './pages/Tools/LccCalculator';
import OeeCalculator from './pages/Tools/OeeCalculator';
import TestPlanner from './pages/Tools/TestPlanner';
import MaturityAssessment from './pages/Tools/MaturityAssessment';
import UnitConverter from './pages/Tools/UnitConverter';
// New Tools
import OptimalReplacement from './pages/Tools/OptimalReplacement';
import EoqCalculator from './pages/Tools/EoqCalculator';
import SilVerification from './pages/Tools/SilVerification';
import FmeaCalculator from './pages/Tools/FmeaCalculator';
import ConfidenceInterval from './pages/Tools/ConfidenceInterval';
import KOutOfN from './pages/Tools/KOutOfN';
import HazardRateCalculator from './pages/Tools/HazardRateCalculator';
import SystemReliabilityValidator from './pages/Tools/SystemReliabilityValidator';
import FishboneDiagramGenerator from './pages/Tools/FishboneDiagramGenerator';
import FaultTreeAnalysis from './pages/Tools/FaultTreeAnalysis';
import MarkovChainTool from './pages/Tools/MarkovChainTool';
import ReliabilityGrowth from './pages/Tools/ReliabilityGrowth';
import WarrantyPrediction from './pages/Tools/WarrantyPrediction';
import CostRiskOptimization from './pages/Tools/CostRiskOptimization';
import GearboxReliability from './pages/Tools/GearboxReliability';
import LubricantLifeOptimizer from './pages/Tools/LubricantLifeOptimizer';
import DowntimeCostCalculator from './pages/Tools/DowntimeCostCalculator';
import BearingLifeCalculator from './pages/Tools/BearingLifeCalculator';
import VibrationSeverityChecker from './pages/Tools/VibrationSeverityChecker';
import FiveWhyTool from './pages/Tools/FiveWhyTool';
import ParetoChartTool from './pages/Tools/ParetoChartTool';
import ReliabilityAllocationCalculator from './pages/Tools/ReliabilityAllocationCalculator';
import SpcCalculator from './pages/Tools/SpcCalculator';
import RcmDecisionWizard from './pages/Tools/RcmDecisionWizard';

// Content & Legal
import LearningCenter from './pages/LearningCenter';
import KnowledgeHub from './pages/KnowledgeHub';
import InteractiveHub from './pages/InteractiveHub';
import ArticleView from './pages/ArticleView';
import IndustriesHub from './pages/IndustriesHub';
import IndustryView from './pages/IndustryView';
import ProfessorsToolkit from './pages/ProfessorsToolkit';
import PressKit from './pages/PressKit';
import WidgetBuilder from './pages/WidgetBuilder';
import Faq from './pages/Faq';
import Glossary from './pages/Glossary';
import Methodology from './pages/Methodology';
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
