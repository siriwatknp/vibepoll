"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { PollResults } from "@/components/poll-results"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Mock data for the active poll
const activePoll = {
  id: "1",
  question: "What feature would you like to see next?",
  options: [
    { id: "1", text: "Dark mode support", votes: 42 },
    { id: "2", text: "Mobile app", votes: 35 },
    { id: "3", text: "Integration with other tools", votes: 28 },
    { id: "4", text: "Offline mode", votes: 15 },
  ],
  totalVotes: 120,
  createdAt: "2 hours ago",
  expiresAt: "in 3 days",
  isActive: true,
}

// Alternative state when there's no active poll
const noPollAvailable = {
  title: "No active poll",
  description: "There are no active polls at the moment. Please check back later.",
}

export default function ActivePoll() {
  const [selectedOption, setSelectedOption] = useState<string>("")
  const [hasVoted, setHasVoted] = useState(false)

  // For demo purposes, we'll assume there is an active poll
  // In a real app, this would be fetched from the backend
  const isPollAvailable = true

  const handleVote = () => {
    if (!selectedOption) return
    setHasVoted(true)
    // In a real app, this would send the vote to the backend
  }

  if (!isPollAvailable) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{noPollAvailable.title}</AlertTitle>
        <AlertDescription>{noPollAvailable.description}</AlertDescription>
      </Alert>
    )
  }

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-2xl">{activePoll.question}</CardTitle>
        <CardDescription className="mt-2">
          Created {activePoll.createdAt} • Expires {activePoll.expiresAt}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!hasVoted ? (
          <RadioGroup value={selectedOption} onValueChange={setSelectedOption} className="space-y-3">
            {activePoll.options.map((option) => (
              <div
                key={option.id}
                className="flex items-center space-x-2 border rounded-md p-3 hover:bg-muted/50 transition-colors"
              >
                <RadioGroupItem value={option.id} id={`option-${option.id}`} />
                <Label htmlFor={`option-${option.id}`} className="flex-grow cursor-pointer">
                  {option.text}
                </Label>
              </div>
            ))}
          </RadioGroup>
        ) : (
          <PollResults poll={activePoll} userVote={selectedOption} />
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">{activePoll.totalVotes} total votes</div>
        {!hasVoted && (
          <Button onClick={handleVote} disabled={!selectedOption}>
            Vote
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
