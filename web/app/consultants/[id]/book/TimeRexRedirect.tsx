'use client';

import { useEffect } from 'react';

type Props = {
  schedulerUrl: string;
};

export default function TimeRexRedirect({ schedulerUrl }: Props) {
  useEffect(() => {
    // 少し遅延させてからTimeRexを開く（メッセージを表示してから）
    const timer = setTimeout(() => {
      window.open(schedulerUrl, '_blank', 'noopener,noreferrer');
    }, 500);
    return () => clearTimeout(timer);
  }, [schedulerUrl]);

  return null;
}


