import swaggerJSDoc from "swagger-jsdoc";

const swaggerOptions: swaggerJSDoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Nexora Job API",
            version: "1.0.0",
            description: "Job and company service API",
        },
        servers: [
            {
                url: "http://localhost:5003",
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
                Company: {
                    type: "object",
                    properties: {
                        company_id: {
                            type: "integer",
                            example: 1,
                        },
                        name: {
                            type: "string",
                            example: "Nexora Technologies",
                        },
                        description: {
                            type: "string",
                            example: "A technology company building modern software.",
                        },
                        website: {
                            type: "string",
                            format: "uri",
                            example: "https://nexora.example.com",
                        },
                        logo: {
                            type: "string",
                            format: "uri",
                            example: "https://example.com/company-logo.png",
                        },
                        logo_public_id: {
                            type: "string",
                            example: "company-logo-123",
                        },
                        recruiter_id: {
                            type: "integer",
                            example: 1,
                        },
                        created_at: {
                            type: "string",
                            format: "date-time",
                        },
                    },
                },
                Job: {
                    type: "object",
                    properties: {
                        job_id: {
                            type: "integer",
                            example: 1,
                        },
                        title: {
                            type: "string",
                            example: "Senior Backend Developer",
                        },
                        description: {
                            type: "string",
                            example: "Build and maintain scalable backend services.",
                        },
                        salary: {
                            type: "number",
                            example: 85000,
                        },
                        location: {
                            type: "string",
                            example: "New York",
                        },
                        job_type: {
                            type: "string",
                            enum: ["Full-time", "Part-time", "Contract", "Internship"],
                            example: "Full-time",
                        },
                        openings: {
                            type: "number",
                            example: 2,
                        },
                        role: {
                            type: "string",
                            example: "Backend Developer",
                        },
                        work_location: {
                            type: "string",
                            enum: ["On_site", "Remote", "Hybrid"],
                            example: "Remote",
                        },
                        company_id: {
                            type: "integer",
                            example: 1,
                        },
                        posted_by_recruiter_id: {
                            type: "integer",
                            example: 1,
                        },
                        created_at: {
                            type: "string",
                            format: "date-time",
                        },
                        is_active: {
                            type: "boolean",
                            example: true,
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
