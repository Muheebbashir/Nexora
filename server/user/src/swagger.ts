import swaggerJSDoc from "swagger-jsdoc";

const swaggerOptions: swaggerJSDoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Nexora User API",
            version: "1.0.0",
            description: "User profile service API",
        },
        servers: [
            {
                url: "http://localhost:5002",
                description: "Local server",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
            schemas: {
                User: {
                    type: "object",
                    properties: {
                        user_id: {
                            type: "integer",
                            example: 1,
                        },
                        name: {
                            type: "string",
                            example: "John Doe",
                        },
                        email: {
                            type: "string",
                            format: "email",
                            example: "john@example.com",
                        },
                        phone_number: {
                            type: "string",
                            example: "+1234567890",
                        },
                        role: {
                            type: "string",
                            enum: ["jobseeker", "recruiter"],
                            example: "jobseeker",
                        },
                        bio: {
                            type: "string",
                            nullable: true,
                            example: "Experienced software developer",
                        },
                        resume: {
                            type: "string",
                            nullable: true,
                            example: "https://example.com/resume.pdf",
                        },
                        resume_public_id: {
                            type: "string",
                            nullable: true,
                            example: "resume_123",
                        },
                        profile_pic: {
                            type: "string",
                            nullable: true,
                            example: "https://example.com/profile.jpg",
                        },
                        profile_pic_public_id: {
                            type: "string",
                            nullable: true,
                            example: "profile_123",
                        },
                        skills: {
                            type: "array",
                            items: {
                                type: "string",
                            },
                            example: ["TypeScript", "PostgreSQL"],
                        },
                        subscription: {
                            type: "string",
                            nullable: true,
                            example: "premium",
                        },
                    },
                },
                Application: {
                    type: "object",
                    properties: {
                        application_id: {
                            type: "integer",
                            example: 1,
                        },
                        job_id: {
                            type: "integer",
                            example: 12,
                        },
                        applicant_id: {
                            type: "integer",
                            example: 5,
                        },
                        applicant_email: {
                            type: "string",
                            format: "email",
                            example: "john@example.com",
                        },
                        status: {
                            type: "string",
                            example: "Submitted",
                        },
                        resume: {
                            type: "string",
                            format: "uri",
                            example: "https://example.com/resume.pdf",
                        },
                        applied_at: {
                            type: "string",
                            format: "date-time",
                        },
                        subscribed: {
                            type: "boolean",
                            example: true,
                        },
                        job_title: {
                            type: "string",
                            example: "Senior Backend Developer",
                        },
                        job_salary: {
                            type: "number",
                            example: 85000,
                        },
                        job_location: {
                            type: "string",
                            example: "New York",
                        },
                    },
                },
            },
        },
    },
    apis: ["./src/routes/*.ts"],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export default swaggerSpec;
