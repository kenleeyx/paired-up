//-----------React-----------//
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

//-----------Firebase-----------//
import { auth, database } from "../../firebase/firebase";
import {
  ref,
  child,
  get,
  query,
  orderByChild,
  equalTo,
} from "firebase/database";
//-----------Components-----------//
import ContextHelper from "../Helpers/ContextHelper";

//-----------Media-----------//
import heart from "../../Images/heart.gif";
import person1 from "../../Images/LogosIcons/person1.png";
import person2 from "../../Images/LogosIcons/person2.png";

const CoupleDetails = () => {
  //Import display photos
  const pairKey = ContextHelper("pairKey");
  const [days, setDays] = useState(null);
  const [displayName1, setDisplayName1] = useState("");
  const [displayName2, setDisplayName2] = useState("");
  const [profilePicture1, setProfilePicture1] = useState(null);
  const [profilePicture2, setProfilePicture2] = useState(null);

  //Pull Display Names of both users from userRef
  useEffect(() => {
    const dbRef = ref(database, "userRef");
    const pairKeyQuery = query(
      dbRef,
      orderByChild("pairKey"),
      equalTo(pairKey),
    );

    const displayNames = [];
    const profilePictures = [];

    try {
      get(pairKeyQuery)
        .then((snapshot) => {
          if (snapshot.exists()) {
            // Loop through the matching user data
            snapshot.forEach((childSnapshot) => {
              const userData = childSnapshot.val();
              const displayName = userData.displayName;
              displayNames.push(displayName);
              const profilePicture = userData.profilePicture;
              profilePictures.push(profilePicture);
            });

            setDisplayName1(displayNames[0]);
            setDisplayName2(displayNames[1]);
            setProfilePicture1(profilePictures[0]);
            setProfilePicture2(profilePictures[1]);
          } else {
            console.log("User not found");
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [pairKey]);

  //Pull start date from couple's room
  useEffect(() => {
    if (pairKey) {
      console.log("Pairkey", pairKey);
      const roomRef = ref(database, `rooms/${pairKey}`);
      const dateQuery = child(roomRef, "startDate");
      get(dateQuery).then((snapshot) => {
        if (snapshot.exists()) {
          setDays(daysTogether(snapshot.val()));
        } else {
          console.log("Issue Pulling Start Date");
        }
      });
    }
  }, [pairKey]);

  //Calculate number of days together
  const daysTogether = (startDate) => {
    const currentDate = new Date();
    const parsedStartDate = new Date(startDate);
    const timeDifference = currentDate - parsedStartDate;
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    return daysDifference;
  };

  return (
    <article className="flex w-1/2 min-w-[16em] max-w-[28em] flex-col items-center rounded-xl bg-white bg-opacity-80 p-2 shadow-lg hover:translate-y-[-2px] hover:shadow-window ">
      <div className="flex flex-row">
        <img
          src={profilePicture1 ? profilePicture1 : person1}
          alt="person1"
          className="h-[4em] w-[4em] rounded-full object-contain"
        />
        <img src={heart} alt="heartbeat" className=" h-[4em] w-[4em]"></img>
        <img
          src={profilePicture2 ? profilePicture2 : person2}
          alt="person2"
          className="h-[4em] w-[4em] rounded-full object-contain"
        />
      </div>

      {pairKey ? (
        <>
          <h1 className="text-center text-[0.8em] sm:text-[1em]">
            {displayName1 + " & " + displayName2}
          </h1>

          <h1 className="text-center text-[2em] font-bold leading-none sm:text-[2.6em]">
            {days} days
          </h1>
          <p className="text-[1em]">Together</p>
        </>
      ) : (
        <NavLink to="/onboarding" className="animate-bounce text-[1.2em]">
          Click here to Sign In!
        </NavLink>
      )}
    </article>
  );
};

export default CoupleDetails;
