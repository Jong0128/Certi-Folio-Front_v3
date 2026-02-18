import React, { useState, useEffect, useRef, useCallback } from 'react';
import { chatApi } from '../../api/mentoringApi';

interface ChatMessage {
  id: number;
  chatRoomId: number;
  senderId: number;
  senderName: string;
  senderProfileImage: string;
  content: string;
  type: string;
  sentAt: string;
  isMine: boolean;
}

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  mentorId: number;
  target: {
    name: string;
    role: string;
    avatar: string;
    company?: string;
  };
}

export const ChatModal: React.FC<ChatModalProps> = ({ isOpen, onClose, mentorId, target }) => {
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [chatRoomId, setChatRoomId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Quick Replies
  const quickReplies = [
    "안녕하세요! 👋",
    "멘토링 일정 문의드립니다.",
    "포트폴리오 첨삭 가능할까요?",
    "감사합니다!",
    "일정 변경 가능할까요?"
  ];

  // 채팅방 생성/조회 및 메시지 로드
  useEffect(() => {
    if (!isOpen || !mentorId) return;

    const initChat = async () => {
      setLoading(true);
      try {
        // 1. 채팅방 생성 또는 기존 채팅방 가져오기
        const room = await chatApi.getOrCreateRoom(mentorId);
        setChatRoomId(room.chatRoomId);

        // 2. 최근 메시지 로드
        const res = await chatApi.getRecentMessages(room.chatRoomId);
        if (res.messages) {
          setHistory(res.messages);
        }
      } catch (err) {
        console.error('채팅방 초기화 실패:', err);
      } finally {
        setLoading(false);
      }
    };

    initChat();

    return () => {
      setChatRoomId(null);
      setHistory([]);
    };
  }, [isOpen, mentorId]);

  // 폴링으로 새 메시지 확인 (3초 간격)
  const fetchMessages = useCallback(async () => {
    if (!chatRoomId) return;
    try {
      const res = await chatApi.getRecentMessages(chatRoomId);
      if (res.messages) {
        setHistory(res.messages);
      }
    } catch (err) {
      console.error('메시지 조회 실패:', err);
    }
  }, [chatRoomId]);

  useEffect(() => {
    if (!isOpen || !chatRoomId) return;

    pollingRef.current = setInterval(fetchMessages, 3000);

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, [isOpen, chatRoomId, fetchMessages]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || !chatRoomId || sending) return;

    setSending(true);
    try {
      await chatApi.sendMessage(chatRoomId, text);
      setMessage('');

      // 즉시 메시지 새로고침
      await fetchMessages();
    } catch (err) {
      console.error('메시지 전송 실패:', err);
    } finally {
      setSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="relative bg-white rounded-3xl w-full max-w-2xl h-[700px] shadow-2xl overflow-hidden animate-fade-in-up flex flex-col border border-white/50">

        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-white/90 backdrop-blur-md sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img src={target.avatar} className="w-12 h-12 rounded-full object-cover border border-gray-100" alt="profile" />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-900 text-lg">{target.name}</span>
                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{target.company || 'Mentor'}</span>
              </div>
              <span className="text-xs text-gray-500 block mt-0.5">{target.role} · 온라인 활동중</span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50 custom-scrollbar" ref={scrollRef}>
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="text-gray-400 text-sm">채팅방을 불러오는 중...</div>
            </div>
          ) : (
            <>
              <div className="text-center text-xs text-gray-400 my-4 bg-gray-100/50 py-1 px-3 rounded-full mx-auto w-fit">채팅이 시작되었습니다</div>
              {history.length === 0 && (
                <div className="text-center text-sm text-gray-400 mt-8">
                  아직 메시지가 없습니다. 첫 메시지를 보내보세요! 💬
                </div>
              )}
              {history.map((msg) => (
                <div key={msg.id} className={`flex ${msg.isMine ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex flex-col ${msg.isMine ? 'items-end' : 'items-start'} max-w-[70%]`}>
                    {!msg.isMine && msg.type !== 'SYSTEM' && (
                      <span className="text-xs text-gray-500 mb-1 px-1">{msg.senderName}</span>
                    )}
                    {msg.type === 'SYSTEM' ? (
                      <div className="text-xs text-gray-400 bg-gray-100/50 py-1 px-3 rounded-full">
                        {msg.content}
                      </div>
                    ) : (
                      <div
                        className={`px-5 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.isMine
                          ? 'bg-gradient-to-br from-cyan-500 to-blue-500 text-white rounded-tr-none'
                          : 'bg-white border border-gray-200 text-gray-700 rounded-tl-none'
                          }`}
                      >
                        {msg.content}
                      </div>
                    )}
                    <span className="text-[10px] text-gray-400 mt-1 px-1">
                      {new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Input Area */}
        <div className="p-5 bg-white border-t border-gray-100">
          {/* Quick Replies */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4 pb-1">
            {quickReplies.map((reply, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(reply)}
                disabled={sending || !chatRoomId}
                className="whitespace-nowrap px-4 py-2 rounded-full bg-gray-50 text-gray-600 text-xs font-bold hover:bg-cyan-50 hover:text-cyan-700 hover:border-cyan-200 border border-gray-200 transition-all shadow-sm disabled:opacity-50"
              >
                {reply}
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(message);
            }}
            className="flex gap-3"
          >
            <div className="relative flex-1">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="메시지를 입력하세요..."
                disabled={!chatRoomId || sending}
                className="w-full bg-gray-100 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-cyan-500 outline-none text-sm transition-all pr-12 disabled:opacity-50"
              />
            </div>
            <button
              type="submit"
              disabled={!message.trim() || !chatRoomId || sending}
              className="bg-cyan-600 text-white p-4 rounded-2xl hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-cyan-500/30 flex items-center justify-center aspect-square"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};