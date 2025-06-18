import { Router, Response, Request } from 'express';
import { findAll } from '../controller/categoriesController';
import { questionsCollection } from '../db/connection';

const router = Router();

//Route to get all questions by category with details

router.get('/:category', async (req: Request, res: Response) => {
	const { category } = req.params;
	try {
		const questions = await findAll(category);
		if (questions.length === 0) {
			res
				.status(404)
				.json({ message: 'Questions not found for this category' });
		} else {
			res.json(questions);
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal error' });
	}
});

// This route deletes all questions from a specific category
router.delete('/:category', (req: Request, res: Response) => {
	const { category } = req.params;

	try {
		questionsCollection.deleteMany({ category: category });
		res.json({
			message: `Deleted question from: ${category}`,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal error' });
	}
});

router.put('/:category', async (req: Request, res: Response) => {
	const { category } = req.params;

	try {
		const result = await questionsCollection.updateOne(
			{ category: category },
			{ $set: { category: req.body.category } }
		);

		if (result === null) {
			res
				.status(404)
				.json({ message: `There is not category for ${category} update` });
		} else {
			res.json({ message: 'Category updated successfully' });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal error' });
	}
});

export default router;
