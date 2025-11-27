const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Explicitly set these for connection stability
      useNewUrlParser: true, // Legacy flag, good practice to keep until deprecated
      useUnifiedTopology: true, // Recommended by MongoDB
      
      // Increase timeouts dramatically for testing if network is slow/unstable
      connectTimeoutMS: 60000,   // Give the initial connection 60 seconds
      serverSelectionTimeoutMS: 60000, // Give Mongoose 60 seconds to find a server
      socketTimeoutMS: 60000,    // Keep the socket open for 60 seconds of inactivity
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold);
  } catch (error) {
    console.log(`Error: ${error.message}`.red);
    process.exit(1);
  }
};