"use client";

import { useState, useEffect, useRef } from "react";
import { profileApi } from "@/utils/api";
import { getErrorMessage } from "@/utils/errorHandler";
import { useAuth } from "@/utils/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Users, Package, MapPin, X, Upload } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {User} from '@/types/user'

export default function ProfileForm() {
    const [profile, setProfile] = useState<User | null>(null);
    const [editedProfile, setEditedProfile] = useState<Partial<User>>({});
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [newLanguage, setNewLanguage] = useState<string>("");

    //TODO: Add function to add Profile Picture

    const { refreshUser } = useAuth();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const userData = await profileApi.fetchProfile();
                setProfile(userData);
                setEditedProfile(userData);
                setError(null);
            } catch (err) {
                const errorMessage = getErrorMessage(err);
                console.error("Error fetching profile:", errorMessage);
                setError(errorMessage);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditedProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleSwitchChange = (checked: boolean) => {
        setEditedProfile(prev => ({ ...prev, isSmoker: checked }));
    };

    const handleAddLanguage = () => {
        if (newLanguage && !editedProfile.languages?.includes(newLanguage)) {
            setEditedProfile(prev => ({
                ...prev,
                languages: [...(prev.languages || []), newLanguage]
            }));
            setNewLanguage("");
        }
    };

    const handleRemoveLanguage = (language: string) => {
        setEditedProfile(prev => ({
            ...prev,
            languages: prev.languages?.filter(lang => lang !== language) || []
        }));
    };

    const handleSaveChanges = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        try {
            await profileApi.updateProfile(editedProfile);
            setSuccessMessage("Profile updated successfully.");
            setProfile(prev => {
                if (prev === null) return null;
                return { ...prev, ...editedProfile };
            });
            setIsDialogOpen(false);
            await refreshUser();
        } catch (err) {
            setError(getErrorMessage(err));
        }
    };

    //TODO: Berechnung Überarbeiten
    const calculateAge = (birthdate: string | null): number => {
        if (!birthdate) return 0;
        const today = new Date();
        const birthDate = new Date(birthdate);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    if (isLoading) {
        return <div>Loading profile...</div>;
    }

    if (!profile) {
        return <div>No profile data available.</div>;
    }

    return (
                <Card className="md:col-span-1">
                    <CardHeader>
                        <div className="flex items-center space-x-4">
                            <Avatar className="w-20 h-20">
                                <AvatarImage src={profile.picture || undefined} alt={`${profile.firstName || ''} ${profile.lastName || ''}`} />
                                <AvatarFallback>{profile.firstName?.[0] || ''}{profile.lastName?.[0] || ''}</AvatarFallback>
                            </Avatar>
                            <div>
                                <CardTitle>{profile.firstName} {profile.lastName}</CardTitle>
                                <CardDescription>Alter: {calculateAge(profile.birthdate)}</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="mb-4">{profile.additionalNote}</p>
                        <div className="flex items-center space-x-2 mb-4">
                            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                            <span>{profile.rating?.toFixed(1) || 'N/A'} ({profile.numRides || 0} Fahrten)</span>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <Users className="w-5 h-5 text-gray-500" />
                                <span>{profile.numPassengers || 0} Passagiere befördert</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Package className="w-5 h-5 text-gray-500" />
                                <span>{profile.weightCarried || 0} kg transportiert</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <MapPin className="w-5 h-5 text-gray-500" />
                                <span>{profile.distanceTraveled || 0} km zurückgelegt</span>
                            </div>
                        </div>
                        <div className="mt-4">
                            <h4 className="font-semibold mb-2">Sprachen</h4>
                            <div className="flex flex-wrap gap-2">
                                {profile.languages?.map(lang => (
                                    <Badge key={lang} variant="secondary">{lang}</Badge>
                                ))}
                            </div>
                        </div>
                        <div className="mt-4">
                            <Badge variant={profile.isSmoker ? "destructive" : "secondary"}>
                                {profile.isSmoker ? 'Raucher' : 'Nichtraucher'}
                            </Badge>
                        </div>
                        <div className="mt-4">
                            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button>Profil bearbeiten</Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>Profil bearbeiten</DialogTitle>
                                        <DialogDescription>
                                            Ändern Sie Ihre Profilinformationen hier. Klicken Sie auf Speichern, wenn Sie fertig sind.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <form onSubmit={handleSaveChanges} className="space-y-4">
                                        <Input
                                            name="firstName"
                                            value={editedProfile.firstName || ''}
                                            onChange={handleInputChange}
                                            placeholder="Vorname"
                                        />
                                        <Input
                                            name="lastName"
                                            value={editedProfile.lastName || ''}
                                            onChange={handleInputChange}
                                            placeholder="Nachname"
                                        />
                                        <Input
                                            name="phone"
                                            value={editedProfile.phone || ''}
                                            onChange={handleInputChange}
                                            placeholder="Telefon"
                                        />
                                        <Input
                                            name="birthdate"
                                            type="date"
                                            value={editedProfile.birthdate || ''}
                                            onChange={handleInputChange}
                                            placeholder="Geburtsdatum"
                                        />
                                        <Textarea
                                            name="additionalNote"
                                            value={editedProfile.additionalNote || ''}
                                            onChange={handleInputChange}
                                            placeholder="Zusätzliche Informationen"
                                        />
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Sprachen</label>
                                            <div className="flex flex-wrap gap-2 mb-2">
                                                {editedProfile.languages?.map(lang => (
                                                    <Badge key={lang} variant="secondary" className="flex items-center">
                                                        {lang}
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveLanguage(lang)}
                                                            className="ml-1 focus:outline-none"
                                                        >
                                                            <X className="h-3 w-3" />
                                                        </button>
                                                    </Badge>
                                                ))}
                                            </div>
                                            <div className="flex">
                                                <Input
                                                    value={newLanguage}
                                                    onChange={(e) => setNewLanguage(e.target.value)}
                                                    placeholder="Neue Sprache"
                                                    className="mr-2"
                                                />
                                                <Button type="button" onClick={handleAddLanguage}>Hinzufügen</Button>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Switch
                                                id="isSmoker"
                                                checked={editedProfile.isSmoker || false}
                                                onCheckedChange={handleSwitchChange}
                                            />
                                            <label htmlFor="isSmoker">Raucher</label>
                                        </div>
                                        <Button type="submit">Änderungen speichern</Button>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </div>
                        {successMessage && <p className="text-green-500 mt-2">{successMessage}</p>}
                        {error && <p className="text-red-500 mt-2">{error}</p>}
                    </CardContent>
                </Card>
    );
}

