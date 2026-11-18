
import { getDb } from "../db/connect.js";

// Get all books
const getAllBooks = async () => {
    const db = getDb();
    const collection = db.collection("books");
    return await collection.find({}).toArray();
};

// Get one book by custom ID
const getBookById = async (bookId) => {
    const db = getDb();
    const collection = db.collection("books");
    return await collection.findOne({ id: bookId });
};

// Check whether an author exists
const authorExists = async (authorId) => {
    const db = getDb();
    const author = await db.collection("authors").findOne({ id: authorId });
    return Boolean(author);
};

// Create a new book
const createBook = async (book) => {
    const db = getDb();
    const collection = db.collection("books");
    await collection.insertOne(book);
    return await collection.findOne({ id: book.id });
};

// Update an existing book
const updateBook = async (bookId, bookData) => {
    const db = getDb();
    const collection = db.collection("books");

    await collection.updateOne(
        { id: bookId },
        { $set: bookData }
    );

    return await collection.findOne({ id: bookId });
};

// Delete a book
const deleteBook = async (bookId) => {
    const db = getDb();
    const collection = db.collection("books");
    return await collection.deleteOne({ id: bookId });
};

export {
    getAllBooks,
    getBookById,
    authorExists,
    createBook,
    updateBook,
    deleteBook,
};
