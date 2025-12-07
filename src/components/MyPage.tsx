import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useState } from 'react';

interface MyPageProps {
  onBack: () => void;
  onNavigate: (page: 'feed' | 'mypage' | 'chatbot' | 'createPost') => void;
  onProfileEdit: () => void;
  onMyPosts: () => void;
  onMyComments: () => void;
  nickname: string;
}

interface Car {
  id: number;
  carNumber: string;
  ownerName: string;
}

export function MyPage({ onBack, onNavigate, onProfileEdit, onMyPosts, onMyComments, nickname }: MyPageProps) {
  const [showCarVerification, setShowCarVerification] = useState(false);
  const [verificationStep, setVerificationStep] = useState(1); // 1: 차량번호, 2: 소유자명, 3: 로딩, 4: 성공, 5: 완료
  const [carNumber, setCarNumber] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [registeredCars, setRegisteredCars] = useState<Car[]>([]);

  if (showCarVerification) {
    // Step 1: 차량 번호 입력
    if (verificationStep === 1) {
      return (
        <div className="min-h-screen bg-white">
          <div className="bg-white border-b border-gray-200">
            <div className="p-4">
              <button 
                onClick={() => setShowCarVerification(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-gray-700" />
              </button>
            </div>
          </div>

          <div className="p-6">
            <h1 className="text-gray-900 text-2xl mb-8">내 차량 번호를 입력해주세요</h1>
            
            <input
              type="text"
              placeholder="00가 1234"
              value={carNumber}
              onChange={(e) => setCarNumber(e.target.value)}
              className="w-full px-4 py-4 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-purple-300 text-center text-2xl"
            />
          </div>

          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white">
            <button
              onClick={() => {
                if (carNumber.trim()) {
                  setVerificationStep(2);
                }
              }}
              disabled={!carNumber.trim()}
              className={`w-full py-4 rounded-xl transition-colors ${
                carNumber.trim()
                  ? 'bg-purple-500 text-white hover:bg-purple-600'
                  : 'bg-gray-200 text-gray-400'
              }`}
            >
              조회하기
            </button>
          </div>
        </div>
      );
    }

    // Step 2: 소유자명 입력
    if (verificationStep === 2) {
      return (
        <div className="min-h-screen bg-white">
          <div className="bg-white border-b border-gray-200">
            <div className="p-4">
              <button 
                onClick={() => setVerificationStep(1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-gray-700" />
              </button>
            </div>
          </div>

          <div className="p-6">
            <h1 className="text-gray-900 text-2xl mb-4">소유자명을 입력해주세요</h1>
            
            <div className="bg-gray-50 p-4 rounded-xl mb-6">
              <p className="text-gray-600 text-sm text-center">
                자동차등록증 상 소유자명 입력이 필요해요.
              </p>
              <p className="text-gray-600 text-sm text-center">
                공동명의 시 대표자 이름 1명 입력이 필요해요.
              </p>
              <p className="text-gray-600 text-sm text-center">
                차량 세부정보를 불러오는데만 사용됩니다.
              </p>
            </div>

            <input
              type="text"
              placeholder="소유자 이름"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              className="w-full px-4 py-4 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-purple-300"
            />

            <div className="mt-6">
              <h3 className="text-gray-900 mb-2">리스/법인 소유 차량이라면</h3>
              <p className="text-gray-500 text-sm">
                자동차 등록증 상의 소유자명과 일치해야 해요.
              </p>
              <p className="text-gray-500 text-sm">
                예를 들어, 빠빠(주) 와 같이
              </p>
              <p className="text-gray-500 text-sm">
                주식회사, (주) 등 정확한 소유자명이 필요해요
              </p>
            </div>
          </div>

          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white">
            <button
              onClick={() => {
                // 차량 등록
                const newCar: Car = {
                  id: Date.now(),
                  carNumber: carNumber,
                  ownerName: ownerName
                };
                setRegisteredCars([...registeredCars, newCar]);
                setVerificationStep(5);
              }}
              className="w-full py-4 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors"
            >
              확인
            </button>
          </div>
        </div>
      );
    }

    // Step 3: 로딩 화면
    if (verificationStep === 3) {
      return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
          <h1 className="text-gray-900 text-2xl mb-8">차량 정보를 조회중입니다.</h1>
          <div className="text-6xl mb-8">
            🚗
          </div>
          <div className="flex gap-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      );
    }

    // Step 4: 성공 화면
    if (verificationStep === 4) {
      return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
          <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mb-6">
            <svg className="w-12 h-12 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-gray-900 text-2xl mb-4">성공적으로 인증되었습니다</h1>
          <p className="text-gray-500 text-center mb-8">
            차량 정보가 등록되었습니다
          </p>
          <button
            onClick={() => setVerificationStep(5)}
            className="w-full max-w-md py-4 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors"
          >
            확인
          </button>
        </div>
      );
    }

    // Step 5: 실차주 인증 완료 페이지
    if (verificationStep === 5) {
      return (
        <div className="min-h-screen bg-white">
          <div className="bg-white border-b border-gray-200">
            <div className="flex items-center justify-center p-4">
              <button 
                onClick={() => {
                  setShowCarVerification(false);
                  setVerificationStep(1);
                }}
                className="absolute left-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-gray-700" />
              </button>
              <h1 className="text-gray-900">실차주 인증</h1>
            </div>
          </div>

          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-gray-900 mb-2">차량 추가 인증</h2>
              <p className="text-gray-500 text-sm">차량 인증에 성공하면 배지가 부여됩니다</p>
              <button 
                onClick={() => {
                  setVerificationStep(1);
                  setCarNumber('');
                  setOwnerName('');
                }}
                className="text-purple-500 text-sm mt-2 flex items-center gap-1"
              >
                추가 인증하기 <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {registeredCars.length === 0 ? (
                <div className="border border-gray-200 rounded-xl p-6 text-center">
                  <p className="text-gray-400">등록된 차량이 없습니다</p>
                </div>
              ) : (
                registeredCars.map((car) => (
                  <div key={car.id} className="border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-gray-900">{car.carNumber}</h3>
                      <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm">인증완료</span>
                    </div>
                    <div className="flex items-center gap-4 text-gray-500 mb-3">
                      <span>{car.ownerName}</span>
                      <span>소유</span>
                    </div>
                    <button 
                      onClick={() => {
                        if (confirm(`${car.carNumber} 차량을 삭제하시겠습니까?`)) {
                          setRegisteredCars(registeredCars.filter(c => c.id !== car.id));
                        }
                      }}
                      className="text-red-500 text-sm flex items-center gap-1 hover:text-red-600 transition-colors"
                    >
                      삭제
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-gray-900">마이페이지</h1>
          <div className="w-10"></div>
        </div>
      </div>

      {/* Profile Section */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-4 p-6">
          <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
              <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
            </svg>
          </div>
          <div className="flex-1">
            <h2 className="text-gray-900">{nickname}</h2>
          </div>
        </div>
        <button 
          onClick={onProfileEdit}
          className="w-full py-3 bg-purple-500 text-white hover:bg-purple-600 rounded-lg transition-colors"
        >
          프로필 수정
        </button>
      </div>

      {/* My Info Section */}
      <div className="py-4">
        <h3 className="px-6 py-2 text-gray-500 text-sm">내 정보</h3>
        <button className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 flex items-center justify-center">
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <span className="text-gray-900">획득배지</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>
        <button 
          onClick={() => setShowCarVerification(true)}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 flex items-center justify-center">
              <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
              </svg>
            </div>
            <span className="text-gray-900">실차주 인증</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* My Activity Section */}
      <div className="py-4 border-t border-gray-200">
        <h3 className="px-6 py-2 text-gray-500 text-sm">나의 활동</h3>
        <button 
          onClick={onMyPosts}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 flex items-center justify-center">
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
            <span className="text-gray-900">게시글</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>
        <button 
          onClick={onMyComments}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 flex items-center justify-center">
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <span className="text-gray-900">댓글</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>
        <button 
          onClick={() => {
            if (confirm('로그아웃 하시겠습니까?')) {
              // 로그아웃 로직
              alert('로그아웃되었습니다.');
            }
          }}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 flex items-center justify-center">
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>
            <span className="text-gray-900">로그아웃</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>
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
            className="flex flex-col items-center gap-1 text-purple-500"
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