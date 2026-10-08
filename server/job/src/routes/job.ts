import express from "express"
import { isAuth } from "../middleware/auth.js";
import uploadFile from "../middleware/multer.js";
import { createCompany, createJob, deleteCompany, getAllActiveJobs, getAllCompany, getCompanyDetails, getSingleJob, updateJob } from "../controllers/job.js";

const router=express.Router();

/**
 * @swagger
 * /api/job/company/new:
 *   post:
 *     summary: Create a company
 *     description: Creates a company for the authenticated recruiter and uploads its logo.
 *     tags:
 *       - Company
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - website
 *               - file
 *             properties:
 *               name:
 *                 type: string
 *                 example: Nexora Technologies
 *               description:
 *                 type: string
 *                 example: A technology company building modern software.
 *               website:
 *                 type: string
 *                 format: uri
 *                 example: https://nexora.example.com
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Company logo image
 *     responses:
 *       200:
 *         description: Company created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Company created successfully
 *                 company:
 *                   $ref: '#/components/schemas/Company'
 *       400:
 *         description: Required company fields or logo file are missing
 *       401:
 *         description: Missing, invalid, or expired authentication token
 *       403:
 *         description: Only recruiters can create companies
 *       409:
 *         description: A company with this name already exists
 *       500:
 *         description: Failed to upload the company logo or create the company
 */
router.post("/company/new",isAuth,uploadFile,createCompany);

/**
 * @swagger
 * /api/job/company/{companyId}:
 *   delete:
 *     summary: Delete a company
 *     description: Deletes a company owned by the authenticated recruiter and all associated jobs.
 *     tags:
 *       - Company
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: companyId
 *         required: true
 *         description: The ID of the company to delete
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 1
 *     responses:
 *       200:
 *         description: Company and associated jobs deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Company and all associated jobs are been deleted
 *       401:
 *         description: Missing, invalid, or expired authentication token
 *       404:
 *         description: Company not found or the authenticated recruiter is not authorized to delete it
 */
router.delete("/company/:companyId",isAuth,deleteCompany);

/**
 * @swagger
 * /api/job/new:
 *   post:
 *     summary: Create a job
 *     description: Creates a job listing for a company owned by the authenticated recruiter.
 *     tags:
 *       - Job
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - salary
 *               - location
 *               - role
 *               - job_type
 *               - work_location
 *               - company_id
 *               - openings
 *             properties:
 *               title:
 *                 type: string
 *                 example: Senior Backend Developer
 *               description:
 *                 type: string
 *                 example: Build and maintain scalable backend services.
 *               salary:
 *                 type: number
 *                 example: 85000
 *               location:
 *                 type: string
 *                 example: New York
 *               role:
 *                 type: string
 *                 example: Backend Developer
 *               job_type:
 *                 type: string
 *                 enum:
 *                   - Full-time
 *                   - Part-time
 *                   - Contract
 *                   - Internship
 *                 example: Full-time
 *               work_location:
 *                 type: string
 *                 enum:
 *                   - On_site
 *                   - Remote
 *                   - Hybrid
 *                 example: Remote
 *               company_id:
 *                 type: integer
 *                 minimum: 1
 *                 example: 1
 *               openings:
 *                 type: number
 *                 example: 2
 *     responses:
 *       200:
 *         description: Job posted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Job posted successfully
 *                 job:
 *                   $ref: '#/components/schemas/Job'
 *       400:
 *         description: Required job fields are missing
 *       401:
 *         description: Missing, invalid, or expired authentication token
 *       403:
 *         description: Only recruiters can create jobs
 *       404:
 *         description: Company not found or not owned by the authenticated recruiter
 */
router.post("/new",isAuth,createJob);

/**
 * @swagger
 * /api/job/{jobId}:
 *   put:
 *     summary: Update a job
 *     description: Updates a job listing owned by the authenticated recruiter.
 *     tags:
 *       - Job
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         description: The ID of the job to update
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - salary
 *               - location
 *               - role
 *               - job_type
 *               - work_location
 *               - openings
 *               - is_active
 *             properties:
 *               title:
 *                 type: string
 *                 example: Senior Backend Developer
 *               description:
 *                 type: string
 *                 example: Build and maintain scalable backend services.
 *               salary:
 *                 type: number
 *                 example: 90000
 *               location:
 *                 type: string
 *                 example: New York
 *               role:
 *                 type: string
 *                 example: Backend Developer
 *               job_type:
 *                 type: string
 *                 enum:
 *                   - Full-time
 *                   - Part-time
 *                   - Contract
 *                   - Internship
 *                 example: Full-time
 *               work_location:
 *                 type: string
 *                 enum:
 *                   - On_site
 *                   - Remote
 *                   - Hybrid
 *                 example: Remote
 *               company_id:
 *                 type: integer
 *                 minimum: 1
 *                 example: 1
 *               openings:
 *                 type: number
 *                 example: 2
 *               is_active:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Job updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Job updated Successfully
 *                 job:
 *                   $ref: '#/components/schemas/Job'
 *       401:
 *         description: Missing, invalid, or expired authentication token
 *       403:
 *         description: Only the recruiter who posted the job can update it
 *       404:
 *         description: Job not found
 */
router.put("/:jobId",isAuth,updateJob);

/**
 * @swagger
 * /api/job/company/all:
 *   get:
 *     summary: Get all companies owned by the authenticated recruiter
 *     tags:
 *       - Company
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of companies owned by the authenticated recruiter
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Company'
 *       401:
 *         description: Missing, invalid, or expired authentication token
 *       500:
 *         description: Failed to retrieve companies
 */
router.get("/company/all",isAuth,getAllCompany);

/**
 * @swagger
 * /api/job/company/{id}:
 *   get:
 *     summary: Get company details
 *     description: Returns company details together with all jobs belonging to the company.
 *     tags:
 *       - Company
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the company to retrieve
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 1
 *     responses:
 *       200:
 *         description: Company details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Company'
 *                 - type: object
 *                   properties:
 *                     jobs:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Job'
 *       400:
 *         description: Company ID is required
 *       401:
 *         description: Missing, invalid, or expired authentication token
 *       404:
 *         description: Company not found
 *       500:
 *         description: Failed to retrieve company details
 */
router.get("/company/:id",isAuth,getCompanyDetails);

/**
 * @swagger
 * /api/job/all:
 *   get:
 *     summary: Get all active jobs
 *     description: Returns all active jobs, optionally filtered by title and location.
 *     tags:
 *       - Job
 *     parameters:
 *       - in: query
 *         name: title
 *         required: false
 *         description: Filter jobs by title
 *         schema:
 *           type: string
 *         example: Developer
 *       - in: query
 *         name: location
 *         required: false
 *         description: Filter jobs by location
 *         schema:
 *           type: string
 *         example: New York
 *     responses:
 *       200:
 *         description: List of active jobs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   job_id:
 *                     type: integer
 *                     example: 1
 *                   title:
 *                     type: string
 *                     example: Senior Backend Developer
 *                   description:
 *                     type: string
 *                     example: Build and maintain scalable backend services.
 *                   salary:
 *                     type: number
 *                     example: 85000
 *                   location:
 *                     type: string
 *                     example: New York
 *                   job_type:
 *                     type: string
 *                     example: Full-time
 *                   role:
 *                     type: string
 *                     example: Backend Developer
 *                   work_location:
 *                     type: string
 *                     example: Remote
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                   company_name:
 *                     type: string
 *                     example: Nexora Technologies
 *                   company_logo:
 *                     type: string
 *                     format: uri
 *                     example: https://example.com/company-logo.png
 *                   company_id:
 *                     type: integer
 *                     example: 1
 *       500:
 *         description: Failed to retrieve active jobs
 */
router.get("/all",getAllActiveJobs);

/**
 * @swagger
 * /api/job/{jobId}:
 *   get:
 *     summary: Get a single job
 *     description: Returns the job matching the supplied job ID.
 *     tags:
 *       - Job
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         description: The ID of the job to retrieve
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 1
 *     responses:
 *       200:
 *         description: Job retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Job'
 *       404:
 *         description: Job not found
 *       500:
 *         description: Failed to retrieve the job
 */
router.get("/:jobId",getSingleJob);

export default router;