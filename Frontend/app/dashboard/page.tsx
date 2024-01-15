"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import axios from "axios";
import Link from "next/link";
import { useSession } from "next-auth/react";


function Page() {
  const [data, setData] = useState<ICar[]>([]);
   const [pageSize, setPageSize] = useState<number>(3); 
  const [page, setPage] = useState<number>(1);
  const [trigger, setTriger] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const{data:session} = useSession()
  const handleDelete = async (id: number) => {
    try {
      const response = await axios.delete(`http://localhost:4000/api/v1/car/${id}`,{
        headers:{
          Authorization:`Bearer ${session?.user.accessToken}`
        }
      });
      if (response.status == 200) {
        setTriger((prev) => !prev);
      }
    } catch (error: any) {
      alert(error.message);
    }
  };

  const getData = async () => {

    try {
      const response = await axios.get(
        `http://localhost:4000/api/v1/car?page=${page}&limit=${pageSize}&merek=${searchQuery}`,
        {
          headers: {
            Authorization: `Bearer ${session?.user.accessToken}`,
          },
        },
      );
      setData(response.data?.data.cars);
    } catch (error) {
      console.log(error);
    }
    
  };

  const handleSearch = () => {
    setTriger((prev) => !prev);
  };

   const handlePageChange = (newPage: number) => {
     setPage(newPage);
   };
  

  useEffect(() => {
    if (session) {
      getData();
    }
  }, [trigger, page, session]);

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div className="container max-w-3xl px-4 mx-auto sm:px-8">
        <div className="py-8">
          <div className="px-4 py-4 -mx-4 overflow-x-auto sm:-mx-8 sm:px-8">
            <div className="inline-block min-w-full overflow-hidden rounded-lg shadow">
              <input
                type="text"
                placeholder="Search by name, year, etc."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  handleSearch(); 
                }}
              />
              <table className="min-w-full leading-normal">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-sm font-normal text-left text-gray-800 uppercase bg-white border-b border-gray-200"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 text-sm font-normal text-left text-gray-800 uppercase bg-white border-b border-gray-200"
                    >
                      year
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 text-sm font-normal text-left text-gray-800 uppercase bg-white border-b border-gray-200"
                    >
                      merek
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 text-sm font-normal text-left text-gray-800 uppercase bg-white border-b border-gray-200"
                    >
                      Created at
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((car) => (
                    // eslint-disable-next-line react/jsx-key
                    <tr>
                      <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <a href="#" className="relative block"></a>
                          </div>
                          <div className="ml-3">
                            <p className="text-gray-900 whitespace-no-wrap">
                              {car.name}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                        <p className="text-gray-900 whitespace-no-wrap">
                          {car.year}
                        </p>
                      </td>
                      <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                        <p className="text-gray-900 whitespace-no-wrap">
                          {car.merek}
                        </p>
                      </td>
                      <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                        <img
                          src={car.imageUrl}
                          alt={car.name}
                          className="object-cover w-15 h-15 "
                        />
                      </td>
                      <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                        <Link href={`/dashboard/${car._id}`} className="ml-5">
                          Edit
                        </Link>
                      </td>
                      <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                        <button onClick={() => handleDelete(car._id)}>
                          delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end mt-4">
              {page > 1 && (
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                >
                  Previous
                </button>
              )}
              {data.length === 3 && (
                <button onClick={() => handlePageChange(page + 1)}>Next</button>
              )}
            </div>
            <Link href="/dashboard/add" className="ml-5">
              Add Item
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
