import { Id } from "convex/_generated/dataModel";


export type Difficulty = "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT";

export interface Template {
  _id: Id<"marketplaceTemplates">;
  userId: string;
  title: string;
  description: string;
  code: string;
  language: string;
  framework: string;
  previewImage: string;
  downloads: number;
  userName: string;
  difficulty: Difficulty;
  complexity: number;
  tags: string[];
  version: string;
  createdAt: number;
  updatedAt: number;
  isPro?: boolean;
  price?: number;
  averageRating?: number;
}
