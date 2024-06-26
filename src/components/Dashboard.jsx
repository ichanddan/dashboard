// src/components/Dashboard.js
import React, { useEffect, useState } from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { loadData } from './dataLoader';
import '../chartConfig';  // Ensure this import is added

const Dashboard = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await loadData()
        if (Array.isArray(data)) {
          setAlerts(data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Data transformation functions
  const getAlertCountsBySignature = () => {
    const counts = {};
    alerts.forEach(alert => {
      if (alert.alert && alert.alert.signature) {
        const signature = alert.alert.signature;
        counts[signature] = (counts[signature] || 0) + 1;
      }
    });
    return counts;
  };

  const getAlertCountsByCategory = () => {
    const counts = {};
    alerts.forEach(alert => {
      if (alert.alert && alert.alert.category) {
        const category = alert.alert.category;
        counts[category] = (counts[category] || 0) + 1;
      }
    });
    return counts;
  };

  const getAlertCountsBySeverity = () => {
    const counts = {};
    alerts.forEach(alert => {
      if (alert.alert && alert.alert.severity !== undefined) {
        const severity = alert.alert.severity;
        counts[severity] = (counts[severity] || 0) + 1;
      }
    });
    return counts;
  };

  const getAlertCountsByProtocol = () => {
    const counts = {};
    alerts.forEach(alert => {
      if (alert.proto) {
        const protocol = alert.proto;
        counts[protocol] = (counts[protocol] || 0) + 1;
      }
    });
    return counts;
  };

  const getAlertCountsBySrcIp = () => {
    const counts = {};
    alerts.forEach(alert => {
      if (alert.src_ip) {
        const srcIp = alert.src_ip;
        counts[srcIp] = (counts[srcIp] || 0) + 1;
      } else {
        console.error("Missing src_ip in alert:", alert);
      }
    });
    return counts;
  };

  const getAlertCountsByTime = () => {
    const counts = {};
    alerts.forEach(alert => {
      if (alert.timestamp) {
        const time = new Date(alert.timestamp).getHours();
        counts[time] = (counts[time] || 0) + 1;
      } else {
        console.error("Missing timestamp in alert:", alert);
      }
    });
    return counts;
  };

  // Prepare data for charts
  const prepareChartData = (data, label) => {
    return {
      labels: Object.keys(data),
      datasets: [{
        label: label,
        data: Object.values(data),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      }],
    };
  };

  return (
    <div className='bg-black text-white'>
      <h1 className='flex items-center justify-center mt-5 mb-10 text-4xl font-bold'>Dashboard</h1>
      <div>
        <h2 className='my-10 text-2xl font-bold'>Alerts by Signature</h2>
        <Bar data={prepareChartData(getAlertCountsBySignature(), 'Alerts by Signature')} />
      </div>
      <div className='w-1/2'>
        <h2 className='my-10 text-2xl font-bold'>Alerts by Category</h2>
        <div className='flex justify-center items-center'>
        <Pie data={prepareChartData(getAlertCountsByCategory(), 'Alerts by Category')} />
        </div>
      </div>
      <div>
        <h2 className='my-10 text-2xl font-bold'>Alerts by Severity</h2>
        <Bar data={prepareChartData(getAlertCountsBySeverity(), 'Alerts by Severity')} />
      </div>
      <div>
        <h2 className='my-10 text-2xl font-bold'>Alerts by Protocol</h2>
        <div className='w-1/2 flex items-center justify-center'>
        <Pie data={prepareChartData(getAlertCountsByProtocol(), 'Alerts by Protocol')} />
          
        </div>
      </div>
      <div>
        <h2 className='my-10 text-2xl font-bold'>Alerts by Source IP</h2>
        <Bar data={prepareChartData(getAlertCountsBySrcIp(), 'Alerts by Source IP')} />
      </div>
      <div>
        <h2 className='my-10 text-2xl font-bold'>Alerts by Time of Day</h2>
        <div className="bg-white p-4 rounded shadow-md">
          <Line data={prepareChartData(getAlertCountsByTime(), 'Alerts by Time of Day')} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
