import { eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { clients } from "../../db/schema/clients.js";
import ApiError from "../../common/utils/apiError.js";
import { generateRandomTokens } from "../../common/utils/jwt.js";
import ApiResponse from "../../common/utils/apiResponse.js";

interface ClientDataProp {
    name: string;
    email: string;
    websiteURL: string;
    redirectURL: string;
}
export const registerClient = async (clientData: ClientDataProp) => {
    /*
        extract each field
        check on the basis of email client exists or not
        genrate a clientSecret
        send back response with clientID, secret, 
     */

    const { name, email, redirectURL, websiteURL } = clientData;
    const client = await db
        .select()
        .from(clients)
        .where(eq(clients.email, email));

    const clientExists = client.length === 0 ? false : true;
    if (clientExists) {
        throw ApiError.conflict("Client with that email-id already exists");
    }

    const { rawToken, hashedToken } = generateRandomTokens();

    const [newClient] = await db
        .insert(clients)
        .values({
            name,
            email,
            websiteURL,
            redirectURL,
            clientSecret: hashedToken,
        })
        .returning();

    return { newClient };
};
