import express from "express";
import { loginUser, registerUser } from "../controllers/auth.js";
import uploadFile from "../middleware/multer.js";

const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - phoneNumber
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password123
 *               phoneNumber:
 *                 type: string
 *                 example: "+1234567890"
 *               role:
 *                 type: string
 *                 enum:
 *                   - recruiter
 *                   - jobseeker
 *                 example: recruiter
 *               bio:
 *                 type: string
 *                 example: Experienced software developer
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Required when role is jobseeker
 *     responses:
 *       200:
 *         description: User registered successfully
 *       400:
 *         description: Missing details or resume file
 *       409:
 *         description: Email already exists
 */

router.post("/register", uploadFile, registerUser);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Log in a user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User LoggedIn
 *                 userObject:
 *                   type: object
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
 *       400:
 *         description: Missing details or invalid credentials
 */

router.post("/login",loginUser)

export default router;