"use client"

import DrawerAppBar from "./landing";
import Login from "./login";


export default function Home() {
  return (
    <main >
      <div >
        {/* <Login/> */}
        <DrawerAppBar/>
      </div>
    </main>
  );
}
