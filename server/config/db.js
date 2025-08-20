import { PrismaClient } from "@prisma/client";

// Create a single, shared instance of the Prisma Client
const prisma = new PrismaClient();

export default prisma;
