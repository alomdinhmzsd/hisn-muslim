// app/dua/[id]/page.tsx - WITH REPEAT COUNTER
'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import {
  Home,
  ChevronLeft,
  ChevronRight,
  Volume2,
  Pause,
  Moon,
  Sunrise,
  RotateCcw,
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

// Preset repeat options available as quick-tap buttons
const PRESETS = [1, 3, 5, 10];

export default function DuaPage() {
  const params = useParams();
  const id = params.id as string;

  const [chapter, setChapter] = useState<ChapterType | null>(null);
  const [loading, setLoading] = useState(true);
  const [playingAudio, setPlayingAudio] = useState<number | null>(null);
  const audioRefs = useRef<(HTMLAudioElement | null)[]>([]);

  // --- Repeat counter state ---
  // repeatTarget[i] = how many times the user wants dua[i] to play
  // repeatLeft[i]   = how many plays remain for the current run
  const [repeatTarget, setRepeatTarget] = useState<Record<number, number>>({});
  const [repeatLeft, setRepeatLeft]     = useState<Record<number, number>>({});
  // Track which dua has its custom-input open
  const [editingRepeat, setEditingRepeat] = useState<number | null>(null);
  const [inputValue, setInputValue]       = useState('');

  useEffect(() => {
    if (id) fetchChapterData();
  }, [id]);

  useEffect(() => {
    if (chapter) {
      audioRefs.current = audioRefs.current.slice(0, chapter.duas.length);
    }
  }, [chapter]);

  const fetchChapterData = async () => {
    try {
      if (id === 'introduction') {
        setChapter({ id: 0, title_en: 'Introduction', title_ar: 'مقدمة', duas: [] });
        setLoading(false);
        return;
      }
      if (id === 'merits') {
        setChapter({ id: 999, title_en: 'Merits of Duas', title_ar: 'فضائل الأدعية', duas: [] });
        setLoading(false);
        return;
      }
      const res = await fetch(`/api/hisn?id=${id}`);
      if (res.ok) {
        const data = await res.json();
        setChapter(data);
      }
    } catch (err) {
      console.error('Error fetching chapter:', err);
    } finally {
      setLoading(false);
    }
  };

  // --- Helpers ---
  const getRepeatTarget = (index: number) => repeatTarget[index] ?? 1;
  const getRepeatLeft   = (index: number) => repeatLeft[index]   ?? 0;

  const getAudioPath = (duaIndex: number) => {
    const dua = chapter?.duas[duaIndex];
    return dua?.id ? `/audio/${dua.id}.mp3` : `/audio/${duaIndex + 1}.mp3`;
  };

  // --- Playback ---
  const startPlay = (index: number) => {
    const audio = audioRefs.current[index];
    if (!audio) { playAudioFallback(index); return; }
    const target = getRepeatTarget(index);
    setRepeatLeft(prev => ({ ...prev, [index]: target }));
    audio.currentTime = 0;
    audio.play().catch(() => playAudioFallback(index));
    setPlayingAudio(index);
  };

  const stopPlay = (index: number) => {
    const audio = audioRefs.current[index];
    if (audio) audio.pause();
    setRepeatLeft(prev => ({ ...prev, [index]: 0 }));
    setPlayingAudio(null);
  };

  const toggleAudio = (index: number) => {
    // Stop whatever is currently playing first
    if (playingAudio !== null && playingAudio !== index) {
      stopPlay(playingAudio);
    }
    if (playingAudio === index) {
      stopPlay(index);
    } else {
      startPlay(index);
    }
  };

  // Called every time an audio element fires "ended"
  const handleAudioEnded = (index: number) => {
    if (playingAudio !== index) return;
    const remaining = getRepeatLeft(index) - 1;
    if (remaining > 0) {
      // More repeats to go
      setRepeatLeft(prev => ({ ...prev, [index]: remaining }));
      const audio = audioRefs.current[index];
      if (audio) {
        audio.currentTime = 0;
        audio.play().catch(console.error);
      }
    } else {
      // Done
      setRepeatLeft(prev => ({ ...prev, [index]: 0 }));
      setPlayingAudio(null);
    }
  };

  const playAudioFallback = (index: number) => {
    document.querySelectorAll('audio').forEach(a => { if (!a.paused) a.pause(); });
    const dua = chapter?.duas[index];
    if (!dua?.id) return;
    const audio = new Audio(`/audio/${dua.id}.mp3`);
    const target = getRepeatTarget(index);
    let left = target;
    setRepeatLeft(prev => ({ ...prev, [index]: left }));
    setPlayingAudio(index);
    const playNext = () => {
      left -= 1;
      setRepeatLeft(prev => ({ ...prev, [index]: left }));
      if (left > 0) {
        audio.currentTime = 0;
        audio.play().catch(console.error);
      } else {
        setPlayingAudio(null);
      }
    };
    audio.onended = playNext;
    audio.onpause = () => { if (left > 0) setPlayingAudio(null); };
    audio.play().catch(console.error);
  };

  // --- Repeat counter controls ---
  const setRepeat = (index: number, value: number) => {
    const clamped = Math.max(1, Math.min(99, value));
    setRepeatTarget(prev => ({ ...prev, [index]: clamped }));
    // If currently playing, update remaining so the new target takes effect next time
    if (playingAudio === index) {
      setRepeatLeft(prev => ({ ...prev, [index]: clamped }));
    }
  };

  const adjustRepeat = (index: number, delta: number) => {
    setRepeat(index, getRepeatTarget(index) + delta);
  };

  const openInput = (index: number) => {
    setEditingRepeat(index);
    setInputValue(String(getRepeatTarget(index)));
  };

  const commitInput = (index: number) => {
    const parsed = parseInt(inputValue, 10);
    if (!isNaN(parsed)) setRepeat(index, parsed);
    setEditingRepeat(null);
  };

  // --- Render helpers ---
  const isPlaying   = (i: number) => playingAudio === i;
  const currentLeft = (i: number) => getRepeatLeft(i);
  const target      = (i: number) => getRepeatTarget(i);

  // ---- Early returns ----
  if (id === 'introduction' || id === 'merits') {
    return (
      <main className="container">
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <h1>{id === 'introduction' ? 'Introduction' : 'Merits of Duas'}</h1>
          <p>This page is under construction.</p>
          <Link href="/" className="nav-card" style={{ display: 'inline-flex', marginTop: '20px' }}>
            <Home size={18} /><span>Back to Home</span>
          </Link>
        </div>
      </main>
    );
  }

  if (loading) {
    return <main className="container"><div className="loading-state">Loading Chapter...</div></main>;
  }

  if (!chapter) {
    return (
      <main className="container">
        <div className="no-content">
          <h3>Chapter Not Found</h3>
          <Link href="/" className="nav-card" style={{ display: 'inline-flex', marginTop: '20px' }}>
            <Home size={18} /><span>Back to Home</span>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container">
      {/* Hidden audio elements */}
      {chapter.duas.map((dua, index) => (
        <audio
          key={`audio-${dua.id || index}`}
          ref={(el: HTMLAudioElement | null) => { if (el) audioRefs.current[index] = el; }}
          src={getAudioPath(index)}
          onEnded={() => handleAudioEnded(index)}
          onPause={() => { if (playingAudio === index && getRepeatLeft(index) === 0) setPlayingAudio(null); }}
          preload="metadata"
        />
      ))}

      {/* ── HEADER ── */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(139,195,74,0.15) 0%, rgba(15,23,42,0.8) 100%)',
        padding: '40px 30px 20px',
        borderRadius: '20px',
        border: '2px solid rgba(139,195,74,0.2)',
        marginBottom: '30px',
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)',
          background: 'linear-gradient(135deg,#8bc34a,#689f38)',
          color: '#0f172a', padding: '6px 20px', borderRadius: '20px',
          fontWeight: '700', fontSize: '0.85rem',
          display: 'flex', alignItems: 'center', gap: '8px',
        }}>
          <Moon size={14} />Chapter {id}<Sunrise size={14} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <div style={{ flex: 1 }}>
            <h1 style={{ margin: 0, color: '#f8fafc', fontSize: '1.8rem', fontWeight: '700' }}>{chapter.title_en}</h1>
            <div style={{ color: '#94a3b8', fontSize: '0.95rem', marginTop: '5px' }}>{chapter.duas.length} Duas in this chapter</div>
          </div>
          <div style={{ flex: 1, textAlign: 'right', direction: 'rtl' }}>
            <h1 style={{ margin: 0, color: '#8bc34a', fontSize: '1.8rem', fontWeight: '700', fontFamily: "'Amiri', serif" }}>{chapter.title_ar}</h1>
            <div style={{ color: '#94a3b8', fontSize: '0.95rem', marginTop: '5px', direction: 'rtl' }}>{chapter.duas.length} أدعية في هذا الفصل</div>
          </div>
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px', marginTop: '20px',
          padding: '10px 15px', background: 'rgba(30,41,59,0.5)', borderRadius: '10px',
        }}>
          <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ width: '100%', height: '100%', background: 'linear-gradient(90deg,#8bc34a,#689f38)', borderRadius: '2px' }} />
          </div>
          <div style={{ color: '#8bc34a', fontSize: '0.85rem', fontWeight: '600', whiteSpace: 'nowrap' }}>Complete Chapter</div>
        </div>
      </div>

      {/* ── DUA CARDS ── */}
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {chapter.duas.map((dua, index) => (
          <div key={dua.id || index} style={{
            background: 'rgba(30,41,59,0.6)', borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.1)', marginBottom: '25px',
            overflow: 'hidden', transition: 'all 0.3s ease', position: 'relative',
          }}>
            {/* Dua number badge */}
            <div style={{
              position: 'absolute', top: '15px', left: '15px',
              width: '32px', height: '32px',
              background: 'rgba(139,195,74,0.2)', border: '2px solid rgba(139,195,74,0.4)',
              borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#8bc34a', fontWeight: '700', fontSize: '0.9rem', zIndex: 1,
            }}>
              {index + 1}
            </div>

            <div style={{ padding: '30px' }}>
              {/* ── Translation row with audio + repeat counter ── */}
              <div style={{ marginBottom: '25px' }}>
                <div style={{
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between', marginBottom: '15px',
                  flexWrap: 'wrap', gap: '10px',
                }}>
                  {/* Label */}
                  <div style={{
                    color: '#94a3b8', fontSize: '0.9rem', fontWeight: '600',
                    textTransform: 'uppercase', letterSpacing: '0.5px',
                  }}>
                    Translation
                  </div>

                  {/* ── Audio + Repeat Counter Group ── */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>

                    {/* Repeat counter pill */}
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      background: 'rgba(15,23,42,0.5)',
                      border: '1px solid rgba(139,195,74,0.25)',
                      borderRadius: '24px', padding: '4px 8px',
                    }}>
                      {/* − button */}
                      <button
                        onClick={() => adjustRepeat(index, -1)}
                        disabled={target(index) <= 1}
                        style={{
                          width: '24px', height: '24px', borderRadius: '50%',
                          background: target(index) <= 1 ? 'rgba(255,255,255,0.05)' : 'rgba(139,195,74,0.15)',
                          border: '1px solid rgba(139,195,74,0.3)',
                          color: target(index) <= 1 ? '#475569' : '#8bc34a',
                          cursor: target(index) <= 1 ? 'default' : 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: '700', fontSize: '1rem', lineHeight: 1,
                          transition: 'all 0.15s',
                        }}
                        aria-label="Decrease repeat count"
                      >−</button>

                      {/* Count display / input toggle */}
                      {editingRepeat === index ? (
                        <input
                          autoFocus
                          type="number"
                          min={1} max={99}
                          value={inputValue}
                          onChange={e => setInputValue(e.target.value)}
                          onBlur={() => commitInput(index)}
                          onKeyDown={e => { if (e.key === 'Enter') commitInput(index); if (e.key === 'Escape') setEditingRepeat(null); }}
                          style={{
                            width: '38px', textAlign: 'center',
                            background: 'rgba(139,195,74,0.1)',
                            border: '1px solid #8bc34a', borderRadius: '6px',
                            color: '#8bc34a', fontWeight: '700', fontSize: '0.9rem',
                            padding: '2px 4px', outline: 'none',
                          }}
                        />
                      ) : (
                        <button
                          onClick={() => openInput(index)}
                          title="Click to type a custom number"
                          style={{
                            minWidth: '38px', textAlign: 'center',
                            background: 'transparent', border: 'none',
                            color: isPlaying(index) ? '#ffca28' : '#8bc34a',
                            fontWeight: '700', fontSize: '0.95rem',
                            cursor: 'pointer', padding: '2px 4px',
                            transition: 'color 0.2s',
                          }}
                          aria-label="Click to set custom repeat count"
                        >
                          {/* Show "2/5" during playback, otherwise just the target */}
                          {isPlaying(index) && currentLeft(index) > 0
                            ? `${currentLeft(index)}/${target(index)}`
                            : `${target(index)}×`}
                        </button>
                      )}

                      {/* + button */}
                      <button
                        onClick={() => adjustRepeat(index, 1)}
                        disabled={target(index) >= 99}
                        style={{
                          width: '24px', height: '24px', borderRadius: '50%',
                          background: 'rgba(139,195,74,0.15)',
                          border: '1px solid rgba(139,195,74,0.3)',
                          color: '#8bc34a',
                          cursor: target(index) >= 99 ? 'default' : 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: '700', fontSize: '1rem', lineHeight: 1,
                          transition: 'all 0.15s',
                        }}
                        aria-label="Increase repeat count"
                      >+</button>
                    </div>

                    {/* Preset quick-tap buttons */}
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {PRESETS.map(n => (
                        <button
                          key={n}
                          onClick={() => setRepeat(index, n)}
                          style={{
                            padding: '4px 8px', borderRadius: '8px', fontSize: '0.78rem',
                            fontWeight: '700', cursor: 'pointer', transition: 'all 0.15s',
                            background: target(index) === n
                              ? 'rgba(139,195,74,0.3)'
                              : 'rgba(255,255,255,0.05)',
                            border: `1px solid ${target(index) === n ? '#8bc34a' : 'rgba(255,255,255,0.1)'}`,
                            color: target(index) === n ? '#8bc34a' : '#64748b',
                          }}
                          aria-label={`Set repeat to ${n}`}
                        >
                          {n}×
                        </button>
                      ))}
                    </div>

                    {/* Audio play/pause button */}
                    <button
                      onClick={() => toggleAudio(index)}
                      style={{
                        background: isPlaying(index) ? 'rgba(139,195,74,0.3)' : 'rgba(139,195,74,0.1)',
                        border: `2px solid ${isPlaying(index) ? '#8bc34a' : 'rgba(139,195,74,0.3)'}`,
                        color: isPlaying(index) ? '#fff' : '#8bc34a',
                        width: '42px', height: '42px', borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', transition: 'all 0.2s', position: 'relative',
                      }}
                      aria-label={isPlaying(index) ? 'Stop audio' : 'Play audio'}
                    >
                      {isPlaying(index) ? <Pause size={18} /> : <Volume2 size={18} />}
                      {isPlaying(index) && (
                        <div style={{
                          position: 'absolute', width: '6px', height: '6px',
                          background: '#8bc34a', borderRadius: '50%',
                          top: '5px', right: '5px', animation: 'pulse 1.5s infinite',
                        }} />
                      )}
                    </button>

                    {/* Reset repeat indicator (only shown mid-playback) */}
                    {isPlaying(index) && (
                      <button
                        onClick={() => stopPlay(index)}
                        title="Stop & reset"
                        style={{
                          background: 'rgba(255,100,100,0.1)', border: '1px solid rgba(255,100,100,0.3)',
                          color: '#f87171', borderRadius: '8px', padding: '6px 8px',
                          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px',
                          fontSize: '0.75rem', fontWeight: '600',
                        }}
                      >
                        <RotateCcw size={12} /> Stop
                      </button>
                    )}
                  </div>
                </div>

                <div style={{
                  background: 'rgba(15,23,42,0.4)', padding: '20px', borderRadius: '10px',
                  lineHeight: '1.7', color: '#e2e8f0', fontSize: '1.05rem',
                }}>
                  {dua.text_en}
                </div>
              </div>

              {/* Arabic */}
              <div style={{ marginBottom: '25px' }}>
                <div style={{
                  color: '#8bc34a', fontSize: '0.9rem', fontWeight: '600',
                  textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '15px',
                  display: 'flex', alignItems: 'center', gap: '8px',
                }}>
                  <div style={{
                    width: '24px', height: '24px', background: 'rgba(139,195,74,0.2)',
                    borderRadius: '4px', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold',
                  }}>ع</div>
                  Arabic
                </div>
                <div style={{
                  background: 'rgba(15,23,42,0.6)', padding: '25px', borderRadius: '10px',
                  border: '2px solid rgba(139,195,74,0.2)',
                  fontFamily: "'Amiri', serif", fontSize: '1.8rem', lineHeight: '1.8',
                  color: '#8bc34a', textAlign: 'center', direction: 'rtl', fontWeight: '700',
                }}>
                  {dua.text_ar}
                </div>
              </div>

              {/* Transliteration */}
              <div style={{ marginBottom: dua.reference ? '0' : '0' }}>
                <div style={{
                  color: '#94a3b8', fontSize: '0.9rem', fontWeight: '600',
                  textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '15px',
                  display: 'flex', alignItems: 'center', gap: '8px',
                }}>
                  <div style={{
                    width: '24px', height: '24px', background: 'rgba(255,255,255,0.05)',
                    borderRadius: '4px', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: '0.8rem', fontStyle: 'italic', fontWeight: 'bold',
                  }}>T</div>
                  Transliteration
                </div>
                <div style={{
                  background: 'rgba(15,23,42,0.3)', padding: '20px', borderRadius: '10px',
                  fontStyle: 'italic', lineHeight: '1.8', color: '#cbd5e1', fontSize: '1rem',
                }}>
                  {dua.transliteration || 'Transliteration not available'}
                </div>
              </div>

              {/* Reference */}
              {dua.reference && (
                <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: '600', marginBottom: '5px' }}>Reference</div>
                  <div style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.5' }}>{dua.reference}</div>
                </div>
              )}
            </div>

            {/* Bottom accent */}
            <div style={{
              height: '4px',
              background: 'linear-gradient(90deg, rgba(139,195,74,0.3), rgba(139,195,74,0.1))',
            }} />
          </div>
        ))}
      </div>

      {/* ── NAVIGATION ── */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        margin: '40px 0', padding: '20px',
        background: 'rgba(30,41,59,0.4)', borderRadius: '12px',
      }}>
        <Link href="/" className="nav-card"><Home size={18} /><span>Home</span></Link>
        <div style={{ display: 'flex', gap: '15px' }}>
          <Link href={`/dua/${parseInt(id) - 1}`} className="nav-card"
            style={{ opacity: parseInt(id) <= 1 ? 0.5 : 1, pointerEvents: parseInt(id) <= 1 ? 'none' : 'auto' }}>
            <ChevronLeft size={18} /><span>Previous Chapter</span>
          </Link>
          <Link href={`/dua/${parseInt(id) + 1}`} className="nav-card"
            style={{ opacity: parseInt(id) >= 99 ? 0.5 : 1, pointerEvents: parseInt(id) >= 99 ? 'none' : 'auto' }}>
            <span>Next Chapter</span><ChevronRight size={18} />
          </Link>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <div className="main-footer">
        <div>© 2026 Hisn Al-Muslim Digital</div>
        <div style={{ fontSize: '0.8rem', marginTop: '8px', color: '#64748b' }}>
          Complete collection of authentic Duas • Chapter {id} • {chapter.duas.length} Duas
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%   { transform: scale(0.8); opacity: 0.7; }
          50%  { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(0.8); opacity: 0.7; }
        }
        button:focus-visible { outline: 2px solid #8bc34a; outline-offset: 2px; }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }
      `}</style>
    </main>
  );
}
