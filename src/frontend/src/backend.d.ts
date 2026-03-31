import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Review {
    id: bigint;
    name: string;
    role: string;
    reviewText: string;
    company: string;
    timestamp: bigint;
    rating: bigint;
}
export interface backendInterface {
    deleteReview(pin: string, id: bigint): Promise<boolean>;
    getDailyVisits(): Promise<Array<[string, bigint]>>;
    getReview(id: bigint): Promise<Review>;
    getReviewCount(): Promise<bigint>;
    getReviews(): Promise<Array<Review>>;
    getTotalVisits(): Promise<bigint>;
    recordVisit(dateStr: string): Promise<void>;
    setAdminPin(oldPin: string, newPin: string): Promise<boolean>;
    submitReview(name: string, role: string, company: string, reviewText: string, rating: bigint): Promise<bigint>;
    verifyAdmin(pin: string): Promise<boolean>;
}
