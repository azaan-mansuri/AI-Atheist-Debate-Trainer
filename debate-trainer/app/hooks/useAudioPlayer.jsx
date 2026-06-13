import { useState, useRef, useEffect } from 'react';

export default function useAudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const currentAudioRef = useRef(null);
  const API_URL = '';

  useEffect(() => {
    return () => {
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }
    };
  }, []);

  const playAudio = async (text, lang) => {
    if (!text) return;
    
    // Stop any currently playing audio
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    
    setIsLoading(true);
    setIsPlaying(false);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/api/tts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, lang }),
      });
      
      if (!response.ok) {
        throw new Error(`TTS failed: ${response.status}`);
      }
      
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      // 🔥 MAX VOLUME - 1.0 (full volume)
      audio.volume = 1.0;
      
      currentAudioRef.current = audio;
      
      audio.onplay = () => {
        setIsPlaying(true);
        setIsLoading(false);
      };
      
      audio.onended = () => {
        setIsPlaying(false);
        setIsLoading(false);
        URL.revokeObjectURL(audioUrl);
        currentAudioRef.current = null;
      };
      
      audio.onerror = (e) => {
        console.error('Audio playback error:', e);
        setIsPlaying(false);
        setIsLoading(false);
        setError('Playback failed');
        URL.revokeObjectURL(audioUrl);
        currentAudioRef.current = null;
      };
      
      await audio.play();
      
    } catch (err) {
      console.error('TTS error:', err);
      setError(err.message);
      setIsLoading(false);
      setIsPlaying(false);
    }
  };
  
  const stopAudio = () => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
      currentAudioRef.current = null;
    }
    setIsPlaying(false);
    setIsLoading(false);
  };
  
  // Function to change volume dynamically (optional)
  const setVolume = (volumeLevel) => {
    if (currentAudioRef.current) {
      currentAudioRef.current.volume = Math.min(1, Math.max(0, volumeLevel));
    }
  };
  
  return {
    playAudio,
    stopAudio,
    setVolume,
    isPlaying,
    isLoading,
    error
  };
}