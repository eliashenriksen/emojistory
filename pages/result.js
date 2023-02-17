import Layout from "@/components/Layout/Layout";
import { useEffect, useState } from "react";

export default function Result() {

  const [results, setResults] = useState("");

  useEffect(() => {
    setResults(sessionStorage.getItem("emojiArray"));
    console.log(results);
  })

  return (
    <Layout>
      <div>{results}</div>
    </Layout>
  )
}