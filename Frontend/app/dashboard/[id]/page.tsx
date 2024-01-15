/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface IParam {
  params: {
    id: number;
  };
}

function page({ params }: IParam) {
  const [name, setName] = useState<string>("");
  const [merek, setMerek] = useState<string>("");
  const [year, setYear] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const router = useRouter();
  const id = params.id;
   const { data: session } = useSession({
     required: true,
     onUnauthenticated: () => {
       router.push("/login");
     },
   });

   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     if (e.target.files && e.target.files.length > 0) {
       setImage(e.target.files[0]);
     }
   };

  const heandeleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
       const formData = new FormData();
       formData.append("name", name);
       formData.append("merek", merek);
       formData.append("year", year);
       if (image) {
         formData.append("image", image);
       }
      const response = await axios.patch(
        `http://localhost:4000/api/v1/car/edit/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${session?.user.accessToken}`,
          },
        },
      );
      if (response.status == 200) {
        router.push("/dashboard");
      } else {
        alert(response.data.status);
      }
    } catch (error) {
      console.log(error);
    }
  };
    
  const getData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/v1/car/${id}`,
        {
          headers: {
            Authorization: `Bearer ${session?.user.accessToken}`,
          },
        },
        );
        const carData = response.data.data.car;
      setName(carData.name);
      setMerek(carData.merek);
      setYear(carData.year);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getData();
  }, []);

if (!session) router.push("/login")

  return (
    <div>
      <div className="min-h-screen p-6 bg-gray-100 flex items-center justify-center">
        <
          div className="container max-w-screen-lg mx-auto">
          <div>
            <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
              <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
                <div className="text-gray-600">
                  <h2 className="font-semibold text-xl text-gray-600">
                    Add New Data Car
                  </h2>
                  <p className="text-gray-500 mb-6">
                    Form add new data motor for sale.
                  </p>
                  <p className="font-medium text-lg">Motor Details</p>
                  <p>Please fill out all the fields.</p>
                </div>
                <form onSubmit={heandeleSubmit}>
                  <div className="lg:col-span-2">
                    <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
                      <div className="md:col-span-5">
                        <label htmlFor="brand">Name</label>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                          placeholder="Honda"
                        />
                      </div>
                      <div className="md:col-span-5">
                        <label htmlFor="brand">Name</label>
                        <input
                          type="text"
                          name="merek"
                          id="merek"
                          value={merek}
                          onChange={(e) => setMerek(e.target.value)}
                          className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                          placeholder="Honda"
                        />
                      </div>
                      <div className="md:col-span-3">
                        <label htmlFor="year">Year</label>
                        <input
                          type="text"
                          name="year"
                          id="year"
                          value={year}
                          onChange={(e) => setYear(e.target.value)}
                          className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                          placeholder="2022"
                        />
                        <div className="md:col-span-5">
                          <label htmlFor="image">Image</label>
                          <input
                            type="file"
                            name="image"
                            id="image"
                            onChange={handleImageChange}
                            className="mt-1"
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="bg-green-500 p-2 rounded-md text-lime-100"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default page;
