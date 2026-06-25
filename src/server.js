import "dotenv/config";
import app from "./app.js";
import pool from "./config/database.js";

const PORT = process.env.PORT || 3000;

try {
    const connection = await pool.getConnection();

    // Directly test the connection between this backend server and the database
    console.log("Successfully connected to MySQL!");
    connection.release();

    app.listen(PORT, () => {
        console.log(`Server now running on port ${PORT}`)
    });
}
catch (e) {
    console.error("Could not connect to MySQL database");

    // Show an error message if the connection was unsuccessful
    console.error(e.message);
    process.exit(1);
}