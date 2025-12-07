import { useState } from 'react';
import { CommunityFeed } from './components/CommunityFeed';
import { PostDetail } from './components/PostDetail';
import { CreatePost } from './components/CreatePost';
import { MyPage } from './components/MyPage';
import { ProfileEdit } from './components/ProfileEdit';
import { MyPosts } from './components/MyPosts';
import { MyComments } from './components/MyComments';
import { Search } from './components/Search';
import ChatBot from './components/ChatBot';

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

export default function App() {
  const [currentPage, setCurrentPage] = useState<'feed' | 'mypage' | 'profileEdit' | 'chatbot' | 'myPosts' | 'myComments' | 'search'>('feed');
  const [selectedPost, setSelectedPost] = useState<number | null>(null);
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [nickname, setNickname] = useState('오늘신차');
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      author: '소나타오너',
      avatar: '🚗',
      title: 'AI한테 물어봤더니 엔진오일 교체 시기 딱 맞춰서 알려주네요',
      category: '정비 팁',
      upvotes: 45,
      comments: 23,
      timeAgo: '5분 전'
    },
    {
      id: 2,
      author: '투싼러버',
      avatar: '🚙',
      title: '제 애마 소개합니다! 2020년 투싼 풀옵션 ✨',
      category: '내 차 자랑',
      upvotes: 38,
      comments: 15,
      timeAgo: '12분 전'
    },
    {
      id: 3,
      author: '정비왕',
      avatar: '🔧',
      title: '브레이크 패드 셀프 교체 후기 - AI 가이드 보고 성공했어요',
      category: '셀프 정비',
      upvotes: 31,
      comments: 18,
      timeAgo: '25분 전'
    },
    {
      id: 4,
      author: '카마니아',
      avatar: '🏎️',
      title: '겨울철 배터리 관리 어떻게 하시나요? AI 추천 받고싶어요',
      category: '질문',
      upvotes: 27,
      comments: 12,
      timeAgo: '1시간 전'
    },
    {
      id: 5,
      author: '스파크주인',
      avatar: '🚕',
      title: '경차 연비 향상 꿀팁 공유합니다! 실제로 20% 올랐어요',
      category: '정비 팁',
      upvotes: 22,
      comments: 9,
      timeAgo: '2시간 전'
    }
  ]);

  const handleCreatePost = (title: string, content: string, category: string) => {
    const newPost: Post = {
      id: posts.length + 1,
      author: nickname,
      avatar: '🚗',
      title: title,
      category: category,
      upvotes: 0,
      comments: 0,
      timeAgo: '방금 전',
      content: content
    };
    setPosts([newPost, ...posts]);
    setIsCreatingPost(false);
  };

  const handleNavigate = (page: 'feed' | 'mypage' | 'chatbot' | 'createPost') => {
    if (page === 'createPost') {
      setIsCreatingPost(true);
      setCurrentPage('feed');
      setSelectedPost(null);
    } else {
      setCurrentPage(page);
      setSelectedPost(null);
      setIsCreatingPost(false);
    }
  };

  if (currentPage === 'profileEdit') {
    return (
      <ProfileEdit 
        onBack={() => setCurrentPage('mypage')}
        onNavigate={handleNavigate}
        nickname={nickname}
        onSave={(newNickname) => {
          setNickname(newNickname);
          setCurrentPage('mypage');
        }}
      />
    );
  }

  if (currentPage === 'search') {
    return (
      <Search 
        onBack={() => setCurrentPage('feed')}
        onNavigate={handleNavigate}
      />
    );
  }

  if (currentPage === 'myPosts') {
    return (
      <MyPosts 
        onBack={() => setCurrentPage('mypage')}
        onNavigate={handleNavigate}
      />
    );
  }

  if (currentPage === 'myComments') {
    return (
      <MyComments 
        onBack={() => setCurrentPage('mypage')}
        onNavigate={handleNavigate}
      />
    );
  }

  if (currentPage === 'mypage') {
    return (
      <MyPage 
        onBack={() => setCurrentPage('feed')}
        onNavigate={handleNavigate}
        onProfileEdit={() => setCurrentPage('profileEdit')}
        onMyPosts={() => setCurrentPage('myPosts')}
        onMyComments={() => setCurrentPage('myComments')}
        nickname={nickname}
      />
    );
  }

  if (currentPage === 'chatbot') {
    return <ChatBot onBack={() => setCurrentPage('feed')} onNavigate={handleNavigate} />;
  }

  if (isCreatingPost) {
    return <CreatePost onBack={() => setIsCreatingPost(false)} onSubmit={handleCreatePost} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-50">
      {selectedPost === null ? (
        <CommunityFeed 
          posts={posts}
          onPostClick={setSelectedPost} 
          onCreatePost={() => setIsCreatingPost(true)}
          onMyPageClick={() => setCurrentPage('mypage')}
          onSearchClick={() => setCurrentPage('search')}
          onChatBotClick={() => setCurrentPage('chatbot')}
        />
      ) : (
        <PostDetail 
          post={posts.find(p => p.id === selectedPost)!} 
          onBack={() => setSelectedPost(null)} 
        />
      )}
    </div>
  );
}