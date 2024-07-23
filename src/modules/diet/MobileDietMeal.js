import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Grid from '@mui/material/Grid';
import { TableCell, Button, Tooltip } from '@mui/material';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

const ArrordionMap = ({ food, activeServings, handleEditFood, handleDeleteFoodlModal }) => {
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  }
  return (
  
  <Accordion key={food.id} expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
    <AccordionSummary

      expandIcon={<ExpandMoreIcon />}
      aria-controls="panel1bh-content"
      id="panel1bh-header"
    >
      <Typography variant='h6' sx={{ width: '100%', flexShrink: 0 }}>
        {food?.foodInfo.food_name}

      </Typography>

    </AccordionSummary>
    <AccordionDetails>

      <Grid container spacing={2}>
        <Grid item xs={6} lg={3}>
          <Typography color={"primary"} sx={{ fontSize: '1.2rem', fontWeight: 'bold' }} align="center">Cals</Typography>
          <Typography sx={{ fontSize: '1rem', }} variant="body1" align="center">{activeServings?.calories}</Typography>
        </Grid>
        <Grid item xs={6} lg={3}>
          <Typography color={"primary"} sx={{ fontSize: '1.2rem', fontWeight: 'bold' }} align="center">Carbs</Typography>
          <Typography sx={{ fontSize: '1rem', }} variant="body1" align="center">{activeServings?.carbohydrate}</Typography>
        </Grid>
        <Grid item xs={6} lg={3}>
          <Typography color={"primary"} sx={{ fontSize: '1.2rem', fontWeight: 'bold' }} align="center">Protein</Typography>
          <Typography sx={{ fontSize: '1rem', }} variant="body1" align="center">{activeServings?.protein}</Typography>
        </Grid>
        <Grid item xs={6} lg={3}>
          <Typography color={"primary"} sx={{ fontSize: '1.2rem', fontWeight: 'bold' }} align="center">Fat</Typography>
          <Typography sx={{ fontSize: '1rem', }} variant="body1" align="center">{activeServings?.fat}</Typography>
        </Grid>
      </Grid>
      <div style={{ display: 'flex', justifyContent: 'center', }}>
        <Tooltip title="Edit Food" arrow>
          <Button fullWidth onClick={() => { handleEditFood(food, activeServings) }}>
            <ModeEditIcon />
          </Button>
        </Tooltip>
        <Tooltip title="Delete Food" arrow>

          <Button fullWidth onClick={() => { handleDeleteFoodlModal(food) }}>
            <DeleteForeverIcon color="error" />
          </Button>
        </Tooltip>
      </div>
    </AccordionDetails>
  </Accordion>)
}


export default function MobileDietMeal({
  meal,
  data,
  handleEditFood,
  handleDeleteFoodlModal
}) {
  const [expanded, setExpanded] = React.useState(false);


  return (
    <div>
      {meal.Diet_Meals_FoodList.map((food) => {
        let activeServings;
        if (food.is_custom) {
          activeServings = food.custom_serving;
        } else {
          activeServings = food.foodInfo.servings.serving.filter((serve) => serve.serving_id === JSON.stringify(food.serving_id))[0];
        }
        if (!activeServings) return null;

        return (
          <ArrordionMap
            key={food.id}
            food={food}
            activeServings={activeServings}
            handleEditFood={handleEditFood}
            handleDeleteFoodlModal={handleDeleteFoodlModal}
          />
        );
      })}
    </div>
  );
}

