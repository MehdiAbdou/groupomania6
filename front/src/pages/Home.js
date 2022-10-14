import React, { useContext } from "react";
import { UidContext } from "../components/AppContext";
import NewPostForm from "../components/Post/NewPostForm";
import Thread from "../components/Thread";
import Log from "../components/Log";
import LeftNav from "../components/LeftNav";

const Home = () => {
  const uid = useContext(UidContext);
  return (
    <div className="home" role="main" aria-label="Page d'accueil">
      <LeftNav />
      <div className="main">
        <div className="home-header">
          {uid ? <NewPostForm /> : <Log signin={true} signup={false} />}
        </div>
        <Thread />
      </div>
    </div>
  );
};

export default Home;