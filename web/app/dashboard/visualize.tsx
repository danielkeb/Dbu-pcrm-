import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

Chart.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

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

  const barData = {
    labels: ['Students', 'Staff', 'Guests'],
    datasets: [
      {
        label: 'Male',
        data: [data.numberOfMaleStudent, data.numberOfMaleStaff, data.numberOfMaleGuest],
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
      {
        label: 'Female',
        data: [data.numberOfFemaleStudent, data.numberOfFemaleStaff, data.numberOfFemaleGuest],
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
    ],
  };

  const pieData = {
    labels: ['DBU Staff Female', 'DBU Staff Male', 'Personal PC Female', 'Personal PC Male'],
    datasets: [
      {
        data: [data.numberFemaleStaffDbu, data.maleNumberOfStaffDbu, data.numberFemaleStaffPersonal, data.numberMaleStaffPersonal],
        backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(75, 192, 192, 0.6)', 'rgba(153, 102, 255, 0.6)'],
      },
    ],
  };

  return (
    <div className="p-6 bg-blue-100 rounded-lg shadow-md">
      <h2 className="text-blue-600 text-2xl font-bold mb-4">User Visualization</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-blue-500 font-bold">Total PC Users</h3>
          <p>{data.totalNumberOfPcuser}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-blue-500 font-bold">Students vs Staff vs Guests</h3>
          <Bar data={barData} options={{ responsive: true }} />
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-blue-500 font-bold">DBU Pc vs Personal PC</h3>
          <div className="w-64 h-64 mx-auto">
            <Pie data={pieData} options={{ responsive: true }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Visualization;
