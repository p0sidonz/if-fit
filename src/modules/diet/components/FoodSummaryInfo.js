import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useState } from 'react';

const COLORS = ['#93D965', '#4775ff', '#f32d12'];

const aggregateNutritionData = (mealData) => {
  return mealData.Diet_Meals_FoodList.map(item => {
    const servingData = item.is_custom ? item.custom_serving : item.foodInfo.servings.serving.find(s => s.serving_id == item.serving_id);
    return {
      name: item.foodInfo.food_name,
      Protein: parseFloat(servingData?.protein) || 0,
      Fat: parseFloat(servingData?.fat) || 0,
      Carbohydrates: parseFloat(servingData?.carbohydrate) || 0,
      Calories: parseFloat(servingData?.calories) || 0,
    };
  });
};

const NutritionChart = ({ mealsData }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const allMealsData = mealsData.flatMap(meal => aggregateNutritionData(meal));
  const totals = allMealsData.reduce((acc, item) => {
    acc.Protein += item.Protein;
    acc.Fat += item.Fat;
    acc.Carbohydrates += item.Carbohydrates;
    acc.Calories += item.Calories;
    return acc;
  }, { Protein: 0, Fat: 0, Carbohydrates: 0, Calories: 0 });

  const pieData = [
    { name: 'Protein', value: totals.Protein },
    { name: 'Fat', value: totals.Fat },
    { name: 'Carbohydrates', value: totals.Carbohydrates },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        {isExpanded && (
          <div style={{ width: '100%', marginBottom: '20px' }}>
            <ResponsiveContainer width="100%" height={300 + allMealsData.length * 30}>
              <BarChart
                layout="vertical"
                data={allMealsData}
                margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={120} />
                <Tooltip formatter={(value) => `${value.toFixed(2)}g`} />
                <Legend />
                <Bar dataKey="Protein" fill="#FF6B6B" name="Protein" barSize={20} />
                <Bar dataKey="Fat" fill="#4ECDC4" name="Fat" barSize={20} />
                <Bar dataKey="Carbohydrates" fill="#45B7D1" name="Carbohydrates" barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h3>Total Nutritional Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value.toFixed(2)}g`} />
            </PieChart>
          </ResponsiveContainer>
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            style={{
              marginTop: '10px',
              padding: '5px 10px',
              backgroundColor: '#f0f0f0',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            {isExpanded ? 'Hide Details' : 'Show Full Breakdown'}
          </button>
        </div>
      </div>
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <h3>Total Nutritional Information</h3>
        <p>
          <span style={{ fontWeight: 'bold' }}>Total Calories: {totals.Calories.toFixed(2)} kcal</span> |
          <span style={{ color: '#93D965' }}> Total Protein: {totals.Protein.toFixed(2)}g</span> |
          <span style={{ color: '#4775ff' }}> Total Fat: {totals.Fat.toFixed(2)}g</span> |
          <span style={{ color: '#f32d12' }}> Total Carbohydrates: {totals.Carbohydrates.toFixed(2)}g</span>
        </p>
      </div>
    </div>
  );
};

export default NutritionChart;

