import React, { useEffect, useState } from "react";
import axios from "axios";

type Props = {};

export default function TestPage({}: Props) {
  const [data, setData] = useState<any>([]);

  async function fetchData() {
    try {
      const res = await axios.get(
        "https://ecocharge-backend-production-0bb7.up.railway.app/charging_booth/",
        {
          headers: {
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzdHJpbmciLCJleHAiOjE3MTQ4OTY1OTd9.EbBRVjm8YtOO-Zd--okVlz45C5CqE_Av-MYn8P9mm5Y",
          },
        }
      );
      const data = await res.data;

      console.log(data);

      setData(data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <button onClick={fetchData}>Fetch Data</button>
      {JSON.stringify(data)}
    </div>
  );
}



// https://ecocharge-backend-production-0bb7.up.railway.app/charging_booth
// http://ecocharge-backend-production-0bb7.up.railway.app/charging_booth/
// https://ecocharge-backend-production-0bb7.up.railway.app/charging_booth/