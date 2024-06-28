"use client";

// import Security from "./index";

// const Page: React.FC = () => {
//   return <Security />;
// };
// export default Page;

// App.js
import React, { useState } from 'react';
import Register from './index';
import Manage from './manage';

const App = () => {
  const [selected, setSelected] = useState(true);

  return (
    <div className="w-full  flex flex-col mx-auto text-center ">
      <div className="w-[50%] rounded bg-white h-auto m-auto shadow flex flex-col p-8 pt-6 ">
        

        <div className="relative w-full mt-4 rounded-md border h-10 p-1 bg-gray-200">
          <div className="relative w-full h-full flex items-center">
            <div
              onClick={() => setSelected(true)}
              className="w-full flex justify-center text-gray-400 cursor-pointer"
            >
              <button>Register</button>
            </div>
            <div
              onClick={() => setSelected(false)}
              className="w-full flex justify-center text-gray-400 cursor-pointer"
            >
              <button>Manage</button>
            </div>
          </div>

          <span
            className={`bg-white shadow text-sm flex items-center justify-center w-1/2 rounded h-[1.88rem] transition-all duration-150 ease-linear top-[4px] absolute ${
              selected ? 'left-1 text-blue-500 font-semibold' : 'left-1/2 -ml-1 text-blue-500'
            }`}
          >
            {selected ? "Register Security" : "Manage Securitys"}
          </span>
        </div>
      </div>

      

      <div className="mt-4 w-full">
        {selected ? <Register /> : <Manage />}
      </div>
    </div>
  );
};

export default App;
