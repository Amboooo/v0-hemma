"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

interface WelcomeAnimationProps {
  onComplete: () => void
}

export default function WelcomeAnimation({ onComplete }: WelcomeAnimationProps) {
  const [currentFrame, setCurrentFrame] = useState(1)
  const [animationComplete, setAnimationComplete] = useState(false)

  const totalFrames = 6
  const frameDelay = 600 // milliseconds per frame
  const finalFrameDelay = 1000 // extra time on last frame

  useEffect(() => {
    // Progress through animation frames
    if (currentFrame <= totalFrames) {
      const delay = currentFrame === totalFrames ? frameDelay + finalFrameDelay : frameDelay

      const timer = setTimeout(() => {
        if (currentFrame < totalFrames) {
          setCurrentFrame(currentFrame + 1)
        } else {
          setAnimationComplete(true)
          setTimeout(() => {
            onComplete()
          }, 500) // Fade out delay
        }
      }, delay)

      return () => clearTimeout(timer)
    }
  }, [currentFrame, onComplete])

  return (
    <AnimatePresence>
      {!animationComplete && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-indigo-950 z-50"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative w-full max-w-md flex flex-col items-center justify-center">
            {/* App title */}
            <motion.div
              className="absolute top-8 left-0 right-0 text-center z-10"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-2xl font-bold text-white drop-shadow-lg">Hemmasysslor</h1>
            </motion.div>

            {/* Animation frames */}
            <div className="relative w-80 h-80 flex items-center justify-center">
              <Image
                src={`/images/animation-frame${currentFrame}.png`}
                alt={`Animation frame ${currentFrame}`}
                width={400}
                height={400}
                className="pixelated"
                priority
              />
            </div>

            {/* Status text based on frame */}
            <motion.div
              className="absolute bottom-2 left-0 right-0 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-lg font-medium text-white">
                {currentFrame <= 2 && "Städar..."}
                {currentFrame >= 3 && currentFrame <= 4 && "Oj då!"}
                {currentFrame >= 5 && "Välkommen!"}
              </p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
