import React, { useContext } from "react";
import Log from "../components/Log";
import { UidContext } from "../components/AppContext";


const Profile = () => {
  const uid = useContext(UidContext);

  return (
    <div className="profil-page">
      {uid ? ( //Si j'ai déjà l'uid attribué, j'affiche la page profil de l'usilisateur
         <h1>UPATADE PROFIL</h1>
      ) : (
        //Sinon, je propose la connexion
        <div className="log-container">
          <Log signin={false} signup={true} />
          
        </div>
      )}
    </div>
  );
};

export default Profile;
