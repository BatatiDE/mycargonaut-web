import AuthGuard from "@/components/shared/AuthGuard"; // Protect the page
import ProfileForm from "@/components/ProfileForm"; // Break out reusable components

export default function ProfilePage() {
    return (
        <AuthGuard>
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <ProfileForm />
            </div>
        </AuthGuard>
    );
}
