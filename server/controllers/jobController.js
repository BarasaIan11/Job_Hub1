import prisma from "../config/db.js";

// get all jobs
export const getJobs = async (req, res) => {
  try {
    const jobs = await prisma.job.findMany({
      where: {
        visible: true,
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    res.json({ success: true, jobs });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        success: false,
        message: "An error occurred while fetching jobs.",
      });
  }
};

// get a single job by ID
export const getJobById = async (req, res) => {
  try {
    const { id } = req.params;

    const jobId = parseInt(id);

    if (isNaN(jobId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Job ID." });
    }

    const job = await prisma.job.findUnique({
      where: {
        id: jobId,
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.json({
      success: true,
      job,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        success: false,
        message: "An error occurred while fetching the job.",
      });
  }
};
