import express from "express"
import { isAuth } from "../middleware/auth.js";
import { getUserProfile, myProfile } from "../controllers/user.js";

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

export default router;