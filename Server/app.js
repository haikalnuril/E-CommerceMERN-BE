import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { notFound, errorHandler } from './middlewares/errorMiddleware.js';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import ExpressMongoSanitize from 'express-mongo-sanitize';
import cors from 'cors';

dotenv.config();

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(ExpressMongoSanitize());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));

import authRouter from './routes/authRouter.js';
import productRouter from './routes/productRouter.js';
import orderRouter from './routes/orderRouter.js'

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/orders', orderRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
    console.log(`EcommerceMERN app listening at http://localhost:${port}`);
});

// connect DB mongoose
mongoose.connect(process.env.DATABASE, {
    
}).then(() => {
    console.log('Database connected');
}).catch((err) => {
    console.log('Database connection failed', err);
});