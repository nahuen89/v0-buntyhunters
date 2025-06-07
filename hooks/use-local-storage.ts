"use client"

import { useState, useEffect, useCallback, useRef } from "react"

type SetValue<T> = T | ((val: T) => T)

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: SetValue<T>) => void, () => void] {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(initialValue)
  const [isInitialized, setIsInitialized] = useState(false)
  const initialValueRef = useRef(initialValue)

  // Update the ref when initialValue changes
  useEffect(() => {
    initialValueRef.current = initialValue
  }, [initialValue])

  // Get from local storage on mount (only once)
  useEffect(() => {
    if (typeof window === "undefined") return

    try {
      const item = window.localStorage.getItem(key)
      if (item) {
        const parsedValue = JSON.parse(item)
        setStoredValue(parsedValue)
      } else {
        // If no item exists, use initial value and save it
        setStoredValue(initialValue)
        window.localStorage.setItem(key, JSON.stringify(initialValue))
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      setStoredValue(initialValue)
    } finally {
      setIsInitialized(true)
    }
  }, [key]) // Only depend on key, not initialValue

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = useCallback(
    (value: SetValue<T>) => {
      try {
        // Allow value to be a function so we have the same API as useState
        const valueToStore = value instanceof Function ? value(storedValue) : value

        // Save state
        setStoredValue(valueToStore)

        // Save to local storage
        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(valueToStore))
        }
      } catch (error) {
        console.error(`Error saving to localStorage key "${key}":`, error)
      }
    },
    [key, storedValue],
  )

  // Function to remove the item from localStorage
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValueRef.current)
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(key)
      }
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error)
    }
  }, [key])

  // Return initial value until we've loaded from localStorage
  return [isInitialized ? storedValue : initialValue, setValue, removeValue]
}
