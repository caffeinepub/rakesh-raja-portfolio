import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ContactSettings {
    behanceUrl: string;
    instagramUrl: string;
    email: string;
    phone: string;
    location: string;
    linkedinUrl: string;
}
export interface Experience {
    id: string;
    title: string;
    period: string;
    sortOrder: bigint;
    description: string;
    company: string;
}
export interface Education {
    id: string;
    sortOrder: bigint;
    year: string;
    degree: string;
    college: string;
}
export interface AllData {
    contact?: ContactSettings;
    reviews: Array<Review>;
    projects: Array<Project>;
    educations: Array<Education>;
    dailyVisits: Array<[string, bigint]>;
    totalVisits: bigint;
    experiences: Array<Experience>;
    skills: Array<SkillCategory>;
    profile?: ProfileSettings;
}
export interface SkillCategory {
    id: string;
    sortOrder: bigint;
    category: string;
    items: Array<string>;
}
export interface Project {
    id: string;
    url: string;
    title: string;
    sortOrder: bigint;
    imageUrl: string;
}
export interface Review {
    id: string;
    name: string;
    role: string;
    reviewText: string;
    company: string;
    timestamp: bigint;
    rating: bigint;
}
export interface ProfileSettings {
    tagline: string;
    name: string;
    greeting: string;
    jobTitle: string;
    profilePhotoUrl: string;
    resumeFileName: string;
    resumeUrl: string;
}
export interface backendInterface {
    addEducation(pin: string, edu: Education): Promise<boolean>;
    addExperience(pin: string, exp: Experience): Promise<boolean>;
    addProject(pin: string, proj: Project): Promise<boolean>;
    addSkillCategory(pin: string, cat: SkillCategory): Promise<boolean>;
    deleteEducation(pin: string, id: string): Promise<boolean>;
    deleteExperience(pin: string, id: string): Promise<boolean>;
    deleteProject(pin: string, id: string): Promise<boolean>;
    deleteReview(pin: string, id: string): Promise<boolean>;
    deleteSkillCategory(pin: string, id: string): Promise<boolean>;
    getAllData(): Promise<AllData>;
    getContactSettings(): Promise<ContactSettings | null>;
    getDailyVisits(): Promise<Array<[string, bigint]>>;
    getEducations(): Promise<Array<Education>>;
    getExperiences(): Promise<Array<Experience>>;
    getProfileSettings(): Promise<ProfileSettings | null>;
    getProjects(): Promise<Array<Project>>;
    getReviewCount(): Promise<bigint>;
    getReviews(): Promise<Array<Review>>;
    getSkills(): Promise<Array<SkillCategory>>;
    getTotalVisits(): Promise<bigint>;
    recordVisit(): Promise<void>;
    setAdminPin(currentPin: string, newPin: string): Promise<boolean>;
    setContactSettings(pin: string, settings: ContactSettings): Promise<boolean>;
    setProfileSettings(pin: string, settings: ProfileSettings): Promise<boolean>;
    submitReview(review: Review): Promise<boolean>;
    updateEducation(pin: string, id: string, edu: Education): Promise<boolean>;
    updateExperience(pin: string, id: string, exp: Experience): Promise<boolean>;
    updateProject(pin: string, id: string, proj: Project): Promise<boolean>;
    updateSkillCategory(pin: string, id: string, cat: SkillCategory): Promise<boolean>;
    verifyAdmin(pin: string): Promise<boolean>;
}
