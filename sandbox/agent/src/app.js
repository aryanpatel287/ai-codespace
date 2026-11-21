import express from 'express';
import morgan from 'morgan';
import fs from 'fs';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: 'true' }));

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

app.get('/api/list-files', async (req, res) => {
    const elements = await fs.promises.readdir(WORKING_DIR);

    res.status(200).json({
        message: 'Elements in the working directory',
        elements,
    });
});

export default app;
