import { UserProfile } from "@clerk/nextjs";
import NavBar from "@/components/navbar";

export default function Dashboard() {
  return (
    <>
      <NavBar className="absolute w-full" />
      <div className="flex  bg-gray-50 min-h-full flex-1 flex-col justify-center py-16 sm:px-6 lg:px-8">
        <UserProfile
          appearance={{
            elements: {
              rootBox: "mx-auto h-[70vh]",
            },
          }}
          routing="path"
          path="/dashboard"
        />
      </div>
    </>
  );
}
