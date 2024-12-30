import { Button } from '@/components/ui/button';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
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
    const [leaderBoard, setLeaderBoard] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3000/quiz/user', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
            .then((response) => setQuizzes(response.data.data))
            .catch((error) => console.error('Error fetching quizzes:', error));
    }, []);

    const createQuizRoom = (quiz) => {
        const newSocket = io('http://localhost:3000');
        setSocket(newSocket);
        setIsHost(true);
        setQuizData(quiz);

        newSocket.emit('create-room', quiz);
        newSocket.on('room-created', (id) => setRoomId(id));

        newSocket.on('users-count', (count) => {
            setUsersCount(count);
        });

        newSocket.on('connect_error', (error) => {
            console.error('Connection Error:', error);
        });

        newSocket.on('question-changed', (questionData) => {
            setCurrentQuestion(questionData);
            setSelectedAnswer(null);
        });

        newSocket.on('answer-submitted', () => {
            setSelectedAnswer(true);
        });
    };

    const joinQuizRoom = () => {
        const newSocket = io('http://localhost:3000');
        setSocket(newSocket);
        setIsHost(false);

        newSocket.emit('join-room', roomId);

        newSocket.on('join-successful', (data) => {
            setQuizData(data.quiz);
        });

        newSocket.on('question-changed', (questionData) => {
            setCurrentQuestion(questionData);
            setSelectedAnswer(null);
        });

        newSocket.on('connect_error', (error) => {
            console.error('Connection Error:', error);
        });
    };

    const startQuiz = () => {
        if (socket && isHost && quizData) {
            setCurrentQuestionIndex(0);
            setCurrentQuestion(quizData.questions[0]);
            socket.emit('start-quiz', {
                roomId,
                question: quizData.questions[0]
            });
        }
    };

    const submitAnswer = (answerIndex) => {
        if (socket) {
            setSelectedAnswer(answerIndex);
            socket.emit('submit-answer', { roomId, answerIndex });
            socket.on('answer-submitted', (result) => {
                if (result.isCorrect) {
                    setScore(score + 1);
                }
            });
        }
    };

    const handleNextQuestion = () => {
        if (socket && isHost && quizData) {
            const nextIndex = currentQuestionIndex + 1;
            if (nextIndex < quizData.questions.length) {
                setCurrentQuestionIndex(nextIndex);
                setCurrentQuestion(quizData.questions[nextIndex]);
                setSelectedAnswer(null);
                socket.emit('next-question', {
                    roomId,
                    question: quizData.questions[nextIndex]
                });
            }
            if (nextIndex >= quizData.questions.length) {
                socket.emit('end-quiz', { roomId });
                socket.on('quiz-ended', (leaderboard) => {
                    console.log('Leaderboard:', leaderboard);
                    setLeaderBoard(leaderboard);
                });
                setQuizEnded(true);
            }
        }
    };

    useEffect(() => {
        return () => {
            if (socket) {
                socket.disconnect();
            }
        };
    }, [socket]);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Quiz App</h1>
            {quizEnded && leaderBoard.length > 0 &&
                <div>
                    <h2>Quiz Ended</h2>
                    <p>Your score: {score}</p>
                    Leaderboard:
                    {console.log("lll" ,leaderBoard)}
                    <ul>
                        {leaderBoard.map((player, index) => (
                            <li key={index}>
                                {player.playerId}: {player.score}
                            </li>
                        ))}
                    </ul>
                </div>}

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
                    <h3 className="text-lg font-bold mb-2">{score}</h3>
                    <h2 className="text-xl mb-4">{currentQuestion.question}</h2>
                    <div className="space-y-2">
                        {currentQuestion.options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => submitAnswer(index)}
                                disabled={selectedAnswer !== null}
                                className={`w-full p-2 rounded ${selectedAnswer === index ? 'bg-blue-500 text-white' : 'bg-gray-200'
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
