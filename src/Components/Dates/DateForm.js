//-----------React-----------//
import React, { useState } from "react";

//-----------Firebase-----------//
import { push, ref, set } from "firebase/database";
import { database } from "../../firebase/firebase";

//-----------Components-----------//
import ContextHelper from "../Helpers/ContextHelper";

//Database key for date-list
const REALTIME_DATABASE_KEY_DATE = "date-list";

export default function DateForm() {
  //State for date list
  const [title, setTitle] = useState("");
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  //context helper to send to database
  const REALTIME_DATABASE_KEY_PAIRKEY = ContextHelper("pairKey");

  //create input to add more items with + button...
  const handleSubmit = (e) => {
    e.preventDefault();

    setItems((currentItem) => {
      return [
        ...currentItem,
        {
          id: new Date().getTime(),
          title: newItem,
        },
      ];
    });
    setNewItem("");
  };

  //delete item
  const deleteItem = (id) => {
    setItems((currentItems) => {
      return currentItems.filter((items) => items.id !== id);
    });
  };

  //send data to database
  const writeData = () => {
    const dateListRef = ref(
      database,
      `rooms/${REALTIME_DATABASE_KEY_PAIRKEY}/${REALTIME_DATABASE_KEY_DATE}`,
    );
    const newDateRef = push(dateListRef);

    set(newDateRef, {
      id: new Date().getTime(),
      title: title,
      items: items,
      date: date,
      time: time,
    });

    setTitle("");
    setItems([]);
    setNewItem("");
    setDate("");
    setTime("");

    document.getElementById("date-form").close();
  };

  return (
    <div className=" fixed bottom-[20px] right-[20px] flex-row ">
      <button
        className="btn w-[10em] bg-text"
        onClick={() => {
          document.getElementById("date-form").showModal();
        }}
      >
        Make a Date
      </button>
      <dialog id="date-form" className="modal">
        <div className="modal-box flex flex-col items-center rounded-2xl bg-text">
          <form
            method="dialog"
            className="flex  w-96 w-full flex-col justify-center justify-items-center p-[20px] text-accent"
          >
            <button className="btn btn-circle btn-ghost btn-sm absolute right-5 top-5 ">
              ✕
            </button>
            <label className="mb-[5px]">Date :</label>
            <input
              className="mb-[15px] mr-[15px] w-[15em] rounded-md bg-background  px-2"
              type="text"
              name="title"
              value={title}
              placeholder="What're yall doing?"
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
            <label className="mb-[5px]">Things needed :</label>
            <div className="input-button">
              <input
                className="mb-[15px] mr-[15px] w-[15em] rounded-md bg-background px-2"
                type="text"
                name="newItem"
                value={newItem}
                placeholder="What do you need to bring?"
                onChange={(e) => {
                  setNewItem(e.target.value);
                }}
              />
              <button
                className="rounded-full bg-background px-[7px] font-black"
                onClick={handleSubmit}
              >
                +
              </button>
            </div>
            {items.length === 0 && (
              <p className="text-s mt-[-15px] text-red-700">Must fill up</p>
            )}
            <ul>
              {items.map((items) => {
                return (
                  <li
                    key={items.id}
                    className="mb-[15px] flex justify-between  rounded-md bg-background px-2 py-1"
                  >
                    <label className="mr-[15px]">{items.title}</label>
                    <button onClick={() => deleteItem(items.id)}>Delete</button>
                  </li>
                );
              })}
            </ul>
            <div className="date-for-date mt-[15px]">
              <label className="mr-[5px]">Date for date :</label>
              <input
                type="date"
                className="mb-2 w-[10em] rounded-md border-[1px] bg-background px-2"
                id="date"
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                }}
              />
            </div>
            <div className="time mt-[15px]">
              <label className="mr-[5px]">Time :</label>
              <input
                type="time"
                className="mb-2 w-[10em] rounded-md border-[1px] bg-background px-2"
                id="time"
                value={time}
                onChange={(e) => {
                  setTime(e.target.value);
                }}
              />
            </div>
            <button
              className="submit-btn my-[20px] rounded-full bg-background px-[15px] disabled:bg-neutral-500 disabled:text-background"
              disabled={items.length === 0}
              onClick={writeData}
            >
              Submit
            </button>
          </form>
        </div>
      </dialog>
    </div>
  );
}