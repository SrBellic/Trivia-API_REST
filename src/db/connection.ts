import { MongoClient, Db, Collection } from 'mongodb';

const url = 'mongodb://localhost:27017';
const dbName = 'TriviaDB';

const client = new MongoClient(url);

let db: Db;
let questionsCollection: Collection;

export async function connectDB() {
	if (!db) {
		await client.connect();
		db = client.db(dbName);
		questionsCollection = db.collection('questions');
	}
}

export { client, db, questionsCollection };
