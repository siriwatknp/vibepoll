import ActivePoll from "@/components/active-poll"

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Current Poll</h1>
        <p className="text-muted-foreground mt-1">Cast your vote on the active poll</p>
      </div>

      <ActivePoll />
    </main>
  )
}
