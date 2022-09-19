import React from "react";
import { useSelector } from "react-redux";
import Loading from "./Loading";
/* import Toast from './Toast'; */

const Notify = () => {
  //const { authFetching } = useSelector(store => store.currentUser)
  //const { profileFetching } = useSelector(store => store.profile)
  //const { profilePostFetching } = useSelector(store => store.posts)
  const { usersFetching } = useSelector((store) => store.users);
  //console.log(message);

  return (
    <div>
      {usersFetching && <Loading />}
      {/*  <Loading /> */}
      {
        {
          /* authFetching && <Loading /> */
        }
      }
      {
        {
          /* profileFetching && <Loading /> */
        }
      }
      {
        {
          /* profilePostFetching && <Loading /> */
        }
      }
    </div>
  );
};

export default Notify;
