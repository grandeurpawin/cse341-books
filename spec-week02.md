# CSE 341 – Books API Week 02 Specification

# Version 1

## Feature 1: Book CRUD Operations and Author References

### Goal
Update the existing Week 01 book API so book documents include a reference to an author and the API supports all CRUD operations for books. Every book route must be documented and testable in Swagger.

### Data Model
Book documents will be stored in the `books` collection.

Required book fields:
- `id`: string, required, custom id such as `b1`
- `authorId`: string, required, references the `id` field of an author document
- `title`: string, required
- `publicationDate`: string, required

Books will continue to use custom string ids instead of MongoDB `_id` values for route parameters.

### Relationship to Authors
Each book will identify its author with an `authorId` field. The value of `authorId` must match the custom `id` value of an existing author document.

When creating or updating a book, the API should reject the request with a `400` status code if the submitted `authorId` does not match an existing author.

### Routes

#### GET /books
Purpose: Return all books.

Success:
- Status code: `200`
- Response body: an array of book objects

Errors:
- `500` if an unexpected server or database error occurs

#### GET /books/:id
Purpose: Return one book by its custom id.

Success:
- Status code: `200`
- Response body: the matching book object

Errors:
- `404` if no book exists with that id
- `500` if an unexpected server or database error occurs

#### POST /books
Purpose: Create a new book.

Request body:

    {
      "id": "b4",
      "authorId": "a1",
      "title": "Example Book Title",
      "publicationDate": "2026-01-15"
    }

Success:
- Status code: `201`
- Response body: the newly created book object

Errors:
- `400` if a required field is missing
- `400` if the `id` already exists
- `400` if the `authorId` does not match an existing author
- `500` if an unexpected server or database error occurs

#### PUT /books/:id
Purpose: Update an existing book.

Request body:

    {
      "authorId": "a2",
      "title": "Updated Book Title",
      "publicationDate": "2026-02-20"
    }

Success:
- Status code: `200`
- Response body: the updated book object

Errors:
- `400` if a required field is missing
- `400` if the `authorId` does not match an existing author
- `404` if no book exists with that id
- `500` if an unexpected server or database error occurs

#### DELETE /books/:id
Purpose: Delete an existing book.

Success:
- Status code: `204`
- Response body: none

Errors:
- `404` if no book exists with that id
- `500` if an unexpected server or database error occurs

### Swagger Documentation
Swagger must document every book route.

### Deployment Expectations
After implementation, the book routes must work locally and from the deployed Render application. The deployed Swagger page at `/api-docs` must allow someone to test every book route from the browser.

---

## Version 1: Authors API Specification

### Feature 2: Author CRUD Operations

**Goal**

Create an authors API that supports all CRUD operations for authors. Each author will have a custom string ID that books can reference through their `authorId` field. Every author route must be documented and testable in Swagger.

### Data Model

Author documents will be stored in the `authors` collection.

Required author fields:

- `id`: string, required, custom ID such as `a1`
- `name`: string, required
- `birthYear`: number, required

Authors will use custom string IDs instead of MongoDB `_id` values for route parameters.

### Relationship to Books

Authors may have multiple books associated with them. Each book references an author through its `authorId` field.

The `authorId` value in a book must match the custom `id` value of an existing author document.

An author cannot be deleted while books still reference that author. The API must reject the deletion request with a `409 Conflict` status code and return a JSON error message explaining that the author still has associated books.

### Routes

#### GET /authors

**Purpose:** Return all authors.

**Success:**
- Status code: `200`
- Response body: An array of author objects.

Example response:

```json
[
  {
    "id": "a1",
    "name": "Jane Austen",
    "birthYear": 1775
  }
]
```

**Errors:**
- `500` if an unexpected server or database error occurs.

#### GET /authors/:id

**Purpose:** Return one author by their custom ID.

**Success:**
- Status code: `200`
- Response body: The matching author object.

**Errors:**
- `404` if no author exists with that ID.
- `500` if an unexpected server or database error occurs.

#### POST /authors

**Purpose:** Create a new author.

Request body:

```json
{
  "id": "a2",
  "name": "George Orwell",
  "birthYear": 1903
}
```

**Success:**
- Status code: `201`
- Response body: The newly created author object.

**Errors:**
- `400` if a required field is missing or invalid.
- `400` if the submitted author ID already exists.
- `500` if an unexpected server or database error occurs.

#### PUT /authors/:id

**Purpose:** Update an existing author.

Request body:

```json
{
  "name": "George Orwell",
  "birthYear": 1904
}
```

**Success:**
- Status code: `200`
- Response body: The updated author object.

**Errors:**
- `400` if a required field is missing or invalid.
- `404` if no author exists with the requested ID.
- `500` if an unexpected server or database error occurs.

The author ID in the URL will remain unchanged during an update.

#### DELETE /authors/:id

**Purpose:** Delete an existing author by their custom ID.

**Success:**
- Status code: `204`
- Response body: None.

**Errors:**
- `404` if no author exists with the requested ID.
- `409` if the author still has one or more books referencing their ID.
- `500` if an unexpected server or database error occurs.

### Swagger Documentation

Swagger must document every author route, including request body examples, successful responses, and possible error responses.

### Deployment Expectations

After implementation, the author routes must work locally and from the deployed Render application. The deployed Swagger page at `/api-docs` must allow someone to test every author route from the browser.

---


# Version 2

## Feature 1: Book CRUD Operations and Author References

### Goal
Update the existing Week 01 Books API to support complete CRUD operations and establish a relationship between books and authors using the author's custom ID. All routes must include proper validation, error handling, and complete Swagger documentation.

### Data Model
Book documents will be stored in the `books` collection.

Required book fields:

| Field | Data Type | Requirement |
|---|---|---|
| `id` | String | Required, unique custom ID such as `b1` |
| `authorId` | String | Required, must reference an existing author |
| `title` | String | Required, non-empty |
| `publicationDate` | String | Required, valid ISO 8601 date in `YYYY-MM-DD` format |

MongoDB will automatically generate its `_id` field, but the API will use the custom `id` field for route parameters.

A unique index must be created for the custom `id` field.

### Relationship to Authors
- Each book must reference an existing author using `authorId`.
- The `authorId` value must match the author's custom `id` field.
- The API must verify that the referenced author exists before creating or updating a book.
- A book must not be created or updated with an invalid author reference.
- Deleting an author with associated books must be prevented.

### Validation Rules
- All required fields must be provided.
- String fields must contain non-empty values after trimming whitespace.
- `id` and `authorId` must be strings.
- `title` must be a non-empty string.
- `publicationDate` must be a valid calendar date in `YYYY-MM-DD` format.
- Duplicate book IDs must be rejected.
- Clients must not be allowed to modify MongoDB internal `_id` values.
- Unexpected request body properties must not be used to modify database-managed fields.

### Routes

#### GET /books
Purpose: Retrieve all books.

Success:
- Status code: `200`
- Response body: an array of book objects.

Example response:

    [
      {
        "id": "b1",
        "authorId": "a1",
        "title": "Patterns of Light",
        "publicationDate": "2021-08-17"
      },
      {
        "id": "b2",
        "authorId": "a2",
        "title": "The Hidden Garden",
        "publicationDate": "2022-05-10"
      }
    ]

Errors:
- `500` – Unexpected server or database error.

#### GET /books/:id
Purpose: Retrieve a single book using its custom ID.

Success:
- Status code: `200`
- Response body: the matching book object.

Example response:

    {
      "id": "b1",
      "authorId": "a1",
      "title": "Patterns of Light",
      "publicationDate": "2021-08-17"
    }

Errors:
- `404` – Book not found.
- `500` – Unexpected server or database error.

#### POST /books
Purpose: Create a new book.

Request body:

    {
      "id": "b4",
      "authorId": "a1",
      "title": "Example Book Title",
      "publicationDate": "2026-01-15"
    }

Success:
- Status code: `201`
- Response body: the newly created book object.

Errors:
- `400` – Missing required fields, invalid data types, empty values, or invalid publication date.
- `409` – A book with the submitted custom ID already exists.
- `400` – The submitted `authorId` does not match an existing author.
- `500` – Unexpected server or database error.

#### PUT /books/:id
Purpose: Update an existing book using its custom ID.

The PUT operation will replace all editable fields of the existing book. The custom ID will remain unchanged and will come from the URL parameter.

Request body:

    {
      "authorId": "a2",
      "title": "Updated Book Title",
      "publicationDate": "2026-02-20"
    }

Success:
- Status code: `200`
- Response body: the updated book object.

Errors:
- `400` – Missing required fields, invalid data types, empty values, or invalid publication date.
- `400` – The submitted `authorId` does not match an existing author.
- `404` – Book not found.
- `500` – Unexpected server or database error.

#### DELETE /books/:id
Purpose: Delete an existing book using its custom ID.

Success:
- Status code: `204`
- Response body: none.

Errors:
- `404` – Book not found.
- `500` – Unexpected server or database error.

### Error Response Format
All JSON error responses must follow a consistent structure.

Example:

    {
      "message": "Book not found"
    }

Unexpected server errors must return:

    {
      "message": "Internal server error"
    }

### Swagger Documentation
- Document all five book routes.
- Include request body schemas for POST and PUT.
- Include successful response schemas and examples.
- Document all expected status codes and their JSON response formats.
- Document the custom ID and author reference requirements.
- Ensure every route can be tested through the Swagger interface at `/api-docs`.

### Deployment Expectations
- All book routes must work locally and on the deployed Render application.
- The application must connect to the correct MongoDB database using environment variables.
- Database credentials must not be committed to GitHub.
- The deployed `/api-docs` page must allow users to test every book endpoint.

---

## Version 2: Improved Authors API Specification

### Feature 2: Author CRUD Operations

**Goal**

Create a complete Authors API that allows clients to create, retrieve, update, and delete author records. The API must maintain the relationship between authors and books and prevent deletion of authors who still have associated books.

### Data Model

Author documents will be stored in the `authors` collection.

Required author fields:

| Field | Data Type | Requirement |
|---|---|---|
| `id` | String | Required, unique custom ID such as `a1` |
| `name` | String | Required, non-empty author name |
| `birthYear` | Number | Required, valid birth year |

MongoDB will automatically generate its `_id` field, but the API will use the custom `id` field for route parameters.

A unique index must be created for the custom `id` field.

### Relationship to Books

- One author may have multiple books.
- Every book must reference an existing author through its `authorId` field.
- The `authorId` value must match the author's custom `id`.
- An author cannot be deleted while books still reference their ID.
- Before deleting an author, the API must check whether any books contain that author's ID in their `authorId` field.
- If associated books exist, the API must return `409 Conflict` and leave the author and associated books unchanged.
- If no associated books exist, the API may proceed with deletion.

### Validation Rules

- All required fields must be provided.
- `id` must be a non-empty string.
- `name` must be a non-empty string after trimming whitespace.
- `birthYear` must be a positive integer.
- `birthYear` must not be later than the current year.
- Duplicate author IDs must be rejected with a `409 Conflict` response.
- Clients must not be allowed to modify MongoDB internal `_id` values.
- The custom author ID must remain unchanged during updates.
- Unexpected request body properties must not modify database-managed fields.

### Routes

#### GET /authors

**Purpose:** Retrieve all authors.

**Success:**
- Status code: `200`
- Response body: An array of author objects.

Example response:

```json
[
  {
    "id": "a1",
    "name": "Jane Austen",
    "birthYear": 1775
  },
  {
    "id": "a2",
    "name": "George Orwell",
    "birthYear": 1903
  }
]
```

**Errors:**
- `500` – Unexpected server or database error.

#### GET /authors/:id

**Purpose:** Retrieve one author using their custom ID.

**Success:**
- Status code: `200`
- Response body: The matching author object.

Example response:

```json
{
  "id": "a1",
  "name": "Jane Austen",
  "birthYear": 1775
}
```

**Errors:**
- `404` – Author not found.
- `500` – Unexpected server or database error.

#### POST /authors

**Purpose:** Create a new author.

Request body:

```json
{
  "id": "a3",
  "name": "Charles Dickens",
  "birthYear": 1812
}
```

**Success:**
- Status code: `201`
- Response body: The newly created author object.

**Errors:**
- `400` – Missing required fields, invalid data types, empty values, or invalid birth year.
- `409` – An author with the submitted custom ID already exists.
- `500` – Unexpected server or database error.

#### PUT /authors/:id

**Purpose:** Update an existing author using their custom ID.

The PUT operation will replace all editable fields of the existing author. The custom ID will remain unchanged and will come from the URL parameter.

Request body:

```json
{
  "name": "Charles Dickens",
  "birthYear": 1813
}
```

**Success:**
- Status code: `200`
- Response body: The updated author object.

**Errors:**
- `400` – Missing required fields, invalid data types, empty values, or invalid birth year.
- `404` – Author not found.
- `500` – Unexpected server or database error.

#### DELETE /authors/:id

**Purpose:** Delete an existing author using their custom ID.

Before deleting an author, the API must check whether any book documents contain the author's custom ID in their `authorId` field.

**Success:**
- Status code: `204`
- Response body: None.

**Errors:**
- `404` – Author not found.
- `409` – Author cannot be deleted because one or more books still reference their ID.
- `500` – Unexpected server or database error.

Example conflict response:

```json
{
  "message": "Cannot delete author because associated books still exist."
}
```

### Error Response Format

All JSON error responses must follow a consistent structure.

Example:

```json
{
  "message": "Author not found"
}
```

Unexpected server errors must return:

```json
{
  "message": "Internal server error"
}
```

### Swagger Documentation

- Document all five author routes.
- Include request body schemas for POST and PUT.
- Include successful response schemas and examples.
- Document all expected status codes and error response formats.
- Include author field validation rules.
- Document the relationship between authors and books.
- Explain the `409 Conflict` response when attempting to delete an author who still has associated books.
- Ensure every route can be tested through the Swagger interface at `/api-docs`.

### Deployment Expectations

- All author routes must work locally and on the deployed Render application.
- The `authors` collection must exist in the correct MongoDB database.
- The application must connect to MongoDB using environment variables.
- Database credentials must not be committed to GitHub.
- The deployed `/api-docs` page must allow users to test every author endpoint.