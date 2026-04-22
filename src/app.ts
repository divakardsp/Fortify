import 'dotenv/config'
import  express  from 'express';
import type { Express } from 'express';
import cookieParser from 'cookie-parser';
import authRoute from "./modules/auth/auth.routes.js"

const app: Express = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser())

app.use("/api/auth", authRoute)


export default app;