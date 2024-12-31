import React, { useState, useEffect } from 'react'
import axios from 'axios'
import io from 'socket.io-client'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'

const QuizApp = () => {

    const [score, setScore] = useState(0)
    const [socket, setSocket] = useState(null)
    const [roomId, setRoomId] = useState('')
    const [isHost, setIsHost] = useState(false)
    const [quizzes, setQuizzes] = useState([])
    const [quizData, setQuizData] = useState(null)
    const [currentQuestion, setCurrentQuestion] = useState(null)
    const [selectedAnswer, setSelectedAnswer] = useState(null)
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [quizEnded, setQuizEnded] = useState(false)
    const [usersCount, setUsersCount] = useState(0)
    const [leaderBoard, setLeaderBoard] = useState(null)
    const { toast } = useToast()
    const navigate = useNavigate()

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASEURL}/quiz/user`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                })
                setQuizzes(response.data.data)
            } catch (error) {
                console.error('Error fetching quizzes:', error)
                toast({
                    title: "Error",
                    description: "Failed to fetch quizzes. Please try again.",
                    variant: "destructive",
                })
            }
        }
        fetchQuizzes()
    }, [])

    useEffect(() => {
        return () => {
            if (socket) socket.disconnect()
        }
    }, [socket])

    const initializeSocket = (newSocket) => {
        // Get token if it exists
        const token = localStorage.getItem('token');
        if (token) {
            newSocket.auth = { token };
        }

        setSocket(newSocket)

        newSocket.on('users-count', setUsersCount)

        newSocket.on('question-changed', (questionData) => {
            setCurrentQuestion(questionData)
            setSelectedAnswer(null)
        })

        newSocket.on('quiz-ended', (leaderboard) => {
            setLeaderBoard(Array.isArray(leaderboard) ? leaderboard : [])
            setQuizEnded(true)
            toast({
                title: "Quiz Ended",
                description: "Check the leaderboard for results!",
            })
        })

        newSocket.on('connect_error', (error) => {
            console.error('Connection Error:', error)
            toast({
                title: "Connection Error",
                description: "Failed to connect to the server. Please try again.",
                variant: "destructive",
            })
        })
    }

    const createQuizRoom = (quiz) => {
        const newSocket = io(`${import.meta.env.VITE_BASEURL}`)
        initializeSocket(newSocket)
        setIsHost(true)
        setQuizData(quiz)

        newSocket.emit('create-room', quiz)
        newSocket.on('room-created', (id) => {
            setRoomId(id)
            toast({
                title: "Room Created",
                description: `Room ID: ${id}`,
            })
        })
    }

    const joinQuizRoom = () => {
        if (!roomId.trim()) return

        const newSocket = io(`${import.meta.env.VITE_BASEURL}`)
        initializeSocket(newSocket)
        setIsHost(false)

        newSocket.emit('join-room', roomId)
        newSocket.on('join-successful', (data) => {
            setQuizData(data.quiz)
            toast({
                title: "Joined Room",
                description: `Successfully joined room ${roomId}`,
            })
        })
    }

    const startQuiz = () => {
        if (socket && isHost && quizData) {
            const firstQuestion = quizData.questions[0]
            setCurrentQuestion(firstQuestion)
            setCurrentQuestionIndex(0)
            socket.emit('start-quiz', { roomId, question: firstQuestion })
            toast({
                title: "Quiz Started",
                description: "The quiz has begun!",
            })
        }
    }

    const submitAnswer = (answerIndex) => {
        if (!socket || selectedAnswer !== null) return

        setSelectedAnswer(answerIndex)
        socket.emit('submit-answer', { roomId, answerIndex })

        socket.once('answer-submitted', (result) => {
            if (result.isCorrect) {
                setScore((prevScore) => prevScore + 1)
                toast({
                    title: "Correct Answer",
                    description: "You got it right!",
                    variant: "success",
                })
            } else {
                toast({
                    title: "Incorrect Answer",
                    description: "Better luck next time!",
                    variant: "destructive",
                })
            }
        })
    }

    const handleNextQuestion = () => {
        if (!socket || !isHost || !quizData) return

        const nextIndex = currentQuestionIndex + 1
        const hasMoreQuestions = nextIndex < quizData.questions.length

        if (hasMoreQuestions) {
            const nextQuestion = quizData.questions[nextIndex]
            setCurrentQuestion(nextQuestion)
            setCurrentQuestionIndex(nextIndex)
            setSelectedAnswer(null)
            socket.emit('next-question', { roomId, question: nextQuestion })
        } else {
            socket.emit('end-quiz', { roomId })
        }
    }

    const renderLeaderboard = () => {
        if (!leaderBoard) return <p className="text-center text-gray-600">Loading leaderboard...</p>
        if (leaderBoard.length === 0) return <p className="text-center text-gray-600">No leaderboard data available.</p>

        return (
            <ul className="space-y-2">
                {leaderBoard.map((player, index) => (
                    <li key={index} className="flex justify-between items-center bg-gray-100 p-2 rounded">
                        <span className="font-semibold">{player.playerId}</span>
                        <span className="text-primary">{player.score}</span>
                    </li>
                ))}
            </ul>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 p-8">
            <Card className="max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold text-center text-primary">Quiz App</CardTitle>
                </CardHeader>
                <CardContent>
                    {quizEnded && (
                        <div className="space-y-4">
                            <h2 className="text-2xl font-semibold text-center">Quiz Ended</h2>
                            <p className="text-xl text-center">Your score: {score}</p>
                            <h3 className="text-xl font-semibold">Leaderboard:</h3>
                            {renderLeaderboard()}
                            <div className="flex justify-center mt-4">
                                <Button
                                    onClick={() => {
                                        setScore(0);
                                        setSocket(null);
                                        setRoomId('');
                                        setIsHost(false);
                                        setQuizData(null);
                                        setCurrentQuestion(null);
                                        setSelectedAnswer(null);
                                        setCurrentQuestionIndex(0);
                                        setQuizEnded(false);
                                        setUsersCount(0);
                                        setLeaderBoard(null);
                                        navigate('/quiz');
                                    }}
                                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                                >
                                    Back to Quizzes
                                </Button>
                            </div>
                        </div>
                    )}

                    {!roomId && (
                        <div className="space-y-4">
                            <div className="flex justify-end mb-4">
                                <Button
                                    onClick={() => navigate('/createquiz')}
                                    className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
                                >
                                    Create New Quiz
                                </Button>
                            </div>
                            {quizzes.map((quiz) => (
                                <Card key={quiz._id} className="p-4">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h2 className="text-xl font-semibold">{quiz.quizname}</h2>
                                            <p className="text-gray-600">{quiz.questions.length} questions</p>
                                        </div>
                                        <Button onClick={() => createQuizRoom(quiz)} className="bg-primary text-primary-foreground hover:bg-primary/90">Start Quiz</Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}

                    {!quizData && (
                        <div className="mt-4 flex space-x-2">
                            <Input
                                type="text"
                                value={roomId}
                                onChange={(e) => setRoomId(e.target.value)}
                                placeholder="Enter Room ID"
                                className="flex-grow"
                            />
                            <Button onClick={joinQuizRoom} disabled={!roomId.trim()} className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                                Join Room
                            </Button>
                        </div>
                    )}

                    {roomId && !currentQuestion && (
                        <div className="mt-4 text-center">
                            <p className="text-lg">Room ID: <span className="font-semibold">{roomId}</span></p>
                            {isHost && (
                                <>
                                    <p className="mt-2 text-lg">Players in room: <span className="font-semibold">{usersCount}</span></p>
                                    <Button
                                        onClick={startQuiz}
                                        className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90"
                                    >
                                        Start Quiz
                                    </Button>
                                </>
                            )}
                        </div>
                    )}

                    {!quizEnded && currentQuestion && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold">Score: {score}</h3>
                                {/* <p className="text-sm text-gray-600">Question {currentQuestionIndex + 1} of {quizData.questions.length}</p> */}
                            </div>
                            <h2 className="text-xl font-semibold mb-4">{currentQuestion.question}</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {currentQuestion.options.map((option, index) => (
                                    <Button
                                        key={index}
                                        onClick={() => submitAnswer(index)}
                                        disabled={selectedAnswer !== null}
                                        className={`p-4 h-auto text-left justify-start ${selectedAnswer === index
                                            ? 'bg-primary text-primary-foreground'
                                            : `${['bg-quizRed hover:bg-quizRedDark', 'bg-quizBlue hover:bg-quizBlueDark', 'bg-quizYellow hover:bg-quizYellowDark', 'bg-quizGreen hover:bg-quizGreenDark'][index]} text-white transition-colors`
                                            }`}
                                    >
                                        {option.option}
                                    </Button>
                                ))}
                            </div>

                            {isHost && (
                                <div className="flex justify-end mt-4">
                                    <Button
                                        onClick={handleNextQuestion}
                                        className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
                                    >
                                        Next Question
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export default QuizApp
