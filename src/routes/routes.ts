import { Express } from "express";
import AppDependencies from "appDependencies";

export function registerRouters(app: Express, dependencies: AppDependencies) {
    app.get("/health", (_, res) => res.status(200).send());
}
