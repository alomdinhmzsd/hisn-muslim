'use client';

import { useEffect, useState } from 'react';

export default function DebugPage() {
  const [data, setData] = useState<any>(null);
  const [chapter1, setChapter1] = useState<any>(null);

  useEffect(() => {
    // Get debug info
    fetch('/api/hisn?debug=true')
      .then(res => res.json())
      .then(setData);

    // Get chapter 1
    fetch('/api/hisn?id=1')
      .then(res => res.json())
      .then(setChapter1);
  }, []);

  return (
    <div style={{ padding: '20px', background: '#1e293b', color: 'white', minHeight: '100vh' }}>
      <h1>Debug Information</h1>

      <h2>Data Service Stats:</h2>
      <pre style={{ background: '#0f172a', padding: '10px', borderRadius: '5px' }}>
        {JSON.stringify(data, null, 2)}
      </pre>

      <h2>Chapter 1 Data:</h2>
      <pre style={{ background: '#0f172a', padding: '10px', borderRadius: '5px' }}>
        {JSON.stringify(chapter1, null, 2)}
      </pre>
    </div>
  );
}