import { forwardToCircle } from "../server/services/circleProxyService.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method Not Allowed",
    });
  }

  try {
    const { path, method, headers, body } = req.body || {};

    const result = await forwardToCircle({
      path,
      method,
      headers,
      body,
    });

    Object.entries(result.headers || {}).forEach(([key, value]) => {
      res.setHeader(key, value);
    });

    return res.status(result.status).send(result.body);
  } catch (err) {
    console.error(err);

    return res.status(err.upstreamStatus || 500).json({
      error: err.message,
      details: err.responseBody,
    });
  }
}