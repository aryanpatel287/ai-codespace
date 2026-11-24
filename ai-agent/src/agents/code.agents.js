import { createAgent } from 'langchain';
import { listFiles, readFiles, updateFiles, createFiles } from './tools.agent.js';
import { ChatGoogle } from '@langchain/google';
import dotenv from 'dotenv';
dotenv.config();

const geminiModel = new ChatGoogle({
    model: 'gemini-3.6-flash',
    apiKey: process.env.GEMINI_API_KEY,
});

const geminiAgent = createAgent({
    model: geminiModel,
    tools: [listFiles, readFiles, updateFiles, createFiles],
});

export { geminiAgent };
