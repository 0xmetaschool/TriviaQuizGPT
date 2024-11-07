"use client"
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Loader2, Trophy, Medal, Award, Brain, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const Dashboard = () => {
  // State variables to manage the quiz game
  const [loading, setLoading] = useState(false);                       // Loading state for API calls
  const [error, setError] = useState('');                              // Error message state
  const [quizData, setQuizData] = useState(null);                      // Quiz data fetched from API
  const [gameState, setGameState] = useState('setup');                 // Current state of the game (setup, playing, results)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Index of the current question
  const [userAnswers, setUserAnswers] = useState([]);                  // Array to store user's answers
  const [score, setScore] = useState(0);                               // User's score
  const [showAnswer, setShowAnswer] = useState(false);                 // State to show/hide the correct answer
  const [selectedAnswer, setSelectedAnswer] = useState(null);          // Currently selected answer
  const [quizDetails, setQuizDetails] = useState({
    numberOfQuestions: "5",
    category: '',
    level: 'easy',
    type: 'multiple'
  });

   // Function to handle changes in quiz details
  const handleChange = (name, value) => {
    if (name === 'numberOfQuestions') {
      const numValue = value === '' ? '' : Math.max(1, Math.min(50, parseInt(value) || 1));
      setQuizDetails(prev => ({
        ...prev,
        [name]: String(numValue)
      }));
    } else {
      setQuizDetails(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  // Function to handle form submission and start the quiz
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setQuizData(null);
    setUserAnswers([]);
    setScore(0);

    try {
      const response = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...quizDetails,
          numberOfQuestions: parseInt(quizDetails.numberOfQuestions)
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate quiz');
      }

      setQuizData(data);
      setGameState('playing');
      setCurrentQuestionIndex(0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

   // Function to handle user's answer selection
  const handleAnswer = (selectedOptionIndex) => {
    const currentQuestion = quizData.questions[currentQuestionIndex];
    const isCorrect = selectedOptionIndex === currentQuestion.correctAnswer;
    
    setSelectedAnswer(selectedOptionIndex);
    setShowAnswer(true);

    setTimeout(() => {
      setShowAnswer(false);
      setSelectedAnswer(null);
      setUserAnswers(prev => [...prev, {
        questionIndex: currentQuestionIndex,
        selectedAnswer: selectedOptionIndex,
        isCorrect
      }]);

      if (isCorrect) {
        setScore(prev => prev + 1);
      }

      if (currentQuestionIndex < quizData.questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        setGameState('results');
      }
    }, 1500);
  };

  // Function to determine the reward based on the user's score
  const getReward = () => {
    const percentage = (score / quizData.questions.length) * 100;
    if (percentage >= 80) {
      return {
        title: "Master of Knowledge",
        icon: <Trophy className="w-20 h-20 text-yellow-500 animate-bounce mx-auto" />,
        message: "Exceptional performance! You're a true expert!"
      };
    } else if (percentage >= 60) {
      return {
        title: "Knowledge Seeker",
        icon: <Medal className="w-20 h-20 text-gray-400 animate-pulse mx-auto" />,
        message: "Great achievement! Keep pushing forward!"
      };
    } else {
      return {
        title: "Learning Explorer",
        icon: <Award className="w-20 h-20 text-orange-600 animate-pulse mx-auto" />,
        message: "Good start! Every question is a learning opportunity!"
      };
    }
  };
  
  // Function to reset the quiz and return to the setup state
  const resetQuiz = () => {
    setGameState('setup');
    setQuizData(null);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setScore(0);
  };

  // Render the setup screen
  const renderSetup = () => (
    <Card className="max-w-md mx-auto bg-black/90 text-white border-white/20 mt-20">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <Brain className="w-8 h-8 text-white animate-pulse" />
          <CardTitle className="text-2xl font-bold">Trivia Quiz Arena</CardTitle>
        </div>
        <CardDescription className="text-gray-400">
          Challenge yourself in the ultimate quiz experience
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="numberOfQuestions" className="text-white">Questions (1-50)</Label>
            <Input
              id="numberOfQuestions"
              type="number"
              min="1"
              max="50"
              value={quizDetails.numberOfQuestions}
              onChange={(e) => handleChange('numberOfQuestions', e.target.value)}
              className="bg-white/10 border-white/20 text-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-white">Category</Label>
            <Input
              id="category"
              placeholder="e.g., Science, History"
              value={quizDetails.category}
              onChange={(e) => handleChange('category', e.target.value)}
              className="bg-white/10 border-white/20 text-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="level" className="text-white">Difficulty</Label>
            <Select 
              value={quizDetails.level} 
              onValueChange={(value) => handleChange('level', value)}
            >
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent className="bg-black text-white">
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type" className="text-white">Question Type</Label>
            <Select 
              value={quizDetails.type} 
              onValueChange={(value) => handleChange('type', value)}
            >
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent className="bg-black text-white">
                <SelectItem value="multiple">Multiple Choice</SelectItem>
                <SelectItem value="boolean">True/False</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </form>

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>

      <CardFooter>
        <Button 
          onClick={handleSubmit} 
          className="w-full bg-white text-black hover:bg-white/90 transition-all duration-300"
          disabled={loading || !quizDetails.category || !quizDetails.numberOfQuestions}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Preparing Your Challenge with GrokAI...
            </>
          ) : (
            'Enter the Arena'
          )}
        </Button>
      </CardFooter>
    </Card>
  );

   // Render the question screen
  const renderQuestion = () => {
    const question = quizData.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex) / quizData.questions.length) * 100;

    return (
      <Card className="max-w-2xl mx-auto bg-black/90 text-white border-white/20">
        <CardHeader>
          <div className="flex justify-between items-center mb-4">
            <CardTitle className="text-xl">Question {currentQuestionIndex + 1}/{quizData.questions.length}</CardTitle>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-400">Score: {score}</span>
              <Sparkles className="w-4 h-4 text-yellow-500" />
            </div>
          </div>
          <Progress value={progress} className="h-2 bg-white/20" />
          <CardDescription className="text-gray-400 mt-2">
            {quizData.metadata.category} - {quizData.metadata.level} Level
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="text-lg font-medium">{question.question}</div>
            <div className="grid grid-cols-1 gap-3">
              {question.options.map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className={cn(
                    "h-auto py-4 justify-start text-left transition-all duration-300",
                    "bg-white/10 border-white/20 text-white hover:bg-white/20",
                    showAnswer && index === question.correctAnswer && "bg-green-500/20 border-green-500 border-2",
                    showAnswer && index === selectedAnswer && index !== question.correctAnswer && "bg-red-500/20 border-red-500 border-2",
                    showAnswer && index !== selectedAnswer && index !== question.correctAnswer && "opacity-50"
                  )}
                  onClick={() => !showAnswer && handleAnswer(index)}
                  disabled={showAnswer}
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Render the results screen
  const renderResults = () => {
    const reward = getReward();
    const percentage = (score / quizData.questions.length) * 100;

    return (
      <Card className="max-w-2xl mx-auto bg-black/90 text-white border-white/20">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Challenge Complete!</CardTitle>
          <CardDescription className="text-center text-lg text-gray-400">
            Final Score: {score}/{quizData.questions.length} ({percentage.toFixed(1)}%)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-8">
            <div className="text-center">
                <div className="items-center">{reward.icon}</div>
              <h3 className="text-xl font-bold mt-4">{reward.title}</h3>
              <p className="text-gray-400 mt-2">{reward.message}</p>
            </div>
            
            <div className="w-full max-w-md space-y-4">
              {quizData.questions.map((question, index) => {
                const userAnswer = userAnswers[index];
                return (
                  <div 
                    key={index} 
                    className={cn(
                      "p-4 rounded-lg border transition-all duration-300",
                      userAnswer.isCorrect 
                        ? "bg-green-500/20 border-green-500/40" 
                        : "bg-red-500/20 border-red-500/40"
                    )}
                  >
                    <p className="font-medium">{question.question}</p>
                    <p className="text-sm mt-2 text-gray-400">
                      Your answer: {question.options[userAnswer.selectedAnswer]}
                    </p>
                    {!userAnswer.isCorrect && (
                      <p className="text-sm text-green-400 mt-1">
                        Correct answer: {question.options[question.correctAnswer]}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button 
            onClick={resetQuiz} 
            className="w-full max-w-xs bg-white text-black hover:bg-white/90 transition-all duration-300"
          >
            Challenge Again
          </Button>
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {gameState === 'setup' && renderSetup()}
        {gameState === 'playing' && renderQuestion()}
        {gameState === 'results' && renderResults()}
      </div>
    </div>
  );
};

export default Dashboard;