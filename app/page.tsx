import Image from "next/image";
import { Data } from "./dt.js";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>List of Items </h1>
      <div className="flex-1">
        <Data />
      </div>
    </main>
  );
}
