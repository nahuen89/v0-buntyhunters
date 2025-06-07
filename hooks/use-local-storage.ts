"use client"

import { useState, useEffect, useCallback } from "react"

type SetValue<T> = T | ((val: T) => T)

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: SetValue<T>) => void, () => void] {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(initialValue)

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
      setStoredValue(initialValue)
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(key)
      }
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error)
    }
  }, [key, initialValue])

  // Get from local storage on mount
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const item = window.localStorage.getItem(key)
        if (item) {
          const parsedValue = JSON.parse(item)
          setStoredValue(parsedValue)
        }
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      // If error, use initial value
      setStoredValue(initialValue)
    }
  }, [key, initialValue])

  return [storedValue, setValue, removeValue]
}
