
import {
    getAllBooks,
    getBookById,
    authorExists,
    createBook,
    updateBook,
    deleteBook,
} from "../models/books.js";

// Validate required book fields
const isValidBook = (authorId, title, publicationDate) => {
    return (
        typeof authorId === "string" &&
        authorId.trim().length > 0 &&
        typeof title === "string" &&
        title.trim().length > 0 &&
        typeof publicationDate === "string" &&
        publicationDate.trim().length > 0
    );
};

// GET /books
const getBooksHandler = async (req, res) => {
    try {
        const books = await getAllBooks();
        return res.status(200).json(books);
    } catch (error) {
        console.error("GET /books failed:", error.message);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

// GET /books/:id
const getBookByIdHandler = async (req, res) => {
    try {
        const book = await getBookById(req.params.id);

        if (!book) {
            return res.status(404).json({
                message: "Book not found",
            });
        }

        return res.status(200).json(book);
    } catch (error) {
        console.error("GET /books/:id failed:", error.message);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

// POST /books
const createBookHandler = async (req, res) => {
    try {
        const { id, authorId, title, publicationDate } = req.body ?? {};

        if (
            typeof id !== "string" ||
            id.trim().length === 0 ||
            !isValidBook(authorId, title, publicationDate)
        ) {
            return res.status(400).json({
                message: "Invalid or missing book fields",
            });
        }

        const bookId = id.trim();
        const cleanAuthorId = authorId.trim();

        const existingBook = await getBookById(bookId);

        if (existingBook) {
            return res.status(400).json({
                message: "Book ID already exists",
            });
        }

        const authorFound = await authorExists(cleanAuthorId);

        if (!authorFound) {
            return res.status(400).json({
                message: "Author not found",
            });
        }

        const newBook = {
            id: bookId,
            authorId: cleanAuthorId,
            title: title.trim(),
            publicationDate: publicationDate.trim(),
        };

        const createdBook = await createBook(newBook);

        return res.status(201).json(createdBook);
    } catch (error) {
        console.error("POST /books failed:", error.message);

        if (error.code === 11000) {
            return res.status(400).json({
                message: "Book ID already exists",
            });
        }

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

// PUT /books/:id
const updateBookHandler = async (req, res) => {
    try {
        const { authorId, title, publicationDate } = req.body ?? {};
        const bookId = req.params.id;

        if (!isValidBook(authorId, title, publicationDate)) {
            return res.status(400).json({
                message: "Invalid or missing book fields",
            });
        }

        const existingBook = await getBookById(bookId);

        if (!existingBook) {
            return res.status(404).json({
                message: "Book not found",
            });
        }

        const authorFound = await authorExists(authorId.trim());

        if (!authorFound) {
            return res.status(400).json({
                message: "Author not found",
            });
        }

        const updatedBook = await updateBook(bookId, {
            authorId: authorId.trim(),
            title: title.trim(),
            publicationDate: publicationDate.trim(),
        });

        return res.status(200).json(updatedBook);
    } catch (error) {
        console.error("PUT /books/:id failed:", error.message);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

// DELETE /books/:id
const deleteBookHandler = async (req, res) => {
    try {
        const result = await deleteBook(req.params.id);

        if (result.deletedCount === 0) {
            return res.status(404).json({
                message: "Book not found",
            });
        }

        return res.status(204).send();
    } catch (error) {
        console.error("DELETE /books/:id failed:", error.message);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

export {
    getBooksHandler,
    getBookByIdHandler,
    createBookHandler,
    updateBookHandler,
    deleteBookHandler,
};
