import { drizzle } from "drizzle-orm/node-postgres";
import * as clientSchema from "./schema/clients.js";
import * as userSchema from "./schema/users.js";

const schema = { ...clientSchema, ...userSchema };

export const db = drizzle(process.env.DATABASE_URL!, { schema });
