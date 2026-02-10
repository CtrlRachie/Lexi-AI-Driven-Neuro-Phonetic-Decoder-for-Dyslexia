
import React, { useState, useEffect } from 'react';
import { AppView, UserStats, MnemonicCard, TranscriptionItem, DifficultyLevel } from './types';
import { DIFFICULTY_CONFIG } from './constants';
import LiveTutor from './components/LiveTutor';
import VisionReader from './components/VisionReader';
import MnemonicGenerator from './components/MnemonicGenerator';
import ParentReport from './components/ParentReport';
import Mascot from './components/Mascot';

const SAMPLE_STORY = "The little bat flew over the moon. It was a dark and sparkly night. Lexi loved to find tasty snacks in the trees.";

const INITIAL_STATS: UserStats = {
  stars: 12,
  level: 3,
  wordsRead: 145,
  accuracy: 88,
  difficulty: 'Sprout',
  commonErrors: [
    { phoneme: 'b', count: 8, examples: ['bat', 'blue', 'ball'] },
    { phoneme: 'd', count: 5, examples: ['dark', 'dream', 'drum'] }
  ],
  weeklyHistory: [
    { day: 'Mon', stars: 12, accuracy: 85 },
    { day: 'Tue', stars: 18, accuracy: 88 },
    { day: 'Wed', stars: 15, accuracy: 82 },
    { day: 'Thu', stars: 22, accuracy: 91 },
    { day: 'Fri', stars: 19, accuracy: 87 },
    { day: 'Sat', stars: 5, accuracy: 90 },
    { day: 'Sun', stars: 0, accuracy: 0 }
  ]
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [stats, setStats] = useState<UserStats>(INITIAL_STATS);
  const [readingText, setReadingText] = useState(SAMPLE_STORY);
  const [mnemonics, setMnemonics] = useState<MnemonicCard[]>([]);
  const [transcriptions, setTranscriptions] = useState<TranscriptionItem[]>([]);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [showHelp, setShowHelp] = useState(true);

  const handleDifficultyChange = (newLevel: DifficultyLevel) => {
    setStats(prev => ({ ...prev, difficulty: newLevel }));
  };

  const handleTextExtracted = (text: string) => {
    setReadingText(text);
    setCurrentView(AppView.READING);
  };

  const addMnemonic = (word: string, url: string, explanation: string) => {
    setMnemonics(prev => [{ word, imageUrl: url, explanation }, ...prev]);
  };

  const handleStarEarned = () => {
    setStats(prev => ({ ...prev, stars: prev.stars + 1 }));
  };

  const toggleParentView = () => {
    setCurrentView(prev => prev === AppView.PARENT_REPORT ? AppView.DASHBOARD : AppView.PARENT_REPORT);
  };

  return (
    <div className="min-h-screen pb-24 text-gray-900 transition-colors duration-500">
      {/* HEADER (Bright Pink) */}
      <header className="bg-[#FF69B4] px-6 py-6 flex items-center justify-between shadow-xl border-b-8 border-pink-600">
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => setCurrentView(AppView.DASHBOARD)}>
          <div className="bg-white p-2 rounded-full border-4 border-pink-300">
            <span className="text-4xl">🦇</span>
          </div>
          <div>
            <h1 className="text-4xl font-black text-white italic tracking-tighter drop-shadow-md">LEXI!</h1>
            <p className="text-pink-100 text-sm font-bold uppercase tracking-widest">Reading Adventure</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowHelp(true)}
            className="bg-[#FF8C00] text-white p-3 rounded-2xl font-black border-b-4 border-orange-700 active:translate-y-1 active:border-b-0 transition-all"
          >
            HELP! ❓
          </button>
          <button 
            onClick={toggleParentView}
            className={`px-4 py-2 rounded-2xl font-black border-b-4 transition ${currentView === AppView.PARENT_REPORT ? 'bg-white text-indigo-900 border-indigo-200' : 'bg-indigo-900 text-white border-indigo-950'}`}
          >
            {currentView === AppView.PARENT_REPORT ? 'Exit 🏠' : 'Parents 👨‍👩‍👧'}
          </button>
        </div>
      </header>

      {/* HELP SECTION (Vibrant Orange Overlay) */}
      {showHelp && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-[#FF8C00] max-w-lg w-full rounded-[3rem] p-10 border-8 border-orange-300 shadow-2xl relative animate-bounce-in">
            <button onClick={() => setShowHelp(false)} className="absolute top-6 right-8 text-white text-3xl font-black">X</button>
            <div className="flex flex-col items-center text-center">
              <div className="text-8xl mb-4">🦇</div>
              <h2 className="text-4xl font-black text-white mb-4">Hi, I'm Lexi!</h2>
              <p className="text-orange-100 text-xl font-bold mb-6">
                I listen to you read! If you get stuck, I'll create a magic bat-game to help you! 
                <br /><br />
                You can choose your difficulty in the <span className="text-yellow-300">Yellow Box</span>.
              </p>
              <button 
                onClick={() => setShowHelp(false)}
                className="bg-white text-[#FF8C00] px-12 py-4 rounded-full text-2xl font-black shadow-xl hover:scale-105 transition"
              >
                Let's Play!
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-5xl mx-auto p-6 mt-4">
        {currentView === AppView.PARENT_REPORT ? (
          <ParentReport stats={stats} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* LEFT COLUMN: DASHBOARD & CONTROLS */}
            <div className="lg:col-span-8 space-y-8">
              {currentView === AppView.DASHBOARD && (
                <div className="bg-[#39FF14] p-10 rounded-[3rem] border-8 border-green-600 shadow-2xl relative overflow-hidden group">
                  <div className="relative z-10">
                    <h2 className="text-6xl font-black text-green-900 mb-2 leading-none">GO READ!</h2>
                    <p className="text-green-800 text-xl font-bold mb-8">Lexi's world is waiting for you!</p>
                    <div className="flex flex-wrap gap-4">
                      <button 
                        onClick={() => setCurrentView(AppView.READING)}
                        className="bg-white text-green-600 px-10 py-5 rounded-3xl font-black text-2xl shadow-xl hover:scale-105 transition active:scale-95"
                      >
                        📖 START NOW
                      </button>
                      <button 
                        onClick={() => setCurrentView(AppView.VISION)}
                        className="bg-green-700 text-white px-8 py-5 rounded-3xl font-black text-xl shadow-xl hover:bg-green-800 transition"
                      >
                        📸 SCAN BOOK
                      </button>
                    </div>
                  </div>
                  <div className="absolute -top-10 -right-10 opacity-10 group-hover:opacity-30 transition-opacity">
                    <Mascot status="happy" size="lg" />
                  </div>
                </div>
              )}

              {/* PRACTICE ZONE (Neon Green) */}
              {currentView === AppView.READING && (
                <div className="space-y-6">
                  <div className="bg-[#39FF14] p-10 rounded-[3rem] border-8 border-green-600 shadow-2xl min-h-[400px] flex flex-col">
                    <div className="flex justify-between mb-8">
                       <button onClick={() => setCurrentView(AppView.DASHBOARD)} className="text-green-900 font-black text-xl flex items-center gap-2">
                         <span>⬅️</span> GO BACK
                       </button>
                       <div className="flex gap-4">
                        <button 
                            onClick={() => setIsFocusMode(!isFocusMode)}
                            className={`px-6 py-2 rounded-2xl font-black transition-all ${isFocusMode ? 'bg-green-900 text-white scale-110 shadow-glow' : 'bg-green-200 text-green-800'}`}
                          >
                            🔦 FOCUS!
                          </button>
                       </div>
                    </div>

                    <div className={`dyslexia-font text-4xl font-bold text-green-950 p-6 rounded-2xl transition-all duration-700 flex-1 ${isFocusMode ? 'bg-black/80 text-white text-center flex items-center justify-center leading-relaxed' : ''}`}>
                      {isFocusMode ? (
                        <div className="neon-glow animate-pulse">
                          {readingText.split(' ')[0]}...
                        </div>
                      ) : readingText}
                    </div>

                    <div className="mt-10">
                      <LiveTutor 
                        textToRead={readingText} 
                        difficulty={stats.difficulty}
                        onStarEarned={handleStarEarned}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="bg-[#87CEEB] p-6 rounded-[2rem] border-8 border-blue-400">
                        <h4 className="font-black text-blue-900 mb-2">BAT-SCAN LOG 🦇</h4>
                        <div className="bg-white/50 rounded-xl p-4 min-h-[100px] text-blue-800 font-bold italic">
                           Lexi is listening for tricky words...
                        </div>
                     </div>
                     <MnemonicGenerator onMnemonicFound={addMnemonic} />
                  </div>
                </div>
              )}

              {currentView === AppView.VISION && (
                <VisionReader onTextExtracted={handleTextExtracted} />
              )}
            </div>

            {/* RIGHT COLUMN: STATS & DIFFICULTY */}
            <div className="lg:col-span-4 space-y-8">
              {/* DIFFICULTY SELECTION (Lemon Yellow) */}
              <div className="bg-[#FFF44F] p-8 rounded-[3rem] border-8 border-yellow-500 shadow-xl">
                <h3 className="text-2xl font-black text-yellow-900 mb-6 flex items-center gap-2">
                  <span>🎮</span> MODE SELECT
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {(Object.keys(DIFFICULTY_CONFIG) as DifficultyLevel[]).map((key) => (
                    <button
                      key={key}
                      onClick={() => handleDifficultyChange(key)}
                      className={`flex items-center gap-4 p-5 rounded-3xl border-4 transition-all transform active:scale-95 ${stats.difficulty === key ? 'bg-white border-yellow-700 scale-105 shadow-xl' : 'bg-yellow-200 border-yellow-300 opacity-60 hover:opacity-100'}`}
                    >
                      <span className="text-5xl">{DIFFICULTY_CONFIG[key].icon}</span>
                      <div className="text-left">
                        <div className={`font-black text-2xl ${stats.difficulty === key ? 'text-yellow-900' : 'text-yellow-800'}`}>{key}</div>
                        <div className="text-sm font-bold text-yellow-700">{DIFFICULTY_CONFIG[key].description}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* PROGRESS BOARD (Royal Purple) */}
              <div className="bg-[#7851A9] p-8 rounded-[3rem] border-8 border-purple-900 shadow-xl text-white">
                <h3 className="text-2xl font-black mb-6 flex items-center gap-2">
                  <span>🏆</span> PROGRESS
                </h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between bg-purple-800 p-4 rounded-3xl border-4 border-purple-400">
                    <span className="text-4xl">✨</span>
                    <div className="text-right">
                       <div className="text-3xl font-black">{stats.stars}</div>
                       <div className="text-xs font-bold uppercase tracking-widest text-purple-300">PURPLE STARS</div>
                    </div>
                  </div>

                  <div className="bg-purple-800 p-4 rounded-3xl border-4 border-purple-400">
                     <div className="flex justify-between mb-2">
                       <span className="font-bold text-sm">ACCURACY</span>
                       <span className="font-black">{stats.accuracy}%</span>
                     </div>
                     <div className="w-full bg-purple-950 h-4 rounded-full overflow-hidden border-2 border-purple-400">
                        <div className="bg-pink-400 h-full shadow-glow" style={{ width: `${stats.accuracy}%` }}></div>
                     </div>
                  </div>

                  {mnemonics.length > 0 && (
                    <div className="grid grid-cols-3 gap-2">
                      {mnemonics.slice(0, 3).map((m, i) => (
                        <div key={i} className="aspect-square rounded-xl overflow-hidden border-2 border-purple-400 shadow-lg">
                          <img src={m.imageUrl} alt={m.word} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        )}
      </main>

      {/* Floating Navigation */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-6 bg-white/30 backdrop-blur-xl border-4 border-white/50 shadow-2xl px-8 py-4 rounded-full z-[80]">
        <button 
          onClick={() => setCurrentView(AppView.DASHBOARD)}
          className={`text-3xl transition ${currentView === AppView.DASHBOARD ? 'scale-150 drop-shadow-md' : 'opacity-40 grayscale hover:grayscale-0'}`}
        >
          🏠
        </button>
        <button 
          onClick={() => setCurrentView(AppView.READING)}
          className={`text-3xl transition ${currentView === AppView.READING ? 'scale-150 drop-shadow-md' : 'opacity-40 grayscale hover:grayscale-0'}`}
        >
          📖
        </button>
        <button 
          onClick={() => setCurrentView(AppView.MNEMONICS)}
          className={`text-3xl transition ${currentView === AppView.MNEMONICS ? 'scale-150 drop-shadow-md' : 'opacity-40 grayscale hover:grayscale-0'}`}
        >
          🧠
        </button>
      </div>
    </div>
  );
};

export default App;
