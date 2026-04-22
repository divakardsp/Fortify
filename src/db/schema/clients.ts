import {
    pgTable,
    uuid,
    varchar,
    timestamp,
} from "drizzle-orm/pg-core";

export const clients = pgTable("clients", {
    id: uuid("id").primaryKey().defaultRandom(),

    
    name: varchar({ length: 255 }).notNull().unique(),
    email: varchar({length: 322}).notNull().unique(),


    websiteURL: varchar('website_url').notNull().unique(),
    redirectURL: varchar("redirect_url").notNull().unique(),

    clientSecret: varchar('client_secret', {length: 128}).unique(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});
