import { Button } from '@/components/ui/button';
import axios from 'axios';
import React, { useState, useEffect, useCallback } from 'react';
import io from 'socket.io-client';

const QuizApp = () => {
    const [score, setScore] = useState(0);
    const [socket, setSocket] = useState(null);
    const [roomId, setRoomId] = useState('');
    const [isHost, setIsHost] = useState(false);
    const [quizzes, setQuizzes] = useState([]);
    const [quizData, setQuizData] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [quizEnded, setQuizEnded] = useState(false);
    const [usersCount, setUsersCount] = useState(0);
    const [leaderBoard, setLeaderBoard] = useState(null);

    // Fetch quizzes on initial load
    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const response = await axios.get('http://localhost:3000/quiz/user', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                setQuizzes(response.data.data);
            } catch (error) {
                console.error('Error fetching quizzes:', error);
            }
        };
        fetchQuizzes();
    }, []);

    // Cleanup socket on component unmount
    useEffect(() => {
        return () => {
            if (socket) socket.disconnect();
        };
    }, [socket]);

    // Initialize socket connection and setup common listeners
    const initializeSocket = (newSocket) => {
        setSocket(newSocket);

        newSocket.on('users-count', setUsersCount);

        newSocket.on('question-changed', (questionData) => {
            setCurrentQuestion(questionData);
            setSelectedAnswer(null);
        });

        newSocket.on('quiz-ended', (leaderboard) => {
            setLeaderBoard(Array.isArray(leaderboard) ? leaderboard : []);
            setQuizEnded(true);
        });

        newSocket.on('connect_error', (error) => console.error('Connection Error:', error));
    };

    const createQuizRoom = useCallback((quiz) => {
        const newSocket = io('http://localhost:3000');
        initializeSocket(newSocket);
        setIsHost(true);
        setQuizData(quiz);

        newSocket.emit('create-room', quiz);
        newSocket.on('room-created', setRoomId);
    }, []);

    const joinQuizRoom = useCallback(() => {
        if (!roomId.trim()) return;

        const newSocket = io('http://localhost:3000');
        initializeSocket(newSocket);
        setIsHost(false);

        newSocket.emit('join-room', roomId);
        newSocket.on('join-successful', (data) => setQuizData(data.quiz));
    }, [roomId]);

    const startQuiz = () => {
        if (socket && isHost && quizData) {
            const firstQuestion = quizData.questions[0];
            setCurrentQuestion(firstQuestion);
            setCurrentQuestionIndex(0);
            socket.emit('start-quiz', { roomId, question: firstQuestion });
        }
    };

    const submitAnswer = (answerIndex) => {
        if (!socket || selectedAnswer !== null) return;

        setSelectedAnswer(answerIndex);
        socket.emit('submit-answer', { roomId, answerIndex });

        socket.once('answer-submitted', (result) => {
            if (result.isCorrect) {
                setScore((prevScore) => prevScore + 1);
            }
        });
    };

    const handleNextQuestion = () => {
        if (!socket || !isHost || !quizData) return;

        const nextIndex = currentQuestionIndex + 1;
        const hasMoreQuestions = nextIndex < quizData.questions.length;

        if (hasMoreQuestions) {
            const nextQuestion = quizData.questions[nextIndex];
            setCurrentQuestion(nextQuestion);
            setCurrentQuestionIndex(nextIndex);
            setSelectedAnswer(null);
            socket.emit('next-question', { roomId, question: nextQuestion });
        } else {
            socket.emit('end-quiz', { roomId });
        }
    };

    const renderLeaderboard = () => {
        if (!leaderBoard) return <p>Loading leaderboard...</p>;
        if (leaderBoard.length === 0) return <p>No leaderboard data available.</p>;

        return (
            <ul>
                {leaderBoard.map((player, index) => (
                    <li key={index}>
                        {player.playerId}: {player.score}
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Quiz App</h1>

            {quizEnded && (
                <div>
                    <h2>Quiz Ended</h2>
                    <p>Your score: {score}</p>
                    <h3>Leaderboard:</h3>
                    {renderLeaderboard()}
                </div>
            )}

            {!roomId && quizzes.map((quiz) => (
                <div key={quiz._id} className="border p-4 rounded mb-4 flex justify-between">
                    <div>
                        <h2 className="text-xl">{quiz.quizname}</h2>
                        <p>{quiz.questions.length} questions</p>
                    </div>
                    <Button onClick={() => createQuizRoom(quiz)}>Start Quiz</Button>
                </div>
            ))}

            {!quizData && (
                <div className="mt-4">
                    <input
                        type="text"
                        value={roomId}
                        onChange={(e) => setRoomId(e.target.value)}
                        placeholder="Enter Room ID"
                        className="border p-2 rounded"
                    />
                    <Button onClick={joinQuizRoom} disabled={!roomId.trim()}>
                        Join Room
                    </Button>
                </div>
            )}

            {roomId && !currentQuestion && (
                <div className="mt-4">
                    <p>Room ID: {roomId}</p>
                    {isHost && (
                        <>
                            <p className="mt-2">Players in room: {usersCount}</p>
                            <Button
                                onClick={startQuiz}
                                className="bg-purple-500 text-white p-2 rounded mt-2"
                            >
                                Start Quiz
                            </Button>
                        </>
                    )}
                </div>
            )}

            {!quizEnded && currentQuestion && (
                <div>
                    <h3 className="text-lg font-bold mb-2">Score: {score}</h3>
                    <h2 className="text-xl mb-4">{currentQuestion.question}</h2>
                    <div className="space-y-2">
                        {currentQuestion.options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => submitAnswer(index)}
                                disabled={selectedAnswer !== null}
                                className={`w-full p-2 rounded ${
                                    selectedAnswer === index
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-200'
                                }`}
                            >
                                {option.option}
                            </button>
                        ))}
                    </div>

                    {isHost && (
                        <Button
                            onClick={handleNextQuestion}
                            className="mt-4 bg-green-500 text-white p-2 rounded"
                        >
                            Next Question
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
};

export default QuizApp;
