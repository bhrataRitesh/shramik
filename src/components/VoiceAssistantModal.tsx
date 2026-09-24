"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  MicOff,
  Sparkles,
  X,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  Send,
} from "lucide-react";
import confetti from "canvas-confetti";
import { useLanguage } from "@/context/LanguageContext";

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onProfileCreated?: (profile: any) => void;
}

export default function VoiceAssistantModal({
  isOpen,
  onClose,
  onProfileCreated,
}: VoiceAssistantModalProps) {
  const { t } = useLanguage();
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [parsedResult, setParsedResult] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-IN";

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recognition.onresult = (event: any) => {
          let currentTranscript = "";
          for (let i = 0; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setTranscript(currentTranscript);
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recognition.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error);
          setIsRecording(false);
          setErrorMsg("Microphone input error. You can also type your details below.");
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  if (!isOpen) return null;

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      setErrorMsg("Voice recognition is not supported in this browser. Please type below.");
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      setTranscript("");
      setParsedResult(null);
      setErrorMsg("");
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.warn("Recognition already started:", err);
      }
    }
  };

  const handleProcessVoice = async (textToProcess?: string) => {
    const text = textToProcess || transcript;
    if (!text || text.trim().length === 0) {
      setErrorMsg("Please speak into the mic or click a sample prompt below.");
      return;
    }

    setIsProcessing(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/voice-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: text }),
      });
      const data = await res.json();
      if (data.success) {
        setParsedResult(data.data.parsedProfile);
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
        });
      } else {
        setErrorMsg("Failed to parse profile. Please try again.");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSampleClick = (sample: string) => {
    setTranscript(sample);
    handleProcessVoice(sample);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800/80 transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Voice Assistant</span>
          </div>
          <h2 className="text-xl font-bold text-white">
            Create Profile by Speaking
          </h2>
          <p className="text-xs text-slate-400">
            Speak your trade, years of experience, and daily wage rate. AI will structure your profile.
          </p>
        </div>

        {/* Microphone Recording Button */}
        <div className="flex flex-col items-center justify-center py-2 space-y-2">
          <button
            onClick={toggleRecording}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
              isRecording
                ? "bg-rose-500 text-white ring-4 ring-rose-500/20"
                : "bg-amber-500 text-slate-950 hover:bg-amber-400"
            }`}
          >
            {isRecording ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
          </button>
          <span className="text-xs text-slate-400">
            {isRecording ? "Listening... Tap to stop" : "Tap microphone to speak"}
          </span>
        </div>

        {/* Transcript Area */}
        <div className="space-y-1.5 text-left">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="font-medium">Transcript:</span>
            {transcript && (
              <button
                onClick={() => setTranscript("")}
                className="text-slate-400 hover:text-slate-200 flex items-center gap-1 text-[11px]"
              >
                <RefreshCw className="w-3 h-3" /> Clear
              </button>
            )}
          </div>
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="e.g. My name is Rajesh, I have 8 years experience in wall painting, I charge 750 rupees per day..."
            className="w-full h-20 p-3 bg-slate-800 text-slate-100 text-xs rounded-xl border border-slate-700/80 focus:outline-none focus:border-amber-400 transition resize-none"
          />
        </div>

        {/* Sample Prompts */}
        {!transcript && (
          <div className="space-y-1.5 text-left">
            <span className="text-[11px] text-slate-400">
              Or click a sample prompt:
            </span>
            <div className="flex flex-col gap-1.5">
              <button
                onClick={() =>
                  handleSampleClick(
                    "My name is Rajesh, I have 8 years experience in wall painting and putty work, I charge 750 rupees per day"
                  )
                }
                className="p-2 rounded-lg bg-slate-850 hover:bg-slate-800 text-xs text-slate-300 border border-slate-800 text-left transition"
              >
                🎨 &ldquo;Rajesh Painter • 8 yrs • ₹750/day&rdquo;
              </button>
              <button
                onClick={() =>
                  handleSampleClick(
                    "My name is Sunil, I am an electrician with 12 years experience in home wiring, 850 rupees daily"
                  )
                }
                className="p-2 rounded-lg bg-slate-850 hover:bg-slate-800 text-xs text-slate-300 border border-slate-800 text-left transition"
              >
                ⚡ &ldquo;Sunil Electrician • 12 yrs • ₹850/day&rdquo;
              </button>
            </div>
          </div>
        )}

        {/* Process Button */}
        {transcript && !parsedResult && (
          <button
            onClick={() => handleProcessVoice()}
            disabled={isProcessing}
            className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Analyzing speech...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate Profile</span>
              </>
            )}
          </button>
        )}

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Parsed Result Display */}
        {parsedResult && (
          <div className="p-4 rounded-xl bg-slate-850 border border-slate-700/80 space-y-3 text-left">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Artisan Profile Ready</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white">{parsedResult.suggestedTitle}</span>
                <span className="text-amber-400 font-bold">₹{parsedResult.dailyWageRate} / day</span>
              </div>
              <div className="text-slate-400 text-[11px]">
                <span>{parsedResult.categoryLabel}</span> • <span>{parsedResult.experienceYears} Years</span>
              </div>
            </div>

            <button
              onClick={() => {
                if (onProfileCreated) onProfileCreated(parsedResult);
                onClose();
              }}
              className="w-full py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition flex items-center justify-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Publish to Digital Chowk</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
