
import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { MODELS } from '../constants';

interface VisionReaderProps {
  onTextExtracted: (text: string) => void;
}

const VisionReader: React.FC<VisionReaderProps> = ({ onTextExtracted }) => {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Data = (reader.result as string).split(',')[1];
      setPreview(reader.result as string);
      processImage(base64Data);
    };
    reader.readAsDataURL(file);
  };

  const processImage = async (base64: string) => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const response = await ai.models.generateContent({
        model: MODELS.TEXT,
        contents: [
          {
            parts: [
              { inlineData: { data: base64, mimeType: 'image/jpeg' } },
              { text: "Extract the text from this page of a children's book. If it's too complex, simplify it for a child with dyslexia while keeping the core story. Return only the extracted/simplified text." }
            ]
          }
        ]
      });
      
      if (response.text) {
        onTextExtracted(response.text);
      }
    } catch (err) {
      console.error('Vision Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-6 bg-white rounded-2xl shadow-md border-4 border-indigo-100">
      <h2 className="text-2xl font-bold text-indigo-900">Scan Your Book 📖</h2>
      <p className="text-gray-600 text-center">Take a photo of a page, and Lexi will help you read it!</p>
      
      <div className="w-full flex justify-center">
        {preview ? (
          <div className="relative w-64 h-48 bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-indigo-300">
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            {loading && (
              <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
        ) : (
          <div className="w-64 h-48 bg-indigo-50 rounded-lg border-2 border-dashed border-indigo-300 flex items-center justify-center text-indigo-300">
            No image selected
          </div>
        )}
      </div>

      <label className="cursor-pointer bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-6 py-2 rounded-xl font-bold transition">
        <span>📸 Take Photo / Upload</span>
        <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
      </label>
    </div>
  );
};

export default VisionReader;
