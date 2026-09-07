'use client';

import { useState } from 'react';

export default function SaathCalculator() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleCalculate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    const formData = new FormData(e.currentTarget);
    
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      const response = await fetch(`${backendUrl}/api/v1/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_type: formData.get('eventType'),
          start_date: formData.get('startDate'),
          end_date: formData.get('endDate'),
          config: {}
        }),
      });
      
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError('Failed to connect to the planetary engine. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto space-y-8">
        
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Vijayshwar Saath Calculator</h1>
          <p className="mt-3 text-lg text-slate-600">Determine traditional auspicious dates for Kashmiri ceremonies.</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <form onSubmit={handleCalculate} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700">Ceremony Type</label>
              <select name="eventType" className="mt-1 block w-full rounded-md border-slate-300 py-3 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm bg-slate-50 border">
                <option value="khandar">Khandar (Marriage)</option>
                <option value="mekhal">Mekhal (Yagneopavit)</option>
                <option value="kahnethar">Kahnethar (Name-keeping)</option>
              </select>
            </div>

            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700">Search Start Date</label>
                <input required type="date" name="startDate" className="mt-1 block w-full rounded-md border-slate-300 py-3 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-slate-50 border" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Search End Date</label>
                <input required type="date" name="endDate" className="mt-1 block w-full rounded-md border-slate-300 py-3 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-slate-50 border" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 transition-colors">
              {loading ? 'Consulting Ephemeris...' : 'Find Auspicious Dates'}
            </button>
          </form>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-xl text-center border border-red-100">
            {error}
          </div>
        )}

        {result && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Calculated Results</h2>
            {result.auspicious_days.length === 0 ? (
              <p className="text-slate-500 bg-white p-6 rounded-xl border border-slate-100 shadow-sm text-center">No auspicious dates found in this window.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {result.auspicious_days.map((day: any, index: number) => (
                  <div key={index} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <p className="text-lg font-semibold text-indigo-700">{new Date(day.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-slate-600"><span className="font-medium text-slate-900">Tithi:</span> {day.tithi}</p>
                      <p className="text-sm text-slate-600"><span className="font-medium text-slate-900">Nakshatra:</span> {day.nakshatra}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}