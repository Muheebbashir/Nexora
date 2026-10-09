import express from "express"
import { isAuth } from "../middleware/auth.js";
import uploadFile from "../middleware/multer.js";
import { addSkillsToUser, applyForJob, deleteSkillFromUser, getAllApplication, getUserProfile, myProfile, updateProfilePic, updateResume, updateUserProfile } from "../controllers/user.js";

const router=express.Router();

/**
 * @swagger
 * /api/user/me:
 *   get:
 *     summary: Get the authenticated user's profile
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The authenticated user's profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Missing, invalid, or expired authentication token
 */
router.get("/me",isAuth,myProfile);

/**
 * @swagger
 * /api/user/{userId}:
 *   get:
 *     summary: Get a user's public profile
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The ID of the user whose profile should be returned
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 1
 *     responses:
 *       200:
 *         description: The requested user's profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Missing, invalid, or expired authentication token
 *       404:
 *         description: User not found
 *       500:
 *         description: Failed to retrieve the user profile
 */
router.get("/:userId",isAuth,getUserProfile);

/**
 * @swagger
 * /api/user/update/profile:
 *   put:
 *     summary: Update the authenticated user's profile
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The ID included in the profile update route
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
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               phoneNumber:
 *                 type: string
 *                 example: "+1234567890"
 *               bio:
 *                 type: string
 *                 example: Experienced software developer
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Profile updated Successfully
 *                 updatedUser:
 *                   type: object
 *                   properties:
 *                     user_id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: John Doe
 *                     email:
 *                       type: string
 *                       format: email
 *                       example: john@example.com
 *                     phone_number:
 *                       type: string
 *                       example: "+1234567890"
 *                     bio:
 *                       type: string
 *                       nullable: true
 *                       example: Experienced software developer
 *       401:
 *         description: Missing, invalid, or expired authentication token
 *       500:
 *         description: Failed to update the user profile
 */
router.put("/update/profile",isAuth,updateUserProfile);

/**
 * @swagger
 * /api/user/update/pic:
 *   put:
 *     summary: Update the authenticated user's profile picture
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The new profile picture
 *     responses:
 *       200:
 *         description: Profile picture updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Profile pic updated
 *                 updatedUser:
 *                   type: object
 *                   properties:
 *                     user_id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: John Doe
 *                     profile_pic:
 *                       type: string
 *                       format: uri
 *                       example: https://example.com/profile.jpg
 *       400:
 *         description: No image file provided
 *       401:
 *         description: Missing, invalid, or expired authentication token
 *       500:
 *         description: Failed to upload or update the profile picture
 */
router.put("/update/pic",isAuth,uploadFile,updateProfilePic);

/**
 * @swagger
 * /api/user/update/resume:
 *   put:
 *     summary: Update the authenticated user's resume
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The new resume PDF
 *     responses:
 *       200:
 *         description: Resume updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Resume updated
 *                 updatedUser:
 *                   type: object
 *                   properties:
 *                     user_id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: John Doe
 *                     resume:
 *                       type: string
 *                       format: uri
 *                       example: https://example.com/resume.pdf
 *       400:
 *         description: No resume file provided
 *       401:
 *         description: Missing, invalid, or expired authentication token
 *       500:
 *         description: Failed to upload or update the resume
 */
router.put("/update/resume",isAuth,uploadFile,updateResume);

/**
 * @swagger
 * /api/user/skill/add:
 *   post:
 *     summary: Add a skill to the authenticated user's profile
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - skillName
 *             properties:
 *               skillName:
 *                 type: string
 *                 example: TypeScript
 *     responses:
 *       200:
 *         description: Skill added, or the user already has the skill
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   examples:
 *                     added:
 *                       value: Skill TypeScript is added successfully
 *                     alreadyExists:
 *                       value: User already posseses this skill
 *       400:
 *         description: Skill name is missing or empty
 *       401:
 *         description: Missing, invalid, or expired authentication token
 *       404:
 *         description: User not found
 *       500:
 *         description: Failed to create or find the skill
 */
router.post("/skill/add",isAuth,addSkillsToUser);

/**
 * @swagger
 * /api/user/skill/delete:
 *   delete:
 *     summary: Remove a skill from the authenticated user's profile
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - skillName
 *             properties:
 *               skillName:
 *                 type: string
 *                 example: TypeScript
 *     responses:
 *       200:
 *         description: Skill removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Skill TypeScript was deleted successfully
 *       400:
 *         description: Skill name is missing or empty
 *       401:
 *         description: Missing, invalid, or expired authentication token
 *       404:
 *         description: Skill not found
 */
router.delete("/skill/delete",isAuth,deleteSkillFromUser);

/**
 * @swagger
 * /api/user/apply/job:
 *   post:
 *     summary: Apply for a job
 *     description: Submit a job application using the authenticated jobseeker's profile resume.
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - job_id
 *             properties:
 *               job_id:
 *                 type: integer
 *                 minimum: 1
 *                 description: The ID of the job being applied for
 *                 example: 12
 *     responses:
 *       200:
 *         description: Job application submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Applied for this job successfully
 *                 application:
 *                   $ref: '#/components/schemas/Application'
 *       400:
 *         description: Resume is missing, job ID is missing, or the job is inactive
 *       401:
 *         description: Missing, invalid, or expired authentication token
 *       403:
 *         description: The authenticated user is not a jobseeker
 *       404:
 *         description: Job not found
 *       409:
 *         description: The user has already applied to this job
 *       500:
 *         description: Failed to submit the job application
 */
router.post("/apply/job",isAuth,applyForJob);

/**
 * @swagger
 * /api/user/application/all:
 *   get:
 *     summary: Get all applications submitted by the authenticated user
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The authenticated user's job applications
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Application'
 *       401:
 *         description: Missing, invalid, or expired authentication token
 *       500:
 *         description: Failed to retrieve job applications
 */
router.get("/application/all",isAuth,getAllApplication);

export default router;