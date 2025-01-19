'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Star } from 'lucide-react'

interface RatingProps {
    isDriver: boolean
    isFreightRide: boolean
    onSubmit: (ratings: number[]) => void
    participantName: string
}

export default function Rating({ isDriver, isFreightRide, onSubmit, participantName }: RatingProps) {
    const [ratings, setRatings] = useState<number[]>([0, 0, 0, 0])

    const questions = isDriver
        ? [
            "War der Mitfahrer pünktlich? (+/- 5 Minuten)",
            "Hat sich der Mitfahrer an alle Abmachungen gehalten? (Treffpunkt usw.)",
            "Haben Sie den Mitfahrer gerne mitgenommen?"
        ]
        : [
            "War der Fahrer pünktlich? (+/- 5 Minuten)",
            "Hat sich der Fahrer an alle Abmachungen gehalten? (Treffpunkt usw.)",
            "Haben Sie sich bei der Fahrt wohl gefühlt?"
        ]

    if (!isDriver && isFreightRide) {
        questions.push("Ist die Fracht unbeschadet angekommen?")
    }

    const handleRatingChange = (questionIndex: number, value: number) => {
        const newRatings = [...ratings]
        newRatings[questionIndex] = value
        setRatings(newRatings)
    }

    const handleSubmit = () => {
        onSubmit(ratings.slice(0, questions.length))
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Bewertung für {participantName}</CardTitle>
                <CardDescription>
                    Bitte bewerten Sie {isDriver ? "den Mitfahrer" : "die Fahrt"} auf einer Skala von 1 bis 5 Sternen
                </CardDescription>
            </CardHeader>
            <CardContent>
                {questions.map((question, index) => (
                    <div key={index} className="mb-4">
                        <Label className="text-base">{question}</Label>
                        <div className="flex space-x-1 mt-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onClick={() => handleRatingChange(index, star)}
                                    className="focus:outline-none"
                                >
                                    <Star
                                        className={`w-6 h-6 ${
                                            ratings[index] >= star ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                                        }`}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </CardContent>
            <CardFooter>
                <Button onClick={handleSubmit} disabled={ratings.slice(0, questions.length).some((r) => r === 0)}>
                    Bewertung abschicken
                </Button>
            </CardFooter>
        </Card>
    )
}

