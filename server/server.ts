import dotenv from 'dotenv';
import express, {Application, Request, Response} from "express";
import cors from 'cors';
import authRoutes from "./src/routes/auth.routes";
import issueRoutes from "./src/routes/issue.routes";
import {connectDB} from "./src/config/db";

// 1. Load environment variables from .env file
dotenv.config();

const app: Application = express();

// 2. Global Middleware
app.use(cors()); // Allows your React frontend to communicate with this backend
app.use(express.json()); // Tells Express to automatically parse incoming JSON data into req.body


// 3. Register our API Routes
// This tells Express: "If a request starts with /api/auth, send it to the authRoutes file"
app.use('/api/auth', authRoutes);
app.use('/api/issues', issueRoutes);


// A simple health-check route to verify the server is running
app.get('/', (req: Request, res: Response) => {
    res.send('Issue Tracker API is running...');
});


const PORT = process.env.PORT || 5000;

connectDB()
    .then(() => {
        console.log("Connected to MongoDB");
        app.listen(PORT, () => {
            console.log(`Server started on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.log('Error connecting to MongoDB', err);
        process.exit(1);
    })

