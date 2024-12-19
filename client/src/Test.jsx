import React, { useState } from "react";

function Test() {
  const [message, setMessage] = useState("");

  const testProxy = async () => {
    try {
      const response = await fetch("/api/auth/test"); // Proxy will redirect this to http://localhost:5000/test
      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      console.error("Error fetching API:", error);
      setMessage("Proxy test failed!");
    }
  };

  return (
    <div>
      <h1>Test Vite Proxy</h1>
      <button onClick={testProxy}>Test Proxy</button>
      <p>{message}</p>
    </div>
  );
}

export default Test;
