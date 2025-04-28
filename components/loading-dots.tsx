"use client"

import { useEffect, useState } from "react"

export default function LoadingDots() {
  const [dots, setDots] = useState(".")

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev === "...") return "."
        return prev + "."
      })
    }, 500)

    return () => clearInterval(interval)
  }, [])

  return <span className="text-gray-500">{dots}</span>
}
