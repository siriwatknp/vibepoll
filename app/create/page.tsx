"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export default function CreatePoll() {
  const [options, setOptions] = useState<string[]>(["", ""])

  const addOption = () => {
    setOptions([...options, ""])
  }

  const removeOption = (index: number) => {
    if (options.length <= 2) return
    const newOptions = [...options]
    newOptions.splice(index, 1)
    setOptions(newOptions)
  }

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-2xl">
      <Link
        href="/"
        className="flex items-center gap-2 text-muted-foreground mb-6 hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to polls
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create a new poll</CardTitle>
          <CardDescription>Set up your question and options for people to vote on</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="question">Question</Label>
            <Input id="question" placeholder="What do you want to ask?" />
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

            <Button type="button" variant="outline" className="flex items-center gap-2" onClick={addOption}>
              <Plus className="h-4 w-4" />
              Add Option
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="multiple-votes" />
            <Label htmlFor="multiple-votes">Allow multiple votes per person</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="results-visibility" />
            <Label htmlFor="results-visibility">Show results before voting</Label>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline" asChild>
            <Link href="/">Cancel</Link>
          </Button>
          <Button>Create Poll</Button>
        </CardFooter>
      </Card>
    </main>
  )
}
