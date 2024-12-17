import { Router } from "express";
import axios from "axios";

const router = Router();

router.post("/", async (req, res) => {
  const { image } = req.body;

  if (!image)
    return res
      .status(400)
      .json({ error: "No image provided in the request body!" });

  try {
    const flaskResponse = await axios.post("http://localhost:5000/api/upload", {
      image: image,
    });

    res.status(200).json({
      message: "Image processed successfully!",
      result: flaskResponse.data.result,
    });
  } catch (err) {
    console.error("Error calling Flask API:", err.message);
    res.status(500).json({ error: "Failed to connect to Flask API" });
  }
});

export default router;
