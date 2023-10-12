//-----------React-----------//
import React, { useState, useEffect } from "react";

//-----------Firebase-----------//
import { database } from "../firebase/firebase";
import { onChildAdded, ref, update, remove } from "firebase/database";

//-----------Components-----------//
import NavBar from "../Details/NavBar.js";
import DateForm from "../Components/Dates/DateForm.js";
import ContextHelper from "../Components/Helpers/ContextHelper.js";

//-----------Media-----------//
import dates from "../Images/LogosIcons/word-icon-dates.png";

//Database key for date-list
const REALTIME_DATABASE_KEY_DATE = "date-list";

export default function DatesPage() {
  //context helper to send to database
  const REALTIME_DATABASE_KEY_PAIRKEY = ContextHelper("pairKey");

  //create state to view date list
  const [dateList, setDateList] = useState([]);

  //to view Date list
  useEffect(() => {
    const dateListRef = ref(
      database,
      `rooms/${REALTIME_DATABASE_KEY_PAIRKEY}/${REALTIME_DATABASE_KEY_DATE}`,
    );

    onChildAdded(dateListRef, (data) => {
      setDateList((state) => [...state, { key: data.key, val: data.val() }]);
    });
  }, [REALTIME_DATABASE_KEY_PAIRKEY]);

  // function to delete data
  const deleteDateItem = (dateItemKey) => {
    // Remove the item from local state
    const updatedDateList = dateList.filter(
      (dateItem) => dateItem.key !== dateItemKey,
    );
    setDateList(updatedDateList);

    // Remove the item from Firebase
    remove(
      ref(
        database,
        `rooms/${REALTIME_DATABASE_KEY_PAIRKEY}/${REALTIME_DATABASE_KEY_DATE}`,
      ),
    );
  };

  // Calculate number of days left
  const calculateDaysLeft = (targetDate) => {
    const currentDate = new Date();
    const registeredDate = new Date(targetDate);
    const timeDifference = registeredDate.getTime() - currentDate.getTime();
    const daysLeft = Math.ceil(timeDifference / (1000 * 3600 * 24));
    return daysLeft;
  };

  return (
    <div className="flex min-h-screen flex-col justify-center  bg-background">
      <NavBar src={dates} />
      <main className="mt-[110px] flex flex-col items-center justify-start">
        <div className="flex flex-row gap-3">
          <button className="px-2 hover:bg-slate-300">Upcoming</button>
          <button className="px-2 hover:bg-slate-300">Archive</button>
        </div>
        <div className="date-lists max-w-screen m-4 grid justify-center gap-4 p-3 md:grid-cols-1 lg:grid-cols-3">
          {dateList.map((dateItem) => (
            <div
              key={dateItem.key}
              className="m-[30px] flex w-[350px] flex-row items-start justify-between rounded-xl bg-text p-[10px] "
            >
              <div className="wrap flex items-center justify-between">
                <div className="group-for-days rounded-xl bg-background p-[20px]">
                  <h1 className="text-center text-xl font-bold">
                    {calculateDaysLeft(dateItem.val.date)}
                  </h1>
                  <h2 className="font-bold">Days</h2>
                </div>
                <div className="group-for-everythingelse ml-[10px]">
                  <h1 className="italic">
                    {dateItem.val.date}
                    <br />
                    {dateItem.val.time}
                  </h1>
                  <h1 className="font-bold">{dateItem.val.title}</h1>
                  {dateItem.val.items.map((item) => (
                    <div className="justify-left flex" key={item.id}>
                      <h1>-{item.title}</h1>
                    </div>
                  ))}
                </div>
              </div>
              <button
                className="ml-top"
                onClick={() => deleteDateItem(dateItem.key)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </main>
      <DateForm />
    </div>
  );
}
