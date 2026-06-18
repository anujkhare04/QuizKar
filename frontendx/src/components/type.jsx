import React, { useEffect, useState } from "react";

const text =
  "Hey, welcome! Looking for something fun but actually useful? You’re in the right place. " +
  "Here you can create your own quizzes, play instant AI-generated challenges, and test yourself in timed, practice, or sudden-death modes. " +
  "Want to compete with friends? Go for it. Want to improve quietly at your own pace? That works too. " +
  "Every attempt helps you learn faster, and your dashboard tracks progress so you can see real growth, not just random scores. " +
  "So tell me, are we warming up with a quick round, or jumping straight into a serious challenge?";

export default function TypeText() {
  const [out, setOut] = useState("");

  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      setOut(text.slice(0, i + 1));
      i++;
      if (i === text.length) clearInterval(id);
    }, 10); 
    return () => clearInterval(id);
  }, []);

  return <p className="f3 text-white/80">{out}</p>;
}
