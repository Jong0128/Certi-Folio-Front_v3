import React, { useState, useEffect } from "react";
import { GlassCard } from "../UI/GlassCard";
import { Button } from "../UI/Button";
import { BasicInfoFlow } from "./BasicInfoFlow";
import { EducationFlow, EducationData } from "./EducationFlow";
import { ProjectFlow, ProjectData } from "./ProjectFlow";
import { ActivityFlow, ActivityData } from "./ActivityFlow";
import { CertificateFlow, CertificateData } from "./CertificateFlow";
import { CareerFlow, CareerData } from "./CareerFlow";
import { SpecReport } from "./SpecReport";
import {
  portfolioApi,
  userApi,
  codingTestApi,
  analyticsApi,
} from "../../api/userApi";
import { useAuth } from "../../contexts/AuthContext";

// Define the full structure of the data we are collecting
interface FullUserData {
  // Target Setting (Merged into Basic Info)
  targetCompanyType: string;
  targetJobRole: string;
  // Basic Info
  name: string;
  birthYear: string;
  // Education
  status: string;
  schoolName: string;
  major: string;
  degree: string;
  startDate: string;
  endDate: string;
  gpa: string;
  maxGpa: string;
  // Projects (Array)
  projects: ProjectData[];
  // Activities (Array)
  activities: ActivityData[];
  // Certificates (Array)
  certificates: CertificateData[];
  // Career (Array)
  careers: CareerData[];
  // Etc
  solvedAcId: string;
}

// Extended flow stages
type FlowStage =
  | "intro"
  | "basic"
  | "prompt_edu"
  | "education"
  | "prompt_project"
  | "project"
  | "prompt_more_projects"
  | "prompt_activity"
  | "activity"
  | "prompt_more_activities"
  | "prompt_cert"
  | "cert"
  | "prompt_more_certs"
  | "prompt_career"
  | "career"
  | "prompt_more_careers"
  | "prompt_etc"
  | "etc"
  | "finished"; // 'finished' now triggers the Report

// Top Main Navigation Categories
const mainCategories = [
  { id: "basic", label: "개인정보" },
  { id: "education", label: "학력" },
  { id: "project", label: "프로젝트" },
  { id: "activity", label: "대외활동" },
  { id: "cert", label: "자격증" },
  { id: "career", label: "경력" },
  { id: "etc", label: "기타" },
];

export const SpecFlowTest: React.FC = () => {
  const { isLoggedIn, token, userProfile, refreshProfile } = useAuth();
  // State
  const [stage, setStage] = useState<FlowStage>("intro");
  const [isAnimating, setIsAnimating] = useState(false);
  const [solvedIdInput, setSolvedIdInput] = useState("");

  // Check if user has already input info
  useEffect(() => {
    if (userProfile?.isInfoInputted && stage === "intro") {
      // If info inputted, show report (finished)
      setStage("finished");
    }
  }, [userProfile, stage]);

  // Initialize Data
  const [userData, setUserData] = useState<FullUserData>({
    targetCompanyType: "",
    targetJobRole: "",
    name: userProfile?.name || "사용자",
    birthYear: "",
    status: "",
    schoolName: "",
    major: "",
    degree: "bachelor",
    startDate: "",
    endDate: "",
    gpa: "",
    maxGpa: "",
    projects: [],
    activities: [],
    certificates: [],
    careers: [],
    solvedAcId: "",
  });

  // 백엔드에서 포트폴리오 데이터 로드
  useEffect(() => {
    if (!isLoggedIn || !token) return;
    const loadFromBackend = async () => {
      try {
        const [
          userProfileRes,
          prefsRes,
          certs,
          projects,
          activities,
          careers,
          educations,
          codingTest,
        ] = await Promise.allSettled([
          userApi.getMyProfile(),
          analyticsApi.getPreferences(),
          portfolioApi.getCertificates(),
          portfolioApi.getProjects(),
          portfolioApi.getActivities(),
          portfolioApi.getCareers(),
          portfolioApi.getEducation(),
          codingTestApi.getCodingTest(),
        ]);

        setUserData((prev) => {
          const updated = { ...prev };

          // 1. Basic Info (BirthYear) from Profile
          if (userProfileRes.status === "fulfilled" && userProfileRes.value) {
            const profile =
              (userProfileRes.value as any).data?.data ||
              (userProfileRes.value as any).data;
            // API might return {success:true, data: {...}} or just {...} depending on client wrapper
            // Based on UserController: ResponseEntity.ok(Map.of("success", true, "data", data));
            // So it is response.data.data
            if (profile) {
              updated.name = profile.name || prev.name;
              updated.birthYear = profile.birthYear
                ? profile.birthYear.toString()
                : prev.birthYear;
            }
          }

          // 2. Career Preferences
          if (prefsRes.status === "fulfilled" && prefsRes.value) {
            // AnalyticsController: ResponseEntity.ok(Map.of("preference", ...));
            const prefData = (prefsRes.value as any).data?.preference;
            if (prefData) {
              updated.targetJobRole = prefData.jobRole || prev.targetJobRole;
              updated.targetCompanyType =
                prefData.companyType || prev.targetCompanyType;
            }
          }

          if (certs.status === "fulfilled" && certs.value) {
            const response = certs.value as any;
            const list = Array.isArray(response.data) ? response.data : [];
            if (list.length > 0) {
              updated.certificates = list.map((c: any) => ({
                id: c.id ? c.id.toString() : Date.now().toString(),
                type: c.type,
                name: c.name,
                issuer: c.issuer,
                date: c.issueDate,
                score: c.score,
                certId: c.certificateNumber,
              }));
            }
          }
          if (projects.status === "fulfilled" && projects.value) {
            const response = projects.value as any;
            const list = Array.isArray(response.data) ? response.data : [];
            if (list.length > 0) {
              updated.projects = list.map((p: any) => ({
                projectName: p.name,
                isTeam: p.type,
                role: p.role,
                techStack: p.techStack ? p.techStack.split(",") : [],
                description: p.description,
                links: { github: p.githubLink || "", demo: p.demoLink || "" },
                outcome: p.result,
                startDate: p.startDate,
                endDate: p.endDate,
              }));
            }
          }
          if (activities.status === "fulfilled" && activities.value) {
            const response = activities.value as any;
            const list = Array.isArray(response.data) ? response.data : [];
            if (list.length > 0) {
              updated.activities = list.map((a: any) => ({
                id: a.id ? a.id.toString() : Date.now().toString(),
                activityName: a.name,
                activityType: a.type,
                role: a.role,
                startDate: a.startDate,
                endDate: a.endDate,
                description: a.description,
                achievement: a.result,
              }));
            }
          }
          if (careers.status === "fulfilled" && careers.value) {
            const response = careers.value as any;
            const list = Array.isArray(response.data) ? response.data : [];
            if (list.length > 0) {
              updated.careers = list.map((c: any) => ({
                id: c.id ? c.id.toString() : Date.now().toString(),
                type: c.type,
                companyName: c.company,
                department: "", // Not in DTO
                position: c.position,
                startDate: c.startDate,
                endDate: c.endDate,
                description: c.description,
              }));
            }
          }
          if (educations.status === "fulfilled" && educations.value) {
            const response = educations.value as any;
            const edu = response.data || {}; // Response is {data: {...}}
            // If response wraps data in data property, axios usually returns data.
            // But here we rely on what client.ts returns.
            // In step 192 fix, I handled educations.value as ANY.
            // Controller returns Map.of("data", dto).
            // So axios response.data is {data: dto}.
            updated.schoolName = edu.schoolName || prev.schoolName;
            updated.major = edu.major || prev.major;
            updated.degree = edu.degree || prev.degree;
            updated.status = edu.status || prev.status;
            updated.startDate = edu.startDate || prev.startDate;
            updated.endDate = edu.endDate || prev.endDate;
            updated.gpa = edu.gpa || prev.gpa;
            updated.maxGpa = edu.maxGpa || prev.maxGpa;
          }
          if (
            codingTest.status === "fulfilled" &&
            codingTest.value &&
            (codingTest.value as any).data?.data
          ) {
            // Controller returns ApiResponse.success(dto).
            // If ApiResponse is {status, message, data}, then response.data.data is the DTO.
            updated.solvedAcId =
              (codingTest.value as any).data.data.bojHandle || prev.solvedAcId;
          }
          return updated;
        });
      } catch (err) {
        console.warn("포트폴리오 데이터 로드 실패:", err);
      }
    };
    loadFromBackend();
  }, [isLoggedIn, token]);

  // Helper to determine active/completed state of main nav
  const getNavStatus = (catId: string) => {
    if (stage === "intro") return "pending";
    if (stage === "finished") return "completed";

    switch (catId) {
      case "basic":
        if (stage === "basic") return "active";
        return "completed";
      case "education":
        if (["basic"].includes(stage)) return "pending";
        if (["prompt_edu", "education"].includes(stage)) return "active";
        return "completed";
      case "project":
        if (["basic", "prompt_edu", "education"].includes(stage))
          return "pending";
        if (
          ["prompt_project", "project", "prompt_more_projects"].includes(stage)
        )
          return "active";
        return "completed";
      case "activity":
        if (
          [
            "basic",
            "prompt_edu",
            "education",
            "prompt_project",
            "project",
            "prompt_more_projects",
          ].includes(stage)
        )
          return "pending";
        if (
          ["prompt_activity", "activity", "prompt_more_activities"].includes(
            stage,
          )
        )
          return "active";
        return "completed";
      case "cert":
        if (["prompt_cert", "cert", "prompt_more_certs"].includes(stage))
          return "active";
        if (
          [
            "career",
            "prompt_career",
            "prompt_more_careers",
            "etc",
            "prompt_etc",
          ].some((s) => stage.includes(s))
        )
          return "completed"; // basic check
        if (
          ["target_setting", "basic", "education", "project", "activity"].some(
            (s) =>
              stage.includes(s) ||
              ["prompt_edu", "prompt_project", "prompt_activity"].includes(
                stage,
              ),
          )
        )
          return "pending";
        return "completed";
      case "career":
        if (["prompt_career", "career", "prompt_more_careers"].includes(stage))
          return "active";
        if (["prompt_etc", "etc"].includes(stage)) return "completed";
        if (
          [
            "basic",
            "prompt_edu",
            "education",
            "prompt_project",
            "project",
            "prompt_more_projects",
            "prompt_activity",
            "activity",
            "prompt_more_activities",
            "prompt_cert",
            "cert",
            "prompt_more_certs",
          ].includes(stage)
        )
          return "pending";
        return "completed";
      case "etc":
        if (["prompt_etc", "etc"].includes(stage)) return "active";
        return "pending";
      default:
        return "pending";
    }
  };

  const handleIntroStart = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setStage("basic");
      setIsAnimating(false);
    }, 500);
  };

  /* 
     Handle Completion & Immediate Save 
     Each handler updates local state AND sends data to the backend immediately.
  */

  const handleBasicInfoComplete = async (data: any) => {
    setUserData((prev) => ({ ...prev, ...data }));

    // Save to Backend (Name, BirthYear & isInfoInputted + Career Preferences)
    if (isLoggedIn && data.name) {
      try {
        // 1. Basic Info
        await userApi.updateBasicInfo({
          name: data.name,
          birthYear: data.birthYear,
          isInfoInputted: true,
        });

        // 2. Career Preferences
        if (data.targetJobRole || data.targetCompanyType) {
          await analyticsApi.savePreferences({
            jobRole: data.targetJobRole,
            companyType: data.targetCompanyType,
          });
        }

        await refreshProfile();
      } catch (e) {
        console.error("Failed to update basic info or preferences", e);
      }
    }

    setStage("prompt_edu");
  };

  const handleEduPromptSelection = (choice: "yes" | "no") => {
    if (choice === "yes") setStage("education");
    else setStage("prompt_project");
  };

  const handleEducationComplete = async (data: EducationData) => {
    setUserData((prev) => ({ ...prev, ...data }));

    // Immediate Save for Education
    if (isLoggedIn && token) {
      try {
        await portfolioApi.saveEducation({
          schoolName: data.schoolName,
          major: data.major,
          degree: data.degree,
          status: data.status,
          startDate: data.startDate,
          endDate: data.endDate,
          gpa: data.gpa ? parseFloat(data.gpa) : null,
          maxGpa: data.maxGpa ? parseFloat(data.maxGpa) : null,
        });
        console.log("Education saved immediately.");
      } catch (error) {
        console.error("Failed to save education:", error);
      }
    }

    setStage("prompt_project");
  };

  const handleProjectPromptSelection = (choice: "yes" | "no") => {
    if (choice === "yes") setStage("project");
    else setStage("prompt_activity");
  };

  const handleProjectComplete = async (data: ProjectData) => {
    const updatedProjects = [...userData.projects, data];
    setUserData((prev) => ({ ...prev, projects: updatedProjects }));

    // Immediate Save for Projects
    if (isLoggedIn && token) {
      try {
        const mappedProjects = updatedProjects.map((p) => ({
          name: p.projectName,
          type: p.isTeam,
          role: p.role,
          techStack: Array.isArray(p.techStack)
            ? p.techStack.join(",")
            : p.techStack,
          description: p.description,
          githubLink: p.links?.github || "",
          demoLink: p.links?.demo || "",
          result: p.outcome,
          startDate: p.startDate,
          endDate: p.endDate,
        }));
        await portfolioApi.saveProjects(mappedProjects);
        console.log("Projects saved immediately.");
      } catch (error) {
        console.error("Failed to save projects:", error);
      }
    }

    setStage("prompt_more_projects");
  };

  const handleMoreProjectsSelection = (choice: "yes" | "no") => {
    if (choice === "yes") setStage("project");
    else setStage("prompt_activity");
  };

  const handleActivityPromptSelection = (choice: "yes" | "no") => {
    if (choice === "yes") setStage("activity");
    else setStage("prompt_cert");
  };

  const handleActivityComplete = async (data: ActivityData) => {
    const updatedActivities = [...userData.activities, data];
    setUserData((prev) => ({ ...prev, activities: updatedActivities }));

    // Immediate Save for Activities
    if (isLoggedIn && token) {
      try {
        const mappedActivities = updatedActivities.map((a) => ({
          name: a.activityName,
          type: a.activityType,
          role: a.role,
          startDate: a.startDate,
          endDate: a.endDate,
          description: a.description,
          result: a.achievement,
        }));
        await portfolioApi.saveActivities(mappedActivities);
        console.log("Activities saved immediately.");
      } catch (error) {
        console.error("Failed to save activities:", error);
      }
    }

    setStage("prompt_more_activities");
  };

  const handleMoreActivitiesSelection = (choice: "yes" | "no") => {
    if (choice === "yes") setStage("activity");
    else setStage("prompt_cert");
  };

  const handleCertPromptSelection = (choice: "yes" | "no") => {
    if (choice === "yes") setStage("cert");
    else setStage("prompt_career");
  };

  const handleCertComplete = async (data: CertificateData) => {
    const updatedCerts = [...userData.certificates, data];
    setUserData((prev) => ({ ...prev, certificates: updatedCerts }));

    // Immediate Save for Certificates
    if (isLoggedIn && token) {
      try {
        const mappedCerts = updatedCerts.map((c) => ({
          name: c.name,
          type: c.type,
          issuer: c.issuer,
          issueDate: c.date,
          score: c.score,
          certificateNumber: c.certId,
        }));
        await portfolioApi.saveCertificates(mappedCerts);
        console.log("Certificates saved immediately.");
      } catch (error) {
        console.error("Failed to save certificates:", error);
      }
    }

    setStage("prompt_more_certs");
  };

  const handleMoreCertsSelection = (choice: "yes" | "no") => {
    if (choice === "yes") setStage("cert");
    else setStage("prompt_career");
  };

  const handleCareerPromptSelection = (choice: "yes" | "no") => {
    if (choice === "yes") setStage("career");
    else setStage("prompt_etc");
  };

  const handleCareerComplete = async (data: CareerData) => {
    const updatedCareers = [...userData.careers, data];
    setUserData((prev) => ({ ...prev, careers: updatedCareers }));

    // Immediate Save for Careers
    if (isLoggedIn && token) {
      try {
        const mappedCareers = updatedCareers.map((c) => ({
          type: c.type,
          company: c.companyName,
          position: c.position,
          startDate: c.startDate,
          endDate: c.endDate,
          description: c.description,
        }));
        await portfolioApi.saveCareers(mappedCareers);
        console.log("Careers saved immediately.");
      } catch (error) {
        console.error("Failed to save careers:", error);
      }
    }

    setStage("prompt_more_careers");
  };

  const handleMoreCareersSelection = (choice: "yes" | "no") => {
    if (choice === "yes") setStage("career");
    else setStage("prompt_etc");
  };

  const handleEtcPromptSelection = (choice: "yes" | "no") => {
    if (choice === "yes") setStage("etc");
    else {
      // Final sync just in case, though usually not needed if everything saved incrementally
      // syncToBackend(userData);
      setStage("finished");
    }
  };

  const handleEtcComplete = () => {
    const updated = { ...userData, solvedAcId: solvedIdInput };
    setUserData(updated);

    // Immediate Save for Coding Test
    if (isLoggedIn && token && solvedIdInput) {
      codingTestApi
        .saveCodingTest(solvedIdInput)
        .then(() => console.log("Coding Test saved immediately"))
        .catch((err) => console.error("Failed to save coding test", err));
    }

    setStage("finished");
  };

  const handleReset = () => {
    window.location.href = "/";
  };

  // Render logic for success screen -> Now SpecReport
  if (stage === "finished") {
    return (
      <SpecReport
        userData={userData}
        onGoToDashboard={() => (window.location.href = "/")}
      />
    );
  }

  // Intro Screen
  if (stage === "intro") {
    return (
      <div
        className={`flex items-center justify-center min-h-[calc(100vh-160px)] px-4 w-full max-w-5xl mx-auto pb-32 transition-opacity duration-500 ${isAnimating ? "opacity-0" : "opacity-100"}`}
      >
        <GlassCard className="w-full p-12 md:p-16 relative min-h-[600px] flex flex-col items-center justify-center shadow-2xl border-white/80">
          <div className="mb-8 relative">
            <div className="absolute inset-0 bg-cyan-400 blur-2xl opacity-20 rounded-full animate-pulse"></div>
            <div className="w-24 h-24 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-cyan-500/40 text-white text-4xl relative z-10 transform hover:scale-105 transition-transform duration-500">
              ✨
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 text-center leading-tight tracking-tight">
            Certi-Folio AI
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">
              커리어 진단 시작하기
            </span>
          </h1>
          <p className="text-lg text-gray-500 text-center max-w-2xl mb-12 leading-relaxed">
            환영합니다! 더 정확한 분석을 위해
            <br className="hidden md:block" />
            회원님의 <span className="font-bold text-gray-800">희망 진로</span>
            를 먼저 확인하고 로드맵을 설계해 드립니다.
          </p>
          <Button
            variant="primary"
            onClick={handleIntroStart}
            className="px-12 py-5 text-xl font-bold rounded-2xl shadow-xl shadow-gray-900/10 hover:shadow-cyan-500/20 hover:scale-105 transition-all duration-300"
          >
            진로 선택하고 시작하기
          </Button>
        </GlassCard>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-[calc(100vh-160px)] px-4 w-full max-w-5xl mx-auto pb-32 transition-opacity duration-500`}
    >
      {/* Updated Nav Bar */}
      <div className="w-full max-w-5xl mb-8 overflow-x-auto no-scrollbar py-2">
        <div className="flex items-center justify-between min-w-[700px] relative px-4">
          {mainCategories.map((cat, index) => {
            const status = getNavStatus(cat.id);
            return (
              <div
                key={cat.id}
                className="flex flex-col items-center gap-2 relative px-2"
              >
                <div
                  className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 border-2 ${
                    status === "completed"
                      ? "bg-cyan-500 border-cyan-500 text-white shadow-md"
                      : status === "active"
                        ? "bg-white border-cyan-500 text-cyan-600 scale-110 shadow-lg shadow-cyan-500/30"
                        : "bg-gray-50 border-gray-200 text-gray-300"
                  }`}
                >
                  {status === "completed" ? "✓" : index + 1}
                </div>
                <span
                  className={`text-xs md:text-sm font-medium whitespace-nowrap ${
                    status === "active"
                      ? "text-cyan-700 font-bold"
                      : status === "completed"
                        ? "text-gray-800"
                        : "text-gray-300"
                  }`}
                >
                  {cat.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Basic Info Flow (Includes Target Setting now) */}
      {stage === "basic" && (
        <BasicInfoFlow
          initialData={{
            name: userData.name,
            birthYear: userData.birthYear,
            targetCompanyType: userData.targetCompanyType,
            targetJobRole: userData.targetJobRole,
          }}
          onComplete={handleBasicInfoComplete}
        />
      )}

      {/* Prompt: Add Education? */}
      {stage === "prompt_edu" && (
        <div className="w-full animate-fade-in-up">
          <GlassCard className="w-full p-16 text-center min-h-[500px] flex flex-col items-center justify-center shadow-2xl border-white/80">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 leading-tight">
              {userData.name ? (
                <>
                  기본 정보 설정이 완료되었습니다.
                  <br />
                </>
              ) : null}
              추가로 <span className="text-cyan-600">학력 정보</span>를
              입력하시겠습니까?
            </h2>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => handleEduPromptSelection("yes")}
                className="px-12 py-5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl text-xl font-bold shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/40 hover:scale-105 transition-all w-48"
              >
                네
              </button>
              <button
                onClick={() => handleEduPromptSelection("no")}
                className="px-12 py-5 bg-white border border-gray-200 text-gray-600 rounded-2xl text-xl font-bold shadow-sm hover:bg-gray-50 hover:text-gray-900 transition-all w-48"
              >
                아니요
              </button>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Education Flow */}
      {stage === "education" && (
        <EducationFlow
          initialData={userData}
          onComplete={handleEducationComplete}
          onBack={() => setStage("basic")}
        />
      )}

      {/* Prompt: Add Project? */}
      {stage === "prompt_project" && (
        <div className="w-full animate-fade-in-up">
          <GlassCard className="w-full p-16 text-center min-h-[500px] flex flex-col items-center justify-center shadow-2xl border-white/80">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 leading-tight">
              {userData.schoolName ? (
                <>
                  학력 정보가 저장되었습니다.
                  <br />
                </>
              ) : null}
              이어서 <span className="text-purple-600">프로젝트 경험</span>을
              입력하시겠습니까?
            </h2>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => handleProjectPromptSelection("yes")}
                className="px-12 py-5 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-2xl text-xl font-bold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/40 hover:scale-105 transition-all w-48"
              >
                네
              </button>
              <button
                onClick={() => handleProjectPromptSelection("no")}
                className="px-12 py-5 bg-white border border-gray-200 text-gray-600 rounded-2xl text-xl font-bold shadow-sm hover:bg-gray-50 hover:text-gray-900 transition-all w-48"
              >
                아니요
              </button>
            </div>
          </GlassCard>
        </div>
      )}

      {stage === "project" && (
        <ProjectFlow
          key={`project-${userData.projects.length}`}
          onComplete={handleProjectComplete}
          onBack={() => setStage("prompt_project")}
        />
      )}

      {stage === "prompt_more_projects" && (
        <div className="w-full animate-fade-in-up">
          <GlassCard className="w-full p-16 text-center min-h-[500px] flex flex-col items-center justify-center shadow-2xl border-white/80">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 leading-tight">
              프로젝트가 저장되었습니다.
              <br />
              <span className="text-purple-600">다른 프로젝트</span>도
              추가하시겠습니까?
            </h2>
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => handleMoreProjectsSelection("yes")}
                className="px-8 py-5 min-w-[140px] whitespace-nowrap bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-2xl text-xl font-bold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/40 hover:scale-105 transition-all"
              >
                하나 더 추가
              </button>
              <button
                onClick={() => handleMoreProjectsSelection("no")}
                className="px-8 py-5 min-w-[140px] whitespace-nowrap bg-white border border-gray-200 text-gray-600 rounded-2xl text-xl font-bold shadow-sm hover:bg-gray-50 hover:text-gray-900 transition-all"
              >
                다음으로
              </button>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Prompt: Add Activity? */}
      {stage === "prompt_activity" && (
        <div className="w-full animate-fade-in-up">
          <GlassCard className="w-full p-16 text-center min-h-[500px] flex flex-col items-center justify-center shadow-2xl border-white/80">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 leading-tight">
              {userData.projects.length > 0 ? (
                <>
                  프로젝트 입력이 완료되었습니다.
                  <br />
                </>
              ) : null}
              이어서 <span className="text-blue-600">대외활동</span> 경험을
              입력하시겠습니까?
            </h2>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => handleActivityPromptSelection("yes")}
                className="px-12 py-5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl text-xl font-bold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 hover:scale-105 transition-all w-48"
              >
                네
              </button>
              <button
                onClick={() => handleActivityPromptSelection("no")}
                className="px-12 py-5 bg-white border border-gray-200 text-gray-600 rounded-2xl text-xl font-bold shadow-sm hover:bg-gray-50 hover:text-gray-900 transition-all w-48"
              >
                아니요
              </button>
            </div>
          </GlassCard>
        </div>
      )}

      {stage === "activity" && (
        <ActivityFlow
          key={`activity-${userData.activities.length}`}
          onComplete={handleActivityComplete}
          onBack={() => setStage("prompt_activity")}
        />
      )}

      {stage === "prompt_more_activities" && (
        <div className="w-full animate-fade-in-up">
          <GlassCard className="w-full p-16 text-center min-h-[500px] flex flex-col items-center justify-center shadow-2xl border-white/80">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 leading-tight">
              활동이 저장되었습니다.
              <br />
              <span className="text-blue-600">다른 대외활동</span>도
              추가하시겠습니까?
            </h2>
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => handleMoreActivitiesSelection("yes")}
                className="px-8 py-5 min-w-[140px] whitespace-nowrap bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl text-xl font-bold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 hover:scale-105 transition-all"
              >
                하나 더 추가
              </button>
              <button
                onClick={() => handleMoreActivitiesSelection("no")}
                className="px-8 py-5 min-w-[140px] whitespace-nowrap bg-white border border-gray-200 text-gray-600 rounded-2xl text-xl font-bold shadow-sm hover:bg-gray-50 hover:text-gray-900 transition-all"
              >
                다음으로
              </button>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Prompt: Add Certificates? */}
      {stage === "prompt_cert" && (
        <div className="w-full animate-fade-in-up">
          <GlassCard className="w-full p-16 text-center min-h-[500px] flex flex-col items-center justify-center shadow-2xl border-white/80">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 leading-tight">
              {userData.activities.length > 0 ? (
                <>
                  대외활동 입력이 완료되었습니다.
                  <br />
                </>
              ) : null}
              이어서 <span className="text-green-600">자격증 및 어학</span>{" "}
              정보를 입력하시겠습니까?
            </h2>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => handleCertPromptSelection("yes")}
                className="px-12 py-5 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-2xl text-xl font-bold shadow-lg shadow-green-500/30 hover:shadow-green-500/40 hover:scale-105 transition-all w-48"
              >
                네
              </button>
              <button
                onClick={() => handleCertPromptSelection("no")}
                className="px-12 py-5 bg-white border border-gray-200 text-gray-600 rounded-2xl text-xl font-bold shadow-sm hover:bg-gray-50 hover:text-gray-900 transition-all w-48"
              >
                아니요
              </button>
            </div>
          </GlassCard>
        </div>
      )}

      {stage === "cert" && (
        <CertificateFlow
          key={`cert-${userData.certificates.length}`}
          onComplete={handleCertComplete}
          onBack={() => setStage("prompt_cert")}
        />
      )}

      {stage === "prompt_more_certs" && (
        <div className="w-full animate-fade-in-up">
          <GlassCard className="w-full p-16 text-center min-h-[500px] flex flex-col items-center justify-center shadow-2xl border-white/80">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 leading-tight">
              자격증이 저장되었습니다.
              <br />
              <span className="text-green-600">다른 자격증</span>도
              추가하시겠습니까?
            </h2>
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => handleMoreCertsSelection("yes")}
                className="px-8 py-5 min-w-[140px] whitespace-nowrap bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-2xl text-xl font-bold shadow-lg shadow-green-500/30 hover:shadow-green-500/40 hover:scale-105 transition-all"
              >
                하나 더 추가
              </button>
              <button
                onClick={() => handleMoreCertsSelection("no")}
                className="px-8 py-5 min-w-[140px] whitespace-nowrap bg-white border border-gray-200 text-gray-600 rounded-2xl text-xl font-bold shadow-sm hover:bg-gray-50 hover:text-gray-900 transition-all"
              >
                다음으로
              </button>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Prompt: Add Career? */}
      {stage === "prompt_career" && (
        <div className="w-full animate-fade-in-up">
          <GlassCard className="w-full p-16 text-center min-h-[500px] flex flex-col items-center justify-center shadow-2xl border-white/80">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 leading-tight">
              {userData.certificates.length > 0 ? (
                <>
                  자격증 입력이 완료되었습니다.
                  <br />
                </>
              ) : null}
              이어서 <span className="text-orange-600">인턴/경력</span> 사항을
              입력하시겠습니까?
            </h2>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => handleCareerPromptSelection("yes")}
                className="px-12 py-5 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-2xl text-xl font-bold shadow-lg shadow-orange-500/30 hover:shadow-orange-500/40 hover:scale-105 transition-all w-48"
              >
                네
              </button>
              <button
                onClick={() => handleCareerPromptSelection("no")}
                className="px-12 py-5 bg-white border border-gray-200 text-gray-600 rounded-2xl text-xl font-bold shadow-sm hover:bg-gray-50 hover:text-gray-900 transition-all w-48"
              >
                아니요
              </button>
            </div>
          </GlassCard>
        </div>
      )}

      {stage === "career" && (
        <CareerFlow
          key={`career-${userData.careers.length}`}
          onComplete={handleCareerComplete}
          onBack={() => setStage("prompt_career")}
        />
      )}

      {stage === "prompt_more_careers" && (
        <div className="w-full animate-fade-in-up">
          <GlassCard className="w-full p-16 text-center min-h-[500px] flex flex-col items-center justify-center shadow-2xl border-white/80">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 leading-tight">
              경력이 저장되었습니다.
              <br />
              <span className="text-orange-600">다른 경력</span>도
              추가하시겠습니까?
            </h2>
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => handleMoreCareersSelection("yes")}
                className="px-8 py-5 min-w-[140px] whitespace-nowrap bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-2xl text-xl font-bold shadow-lg shadow-orange-500/30 hover:shadow-orange-500/40 hover:scale-105 transition-all"
              >
                하나 더 추가
              </button>
              <button
                onClick={() => handleMoreCareersSelection("no")}
                className="px-8 py-5 min-w-[140px] whitespace-nowrap bg-white border border-gray-200 text-gray-600 rounded-2xl text-xl font-bold shadow-sm hover:bg-gray-50 hover:text-gray-900 transition-all"
              >
                다음으로
              </button>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Prompt: Etc / Coding Test */}
      {stage === "prompt_etc" && (
        <div className="w-full animate-fade-in-up">
          <GlassCard className="w-full p-16 text-center min-h-[500px] flex flex-col items-center justify-center shadow-2xl border-white/80">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 leading-tight">
              마지막으로 <span className="text-indigo-600">코딩 테스트</span>{" "}
              역량을 확인해볼까요?
            </h2>
            <p className="text-gray-500 text-lg mb-10">
              백준(Solved.ac) 계정이 있다면 연동하여 알고리즘 역량을 분석할 수
              있습니다.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => handleEtcPromptSelection("yes")}
                className="px-12 py-5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl text-xl font-bold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40 hover:scale-105 transition-all w-48"
              >
                네
              </button>
              <button
                onClick={() => handleEtcPromptSelection("no")}
                className="px-12 py-5 bg-white border border-gray-200 text-gray-600 rounded-2xl text-xl font-bold shadow-sm hover:bg-gray-50 hover:text-gray-900 transition-all w-48"
              >
                아니요
              </button>
            </div>
          </GlassCard>
        </div>
      )}

      {stage === "etc" && (
        <div className="w-full animate-fade-in-up">
          <GlassCard className="w-full p-16 text-center min-h-[500px] flex flex-col items-center justify-center shadow-2xl border-white/80">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 leading-tight">
              Solved.ac 아이디를 입력해주세요.
            </h2>
            <div className="w-full max-w-md mx-auto flex flex-col gap-4">
              <input
                type="text"
                value={solvedIdInput}
                onChange={(e) => setSolvedIdInput(e.target.value)}
                placeholder="예: baekjoon_id"
                className="w-full px-6 py-5 rounded-2xl border-2 border-gray-200 focus:border-cyan-500 outline-none text-xl bg-white shadow-sm transition-all text-center"
              />
              <Button
                variant="primary"
                onClick={handleEtcComplete}
                disabled={!solvedIdInput.trim()}
                className="w-full py-5 text-xl font-bold rounded-2xl shadow-lg mt-4"
              >
                완료
              </Button>
              <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                * Solved.ac 가입이 필요하며, 설정에서 정보 공개가
                <br />
                <span className="font-bold text-gray-700">
                  '모두(Everyone)'
                </span>
                로 설정되어 있어야 연동이 가능합니다.
              </p>
            </div>
            <button
              onClick={() => setStage("finished")}
              className="mt-8 text-gray-400 hover:text-gray-600 underline text-sm"
            >
              다음에 하기
            </button>
          </GlassCard>
        </div>
      )}
    </div>
  );
};
