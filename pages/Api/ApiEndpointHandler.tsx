import React, { useEffect, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

/**
 * Client-side JSON responder for direct /api/v1/* browser invocations.
 * Sends explicit client-side noindex directive and outputs pure JSON.
 */
const ApiEndpointHandler: React.FC = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [responseJson, setResponseJson] = useState<any>({ status: 'loading' });

  useEffect(() => {
    const pathname = location.pathname;

    if (pathname.includes('/mtbf')) {
      const hours = parseFloat(searchParams.get('operatingHours') || '10000');
      const failures = parseInt(searchParams.get('failures') || '4', 10);
      const lambda = failures / hours;
      const mtbf = hours / failures;
      setResponseJson({
        status: 'success',
        endpoint: '/api/v1/mtbf',
        operatingHours: hours,
        failures: failures,
        failureRatePerHour: lambda,
        failureRateFit: Math.round(lambda * 1e9),
        mtbfHours: mtbf,
        governingStandard: 'IEEE 493 / MIL-HDBK-338B'
      });
    } else if (pathname.includes('/weibull')) {
      const beta = parseFloat(searchParams.get('beta') || '1.8');
      const eta = parseFloat(searchParams.get('eta') || '6000');
      const time = parseFloat(searchParams.get('time') || '3000');
      const r = Math.exp(-Math.pow(time / eta, beta));
      setResponseJson({
        status: 'success',
        endpoint: '/api/v1/weibull',
        beta,
        eta,
        time,
        reliabilityRt: r,
        unreliabilityFt: 1 - r,
        hazardRateHt: (beta / eta) * Math.pow(time / eta, beta - 1)
      });
    } else if (pathname.includes('/oee')) {
      const a = (parseFloat(searchParams.get('availability') || '90')) / 100;
      const p = (parseFloat(searchParams.get('performance') || '90')) / 100;
      const q = (parseFloat(searchParams.get('quality') || '99')) / 100;
      setResponseJson({
        status: 'success',
        endpoint: '/api/v1/oee',
        availabilityRate: a,
        performanceRate: p,
        qualityRate: q,
        oeePercentage: +(a * p * q * 100).toFixed(2),
        standard: 'ISO 22400'
      });
    } else {
      setResponseJson({
        status: 'success',
        endpoint: pathname,
        message: 'Reliability Tools REST API endpoint active. See /api/docs/ for complete reference.',
        documentation: 'https://reliabilitytools.co.in/api/docs/'
      });
    }
  }, [location.pathname, searchParams]);

  return (
    <div className="min-h-screen bg-slate-950 p-6 font-mono text-emerald-400 text-xs">
      <Helmet>
        <title>API Response (noindex) | Reliability Tools</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <pre>{JSON.stringify(responseJson, null, 2)}</pre>
    </div>
  );
};

export default ApiEndpointHandler;
