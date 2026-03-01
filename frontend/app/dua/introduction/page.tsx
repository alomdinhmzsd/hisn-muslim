// app/dua/introduction/page.tsx
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
}

interface ChapterType {
  title_en: string;
  title_ar: string;
  author?: string;
  duas?: DuaType[];
}

export default function IntroductionPage() {
  const [chapter, setChapter] = useState<ChapterType | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    fetchIntroductionData();
  }, []);

  const fetchIntroductionData = async () => {
    try {
      const res = await fetch(`http://localhost:3050/api/hisn?id=0`, {
        cache: 'no-store'
      });

      if (res.ok) {
        const data = await res.json();
        setChapter(data);
      }
    } catch (err) {
      console.error('Error fetching introduction:', err);
    } finally {
      setLoading(false);
    }
  };

  const playAudio = () => {
    if (isPlaying && audio) {
      audio.pause();
      setIsPlaying(false);
    } else {
      const newAudio = new Audio('/audio/intro.mp3');
      newAudio.play();
      newAudio.onended = () => setIsPlaying(false);
      setAudio(newAudio);
      setIsPlaying(true);
    }
  };

  if (loading) {
    return (
      <main className="container">
        <div className="loading-state">Loading Introduction...</div>
      </main>
    );
  }

  return (
    <main className="container">
      {/* CLEAN HEADER - CORRECTED ORDER */}
      <div className="clean-header">
        {/* First Row: English Title - Left Side */}
        <div className="header-english">
          <h1>Fortress of the Muslim (Hisn al-Muslim)</h1>
          {/* Second Row: Subtitle - Left Side */}
          <div className="header-subtitle">Introduction</div>
        </div>

        {/* Audio Icon - Center */}
        <button
          onClick={playAudio}
          className="audio-icon-button"
          aria-label={isPlaying ? "Pause audio" : "Play audio"}
        >
          <Volume2 size={28} />
          {isPlaying && <div className="pulse-dot"></div>}
        </button>

        {/* First Row: Arabic Title - Right Side */}
        <div className="header-arabic">
          <h1>حصن المسلم</h1>
          {/* Second Row: Subtitle - Right Side */}
          <div className="header-subtitle">المقدمة</div>
        </div>
      </div>

      {/* NEWSPAPER COLUMNS */}
      <div className="newspaper-container">
        <div className="newspaper-columns">
          {/* LEFT COLUMN - English */}
          <div className="column-left">
            {chapter?.duas && chapter.duas.length > 0 ? (
              <div className="newspaper-content">
                {chapter.duas.map((dua: DuaType, index: number) => (
                  <div key={index} className="newspaper-paragraph">
                    {dua.text_en && (
                      <>
                        {index === 0 ? (
                          <p className="paragraph-text drop-cap">{dua.text_en}</p>
                        ) : (
                          <p className="paragraph-text">{dua.text_en}</p>
                        )}
                        {dua.reference && (
                          <div className="footnote">
                            <sup>{index + 1}</sup>
                            <span>{dua.reference}</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}

                {/* STYLED AUTHOR INFO */}
                <div className="styled-author-info">
                  <div className="author-divider"></div>
                  <div className="author-content">
                    <div className="author-title">Author</div>
                    <div className="author-name">Sa'id b. 'Ali b. Wahf al-Qahtani</div>
                    <div className="author-date">Safar, 1409H</div>
                    <div className="author-description">
                      This abridged work contains authentic duas and remembrances
                      from the Quran and Sunnah, compiled for ease of travel and daily use.
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="fallback-content">
                <p className="drop-cap">Surely all praise is for Allah. We praise Him, seek His help, and ask His forgiveness. We seek refuge in Him from the evil of our own souls and from the wickedness of our deeds. Whomever He guides then nothing can make him lost, and whoever He makes lost then nothing can guide him.</p>

                <p>I bear witness that none has the right to be worshipped but Allah, alone, Who has no partner, and I bear witness that Muhammad is His slave and His Messenger. May Allah send prayers upon him and upon his family and his Companions and those who follow them in piety until the Day of Judgement and may He send copius peace (upon them).</p>

                <p>This is an abridgement that I have abridged from my earlier work entitled "Ath-Thikr wad-Dua wal-Ilaj bir-Ruqa minal-kitab was-Sunnah". I have abridged in it the section on words of remembrance (i.e. dhikr) in order to make it easy to carry in travels.</p>

                <div className="styled-author-info">
                  <div className="author-divider"></div>
                  <div className="author-content">
                    <div className="author-title">Author</div>
                    <div className="author-name">Sa'id b. 'Ali b. Wahf al-Qahtani</div>
                    <div className="author-date">Safar, 1409H</div>
                    <div className="author-description">
                      This abridged work contains authentic duas and remembrances
                      from the Quran and Sunnah, compiled for ease of travel and daily use.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN - Arabic */}
          <div className="column-right">
            {chapter?.duas && chapter.duas.length > 0 ? (
              <div className="newspaper-content arabic-text">
                {chapter.duas.map((dua: DuaType, index: number) => (
                  <div key={index} className="newspaper-paragraph">
                    {dua.text_ar && (
                      <>
                        {index === 0 ? (
                          <p className="paragraph-text drop-cap-arabic">{dua.text_ar}</p>
                        ) : (
                          <p className="paragraph-text">{dua.text_ar}</p>
                        )}
                        {dua.reference && (
                          <div className="footnote">
                            <sup>{index + 1}</sup>
                            <span>{dua.reference}</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}

                {/* ARABIC AUTHOR INFO */}
                <div className="styled-author-info arabic">
                  <div className="author-divider"></div>
                  <div className="author-content">
                    <div className="author-title">المؤلف</div>
                    <div className="author-name">سعيد بن علي بن وهف القحطاني</div>
                    <div className="author-date">صفر 1409هـ</div>
                    <div className="author-description">
                      هذا المختصر يحتوي على أذكار وأدعية صحيحة من القرآن والسنة،
                      جمعت لتسهيل الحمل في الأسفار والاستخدام اليومي.
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="fallback-content arabic-text">
                <p className="drop-cap-arabic">إن الحمد لله ، نحمده ونستعينه ، ونستغفره ونعوذ بالله من شرور أنفسنا ، وسيئات أعمالنا ، من يهده الله فلا مضل له ، ومن يضلل فلا هادي له ، وأشهد أن لا إله إلا الله وحده لا شريك له ، وأشهد أن محمداً عبده ورسوله صلى الله عليه وعلى آله وأصحابه ومن تبعهم بإحسان إلى يوم الدين وسلم تسليماً كثيراً ، أما بعد .</p>

                <p>فهذا مختصر اختصرته من كتابي (( الذكر والدعاء والعلاج بالرقي من الكتاب والسنة )) اختصرت فيه قسم الأذكار؛ ليكون خفيف الحمل في الأسفار .</p>

                <div className="styled-author-info arabic">
                  <div className="author-divider"></div>
                  <div className="author-content">
                    <div className="author-title">المؤلف</div>
                    <div className="author-name">سعيد بن علي بن وهف القحطاني</div>
                    <div className="author-date">صفر 1409هـ</div>
                    <div className="author-description">
                      هذا المختصر يحتوي على أذكار وأدعية صحيحة من القرآن والسنة،
                      جمعت لتسهيل الحمل في الأسفار والاستخدام اليومي.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* HOME LINK AT BOTTOM */}
      <div style={{ textAlign: 'center', marginTop: '50px', marginBottom: '30px' }}>
        <Link href="/" className="nav-card" style={{ display: 'inline-flex' }}>
          <Home size={18} />
          <span>Back to Home</span>
        </Link>
      </div>
    </main>
  );
}