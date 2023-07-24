const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const app = express();

// Define the target URL of your backend server
const backendURL = "https://talk-app-mern.vercel.app";

// Set up the proxy middleware to forward requests to the backendURL
app.use(
  "/user",
  createProxyMiddleware({
    target: backendURL,
    changeOrigin: true,
  })
);

app.use(
  "/chat",
  createProxyMiddleware({
    target: backendURL,
    changeOrigin: true,
  })
);

app.use(
  "/message",
  createProxyMiddleware({
    target: backendURL,
    changeOrigin: true,
  })
);
