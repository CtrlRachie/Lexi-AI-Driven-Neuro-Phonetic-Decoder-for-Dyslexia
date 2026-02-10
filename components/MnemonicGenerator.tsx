
import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { MODELS } from '../constants';

interface MnemonicGeneratorProps {
  onMnemonicFound: (word: string, url: string, explanation: string) => void;
}

const MnemonicGenerator: React.FC<MnemonicGeneratorProps> = ({ onMnemonicFound }) => {
  const [word, setWord] = useState('');
  const [loading, setLoading] = useState(false);

  const generateMnemonic = async () => {
    if (!word) return;
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      
      const textResponse = await ai.models.generateContent({
        model: MODELS.TEXT,
        contents: `Explain how a child can remember the word "${word}" using a simple visual mnemonic. For example, 'b' has a belly for 'ball'. Be brief and creative.`
      });
      const explanation = textResponse.text || `Lexi says ${word} is a magical word!`;

      const imageResponse = await ai.models.generateContent({
        model: MODELS.IMAGE,
        contents: {
          parts: [{ text: `A colorful, friendly children's illustration for a visual mnemonic to remember the word "${word}". Use bright colors and a white background. No text inside the image.` }]
        },
        config: {
          imageConfig: { aspectRatio: "1:1" }
        }
      });

      let imageUrl = '';
      for (const part of imageResponse.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          imageUrl = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }

      if (imageUrl) {
        onMnemonicFound(word, imageUrl, explanation);
        setWord('');
      }
    } catch (err) {
      console.error('Mnemonic Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FF8C00] p-8 rounded-[2rem] border-8 border-orange-700 shadow-xl">
      <h3 className="text-2xl font-black text-white mb-4 flex items-center gap-2">
        <span>🦇</span> BAT-WORD!
      </h3>
      <p className="text-orange-100 font-bold mb-4 italic">Lexi makes a magic picture for tricky words!</p>
      <div className="flex flex-col gap-3">
        <input
          type="text"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          placeholder="Tricky word here..."
          className="px-6 py-4 rounded-2xl border-4 border-orange-300 focus:outline-none focus:ring-4 focus:ring-yellow-300 font-bold text-xl"
        />
        <button
          onClick={generateMnemonic}
          disabled={loading || !word}
          className="bg-white text-[#FF8C00] px-6 py-4 rounded-2xl font-black text-xl shadow-lg transform transition active:scale-95 hover:bg-orange-50 disabled:opacity-50"
        >
          {loading ? 'WAITING... ✨' : 'MAKE MAGIC! ✨'}
        </button>
      </div>
    </div>
  );
};

export default MnemonicGenerator;
