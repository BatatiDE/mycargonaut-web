import { NextApiRequest, NextApiResponse } from "next";

const API_URL = "http://localhost:8080/api/vehicles"; // Dein Backend-Endpoint

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  if (method === "GET") {
    const response = await fetch(API_URL);
    const data = await response.json();
    return res.status(200).json(data);
  }

  if (method === "POST") {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });
    const data = await response.json();
    return res.status(response.status).json(data);
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Method ${method} Not Allowed`);
}
