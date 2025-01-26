import mongoose from "mongoose";

// Define a type for the connection object to track connection status
type ConnectionObject = {
    isConnected?: number  // Holds the connection state (0 = disconnected, 1 = connected)
}

// Create a connection object to store the current connection state
const connection: ConnectionObject = {}

// Asynchronous function to connect to the MongoDB database
// Returns a Promise with void type since we are not returning any data
async function dbConnect(): Promise<void> {
    // Check if already connected to avoid redundant connections
    if (connection.isConnected) {
        console.log("Already Connected to MongoDB")
        return
    }

    try {
        // Attempt to establish a connection to MongoDB using the provided connection string
        const db = await mongoose.connect(process.env.MONGO_URI!)

        // Store the connection state in the `connection` object
        connection.isConnected = db.connections[0].readyState
        console.log("Connected to MongoDB")
    } catch (error) {
        // Handle connection failure and exit the process
        console.log("DB connection failed");
        process.exit();
    }
}

// Export the database connection function to use it in other parts of the application
export default dbConnect;
