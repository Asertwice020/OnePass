const Loader = () => {
  const loadingBalls = [1, 2, 3]

  return (
    <main className="flex justify-center items-center min-h-screen loader gap-x-2">
      {loadingBalls.map((ball) => (
        <div key={ball} className="w-4 aspect-square bg-color-1 rounded-full animate-bounce"></div>
      ))}
    </main>
  )
}

export default Loader