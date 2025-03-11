// BookingSuccessModal.tsx
"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// BookingSuccessModal.tsx

interface BookingSuccessModalProps {
  isOpen: boolean;
  duration?: number; // Dauer in Sekunden (Standard: 5)
  onComplete: () => void;
}

export default function BookingSuccessModal({
  isOpen,
  duration = 5,
  onComplete,
}: BookingSuccessModalProps) {
  const [secondsLeft, setSecondsLeft] = useState(duration);
  const [progress, setProgress] = useState(0); // in Prozent

  useEffect(() => {
    if (!isOpen) return;
    setSecondsLeft(duration);
    setProgress(0);

    const countdownInterval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const step = 100 / duration / 10; // 100ms steps
        if (prev + step >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + step;
      });
    }, 100);

    return () => {
      clearInterval(countdownInterval);
      clearInterval(progressInterval);
    };
  }, [isOpen, duration]);

  useEffect(() => {
    if (secondsLeft === 0) {
      onComplete();
    }
  }, [secondsLeft, onComplete]);

  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <Dialog open={isOpen}>
      <DialogContent className="flex flex-col items-center">
        <DialogHeader>
          <DialogTitle>Buchung Erfolgreich</DialogTitle>
        </DialogHeader>
        <div className="my-4 flex flex-col items-center">
          <svg width={100} height={100} className="mb-4">
            <circle
              stroke="#e5e7eb"
              fill="transparent"
              strokeWidth="8"
              r={radius}
              cx="50"
              cy="50"
            />
            <circle
              stroke="#4ade80"
              fill="transparent"
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              r={radius}
              cx="50"
              cy="50"
            />
          </svg>
          <p className="text-lg">
            Sie werden in {secondsLeft} Sekunde
            {secondsLeft !== 1 ? "n" : ""} zum Profil weitergeleitet.
          </p>
        </div>
        <DialogFooter>
          <Button onClick={onComplete}>Jetzt weiterleiten</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
