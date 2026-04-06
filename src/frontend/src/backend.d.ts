import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface VisitRecord {
    date: string;
    count: bigint;
}
export interface SkillCategory {
    id: bigint;
    sortOrder: bigint;
    category: string;
    items: Array<string>;
}
export interface Project {
    id: bigint;
    url: string;
    title: string;
    sortOrder: bigint;
    imageUrl: string;
}
export interface Review {
    id: bigint;
    name: string;
    role: string;
    reviewText: string;
    company: string;
    timestamp: bigint;
    rating: bigint;
}
export interface Experience {
    id: bigint;
    title: string;
    period: string;
    sortOrder: bigint;
    description: string;
    company: string;
}
export interface ProfileSettings {
    name: string;
    greeting: string;
    jobTitle: string;
    tagline: string;
    profilePhotoUrl: string;
    resumeUrl: string;
    resumeFileName: string;
}
export interface ContactSettings {
    email: string;
    phone: string;
    location: string;
    behanceUrl: string;
    linkedinUrl: string;
    instagramUrl: string;
}
export interface Education {
    id: bigint;
    degree: string;
    college: string;
    year: string;
    sortOrder: bigint;
}
export interface backendInterface {
    addExperience(pin: string, title: string, company: string, period: string, description: string, sortOrder: bigint): Promise<bigint>;
    addProject(pin: string, title: string, url: string, imageUrl: string, sortOrder: bigint): Promise<bigint>;
    addSkillCategory(pin: string, category: string, items: Array<string>, sortOrder: bigint): Promise<bigint>;
    deleteExperience(pin: string, id: bigint): Promise<boolean>;
    deleteProject(pin: string, id: bigint): Promise<boolean>;
    deleteReview(pin: string, id: bigint): Promise<boolean>;
    deleteSkillCategory(pin: string, id: bigint): Promise<boolean>;
    getAllData(): Promise<{
        reviews: Array<Review>;
        projects: Array<Project>;
        dailyVisits: Array<VisitRecord>;
        totalVisits: bigint;
        experiences: Array<Experience>;
        skills: Array<SkillCategory>;
    }>;
    getDailyVisits(): Promise<Array<VisitRecord>>;
    getExperiences(): Promise<Array<Experience>>;
    getProjects(): Promise<Array<Project>>;
    getReview(id: bigint): Promise<Review>;
    getReviewCount(): Promise<bigint>;
    getReviews(): Promise<Array<Review>>;
    getSkills(): Promise<Array<SkillCategory>>;
    getTotalVisits(): Promise<bigint>;
    recordVisit(dateStr: string): Promise<void>;
    setAdminPin(oldPin: string, newPin: string): Promise<boolean>;
    submitReview(name: string, role: string, company: string, reviewText: string, rating: bigint): Promise<bigint>;
    updateExperience(pin: string, id: bigint, title: string, company: string, period: string, description: string, sortOrder: bigint): Promise<boolean>;
    updateProject(pin: string, id: bigint, title: string, url: string, imageUrl: string, sortOrder: bigint): Promise<boolean>;
    verifyAdmin(pin: string): Promise<boolean>;
    // Profile settings
    getProfileSettings(): Promise<[] | [ProfileSettings]>;
    setProfileSettings(pin: string, name: string, greeting: string, jobTitle: string, tagline: string, profilePhotoUrl: string, resumeUrl: string, resumeFileName: string): Promise<boolean>;
    // Contact settings
    getContactSettings(): Promise<[] | [ContactSettings]>;
    setContactSettings(pin: string, email: string, phone: string, location: string, behanceUrl: string, linkedinUrl: string, instagramUrl: string): Promise<boolean>;
    // Education
    getEducations(): Promise<Array<Education>>;
    addEducation(pin: string, degree: string, college: string, year: string, sortOrder: bigint): Promise<bigint>;
    updateEducation(pin: string, id: bigint, degree: string, college: string, year: string, sortOrder: bigint): Promise<boolean>;
    deleteEducation(pin: string, id: bigint): Promise<boolean>;
}
