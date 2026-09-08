'use client';

import { useState } from 'react';

interface AuspiciousDay {
  date: string;
  tithi: string;
  nakshatra: string;
  is_auspicious: boolean;
  timing?: string;
}

interface EmptyMonth {
  month: string;
  label: string;
  reason: string;
}

interface CalculationResponse {
  event: string;
  range: string;
  auspicious_days: AuspiciousDay[];
  empty_months?: EmptyMonth[];
}

export default function SaathCalculator() {
  const [loading, setLoading] = useState(false);
  const [isWaking, setIsWaking] = useState(false);
  const [result, setResult] = useState<CalculationResponse | null>(null);
  const [error, setError] = useState('');
  
  // Calculate today's date for the default input value
  const todayObj = new Date();
  const defaultStart = todayObj.toISOString().split('T')[0];
  
  // Calculate exactly 3 years ago for the minimum allowed date
  const pastObj = new Date(todayObj);
  pastObj.setFullYear(todayObj.getFullYear() - 3);
  const minAllowedDate = pastObj.toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState('');
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  const eventMetadata: Record<string, { title: string; subtitle: string; icon: string; description: string }> = {
    khandar: {
      title: 'Khandar (Marriage)',
      subtitle: 'Vivah Muhurat aligned with celestial alignment',
      icon: '❀',
      description: 'In the Kashmiri Pandit tradition, Khandar (marriage) is a profound spiritual union viewed as the merging of Shiva and Shakti. The rituals begin with the Devgon (purification and invocation of deities), followed by the Lagan, performed late at night around a sacred fire. A unique and beautiful hallmark of a Kashmiri wedding is the Posh Puza (flower worship), where the bride and groom are seated under a red shawl and showered with flowers by family members, honoring the divine presence within them.'
    },
    mekhal: {
      title: 'Mekhal (Yagneopavit)',
      subtitle: 'Sacred Thread ceremony during Uttarayana',
      icon: '◈',
      description: 'Mekhal, or Yagneopavit, is the sacred thread ceremony marking a young boy\'s initiation into spiritual education and the Brahmacharya stage of life. Traditionally held during the auspicious Uttarayana period, the ceremony involves the boy wearing a sanctified thread consisting of three strands representing the holy trinity. Key rituals include the Devgon, the whispered impartation of the Gayatri Mantra by the guru or father, and a symbolic Bhiksha (alms-begging) where the initiate asks for sustenance from relatives, signifying humility.'
    },
    kahnethar: {
      title: 'Kahnethar (Purification & Namkaran)',
      subtitle: 'Name-keeping and purification Muhurat',
      icon: '✺',
      description: 'Kahnethar is the traditional naming and purification ceremony, typically observed on the eleventh day after a child\'s birth. It marks the end of the initial period of ritual impurity (Sutak) for the family. A priest conducts a sacred fire ritual (Homa) to purify the home and invoke divine blessings for the newborn\'s health and longevity. During this ceremony, the child is formally given their name, elders bestow their blessings, and a protective thread is often tied to ward off negative energies.'
    }
  };

  const handleCalculate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setIsAboutOpen(false);
    setIsWaking(false);

    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start > end) {
      setError('Invalid Date Range: The Search Start Date cannot be after the Search End Date.');
      return;
    }

    setLoading(true);
    const wakeTimer = window.setTimeout(() => setIsWaking(true), 3500);
    const formData = new FormData(e.currentTarget);
    
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      const response = await fetch(`${backendUrl}/api/v1/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_type: formData.get('eventType'),
          start_date: startDate,
          end_date: endDate,
          config: {}
        }),
      });
      
      if (!response.ok) throw new Error('Network response was not ok');
      const data: CalculationResponse = await response.json();
      setResult(data);
    } catch {
      setError('The Digital Pandit could not be reached. Please check your connection and try again in a moment.');
    } finally {
      window.clearTimeout(wakeTimer);
      setIsWaking(false);
      setLoading(false);
    }
  };

  const formatDisplayDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00');
    return {
      weekday: d.toLocaleDateString('en-US', { weekday: 'long' }),
      dayMonth: d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
      year: d.toLocaleDateString('en-US', { year: 'numeric' })
    };
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-slate-800 selection:bg-amber-200 selection:text-amber-900 font-sans relative overflow-hidden">
      <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-amber-400/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[30%] right-[-10%] w-[600px] h-[600px] bg-rose-400/5 rounded-full blur-[140px] pointer-events-none" />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 relative z-10 space-y-12">
        
        <header className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-200 bg-amber-50 text-amber-700 text-xs font-bold tracking-widest uppercase shadow-sm">
            <span className="text-sm text-amber-600">ॐ</span> Vedic Siddhanta Engine
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold tracking-tight text-slate-900">
            Kashmiri Saath Calculator
          </h1>
          <p className="max-w-xl mx-auto text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
            Dynamic Udaya-Tithi & Nakshatra calculations calibrated to Srinagar sunrise coordinates for sacred traditional rituals.
          </p>
        </header>

        <section className="bg-white border border-amber-100 rounded-3xl p-6 sm:p-10 shadow-xl shadow-amber-900/5 relative">
          <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-amber-300 via-rose-400 to-amber-300 rounded-t-3xl" />

          <form onSubmit={handleCalculate} className="space-y-8 mt-2">
            <div>
              <label className="block text-xs uppercase tracking-widest font-bold text-slate-500 mb-2">
                Select Ceremony
              </label>
              <div className="relative">
                <select 
                  name="eventType" 
                  defaultValue="kahnethar"
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 font-semibold py-4 px-5 pr-10 text-base focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all shadow-sm"
                >
                  <option value="khandar" disabled>Khandar (Marriage Ceremony) — Coming soon</option>
                  <option value="mekhal" disabled>Mekhal (Yagneopavit Ceremony) — Coming soon</option>
                  <option value="kahnethar">Kahnethar (Name-keeping & Purification)</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 text-slate-400">
                  ▼
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-widest font-bold text-slate-500 mb-2">
                  Window Start Date
                </label>
                <input 
                  required 
                  type="date" 
                  value={startDate}
                  min={minAllowedDate} // Now permits dates up to 3 years in the past
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 font-semibold py-3.5 px-5 text-base focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest font-bold text-slate-500 mb-2">
                  Window End Date
                </label>
                <input 
                  required 
                  type="date" 
                  value={endDate}
                  min={startDate} 
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 font-semibold py-3.5 px-5 text-base focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all shadow-sm"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full relative group overflow-hidden rounded-xl font-bold shadow-lg shadow-rose-900/10 transition-all duration-300 hover:shadow-rose-900/20 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:pointer-events-none"
            >
              <div className="relative px-6 py-4 bg-gradient-to-r from-amber-600 via-rose-600 to-amber-600 text-white flex items-center justify-center gap-3 tracking-wide">
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Consulting Ephemeris...</span>
                  </>
                ) : (
                  <>
                    <span>Find Auspicious Saath</span>
                    <span className="text-xl">→</span>
                  </>
                )}
              </div>
            </button>
          </form>

          {isWaking && (
            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-center shadow-sm">
              <p className="text-sm leading-relaxed text-amber-800">
                Since we don&apos;t charge Dakshina for this digital Jantri, our servers like to take naps to save energy.
                Our digital pandit is currently waking up, stretching, and finding his glasses. Please give him 15–20 seconds to do the math!
              </p>
            </div>
          )}
        </section>

        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm text-center font-medium shadow-sm">
            {error}
          </div>
        )}

        {result && (
          <section className="space-y-6 pt-6">
            
            <div className="bg-white border border-amber-100 rounded-2xl shadow-sm overflow-hidden transition-all duration-300">
              <button 
                onClick={() => setIsAboutOpen(!isAboutOpen)}
                className="w-full px-6 py-4 flex items-center justify-between bg-slate-50 hover:bg-amber-50/50 transition-colors"
              >
                <span className="font-semibold text-slate-800 flex items-center gap-2">
                  <span className="text-rose-600 text-lg">{eventMetadata[result.event]?.icon}</span>
                  About {eventMetadata[result.event]?.title.split(' ')[0]}
                </span>
                <span className={`text-slate-400 transition-transform duration-300 ${isAboutOpen ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>
              
              <div className={`transition-all duration-300 ease-in-out ${isAboutOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="p-6 pt-2 text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                  {eventMetadata[result.event]?.description}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-5 gap-3 mt-8">
              <div>
                <h2 className="text-2xl font-serif font-bold text-slate-900 flex items-center gap-2">
                  <span className="text-rose-600">{eventMetadata[result.event]?.icon || '❀'}</span>
                  Auspicious Dates Found
                </h2>
                <p className="text-sm text-slate-500 mt-1 font-medium">
                  Evaluated Window: <span className="text-slate-800">{result.range}</span>
                </p>
              </div>
              <span className="self-start sm:self-auto inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold bg-amber-50 border border-amber-200 text-amber-700 uppercase tracking-wider">
                {result.auspicious_days.length} Valid Dates
              </span>
            </div>

            {result.auspicious_days.length === 0 ? (
              <div className="text-center py-12 bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                <p className="text-slate-600 font-medium">
                  No auspicious dates are listed for this ceremony during the selected window.
                </p>
                {result.empty_months?.map((month) => (
                  <p key={month.month} className="text-slate-500 text-sm mt-2">
                    {month.label}: {month.reason}
                  </p>
                ))}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {result.auspicious_days.map((day, idx) => {
                  const d = formatDisplayDate(day.date);
                  return (
                    <div 
                      key={idx} 
                      className="group bg-white border border-amber-100 hover:border-amber-300 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-amber-900/5 hover:-translate-y-1 relative overflow-hidden"
                    >
                      <div className="absolute -right-6 -top-6 text-amber-200 opacity-40 text-9xl pointer-events-none transform rotate-12">
                        {eventMetadata[result.event]?.icon || '❀'}
                      </div>

                      <div className="flex items-start justify-between relative z-10">
                        <div>
                          <span className="text-xs font-bold uppercase tracking-widest text-amber-600">
                            {d.weekday}
                          </span>
                          <div className="flex items-baseline gap-2 mt-1">
                            <span className="text-3xl font-serif font-bold text-slate-900 tracking-tight">
                              {d.dayMonth}
                            </span>
                            <span className="text-base text-slate-500 font-medium">
                              {d.year}
                            </span>
                          </div>
                        </div>
                        <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-rose-100 text-rose-700 border border-rose-300 text-lg font-extrabold shadow-md shadow-rose-200/50">
                          卐
                        </span>
                      </div>

                      <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-2 gap-3 text-sm relative z-10">
                        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                          <span className="text-slate-500 text-xs font-bold uppercase tracking-wider block mb-1">Sunrise Tithi</span>
                          <span className="font-semibold text-slate-800 block truncate">
                            {day.tithi}
                          </span>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                          <span className="text-slate-500 text-xs font-bold uppercase tracking-wider block mb-1">Active Nakshatra</span>
                          <span className="font-semibold text-slate-800 block truncate">
                            {day.nakshatra}
                          </span>
                        </div>
                      </div>
                      {day.timing && (
                        <div className="mt-3 rounded-xl bg-amber-50 p-3 border border-amber-100 text-sm relative z-10">
                          <span className="text-amber-700 text-xs font-bold uppercase tracking-wider block mb-1">Timing</span>
                          <span className="font-semibold text-amber-900">{day.timing}</span>
                        </div>
                      )}
                    </div>
                  );
                  })}
                </div>
                {result.empty_months && result.empty_months.length > 0 && (
                  <div className="space-y-3">
                    {result.empty_months.map((month) => (
                      <div key={month.month} className="rounded-2xl border border-amber-200 bg-amber-50/70 px-5 py-4 text-sm text-amber-900">
                        <span className="font-bold">{month.label}:</span> {month.reason}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </section>
        )}

      </main>
    </div>
  );
}
