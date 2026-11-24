import express from 'express';
import morgan from 'morgan';
import { geminiAgent } from './agents/code.agents.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: 'true' }));
app.use(morgan('dev'));

app.get('/api/ai/healthz', (req, res) => {
    res.status(200).json({ message: 'Ai Agent is running', status: 'ok' });
});

app.post('/api/ai/invoke', async (req, res) => {
    try {
        const { message } = req.body;
        const response = await geminiAgent.invoke({
            messages: [
                {
                    role: 'user',
                    content: message,
                },
            ],
        });
        res.status(200).json({ message: 'Success', data: response });
    } catch (error) {
        console.error('Error getting response:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

export default app;
