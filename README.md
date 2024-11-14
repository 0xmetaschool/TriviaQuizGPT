# Trivia Quiz GPT
TriviaGPT makes creating and playing quizzes easier than ever. Instead of spending hours writing questions, this app creates fun, custom quizzes in seconds. It's like having a smart friend who knows how to make learning feel like a game - quick, fun, and perfect for everyone.

Built with Next.js and powered by XAI, this template lets you build a trivia app that everyone will enjoy playing as more people want fun ways to learn.


## Live Demo

[https://trivia-quiz-gpt.vercel.app/](https://trivia-quiz-gpt.vercel.app/)

## Features

- Secure login with Gmail or email/password.
- Generate trivia quizzes based on AI-powered questions
- Personalize quiz categories and difficulty levels
- Interactive UI for participants to answer questions

## Technologies Used

- Next.js and React for Frontend and Backend
- XAPI with Grok-beta model for AI-Powered Features
- Clerk authentication for Authorization

## Use Cases

- Personalize quizzes based on your interests and preferred difficulty level.
- Receive detailed feedback and results after each quiz.
- Create unlimited customized quizzes for any subject or skill.

### Installation Steps

1. Clone the repository:
 
```
git clone https://github.com/0xmetaschool/TriviaQuizGPT.git
```

2. Navigate to the project directory:
```
cd TriviaQuizGPT
```

2. Install dependencies:
```
npm install
```

3. Set up environment variables:

Create an .env file in the root directory. Add the following variables:
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

X_AI_API_KEY=your_X_API_key
```

4. Run the development server:
```
npm run dev
```
Open your browser and navigate to `http://localhost:3000`.

## Screenshots

<div style="display: flex; justify-content: space-between;">
  <img src="https://github.com/0xmetaschool/TriviaQuizGPT/blob/main/public/trivia-quiz-gpt-template-homepage.png?raw=true" alt="TriviaQuizGPT Homepage screenshot" style="width: 49%; border: 2px solid black;" />
  <img src="https://github.com/0xmetaschool/TriviaQuizGPT/blob/main/public/trivia-quiz-gpt-template-quiz-arena.png?raw=true" alt="TriviaQuizGPT Quiz Arena screenshot" style="width: 49%; border: 2px solid black;" />
</div>
<div style="display: flex; justify-content: space-between;">
  <img src="https://github.com/0xmetaschool/TriviaQuizGPT/blob/main/public/trivia-quiz-gpt-template-quiz-result.png?raw=true" alt="TriviaQuizGPT Quiz Result screenshot" style="width: 49%; border: 2px solid black;" />
  <img src="https://github.com/0xmetaschool/TriviaQuizGPT/blob/main/public/trivia-quiz-gpt-template-custom-quiz-generation.png?raw=true" alt="TriviaQuizGPT Custom Quiz Generation screenshot" style="width: 49%; border: 2px solid black;" />
</div>


## How to Use the Application

- Sign in using your Google account.
- Choose your quiz settings by selecting the number of questions, category, difficulty, and question type.
- Click "Enter the Arena" to join the quiz room.
- Complete the AI-generated quiz by answering all the questions.
- After finishing, you’ll be redirected to the results page with a detailed breakdown of your performance.

## Contributing

We love contributions! Here's how you can help make the project even better:

- Fork the project (gh repo fork https://github.com/0xmetaschool/TriviaQuizGPT/fork)
- Create your feature branch (git checkout -b feature/AmazingFeature)
- Commit your changes (git commit -m 'Add some AmazingFeature')
- Push to the branch (git push origin feature/AmazingFeature)
- Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/0xmetaschool/TriviaQuizGPT/blob/main/LICENSE) file for details.

## Contact

Please open an issue in the GitHub repository for any queries or support.
