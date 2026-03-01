import { NextResponse } from 'next/server';
import { dataService } from '../../../services/dataService';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const type = searchParams.get('type');
    const debug = searchParams.get('debug');

    // console.log('🔵 API called with:', { id, type, debug });

    // Debug endpoint
    if (debug === 'true') {
      const debugInfo = dataService.debug();
      return NextResponse.json(debugInfo);
    }

    // Handle chapter request by ID
    if (id) {
      // Check if it's a special page
      if (id === 'introduction') {
        const intro = dataService.getIntroduction();
        return NextResponse.json(intro);
      }

      if (id === 'merits') {
        const merits = dataService.getMerits();
        return NextResponse.json(merits);
      }

      // Regular chapter
      const chapter = dataService.getChapterById(id);
      if (chapter) {
        return NextResponse.json(chapter);
      }

      return NextResponse.json(
        { error: 'Chapter not found' },
        { status: 404 }
      );
    }

    // Handle specific types
    if (type === 'introduction') {
      return NextResponse.json(dataService.getIntroduction());
    }

    if (type === 'merits') {
      return NextResponse.json(dataService.getMerits());
    }

    // Return TOC for home page
    const toc = dataService.getTOC();

    return NextResponse.json({
      toc: toc
    });

  } catch (error) {
    console.error('❌ API Error:', error);
    return NextResponse.json(
      { error: 'Failed to load data', details: String(error) },
      { status: 500 }
    );
  }
}