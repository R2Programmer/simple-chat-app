import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bodyParser from "body-parser";
import cors from "cors";


import userRoute from './routes/userRoute.js';
import chatRoute from './routes/chatRoute.js'
import messageRoute from './routes/messageRoute.js'
import authRoute from './routes/authRoute.js'

dotenv.config();

const PORT = process.env.PORT
const app = express();
app.use(express.json()); 
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.use(express.static('public')); 
app.use('/images', express.static('images'));

app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
})

app.use('/api/auth', authRoute);
app.use('api/user', userRoute)
app.use('/api/chat', chatRoute);
app.use('/api/message', messageRoute);



mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    app.listen(PORT, () => console.log(`Server is listening to port: ${PORT}`));
}).catch((error) => console.log(`${error} did not connect`));