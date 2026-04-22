import crypto from "crypto"

export const generateCode = () => {
    const code = crypto.randomBytes(5).toString('hex')
    return code
}