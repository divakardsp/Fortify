import "dotenv/config";
import express from "express";
import type { Express } from "express";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import clientRoutes from "./modules/clients/client.routes.js";
import oAuthRoutes from "./modules/oAuth/oAuth.routes.js";
import usersRoutes from "./modules/auth/auth.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app: Express = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static files from public folder
app.use(express.static(path.join(__dirname, "../public")));

app.use("/api/users", usersRoutes);
app.use("/api/clients", clientRoutes);
app.use("/.well-known/openid-configuration", oAuthRoutes);
app.use("/oauth", oAuthRoutes);

// Serve index.html for root route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});

export default app;
