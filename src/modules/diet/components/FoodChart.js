import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const aggregateNutritionData = (mealData) => {
    return mealData.reduce((acc, item) => {
        const servingData = item.is_custom ? item.custom_serving : item.foodInfo.servings.serving.find(s => s.serving_id == item.serving_id);
        const foodName = item.foodInfo.food_name;

        acc.push({
            name: foodName,
            Protein: parseFloat(servingData?.protein) || 0,
            Fat: parseFloat(servingData?.fat) || 0,
            Carbohydrates: parseFloat(servingData?.carbohydrate) || 0,
        });

        return acc;
    }, []);
};

const NutritionChart = ({ mealData, mealName }) => {
    const data = aggregateNutritionData(mealData);

    const totals = data.reduce((acc, item) => {
        acc.Protein += item.Protein;
        acc.Fat += item.Fat;
        acc.Carbohydrates += item.Carbohydrates;
        return acc;
    }, { Protein: 0, Fat: 0, Carbohydrates: 0 });

    return (
        <div>
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <h3>Total Nutritional Information</h3>
                <p>
                    <span style={{ color: '#FF6B6B' }}>Total Protein: {totals.Protein.toFixed(2)}g</span> |
                    <span style={{ color: '#4ECDC4' }}> Total Fat: {totals.Fat.toFixed(2)}g</span> |
                    <span style={{ color: '#45B7D1' }}> Total Carbohydrates: {totals.Carbohydrates.toFixed(2)}g</span>
                </p>
            </div>      <ResponsiveContainer width="100%" height={300}>
                <BarChart
                    layout="vertical"
                    data={data}
                    margin={{
                        top: 20,
                        right: 30,
                        left: 10,
                        bottom: 5,
                    }}
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
    );
};

export default NutritionChart;