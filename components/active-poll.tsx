"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { PollResults } from "@/components/poll-results";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getActivePoll, getVotes, addVote, Poll } from "@/lib/firebase-models";

export default function ActivePoll() {
  const [poll, setPoll] = useState<Poll | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [hasVoted, setHasVoted] = useState(false);
  const [votes, setVotes] = useState<any[]>([]);

  useEffect(() => {
    setLoading(true);
    getActivePoll()
      .then((data) => setPoll(data))
      .catch(() => setError("Failed to load poll."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (poll) {
      // Check if user has already voted on this poll
      const voted =
        typeof window !== "undefined" &&
        localStorage.getItem(`voted_${poll.id}`);
      setHasVoted(!!voted);
      if (hasVoted) {
        getVotes(poll.id).then(setVotes);
      }
    }
  }, [poll, hasVoted]);

  const handleVote = async () => {
    if (!selectedOption || !poll) return;
    // Prevent duplicate votes
    if (
      typeof window !== "undefined" &&
      localStorage.getItem(`voted_${poll.id}`)
    ) {
      setHasVoted(true);
      return;
    }
    setLoading(true);
    try {
      // Use a random string as voteId for anonymous users
      const voteId =
        typeof window !== "undefined"
          ? window.crypto?.randomUUID?.() || Math.random().toString(36).slice(2)
          : Math.random().toString(36).slice(2);
      await addVote(
        poll.id,
        {
          optionId: selectedOption,
          votedAt: new Date().toISOString(),
        },
        voteId
      );
      if (typeof window !== "undefined") {
        localStorage.setItem(`voted_${poll.id}`, selectedOption);
      }
      setHasVoted(true);
      getVotes(poll.id).then(setVotes);
    } catch (err) {
      setError("Failed to submit vote. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Loading poll...
      </div>
    );
  }

  if (error) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!poll) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>No active poll</AlertTitle>
        <AlertDescription>
          There are no active polls at the moment. Please check back later.
        </AlertDescription>
      </Alert>
    );
  }

  if (!hasVoted) {
    return (
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl">{poll.question}</CardTitle>
          <CardDescription className="mt-2">
            Created {poll.createdAt} • Expires {poll.expiresAt}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={selectedOption}
            onValueChange={setSelectedOption}
            className="space-y-3"
          >
            {poll.options.map((option) => (
              <div
                key={option.id}
                className="flex items-center space-x-2 border rounded-md p-3 hover:bg-muted/50 transition-colors"
              >
                <RadioGroupItem value={option.id} id={`option-${option.id}`} />
                <Label
                  htmlFor={`option-${option.id}`}
                  className="flex-grow cursor-pointer"
                >
                  {option.text}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
        <CardFooter className="flex justify-between">
          {/* TODO: Show real total votes from Firestore */}
          <div className="text-sm text-muted-foreground">Total votes</div>
          <Button onClick={handleVote} disabled={!selectedOption || loading}>
            {loading ? "Voting..." : "Vote"}
          </Button>
        </CardFooter>
      </Card>
    );
  } else if (poll) {
    // Compute vote counts for each option
    const optionVoteCounts = poll.options.map((option) => ({
      ...option,
      votes: votes.filter((v) => v.optionId === option.id).length,
    }));
    const totalVotes = votes.length;
    return (
      <PollResults
        poll={{ ...poll, options: optionVoteCounts, totalVotes }}
        userVote={selectedOption}
      />
    );
  }

  return null;
}
