import { sql } from "../utils/db.js";
import ErrorHandler from "../utils/errorHandler.js";
import { TryCatch } from "../utils/TryCatch.js";
import bcrypt from "bcrypt";
import getBuffer from "../utils/buffer.js";
import axios from "axios";
import jwt from "jsonwebtoken";
import { forgotPasswordTemplate } from "../template.js";
import { publishTotopic } from "../producer.js";
import { redisCLient } from "../index.js";

export const registerUser = TryCatch(async (req, res, next) => {
  const { name, email: rawEmail, password, phoneNumber, role, bio } = req.body;
  const email = rawEmail?.trim().toLowerCase();

  if (!name || !email || !password || !phoneNumber || !role) {
    throw new ErrorHandler(400, "Please fill all Details");
  }

  const existingUsers =
    await sql`SELECT user_id FROM users WHERE email = ${email}`;

  if (existingUsers.length > 0) {
    throw new ErrorHandler(409, "User with this email already exists");
  }

  const hashPassword = await bcrypt.hash(password, 10);

  let registeredUser;

  if (role === "recruiter") {
    const [user] =
      await sql`INSERT INTO users (name,email,password,phone_number,role) VALUES
        (${name},${email},${hashPassword},${phoneNumber},${role}) RETURNING
        user_id,name,email,phone_number,role,created_at`;

    registeredUser = user;
  } else if (role === "jobseeker") {
    const file = req.file;

    if (!file) {
      throw new ErrorHandler(400, "Resume file is required for jobseekers");
    }

    const fileBuffer = getBuffer(file);
    if (!fileBuffer || !fileBuffer.content) {
      throw new ErrorHandler(500, "Failed to Generate Buffer");
    }

    const { data } = await axios.post(
      `${process.env.UPLOAD_SERVICE}/api/utils/upload`,
      {
        buffer: fileBuffer.content,
      },
    );

    const [user] =
      await sql`INSERT INTO users (name,email,password,phone_number,role,bio,resume,resume_public_id) VALUES
        (${name},${email},${hashPassword},${phoneNumber},${role},${bio},${data.url},${data.public_id}) RETURNING
        user_id,name,email,phone_number,role,bio,resume,created_at`;

    registeredUser = user;
  }

  const token = jwt.sign(
    {
      id: registeredUser?.user_id,
    },
    process.env.JWT_SEC as string,
    {
      expiresIn: "15d",
    },
  );

  res.json({
    message: "User Registered",
    registeredUser,
    token,
  });
});

export const loginUser = TryCatch(async (req, res, next) => {
  const { email: rawEmail, password } = req.body;
  const email = rawEmail?.trim().toLowerCase();
  if (!email || !password) {
    throw new ErrorHandler(400, "Please fill all Details");
  }
  const user = await sql`
    SELECT u.user_id,u.name,u.password,u.phone_number,u.role,u.bio,u.resume,u.profile_pic,u.subscription,ARRAY_AGG(s.name) FILTER (WHERE s.name IS NOT NULL) as skills FROM users u LEFT JOIN user_skills us ON u.user_id = us.user_id
    LEFT JOIN skills s ON us.skill_id =s.skill_id
    WHERE u.email = ${email} GROUP BY u.user_id;
    `;

  if (user.length === 0) {
    throw new ErrorHandler(400, "Invalid Credentials");
  }

  const userObject = user[0];

  if (!userObject) {
    throw new ErrorHandler(400, "Invalid Credentials");
  }

  const matchPassword = await bcrypt.compare(password, userObject.password);

  if (!matchPassword) {
    throw new ErrorHandler(400, "Invalid Credentials");
  }

  userObject.skills = userObject.skills || [];

  delete userObject.password;

  const token = jwt.sign(
    {
      id: userObject?.user_id,
    },
    process.env.JWT_SEC as string,
    {
      expiresIn: "15d",
    },
  );

  res.json({
    message: "User LoggedIn",
    userObject,
    token,
  });
});

export const forgotPassword = TryCatch(async (req, res, next) => {
  const { email: rawEmail } = req.body;
  const email = rawEmail?.trim().toLowerCase();
  if (!email) {
    throw new ErrorHandler(400, "Email is required");
  }

  const users = await sql`SELECT user_id,email FROM users WHERE email=${email}`;

  if (users.length === 0) {
    return res.json({
      message: "if that email exists,we have sent a reset link",
    });
  }

  const user = users[0];

  if (!user) {
    return res.json({
      message: "if that email exists,we have sent a reset link",
    });
  }

  const resetToken = jwt.sign(
    {
      email: user.email,
      type: "reset",
    },
    process.env.JWT_SEC as string,
    {
      expiresIn: "15m",
    },
  );

  const resetLink = `${process.env.Frontend_Url}/reset/${resetToken}`;

  await redisCLient.set(`forgot:${email}`, resetToken, {
    EX: 900,
  });

  const message = {
    to: email,
    subject: "RESET Your Password - Nexora",
    html: forgotPasswordTemplate(resetLink),
  };

  publishTotopic("send-mail", message);

  res.json({
    message: "if that email exists,we have sent a reset link",
  });
});

export const resetPassword = TryCatch(async (req, res, next) => {
  const { token } = req.params;
  const { password } = req.body;

  if (typeof token !== "string" || !token) {
    throw new ErrorHandler(400, "Invalid reset token");
  }

  let decoded: { email: string; type: string };

  try {
    decoded = jwt.verify(token, process.env.JWT_SEC as string) as {
      email: string;
      type: string;
    };
  } catch {
    throw new ErrorHandler(400, "Expired Token");
  }

  if (decoded.type !== "reset") {
    throw new ErrorHandler(400, "Invalid Token Type");
  }

  const email = decoded.email;

  const storedToken = await redisCLient.get(`forgot:${email}`);

  if (!storedToken || storedToken !== token) {
    throw new ErrorHandler(400, "token has been expired");
  }

  const users = await sql`SELECT user_id FROM users WHERE email =${email}`;

  if (users.length === 0) {
    throw new ErrorHandler(404, "User not found");
  }
  const user = users[0];

  if (!user) {
    throw new ErrorHandler(404, "User not found");
  }

  const hashPassword = await bcrypt.hash(password, 10);

  await sql`UPDATE users SET password =${hashPassword} WHERE user_id = ${user.user_id}`;

  await redisCLient.del(`forgot:${email}`);

  res.json({
    message: "Password changed successfully",
  });
});
