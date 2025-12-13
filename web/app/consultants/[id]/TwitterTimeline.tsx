'use client';

import { useEffect, useRef } from 'react';

type Props = {
  twitterHandle: string;
};

export default function TwitterTimeline({ twitterHandle }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!twitterHandle || !ref.current) return;
    // 既存scriptを一度消す
    const prev = document.getElementById('twitter-wjs');
    if (prev) prev.remove();
    // スクリプト動的ロード
    const script = document.createElement('script');
    script.id = 'twitter-wjs';
    script.setAttribute('src', 'https://platform.twitter.com/widgets.js');
    script.setAttribute('async', 'true');
    ref.current.appendChild(script);
  }, [twitterHandle]);

  return (
    <div className="my-6">
      <h3 className="text-base font-bold mb-2">X（旧Twitter）の発信</h3>
      <div
        ref={ref}
        className="border rounded overflow-hidden"
        style={{ height: 420, minHeight: 200 }}
      >
        <a
          className="twitter-timeline"
          data-height="400"
          href={`https://twitter.com/${twitterHandle}`}
        >
          Tweets by @{twitterHandle}
        </a>
      </div>
    </div>
  );
}
