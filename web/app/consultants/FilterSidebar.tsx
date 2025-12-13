'use client';

type Props = {
  allRoles: string[];
  allCompanyTypes: string[];
  selectedRoles: string[];
  selectedCompanyTypes: string[];
  keyword: string;
  onRolesChange: (roles: string[]) => void;
  onCompanyTypesChange: (types: string[]) => void;
  onKeywordChange: (keyword: string) => void;
  onReset: () => void;
};

export default function FilterSidebar({
  allRoles,
  allCompanyTypes,
  selectedRoles,
  selectedCompanyTypes,
  keyword,
  onRolesChange,
  onCompanyTypesChange,
  onKeywordChange,
  onReset,
}: Props) {
  const handleRoleToggle = (role: string) => {
    if (selectedRoles.includes(role)) {
      onRolesChange(selectedRoles.filter(r => r !== role));
    } else {
      onRolesChange([...selectedRoles, role]);
    }
  };

  const handleCompanyTypeToggle = (type: string) => {
    if (selectedCompanyTypes.includes(type)) {
      onCompanyTypesChange(selectedCompanyTypes.filter(t => t !== type));
    } else {
      onCompanyTypesChange([...selectedCompanyTypes, type]);
    }
  };

  const hasActiveFilters = selectedRoles.length > 0 || selectedCompanyTypes.length > 0 || keyword.trim() !== '';

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900">フィルター</h3>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="text-sm font-medium text-gray-600 hover:text-gray-900 underline"
          >
            リセット
          </button>
        )}
      </div>
      
      {/* キーワード検索 */}
      <div className="mb-8">
        <input
          type="text"
          value={keyword}
          onChange={(e) => onKeywordChange(e.target.value)}
          placeholder="検索..."
          className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all"
        />
      </div>
      
      {/* 職種フィルタ */}
      {allRoles.length > 0 && (
        <div className="mb-8">
          <h4 className="text-base font-bold text-gray-900 mb-4">職種</h4>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {allRoles.map((role) => (
              <label key={role} className="flex items-center cursor-pointer group py-1">
                <input
                  type="checkbox"
                  checked={selectedRoles.includes(role)}
                  onChange={() => handleRoleToggle(role)}
                  className="w-5 h-5 text-black border-2 border-gray-300 rounded focus:ring-black focus:ring-2 cursor-pointer"
                />
                <span className="ml-3 text-sm font-medium text-gray-700 group-hover:text-gray-900">
                  {role}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}
      
      {/* 企業タイプフィルタ */}
      {allCompanyTypes.length > 0 && (
        <div className="mb-8">
          <h4 className="text-base font-bold text-gray-900 mb-4">企業タイプ</h4>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {allCompanyTypes.map((type) => (
              <label key={type} className="flex items-center cursor-pointer group py-1">
                <input
                  type="checkbox"
                  checked={selectedCompanyTypes.includes(type)}
                  onChange={() => handleCompanyTypeToggle(type)}
                  className="w-5 h-5 text-black border-2 border-gray-300 rounded focus:ring-black focus:ring-2 cursor-pointer"
                />
                <span className="ml-3 text-sm font-medium text-gray-700 group-hover:text-gray-900">
                  {type}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
