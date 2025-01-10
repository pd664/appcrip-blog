import Image from "next/image";
import Editor from "./components/Editor/Editor";
import HomeComp from './components/Home/Home';

export default function Home() {
  return (
    <div className="container w-100">
      <HomeComp />
      {/* <Editor /> */}
    </div>
  );
}
