
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
    const collection = db.collection("authors");
    const author = await collection.findOne({ id: authorId });
    return Boolean(author);
};

// Create a new book
const createBook = async (book) => {
    const db = getDb();
    const collection = db.collection("books");
    await collection.insertOne(book);
    return book;
};

// Update an existing book
const updateBook = async (bookId, book) => {
    const db = getDb();
    const collection = db.collection("books");

    const result = await collection.updateOne(
        { id: bookId },
        { $set: book }
    );

    if (result.matchedCount === 0) {
        return null;
    }

    return await getBookById(bookId);
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
