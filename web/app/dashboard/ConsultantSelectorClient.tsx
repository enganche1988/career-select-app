'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Props = {
  currentConsultantId: string;
  consultants: Array<{ id: string; name: string }>;
};

export default function ConsultantSelectorClient({ currentConsultantId, consultants }: Props) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState(currentConsultantId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/dashboard?consultantId=${selectedId}`);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        表示するコンサルタントを切り替える（POC用）
      </label>
      <div className="flex gap-2">
        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {consultants.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition text-sm"
        >
          このコンサルとして表示
        </button>
      </div>
    </form>
  );
}


