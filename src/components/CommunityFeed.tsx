import { Bell, Search, Menu, Clock } from 'lucide-react';

interface Post {
  id: number;
  author: string;
  avatar: string;
  title: string;
  category: string;
  upvotes: number;
  comments: number;
  timeAgo: string;
}

interface CommunityFeedProps {
  posts: Post[];
  onPostClick: (postId: number) => void;
  onCreatePost: () => void;
  onMyPageClick: () => void;
  onSearchClick: () => void;
  onChatBotClick: () => void;
}

export function CommunityFeed({ posts, onPostClick, onCreatePost, onMyPageClick, onSearchClick, onChatBotClick }: CommunityFeedProps) {
  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex items-center justify-between p-4">
          <h1 className="text-purple-900">커뮤니티</h1>
          <div className="flex items-center gap-2">
            <button 
              onClick={onSearchClick}
              className="p-2 hover:bg-purple-100 rounded-lg transition-colors"
            >
              <Search className="w-5 h-5 text-purple-900" />
            </button>
            <button className="p-2 hover:bg-purple-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-purple-900" />
            </button>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="bg-white/60 backdrop-blur-sm border-b border-purple-100 overflow-x-auto">
        <div className="flex gap-2 p-4">
          <button className="px-4 py-2 bg-purple-500 text-white rounded-full whitespace-nowrap">
            전체
          </button>
          <button className="px-4 py-2 bg-white text-gray-700 rounded-full whitespace-nowrap hover:bg-purple-50 transition-colors">
            정비 팁
          </button>
          <button className="px-4 py-2 bg-white text-gray-700 rounded-full whitespace-nowrap hover:bg-purple-50 transition-colors">
            내 차 자랑
          </button>
          <button className="px-4 py-2 bg-white text-gray-700 rounded-full whitespace-nowrap hover:bg-purple-50 transition-colors">
            셀프 정비
          </button>
          <button className="px-4 py-2 bg-white text-gray-700 rounded-full whitespace-nowrap hover:bg-purple-50 transition-colors">
            질문
          </button>
        </div>
      </div>

      {/* Popular Posts Section */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-purple-500" />
          <h2 className="text-purple-600">최신글</h2>
        </div>

        <div className="space-y-3">
          {posts.map((post, index) => (
            <button
              key={post.id}
              onClick={() => onPostClick(post.id)}
              className="w-full bg-white rounded-2xl p-4 hover:shadow-lg transition-all border border-purple-100 hover:border-purple-300"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center text-2xl">
                    {post.avatar}
                  </div>
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-purple-600">{index + 1}</span>
                    <span className="text-gray-900">{post.title}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <span>{post.author}</span>
                    <span>·</span>
                    <span>{post.category}</span>
                  </div>
                </div>
                <div className="flex-shrink-0 text-right text-sm">
                  <div className="flex items-center gap-3 text-gray-500">
                    <div className="flex items-center gap-1">
                      <span>↑</span>
                      <span>{post.upvotes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>💬</span>
                      <span>{post.comments}</span>
                    </div>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t border-purple-100">
        <div className="max-w-2xl mx-auto flex items-center justify-around p-4">
          <button 
            onClick={onChatBotClick}
            className="flex flex-col items-center gap-1 text-gray-400 hover:text-purple-500 transition-colors"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            <span className="text-xs">홈</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-purple-500">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
              <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
            </svg>
            <span className="text-xs">커뮤니티</span>
          </button>
          <button onClick={onCreatePost} className="flex flex-col items-center gap-1 text-gray-400 hover:text-purple-500 transition-colors">
            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center -mt-6 shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span className="text-xs text-gray-400">글쓰기</span>
          </button>
          <button onClick={onChatBotClick} className="flex flex-col items-center gap-1 text-gray-400 hover:text-purple-500 transition-colors">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            <span className="text-xs">차량 챗봇</span>
          </button>
          <button onClick={onMyPageClick} className="flex flex-col items-center gap-1 text-gray-400 hover:text-purple-500 transition-colors">
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