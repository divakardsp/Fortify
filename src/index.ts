import app from "./app.js";
import 'dotenv/config';

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server for OAuth is running on port: ${PORT} in ${process.env.NODE_ENV} mode.`);
})