import { NextFunction, Request, Response } from "express";
import client from "prom-client";

export const metricsRegister = new client.Registry();

client.collectDefaultMetrics({
  register: metricsRegister,
  prefix: "lms_backend_",
});

const httpRequestCounter = new client.Counter({
  name: "lms_http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status_code"],
  registers: [metricsRegister],
});

const httpRequestDuration = new client.Histogram({
  name: "lms_http_request_duration_seconds",
  help: "HTTP request duration in seconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.005, 0.01, 0.05, 0.1, 0.3, 0.5, 1, 2, 5],
  registers: [metricsRegister],
});

export function metricsMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const startTime = process.hrtime();

  res.on("finish", () => {
    const diff = process.hrtime(startTime);
    const durationInSeconds = diff[0] + diff[1] / 1e9;

    const route =
      req.route?.path && req.baseUrl
        ? `${req.baseUrl}${req.route.path}`
        : req.path;

    const labels = {
      method: req.method,
      route,
      status_code: res.statusCode.toString(),
    };

    httpRequestCounter.inc(labels);
    httpRequestDuration.observe(labels, durationInSeconds);
  });

  next();
}

export async function metricsHandler(req: Request, res: Response) {
  res.setHeader("Content-Type", metricsRegister.contentType);
  const metrics = await metricsRegister.metrics();
  res.send(metrics);
}