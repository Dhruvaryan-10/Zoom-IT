import React, { useEffect, useState } from "react";
import { getPrediction } from "../services/api";

function Recommendations() {
  const [result, setResult] = useState(null);

  useEffect(() => {
    getPrediction("110001").then((data) => setResult(data));
  }, []);

  return (
    <div>
      <h2>Backend Connection Test</h2>
      {result ? (
        <pre>{JSON.stringify(result, null, 2)}</pre>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default Recommendations;
