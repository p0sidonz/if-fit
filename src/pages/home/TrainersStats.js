import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

const TrainersStats = ({ data }) => {
  // Prepare data for charts
  const subscriptionsPerUser = data.map(user => ({
    name: `${user.userInfo.first_name} ${user.userInfo.last_name}`,
    subscriptions: user.userInfo.UserAndTrainerSubscription.length,
    diets: user.Assigned_Diet.length,
    programs: user.Assigned_Program.length,
  }));

  // Timeline Data
  const timelineData = [];
  data.forEach(user => {
    user.userInfo.UserAndTrainerSubscription.forEach(sub => {
      timelineData.push({ name: sub.packageInfo.title, date: new Date(sub.start_date).toDateString() });
    });
    user.Assigned_Diet.forEach(diet => {
      timelineData.push({ name: diet.dietInfo.title, date: new Date(diet.created_at).toDateString() });
    });
    user.Assigned_Program.forEach(program => {
      timelineData.push({ name: program.programInfo.title, date: new Date(program.created_at).toDateString() });
    });
  });

  return (
    <div>
      <h2>Subscriptions, Diets, and Programs per User</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={subscriptionsPerUser}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="subscriptions" fill="#8884d8" />
          <Bar dataKey="diets" fill="#82ca9d" />
          <Bar dataKey="programs" fill="#ffc658" />
        </BarChart>
      </ResponsiveContainer>

      <h2>Timeline of Activities</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={timelineData}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="name" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrainersStats;