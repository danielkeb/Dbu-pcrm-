import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Visualization: React.FC = () => {
  const [data, setData] = useState<any>(null);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3333/pcuser/visualize');
      setData(response.data);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('Request canceled:', error.message);
      } else {
        console.error('Error fetching data:', error);
      }
    }
  };
  
  useEffect(() => {
    fetchData();
  }, []);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 bg-blue-100 rounded-lg shadow-md">
      <h2 className="text-blue-600 text-2xl font-bold mb-4">User Visualization</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-blue-500 font-bold">Total PC Users</h3>
          <p>{data.totalNumberOfPcuser}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-blue-500 font-bold">Total Students</h3>
          <p>{data.NumberOfstudent}</p>
          <h4 className="text-blue-400 font-semibold">Female Students</h4>
          <p>{data.numberOfFemaleStudent}</p>
          <h4 className="text-blue-400 font-semibold">Male Students</h4>
          <p>{data.numberOfMaleStudent}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-blue-500 font-bold">Total Staff</h3>
          <p>{data.totalNumberOfStaff}</p>
          <h4 className="text-blue-400 font-semibold">Female Staff</h4>
          <p>{data.numberOfFemaleStaff}</p>
          <h4 className="text-blue-400 font-semibold">Male Staff</h4>
          <p>{data.numberOfMaleStaff}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-blue-500 font-bold"> Dbu pc</h3>
          <h4 className="text-blue-400 font-semibold">Female</h4>
          <p>{data.numberFemaleStaffDbu}</p>
          <h4 className="text-blue-400 font-semibold">Male</h4>
          <p>{data.numberMaleStaffDbu}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-blue-500 font-bold">Personal Pc</h3>
          <h4 className="text-blue-400 font-semibold">Female</h4>
          <p>{data.numberFemaleStaffPersonal}</p>
          <h4 className="text-blue-400 font-semibold">Male</h4>
          <p>{data.numberMaleStaffPersonal}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-blue-500 font-bold"> Total Guests</h3>
          <p>{data.numberOfFemaleGuest }+{data.numberOfMaleGuest}</p>
          <h4 className="text-blue-400 font-semibold">Female</h4>
          <p>{data.numberOfFemaleGuest}</p>
          <h4 className="text-blue-400 font-semibold">Male</h4>
          <p>{data.numberOfMaleGuest}</p>
        </div>
      </div>
    </div>
  );
};

export default Visualization;
