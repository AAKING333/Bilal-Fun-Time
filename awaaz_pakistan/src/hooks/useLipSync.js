import { useState, useEffect, useRef, useCallback } from 'react';

export const useLipSync = () => {
  const [mouthAperture, setMouthAperture] = useState(0); // 0 to 1
  const [isSpeaking, setIsSpeaking] = useState(false);
  const animationFrameRef = useRef(null);
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);

  /**
   * Speak text using Web SpeechSynthesis if available, or simulate voice cadence
   */
  const speakText = useCallback((text, lang = 'ur-PK', onEnd = null) => {
    if (!('speechSynthesis' in window)) {
      if (onEnd) onEnd();
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.95;

    // Check available voices for Urdu/Hindi or English
    const voices = window.speechSynthesis.getVoices();
    if (lang.startsWith('ur')) {
      const urVoice = voices.find(v => v.lang.startsWith('ur') || v.lang.startsWith('hi'));
      if (urVoice) utterance.voice = urVoice;
    }

    setIsSpeaking(true);

    // Natural lip cadence simulation
    let phase = 0;
    const animateMouth = () => {
      phase += 0.25;
      // Speech modulation: blend of primary syllables and random micro-pauses
      const syllable = Math.sin(phase) * 0.5 + 0.5;
      const microVariance = Math.sin(phase * 2.3) * 0.3;
      const open = Math.max(0, Math.min(1, (syllable + microVariance) * 0.85));
      setMouthAperture(open);
      animationFrameRef.current = requestAnimationFrame(animateMouth);
    };
    animateMouth();

    utterance.onend = () => {
      setIsSpeaking(false);
      setMouthAperture(0);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setMouthAperture(0);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (onEnd) onEnd();
    };

    window.speechSynthesis.speak(utterance);
  }, []);

  /**
   * Connect an HTML Audio element to Web Audio AnalyserNode for precise audio-driven mouth opening
   */
  const connectAudioElement = useCallback((audioElement, onEnd = null) => {
    if (!audioElement) return;

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 128;
      const source = ctx.createMediaElementSource(audioElement);
      source.connect(analyser);
      analyser.connect(ctx.destination);

      audioCtxRef.current = ctx;
      analyserRef.current = analyser;
      setIsSpeaking(true);

      const buffer = new Uint8Array(analyser.frequencyBinCount);

      const trackAudio = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(buffer);
        let sum = 0;
        for (let i = 0; i < buffer.length; i++) sum += buffer[i];
        const avg = sum / buffer.length;
        setMouthAperture(Math.min(1, avg / 80));
        animationFrameRef.current = requestAnimationFrame(trackAudio);
      };
      trackAudio();

      audioElement.onended = () => {
        setIsSpeaking(false);
        setMouthAperture(0);
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        if (onEnd) onEnd();
      };
    } catch {
      // Fallback: If already connected or cross-origin blocked, simulate
      setIsSpeaking(true);
      let step = 0;
      const sim = () => {
        step += 0.3;
        setMouthAperture(Math.sin(step) * 0.4 + 0.4);
        animationFrameRef.current = requestAnimationFrame(sim);
      };
      sim();
      audioElement.onended = () => {
        setIsSpeaking(false);
        setMouthAperture(0);
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        if (onEnd) onEnd();
      };
    }
  }, []);

  const stopSpeaking = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setIsSpeaking(false);
    setMouthAperture(0);
  }, []);

  useEffect(() => {
    return () => {
      stopSpeaking();
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, [stopSpeaking]);

  return {
    mouthAperture,
    isSpeaking,
    speakText,
    connectAudioElement,
    stopSpeaking,
  };
};

