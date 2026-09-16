import { config } from "dotenv";
import path from "path";

config({
    path: path.resolve(
        __dirname, 
        process.env.DOCKER_TEST === "true"
          ? "../.env.docker-test"
          : "../.env.test"
        ),
    override: true
})