import {
    pgTable,
    uuid,
    varchar,
    boolean,
    timestamp,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),

    name: varchar({ length: 255 }).notNull(),

    email: varchar("email", { length: 322 }).notNull().unique(),
    password: varchar("password"),
    isVerified: boolean("is_verified").default(false).notNull(),

    verificationToken: varchar("verification_token"),
    verificationTokenExpires: timestamp("verification_token_expires", {
        withTimezone: true,
    }),

    refreshToken: varchar("refresh_token"),
    refreshTokenExpires: timestamp("refresh_token_expires", {
        withTimezone: true,
    }),

    resetPasswordToken: varchar("reset_password_token"),
    resetPasswordExpires: timestamp("reset_password_expires", {
        withTimezone: true,
    }),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});
