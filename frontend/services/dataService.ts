// Complete data service for your actual JSON structure
import rawData from '@/data/duaData.json';
import introductionData from '@/data/introduction.json';
import meritData from '@/data/merit.json';

// Define interfaces based on your actual data
export interface Dua {
  id: number;
  arabic: string;
  translation: string;
  transliteration?: string;
  reference?: string;
  source?: string;
  audio?: string;
}

export interface Chapter {
  id: number;
  chapter_id: number;
  title_english: string;
  title_arabic: string;
  duas: Dua[];
}

export interface TOCItem {
  chapter_id: number;
  title_en: string;
  title_ar: string;
  dua_count: number;
}

// Log the raw data structure for debugging
// console.log('===== DATA DEBUGGING =====');
// console.log('Raw data structure:', {
//   hasTitle: !!rawData.title,
//   totalDuas: rawData.total_duas,
//   chaptersCount: rawData.chapters?.length || 0
// });
// console.log('=========================');

// Process the data
const processDuaData = () => {
  const chapters: { [key: number]: Dua[] } = {};
  const toc: TOCItem[] = [];

  if (rawData.chapters && Array.isArray(rawData.chapters)) {
  // console.log(`Found ${rawData.chapters.length} chapters`);

    // Process each chapter
    rawData.chapters.forEach((chapter: any) => {
      const chapterId = chapter.chapter_id;

      // Map the duas for this chapter
      if (chapter.duas && Array.isArray(chapter.duas)) {
        chapters[chapterId] = chapter.duas.map((dua: any) => ({
          id: dua.id,
          arabic: dua.arabic || '',
          translation: dua.translation || '',
          transliteration: dua.transliteration || '',
          reference: dua.reference || '',
          source: dua.source || '',
          audio: dua.audio || ''
        }));
      } else {
        chapters[chapterId] = [];
      }

      // Add to TOC
      toc.push({
        chapter_id: chapterId,
        title_en: chapter.title_english || `Chapter ${chapterId}`,
        title_ar: chapter.title_arabic || `الفصل ${chapterId}`,
        dua_count: chapters[chapterId].length
      });
    });

    // Sort by chapter_id
    toc.sort((a, b) => a.chapter_id - b.chapter_id);
  }

  return { chapters, toc };
};

const { chapters, toc } = processDuaData();

export const dataService = {
  // Get all TOC data
  getTOC: (): TOCItem[] => {
    return toc;
  },

  // Get complete chapter by ID
  getChapterById: (id: string | number): any | null => {
    const chapterId = typeof id === 'string' ? parseInt(id) : id;

    // Find the chapter in the raw data
    const rawChapter = rawData.chapters?.find((ch: any) => ch.chapter_id === chapterId);

    if (!rawChapter) {
   //console.log(`No chapter found for ID ${chapterId}`);
      return null;
    }

   // console.log(`Found chapter ${chapterId}:`, rawChapter.title_english);

    // Return in the format expected by your page
    return {
      id: chapterId,
      title_en: rawChapter.title_english || `Chapter ${chapterId}`,
      title_ar: rawChapter.title_arabic || `الفصل ${chapterId}`,
      duas: rawChapter.duas.map((dua: any) => ({
        id: String(dua.id),
        text_ar: dua.arabic || '',
        text_en: dua.translation || '',
        transliteration: dua.transliteration || '',
        reference: dua.reference || '',
        source: dua.source || '',
        audio: dua.audio || ''
      }))
    };
  },

  // Get introduction
  getIntroduction: () => {
    return introductionData;
  },

  // Get merits
  getMerits: () => {
    return meritData;
  },

  // Search
  searchDuas: (query: string): { chapterId: number; duas: any[] }[] => {
    const lowercaseQuery = query.toLowerCase();
    const results: { chapterId: number; duas: any[] }[] = [];

    rawData.chapters?.forEach((chapter: any) => {
      const matchedDuas = chapter.duas.filter((dua: any) =>
        dua.translation?.toLowerCase().includes(lowercaseQuery) ||
        dua.arabic?.includes(query) ||
        dua.transliteration?.toLowerCase().includes(lowercaseQuery)
      );

      if (matchedDuas.length > 0) {
        results.push({
          chapterId: chapter.chapter_id,
          duas: matchedDuas.map((dua: any) => ({
            id: String(dua.id),
            text_ar: dua.arabic || '',
            text_en: dua.translation || '',
            transliteration: dua.transliteration || '',
            reference: dua.reference || '',
            source: dua.source || '',
            audio: dua.audio || ''
          }))
        });
      }
    });

    return results;
  },

  // Debug helper
  debug: () => {
    return {
      rawDataTitle: rawData.title,
      totalDuas: rawData.total_duas,
      chaptersCount: rawData.chapters?.length || 0,
      firstChapter: rawData.chapters?.[0],
      processedChapters: Object.keys(chapters).length,
      processedToc: toc
    };
  }
};