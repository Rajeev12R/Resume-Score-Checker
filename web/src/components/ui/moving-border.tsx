"use client"
import type React from "react"
import {
  motion,
  useAnimationFrame,
  useMotionTemplate,
  useMotionValue,
  useTransform,
} from "framer-motion"
import { useRef } from "react"
import { cn } from "@/lib/utils"

export function Button({
  borderRadius = "1rem",
  children,
  as: Component = "button",
  containerClassName,
  borderClassName,
  duration = 3000,
  className,
  ...otherProps
}: {
  borderRadius?: string
  children: React.ReactNode
  as?: any
  containerClassName?: string
  borderClassName?: string
  duration?: number
  className?: string
  [key: string]: any
}) {
  return (
    <Component
      className={cn(
        "relative overflow-hidden bg-transparent p-[2px] cursor-pointer transition-all duration-300 hover:scale-105",
        containerClassName
      )}
      style={{
        borderRadius: borderRadius,
      }}
      {...otherProps}
    >
      <div
        className="absolute inset-0"
        style={{ borderRadius: `calc(${borderRadius} * 0.96)` }}
      >
        <MovingBorder duration={duration} rx="30%" ry="30%">
          <div
            className={cn(
              "h-20 w-20 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-80",
              borderClassName
            )}
          />
        </MovingBorder>
      </div>

      <div
        className={cn(
          "relative flex h-full w-full items-center justify-center backdrop-blur-xl text-sm antialiased transition-all duration-300",
          className
        )}
        style={{
          borderRadius: `calc(${borderRadius} * 0.96)`,
        }}
      >
        {children}
      </div>
    </Component>
  )
}

export const MovingBorder = ({
  children,
  duration = 3000,
  rx,
  ry,
  ...otherProps
}: {
  children: React.ReactNode
  duration?: number
  rx?: string
  ry?: string
  [key: string]: any
}) => {
  const pathRef = useRef<any>(null)
  const progress = useMotionValue<number>(0)

  useAnimationFrame((time) => {
    let length = 0
    try {
      if (
        pathRef.current &&
        typeof pathRef.current.getTotalLength === "function"
      ) {
        length = pathRef.current.getTotalLength()
      }
    } catch (e) {
      // Ignore error if element is not rendered
      length = 0
    }
    if (length) {
      const pxPerMillisecond = length / duration
      progress.set((time * pxPerMillisecond) % length)
    }
  })

  const getPoint = (val: number) => {
    if (
      pathRef.current &&
      typeof pathRef.current.getTotalLength === "function" &&
      typeof pathRef.current.getPointAtLength === "function"
    ) {
      try {
        const length = pathRef.current.getTotalLength()
        if (length > 0) {
          return pathRef.current.getPointAtLength(val)
        }
      } catch (e) {
        // Ignore error if element is not rendered or path is empty
      }
    }
    return { x: 0, y: 0 }
  }

  const x = useTransform(progress, (val) => getPoint(val).x)
  const y = useTransform(progress, (val) => getPoint(val).y)

  const transform = useMotionTemplate`translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%)`

  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="absolute h-full w-full"
        width="100%"
        height="100%"
        {...otherProps}
      >
        <rect
          fill="none"
          width="100%"
          height="100%"
          rx={rx}
          ry={ry}
          ref={pathRef}
        />
      </svg>
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          display: "inline-block",
          transform,
        }}
      >
        {children}
      </motion.div>
    </>
  )
}
