import { ChevronLeft, MoreVertical, Heart, MessageCircle, Share2, Bookmark } from 'lucide-react';
import { useState } from 'react';

interface Post {
  id: number;
  author: string;
  avatar: string;
  title: string;
  category: string;
  upvotes: number;
  comments: number;
  timeAgo: string;
  content?: string;
}

interface PostDetailProps {
  post: Post;
  onBack: () => void;
}

export function PostDetail({ post, onBack }: PostDetailProps) {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  return (
    <div className="max-w-2xl mx-auto min-h-screen bg-white/80 backdrop-blur-sm">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-purple-50 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <button className="p-2 hover:bg-purple-50 rounded-lg transition-colors">
            <MoreVertical className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Post Author */}
      <div className="p-4 border-b border-purple-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center text-2xl">
              {post.avatar}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-gray-900">{post.author}</span>
                <span className="px-2 py-0.5 bg-purple-100 text-purple-600 rounded-full text-xs">
                  {post.category}
                </span>
              </div>
              <span className="text-sm text-gray-500">{post.timeAgo}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Post Content */}
      <div className="p-4">
        <h1 className="text-gray-900 mb-4">
          {post.title}
        </h1>
        
        <div className="text-gray-700 space-y-3 mb-6">
          <p>
            {post.content || 'Car Repair AI 처음 써봤는데 진짜 대박이에요! 🎉'}
          </p>
          {!post.content && (
            <>
              <p>
                2015년 LF소나타 타고 있는데 엔진오일 언제 교체해야 할지 
                헷갈렸거든요. AI한테 &quot;2015년 LF소나타, 14만km, 엔진 상태 
                보통&quot; 이렇게 입력했더니...
              </p>
              <p>
                주행거리랑 연식 고려해서 5천km마다 교체하라고 딱 알려주고,
                어떤 오일 쓰면 좋은지까지 추천해줬어요. 실제로 정비소 
                가서 확인했는데 AI 조언이 완전 정확했습니다 👍
              </p>
              <p>
                요즘 정비비 아끼려고 꼭 필요한 것만 하려는데, 
                이런 AI 도우미 있으니까 너무 편하네요!
              </p>
            </>
          )}
        </div>

        {/* Image Grid - 기본 게시글에만 표시 */}
        {!post.content && (
          <div className="grid grid-cols-2 gap-2 mb-6">
            <div className="aspect-square bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl overflow-hidden">
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                📸
              </div>
            </div>
            <div className="aspect-square bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl overflow-hidden">
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                📸
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center gap-4 py-4 border-t border-b border-purple-100 text-gray-600">
          <span>조회 {post.id * 113}</span>
          <span>·</span>
          <span>좋아요 {post.upvotes}</span>
          <span>·</span>
          <span>댓글 {post.comments}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-around py-4 px-4 border-b border-purple-100">
        <button
          onClick={() => setLiked(!liked)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            liked 
              ? 'bg-purple-50 text-purple-600' 
              : 'text-gray-600 hover:bg-purple-50'
          }`}
        >
          <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
          <span>{liked ? post.upvotes + 1 : post.upvotes}</span>
        </button>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-purple-50 transition-colors">
          <MessageCircle className="w-5 h-5" />
          <span>{post.comments}</span>
        </button>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-purple-50 transition-colors">
          <Share2 className="w-5 h-5" />
        </button>
        <button
          onClick={() => setBookmarked(!bookmarked)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            bookmarked 
              ? 'bg-purple-50 text-purple-600' 
              : 'text-gray-600 hover:bg-purple-50'
          }`}
        >
          <Bookmark className={`w-5 h-5 ${bookmarked ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Comments Section */}
      <div className="p-4">
        <h3 className="text-gray-900 mb-4">댓글 {post.comments}</h3>
        {post.comments === 0 ? (
          <div className="py-12 text-center">
            <p className="text-gray-400">첫 번째 댓글을 작성해보세요!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {[
              {
                author: 'K5매니아',
                avatar: '🚘',
                content: '저도 소나타 타는데 AI 추천 받고 오일 바꿨더니 엔진 소음이 확 줄었어요!',
                time: '3분 전',
                likes: 8
              },
              {
                author: '정비왕',
                avatar: '🔧',
                content: 'LF소나타 14만km면 타이밍 벨트도 체크해보세요. AI한테 물어보면 정확하게 알려줄거예요',
                time: '5분 전',
                likes: 5
              },
              {
                author: '초보운전',
                avatar: '🔰',
                content: '저도 차 잘 몰라서 걱정인데 이런 AI 있으면 좋겠네요. 어떻게 사용하나요?',
                time: '7분 전',
                likes: 3
              }
            ].map((comment, index) => (
              <div key={index} className="flex gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                  {comment.avatar}
                </div>
                <div className="flex-1">
                  <div className="bg-purple-50 rounded-2xl p-3">
                    <div className="text-gray-900 mb-1">{comment.author}</div>
                    <p className="text-gray-700">{comment.content}</p>
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                    <span>{comment.time}</span>
                    <button className="hover:text-purple-600 transition-colors">
                      좋아요 {comment.likes}
                    </button>
                    <button className="hover:text-purple-600 transition-colors">
                      답글
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Comment Input */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-purple-100">
        <div className="max-w-2xl mx-auto p-4">
          <div className="flex items-center gap-3">
            <button className="p-2 text-gray-400 hover:text-purple-600 transition-colors">
              😊
            </button>
            <input
              type="text"
              placeholder="댓글을 입력해주세요..."
              className="flex-1 px-4 py-3 bg-purple-50 rounded-full border-none outline-none focus:ring-2 focus:ring-purple-300 transition-all"
            />
            <button className="px-6 py-3 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-colors">
              전송
            </button>
          </div>
        </div>
      </div>

      <div className="h-24"></div>
    </div>
  );
}