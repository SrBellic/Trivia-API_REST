import { questionsCollection } from '../db/connection';
import { BadRequestError, NotFoundError } from '../classes/errors';

interface Question {
	id: number;
	question: string;
	options: string[];
	answer: string;
	category: string;
	difficulty: number;
}

export async function findAll() {
	const find = await questionsCollection.find().toArray();

	if (find.length === 0) {
		throw new BadRequestError('No questions found');
	} else {
		return find;
	}
}

export async function findQuestion(id: number) {
	const find = await questionsCollection.findOne({ id: id });

	if (!find || find.length === 0) {
		throw new NotFoundError('Question not found');
	} else {
		return find;
	}
}

export async function randomQuestion() {
	const count: number = await questionsCollection.countDocuments();

	const random = await questionsCollection.findOne({
		//This feature will be use cookies for not repeat ID questions
		id: Math.floor(Math.random() * count + 1),
	});

	if (!random || random === null) {
		throw new NotFoundError('There is not random question');
	} else {
		return random;
	}
}

export async function insertQuestion({
	question,
	options,
	answer,
	category,
	difficulty,
}: Question) {
	const count: number = await questionsCollection.countDocuments();

	const request = {
		question: question.trim().toLowerCase(),
		options: options.map((opt) => opt.trim().toLowerCase()),
		answer: answer.trim().toLowerCase(),
		category: category.trim().toLowerCase(),
		difficulty: difficulty,
	};

	for (const [key, value] of Object.entries(request)) {
		if (value === undefined || value === null || value === '') {
			throw new BadRequestError(`Missing required field: ${key}`);
		}
	}

	if (
		request.difficulty > 5 ||
		request.difficulty < 1
		/*
            1 == Easy
            2 == Medium
            3 == Hard
            4 == Very Hard
            5 == Insane
        */
	) {
		throw new BadRequestError('Difficulty must be between 1 and 5');
	}

	const existingQuestion = await questionsCollection.findOne({
		question: request.question,
	});

	if (existingQuestion) {
		throw new BadRequestError('Question already exists');
	}

	const insert = await questionsCollection.insertOne({
		id: count + 1,
		...request,
	});

	if (!insert.acknowledged) {
		throw new BadRequestError('Failed to add question');
	}
	return insert;
}

export async function multipleQuestions() {}

export async function deleteQuestion(id: number) {
	const deleteResult = await questionsCollection.deleteOne({ id: id });

	if (deleteResult.deletedCount === 0) {
		throw new NotFoundError('Question not found');
	}
	return deleteResult;
}

export async function updateQuestion(
	id: number,
	updateData: Partial<Question>
) {
	for (const [key, value] of Object.entries(updateData)) {
		if (value === undefined || value === null || value === '') {
			throw new BadRequestError(`Missing required field: ${key}`);
		}
	}

	if (
		updateData.difficulty !== undefined &&
		(updateData.difficulty > 5 || updateData.difficulty < 1)
	) {
		throw new BadRequestError('Difficulty must be between 1 and 5');
	}

	const updateResult = await questionsCollection.updateOne(
		{ id: id },
		{ $set: updateData }
	);

	console.log(updateResult);
	if (!updateResult.matchedCount) {
		throw new NotFoundError('Question not found for update');
	}

	return updateResult;
}
