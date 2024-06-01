import { useEffect, useState } from "react";

const usePageTime = () => {
  const [startTime, setStartTime] = useState(Date.now());
  const [timeSpent, setTimeSpent] = useState(0);

  useEffect(() => {
    const handleUnload = () => {
      setTimeSpent((Date.now() - startTime) / 1000); // Time spent in seconds
    };

    window.addEventListener("beforeunload", handleUnload);

    const intervalId = setInterval(() => {
      setTimeSpent((Date.now() - startTime) / 1000); // Time spent in seconds
    }, 5000);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
      setTimeSpent((Date.now() - startTime) / 1000); // Ensure time is set on component unmount
      clearInterval(intervalId);
    };
  }, [startTime]);

  return timeSpent;
};

export default usePageTime;
