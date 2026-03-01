// app/dua/[id]/page.tsx - WITH FIXED AUDIO
'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import {
  Home,
  ChevronLeft,
  ChevronRight,
  Volume2,
  Moon,
  Sunrise
} from 'lucide-react';

interface DuaType {
  id: string;
  text_ar: string;
  text_en: string;
  transliteration?: string;
  reference?: string;
  source?: string;
  audio?: string;
}

interface ChapterType {
  id: number;
  title_en: string;
  title_ar: string;
  duas: DuaType[];
}

export default function DuaPage() {
  const params = useParams();
  const id = params.id as string;

  const [chapter, setChapter] = useState<ChapterType | null>(null);
  const [loading, setLoading] = useState(true);
  const [playingAudio, setPlayingAudio] = useState<number | null>(null);
  const audioRefs = useRef<(HTMLAudioElement | null)[]>([]);

  useEffect(() => {
    if (id) {
      fetchChapterData();
    }
  }, [id]);

  // Initialize audio refs when chapter loads
  useEffect(() => {
    if (chapter) {
      audioRefs.current = audioRefs.current.slice(0, chapter.duas.length);
    }
  }, [chapter]);

  const fetchChapterData = async () => {
    try {
      // Check if it's introduction or merits
      if (id === 'introduction') {
        // Handle introduction separately if needed
        setChapter({
          id: 0,
          title_en: 'Introduction',
          title_ar: 'مقدمة',
          duas: []
        });
        setLoading(false);
        return;
      }

      if (id === 'merits') {
        setChapter({
          id: 999,
          title_en: 'Merits of Duas',
          title_ar: 'فضائل الأدعية',
          duas: []
        });
        setLoading(false);
        return;
      }

      // Regular chapter
      const res = await fetch(`/api/hisn?id=${id}`);

      if (res.ok) {
        const data = await res.json();
        setChapter(data);
      } else {
        console.error('Chapter not found');
      }
    } catch (err) {
      console.error('Error fetching chapter:', err);
    } finally {
      setLoading(false);
    }
  };

  const playAudio = (index: number) => {
    // If this audio is already playing, pause it
    if (playingAudio === index) {
      const audio = audioRefs.current[index];
      if (audio) {
        audio.pause();
        setPlayingAudio(null);
      }
      return;
    }

    // Pause any currently playing audio
    if (playingAudio !== null) {
      const currentAudio = audioRefs.current[playingAudio];
      if (currentAudio) {
        currentAudio.pause();
      }
    }

    // Play the selected audio
    const audio = audioRefs.current[index];
    if (audio) {
      audio.play()
        .then(() => {
          setPlayingAudio(index);
        })
        .catch(error => {
          console.error('Error playing audio:', error);
          // Fallback: Create a new audio element if ref is not working
          playAudioFallback(index);
        });
    } else {
      // If ref doesn't exist, use fallback
      playAudioFallback(index);
    }
  };

  const handleAudioEnded = (index: number) => {
    if (playingAudio === index) {
      setPlayingAudio(null);
    }
  };

  const playAudioFallback = (index: number) => {
    // Stop any audio that might be playing
    const allAudioElements = document.querySelectorAll('audio');
    allAudioElements.forEach(audio => {
      if (!audio.paused) audio.pause();
    });

    const dua = chapter?.duas[index];
    if (!dua?.id) {
      console.error('No dua ID found for index:', index);
      alert('Audio not available for this dua');
      return;
    }

    // Use the actual dua_id from your data (1.mp3, 2.mp3, etc.)
    const audioFile = `/audio/${dua.id}.mp3`;
    const audio = new Audio(audioFile);

    audio.play()
      .then(() => {
        setPlayingAudio(index);
      })
      .catch(error => {
        console.error('Error playing audio (fallback):', error);
        alert(`Audio file not found at: ${audioFile}`);
      });

    audio.onended = () => setPlayingAudio(null);
    audio.onpause = () => setPlayingAudio(null);
  };

  // Helper function to get audio file path - FIXED to use actual dua_id
  const getAudioPath = (duaIndex: number) => {
    const dua = chapter?.duas[duaIndex];
    if (dua?.id) {
      // Use the actual dua_id from your data
      return `/audio/${dua.id}.mp3`;
    }
    // Fallback - use index+1 if no id exists (should rarely happen)
    return `/audio/${duaIndex + 1}.mp3`;
  };

  // Handle introduction and merits pages
  if (id === 'introduction' || id === 'merits') {
    return (
      <main className="container">
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <h1>{id === 'introduction' ? 'Introduction' : 'Merits of Duas'}</h1>
          <p>This page is under construction.</p>
          <Link href="/" className="nav-card" style={{ display: 'inline-flex', marginTop: '20px' }}>
            <Home size={18} />
            <span>Back to Home</span>
          </Link>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="container">
        <div className="loading-state">Loading Chapter...</div>
      </main>
    );
  }

  if (!chapter) {
    return (
      <main className="container">
        <div className="no-content">
          <h3>Chapter Not Found</h3>
          <Link href="/" className="nav-card" style={{ display: 'inline-flex', marginTop: '20px' }}>
            <Home size={18} />
            <span>Back to Home</span>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container">
      {/* Hidden audio elements for each dua */}
      {chapter.duas.map((dua, index) => (
        <audio
          key={`audio-${dua.id || index}`}
          ref={(el: HTMLAudioElement | null) => {
              if (el) audioRefs.current[index] = el;
            }}
          src={getAudioPath(index)}
          onEnded={() => handleAudioEnded(index)}
          onPause={() => {
            if (playingAudio === index) setPlayingAudio(null);
          }}
          preload="metadata"
        />
      ))}

      {/* BLENDED HEADER */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(139, 195, 74, 0.15) 0%, rgba(15, 23, 42, 0.8) 100%)',
        padding: '40px 30px 20px',
        borderRadius: '20px',
        border: '2px solid rgba(139, 195, 74, 0.2)',
        marginBottom: '30px',
        position: 'relative'
      }}>
        {/* Chapter indicator badge */}
        <div style={{
          position: 'absolute',
          top: '-12px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'linear-gradient(135deg, #8bc34a, #689f38)',
          color: '#0f172a',
          padding: '6px 20px',
          borderRadius: '20px',
          fontWeight: '700',
          fontSize: '0.85rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Moon size={14} />
          Chapter {id}
          <Sunrise size={14} />
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '15px'
        }}>
          <div style={{ flex: 1 }}>
            <h1 style={{
              margin: 0,
              color: '#f8fafc',
              fontSize: '1.8rem',
              fontWeight: '700'
            }}>
              {chapter.title_en}
            </h1>
            <div style={{
              color: '#94a3b8',
              fontSize: '0.95rem',
              marginTop: '5px'
            }}>
              {chapter.duas.length} Duas in this chapter
            </div>
          </div>

          <div style={{ flex: 1, textAlign: 'right', direction: 'rtl' }}>
            <h1 style={{
              margin: 0,
              color: '#8bc34a',
              fontSize: '1.8rem',
              fontWeight: '700',
              fontFamily: "'Amiri', serif"
            }}>
              {chapter.title_ar}
            </h1>
            <div style={{
              color: '#94a3b8',
              fontSize: '0.95rem',
              marginTop: '5px',
              direction: 'rtl'
            }}>
              {chapter.duas.length} أدعية في هذا الفصل
            </div>
          </div>
        </div>

        {/* Progress indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginTop: '20px',
          padding: '10px 15px',
          background: 'rgba(30, 41, 59, 0.5)',
          borderRadius: '10px'
        }}>
          <div style={{
            flex: 1,
            height: '4px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '2px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, #8bc34a, #689f38)',
              borderRadius: '2px'
            }}></div>
          </div>
          <div style={{
            color: '#8bc34a',
            fontSize: '0.85rem',
            fontWeight: '600',
            whiteSpace: 'nowrap'
          }}>
            Complete Chapter
          </div>
        </div>
      </div>

      {/* ALL DUAS IN ONE PAGE */}
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {chapter.duas.map((dua, index) => (
          <div
            key={dua.id || index}
            style={{
              background: 'rgba(30, 41, 59, 0.6)',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              marginBottom: '25px',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              position: 'relative'
            }}
          >
            {/* Dua Number Badge - Shows position in chapter, not global ID */}
            <div style={{
              position: 'absolute',
              top: '15px',
              left: '15px',
              width: '32px',
              height: '32px',
              background: 'rgba(139, 195, 74, 0.2)',
              border: '2px solid rgba(139, 195, 74, 0.4)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#8bc34a',
              fontWeight: '700',
              fontSize: '0.9rem',
              zIndex: '1'
            }}>
              {index + 1}
            </div>

            {/* Dua Content */}
            <div style={{ padding: '30px' }}>
              {/* Translation Section */}
              <div style={{ marginBottom: '25px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '15px'
                }}>
                  <div style={{
                    color: '#94a3b8',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Translation
                  </div>

                  {/* Audio Button */}
                  <button
                    onClick={() => playAudio(index)}
                    style={{
                      background: playingAudio === index
                        ? 'rgba(139, 195, 74, 0.3)'
                        : 'rgba(139, 195, 74, 0.1)',
                      border: `2px solid ${playingAudio === index ? '#8bc34a' : 'rgba(139, 195, 74, 0.3)'}`,
                      color: playingAudio === index ? '#fff' : '#8bc34a',
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      position: 'relative'
                    }}
                    aria-label={playingAudio === index ? "Pause audio" : "Play audio"}
                  >
                    <Volume2 size={20} />
                    {playingAudio === index && (
                      <div style={{
                        position: 'absolute',
                        width: '6px',
                        height: '6px',
                        background: '#8bc34a',
                        borderRadius: '50%',
                        top: '5px',
                        right: '5px',
                        animation: 'pulse 1.5s infinite'
                      }}></div>
                    )}
                  </button>
                </div>

                <div style={{
                  background: 'rgba(15, 23, 42, 0.4)',
                  padding: '20px',
                  borderRadius: '10px',
                  lineHeight: '1.7',
                  color: '#e2e8f0',
                  fontSize: '1.05rem'
                }}>
                  {dua.text_en}
                </div>
              </div>

              {/* Arabic Section */}
              <div style={{ marginBottom: '25px' }}>
                <div style={{
                  color: '#8bc34a',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    background: 'rgba(139, 195, 74, 0.2)',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.8rem',
                    fontWeight: 'bold'
                  }}>
                    ع
                  </div>
                  Arabic
                </div>

                <div style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                  padding: '25px',
                  borderRadius: '10px',
                  border: '2px solid rgba(139, 195, 74, 0.2)',
                  fontFamily: "'Amiri', serif",
                  fontSize: '1.8rem',
                  lineHeight: '1.8',
                  color: '#8bc34a',
                  textAlign: 'center',
                  direction: 'rtl',
                  fontWeight: '700'
                }}>
                  {dua.text_ar}
                </div>
              </div>

              {/* Transliteration Section */}
              <div style={{ marginBottom: dua.reference ? '0' : '0' }}>
                <div style={{
                  color: '#94a3b8',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.8rem',
                    fontStyle: 'italic',
                    fontWeight: 'bold'
                  }}>
                    T
                  </div>
                  Transliteration
                </div>

                <div style={{
                  background: 'rgba(15, 23, 42, 0.3)',
                  padding: '20px',
                  borderRadius: '10px',
                  fontStyle: 'italic',
                  lineHeight: '1.8',
                  color: '#cbd5e1',
                  fontSize: '1rem'
                }}>
                  {dua.transliteration || 'Transliteration not available'}
                </div>
              </div>

              {/* Reference */}
              {dua.reference && (
                <div style={{
                  marginTop: '20px',
                  paddingTop: '20px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <div style={{
                    color: '#94a3b8',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    marginBottom: '5px'
                  }}>
                    Reference
                  </div>
                  <div style={{
                    color: '#94a3b8',
                    fontSize: '0.9rem',
                    lineHeight: '1.5'
                  }}>
                    {dua.reference}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom border accent */}
            <div style={{
              height: '4px',
              background: 'linear-gradient(90deg, rgba(139, 195, 74, 0.3), rgba(139, 195, 74, 0.1))',
              width: '100%'
            }}></div>
          </div>
        ))}
      </div>

      {/* CHAPTER NAVIGATION */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: '40px 0',
        padding: '20px',
        background: 'rgba(30, 41, 59, 0.4)',
        borderRadius: '12px'
      }}>
        <Link href="/" className="nav-card">
          <Home size={18} />
          <span>Home</span>
        </Link>

        <div style={{
          display: 'flex',
          gap: '15px'
        }}>
          <Link
            href={`/dua/${parseInt(id) - 1}`}
            className="nav-card"
            style={{
              opacity: parseInt(id) <= 1 ? 0.5 : 1,
              pointerEvents: parseInt(id) <= 1 ? 'none' : 'auto'
            }}
          >
            <ChevronLeft size={18} />
            <span>Previous Chapter</span>
          </Link>

          <Link
            href={`/dua/${parseInt(id) + 1}`}
            className="nav-card"
            style={{
              opacity: parseInt(id) >= 99 ? 0.5 : 1,
              pointerEvents: parseInt(id) >= 99 ? 'none' : 'auto'
            }}
          >
            <span>Next Chapter</span>
            <ChevronRight size={18} />
          </Link>
        </div>
      </div>

      {/* FOOTER */}
      <div className="main-footer">
        <div>© 2026 Hisn Al-Muslim Digital</div>
        <div style={{ fontSize: '0.8rem', marginTop: '8px', color: '#64748b' }}>
          Complete collection of authentic Duas • Chapter {id} • {chapter.duas.length} Duas
        </div>
      </div>

      {/* Add CSS for pulse animation */}
      <style jsx>{`
        @keyframes pulse {
          0% {
            transform: scale(0.8);
            opacity: 0.7;
          }
          50% {
            transform: scale(1.2);
            opacity: 1;
          }
          100% {
            transform: scale(0.8);
            opacity: 0.7;
          }
        }
      `}</style>
    </main>
  );
}