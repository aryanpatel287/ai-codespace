import express from 'express';
import morgan from 'morgan';

const app = express();

app.use(morgan('dev'));

app.get('/api/sandbox/health', (req, res) => {
    res.status(200).json({
        message: 'ok',
        timestamp: new Date().toISOString(),
    });
});

export default app;
