import { createAgent } from 'langchain';
import { listFiles, readFiles, updateFiles, createFiles } from './tools.agent.js';
import { ChatGoogle } from '@langchain/google';
import dotenv from 'dotenv';
dotenv.config();

const geminiModel = new ChatGoogle({
    model: 'gemma-4-31b-it',
    apiKey: process.env.GOOGLE_API_KEY,
});

const geminiAgent = createAgent({
    model: geminiModel,
    tools: [listFiles, readFiles, updateFiles, createFiles],
});

await geminiAgent.invoke({
    messages: [
        {
            role: 'user',
            content:
                "This is the react vite template in the src/App.jsx file. Make a snake game in the src/App.jsx file. Use the css in the src/App.css file. keep the game simple and fun. Do not use any external libraries. Do not use any images. Use only divs and css for the game. Make sure the game is playable and has a score counter.The Snake should be controlled using the arrow keys. The game should end when the snake hits the wall or itself. The game should have a restart button to play again. The game should have a start button to start the game. The game should have a pause button to pause the game. The game should have a resume button to resume the game. The game should have a speed control to increase or decrease the speed of the snake. The game should have a high score counter that saves the high score in local storage.There is already some code in the files, so make sure to understand the code and do the necessary changes to implement the game. Do not delete any existing code. Make sure to keep the existing code intact and only add the necessary code to implement the game. Make sure to test the game and make sure it works as expected. Make sure to follow best practices and write clean and maintainable code. Make sure to add comments to explain the code. Make sure to use meaningful variable and function names. Make sure to use proper indentation and formatting. Make sure to handle edge cases and errors gracefully. Make sure to optimize the code for performance and efficiency. Make sure to follow the DRY (Don't Repeat Yourself) principle and avoid code duplication. Make sure to use modular and reusable components. Make sure to use state management effectively. Make sure to use React hooks effectively. Make sure to use CSS effectively for styling. Make sure to use responsive design for different screen sizes. Make sure to test the game on different browsers and devices. Make sure to fix any bugs or issues that arise during testing.",
        },
    ],
});

export { geminiAgent };
