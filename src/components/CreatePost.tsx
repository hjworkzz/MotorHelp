import { Image, Video, BarChart3 } from 'lucide-react';
import { useState } from 'react';

interface CreatePostProps {
  onBack: () => void;
  onSubmit: (title: string, content: string, category: string) => void;
}

export function CreatePost({ onBack, onSubmit }: CreatePostProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('정비 팁');

  const handleSubmit = () => {
    if (title.trim() && content.trim()) {
      onSubmit(title, content, selectedCategory);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-purple-100 sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <button 
            onClick={onBack}
            className="text-gray-700 hover:text-gray-900 transition-colors"
          >
            취소
          </button>
          <h2 className="text-gray-900">글쓰기</h2>
          <button 
            onClick={handleSubmit}
            className="text-purple-500 hover:text-purple-600 transition-colors"
          >
            완료
          </button>
        </div>
      </div>

      {/* Category Selection */}
      <div className="p-4 border-b border-purple-100">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full px-4 py-2 bg-purple-50 border border-purple-200 rounded-lg outline-none focus:ring-2 focus:ring-purple-300"
        >
          <option value="정비 팁">정비 팁</option>
          <option value="내 차 자랑">내 차 자랑</option>
          <option value="셀프 정비">셀프 정비</option>
          <option value="질문">질문</option>
        </select>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="mb-8">
          <input
            type="text"
            placeholder="제목을 입력해 주세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-transparent border-none outline-none text-gray-900 placeholder-gray-400 text-lg"
          />
        </div>

        <div>
          <textarea
            placeholder="내용을 입력해 주세요"
            rows={10}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full bg-transparent border-none outline-none text-gray-700 placeholder-gray-400 resize-none"
          />
        </div>
      </div>

      {/* Bottom Toolbar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-purple-100">
        <div className="max-w-2xl mx-auto flex items-center justify-around p-4">
          <button className="flex flex-col items-center gap-1 text-gray-600 hover:text-purple-500 transition-colors">
            <Image className="w-6 h-6" />
            <span className="text-xs">사진</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-600 hover:text-purple-500 transition-colors">
            <Video className="w-6 h-6" />
            <span className="text-xs">영상</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-600 hover:text-purple-500 transition-colors">
            <BarChart3 className="w-6 h-6" />
            <span className="text-xs">투표</span>
          </button>
        </div>
      </div>
    </div>
  );
}