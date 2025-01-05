import { createContext, useEffect } from "react";

import { useState } from "react";
export const AppContext = createContext();
import { toast } from "react-toastify";
import axios from "axios";
// export const AppContextProvider = (props) => {
//   const backendUrl = "http://localhost:4000";
//   const [isLoggedin, setIsLoggedin] = useState(false);
//   const [userData, setUserData] = useState(false);

//   const getUserData = async () => {
//     try {
//       axios.defaults.withCredentials = true;
//       const { data } = await axios.get(backendUrl + "/api/user/data");
//       console.log("data ", data);
//       data.success ? setUserData(data.userData) : toast.error(data.message);
//       console.log("data", data);
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };
//   const getAuthState = async () => {
//     try {
//       axios.defaults.withCredentials = true;
//       const { data } = await axios.get(backendUrl + "/api/auth/is-auth");
//       if (data.success) {
//         setIsLoggedin(true);
//         getUserData();
//       }
//     } catch (error) {
//       console.log("error", error);
//       toast.error(error.message);
//     }
//   };

//   useEffect(() => {
//     getAuthState();
//   }, []);
//   const value = {
//     backendUrl,
//     isLoggedin,
//     setIsLoggedin,
//     userData,
//     setUserData,
//     getUserData,
//   };
//   return <AppContext.Provider value={value}>{props.children}</AppContext.Provider>;
// };

import PropTypes from "prop-types";

export const AppContextProvider = (props) => {
  // const backendUrl = "https://authentication-b13b.onrender.com";
  const backendUrl =
    "https://authentication-79mq-hfvht8r8u-nitesh4256s-projects.vercel.app";
  // const backendUrl = "http://localhost:4000";
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(false);

  const getUserData = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.get(backendUrl + "/api/user/data");
      console.log("data ", data);
      data.success ? setUserData(data.userData) : toast.error(data.message);
      console.log("data", data);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getAuthState = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.get(backendUrl + "/api/auth/is-auth");
      if (data.success) {
        setIsLoggedin(true);
        getUserData();
      }
    } catch (error) {
      console.log("error", error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    // getAuthState();
  }, [isLoggedin]);

  const value = {
    backendUrl,
    isLoggedin,
    setIsLoggedin,
    userData,
    setUserData,
    getUserData,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

// PropTypes validation
AppContextProvider.propTypes = {
  children: PropTypes.node.isRequired, // Ensures 'children' is required and is a valid React node (anything renderable in JSX)
};
