"use client"
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Trophy, Medal, Award } from 'lucide-react';

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [quizData, setQuizData] = useState(null);
  const [gameState, setGameState] = useState('setup'); // setup, playing, results
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [quizDetails, setQuizDetails] = useState({
    numberOfQuestions: "5",
    category: '',
    level: 'easy',
    type: 'multiple'
  });

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

  const handleAnswer = (selectedOptionIndex) => {
    const currentQuestion = quizData.questions[currentQuestionIndex];
    const isCorrect = selectedOptionIndex === currentQuestion.correctAnswer;
    
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
  };

  const getReward = () => {
    const percentage = (score / quizData.questions.length) * 100;
    if (percentage >= 80) {
      return {
        title: "Gold NFT Trophy",
        icon: <Trophy className="w-16 h-16 text-yellow-500" />,
        message: "Outstanding! You've earned our prestigious Gold NFT Trophy!"
      };
    } else if (percentage >= 60) {
      return {
        title: "Silver Medal NFT",
        icon: <Medal className="w-16 h-16 text-gray-400" />,
        message: "Great job! You've earned a Silver Medal NFT!"
      };
    } else {
      return {
        title: "Bronze Achievement NFT",
        icon: <Award className="w-16 h-16 text-orange-600" />,
        message: "Good effort! You've earned a Bronze Achievement NFT!"
      };
    }
  };

  const resetQuiz = () => {
    setGameState('setup');
    setQuizData(null);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setScore(0);
  };

  const renderSetup = () => (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Create Your Trivia Quiz</CardTitle>
        <CardDescription className="text-center">
          Customize your quiz settings below
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="numberOfQuestions">Number of Questions (1-50)</Label>
            <Input
              id="numberOfQuestions"
              type="number"
              min="1"
              max="50"
              value={quizDetails.numberOfQuestions}
              onChange={(e) => handleChange('numberOfQuestions', e.target.value)}
              className="w-full"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              placeholder="e.g., Science, History"
              value={quizDetails.category}
              onChange={(e) => handleChange('category', e.target.value)}
              className="w-full"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="level">Difficulty Level</Label>
            <Select 
              value={quizDetails.level} 
              onValueChange={(value) => handleChange('level', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Question Type</Label>
            <Select 
              value={quizDetails.type} 
              onValueChange={(value) => handleChange('type', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
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
          className="w-full" 
          disabled={loading || !quizDetails.category || !quizDetails.numberOfQuestions}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Quiz...
            </>
          ) : (
            'Start Quiz'
          )}
        </Button>
      </CardFooter>
    </Card>
  );

  const renderQuestion = () => {
    const question = quizData.questions[currentQuestionIndex];
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-xl">
            Question {currentQuestionIndex + 1} of {quizData.questions.length}
          </CardTitle>
          <CardDescription>
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
                  className="h-auto py-4 justify-start text-left"
                  onClick={() => handleAnswer(index)}
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

  const renderResults = () => {
    const reward = getReward();
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Quiz Complete!</CardTitle>
          <CardDescription className="text-center text-lg">
            You scored {score} out of {quizData.questions.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-6">
            <div className="text-center">
              {reward.icon}
              <h3 className="text-xl font-bold mt-4">{reward.title}</h3>
              <p className="text-gray-600 mt-2">{reward.message}</p>
            </div>
            
            <div className="w-full max-w-md space-y-4">
              {quizData.questions.map((question, index) => {
                const userAnswer = userAnswers[index];
                return (
                  <div key={index} className={`p-4 rounded-lg ${userAnswer.isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
                    <p className="font-medium">{question.question}</p>
                    <p className="text-sm mt-2">
                      Your answer: {question.options[userAnswer.selectedAnswer]}
                    </p>
                    {!userAnswer.isCorrect && (
                      <p className="text-sm text-green-600 mt-1">
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
          <Button onClick={resetQuiz} className="w-full max-w-xs">
            Play Again
          </Button>
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {gameState === 'setup' && renderSetup()}
        {gameState === 'playing' && renderQuestion()}
        {gameState === 'results' && renderResults()}
      </div>
    </div>
  );
};

export default Dashboard;