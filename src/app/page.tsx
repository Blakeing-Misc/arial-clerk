//app/page.tsx
import Navbar from "@/components/navbar";
import { ProfileForm } from "@/components/profile-form";

export default async function Home() {
  return (
    <>
      <Navbar />
      <div className="py-10">
        <header>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
              Home
            </h1>
          </div>
        </header>
        <main>
          <div className="mx-auto space-y-4 max-w-7xl sm:px-6 lg:px-8">
            {/* <div className="">Hello {user?.firstName}</div> */}

            {/* <ProfileForm /> */}
            {/* <div>
              <pre>{JSON.stringify(user, null, 4)}</pre>
            </div> */}
          </div>
        </main>
      </div>
    </>
  );
}
