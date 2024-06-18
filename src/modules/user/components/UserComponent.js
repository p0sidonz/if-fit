import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useUserData } from "../hooks/useUserData";
import { setUserDetails } from "../userSlice";
import InitUserComponent from "./init";
const UserComponent = () => {
  const dispatch = useDispatch();
  const { data, error, isLoading } = useUserData();
  const userDetails = useSelector((state) => state.user.details);

  useEffect(() => {
    if (data) {
      dispatch(setUserDetails(data));
    }
  }, [data, dispatch]);

  if (isLoading) return <div>Loading...</div>;
  if (error)
    return <div>Error loading user data {JSON.stringify(error.message)} </div>;

  return (
    <div>
      {/* <pre>{JSON.stringify(userDetails, null, 2)}</pre> */}
      <InitUserComponent />
    </div>
  );
};

export default UserComponent;
