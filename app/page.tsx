'use client';

import { useState } from 'react';

export default function SaathCalculator() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleCalculate = async () => {
    setLoading(true);
    try {
      // This pulls the Render URL from your Vercel environment variables
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      
      const response = await fetch(`${backendUrl}/api/v1/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_type: 'khandar',
          start_date: '2026-10-01', // Example dates
          end_date: '2026-10-31',
          config: {
             allow_purnima: false,
             strict_chaturmas: true
          }
        }),
      });
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error fetching Saath:', error);
      setResult({ error: 'Failed to connect to the backend engine.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 font-sans bg-gray-50 text-gray-900">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow">
        <h1 className="text-3xl font-bold mb-6 text-blue-900">Kashmiri Saath Calculator</h1>
        <p className="mb-6 text-gray-600">Determine auspicious dates for Khandar, Mekhal, and Kahnethar.</p>
        
        <button 
          onClick={handleCalculate}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition disabled:bg-blue-300"
          disabled={loading}
        >
          {loading ? 'Calculating Planetary Positions...' : 'Test Backend Connection'}
        </button>

        {result && (
          <div className="mt-8 p-4 bg-gray-100 rounded border border-gray-200">
            <h2 className="text-xl font-semibold mb-2">Engine Response:</h2>
            <pre className="overflow-x-auto text-sm">{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}