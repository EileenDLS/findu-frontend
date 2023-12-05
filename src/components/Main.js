import React, { useState } from "react";
import { Route, Switch, Redirect } from "react-router";

import Login from "./Login";
import Register from "./Register";
import Home from "./Home";

function Main(props) {
    const { isLoggedIn, handleLoggedIn } = props;
    const showLogin = () => {
        return isLoggedIn ? (
          <Redirect to="/home" />
        ) : (
          <Login handleLoggedIn={handleLoggedIn} />
        );
    };

    const showHome = () => {
        // URL不改变：用component； URL改变：用Redirect to
        return isLoggedIn ? <Home /> : <Redirect to="/login" />;
    };

    return (
      <div className="main">
        {/* Switch中有不同的Route,根据path不同展示不同的component */}
        <Switch>
            {/* exact render： URL必须确切等于那个才展示，否则它会把后面的/login， /register之类的都cover了*/}
            {/* render: 跟逻辑； component：跟single component */}
            <Route path="/" exact render={showLogin} />
            <Route path="/login" render={showLogin} />
            <Route path="/register" component={Register} />
            <Route path="/home" render={showHome} />
        </Switch>
      </div>
    );
   }
   
   export default Main;
   