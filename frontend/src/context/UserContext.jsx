import React, { useState, useContext, createContext } from 'react';
import { userQuery } from '../utils/query';
import { client } from '../client';


const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const fetchUserInfo = (id) => {
    const query = userQuery(id);

    client.fetch(query)
      .then(data => {
        setUser(data[0])
      })
  }


  return (
    <UserContext.Provider value={{
      user,
      fetchUserInfo
    }} >
      {children}
    </UserContext.Provider>
  )
}

export default UserContext;