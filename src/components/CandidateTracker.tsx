'use client';

import { useEffect } from 'react';

export default function CandidateTracker({
  slug,
  name,
}: {
  slug: string;
  name: string;
}) {
  useEffect(() => {
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        page_path: `/c/${slug}`,
        candidate_slug: slug,
        candidate_name: name,
      }),
    }).catch(() => {});
  }, [slug, name]);

  return null;
}
