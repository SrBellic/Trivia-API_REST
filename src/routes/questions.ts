import { Response, Request, Router } from 'express';
import { BadRequestError, NotFoundError } from '../classes/errors';
import {
	findAll,
	findQuestion,
	randomQuestion,
	insertQuestion,
	deleteQuestion,
	updateQuestion,
} from '../controller/questionsController';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
	//Route for GET all questions
	try {
		res.json(await findAll());
	} catch (error) {
		if (error instanceof NotFoundError) {
			res.status(404).json({ error: error.message });
		} else {
			res.status(500).json({ error: 'Internal server error' });
		}
	}
});

router.post('/', async (req: Request, res: Response) => {
	try {
		await insertQuestion(req.body);

		res.status(201).json({ message: 'Question added successfully' });
	} catch (error) {
		if (error instanceof BadRequestError) {
			res.status(400).json({ error: error.message });
		} else {
			res.status(500).json({ error: 'Internal server error' });
		}
	}
});

router.get('/random', async (req: Request, res: Response) => {
	try {
		res.json(await randomQuestion());
	} catch (error) {
		if (error instanceof NotFoundError) {
			res.status(404).json({ error: error.message });
		} else {
			res.status(500).json({ error: 'Internal server error' });
		}
	}
});

router.get('/:id', async (req: Request, res: Response) => {
	//Looking for a specific question by ID
	const { id } = req.params;

	try {
		const question = await findQuestion(parseInt(id));

		res.json(question);
	} catch (error) {
		if (error instanceof NotFoundError) {
			res.status(404).json({ error: error.message });
		} else {
			res.status(500).json({ error: 'Internal server error' });
		}
	}
});

router.delete('/:id', async (req: Request, res: Response) => {
	const { id } = req.params;

	try {
		await deleteQuestion(parseInt(id));
		res.json({ message: 'Question deleted successfully' });
	} catch (error) {
		if (error instanceof NotFoundError) {
			res.status(404).json({ error: error.message });
		} else {
			res.status(500).json({ error: 'Internal server error' });
		}
	}
});

router.patch('/:id', async (req: Request, res: Response) => {
	const { id } = req.params;

	try {
		await updateQuestion(parseInt(id), req.body);
		res.json({ message: 'Question updated successfully' });
	} catch (error) {
		if (error instanceof NotFoundError) {
			res.status(404).json({ error: error.message });
		} else {
			res.status(500).json({ error: 'Internal server error' });
		}
	}
});

export default router;
