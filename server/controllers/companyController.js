import prisma from "../config/db.js";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import generateToken from "../utils/generateToken.js";

// register new company
export const registerCompany = async (req, res) => {
  const { name, email, password } = req.body;
  const imageFile = req.file;

  if (!name || !email || !password || !imageFile) {
    return res.status(400).json({ success: false, message: "Missing Details" });
  }

  try {
    const companyExists = await prisma.company.findUnique({
      where: { email },
    });

    if (companyExists) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Company with this email already exists",
        });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const imageUpload = await cloudinary.uploader.upload(imageFile.path);

    const company = await prisma.company.create({
      data: {
        name,
        email,
        password: hashPassword,
        image: imageUpload.secure_url,
      },
    });

    res.status(201).json({
      success: true,
      company: {
        id: company.id,
        name: company.name,
        email: company.email,
        image: company.image,
      },
      token: generateToken(company.id),
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error during registration." });
  }
};

// company login
export const loginCompany = async (req, res) => {
  const { email, password } = req.body;

  try {
    const company = await prisma.company.findUnique({
      where: { email },
    });

    if (company && (await bcrypt.compare(password, company.password))) {
      res.json({
        success: true,
        company: {
          id: company.id,
          name: company.name,
          email: company.email,
          image: company.image,
        },
        token: generateToken(company.id),
      });
    } else {
      res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error during login." });
  }
};

// get company data (This relies on the updated middleware)
export const getCompanyData = async (req, res) => {
  try {
    // The protectCompany middleware will attach the company data to req.company
    const company = req.company;
    res.json({ success: true, company });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Could not retrieve company data." });
  }
};

// post a new job
export const postJob = async (req, res) => {
  const { title, description, location, salary, level, category } = req.body;
  const companyId = req.company.id; // From our middleware

  try {
    const newJob = await prisma.job.create({
      data: {
        title,
        description,
        location,
        salary: parseInt(salary), // Ensure salary is an integer
        level,
        category,
        date: BigInt(Date.now()), // Convert date to BigInt
        company: {
          connect: { id: companyId }, // Connect to the company
        },
      },
    });

    res.status(201).json({ success: true, newJob });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to post job." });
  }
};

// get company job applicants
export const getCompanyJobApplicants = async (req, res) => {
  try {
    const companyId = req.company.id;

    const applications = await prisma.jobApplication.findMany({
      where: { companyId: companyId },
      include: {
        user: {
          // Equivalent to populate('userId')
          select: { name: true, image: true, resume: true },
        },
        job: {
          // Equivalent to populate('jobId')
          select: {
            title: true,
            location: true,
            category: true,
            level: true,
            salary: true,
          },
        },
      },
    });

    return res.json({ success: true, applications });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to get applicants." });
  }
};

// get company posted jobs
export const getCompanyPostedJobs = async (req, res) => {
  try {
    const companyId = req.company.id;

    const jobs = await prisma.job.findMany({
      where: { companyId: companyId },
      include: {
        // Prisma can count related records for you!
        _count: {
          select: { jobApplications: true },
        },
      },
    });

    // Map the data to the format your frontend expects
    const jobsData = jobs.map((job) => ({
      ...job,
      applicants: job._count.jobApplications,
    }));

    res.json({ success: true, jobsData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to list jobs." });
  }
};

// change job application status
export const ChangeJobApplicationStatus = async (req, res) => {
  try {
    const { id, status } = req.body;
    const applicationId = parseInt(id);

    await prisma.jobApplication.update({
      where: { id: applicationId },
      data: { status },
    });

    res.json({ success: true, message: "Status Changed" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to change status." });
  }
};

// change job visibility
export const changeVisibility = async (req, res) => {
  try {
    const { id } = req.body;
    const jobId = parseInt(id);
    const companyId = req.company.id;

    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });

    // Authorization check: Does this job belong to the company?
    if (job && job.companyId === companyId) {
      const updatedJob = await prisma.job.update({
        where: { id: jobId },
        data: { visible: !job.visible }, // Toggle visibility
      });
      res.json({ success: true, job: updatedJob });
    } else {
      res
        .status(403)
        .json({
          success: false,
          message: "You are not authorized to change this job.",
        });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to change visibility." });
  }
};
