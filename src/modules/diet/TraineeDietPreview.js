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
    // Calculate meal totals
    const mealTotals = meal.Diet_Meals_FoodList.reduce((acc, food) => {
        const servinfdsfsdfgs = food.is_custom
            ? food.custom_serving
            : food.foodInfo.servings.serving.find(serve => serve.serving_id === JSON.stringify(food.serving_id));
            const servings = food.is_custom
            ? food.custom_serving
            : food.foodInfo.servings.serving.find((serve) => serve.serving_id === food.serving_id);
        if (servings) {
            acc.calories += Number(servings.calories) || 0;
            acc.carbohydrate += Number(servings.carbohydrate) || 0;
            acc.protein += Number(servings.protein) || 0;
            acc.fat += Number(servings.fat) || 0;
        }
        return acc;
    }, { calories: 0, carbohydrate: 0, protein: 0, fat: 0 });

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" gutterBottom>{meal.title}</Typography>
                <Typography variant="body2" color="textSecondary">{meal.description}</Typography>
                
               
                {/* Meal Totals */}
                <Grid container spacing={2} sx={{ mt: 2, mb: 2 }}>
                    {Object.entries(mealTotals).map(([nutrient, value]) => (
                        <Grid item xs={6} sm={3} key={nutrient}>
                            <Typography color="primary" variant="subtitle1" align="center">
                                {nutrient.charAt(0).toUpperCase() + nutrient.slice(1)}
                            </Typography>
                            <Typography variant="h6" align="center">
                                {Math.round(value * 10) / 10}
                            </Typography>
                        </Grid>
                    ))}
                </Grid>

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
        : food.foodInfo.servings.serving.find(serve => serve.serving_id === food.serving_id);

    if (!activeServings) return null;

    const nutritionItems = [
        { label: 'Cals', value: activeServings?.calories },
        { label: 'Carbs', value: activeServings?.carbohydrate },
        { label: 'Protein', value: activeServings?.protein },
        { label: 'Fat', value: activeServings?.fat },
    ];

    const specialUnits = [
        'cup', 'diced', 'wedge', 'slice', 'piece',
        'small', 'medium', 'large',
        'whole', 'half', 'thigh'
    ];

    const hasSpecialUnit = (description) => {
        if (!description) return false;
        if (description.toLowerCase() === 'serving' || 
            description.toLowerCase().includes('g serving')) {
            return false;
        }
        return specialUnits.some(unit => description.toLowerCase().includes(unit));
    };

    const formatNumber = (num) => {
        return parseFloat(parseFloat(num).toFixed(3)).toString();
    };

    return (
        <Accordion sx={{
            '&:before': {
                display: 'none',
            },
            boxShadow: 'rgba(0, 0, 0, 0.04) 0px 3px 5px',
            mb: 1
        }}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                    '& .MuiAccordionSummary-content': {
                        margin: '12px 0',
                        flexDirection: 'column',
                        gap: 0.5
                    }
                }}
            >
                <Typography 
                    variant='h6' 
                    sx={{ 
                        width: '100%', 
                        flexShrink: 0,
                        fontWeight: 500
                    }}
                >
                    {food.foodInfo.food_name}
                </Typography>
                {activeServings && (
                    <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ 
                            fontSize: '0.9em'
                        }}
                    >
                        {hasSpecialUnit(activeServings.measurement_description)
                            ? `${formatNumber(activeServings.metric_serving_amount)}x ${activeServings.measurement_description}`
                            : `${formatNumber(activeServings.metric_serving_amount)}g`
                        }
                    </Typography>
                )}
            </AccordionSummary>
            <AccordionDetails>
                <Grid 
                    container 
                    spacing={2} 
                    sx={{ 
                        '& .MuiTypography-root': {
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                                transform: 'scale(1.05)',
                            }
                        }
                    }}
                >
                    {nutritionItems.map(({ label, value }) => (
                        <Grid item xs={6} lg={3} key={label}>
                            <Typography 
                                color="primary" 
                                sx={{ 
                                    fontSize: '1.2rem', 
                                    fontWeight: 'bold',
                                    textAlign: 'center'
                                }}
                            >
                                {label}
                            </Typography>
                            <Typography 
                                sx={{ 
                                    fontSize: '1rem',
                                    textAlign: 'center'
                                }}
                            >
                                {value}
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
                console.log("dietdsadf",JSON.parse(diet?.dietJson))
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

