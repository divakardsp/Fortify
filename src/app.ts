import 'dotenv/config'
import  express  from 'express';
import type { Express } from 'express';
import cookieParser from 'cookie-parser';
import clientRoutes from "./modules/clients/client.routes.js"
import oAuthRoutes from "./modules/oAuth/oAuth.routes.js"
import usersRoutes from "./modules/auth/auth.routes.js"

const app: Express = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser())

app.use("/api/users",usersRoutes)
app.use("/api/clients", clientRoutes)
app.use("/.well-known/openid-configuration", oAuthRoutes)
app.use("/oauth", oAuthRoutes)


export default app;