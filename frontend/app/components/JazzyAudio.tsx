'use client';
import { Volume2, Pause, SkipForward } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';

// Updated interface to handle the new database structure (array of files)
interface JazzyAudioProps {
  playlist: string[];
}

export default function JazzyAudio({ playlist }: JazzyAudioProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // When the index changes, update the source and play if we were already playing
  useEffect(() => {
    if (audioRef.current && playlist.length > 0) {
      audioRef.current.src = `/audio/${playlist[currentIndex]}`;
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Audio playback error:", e));
      }
    }
  }, [currentIndex, playlist]);

  const toggleAudio = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(e => console.error("Audio play error:", e));
      setIsPlaying(true);
    }
  };

  const handleNext = () => {
    if (currentIndex < playlist.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Loop back to start or stop
      setIsPlaying(false);
      setCurrentIndex(0);
    }
  };

  if (!playlist || playlist.length === 0) {
    return <p style={{ color: '#ef4444', fontSize: '0.8rem' }}>No audio mapped</p>;
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <audio
        ref={audioRef}
        onEnded={handleNext}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        preload="auto"
      />

      <button onClick={toggleAudio} className="audio-btn-jazzy">
        {isPlaying ? (
          <Pause color="#8bc34a" size={28} />
        ) : (
          <Volume2 color="#8bc34a" size={28} />
        )}
      </button>

      {/* Playlist Indicator: Shows which part is playing */}
      {playlist.length > 1 && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ color: '#8bc34a', fontSize: '0.75rem', fontWeight: 'bold' }}>
            PART {currentIndex + 1} OF {playlist.length}
          </span>
          <span style={{ color: '#94a3b8', fontSize: '0.65rem' }}>
            {playlist[currentIndex]}
          </span>
        </div>
      )}

      {playlist.length > 1 && currentIndex < playlist.length - 1 && (
        <button onClick={handleNext} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '5px' }}>
          <SkipForward size={18} color="#475569" />
        </button>
      )}
    </div>
  );
}