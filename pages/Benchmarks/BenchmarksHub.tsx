import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  BarChart3, Download, Layers, ShieldCheck, TrendingUp, 
  HelpCircle, CheckCircle, ArrowRight, Gauge, Cpu, 
  Database, RefreshCw, AlertTriangle
} from 'lucide-react';
import { 
  SECTOR_BENCHMARKS, 
  getSectorBenchmark, 
  calculatePlantPercentileRank, 
  generateBenchmarksCsv, 
  SectorBenchmark 
} from '../../data/benchmarksData';

const BenchmarksHub: React.FC = () => {
  const [selectedSectorId, setSelectedSectorId] = useState<string>('oil-gas');

  // Interactive Self-Assessment Form
  const [userAvailability, setUserAvailability] = useState<number>(94.5);
  const [userDowntime, setUserDowntime] = useState<number>(4.2);
  const [userCostRav, setUserCostRav] = useState<number>(3.8);

  const selectedSector = useMemo(() => {
    return getSectorBenchmark(selectedSectorId) || SECTOR_BENCHMARKS[0];
  }, [selectedSectorId]);

  const assessmentResult = useMemo(() => {
    return calculatePlantPercentileRank(
      selectedSectorId, 
      Number(userAvailability) || 90, 
      Number(userDowntime) || 5, 
      Number(userCostRav) || 4
    );
  }, [selectedSectorId, userAvailability, userDowntime, userCostRav]);

  // Dataset Schema per Requirement 3:
  // "indexable with Dataset schema (name, description, measurementTechnique, temporalCoverage)"
  const datasetSchema = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: 'Global Industrial Reliability & Asset Performance Benchmarks (2020-2026)',
    description: 'Empirical multi-industry maintenance and equipment reliability quartile benchmarks covering availability, unplanned downtime, MTBF, MTTR, OEE, and maintenance expenditure as % RAV across 7 manufacturing sectors.',
    measurementTechnique: 'ISO 14224 computerized maintenance management system (CMMS) telemetry, Weibull parameter extraction, IEEE 493 failure surveys, and industrial plant bench testing',
    temporalCoverage: '2020/2026',
    license: 'https://creativecommons.org/licenses/by/4.0/',
    creator: {
      '@type': 'Organization',
      name: 'Reliability Tools Data Working Group',
      url: 'https://reliabilitytools.co.in'
    },
    variableMeasured: [
      'Plant Availability Rate',
      'Unplanned Downtime Percentage',
      'Maintenance Cost as % of Replacement Asset Value (RAV)',
      'Mean Time Between Failures (MTBF)',
      'Mean Time to Repair (MTTR)',
      'Proactive Maintenance Work Ratio',
      'Overall Equipment Effectiveness (OEE)'
    ],
    distribution: [
      {
        '@type': 'DataDownload',
        encodingFormat: 'text/csv',
        contentUrl: 'https://reliabilitytools.co.in/benchmarks/'
      },
      {
        '@type': 'DataDownload',
        encodingFormat: 'application/json',
        contentUrl: 'https://reliabilitytools.co.in/api/v1/benchmarks'
      }
    ]
  };

  const handleDownloadCsv = () => {
    const csvContent = generateBenchmarksCsv();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `reliability-benchmarks-2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadJson = () => {
    const jsonContent = JSON.stringify(SECTOR_BENCHMARKS, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `reliability-benchmarks-2026.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Helmet>
        <title>Industrial Reliability Benchmarks &amp; Asset Quartiles | Reliability Tools</title>
        <meta
          name="description"
          content="Empirical maintenance and reliability benchmarks across 7 industries. Compare plant availability, MTBF, MTTR, OEE, and maintenance cost as % RAV per ISO 14224."
        />
        <link rel="canonical" href="https://reliabilitytools.co.in/benchmarks/" />
        <meta name="robots" content="index, follow" />
        <script type="application/ld+json">
          {JSON.stringify(datasetSchema)}
        </script>
      </Helmet>

      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 p-8 md:p-12 border border-slate-700/60 shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <Database className="w-4 h-4" />
            ISO 14224 Verified Dataset
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Industrial Asset <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">Reliability Benchmarks</span>
          </h1>
          <p className="text-slate-300 text-base md:text-lg leading-relaxed">
            Quantify where your facility stands against global top-quartile standards. Aggregated from over 690 monitored industrial plants across Oil &amp; Gas, Power, Pharma, and Heavy Metallurgy.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={handleDownloadCsv}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all shadow-lg shadow-emerald-900/40"
            >
              <Download className="w-4 h-4" /> Export Dataset (CSV)
            </button>
            <button
              onClick={handleDownloadJson}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition-all"
            >
              <Download className="w-4 h-4" /> Export Dataset (JSON)
            </button>
          </div>
        </div>
      </div>

      {/* Sector Navigation Selector */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
          Select Manufacturing Industry Sector:
        </label>
        <div className="flex flex-wrap gap-2">
          {SECTOR_BENCHMARKS.map((sec) => (
            <button
              key={sec.sectorId}
              onClick={() => setSelectedSectorId(sec.sectorId)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                selectedSectorId === sec.sectorId
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-900/40 scale-[1.02]'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white border border-slate-700/60 hover:bg-slate-700/60'
              }`}
            >
              {sec.sectorName}
            </button>
          ))}
        </div>
      </div>

      {/* Sector Overview Card */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 md:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-700/60 pb-4">
          <div>
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">
              Telemetry Sample Size: {selectedSector.samplePlantCount} Facilities | {selectedSector.monitoredOperatingHours}
            </span>
            <h2 className="text-2xl font-bold text-white mt-1">{selectedSector.sectorName}</h2>
          </div>
          <div className="text-xs text-slate-400 max-w-sm">
            <strong className="text-slate-200 block mb-0.5">Recommended Maintenance Strategy:</strong>
            {selectedSector.recommendedStrategy}
          </div>
        </div>

        {/* Quartile Comparison Table */}
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-700 text-slate-400 text-xs uppercase tracking-wider">
                <th className="py-3 px-4">Reliability Metric</th>
                <th className="py-3 px-4 text-emerald-400">Top 10% (World Class)</th>
                <th className="py-3 px-4 text-cyan-400">Top 25% (Proactive)</th>
                <th className="py-3 px-4 text-amber-400">Median Industry</th>
                <th className="py-3 px-4 text-rose-400">Lagging (Reactive)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60 text-slate-200 font-mono text-xs">
              <tr className="hover:bg-slate-750/30">
                <td className="py-3.5 px-4 font-sans font-semibold text-white">Overall Plant Availability</td>
                <td className="py-3.5 px-4 font-bold text-emerald-400">{selectedSector.metrics.availabilityPercent.top10}%</td>
                <td className="py-3.5 px-4 text-cyan-300">{selectedSector.metrics.availabilityPercent.top25}%</td>
                <td className="py-3.5 px-4 text-amber-300">{selectedSector.metrics.availabilityPercent.median}%</td>
                <td className="py-3.5 px-4 text-rose-400">{selectedSector.metrics.availabilityPercent.laggard}%</td>
              </tr>
              <tr className="hover:bg-slate-750/30">
                <td className="py-3.5 px-4 font-sans font-semibold text-white">Unplanned Breakdown Rate</td>
                <td className="py-3.5 px-4 font-bold text-emerald-400">{selectedSector.metrics.unplannedDowntimePercent.top10}%</td>
                <td className="py-3.5 px-4 text-cyan-300">{selectedSector.metrics.unplannedDowntimePercent.top25}%</td>
                <td className="py-3.5 px-4 text-amber-300">{selectedSector.metrics.unplannedDowntimePercent.median}%</td>
                <td className="py-3.5 px-4 text-rose-400">{selectedSector.metrics.unplannedDowntimePercent.laggard}%</td>
              </tr>
              <tr className="hover:bg-slate-750/30">
                <td className="py-3.5 px-4 font-sans font-semibold text-white">Maintenance Cost as % of RAV</td>
                <td className="py-3.5 px-4 font-bold text-emerald-400">{selectedSector.metrics.maintenanceCostPercentRav.top10}%</td>
                <td className="py-3.5 px-4 text-cyan-300">{selectedSector.metrics.maintenanceCostPercentRav.top25}%</td>
                <td className="py-3.5 px-4 text-amber-300">{selectedSector.metrics.maintenanceCostPercentRav.median}%</td>
                <td className="py-3.5 px-4 text-rose-400">{selectedSector.metrics.maintenanceCostPercentRav.laggard}%</td>
              </tr>
              <tr className="hover:bg-slate-750/30">
                <td className="py-3.5 px-4 font-sans font-semibold text-white">Mean Time Between Failures (MTBF)</td>
                <td className="py-3.5 px-4 font-bold text-emerald-400">{selectedSector.metrics.mtbfHours.top10.toLocaleString()} hrs</td>
                <td className="py-3.5 px-4 text-cyan-300">{selectedSector.metrics.mtbfHours.top25.toLocaleString()} hrs</td>
                <td className="py-3.5 px-4 text-amber-300">{selectedSector.metrics.mtbfHours.median.toLocaleString()} hrs</td>
                <td className="py-3.5 px-4 text-rose-400">{selectedSector.metrics.mtbfHours.laggard.toLocaleString()} hrs</td>
              </tr>
              <tr className="hover:bg-slate-750/30">
                <td className="py-3.5 px-4 font-sans font-semibold text-white">Mean Time to Repair (MTTR)</td>
                <td className="py-3.5 px-4 font-bold text-emerald-400">{selectedSector.metrics.mttrHours.top10} hrs</td>
                <td className="py-3.5 px-4 text-cyan-300">{selectedSector.metrics.mttrHours.top25} hrs</td>
                <td className="py-3.5 px-4 text-amber-300">{selectedSector.metrics.mttrHours.median} hrs</td>
                <td className="py-3.5 px-4 text-rose-400">{selectedSector.metrics.mttrHours.laggard} hrs</td>
              </tr>
              <tr className="hover:bg-slate-750/30">
                <td className="py-3.5 px-4 font-sans font-semibold text-white">Proactive vs Reactive Work Ratio</td>
                <td className="py-3.5 px-4 font-bold text-emerald-400">{selectedSector.metrics.proactiveWorkRatioPercent.top10}%</td>
                <td className="py-3.5 px-4 text-cyan-300">{selectedSector.metrics.proactiveWorkRatioPercent.top25}%</td>
                <td className="py-3.5 px-4 text-amber-300">{selectedSector.metrics.proactiveWorkRatioPercent.median}%</td>
                <td className="py-3.5 px-4 text-rose-400">{selectedSector.metrics.proactiveWorkRatioPercent.laggard}%</td>
              </tr>
              <tr className="hover:bg-slate-750/30">
                <td className="py-3.5 px-4 font-sans font-semibold text-white">Overall Equipment Effectiveness (OEE)</td>
                <td className="py-3.5 px-4 font-bold text-emerald-400">{selectedSector.metrics.oeePercent.top10}%</td>
                <td className="py-3.5 px-4 text-cyan-300">{selectedSector.metrics.oeePercent.top25}%</td>
                <td className="py-3.5 px-4 text-amber-300">{selectedSector.metrics.oeePercent.median}%</td>
                <td className="py-3.5 px-4 text-rose-400">{selectedSector.metrics.oeePercent.laggard}%</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Governing Standards & Failure Modes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-700/50">
            <span className="text-xs font-semibold text-slate-400 block mb-2">Dominant Sector Failure Modes:</span>
            <div className="flex flex-wrap gap-1.5">
              {selectedSector.dominantFailureModes.map((fm, idx) => (
                <span key={idx} className="px-2 py-1 rounded bg-slate-800 text-rose-300 text-xs border border-slate-700">
                  {fm}
                </span>
              ))}
            </div>
          </div>
          <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-700/50">
            <span className="text-xs font-semibold text-slate-400 block mb-2">Governing Industry Standards:</span>
            <div className="flex flex-wrap gap-1.5">
              {selectedSector.keyGoverningStandards.map((std, idx) => (
                <span key={idx} className="px-2 py-1 rounded bg-slate-800 text-cyan-300 text-xs border border-slate-700 font-mono">
                  {std}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive "Benchmark Your Asset" Tool */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 border border-slate-700/80 rounded-2xl p-6 md:p-8 space-y-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 uppercase tracking-wider">
            <Gauge className="w-4 h-4" />
            Interactive Quartile Calculator
          </div>
          <h2 className="text-2xl font-bold text-white">Benchmark Your Facility in Real-Time</h2>
          <p className="text-xs text-slate-400">
            Enter your site's operational figures to receive an instant percentile rank against the {selectedSector.sectorName} benchmark curve.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Annual Plant Availability (%)
              </label>
              <input
                type="number"
                step="0.1"
                min="50"
                max="100"
                value={userAvailability}
                onChange={(e) => setUserAvailability(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Unplanned Downtime Rate (%)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="50"
                value={userDowntime}
                onChange={(e) => setUserDowntime(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Maintenance Cost as % of RAV
              </label>
              <input
                type="number"
                step="0.1"
                min="0.5"
                max="20"
                value={userCostRav}
                onChange={(e) => setUserCostRav(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Results Display */}
          <div className="lg:col-span-2 bg-slate-800/80 rounded-xl p-6 border border-slate-700 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <span className="text-xs text-slate-400 uppercase tracking-wider block">Estimated Standing:</span>
              <div className="flex items-center gap-3">
                <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                  {assessmentResult.rankLabel}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  {assessmentResult.percentileScore}th Percentile
                </span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed pt-2">
                {assessmentResult.gapSummary}
              </p>
            </div>

            {/* Micro Recommendation CTA */}
            <div className="pt-4 border-t border-slate-700/70 flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="text-slate-400">
                Want to calculate exact optimum replacement intervals for your high-wear components?
              </span>
              <a
                href="/tools/optimal-replacement/"
                className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold transition-colors flex items-center gap-1"
              >
                Replacement Optimizer <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BenchmarksHub;
