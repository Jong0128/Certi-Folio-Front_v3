/**
 * User & Portfolio API
 * 백엔드 엔드포인트: /api/user, /api/portfolio
 */
import { apiClient } from './client';

// ===== User =====

export const userApi = {
    /** 내 프로필 조회 - GET /api/user/me */
    getMyProfile: () =>
        apiClient.get('/api/user/me'),

    /** 기본 정보 업데이트 (이름, 정보 입력 완료 여부) - PATCH /api/user/basic-info */
    updateBasicInfo: (data: { name: string; isInfoInputted?: boolean; birthYear?: string }) =>
        apiClient.patch('/api/user/basic-info', data),

    /** 온보딩: 이름, 출생연도, 희망 직무, 희망 기업 유형 한 번에 저장 - PATCH /api/user/onboarding */
    saveOnboarding: (data: { name: string; birthYear?: string; jobRole?: string; companyType?: string }) =>
        apiClient.patch('/api/user/onboarding', data),
};

// ===== Portfolio =====

export const portfolioApi = {

    // 1. 학력
    getEducation: () =>
        apiClient.get('/api/portfolio/educations'),
    saveEducation: (education: any) =>
        apiClient.post('/api/portfolio/educations', education),

    // 2. 프로젝트
    getProjects: () =>
        apiClient.get('/api/portfolio/projects'),
    saveProjects: (projects: any[]) =>
        apiClient.post('/api/portfolio/projects', projects),
    addProject: (project: any) =>
        apiClient.post('/api/portfolio/projects/add', project),
    deleteProject: (id: number) =>
        apiClient.delete(`/api/portfolio/projects/${id}`),
    updateProject: (id: string, project: any) =>
        apiClient.put(`/api/portfolio/projects/${id}`, project),

    // 3. 활동
    getActivities: () =>
        apiClient.get('/api/portfolio/activities'),
    saveActivities: (activities: any[]) =>
        apiClient.post('/api/portfolio/activities', activities),
    addActivity: (activity: any) =>
        apiClient.post('/api/portfolio/activities/add', activity),
    deleteActivity: (id: number) =>
        apiClient.delete(`/api/portfolio/activities/${id}`),
    updateActivity: (id: string, activity: any) =>
        apiClient.put(`/api/portfolio/activities/${id}`, activity),

    // 4. 자격증
    getCertificates: () =>
        apiClient.get('/api/portfolio/certificates'),
    saveCertificates: (certificates: any[]) =>
        apiClient.post('/api/portfolio/certificates', certificates),
    addCertificate: (certificate: any) =>
        apiClient.post('/api/portfolio/certificates/add', certificate),
    deleteCertificate: (id: number) =>
        apiClient.delete(`/api/portfolio/certificates/${id}`),
    updateCertificate: (id: string, certificate: any) =>
        apiClient.put(`/api/portfolio/certificates/${id}`, certificate),

    // 5. 경력
    getCareers: () =>
        apiClient.get('/api/portfolio/careers'),
    saveCareers: (careers: any[]) =>
        apiClient.post('/api/portfolio/careers', careers),
    addCareer: (career: any) =>
        apiClient.post('/api/portfolio/careers/add', career),
    deleteCareer: (id: number) =>
        apiClient.delete(`/api/portfolio/careers/${id}`),
    updateCareer: (id: string, career: any) =>
        apiClient.put(`/api/portfolio/careers/${id}`, career),

};

// ===== Coding Test (Solved.ac) =====
export const codingTestApi = {
    /** 핸들 검증 - GET /api/coding-test/check */
    checkHandle: (handle: string) =>
        apiClient.get(`/api/coding-test/check?handle=${handle}`),

    /** 코딩 테스트 정보 저장 - POST /api/coding-test */
    saveCodingTest: (handle: string) =>
        apiClient.post('/api/coding-test', { handle }),

    /** 코딩 테스트 정보 조회 - GET /api/coding-test */
    getCodingTest: () =>
        apiClient.get('/api/coding-test'),
};

// ===== Analytics (Career Preferences) =====
export const analyticsApi = {
    /** 
     * 커리어 선호도 조회 - GET /api/analytics/preferences 
     * Response: { success: true, preference: { jobRole, companyType, ... } }
     */
    getPreferences: () =>
        apiClient.get('/api/analytics/preferences'),

    /** 
     * 커리어 선호도 저장 - POST /api/analytics/preferences 
     * Request: { jobRole, companyType }
     */
    savePreferences: (data: { jobRole: string; companyType: string }) =>
        apiClient.post('/api/analytics/preferences', data)
};
