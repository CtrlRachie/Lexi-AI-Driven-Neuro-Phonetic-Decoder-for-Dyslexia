
import React from 'react';
import { UserStats, PhoneticError } from '../types';

interface ParentReportProps {
  stats: UserStats;
}

const ParentReport: React.FC<ParentReportProps> = ({ stats }) => {
  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="bg-white rounded-3xl p-8 shadow-xl border-4 border-indigo-50">
        <h2 className="text-3xl font-bold text-indigo-900 mb-2">Weekly Progress Report 📊</h2>
        <p className="text-gray-500">Consolidated reading analytics for this week.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-indigo-50 p-6 rounded-2xl">
            <p className="text-indigo-600 text-sm font-bold uppercase tracking-wider">Average Accuracy</p>
            <p className="text-4xl font-bold text-indigo-900">{stats.accuracy}%</p>
            <div className="mt-2 text-green-600 text-sm font-bold">↑ 5% from last week</div>
          </div>
          <div className="bg-purple-50 p-6 rounded-2xl">
            <p className="text-purple-600 text-sm font-bold uppercase tracking-wider">Words Mastered</p>
            <p className="text-4xl font-bold text-purple-900">{stats.wordsRead}</p>
            <div className="mt-2 text-purple-600 text-sm font-bold">New level: {stats.difficulty}</div>
          </div>
          <div className="bg-green-50 p-6 rounded-2xl">
            <p className="text-green-600 text-sm font-bold uppercase tracking-wider">Stars Earned</p>
            <p className="text-4xl font-bold text-green-900">{stats.stars}</p>
            <div className="mt-2 text-green-600 text-sm font-bold">Daily goal achieved!</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Phonetic Error Analysis */}
        <div className="bg-white rounded-3xl p-8 shadow-md">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span>🔍</span> Phonetic Error Analysis
          </h3>
          <div className="space-y-4">
            {stats.commonErrors.map((error, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-xl font-bold text-red-600 border border-red-100">
                  {error.phoneme}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="font-bold text-gray-700">Tricky phoneme</span>
                    <span className="text-sm text-gray-400">{error.count} occurrences</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-red-400 h-full rounded-full" 
                      style={{ width: `${Math.min(100, (error.count / 10) * 100)}%` }}
                    ></div>
                  </div>
                  <div className="mt-1 flex gap-2">
                    {error.examples.map((ex, i) => (
                      <span key={i} className="text-[10px] bg-gray-50 px-2 py-0.5 rounded border border-gray-100">{ex}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Engagement History */}
        <div className="bg-white rounded-3xl p-8 shadow-md">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span>📈</span> Engagement Over Time
          </h3>
          <div className="flex items-end justify-between h-48 gap-2 pt-4">
            {stats.weeklyHistory.map((day, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                <div className="relative group w-full flex flex-col items-center">
                   <div className="absolute -top-8 bg-indigo-600 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition">
                    {day.stars} stars
                  </div>
                  <div 
                    className="w-full bg-indigo-100 rounded-t-lg group-hover:bg-indigo-300 transition-all duration-500"
                    style={{ height: `${(day.stars / 20) * 150}px` }}
                  ></div>
                </div>
                <span className="text-[10px] font-bold text-gray-400 uppercase">{day.day}</span>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-gray-500 leading-relaxed">
            Engagement remains high! Visual mnemonics game is currently the most popular activity for your child.
          </p>
        </div>
      </div>

      <div className="bg-indigo-900 rounded-3xl p-8 text-white shadow-lg">
        <h3 className="text-xl font-bold mb-4">Lexi's Recommendation 🦇</h3>
        <p className="text-indigo-100 leading-relaxed">
          Your child is excelling at decoding 'b' and 'd', but shows signs of hesitation with vowel blends like 'ou' and 'ow'. 
          Lexi has adjusted the current difficulty to <strong>Sprout</strong> to introduce more blended sounds gradually.
        </p>
        <button className="mt-6 border-2 border-indigo-400 px-6 py-2 rounded-xl font-bold hover:bg-white hover:text-indigo-900 transition">
          Print Full PDF Report
        </button>
      </div>
    </div>
  );
};

export default ParentReport;
