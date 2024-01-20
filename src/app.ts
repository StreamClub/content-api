import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { exceptionToHttpError } from '@middlewares';
import { registerRouters } from "@routes";
import AppDependencies from "./appDependencies";
import { toCamelCase } from "@middlewares";
import { config } from "@config";

export class App {
    private dependencies: AppDependencies;
    public constructor(dependencies: AppDependencies) {
        this.dependencies = dependencies;
    }

    public async start(production = true) {
        if (production) await mongoose.connect(config.dbUrl);
        const app = express();

        app.use(cors());
        app.use(express.json());
        app.use(toCamelCase())
        registerRouters(app, this.dependencies);
        app.use(exceptionToHttpError);
        return app;
    }
}
