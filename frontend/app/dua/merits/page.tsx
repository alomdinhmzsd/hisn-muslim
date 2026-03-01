// app/dua/merits/page.tsx (UPDATED WITH INLINE FOOTNOTES)
'use client';

import Link from 'next/link';
import { Home, Volume2 } from 'lucide-react';
import { useState, useEffect } from 'react';

interface DuaType {
  id: string;
  text_ar: string;
  text_en: string;
  transliteration?: string;
  reference?: string;
  footnote?: string; // Add footnote property
}

interface ChapterType {
  title_en: string;
  title_ar: string;
  author?: string;
  duas?: DuaType[];
}

export default function MeritsPage() {
  const [chapter, setChapter] = useState<ChapterType | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    fetchMeritsData();
  }, []);

  const fetchMeritsData = async () => {
    try {
      const res = await fetch(`http://localhost:3050/api/hisn?id=999`, {
        cache: 'no-store'
      });

      if (res.ok) {
        const data = await res.json();
        setChapter(data);
      }
    } catch (err) {
      console.error('Error fetching merits:', err);
    } finally {
      setLoading(false);
    }
  };

  const playAudio = () => {
    if (isPlaying && audio) {
      audio.pause();
      setIsPlaying(false);
    } else {
      const newAudio = new Audio('/audio/dhikr.mp3');
      newAudio.play();
      newAudio.onended = () => setIsPlaying(false);
      setAudio(newAudio);
      setIsPlaying(true);
    }
  };

  // Sample data with inline footnotes if no API data
  const defaultMeritsData = {
    title_en: "Merits of Remembrance",
    title_ar: "فضائل الذكر",
    duas: [
      {
        id: "1",
        text_en: "Allah the All-Mighty has said: 'Therefore remember Me. I will remember you. Be grateful to Me and never show Me ingratitude'<sup>1</sup>.",
        footnote: "Al-Baqarah 2:152",
        text_ar: "قال الله تعالى: { فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُواْ لِي وَلاَ تَكْفُرُونِ }<sup>1</sup>",
        footnote_ar: "سورة البقرة آية :152"
      },
      {
        id: "2",
        text_en: "And He said: 'O you who believe, remember Allah with much remembrance.'<sup>2</sup>",
        footnote: "Al-Ahzab 33:41",
        text_ar: "{ يَا أَيُّهَا الَّذِينَ آمَنُوا اذْكُرُوا اللَّهَ ذِكْراً كَثِيراً}<sup>2</sup>",
        footnote_ar: "سورة الأحزاب آية :41"
      },
      {
        id: "3",
        text_en: "And He said: 'And the men and women who remember Allah frequently, Allah has prepared for them forgiveness and great reward.'<sup>3</sup>",
        footnote: "Al-Ahzab 33:35",
        text_ar: "{ وَالذَّاكِرِينَ اللَّهَ كَثِيراً وَالذَّاكِرَاتِ أَعَدَّ اللَّهُ لَهُم مَّغْفِرَةً وَأَجْراً عَظِيماً}<sup>3</sup>",
        footnote_ar: "سورة الأحزاب آية :35"
      },
      {
        id: "4",
        text_en: "And He said: 'And remember your Lord by your tongue and within yourself, humbly and in awe, without loudness, by words in the morning and in the afternoon, and be not among those who are neglectful.'<sup>4</sup>",
        footnote: "Al-Araf 7:205",
        text_ar: "{ وَاذْكُر رَّبَّكَ فِي نَفْسِكَ تَضَرُّعاً وَخِيفَةً وَدُونَ الْجَهْرِ مِنَ الْقَوْلِ بِالْغُدُوِّ وَالآصَالِ وَلاَ تَكُن مِّنَ الْغَافِلِينَ }<sup>4</sup>",
        footnote_ar: "سورة الأعراف، آية :205"
      },
      {
        id: "5",
        text_en: "The Prophet (pbuh) said: 'He who remembers his Lord and he who does not remember his Lord are like the living and the dead.'<sup>5</sup>",
        footnote: "Al-Bukhari, cf., Al-Asqalani, Fathul-Bari 11/208; Muslim 1/539",
        text_ar: "وقال صلى الله عليه وسلم: 'مثل الذي يذكر ربه والذي لا يذكر ربه مثل الحي والميت '<sup>5</sup>",
        footnote_ar: "البخاري مع الفتح 11/208 ومسلم بلفظ 'مثل البيت الذي يذكر الله فيه والبيت الذي لا يذكر الله فيه مثل الحي والميت' 1/539"
      },
      // Add more items as needed...
    ]
  };

  if (loading) {
    return (
      <main className="container">
        <div className="loading-state">Loading Merits...</div>
      </main>
    );
  }

  const displayData = chapter?.duas && chapter.duas.length > 0 ? chapter : defaultMeritsData;

  return (
    <main className="container">
      {/* CLEAN HEADER - Gold/Yellow Theme */}
      <div className="clean-header">
        {/* First Row: English Title - Left Side */}
        <div className="header-english">
          <h1>Fortress of the Muslim (Hisn al-Muslim)</h1>
          {/* Second Row: Subtitle - Left Side */}
          <div className="header-subtitle">Merits of Remembrance</div>
        </div>

        {/* Audio Icon - Center */}
        <button
          onClick={playAudio}
          className="audio-icon-button"
          aria-label={isPlaying ? "Pause audio" : "Play audio"}
          style={{
            background: 'rgba(255, 202, 40, 0.2)',
            border: '2px solid rgba(255, 202, 40, 0.4)',
            color: '#ffca28'
          }}
        >
          <Volume2 size={28} />
          {isPlaying && <div className="pulse-dot" style={{ background: '#ffca28' }}></div>}
        </button>

        {/* First Row: Arabic Title - Right Side */}
        <div className="header-arabic">
          <h1 style={{ color: '#ffca28' }}>حصن المسلم</h1>
          {/* Second Row: Subtitle - Right Side */}
          <div className="header-subtitle">فضائل الذكر</div>
        </div>
      </div>

      {/* NEWSPAPER COLUMNS - Gold Theme */}
      <div className="newspaper-container">
        <div className="newspaper-columns">
          {/* LEFT COLUMN - English */}
          <div className="column-left">
            {/* Custom Column Header for Merits */}
            <div className="column-header" style={{ borderBottomColor: 'rgba(255, 202, 40, 0.4)' }}>
              <div className="column-label" style={{ color: '#ffca28' }}>
                Merits & Virtues
              </div>
              <div className="column-subtitle">
                English Translation with References
              </div>
            </div>

            <div className="newspaper-content">
              {displayData.duas?.map((dua: DuaType, index: number) => (
                <div key={index} className="newspaper-paragraph">
                  <p
                    className="paragraph-text"
                    dangerouslySetInnerHTML={{ __html: dua.text_en }}
                    style={{
                      marginBottom: '10px',
                      textAlign: 'justify',
                      hyphens: 'auto'
                    }}
                  ></p>

                  {dua.footnote && (
                    <div
                      className="inline-footnote"
                      style={{
                        display: 'inline-block',
                        marginLeft: '10px',
                        color: '#ffca28',
                        fontSize: '0.85rem',
                        verticalAlign: 'super',
                        fontWeight: '600'
                      }}
                    >
                      {dua.footnote}
                    </div>
                  )}
                </div>
              ))}

              {/* STYLED AUTHOR INFO - Gold Theme */}
              <div className="styled-author-info" style={{
                borderLeft: '4px solid #ffca28',
                background: 'rgba(255, 202, 40, 0.05)',
                marginTop: '40px'
              }}>
                <div className="author-divider" style={{ background: 'rgba(255, 202, 40, 0.5)' }}></div>
                <div className="author-content">
                  <div className="author-title" style={{ color: '#ffca28' }}>The Importance of Dhikr</div>
                  <div className="author-description">
                    The remembrance of Allah (Dhikr) is the foundation of a believer's spiritual life. It purifies the heart, strengthens faith, and brings one closer to the Creator. Through consistent remembrance, a Muslim finds peace in this life and secures immense rewards in the hereafter.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - Arabic */}
          <div className="column-right">
            {/* Custom Column Header for Merits */}
            <div className="column-header" style={{
              borderBottomColor: 'rgba(255, 202, 40, 0.4)',
              textAlign: 'right'
            }}>
              <div className="column-label" style={{ color: '#ffca28' }}>
                الفضائل والمزايا
              </div>
              <div className="column-subtitle">
                النص العربي مع المراجع
              </div>
            </div>

            <div className="newspaper-content arabic-text">
              {displayData.duas?.map((dua: DuaType, index: number) => (
                <div key={index} className="newspaper-paragraph">
                  <p
                    className="paragraph-text"
                    dangerouslySetInnerHTML={{ __html: dua.text_ar }}
                    style={{
                      marginBottom: '10px',
                      textAlign: 'justify',
                      direction: 'rtl'
                    }}
                  ></p>

                  {/* For Arabic footnotes, you might need a different property or structure */}
                  <div
                    className="inline-footnote arabic"
                    style={{
                      display: 'inline-block',
                      marginRight: '10px',
                      color: '#ffca28',
                      fontSize: '0.85rem',
                      verticalAlign: 'super',
                      fontWeight: '600',
                      direction: 'rtl'
                    }}
                  >
                    {/* You might need to add footnote_ar property to your data */}
                    {(dua as any).footnote_ar || ''}
                  </div>
                </div>
              ))}

              {/* ARABIC AUTHOR INFO - Gold Theme */}
              <div className="styled-author-info arabic" style={{
                borderRight: '4px solid #ffca28',
                background: 'rgba(255, 202, 40, 0.05)',
                marginTop: '40px'
              }}>
                <div className="author-divider" style={{
                  background: 'rgba(255, 202, 40, 0.5)',
                  marginLeft: 'auto',
                  marginRight: '0'
                }}></div>
                <div className="author-content">
                  <div className="author-title" style={{ color: '#ffca28' }}>أهمية الذكر</div>
                  <div className="author-description">
                    ذكر الله تعالى هو أساس الحياة الروحية للمؤمن. يطهر القلب، ويقوي الإيمان، ويقرب العبد من خالقه. من خلال الذكر المستمر، يجد المسلم الطمأنينة في هذه الحياة ويضمن الأجر العظيم في الآخرة.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA SECTION - Gold Theme */}
      <div className="cta-section" style={{
        background: 'linear-gradient(135deg, rgba(255, 202, 40, 0.1) 0%, rgba(15, 23, 42, 0.8) 100%)',
        border: '2px solid rgba(255, 202, 40, 0.3)'
      }}>
        <h3 style={{ color: '#ffca28' }}>Start Your Journey of Remembrance</h3>
        <p>Begin incorporating these powerful remembrances into your daily life and experience their transformative benefits</p>
        <Link
          href="/dua/1"
          className="cta-button large"
          style={{
            background: 'linear-gradient(135deg, #ffca28, #ffa000)',
            color: '#0f172a'
          }}
        >
          Explore All Duas
        </Link>
      </div>

      {/* HOME LINK AT BOTTOM */}
      <div style={{ textAlign: 'center', marginTop: '30px', marginBottom: '50px' }}>
        <Link href="/" className="nav-card" style={{ display: 'inline-flex' }}>
          <Home size={18} />
          <span>Back to Home</span>
        </Link>
      </div>
    </main>
  );
}