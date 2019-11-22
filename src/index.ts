
import app from "./app";
import { connection } from "./database";


const main = async() => {
    await connection();
    await app.listen(app.get("port"));
    console.log("Server running on port: ", app.get("port"));
}

main();