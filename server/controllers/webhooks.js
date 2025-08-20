import { Webhook } from "svix";
import prisma from "../config/db.js"; // Import the Prisma Client

// API Controller function to manage clerk user with database
export const clerkWebhooks = async (req, res) => {
  try {
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // Verifying headers
    const payload = await whook.verify(JSON.stringify(req.body), {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    // Getting data from the verified payload
    const { data, type } = payload;

    // Switch case for different events
    switch (type) {
      case "user.created": {
        await prisma.user.create({
          data: {
            id: data.id, // Map Clerk's id to our primary key 'id'
            email: data.email_addresses[0].email_address,
            name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
            image: data.image_url,
            resume: "", // Set a default empty string
          },
        });
        console.log("User created:", data.id);
        break;
      }

      case "user.updated": {
        await prisma.user.update({
          where: { id: data.id },
          data: {
            email: data.email_addresses[0].email_address,
            name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
            image: data.image_url,
          },
        });
        console.log("User updated:", data.id);
        break;
      }

      case "user.deleted": {
        // Ensure data.id exists and is not null/undefined
        if (data.id) {
          await prisma.user.delete({
            where: { id: data.id },
          });
          console.log("User deleted:", data.id);
        }
        break;
      }
      default:
        // For any other event type, we can just log it
        console.log("Received unhandled webhook event:", type);
        break;
    }

    // Acknowledge the webhook was received successfully
    res.status(200).json({ success: true, message: "Webhook processed." });
  } catch (error) {
    console.error("Error processing Clerk webhook:", error.message);
    res.status(400).json({ success: false, message: "Webhook Error" });
  }
};
