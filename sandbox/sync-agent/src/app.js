import express from 'express';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: 'true' }));
app.use(morgan('dev'));

app.get('/api/status/healthz', (req, res) => {
    res.status(200).json({
        message: 'Agent Health check successful',
        status: 'ok',
    });
});

app.get('/api/status/readyz', (req, res) => {
    res.status(200).json({
        message: 'Agent is ready',
        status: 'ready',
    });
});

const WORKING_DIR = '/workspace';

/**
 * GET /api/list-files
 * @description Lists all files, directories and subdirectories in the working directory and returns them as a JSON response.
 * @returns {Object} JSON response containing the list of files, directories and subdirectories in the working directory.
 * @example
 * {
 *   "message": "Elements in the working directory",
 *   "files": [
 *     "file1.txt",
 *     "src/file2.js",
 *     "src/subdir1/file3.py",
 *     "subdir2/file4.md"
 *   ]
 * }
 */
app.get('/api/list-files', async (req, res) => {
    const listFiles = async (dir, baseDir) => {
        const entries = await fs.promises.readdir(dir, { withFileTypes: true });
        const files = [];

        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            const relativePath = path.relative(baseDir, fullPath);

            //exclude node_modules and .git directories from the list
            if (entry.isDirectory() && ['node_modules', '.git', 'dist'].includes(entry.name)) {
                continue;
            }

            if (entry.isDirectory()) {
                files.push(...(await listFiles(fullPath, baseDir)));
            } else {
                files.push(relativePath);
            }
        }
        return files;
    };
    try {
        const files = await listFiles(WORKING_DIR, WORKING_DIR);

        res.status(200).json({
            message: 'Elements in the working directory',
            files,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error occurred while listing files',
            error: error.message,
        });
    }
});

/**
 * GET /api/read-file?files=file1,filen
 * @description Reads the content of the specified files in the working directory and returns their content as a JSON response.
 * @param {string} files - Comma-separated list of file names to read.
 * @returns {Object} JSON response containing the content of the specified files.
 * @example
 * // Returns the content of file1.txt and file2.js
 * @route GET /api/read-file?files=file1.txt,file2.js
 */

app.get('/api/read-files', async (req, res) => {
    const { files } = req.query;

    if (!files) {
        return res.status(400).json({
            message:
                'No files specified. Please provide a comma-separated list of file names in the "files" query parameter.',
        });
    }

    const fileNames = files.split(',');

    const fileContents = await Promise.all(
        fileNames.map(async (fileName) => {
            const filePath = path.join(WORKING_DIR, fileName);
            try {
                const content = await fs.promises.readFile(filePath, 'utf8');
                return { [filePath.replace(WORKING_DIR, '')]: content };
            } catch (error) {
                return {
                    [filePath.replace(WORKING_DIR, '')]: `Error reading file: ${error.message}`,
                };
            }
        }),
    );

    res.status(200).json({
        message: 'Content of the specified files',
        fileContents,
    });
});

/**
 * PATCH /api/update-file
 * @description Updates the content of a specified file in the working directory.
 * @param updates - An json array of objects containing the file and content properties.
 * @returns {Object} JSON response indicating the success or failure of the update operation.
 * @example
 * // Updates the content of file1.txt
 * @route PATCH /api/update-file
 * [
 *   {
 *     "file": "file1.txt",
 *     "content": "New content for file1"
 *   }
 * ]
 */
app.patch('/api/update-files', async (req, res) => {
    const updates = req.body.updates;

    if (!Array.isArray(updates)) {
        return res.status(400).json({
            message: 'Invalid request body. Please provide an array of updates.',
        });
    }

    const updateResults = await Promise.all(
        updates.map(async (update) => {
            const { file, content } = update;
            const filePath = path.join(WORKING_DIR, file);
            try {
                await fs.promises.writeFile(filePath, content, 'utf8');
                return { [filePath.replace(WORKING_DIR, '')]: 'Update successful' };
            } catch (error) {
                return {
                    [filePath.replace(WORKING_DIR, '')]: `Error updating file: ${error.message}`,
                };
            }
        }),
    );

    res.status(200).json({
        message: 'Update results',
        updateResults,
    });
});

/**
 * @route POST /api/create-files
 * @description Creates new files in the working directory with the specified content.
 * @param {Array} files - An array of objects containing the file name and content.
 * @returns {Object} JSON response indicating the success or failure of the file creation operation.
 * @example
 * // Creates new files file1.txt and file2.js with specified content
 * files: [
 *   {
 *     "file": "file1.txt",
 *     "content": "Content for file1"
 *   },
 *   {
 *     "file": "file2.js",
 *     "content": "Content for file2"
 *   }
 * ]
 */

app.post('/api/create-files', async (req, res) => {
    const files = req.body.files;

    if (!Array.isArray(files)) {
        return res.status(400).json({
            message: 'Invalid request body. Please provide an array of file objects.',
        });
    }

    const createResults = await Promise.all(
        files.map(async (file) => {
            const { file: fileName, content } = file;
            const filePath = path.join(WORKING_DIR, fileName);
            try {
                await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
                await fs.promises.writeFile(filePath, content, 'utf8');
                return { [filePath.replace(WORKING_DIR, '')]: 'File created successfully' };
            } catch (error) {
                return {
                    [filePath.replace(WORKING_DIR, '')]: `Error creating file: ${error.message}`,
                };
            }
        }),
    );

    res.status(200).json({
        message: 'Create results',
        createResults,
    });
});

export default app;
