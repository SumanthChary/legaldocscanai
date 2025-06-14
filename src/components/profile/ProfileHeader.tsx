
import { Skeleton } from "@/components/ui/skeleton";

type ProfileHeaderProps = {
  loading?: boolean;
};

export const ProfileHeader = ({ loading = false }: ProfileHeaderProps) => {
  if (loading) {
    return (
      <div className="text-center mb-4 sm:mb-6 lg:mb-8">
        <Skeleton className="h-6 sm:h-8 w-48 sm:w-64 mx-auto mb-2" />
        <Skeleton className="h-4 sm:h-5 w-60 sm:w-80 mx-auto" />
      </div>
    );
  }

  return (
    <div className="text-center mb-4 sm:mb-6 lg:mb-8">
      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-1 sm:mb-2">
        Profile Settings
      </h1>
      <p className="text-sm sm:text-base text-gray-600">Manage your account information and deleted documents</p>
    </div>
  );
};
