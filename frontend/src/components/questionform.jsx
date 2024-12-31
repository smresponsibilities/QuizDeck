import { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Separator } from "@/components/ui/separator"
import { PlusCircle, Pencil, Trash2, Save, ArrowLeft } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import { useNavigate } from 'react-router-dom'
import { SaveQuizHandler } from "@/components/services/quiztobackend.js"

const COLORS = {
  red: "#e21b3c",
  blue: "#1368ce",
  yellow: "#ffa602",
  green: "#26890c"
}

export default function QuizCreator() {
  const [questions, setQuestions] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState("")
  const [answers, setAnswers] = useState(["", "", "", ""])
  const [correctAnswer, setCorrectAnswer] = useState(0)
  const [editingIndex, setEditingIndex] = useState(null)
  const [quizName, setQuizName] = useState("")
  const { toast } = useToast()
  const navigate = useNavigate()

  const handleAnswerChange = (index, value) => {
    const newAnswers = [...answers]
    newAnswers[index] = value
    setAnswers(newAnswers)
  }

  const addOrUpdateQuestion = () => {
    if (currentQuestion && answers.every(answer => answer)) {
      const newQuestion = {
        question: currentQuestion,
        options: answers.map((text, index) => ({
          option: text,
          isAnswer: index === correctAnswer
        }))
      }

      if (editingIndex !== null) {
        const updatedQuestions = [...questions]
        updatedQuestions[editingIndex] = newQuestion
        setQuestions(updatedQuestions)
        setEditingIndex(null)
      } else {
        setQuestions([...questions, newQuestion])
      }

      setCurrentQuestion("")
      setAnswers(["", "", "", ""])
      setCorrectAnswer(0)
    } else {
      toast({
        title: "Error",
        description: "Please fill in all fields before adding the question.",
        variant: "destructive"
      })
    }
  }

  const editQuestion = (index) => {
    const questionToEdit = questions[index]
    setCurrentQuestion(questionToEdit.question)
    setAnswers(questionToEdit.options.map(o => o.option))
    setCorrectAnswer(questionToEdit.options.findIndex(o => o.isAnswer))
    setEditingIndex(index)
  }

  const deleteQuestion = (index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index)
    setQuestions(updatedQuestions)
    if (editingIndex === index) {
      setEditingIndex(null)
      setCurrentQuestion("")
      setAnswers(["", "", "", ""])
      setCorrectAnswer(0)
    }
  }

  const saveQuiz = async () => {
    if (quizName.trim() === "") {
      toast({
        title: "Error",
        description: "Please enter a quiz name before saving.",
        variant: "destructive"
      })
      return
    }

    if (questions.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one question before saving.",
        variant: "destructive"
      })
      return
    }

    try {
      await SaveQuizHandler({ quizname: quizName, questions })
      toast({
        title: "Success",
        description: "Quiz saved successfully!",
        variant: "success"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save quiz. Please try again.",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="container mx-auto">
      <div className="max-w-4xl mx-auto">
        <Button
          onClick={() => navigate('/quiz')}
          variant="ghost"
          className="mb-4 flex items-center text-primary hover:text-primary/80"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Quizzes
        </Button>
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-primary">Create a New Quiz</CardTitle>
            <CardDescription>Add questions and answers to build your quiz</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="quizName" className="text-xl font-semibold text-primary">
                  Quiz Name
                </Label>
                <Input
                  id="quizName"
                  value={quizName}
                  onChange={(e) => setQuizName(e.target.value)}
                  placeholder="Enter quiz name"
                  className="mt-1 text-lg transition-all duration-300 ease-in-out focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <Separator className="my-4" />
              <div>
                <Label htmlFor="question" className="text-lg font-semibold">
                  Question {editingIndex !== null ? editingIndex + 1 : questions.length + 1}
                </Label>
                <Input
                  id="question"
                  value={currentQuestion}
                  onChange={(e) => setCurrentQuestion(e.target.value)}
                  placeholder="Enter your question"
                  className="mt-1 transition-all duration-300 ease-in-out focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              {answers.map((answer, index) => (
                <div key={index} className="space-y-2">
                  <Label htmlFor={`answer-${index}`} className="text-sm font-medium">
                    Answer {index + 1}
                  </Label>
                  <div className="flex space-x-2">
                    <Input
                      id={`answer-${index}`}
                      value={answer}
                      onChange={(e) => handleAnswerChange(index, e.target.value)}
                      placeholder={`Enter answer ${index + 1}`}
                      className="flex-grow transition-all duration-300 ease-in-out focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <Button
                      type="button"
                      variant={correctAnswer === index ? "default" : "outline"}
                      onClick={() => setCorrectAnswer(index)}
                      className="w-24 transition-all duration-300 ease-in-out hover:scale-105"
                      style={{
                        backgroundColor: correctAnswer === index ? Object.values(COLORS)[index] : 'transparent',
                        color: correctAnswer === index ? 'white' : 'inherit',
                        borderColor: Object.values(COLORS)[index]
                      }}
                    >
                      {correctAnswer === index ? "Correct" : "Mark"}
                    </Button>
                  </div>
                </div>
              ))}
              <Button
                onClick={addOrUpdateQuestion}
                className="w-full mt-4 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                {editingIndex !== null ? "Update Question" : "Add Question"}
              </Button>
            </div>

            <Separator className="my-8" />

            <div>
              <h3 className="text-2xl font-semibold mb-4 text-primary">Quiz Preview</h3>
              {quizName && (
                <div className="mb-4 p-4 bg-primary text-primary-foreground rounded-lg">
                  <h4 className="text-xl font-bold">Quiz Name: {quizName}</h4>
                </div>
              )}
              <Accordion type="single" collapsible className="w-full">
                {questions.map((q, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-lg font-medium transition-all duration-300 ease-in-out hover:bg-gray-100 rounded-lg px-4">
                      Question {index + 1}: {q.question}
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-none pl-0 mb-4 space-y-2">
                        {q.options.map((a, i) => (
                          <li
                            key={i}
                            className={`p-2 rounded transition-all duration-300 ease-in-out ${a.isAnswer ? "text-white font-semibold" : "text-gray-700 bg-gray-100 hover:bg-gray-200"
                              }`}
                            style={{ backgroundColor: a.isAnswer ? Object.values(COLORS)[i] : '' }}
                          >
                            {a.option} {a.isAnswer && "(Correct)"}
                          </li>
                        ))}
                      </ul>
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => editQuestion(index)}
                          variant="outline"
                          size="sm"
                          className="transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-md"
                        >
                          <Pencil className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          onClick={() => deleteQuestion(index)}
                          variant="destructive"
                          size="sm"
                          className="transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-md"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={saveQuiz}
              className="w-full transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Quiz
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}