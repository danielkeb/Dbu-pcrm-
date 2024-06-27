import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { useAppContext } from '@/components/UserContext';

Chart.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Visualization: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [security, setSecurity] = useState<any>(null);
  const { decodedToken } = useAppContext();

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

  const fetchSecurity = async () => {
    try {
      const response = await axios.get('http://localhost:3333/auth/get');
      setSecurity(response.data);
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
    fetchSecurity();
  }, []);

  if (!data || !security) {
    return <div>Loading...</div>;
  }

  const barData = {
    labels: ['Students', 'Staff', 'Guests'],
    datasets: [
      {
        label: 'Male',
        data: [data.numberOfMaleStudent, data.numberOfMaleStaff, data.maleGuest],
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
      {
        label: 'Female',
        data: [data.numberOfFemaleStudent, data.numberOfFemaleStaff, data.femaleGuest],
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
    ],
  };

  const totalData = {
    labels: ['Students', 'Staff', 'Guests'],
    datasets: [
      {
        label: `Total: ${data.totalNumberOfPcuser}`,
        data: [data.NumberOfstudent, data.totalNumberOfStaff, data.totalNumberOfGuest],
        backgroundColor: ['rgba(54, 62, 135, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(75, 192, 192, 0.6)'],
      },
    ],
  };

  const pieData = {
    labels: ['DBU Pc Female', 'DBU Pc Male', 'Personal PC Female', 'Personal PC Male'],
    datasets: [
      {
        data: [data.femaleStaffDbu, data.maleNumberOfStaffDbu, data.femaleStaffPersonal, data.maleStaffPersonal],
        backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(75, 192, 192, 0.6)', 'rgba(153, 102, 255, 0.6)'],
      },
    ],
  };

  const pieSecurity = {
    labels: ['Total security', 'Male Security', 'Female security', 'Active security', 'In active security'],
    datasets: [
      {
        data: [security.totalUsers, security.maleUsers, security.femaleUsers, security.activeUsers, security.inactiveUsers],
        backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(75, 192, 192, 0.6)', 'rgba(153, 102, 255, 0.6)'],
      },
    ],
  };

  return (
    <div className="p-6 bg-blue-100 rounded-lg shadow-md">
      <h2 className="text-blue-600 text-2xl font-bold mb-4">User Visualization</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-blue-500 font-bold">Total Users: {data.totalNumberOfPcuser}</h3>
          <Bar data={totalData} options={{ responsive: true }} />
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
        {decodedToken?.role == "admin" ? (
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-blue-500 font-bold">DBU Security Users</h3>
            <div className="w-64 h-64 mx-auto">
              <Pie data={pieSecurity} options={{ responsive: true }} />
            </div>
          </div>
        ):(
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-blue-500 font-bold">DBU Security Users</h3>
              <div className="w-64 h-64 mx-auto">
                <Bar data={pieSecurity} options={{ responsive: true }} />
              </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default Visualization;
