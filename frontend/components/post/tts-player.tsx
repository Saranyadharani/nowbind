"use client";

import { useCallback, useRef, useState } from "react";
import { Play, Pause, Square } from "lucide-react";
import { Button } from "@/components/ui/button";

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const GEMINI_TTS_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-tts-preview:generateContent?key=${GEMINI_API_KEY}`;

async function generateSpeech(text: string): Promise<AudioBuffer> {
  const response = await fetch(GEMINI_TTS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text }] }],
      generationConfig: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: "Aoede" },
          },
        },
      },
    }),
  });

  if (!response.ok) throw new Error(`Gemini TTS error: ${response.status}`);

  const data = await response.json();
  const audioData = data?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!audioData) throw new Error("No audio data in response");

  // Decode base64 PCM audio
  const binary = atob(audioData);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

  // Gemini returns PCM 16bit 24kHz mono — wrap in AudioContext
  const audioCtx = new AudioContext({ sampleRate: 24000 });
  const pcm = new Int16Array(bytes.buffer);
  const float32 = new Float32Array(pcm.length);
  for (let i = 0; i < pcm.length; i++) float32[i] = pcm[i] / 32768;

  const audioBuffer = audioCtx.createBuffer(1, float32.length, 24000);
  audioBuffer.copyToChannel(float32, 0);
  return audioBuffer;
}

export function TTSPlayer({ contentId = "article-content" }: { contentId?: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showUI, setShowUI] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);
  const pauseOffsetRef = useRef(0);
  const startTimeRef = useRef(0);

  const collectText = useCallback(() => {
    const container = document.getElementById(contentId);
    if (!container) return "";
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, {
      acceptNode: (node) => {
        if (node.parentElement?.tagName.match(/^(SCRIPT|STYLE|PRE|CODE)$/i))
          return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    });
    let text = "";
    let node = walker.nextNode();
    while (node) {
      if (node.textContent?.trim()) text += node.textContent;
      node = walker.nextNode();
    }
    return text.trim();
  }, [contentId]);

  const playBuffer = useCallback((buffer: AudioBuffer, offset = 0) => {
    const ctx = new AudioContext({ sampleRate: 24000 });
    audioCtxRef.current = ctx;
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    source.start(0, offset);
    startTimeRef.current = ctx.currentTime - offset;
    sourceRef.current = source;

    source.onended = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setShowUI(false);
      pauseOffsetRef.current = 0;
    };
  }, []);

  const handlePlay = useCallback(async () => {
    // Resume if paused
    if (isPaused && audioCtxRef.current && audioBufferRef.current) {
      playBuffer(audioBufferRef.current, pauseOffsetRef.current);
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    // Pause if playing
    if (isPlaying && audioCtxRef.current) {
      pauseOffsetRef.current = audioCtxRef.current.currentTime - startTimeRef.current;
      sourceRef.current?.stop();
      await audioCtxRef.current.close();
      setIsPaused(true);
      setIsPlaying(false);
      return;
    }

    // Fresh start
    const text = collectText();
    if (!text) return;

    setIsLoading(true);
    setError(null);
    setShowUI(true);

    try {
      const buffer = await generateSpeech(text);
      audioBufferRef.current = buffer;
      pauseOffsetRef.current = 0;
      playBuffer(buffer, 0);
      setIsPlaying(true);
    } catch (err) {
      console.error("TTS error:", err);
      setError("Failed to generate speech. Please try again.");
      setShowUI(false);
    } finally {
      setIsLoading(false);
    }
  }, [isPlaying, isPaused, collectText, playBuffer]);

  const handleStop = useCallback(async () => {
    sourceRef.current?.stop();
    if (audioCtxRef.current) await audioCtxRef.current.close();
    setIsPlaying(false);
    setIsPaused(false);
    setShowUI(false);
    pauseOffsetRef.current = 0;
    audioBufferRef.current = null;
  }, []);

  if (!showUI) {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-muted-foreground"
          onClick={handlePlay}
          disabled={isLoading}
          title="Listen to article"
        >
          {isLoading ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            <Play className="h-4 w-4" />
          )}
          <span className="sr-only">Listen to article</span>
        </Button>
        {error && <span className="text-xs text-destructive">{error}</span>}
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-5">
      <div className="bg-background/95 backdrop-blur shadow-lg border rounded-full px-6 py-3 flex items-center gap-4">
        <Button
          variant="default"
          size="icon"
          className="rounded-full h-10 w-10 shrink-0"
          onClick={handlePlay}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : isPlaying && !isPaused ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4 ml-0.5" />
          )}
        </Button>

        <span className="text-sm text-muted-foreground min-w-[80px]">
          {isLoading ? "Generating..." : isPlaying && !isPaused ? "Playing..." : "Paused"}
        </span>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
          onClick={handleStop}
          title="Stop"
        >
          <Square className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}