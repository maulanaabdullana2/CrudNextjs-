"use client"
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

function Page() {
    const [name,setName] = useState<string>("")
    const[address,setAddress] = useState<string>("")
    const[email,setEmail] = useState<string>("")
    const[password,setPassword] = useState<string>("")
    const router = useRouter()
    const heandeleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            const response = await axios.post("http://localhost:4000/api/v1/auth/register",{
                name,
                address,
                email,
                password
            });
            if (response.status == 200) {
              router.push("/login");
            } else {
              alert(response.data.status);
            }
        } catch (error) {
            console.log(error);
            
        }
    };
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col max-w-md px-4 py-8 bg-white rounded-lg shadow dark:bg-gray-800 sm:px-6 md:px-8 lg:px-10">
        <div className="self-center mb-2 text-xl font-light text-gray-800 sm:text-2xl dark:text-white">
          Create a new account
        </div>
        <span className="justify-center text-sm text-center text-gray-500 flex-items-center dark:text-gray-400">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-sm text-blue-500 underline hover:text-blue-700"
          >
            Sign in
          </a>
        </span>
        <div className="p-6 mt-8">
          <form onSubmit={heandeleSubmit}>
            <div className="flex flex-col mb-2">
              <div className="relative">
                <input
                  type="text"
                  id="create-account-email"
                  value={name}
                  onChange={(e)=> setName(e.target.value)}
                  className="rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="Name"
                />
              </div>
            </div>
            <div className="flex flex-col mb-2">
              <div className="relative">
                <input
                  type="text"
                  id="create-account-email"
                  value={address}
                  onChange={(e)=>setAddress(e.target.value)}
                  className="rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="Address"
                />
              </div>
            </div>
            <div className="flex flex-col mb-2">
              <div className="relative">
                <input
                  type="text"
                  id="create-account-email"
                  value={email}
                  onChange={(e)=>setEmail(e.target.value)}
                  className="rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="Email"
                />
              </div>
            </div>
            <div className="flex flex-col mb-2">
              <div className="relative">
                <input
                  type="text"
                  id="create-account-email"
                  value={password}
                  onChange={(e)=>setPassword(e.target.value)}
                  className="rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="password"
                />
              </div>
            </div>
            <div className="flex w-full my-4">
              <button
                type="submit"
                className="py-2 px-4 bg-purple-600 hover:bg-purple-700 focus:ring-purple-500 focus:ring-offset-purple-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Page;
