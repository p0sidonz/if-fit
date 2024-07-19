import React, { useState } from 'react';
import { Grid, Card, CardContent, Typography, Button, CardActions, Collapse, IconButton } from '@mui/material';
import { ExpandMore as ExpandMoreIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { styled } from '@mui/system';

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const MealsList = ({ meals, setSelectedMeal, setDrawerOpen, handleEdit, handleDelete }) => {
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };



  const MealTable = ({ meal, data }) => {
    console.log("Meal Table Data:", meal, data)

    return (
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  inputProps={{
                    'aria-label': 'select all foods',
                  }}
                />
              </TableCell>
              {headCells.map((headCell) => (
                <TableCell key={headCell.id}>
                  <TableSortLabel>{headCell.label}</TableSortLabel>
                </TableCell>
              ))}
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {meal.Diet_Meals_FoodList.map((food) => {
              let activeServings
              if (food.is_custom) {
                activeServings = food.custom_serving
              }
              else {
                activeServings = food.foodInfo.servings.serving.filter((serve) => serve.serving_id === JSON.stringify(food.serving_id))[0]
              }
              console.log("Active Servings:", food);
              return (
                <TableRow key={activeServings.id}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      inputProps={{
                        'aria-label': `select ${food.foodInfo.food_name}`,
                      }}
                    />
                  </TableCell>
                  <TableCell>{food.foodInfo.food_name}</TableCell>
                  <TableCell>{activeServings.protein}</TableCell>
                  <TableCell>{activeServings.carbohydrate}</TableCell>
                  <TableCell>{activeServings.fat}</TableCell>
                  <TableCell>{activeServings.calories}</TableCell>
                  <TableCell>{JSON.parse(activeServings.metric_serving_amount).toFixed(1)} {" "} {activeServings.measurement_description}</TableCell>
                  <TableCell>
                    <Button onClick={() => {
                      handleEditFood(food, activeServings)

                    }}><ModeEditIcon /></Button>
                    <Button onClick={handleDeleteFoodFromMeal}><DeleteForeverIcon color="error" /> </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  
  return (
    <Grid container spacing={2} justifyContent="center">
      {meals.map((meal) => (
        <Grid item xs={12} sm={6} lg={12} key={meal.id}>
          <Card>
            <CardContent>
              <Grid container justifyContent="space-between">
                <Typography variant="h5">{meal.title}</Typography>
                <ExpandMore
                  expand={expanded}
                  onClick={handleExpandClick}
                  aria-expanded={expanded}
                  aria-label="show more"
                >
                  <ExpandMoreIcon />
                </ExpandMore>
              </Grid>
              <Collapse in={expanded} timeout="auto" unmountOnExit>
                <Typography variant="body2" color="textSecondary" component="p">
                  {meal.description}
                </Typography>
                <MealTable meal={meal} data={meal.Diet_Meals_FoodList} />
                {/* 
                  {JSON.stringify(meal.Diet_Meals_FoodList.servings.serving.filter((serve) => serve.serving_id === meal.Diet_Meals_FoodList.serving_id))} 
                */}
              </Collapse>
            </CardContent>
            <CardActions disableSpacing>
              <Button
                variant="outlined"
                onClick={() => setDrawerOpen(true)}
              >
                Add Food
              </Button>
              <IconButton onClick={() => handleEdit(meal.id)}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => handleDelete(meal.id)}>
                <DeleteIcon />
              </IconButton>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default MealsList;