
import React, { useEffect, useRef, useState } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';
import { MODELS, SYSTEM_INSTRUCTIONS } from '../constants';
import { createBlob, decode, decodeAudioData } from '../services/audioUtils';
import { DifficultyLevel } from '../types';
import Mascot from './Mascot';

interface LiveTutorProps {
  onTranscription?: (text: string, sender: 'user' | 'lexi') => void;
  onStarEarned?: () => void;
  textToRead: string;
  difficulty: DifficultyLevel;
}

const LiveTutor: React.FC<LiveTutorProps> = ({ 
  onTranscription, 
  onStarEarned, 
  textToRead, 
  difficulty
}) => {
  const [isActive, setIsActive] = useState(false);
  const [lexiStatus, setLexiStatus] = useState<'idle' | 'listening' | 'speaking' | 'happy'>('idle');
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const outputContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);

  const startSession = async () => {
    if (isActive) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outputContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

      sessionPromiseRef.current = ai.live.connect({
        model: MODELS.LIVE,
        callbacks: {
          onopen: () => {
            setIsActive(true);
            setLexiStatus('listening');

            const source = audioContextRef.current!.createMediaStreamSource(stream);
            scriptProcessorRef.current = audioContextRef.current!.createScriptProcessor(4096, 1, 1);
            
            scriptProcessorRef.current.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              sessionPromiseRef.current?.then(session => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };

            source.connect(scriptProcessorRef.current);
            scriptProcessorRef.current.connect(audioContextRef.current!.destination);
            
            sessionPromiseRef.current?.then(session => {
                session.sendRealtimeInput({ text: `Hi friend! I'm in my Sky Blue world! Let's read this together: "${textToRead}"` });
            });
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.outputTranscription) {
              onTranscription?.(message.serverContent.outputTranscription.text, 'lexi');
            } else if (message.serverContent?.inputTranscription) {
              onTranscription?.(message.serverContent.inputTranscription.text, 'user');
            }

            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio && outputContextRef.current) {
              setLexiStatus('speaking');
              const nextStartTime = Math.max(nextStartTimeRef.current, outputContextRef.current.currentTime);
              const audioBuffer = await decodeAudioData(
                decode(base64Audio),
                outputContextRef.current,
                24000,
                1
              );
              
              const source = outputContextRef.current.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(outputContextRef.current.destination);
              source.onended = () => {
                sourcesRef.current.delete(source);
                if (sourcesRef.current.size === 0) setLexiStatus('listening');
              };
              source.start(nextStartTime);
              nextStartTimeRef.current = nextStartTime + audioBuffer.duration;
              sourcesRef.current.add(source);
            }

            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e) => console.error('Lexi Error:', e),
          onclose: () => {
            setIsActive(false);
            setLexiStatus('idle');
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: SYSTEM_INSTRUCTIONS(difficulty),
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
          }
        }
      });
    } catch (err) {
      console.error('Failed to start tutor:', err);
    }
  };

  const stopSession = () => {
    sessionPromiseRef.current?.then(session => session.close());
    if (scriptProcessorRef.current) scriptProcessorRef.current.disconnect();
    setIsActive(false);
    setLexiStatus('idle');
  };

  useEffect(() => {
    return () => { stopSession(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col items-center space-y-6">
      <Mascot status={lexiStatus} size="lg" />
      
      <div className="flex gap-4">
        {!isActive ? (
          <button
            onClick={startSession}
            className="bg-white text-green-700 px-12 py-5 rounded-[2rem] font-black text-2xl shadow-xl border-b-8 border-green-200 active:translate-y-2 active:border-b-0 transition-all flex items-center gap-4"
          >
            <span>🎤</span> START READING!
          </button>
        ) : (
          <button
            onClick={stopSession}
            className="bg-red-500 text-white px-12 py-5 rounded-[2rem] font-black text-2xl shadow-xl border-b-8 border-red-800 active:translate-y-2 active:border-b-0 transition-all flex items-center gap-4"
          >
            <span>⏹️</span> ALL DONE!
          </button>
        )}
      </div>

      {isActive && (
        <div className="bg-white/80 px-6 py-2 rounded-full font-black text-green-800 border-4 border-white animate-pulse">
           Lexi is listening in "{difficulty}" mode! 🦇
        </div>
      )}
    </div>
  );
};

export default LiveTutor;
