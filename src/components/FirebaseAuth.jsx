import React, { useState } from "react";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";

const FirebaseAuth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  const handleSignup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <div style={{maxWidth: 350, margin: "2rem auto", padding: 24, border: "1px solid #eee", borderRadius: 12}}>
      <h2 style={{textAlign: "center"}}>Firebase Auth</h2>
      {user ? (
        <>
          <p>Welcome, <b>{user.email}</b></p>
          <button onClick={handleLogout} style={{width: "100%", marginTop: 12}}>Logout</button>
        </>
      ) : (
        <>
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={{width: "100%", marginBottom: 8, padding: 8}} />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} style={{width: "100%", marginBottom: 8, padding: 8}} />
          <button onClick={handleLogin} style={{width: "100%", marginBottom: 8}}>Login</button>
          <button onClick={handleSignup} style={{width: "100%"}}>Sign Up</button>
          {error && <p style={{color: "red", marginTop: 8}}>{error}</p>}
        </>
      )}
    </div>
  );
};

export default FirebaseAuth; 