import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout, registerAdmin } from "../actions/userActions";

function AdminPage(props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const adminRegister = useSelector((state) => state.adminRegister);
  const { loading, success, error } = adminRegister;

  const userInfo = useSelector((state) => state.userSignin);

  useEffect(() => {
    if (userInfo.userInfo === null || !userInfo.userInfo.isAdmin) {
      props.history.push("/");
    }

    return () => {};
  }, [userInfo.userInfo, userInfo.userInfo.isAdmin]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(registerAdmin({ name, email, password }));
  };

  const handleLogout = () => {
    dispatch(logout());
    props.history.push("signin");
  };

  return (
    <div>
      <div className="form">
        <form onSubmit={submitHandler}>
          <ul className="form-container">
            <li>
              <h2>Create an Administrator</h2>
            </li>
            <li>
              {loading && <div>Registering...</div>}
              {error && <div>{error}</div>}
              {success && <div>Admin Created Successfully</div>}
            </li>
            <li>
              <label htmlFor="name">Name</label>
              <input
                value={name}
                type="name"
                id="name"
                onChange={(e) => setName(e.target.value)}
              ></input>
            </li>
            <li>
              <label htmlFor="email">Email</label>
              <input
                value={email}
                type="email"
                id="email"
                onChange={(e) => setEmail(e.target.value)}
              ></input>
            </li>
            <li>
              <label htmlFor="password">Password</label>
              <input
                value={password}
                type="password"
                id="password"
                onChange={(e) => setPassword(e.target.value)}
              ></input>
            </li>
            <li>
              <button type="submit" className="button primary">
                Register Admin
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={handleLogout}
                className="button secondary full-width"
              >
                Logout
              </button>
            </li>
          </ul>
        </form>
      </div>
    </div>
  );
}

export default AdminPage;
