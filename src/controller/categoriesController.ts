import { questionsCollection } from '../db/connection';

export async function findAll(category: string) {
	const find = await questionsCollection.find({ category: category }).toArray();

	return find;
}
