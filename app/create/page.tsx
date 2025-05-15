"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { addPoll, setActivePoll } from "@/lib/firebase-models";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

export default function CreatePoll() {
  const {
    user,
    loading: authLoading,
    error: authError,
    login,
    logout,
  } = useAuth();
  const [options, setOptions] = useState<string[]>(["", ""]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const addOption = () => {
    setOptions([...options, ""]);
  };

  const removeOption = (index: number) => {
    if (options.length <= 2) return;
    const newOptions = [...options];
    newOptions.splice(index, 1);
    setOptions(newOptions);
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    if (!question.trim() || options.some((opt) => !opt.trim())) {
      setError("Please enter a question and at least two options.");
      return;
    }
    setLoading(true);
    try {
      const poll = {
        question: question.trim(),
        options: options.map((text, i) => ({
          id: (i + 1).toString(),
          text: text.trim(),
        })),
        totalVotes: 0,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
        isActive: true,
      };
      const pollId = await addPoll(poll);
      await setActivePoll(pollId);
      setSuccess(true);
      setTimeout(() => router.push("/"), 1200);
    } catch (err) {
      setError("Failed to create poll. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Checking authentication...
      </div>
    );
  }

  if (!user) {
    return (
      <main className="container mx-auto px-4 py-8 max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Admin Login</CardTitle>
            <CardDescription>
              Sign in to create and publish polls
            </CardDescription>
          </CardHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              login(email, password);
            }}
          >
            <CardContent className="space-y-4">
              {authError && (
                <div className="text-red-500 text-sm mb-2">{authError}</div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button type="submit" disabled={authLoading}>
                {authLoading ? "Signing in..." : "Sign In"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex justify-end items-center mb-4 gap-2">
        <span className="text-sm text-muted-foreground">{user.email}</span>
        <Button variant="outline" size="sm" onClick={logout}>
          Logout
        </Button>
      </div>
      <Link
        href="/"
        className="flex items-center gap-2 text-muted-foreground mb-6 hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to polls
      </Link>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="text-2xl">Create a new poll</CardTitle>
            <CardDescription>
              Set up your question and options for people to vote on
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
            {success && (
              <div className="text-green-600 text-sm mb-2">
                Poll created! Redirecting...
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="question">Question</Label>
              <Input
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="What do you want to ask?"
              />
            </div>

            <div className="space-y-4">
              <Label>Options</Label>
              {options.map((option, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeOption(index)}
                    disabled={options.length <= 2}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                className="flex items-center gap-2"
                onClick={addOption}
              >
                <Plus className="h-4 w-4" />
                Add Option
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="multiple-votes" />
              <Label htmlFor="multiple-votes">
                Allow multiple votes per person
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="results-visibility" />
              <Label htmlFor="results-visibility">
                Show results before voting
              </Label>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" asChild>
              <Link href="/">Cancel</Link>
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Poll"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </main>
  );
}
