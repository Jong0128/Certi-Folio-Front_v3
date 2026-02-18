/**
 * Analytics API
 * 백엔드 엔드포인트: /api/analytics
 */
import { apiClient } from './client';

export const analyticsApi = {
    /** 커리어 선호도 조회 - GET /api/analytics/preferences */
    getPreferences: () =>
        apiClient.get('/api/analytics/preferences'),

    /** 스킬 분석 조회 - GET /api/analytics/skill-analysis */
    getSkillAnalysis: () =>
        apiClient.get('/api/analytics/skill-analysis'),
};
