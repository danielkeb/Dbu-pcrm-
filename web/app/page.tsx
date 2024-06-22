"use client"

import { AppWrapper } from "@/components/UserContext";
import DrawerAppBar from "./landing";


export default function Home() {
  return (
    <main >
      <div >
        {/* <Login/> */}
        <AppWrapper><DrawerAppBar/></AppWrapper>
        
      </div>
    </main>
  );
}
