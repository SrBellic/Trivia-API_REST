import express, { Request, Response } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import categoryRoutes from './routes/category';
import questionsRoutes from './routes/questions';
import { connectDB } from './db/connection';

const app = express();
const PORT = 3000;
const logger = morgan('dev');

//Middlewares
connectDB().catch((err) => {
	console.error('Error connecting to the database:', err);
});
app.use(cors());
app.use(logger);
app.use(express.json());

//Routes
app.use('/api/category/', categoryRoutes);
app.use('/api/question/', questionsRoutes);

app.get('/', (req: Request, res: Response) => {
	res.send('¡Hola, TypeScript con Express!');
});

app.listen(PORT, () => {
	console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
