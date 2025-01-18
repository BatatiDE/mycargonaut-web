import RegisterForm from '@/components/RegisterForm'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Register() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-md mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-center">Registrieren</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <RegisterForm />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}


