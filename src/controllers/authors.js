
import {
    getAllAuthors as getAllAuthorsFromDb,
    getAuthorById as getAuthorByIdFromDb,
    createAuthor as createAuthorFromDb,
    updateAuthor as updateAuthorFromDb,
    deleteAuthor as deleteAuthorFromDb,
    authorHasBooks,
} from '../models/authors.js';

// Validate the author's name and birth year.
const isValidAuthor = (name, birthYear) => {
    return (
        typeof name === 'string' &&
        name.trim().length > 0 &&
        Number.isInteger(birthYear) &&
        birthYear > 0 &&
        birthYear <= new Date().getFullYear()
    );
};

// GET /authors
const getAllAuthors = async (req, res) => {
    try {
        const authors = await getAllAuthorsFromDb();
        return res.status(200).json(authors);
    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error',
        });
    }
};

// GET /authors/:id
const getAuthorById = async (req, res) => {
    try {
        const { id } = req.params;
        const author = await getAuthorByIdFromDb(id);

        if (!author) {
            return res.status(404).json({
                message: 'Author not found',
            });
        }

        return res.status(200).json(author);
    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error',
        });
    }
};

// POST /authors
const createAuthor = async (req, res) => {
    try {
        const { id, name, birthYear } = req.body ?? {};

        // Validate all required fields.
        if (
            typeof id !== 'string' ||
            id.trim().length === 0 ||
            !isValidAuthor(name, birthYear)
        ) {
            return res.status(400).json({
                message: 'Invalid or missing author fields',
            });
        }

        const authorId = id.trim();

        // Check whether the custom ID already exists.
        const existingAuthor = await getAuthorByIdFromDb(authorId);

        if (existingAuthor) {
            return res.status(409).json({
                message: 'Author ID already exists',
            });
        }

        const newAuthor = {
            id: authorId,
            name: name.trim(),
            birthYear,
        };

        const createdAuthor = await createAuthorFromDb(newAuthor);

        return res.status(201).json(createdAuthor);
    } catch (error) {
        // Handle duplicate ID errors from MongoDB as well.
        if (error.code === 11000) {
            return res.status(409).json({
                message: 'Author ID already exists',
            });
        }

        return res.status(500).json({
            message: 'Internal server error',
        });
    }
};

// PUT /authors/:id
const updateAuthor = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, birthYear } = req.body ?? {};

        // Validate the editable fields.
        if (!isValidAuthor(name, birthYear)) {
            return res.status(400).json({
                message: 'Invalid or missing author fields',
            });
        }

        const existingAuthor = await getAuthorByIdFromDb(id);

        if (!existingAuthor) {
            return res.status(404).json({
                message: 'Author not found',
            });
        }

        // Only update name and birthYear.
        // The custom ID and MongoDB _id remain unchanged.
        const updatedAuthor = await updateAuthorFromDb(id, {
            name: name.trim(),
            birthYear,
        });

        return res.status(200).json(updatedAuthor);
    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error',
        });
    }
};

// DELETE /authors/:id
const deleteAuthor = async (req, res) => {
    try {
        const { id } = req.params;

        const existingAuthor = await getAuthorByIdFromDb(id);

        if (!existingAuthor) {
            return res.status(404).json({
                message: 'Author not found',
            });
        }

        // Prevent deletion if books still reference this author.
        const hasBooks = await authorHasBooks(id);

        if (hasBooks) {
            return res.status(409).json({
                message: 'Cannot delete author because associated books still exist.',
            });
        }

        await deleteAuthorFromDb(id);

        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error',
        });
    }
};

export {
    getAllAuthors,
    getAuthorById,
    createAuthor,
    updateAuthor,
    deleteAuthor,
};
