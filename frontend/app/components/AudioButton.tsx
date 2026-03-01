'use client';
import { Volume2, Pause } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface AudioButtonProps {
  playlist: string[]; // Accepts the array from MongoDB
}

export default function AudioButton({ playlist }: AudioButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current && playlist.length > 0) {
      audioRef.current.src = `/audio/${playlist[currentIndex]}`;
      if (isPlaying) audioRef.current.play().catch(e => console.error(e));
    }
  }, [currentIndex, playlist, isPlaying]);

  const toggleAudio = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(e => console.error("Audio missing:", playlist[currentIndex]));
      setIsPlaying(true);
    }
  };

  const handleEnded = () => {
    if (currentIndex < playlist.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsPlaying(false);
      setCurrentIndex(0);
    }
  };

  if (!playlist || playlist.length === 0) return null;

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center' }}>
      <audio ref={audioRef} onEnded={handleEnded} />
      <button onClick={toggleAudio} className="audio-btn-raised">
        {isPlaying ? (
          <Pause color="#8bc34a" size={24} />
        ) : (
          <Volume2 color="#8bc34a" size={24} />
        )}
      </button>
    </div>
  );
}