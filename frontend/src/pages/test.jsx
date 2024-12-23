import React, { useState, useEffect } from 'react';
import io, { Socket } from 'socket.io-client';

const QuizApp = () => {
    const [socket, setSocket] = useState(null);
    const [roomId, setRoomId] = useState('');
    const [isHost, setIsHost] = useState(false);
    const [quizData, setQuizData] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [selectedAnswer, setSelectedAnswer] = useState(null);

    // Create a new quiz room
    const createQuizRoom = () => {
        const mockQuizData = {
            title: 'Sample Quiz',
            questions: [
                {
                    text: 'What is 2 + 2?',
                    options: [
                        { id: 'a', text: '3' },
                        { id: 'b', text: '4' },
                        { id: 'c', text: '5' }
                    ],
                    correctOptionId: 'b',
                    timeLimit: 30
                }
            ]
        };

        // Establish socket connection only when creating a room
        const newSocket = io('http://localhost:3000');
        newSocket.on('connect_error', (error) => {
            console.error('Connection Error:', error);
        });
        setSocket(newSocket);
        setIsHost(true);

        newSocket.emit('create-room', mockQuizData);

        newSocket.on('room-created', (id) => {
            setRoomId(id);
        });
    };

    // Join an existing quiz room
    const joinQuizRoom = () => {
        // Establish socket connection only when joining a room
        const newSocket = io('http://localhost:3000');
        setSocket(newSocket);
        setIsHost(false);

        newSocket.emit('join-room', roomId);

        newSocket.on('join-successful', (data) => {
            setQuizData(data.quiz);
        });

        newSocket.on('next-question', (questionData) => {
            setCurrentQuestion(questionData);
            setSelectedAnswer(null);
        });
    };

    // Start the quiz (host-only)
    const startQuiz = () => {
        if (socket && isHost) {
            socket.emit('start-quiz', roomId);
        }
    };

    // Submit an answer
    const submitAnswer = (answerId) => {
        if (socket) {
            setSelectedAnswer(answerId);
            socket.emit('submit-answer', { roomId, answerId });
        }
    };

    // Cleanup socket connection
    useEffect(() => {
        return () => {
            if (socket) {
                socket.disconnect();
            }
        };
    }, [socket]);

    return (
        <div className="p-4">
            {!roomId && (
                <div className="space-y-4">
                    <button
                        onClick={createQuizRoom}
                        className="bg-blue-500 text-white p-2 rounded"
                    >
                        Create Quiz Room
                    </button>
                    <div className="flex items-center space-x-2">
                        <input
                            type="text"
                            value={roomId}
                            onChange={(e) => setRoomId(e.target.value)}
                            placeholder="Enter Room ID"
                            className="border p-2 rounded"
                        />
                        <button
                            onClick={joinQuizRoom}
                            className="bg-green-500 text-white p-2 rounded"
                        >
                            Join Room
                        </button>
                    </div>
                </div>
            )}

            {roomId && !currentQuestion && (
                <div>
                    <p>Room ID: {roomId}</p>
                    {isHost && (
                        <button
                            onClick={startQuiz}
                            className="bg-purple-500 text-white p-2 rounded"
                        >
                            Start Quiz
                        </button>
                    )}
                </div>
            )}

            {currentQuestion && (
                <div>
                    <h2 className="text-xl mb-4">{currentQuestion.text}</h2>
                    <div className="space-y-2">
                        {currentQuestion.options.map((option) => (
                            <button
                                key={option.id}
                                onClick={() => submitAnswer(option.id)}
                                disabled={!!selectedAnswer}
                                className={`w-full p-2 rounded ${selectedAnswer === option.id
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200'
                                    }`}
                            >
                                {option.text}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuizApp;