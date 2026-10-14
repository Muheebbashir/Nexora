export interface JobOptions{
    title:string,
    responsibilities:string,
    why:string
}

export interface skillsToLearn{
    title:string;
    why:string;
    how:string;
}

export interface SkillCategory{
    category:string;
    skills:skillsToLearn[];
}

export interface LearningApproach{
    title:string;
    points:string[];
}

export interface CarrerGuideResponse{
    summary:string;
    jobOptions:JobOptions[];
    skillsToLearn:SkillCategory[];
    learningApproach:LearningApproach;
}

export const utils_service="http://localhost:5001"