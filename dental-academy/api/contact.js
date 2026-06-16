export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, phone, email, message } = req.body ?? {};

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Invalid submission. Please check all fields." });
  }

  console.log("New contact form submission:", { name, phone, email });

  return res.status(201).json({
    success: true,
    message: "Thank you for reaching out! A member of our team will contact you shortly.",
  });
}
