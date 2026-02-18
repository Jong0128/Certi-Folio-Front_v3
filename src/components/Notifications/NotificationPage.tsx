import React, { useState, useEffect, useCallback } from "react";
import { GlassCard } from "../UI/GlassCard";
import { Button } from "../UI/Button";
import { notificationApi } from "../../api/notificationApi";
import { useAuth } from "../../contexts/AuthContext";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
}

interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export const NotificationPage: React.FC = () => {
  const { isLoggedIn, token } = useAuth();
  const [filter, setFilter] = useState("all");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const LIMIT = 10;

  // 백엔드에서 알림 불러오기
  const fetchNotifications = useCallback(
    async (pageNum: number, append = false) => {
      if (!isLoggedIn || !token) return;
      append ? setLoadingMore(true) : setLoading(true);
      try {
        const params: { page?: number; limit?: number; type?: string } = {
          page: pageNum,
          limit: LIMIT,
        };
        if (filter !== "all") params.type = filter;
        const res = await notificationApi.getNotifications(params);

        const items: Notification[] = (res.items || []).map((n: any) => ({
          id: String(n.id),
          type: n.type || "system",
          title: n.title,
          message: n.message || "",
          timestamp: n.timestamp || "",
          isRead: n.isRead ?? false,
          actionUrl: n.actionUrl || undefined,
        }));

        setNotifications((prev) => (append ? [...prev, ...items] : items));
        if (res.meta) setMeta(res.meta);
      } catch (err) {
        console.warn("알림 API 호출 실패:", err);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [isLoggedIn, token, filter],
  );

  // 필터 변경 시 1페이지부터 다시 로드
  useEffect(() => {
    setPage(1);
    fetchNotifications(1);
  }, [fetchNotifications]);

  // 더 보기
  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchNotifications(nextPage, true);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "job":
        return "💼";
      case "mentoring":
        return "🤝";
      case "system":
        return "🔔";
      case "certificate":
        return "📜";
      default:
        return "📢";
    }
  };

  // 알림 클릭 → 읽음 처리
  const handleNotificationClick = async (notif: Notification) => {
    if (!notif.isRead && isLoggedIn && token) {
      try {
        await notificationApi.markAsRead(Number(notif.id));
        setNotifications((prev) =>
          prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n)),
        );
      } catch (err) {
        console.warn("읽음 처리 실패:", err);
      }
    }
  };

  // 모두 읽음 처리
  const handleMarkAllRead = async () => {
    if (!isLoggedIn || !token) return;
    try {
      await notificationApi.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.warn("모두 읽음 API 실패:", err);
    }
  };

  // 알림 삭제
  const handleDelete = async (id: string) => {
    if (!isLoggedIn || !token) return;
    try {
      await notificationApi.deleteNotification(Number(id));
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.warn("삭제 API 실패:", err);
    }
  };

  // 전체 삭제 (현재 보이는 알림들을 순차 삭제)
  const handleClearAll = async () => {
    if (!window.confirm("모든 알림을 삭제하시겠습니까?")) return;
    if (!isLoggedIn || !token) return;
    try {
      await Promise.all(
        notifications.map((n) =>
          notificationApi.deleteNotification(Number(n.id)),
        ),
      );
      setNotifications([]);
    } catch (err) {
      console.warn("전체 삭제 API 실패:", err);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto pb-20 px-4 animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900">알림 센터</h2>
          <p className="text-gray-500 mt-1">
            모든 알림 내역을 확인하고 관리하세요.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            className="text-xs h-9 py-0 px-3 bg-white hover:text-cyan-600"
            onClick={handleMarkAllRead}
          >
            모두 읽음
          </Button>
          <Button
            variant="secondary"
            className="text-xs h-9 py-0 px-3 bg-white text-gray-400 hover:text-red-500 hover:border-red-200"
            onClick={handleClearAll}
          >
            전체 삭제
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar pb-2">
        {["all", "job", "mentoring", "system", "certificate"].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
              filter === cat
                ? "bg-gray-900 text-white shadow-lg shadow-gray-900/20"
                : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-50"
            }`}
          >
            {cat === "all"
              ? "전체"
              : cat === "job"
                ? "채용 정보"
                : cat === "mentoring"
                  ? "멘토링"
                  : cat === "certificate"
                    ? "자격증"
                    : "시스템"}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-3 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Notification List */}
      {!loading && (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <GlassCard
              key={notif.id}
              className={`p-5 flex gap-4 hover:border-cyan-300 transition-all cursor-pointer group relative overflow-hidden ${notif.isRead ? "bg-white/40" : "bg-white border-cyan-100"}`}
              onClick={() => handleNotificationClick(notif)}
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 transition-transform group-hover:scale-110 ${notif.isRead ? "bg-gray-50 text-gray-400" : "bg-gradient-to-br from-white to-cyan-50 border border-cyan-100 shadow-sm"}`}
              >
                {getIcon(notif.type)}
              </div>
              <div className="flex-1 pr-8">
                <div className="flex justify-between items-start">
                  <h4
                    className={`text-base font-bold ${notif.isRead ? "text-gray-600" : "text-gray-900"}`}
                  >
                    {notif.title}
                  </h4>
                  <span className="text-xs text-gray-400 whitespace-nowrap ml-2 bg-gray-50 px-2 py-1 rounded-full">
                    {notif.timestamp}
                  </span>
                </div>
                <p
                  className={`text-sm mt-1 leading-relaxed ${notif.isRead ? "text-gray-400" : "text-gray-600"}`}
                >
                  {notif.message}
                </p>
              </div>
              {!notif.isRead && (
                <div className="absolute top-5 right-5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-sm"></div>
                </div>
              )}

              {/* Hover Actions */}
              <div className="absolute top-1/2 -translate-y-1/2 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 backdrop-blur-sm p-1 rounded-lg shadow-sm">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(notif.id);
                  }}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="삭제"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </GlassCard>
          ))}

          {/* 더 보기 버튼 */}
          {meta?.has_next && (
            <div className="flex justify-center pt-4">
              <Button
                variant="secondary"
                className="text-sm px-6 py-2 bg-white hover:text-cyan-600"
                onClick={handleLoadMore}
                disabled={loadingMore}
              >
                {loadingMore ? (
                  <div className="w-4 h-4 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                ) : (
                  "더 보기"
                )}
              </Button>
            </div>
          )}

          {notifications.length === 0 && (
            <div className="py-20 text-center flex flex-col items-center justify-center bg-white/50 rounded-3xl border border-dashed border-gray-200">
              <div className="text-4xl mb-3 opacity-30">🔕</div>
              <p className="text-gray-400 font-medium">
                새로운 알림이 없습니다.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
