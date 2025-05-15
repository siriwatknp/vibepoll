import { CheckCircle2 } from "lucide-react"
import { Progress } from "@/components/ui/progress"

type PollOption = {
  id: string
  text: string
  votes: number
}

type Poll = {
  id: string
  question: string
  options: PollOption[]
  totalVotes: number
  createdAt: string
  expiresAt: string
  isActive: boolean
}

interface PollResultsProps {
  poll: Poll
  userVote: string
}

export function PollResults({ poll, userVote }: PollResultsProps) {
  // Sort options by votes (highest first)
  const sortedOptions = [...poll.options].sort((a, b) => b.votes - a.votes)

  return (
    <div className="space-y-4">
      <h3 className="font-medium">Results</h3>
      <div className="space-y-3">
        {sortedOptions.map((option) => {
          const percentage = poll.totalVotes > 0 ? Math.round((option.votes / poll.totalVotes) * 100) : 0

          return (
            <div key={option.id} className="space-y-1">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{option.text}</span>
                  {userVote === option.id && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                </div>
                <span className="text-sm font-medium">{percentage}%</span>
              </div>
              <Progress value={percentage} className="h-2" />
              <div className="text-xs text-muted-foreground">
                {option.votes} {option.votes === 1 ? "vote" : "votes"}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
