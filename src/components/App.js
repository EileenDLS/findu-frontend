import React, { useState } from "react"; 
import TopBar from "./TopBar";  // default export, only its one, so don't need {}
import Main from "./Main";

import { TOKEN_KEY } from "../constants"; // export, no default 

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    //这里有个bug，系统不会自动登出，但是这个token会过期，然后加载不出来内容，但是又还在登录后页面的状态
    localStorage.getItem(TOKEN_KEY) ? true : false
  );

  const logout = () => {
    console.log("log out");
    localStorage.removeItem(TOKEN_KEY);
    setIsLoggedIn(false);
  };

  const loggedIn = (token) => {
    if (token) {
      // store token at local and set login status to true
      localStorage.setItem(TOKEN_KEY, token);
      setIsLoggedIn(true);
    }
  };
  return (
    <div className="App">
      <TopBar isLoggedIn={isLoggedIn} handleLogout={logout} />
      <Main isLoggedIn={isLoggedIn} handleLoggedIn={loggedIn} />
    </div>
  );
}

export default App;