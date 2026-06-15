import { Router, type IRouter } from "express";
import { SubmitContactBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/contact", (req, res) => {
  const parsed = SubmitContactBody.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ error: "Invalid submission. Please check all fields." });
    return;
  }

  const { name, phone, email, message } = parsed.data;

  req.log.info({ name, phone, email }, "New contact form submission received");

  res.status(201).json({
    success: true,
    message: "Thank you for reaching out! A member of our team will contact you shortly.",
  });
});

export default router;
