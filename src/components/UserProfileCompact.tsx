'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Star } from 'lucide-react'
import { User } from '@/types/user'
import {Skeleton} from "@/components/ui/skeleton";

interface UserProfileCompactProps {
    user: User,
    loading?: boolean
}

export default function UserProfileCompact({ user, loading }: UserProfileCompactProps) {
    return (
        <div className="flex items-center space-x-4">
            {loading ? (
                <>
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div>
                        <Skeleton className="h-4 w-24 mb-2" />
                        <Skeleton className="h-3 w-32" />
                    </div>
                </>
            ) : (
                <>
            <Avatar>
                <AvatarImage src={user.picture} alt={`${user.firstName} ${user.lastName}`} />
                <AvatarFallback>{user.firstName[0]}{user.lastName[0]}</AvatarFallback>
            </Avatar>
            <div>
                <h4 className="font-semibold">{user.firstName} {user.lastName[0]}.</h4>
                <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">{user.rating?.toFixed(1) || 'N/A'}</span>
                    <Badge variant="secondary" className="text-xs">{user.numRides || 0} Fahrten</Badge>
                </div>
            </div>
            </>
            )}
        </div>
    )
}