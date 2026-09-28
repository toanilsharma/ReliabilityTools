import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Code2, Terminal, Play, Copy, Check, ShieldCheck, 
  ExternalLink, Layers, Database, Lock, Server, ArrowRight
} from 'lucide-react';

interface EndpointDoc {
  id: string;
  method: 'GET' | 'POST';
  path: string;
  title: string;
  description: string;
  params: { name: string; type: string; required: boolean; description: string; defaultVal?: string }[];
  sampleResponse: any;
}

const API_ENDPOINTS: EndpointDoc[] = [
  {
    id: 'mtbf',
    method: 'GET',
    path: '/api/v1/mtbf',
    title: 'Calculate MTBF & Hazard Rate',
    description: 'Computes Mean Time Between Failures (MTBF), failure rate (λ), and mission reliability for given total operating hours and failure counts.',
    params: [
      { name: 'operatingHours', type: 'number', required: true, description: 'Total cumulative operational run hours', defaultVal: '10000' },
      { name: 'failures', type: 'integer', required: true, description: 'Count of observed functional failures', defaultVal: '4' },
      { name: 'missionTime', type: 'number', required: false, description: 'Target operating mission duration (hours) for R(t)', defaultVal: '1000' }
    ],
    sampleResponse: {
      status: 'success',
      data: {
        operatingHours: 10000,
        failures: 4,
        failureRatePerHour: 0.0004,
        failureRateFit: 400000,
        mtbfHours: 2500,
        missionReliabilityAt1000h: 0.6703,
        governingStandard: 'IEEE 493 / MIL-HDBK-338B'
      }
    }
  },
  {
    id: 'weibull',
    method: 'GET',
    path: '/api/v1/weibull',
    title: 'Weibull 2-Parameter Distribution',
    description: 'Evaluates 2-parameter Weibull reliability R(t), cumulative failure probability F(t), and instantaneous hazard rate h(t) at given operating time.',
    params: [
      { name: 'beta', type: 'number', required: true, description: 'Weibull shape parameter (β)', defaultVal: '1.8' },
      { name: 'eta', type: 'number', required: true, description: 'Characteristic scale life (η) in hours or cycles', defaultVal: '6000' },
      { name: 'time', type: 'number', required: true, description: 'Evaluation operating timestamp (t)', defaultVal: '3000' }
    ],
    sampleResponse: {
      status: 'success',
      data: {
        beta: 1.8,
        eta: 6000,
        time: 3000,
        reliabilityRt: 0.7505,
        unreliabilityFt: 0.2495,
        hazardRateHt: 0.000187,
        failureRegime: 'Wear-out phase (beta > 1.0)'
      }
    }
  },
  {
    id: 'oee',
    method: 'GET',
    path: '/api/v1/oee',
    title: 'Overall Equipment Effectiveness (OEE)',
    description: 'Computes Availability (A), Performance (P), Quality (Q) multipliers, and total composite OEE per ISO 22400.',
    params: [
      { name: 'availability', type: 'number', required: true, description: 'Availability percentage (0-100)', defaultVal: '92.5' },
      { name: 'performance', type: 'number', required: true, description: 'Performance rate percentage (0-100)', defaultVal: '88.0' },
      { name: 'quality', type: 'number', required: true, description: 'First-pass quality rate percentage (0-100)', defaultVal: '99.2' }
    ],
    sampleResponse: {
      status: 'success',
      data: {
        availabilityRate: 0.925,
        performanceRate: 0.88,
        qualityRate: 0.992,
        oeeDecimal: 0.8075,
        oeePercentage: 80.75,
        worldClassBenchmarkMet: false,
        benchmarkStandard: 'ISO 22400 / SEMI E10'
      }
    }
  },
  {
    id: 'benchmarks',
    method: 'GET',
    path: '/api/v1/benchmarks',
    title: 'Sector Performance Benchmarks',
    description: 'Retrieves verified ISO 14224 industrial quartile availability, MTBF, MTTR, and maintenance cost metrics for a designated manufacturing sector.',
    params: [
      { name: 'sector', type: 'string', required: true, description: 'Sector slug (e.g. oil-gas, power-gen, automotive, pharma-biotech, steel-metals)', defaultVal: 'oil-gas' }
    ],
    sampleResponse: {
      status: 'success',
      sector: 'Oil & Gas / Petrochemicals',
      samplePlants: 142,
      metrics: {
        availabilityPercentTop10: 98.2,
        availabilityPercentMedian: 93.8,
        downtimePercentTop10: 1.2,
        maintenanceCostPercentRavTop10: 2.1,
        mtbfHoursMedian: 1750,
        mttrHoursMedian: 11.5
      }
    }
  }
];

const ApiDocs: React.FC = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<EndpointDoc>(API_ENDPOINTS[0]);
  const [testParamValues, setTestParamValues] = useState<Record<string, string>>({
    operatingHours: '10000',
    failures: '4',
    missionTime: '1000'
  });
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [liveResponse, setLiveResponse] = useState<any>(API_ENDPOINTS[0].sampleResponse);

  const handleSelectEndpoint = (ep: EndpointDoc) => {
    setSelectedEndpoint(ep);
    const initialParams: Record<string, string> = {};
    ep.params.forEach(p => {
      initialParams[p.name] = p.defaultVal || '';
    });
    setTestParamValues(initialParams);
    setLiveResponse(ep.sampleResponse);
  };

  const handleParamChange = (name: string, val: string) => {
    setTestParamValues(prev => ({ ...prev, [name]: val }));
  };

  const handleExecuteLiveTest = () => {
    // Client-side dynamic simulation matching API calculations
    if (selectedEndpoint.id === 'mtbf') {
      const hours = parseFloat(testParamValues.operatingHours) || 10000;
      const fails = parseInt(testParamValues.failures, 10) || 1;
      const mTime = parseFloat(testParamValues.missionTime) || 1000;
      const lambda = fails / hours;
      const mtbf = hours / fails;
      const rel = Math.exp(-lambda * mTime);
      setLiveResponse({
        status: 'success',
        data: {
          operatingHours: hours,
          failures: fails,
          failureRatePerHour: parseFloat(lambda.toFixed(6)),
          failureRateFit: Math.round(lambda * 1e9),
          mtbfHours: parseFloat(mtbf.toFixed(2)),
          missionReliability: parseFloat(rel.toFixed(4)),
          governingStandard: 'IEEE 493 / MIL-HDBK-338B'
        }
      });
    } else if (selectedEndpoint.id === 'weibull') {
      const beta = parseFloat(testParamValues.beta) || 1.8;
      const eta = parseFloat(testParamValues.eta) || 6000;
      const t = parseFloat(testParamValues.time) || 3000;
      const r = Math.exp(-Math.pow(t / eta, beta));
      const f = 1 - r;
      const h = (beta / eta) * Math.pow(t / eta, beta - 1);
      setLiveResponse({
        status: 'success',
        data: {
          beta,
          eta,
          time: t,
          reliabilityRt: parseFloat(r.toFixed(4)),
          unreliabilityFt: parseFloat(f.toFixed(4)),
          hazardRateHt: parseFloat(h.toFixed(6)),
          failureRegime: beta > 1 ? 'Wear-out phase' : beta === 1 ? 'Constant random' : 'Infant mortality'
        }
      });
    } else if (selectedEndpoint.id === 'oee') {
      const a = (parseFloat(testParamValues.availability) || 90) / 100;
      const p = (parseFloat(testParamValues.performance) || 90) / 100;
      const q = (parseFloat(testParamValues.quality) || 99) / 100;
      const oee = a * p * q;
      setLiveResponse({
        status: 'success',
        data: {
          availabilityRate: a,
          performanceRate: p,
          qualityRate: q,
          oeeDecimal: parseFloat(oee.toFixed(4)),
          oeePercentage: parseFloat((oee * 100).toFixed(2)),
          worldClassBenchmarkMet: oee >= 0.85,
          benchmarkStandard: 'ISO 22400 / SEMI E10'
        }
      });
    } else {
      setLiveResponse(selectedEndpoint.sampleResponse);
    }
  };

  const queryString = new URLSearchParams(testParamValues).toString();
  const fullRequestUrl = `https://reliabilitytools.co.in${selectedEndpoint.path}?${queryString}`;

  const copySnippet = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // WebAPI + APIReference Schema per Requirement 4:
  // "indexable developer docs page with WebAPI + APIReference schema"
  const apiSchemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebAPI',
      name: 'Reliability Tools REST API',
      description: 'Programmatic REST calculation API for industrial reliability engineering, Weibull probability modeling, MTBF/MTTR computations, and sector benchmarks.',
      documentation: 'https://reliabilitytools.co.in/api/docs/',
      provider: {
        '@type': 'Organization',
        name: 'Reliability Tools',
        url: 'https://reliabilitytools.co.in'
      },
      termsOfService: 'https://reliabilitytools.co.in/legal/terms/'
    },
    {
      '@context': 'https://schema.org',
      '@type': 'APIReference',
      name: 'Reliability Engineering Calculation API Reference',
      headline: 'Reliability Tools Calculation API Endpoints',
      description: 'Technical API reference documenting public GET endpoints for MTBF, Weibull analysis, OEE estimation, and asset reliability benchmarks.',
      url: 'https://reliabilitytools.co.in/api/docs/',
      programmingLanguage: ['cURL', 'JavaScript', 'Python', 'HTTP']
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Helmet>
        <title>Developer API Documentation &amp; Reference | Reliability Tools</title>
        <meta
          name="description"
          content="Comprehensive REST API documentation for industrial reliability engineering. Programmatically query MTBF, Weibull distributions, OEE, and benchmarks."
        />
        <link rel="canonical" href="https://reliabilitytools.co.in/api/docs/" />
        <meta name="robots" content="index, follow" />
        <script type="application/ld+json">
          {JSON.stringify(apiSchemas)}
        </script>
      </Helmet>

      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-850 to-indigo-950 p-8 md:p-12 border border-slate-700/60 shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            <Code2 className="w-4 h-4" />
            Developer Platform
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Reliability Tools <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-300 to-teal-400">Calculation API</span>
          </h1>
          <p className="text-slate-300 text-base md:text-lg leading-relaxed">
            Integrate certified reliability engineering mathematics directly into your CMMS, SCADA dashboards, and automated pipelines. 
            Zero authorization tokens required for standard public query tiers.
          </p>
        </div>
      </div>

      {/* Technical Header Notice Box */}
      <div className="bg-slate-850 border border-slate-700 rounded-xl p-5 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="flex items-start gap-2.5">
          <Server className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-white block">Base URL</strong>
            <code className="text-indigo-300 font-mono">https://reliabilitytools.co.in/api/v1</code>
          </div>
        </div>
        <div className="flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-white block">Robots Directives</strong>
            <span className="text-slate-400">All JSON endpoints return <code className="bg-slate-900 px-1 py-0.5 rounded text-amber-300">X-Robots-Tag: noindex</code> header.</span>
          </div>
        </div>
        <div className="flex items-start gap-2.5">
          <Lock className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-white block">Authentication &amp; CORS</strong>
            <span className="text-slate-400">Open Public Access with wildcard <code className="text-cyan-300">Access-Control-Allow-Origin: *</code>.</span>
          </div>
        </div>
      </div>

      {/* Endpoint Selector Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Available Endpoints:</span>
          {API_ENDPOINTS.map((ep) => (
            <button
              key={ep.id}
              onClick={() => handleSelectEndpoint(ep)}
              className={`w-full text-left p-3.5 rounded-xl border text-xs font-mono transition-all flex items-center justify-between ${
                selectedEndpoint.id === ep.id
                  ? 'bg-indigo-600/20 border-indigo-500/60 text-white shadow-md'
                  : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 rounded font-bold text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {ep.method}
                </span>
                <span className="truncate">{ep.path}</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 opacity-50" />
            </button>
          ))}
        </div>

        {/* Selected Endpoint Documentation & Interactive Console */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 md:p-8 space-y-6">
            <div className="border-b border-slate-700/60 pb-4 space-y-2">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded-md text-xs font-bold font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {selectedEndpoint.method}
                </span>
                <h2 className="text-xl font-bold text-white font-mono">{selectedEndpoint.path}</h2>
              </div>
              <p className="text-sm text-slate-300">{selectedEndpoint.description}</p>
            </div>

            {/* Query Parameters Specification */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Query Parameters</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-700 text-slate-400 uppercase">
                      <th className="py-2 px-3">Parameter</th>
                      <th className="py-2 px-3">Type</th>
                      <th className="py-2 px-3">Status</th>
                      <th className="py-2 px-3">Description</th>
                      <th className="py-2 px-3">Interactive Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50 text-slate-300">
                    {selectedEndpoint.params.map((p) => (
                      <tr key={p.name}>
                        <td className="py-2.5 px-3 font-mono font-bold text-indigo-300">{p.name}</td>
                        <td className="py-2.5 px-3 font-mono text-slate-400">{p.type}</td>
                        <td className="py-2.5 px-3">
                          {p.required ? (
                            <span className="text-rose-400 font-semibold">required</span>
                          ) : (
                            <span className="text-slate-500">optional</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-slate-400">{p.description}</td>
                        <td className="py-2.5 px-3">
                          <input
                            type="text"
                            value={testParamValues[p.name] || ''}
                            onChange={(e) => handleParamChange(p.name, e.target.value)}
                            className="w-28 px-2 py-1 rounded bg-slate-900 border border-slate-700 font-mono text-xs text-white focus:outline-none focus:border-indigo-500"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Interactive Request Tester */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5" /> Full Request URL
                </h3>
                <button
                  onClick={handleExecuteLiveTest}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1 transition-all"
                >
                  <Play className="w-3 h-3 fill-current" /> Execute Test Request
                </button>
              </div>
              <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 font-mono text-xs text-cyan-300 break-all flex items-center justify-between gap-2">
                <span>{fullRequestUrl}</span>
                <button
                  onClick={() => copySnippet(fullRequestUrl)}
                  className="text-slate-400 hover:text-white p-1 shrink-0"
                  title="Copy Request URL"
                >
                  {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Live Response Preview */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  HTTP 200 OK — JSON Response Body
                </span>
                <span className="text-[11px] font-mono text-slate-500">
                  Headers: X-Robots-Tag: noindex
                </span>
              </div>
              <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-emerald-400 font-mono text-xs overflow-x-auto max-h-64 custom-scrollbar">
                {JSON.stringify(liveResponse, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiDocs;
