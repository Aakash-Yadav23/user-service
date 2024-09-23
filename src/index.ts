import path from "path";
import getConfig from "./config/Config";
import { App } from "./providers/App";


getConfig();

const app=new App();


app.initServer()