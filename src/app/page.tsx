//app/page.tsx
import Navbar from "@/components/navbar";
// import { ProfileForm } from "@/components/profile-form";
import { currentUser } from "@clerk/nextjs";

export default async function Home() {
  const user = await currentUser();
  return (
    <>
      <Navbar />
      <div className="bg-white py-24 ">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {!user ? (
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
              Not logged in
            </h1>
          ) : (
            <>
              <div className="mx-auto max-w-2xl lg:mx-0">
                <p className="text-base font-semibold leading-7 text-orange-600">
                  User Data
                </p>
                <h2 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                  Hello, {user?.firstName}
                </h2>
              </div>
              <pre className="mt-6 rounded-md w-full h-[50vh] overflow-auto bg-gray-900 p-4">
                <code className="text-white text-sm">
                  {JSON.stringify(user, null, 2)}
                </code>
              </pre>
            </>
          )}
        </div>
      </div>
    </>
  );
}
