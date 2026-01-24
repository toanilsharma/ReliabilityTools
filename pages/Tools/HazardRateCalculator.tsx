
import React, { useState, useMemo } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Activity, Zap, TrendingUp, Info, BookOpen } from 'lucide-react';
import HelpTooltip from '../../components/HelpTooltip';
import ToolContentLayout from '../../components/ToolContentLayout';

const HazardRateCalculator: React.FC = () => {
    const [beta, setBeta] = useState<string>('1.5');
    const [eta, setEta] = useState<string>('1000');
    const [timeHorizon, setTimeHorizon] = useState<string>('2000');

    const data = useMemo(() => {
        const b = parseFloat(beta) || 1.5;
        const e = parseFloat(eta) || 1000;
        const maxT = parseFloat(timeHorizon) || 2000;
        const points = [];

        // Generate 50 points
        for (let i = 0; i <= 50; i++) {
            const t = (i / 50) * maxT;
            // h(t) = (β/η) * (t/η)^(β-1)
            let h = 0;
            if (t > 0) {
                h = (b / e) * Math.pow((t / e), b - 1);
            }
            points.push({ t, h });
        }
        return points;
    }, [beta, eta, timeHorizon]);

    const ToolComponent = (
        <div className="grid lg:grid-cols-3 gap-8">
            {/* Input */}
            <div className="lg:col-span-1 space-y-6">
                <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-cyan-600" /> Weibull Parameters
                    </h3>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                            Shape (&beta;)
                            <HelpTooltip text="Slope of the Weibull plot. <1: Infant Mortality. 1: Random. >1: Wear Out." />
                        </label>
                        <input type="number" step="0.1" value={beta} onChange={e => setBeta(e.target.value)} className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-3 outline-none focus:ring-2 focus:ring-cyan-500 text-slate-900 dark:text-white" />
                        <div className="mt-2 text-xs text-slate-500 font-mono bg-slate-100 dark:bg-slate-800 p-2 rounded">
                            {parseFloat(beta) < 1 ? "⚠️ Early Life Failures (Decreasing Rate)" : parseFloat(beta) === 1 ? "ℹ️ Constant Failure Rate (Random)" : "⚠️ Wear Out (Increasing Rate)"}
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                            Scale (&eta;)
                            <HelpTooltip text="Characteristic Life. Time at which 63.2% of units will fail." />
                        </label>
                        <input type="number" value={eta} onChange={e => setEta(e.target.value)} className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-3 outline-none focus:ring-2 focus:ring-cyan-500 text-slate-900 dark:text-white" />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                            Time Horizon (Hours)
                            <HelpTooltip text="Max X-axis value for the plot." />
                        </label>
                        <input type="number" value={timeHorizon} onChange={e => setTimeHorizon(e.target.value)} className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-3 outline-none focus:ring-2 focus:ring-cyan-500 text-slate-900 dark:text-white" />
                    </div>
                </div>
            </div>

            {/* Chart */}
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl h-[450px] flex flex-col">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-cyan-600" /> Hazard Rate Function h(t)
                    </h3>
                    <div className="flex-grow">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis dataKey="t" type="number" stroke="#94a3b8" label={{ value: 'Time (t)', position: 'bottom', offset: 0, fill: '#94a3b8' }} tickFormatter={(v) => v.toFixed(0)} />
                                <YAxis stroke="#94a3b8" label={{ value: 'Failure Rate h(t)', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
                                <Tooltip
                                    formatter={(val: number) => val.toExponential(4)}
                                    labelFormatter={(label) => `Time: ${Math.round(Number(label))}`}
                                    contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '8px', border: 'none' }}
                                />
                                <Line type="monotone" dataKey="h" stroke="#06b6d4" strokeWidth={3} dot={false} name="Hazard Rate" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );

    const Content = (
        <div>
            <h2 id="overview">What is Hazard Rate?</h2>
            <p>
                The <strong>Hazard Rate h(t)</strong> (or instantaneous failure rate) describes the probability that an item will fail in the next instant, given that it has survived up to time <em>t</em>.
            </p>
            <p>
                It is the mathematical engine behind the famous "Bathtub Curve".
            </p>

            <h2 id="beta">The Shape Parameter ($\beta$)</h2>
            <ul>
                <li><strong>$\beta$ &lt; 1 (Burn-In):</strong> The hazard rate <em>decreases</em> over time. Weak parts fail early; the survivors are strong.</li>
                <li><strong>$\beta$ = 1 (Random):</strong> The hazard rate is <em>constant</em> (Flat line). Failures are caused by random external events, not age. This is the domain of Electronics (Exponential distribution).</li>
                <li><strong>$\beta$ &gt; 1 (Wear-Out):</strong> The hazard rate <em>increases</em> over time. The older it gets, the more likely it is to fail. This is the domain of Mechanical parts.</li>
            </ul>
        </div>
    );

    const faqs = [
        {
            question: "Is Hazard Rate the same as Failure Rate?",
            answer: "Often used interchangeably, but Hazard Rate h(t) is instantaneous (functions of time), whereas 'Failure Rate' (λ) is often used as a constant average (1/MTBF) for exponential distributions."
        },
        {
            question: "Why does the rate go to infinity?",
            answer: "For $\beta > 1$, as time passes, it becomes <em>certain</em> to fail. If you live forever, your probability of dying becomes infinite. This reflects the reality of wear-out."
        }
    ];

    return (
        <ToolContentLayout
            title="Hazard Rate Calculator"
            description="Visualize the instantaneous failure rate h(t) of your assets. Understand Infant Mortality, Random Failures, and Wear Out patterns using Weibull parameters."
            toolComponent={ToolComponent}
            content={Content}
            faqs={faqs}
            schema={{
                "@context": "https://schema.org",
                "@type": "SoftwareApplication",
                "name": "Hazard Rate Calculator",
                "applicationCategory": "UtilitiesApplication"
            }}
        />
    );
};

export default HazardRateCalculator;
