'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Props = {
  currentConsultantId: string;
  currentConsultantName: string;
  consultants: Array<{ id: string; name: string }>;
};

export default function ConsultantSelector({ 
  currentConsultantId, 
  currentConsultantName,
  consultants 
}: Props) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState(currentConsultantId);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newId = e.target.value;
    setSelectedId(newId);
    router.push(`/dashboard/profile?consultantId=${newId}`);
  };

  // Adminの場合のみ切り替え可能（複数のコンサルタントが存在する場合）
  const isAdmin = consultants.length > 1;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold text-gray-700 mb-1">
            {isAdmin ? '編集中のコンサルタント（Admin）' : '編集中のコンサルタント'}
          </div>
          {isAdmin ? (
            <select
              value={selectedId}
              onChange={handleChange}
              className="text-base font-bold text-blue-700 bg-transparent border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded cursor-pointer"
            >
              {consultants.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          ) : (
            <div className="text-base font-bold text-blue-700">
              {currentConsultantName}
            </div>
          )}
        </div>
        {isAdmin && (
          <div className="text-xs text-gray-600">
            Adminとして編集しています
          </div>
        )}
      </div>
    </div>
  );
}

