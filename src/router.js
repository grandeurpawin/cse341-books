import express from "express";
import { getBooksHandler, getBookByIdHandler} from "./controllers/books.js";
import {
    getAllAuthors,
    getAuthorById,
    createAuthor,
    updateAuthor,
    deleteAuthor,
} from './controllers/authors.js';

const router = express.Router();

/**
 * @openapi
 * /books:
 *   get:
 *     summary: Get all books
 *     tags:
 *       - Books
 *     responses:
 *       200:
 *         description: Books returned successfully
 *       500:
 *         description: Unable to retrieve books
 */
router.get("/books", getBooksHandler);

/**
 * @openapi
 * /books/{id}:
 *   get:
 *     summary: Get one book by id
 *     tags:
 *       - Books
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The custom book id, such as b1
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book returned successfully
 *       404:
 *         description: Book not found
 *       500:
 *         description: Unable to retrieve book
 */
router.get("/books/:id", getBookByIdHandler);


/**
 * @openapi
 * /authors:
 *   get:
 *     summary: Get all authors
 *     description: Retrieves all authors from the authors collection.
 *     tags:
 *       - Authors
 *     responses:
 *       200:
 *         description: Authors retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: a1
 *                   name:
 *                     type: string
 *                     example: Maya Rivera
 *                   birthYear:
 *                     type: integer
 *                     example: 1985
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */
router.get('/authors', getAllAuthors);

/**
 * @openapi
 * /authors/{id}:
 *   get:
 *     summary: Get an author by ID
 *     description: Retrieves one author using their custom author ID.
 *     tags:
 *       - Authors
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The custom author ID, such as a1.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Author retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: a1
 *                 name:
 *                   type: string
 *                   example: Maya Rivera
 *                 birthYear:
 *                   type: integer
 *                   example: 1985
 *       404:
 *         description: Author not found
 *         content:
 *           application/json:
 *             example:
 *               message: Author not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               message: Internal server error
 */
router.get('/authors/:id', getAuthorById);

/**
 * @openapi
 * /authors:
 *   post:
 *     summary: Create a new author
 *     description: >
 *       Creates an author with a unique custom ID.
 *       The author ID must be unique. The name must be a
 *       non-empty string. The birth year must be a positive
 *       integer and cannot be later than the current year.
 *     tags:
 *       - Authors
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - name
 *               - birthYear
 *             properties:
 *               id:
 *                 type: string
 *                 example: a4
 *               name:
 *                 type: string
 *                 example: Example Author
 *               birthYear:
 *                 type: integer
 *                 example: 1980
 *           example:
 *             id: a4
 *             name: Example Author
 *             birthYear: 1980
 *     responses:
 *       201:
 *         description: Author created successfully
 *         content:
 *           application/json:
 *             example:
 *               id: a4
 *               name: Example Author
 *               birthYear: 1980
 *       400:
 *         description: Required fields are missing or invalid
 *         content:
 *           application/json:
 *             example:
 *               message: Invalid or missing author fields
 *       409:
 *         description: An author with this custom ID already exists
 *         content:
 *           application/json:
 *             example:
 *               message: Author ID already exists
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               message: Internal server error
 */
router.post('/authors', createAuthor);

/**
 * @openapi
 * /authors/{id}:
 *   put:
 *     summary: Update an author by ID
 *     description: >
 *       Updates an author's name and birth year.
 *       The custom author ID and MongoDB _id cannot be changed.
 *       The name must be a non-empty string. The birth year
 *       must be a positive integer and cannot be later than
 *       the current year.
 *       Books referencing this author continue to reference
 *       the same author ID.
 *     tags:
 *       - Authors
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The custom author ID to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - birthYear
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated Author
 *               birthYear:
 *                 type: integer
 *                 example: 1981
 *           example:
 *             name: Updated Author
 *             birthYear: 1981
 *     responses:
 *       200:
 *         description: Author updated successfully
 *         content:
 *           application/json:
 *             example:
 *               id: a4
 *               name: Updated Author
 *               birthYear: 1981
 *       400:
 *         description: Required fields are missing or invalid
 *         content:
 *           application/json:
 *             example:
 *               message: Invalid or missing author fields
 *       404:
 *         description: Author not found
 *         content:
 *           application/json:
 *             example:
 *               message: Author not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               message: Internal server error
 */
router.put('/authors/:id', updateAuthor);


/**
 * @openapi
 * /authors/{id}:
 *   delete:
 *     summary: Delete an author by ID
 *     description: >
 *       Deletes an author only if no books reference that author.
 *       If associated books exist, deletion is prevented and
 *       the API returns 409 Conflict.
 *     tags:
 *       - Authors
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The custom author ID to delete.
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Author deleted successfully. No response body.
 *       404:
 *         description: Author not found
 *         content:
 *           application/json:
 *             example:
 *               message: Author not found
 *       409:
 *         description: Cannot delete author because associated books still exist.
 *         content:
 *           application/json:
 *             example:
 *               message: Cannot delete author because associated books still exist.
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               message: Internal server error
 */
router.delete('/authors/:id', deleteAuthor);


export default router;