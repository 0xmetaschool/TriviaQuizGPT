'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Loader2, Trophy, Medal, Award, Brain, Sparkles, Plus, Trash2, Share } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';

// Function to encode quiz data for sharing
const encodeQuizData = (quizData) => {
  const minifiedData = {
    t: quizData.title,
    d: quizData.description,
    q: quizData.questions.map(q => ({
      q: q.question,
      o: q.options,
      c: q.correctAnswer
    }))
  };
  return encodeURIComponent(btoa(JSON.stringify(minifiedData)));
};

// Function to decode quiz data from a shared link
const decodeQuizData = (encoded) => {
  try {
    const decoded = JSON.parse(atob(decodeURIComponent(encoded)));
    return {
      title: decoded.t,
      description: decoded.d,
      questions: decoded.q.map(q => ({
        question: q.q,
        options: q.o,
        correctAnswer: q.c
      }))
    };
  } catch (error) {
    return null;
  }
};

const CustomQuiz = () => {
  // State variables to manage the quiz creation
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [gameState, setGameState] = useState('create');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [quizDetails, setQuizDetails] = useState({
    title: '',
    description: '',
    questions: [{
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0
    }]
  });

  // Check for shared quiz data in the URL on component mount
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const sharedQuiz = searchParams.get('quiz');
    
    if (sharedQuiz) {
      const decodedQuiz = decodeQuizData(sharedQuiz);
      if (decodedQuiz) {
        setQuizDetails(decodedQuiz);
        setGameState('welcome');
      }
    }
  }, []);
  
  // Function to generate a shareable link for the quiz
  const generateShareLink = () => {
    try {
      const encoded = encodeQuizData(quizDetails);
      const url = `${window.location.origin}${window.location.pathname}?quiz=${encoded}`;
      setShareUrl(url);
      return url;
    } catch (error) {
      console.error('Error generating share link:', error);
      toast({
        title: "Error sharing quiz",
        description: "There was a problem generating the share link.",
        variant: "destructive",
      });
      return null;
    }
  };
  
  // Function to add a new question to the quiz
  const addQuestion = () => {
    setQuizDetails(prev => ({
      ...prev,
      questions: [...prev.questions, {
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0
      }]
    }));
  };

  // Function to remove a question from the quiz
  const removeQuestion = (index) => {
    setQuizDetails(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
  };
 
   // Function to update a question or its options
  const updateQuestion = (index, field, value, optionIndex = null) => {
    setQuizDetails(prev => {
      const newQuestions = [...prev.questions];
      if (optionIndex !== null) {
        newQuestions[index].options[optionIndex] = value;
      } else if (field === 'correctAnswer') {
        newQuestions[index][field] = parseInt(value);
      } else {
        newQuestions[index][field] = value;
      }
      return { ...prev, questions: newQuestions };
    });
  };

  // Function to update quiz details (title and description)
  const handleQuizDetailsChange = (field, value) => {
    setQuizDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Function to start the quiz
  const startQuiz = () => {
    setGameState('playing');
    setCurrentQuestionIndex(0);
    setScore(0);
    setUserAnswers([]);
  };
  
  // Function to handle user's answer selection
  const handleAnswer = (selectedOptionIndex) => {
    const currentQuestion = quizDetails.questions[currentQuestionIndex];
    const isCorrect = selectedOptionIndex === currentQuestion.correctAnswer;
    
    setShowAnswer(true);
    setTimeout(() => {
      setShowAnswer(false);
      setUserAnswers(prev => [...prev, {
        questionIndex: currentQuestionIndex,
        selectedAnswer: selectedOptionIndex,
        isCorrect
      }]);

      if (isCorrect) {
        setScore(prev => prev + 1);
      }

      if (currentQuestionIndex < quizDetails.questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        setGameState('results');
      }
    }, 1500);
  };

   // Function to determine the reward based on the user's score
  const getReward = () => {
    const percentage = (score / quizDetails.questions.length) * 100;
    if (percentage >= 80) {
      return {
        title: "Quiz Master",
        icon: <Trophy className="w-20 h-20 text-yellow-500 animate-bounce mx-auto" />,
        message: "Outstanding performance on your custom quiz!"
      };
    } else if (percentage >= 60) {
      return {
        title: "Knowledge Champion",
        icon: <Medal className="w-20 h-20 text-gray-400 animate-pulse mx-auto" />,
        message: "Great effort on your custom challenge!"
      };
    } else {
      return {
        title: "Quiz Explorer",
        icon: <Award className="w-20 h-20 text-orange-600 animate-pulse mx-auto" />,
        message: "Keep learning and improving!"
      };
    }
  };

  // Function to reset the quiz and return to the creation state
  const resetQuiz = () => {
    setGameState('create');
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setScore(0);
  };

  // Render the quiz creation screen
  const renderCreate = () => (
    <Card className="max-w-2xl mx-auto bg-black/90 text-white border-white/20">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <Brain className="w-8 h-8 text-white animate-pulse" />
          <CardTitle className="text-2xl font-bold">Create Custom Quiz</CardTitle>
        </div>
        <CardDescription className="text-gray-400">
          Design your own quiz challenge
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Quiz Title</Label>
            <Input
              id="title"
              value={quizDetails.title}
              onChange={(e) => handleQuizDetailsChange('title', e.target.value)}
              className="bg-white/10 border-white/20 text-white mt-1"
              placeholder="Enter quiz title"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={quizDetails.description}
              onChange={(e) => handleQuizDetailsChange('description', e.target.value)}
              className="bg-white/10 border-white/20 text-white mt-1"
              placeholder="Enter quiz description"
              required
            />
          </div>
        </div>

        <div className="space-y-6">
          {quizDetails.questions.map((question, qIndex) => (
            <Card key={qIndex} className="bg-white/5 border-white/10">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Question {qIndex + 1}</CardTitle>
                {quizDetails.questions.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeQuestion(qIndex)}
                    className="text-red-500 hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Input
                    value={question.question}
                    onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                    className="bg-white/10 border-white/20 text-white"
                    placeholder="Enter question"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  {question.options.map((option, oIndex) => (
                    <div key={oIndex} className="flex items-center space-x-2">
                      <Input
                        value={option}
                        onChange={(e) => updateQuestion(qIndex, 'options', e.target.value, oIndex)}
                        className="bg-white/10 border-white/20 text-white"
                        placeholder={`Option ${oIndex + 1}`}
                        required
                      />
                      <input
                        type="radio"
                        name={`correct-${qIndex}`}
                        checked={question.correctAnswer === oIndex}
                        onChange={() => updateQuestion(qIndex, 'correctAnswer', oIndex)}
                        className="ml-2"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}

          <Button
            onClick={addQuestion}
            className="w-full bg-white/10 hover:bg-white/20 text-white"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Question
          </Button>
        </div>
      </CardContent>

      <CardFooter>
        <Button
          onClick={startQuiz}
          className="w-full bg-white text-black hover:bg-white/90"
          disabled={!quizDetails.title || quizDetails.questions.some(q => !q.question)}
        >
          Start Quiz
        </Button>
      </CardFooter>
    </Card>
  );

  // Render the question screen during gameplay
  const renderQuestion = () => {
    const question = quizDetails.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex) / quizDetails.questions.length) * 100;

    return (
      <Card className="max-w-2xl mx-auto bg-black/90 text-white border-white/20">
        <CardHeader>
          <div className="flex justify-between items-center mb-4">
            <CardTitle className="text-xl">Question {currentQuestionIndex + 1}/{quizDetails.questions.length}</CardTitle>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-400">Score: {score}</span>
              <Sparkles className="w-4 h-4 text-yellow-500" />
            </div>
          </div>
          <Progress value={progress} className="h-2 bg-white/20" />
          <CardDescription className="text-gray-400 mt-2">
            {quizDetails.title}
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
                    "h-auto py-4 justify-start text-left",
                    "bg-white/10 border-white/20 text-white hover:bg-white/20",
                    showAnswer && index === question.correctAnswer && "bg-green-500/20 border-green-500",
                    showAnswer && index !== question.correctAnswer && "opacity-50"
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

  // Render the welcome screen for a shared quiz
  const renderWelcome = () => (
    <Card className="max-w-2xl mx-auto bg-black/90 text-white border-white/20">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">{quizDetails.title}</CardTitle>
        <CardDescription className="text-gray-400 text-center">
          {quizDetails.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <p className="text-gray-400">
            This quiz has {quizDetails.questions.length} questions
          </p>
        </div>
        <Button
          onClick={startQuiz}
          className="w-full bg-white text-black hover:bg-white/90"
        >
          Start Quiz
        </Button>
      </CardContent>
    </Card>
  );

  // Render the results screen after completing the quiz
  const renderResults = () => {
    const reward = getReward();
    const percentage = (score / quizDetails.questions.length) * 100;

    return (
      <Card className="max-w-2xl mx-auto bg-black/90 text-white border-white/20">
        <CardHeader>
          <CardTitle className="text-2xl text-center">{quizDetails.title} - Complete!</CardTitle>
          <CardDescription className="text-center text-lg text-gray-400">
            Final Score: {score}/{quizDetails.questions.length} ({percentage.toFixed(1)}%)
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
              {quizDetails.questions.map((question, index) => {
                const userAnswer = userAnswers[index];
                return (
                  <div 
                    key={index} 
                    className={cn(
                      "p-4 rounded-lg border",
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

          <div className="space-y-4">
          <Button
            onClick={() => {
              const url = generateShareLink();
              navigator.clipboard.writeText(url);
              toast({
                title: "Share link copied!",
                description: "Anyone with this link can take your quiz.",
                duration: 3000,
              });
            }}
            className="w-full bg-white/10 hover:bg-white/20 text-white"
            disabled={!quizDetails.title || quizDetails.questions.some(q => !q.question)}
          >
            <div className="flex items-center space-x-1">
              <Share className="h-4 w-2 mt-2" />
              <span>Share Quiz</span>
            </div>
          </Button>
          
          {shareUrl && (
            <div className="p-4 bg-white/5 rounded-lg break-all">
              <p className="text-sm text-gray-400 mb-2">Share Link:</p>
              <p className="text-sm font-mono text-center">Upgrade your plan</p>
            </div>
          )}
        </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button 
            onClick={resetQuiz} 
            className="w-full max-w-xs bg-white text-black hover:bg-white/90"
          >
            Create New Quiz
          </Button>
        </CardFooter>
      </Card>
    );
  };

  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {gameState === 'create' && renderCreate()}
        {gameState === 'playing' && renderQuestion()}
        {gameState === 'results' && renderResults()}
      </div>
    </div>
  );
};

export default CustomQuiz;