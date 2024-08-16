import React from 'react';
import {
    Card, CardContent, Typography, Grid, Accordion, AccordionSummary,
    AccordionDetails, Box
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useRouter } from "next/router";
import { useGetMealList, useGetMealListForUsers } from "./hooks/useDiet";
import { useEffect } from 'react';
import FoodSummaryInfo from "./components/FoodSummaryInfo";

const MealCard = ({ meal, chart }) => {
    console.log("MealCard", meal)
    return (
        <Card>
            <CardContent>
                <Typography variant="h5" gutterBottom>{meal.title}</Typography>
                <Typography variant="body2" color="textSecondary">{meal.description}</Typography>
                {/* {chart} */}
                <Box mt={2}>
                    <Typography variant="h6" gutterBottom>Foods</Typography>
                    {meal.Diet_Meals_FoodList.map((food) => (
                        <FoodItem key={food.id} food={food} />
                    ))}
                </Box>
            </CardContent>
        </Card>
    );
};

const FoodItem = ({ food }) => {
    const activeServings = food.is_custom
        ? food.custom_serving
        : food.foodInfo.servings.serving.find(serve => serve.serving_id === JSON.stringify(food.serving_id));

    if (!activeServings) return null;

    return (
        <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>{food.foodInfo.food_name}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Grid container spacing={2}>
                    {['Calories', 'Carbohydrate', 'Protein', 'Fat'].map((nutrient) => (
                        <Grid item xs={6} sm={3} key={nutrient}>
                            <Typography color="primary" variant="subtitle1" align="center">
                                {nutrient}
                            </Typography>
                            <Typography variant="h6" align="center">
                                {activeServings[nutrient.toLowerCase()]}
                            </Typography>
                        </Grid>
                    ))}
                </Grid>
            </AccordionDetails>
        </Accordion>
    );
};

const DietPlan = ({ meals }) => {
    return (
        <Grid container spacing={3}>
            {meals?.map((meal, index) => (
                <Grid item xs={12} key={index}>
                    <MealCard
                        meal={meal}
                    // chart={<FoodChart mealData={meal.Diet_Meals_FoodList} />}
                    />
                </Grid>
            ))}
        </Grid>
    );
};



const TraineeDietPreview = ({ param, relationId }) => {
    const [jsonDiet, setJsonDiet] = React.useState([]);
    let prm = { dietId: param, relationId }
    const { data: diet, isLoading, error, refetch } = useGetMealListForUsers(prm);
    useEffect(() => {
        if (diet) {
            if (diet.shoudsync) {
                setJsonDiet(diet?.dietInfo?.Diet_Meals)
            } else {
                console.log("dietdsadf", diet)
                try {
                    setJsonDiet(JSON.parse(diet?.dietJson))
                } catch (error) {
                    setJsonDiet(diet?.dietJson)
                }

            }
        }

    }, [diet]);


    useEffect(() => {
        refetch()
    }, [param]);



    if (error) return <p>Error: {error.message}</p>;

    if (isLoading) return <p>Loading...</p>;


    return (
        <>
            <DietPlan meals={jsonDiet} />
            <Card sx={{ mt: '1rem' }}>
                <CardContent>
                    <FoodSummaryInfo mealsData={jsonDiet} />

                </CardContent>
            </Card>
        </>
    )
}

export default TraineeDietPreview;

