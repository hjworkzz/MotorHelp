import { ChevronLeft, Search as SearchIcon } from 'lucide-react';
import { useState } from 'react';

interface SearchProps {
  onBack: () => void;
  onNavigate: (page: 'feed' | 'mypage' | 'chatbot' | 'createPost') => void;
}

export function Search({ onBack, onNavigate }: SearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const handleSearch = () => {
    if (searchQuery.trim() && !recentSearches.includes(searchQuery.trim())) {
      setRecentSearches([searchQuery.trim(), ...recentSearches].slice(0, 10));
      setSearchQuery('');
    }
  };

  const removeSearch = (search: string) => {
    setRecentSearches(recentSearches.filter(s => s !== search));
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center gap-3 p-4">
          <button 
            onClick={onBack}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="검색어를 입력해주세요"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
              autoFocus
              className="w-full px-4 py-2.5 bg-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-purple-300 text-gray-900 placeholder-gray-400"
            />
          </div>
          <button 
            onClick={onBack}
            className="text-gray-700 px-2 flex-shrink-0 hover:text-gray-900"
          >
            취소
          </button>
        </div>
      </div>

      {/* Recent Searches */}
      <div className="p-4">
        <h2 className="text-gray-900 mb-4">최근 검색어</h2>
        
        {recentSearches.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32">
            <p className="text-gray-400 text-center">
              최근 검색어가 없습니다.
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {recentSearches.map((search, index) => (
              <div 
                key={index}
                className="flex items-center justify-between py-3 border-b border-gray-100"
              >
                <button className="flex-1 text-left text-gray-700 hover:text-gray-900">
                  {search}
                </button>
                <button 
                  onClick={() => removeSearch(search)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="max-w-2xl mx-auto flex items-center justify-around p-4">
          <button 
            onClick={() => onNavigate('chatbot')}
            className="flex flex-col items-center gap-1 text-gray-400 hover:text-purple-500 transition-colors"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            <span className="text-xs">홈</span>
          </button>
          <button 
            onClick={() => onNavigate('feed')}
            className="flex flex-col items-center gap-1 text-gray-400 hover:text-purple-500 transition-colors"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
              <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
            </svg>
            <span className="text-xs">커뮤니티</span>
          </button>
          <button 
            onClick={() => onNavigate('createPost')}
            className="flex flex-col items-center gap-1 text-gray-400"
          >
            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center -mt-6 shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span className="text-xs text-gray-400">글쓰기</span>
          </button>
          <button 
            onClick={() => onNavigate('chatbot')}
            className="flex flex-col items-center gap-1 text-gray-400 hover:text-purple-500 transition-colors"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            <span className="text-xs">차량 챗봇</span>
          </button>
          <button 
            onClick={() => onNavigate('mypage')}
            className="flex flex-col items-center gap-1 text-gray-400 hover:text-purple-500 transition-colors"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            <span className="text-xs">마이페이지</span>
          </button>
        </div>
      </div>
    </div>
  );
}