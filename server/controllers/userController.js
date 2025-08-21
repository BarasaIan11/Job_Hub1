import prisma from "../config/db.js";
import { v2 as cloudinary } from "cloudinary";

// get user data
export const getUserData = async (req, res) => {
  const userId = req.auth.userId;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User Not Found" });
    }

    // It's good practice to not send the password, even if it's null
    const { password, ...userData } = user;
    res.json({ success: true, user: userData });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching user data." });
  }
};

// apply for a job
export const applyForJob = async (req, res) => {
  const { jobId } = req.body;
  const userId = req.auth.userId;

  try {
    const parsedJobId = parseInt(jobId);
    if (isNaN(parsedJobId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Job ID provided." });
    }

    // 1. Check if the job exists
    const jobData = await prisma.job.findUnique({
      where: { id: parsedJobId },
    });
    if (!jobData) {
      return res.status(404).json({ success: false, message: "Job Not Found" });
    }

    // 2. Check if the user has already applied
    const existingApplication = await prisma.jobApplication.findFirst({
      where: {
        jobId: parsedJobId,
        userId: userId,
      },
    });
    if (existingApplication) {
      return res
        .status(409)
        .json({
          success: false,
          message: "You have already applied for this job.",
        });
    }

    // 3. Create the new application
    await prisma.jobApplication.create({
      data: {
        userId: userId,
        jobId: parsedJobId,
        companyId: jobData.companyId,
        date: BigInt(Date.now()),
      },
    });

    res.status(201).json({ success: true, message: "Applied Successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "An error occurred while applying." });
  }
};

// get user applied applications
export const getUserJobApplications = async (req, res) => {
  try {
    const userId = req.auth.userId;

    const applications = await prisma.jobApplication.findMany({
      where: { userId: userId },
      include: {
        company: {
          select: { name: true, email: true, image: true },
        },

        job: {
          select: {
            title: true,
            description: true,
            location: true,
            category: true,
            level: true,
            salary: true,
          },
        },
      },
    });

    if (applications.length === 0) {
      return res.json({
        success: true,
        message: "No job applications found for this user.",
        applications: [],
      });
    }

    return res.json({ success: true, applications });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching applications." });
  }
};

// update user profile(resume)
export const updateUserResume = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const resumeFile = req.file;

    if (!resumeFile) {
      return res
        .status(400)
        .json({ success: false, message: "No resume file provided." });
    }

    const resumeUpload = await cloudinary.uploader.upload(resumeFile.path);

    await prisma.user.update({
      where: { id: userId },
      data: { resume: resumeUpload.secure_url },
    });

    return res.json({ success: true, message: "Resume updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error updating resume." });
  }
};
