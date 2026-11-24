import axios from 'axios';
import * as z from 'zod';
import { tool } from 'langchain';

export const listFiles = tool(
    async () => {
        console.log('==============================================');
        console.log('listFiles tool invoked');
        console.log('==============================================');

        const response = await axios.get(
            'http://sandbox-service-01a20d4e-5c33-77fc-a408-07f459707090:3000/api/list-files',
        );

        console.log('==============================================');
        console.log('listFiles tool response:', response.data);
        console.log('==============================================');

        return JSON.stringify(response.data);
    },
    {
        name: 'list_files',
        description: 'Lists all files, directories and subdirectories in the working directory.',
    },
);

export const readFiles = tool(
    async ({ files }) => {
        console.log('==============================================');
        console.log('readFiles tool invoked with files:', files);
        console.log('==============================================');

        const response = await axios.get(
            `http://sandbox-service-01a20d4e-5c33-77fc-a408-07f459707090:3000/api/read-files?files=${files.join(',')}`,
        );

        console.log('==============================================');
        console.log('readFiles tool response:', response.data);
        console.log('==============================================');

        return JSON.stringify(response.data);
    },
    {
        name: 'read_files',
        description: 'Reads the content of specified files in the working directory.',
        schema: z.object({
            files: z.array(z.string()).describe('List of file paths to read'),
        }),
    },
);

export const updateFiles = tool(
    async ({ files }) => {
        console.log('==============================================');
        console.log('updateFiles tool invoked with files:', files);
        console.log('==============================================');

        const response = await axios.patch(
            'http://sandbox-service-01a20d4e-5c33-77fc-a408-07f459707090:3000/api/update-files',
            { files },
        );

        console.log('==============================================');
        console.log('updateFiles tool response:', response.data);
        console.log('==============================================');

        return JSON.stringify(response.data);
    },
    {
        name: 'update_files',
        description: 'Updates the content of specified files in the working directory.',
        schema: z.object({
            files: z.array(
                z.object({
                    file: z.string().describe('File path to update'),
                    content: z.string().describe('New content for the file'),
                }),
            ),
        }),
    },
);

export const createFiles = tool(
    async ({ files }) => {
        console.log('==============================================');
        console.log('createFiles tool invoked with files:', files);
        console.log('==============================================');

        const response = await axios.post(
            'http://sandbox-service-01a20d4e-5c33-77fc-a408-07f459707090:3000/api/create-files',
            { files },
        );

        console.log('==============================================');
        console.log('createFiles tool response:', response.data);
        console.log('==============================================');

        return JSON.stringify(response.data);
    },
    {
        name: 'create_files',
        description: 'Creates new files in the working directory.',
        schema: z.object({
            files: z.array(
                z.object({
                    file: z.string().describe('File path to create'),
                    content: z.string().describe('Content for the new file'),
                }),
            ),
        }),
    },
);
