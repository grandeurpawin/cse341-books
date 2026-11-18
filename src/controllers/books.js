
import {
    getAllBooks,
    getBookById,
    authorExists,
    createBook,
    updateBook,
    deleteBook,
} from "../models/books.js";

// GET /books
const getBooksHandler = async (req, res) => {
    try {
        const books = await getAllBooks();
        return res.status(200).json(books);
    } catch (error) {
        console.error("GET /books failed:", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

// GET /books/:id
const getBookByIdHandler = async (req, res) => {
    try {
        const book = await getBookById(req.params.id);

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        return res.status(200).json(book);
    } catch (error) {
        console.error("GET /books/:id failed:", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

// POST /books
const createBookHandler = async (req, res) => {
    try {
        const { id, authorId, title, publicationDate } = req.body;

        if (
            typeof id !== "string" || !id.trim() ||
            typeof authorId !== "string" || !authorId.trim() ||
            typeof title !== "string" || !title.trim() ||
            typeof publicationDate !== "string" || !publicationDate.trim()
        ) {
            return res.status(400).json({
                message: "Invalid or missing book fields",
            });
        }

        const existingBook = await getBookById(id);

        if (existingBook) {
            return res.status(400).json({ message: "Book ID already exists" });
        }

        if (!(await authorExists(authorId))) {
            return res.status(400).json({ message: "Author not found" });
        }

        const newBook = await createBook({
            id: id.trim(),
            authorId: authorId.trim(),
            title: title.trim(),
            publicationDate: publicationDate.trim(),
        });

        return res.status(201).json(newBook);
    } catch (error) {
        console.error("POST /books failed:", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

// PUT /books/:id
const updateBookHandler = async (req, res) => {
    try {
        const bookId = req.params.id;
        const { authorId, title, publicationDate } = req.body;

        const existingBook = await getBookById(bookId);

        if (!existingBook) {
            return res.status(404).json({ message: "Book not found" });
        }

        if (
            typeof authorId !== "string" || !authorId.trim() ||
            typeof title !== "string" || !title.trim() ||
            typeof publicationDate !== "string" || !publicationDate.trim()
        ) {
            return res.status(400).json({
                message: "Invalid or missing book fields",
            });
        }

        if (!(await authorExists(authorId))) {
            return res.status(400).json({ message: "Author not found" });
        }

        const updatedBook = await updateBook(bookId, {
            authorId: authorId.trim(),
            title: title.trim(),
            publicationDate: publicationDate.trim(),
        });

        return res.status(200).json(updatedBook);
    } catch (error) {
        console.error("PUT /books/:id failed:", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

// DELETE /books/:id
const deleteBookHandler = async (req, res) => {
    try {
        const result = await deleteBook(req.params.id);

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Book not found" });
        }

        return res.status(204).send();
    } catch (error) {
        console.error("DELETE /books/:id failed:", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export {
    getBooksHandler,
    getBookByIdHandler,
    createBookHandler,
    updateBookHandler,
    deleteBookHandler,
};
