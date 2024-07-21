import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Grid from '@mui/material/Grid';
import { TableCell, Button } from '@mui/material';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

export default function MobileDietMeal({
  meal,
  data,
  handleEditFood,
  handleDeleteFoodlModal
}) {
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

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
          <Accordion key={food.id} expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
            >
              <Typography variant='h6' sx={{ width: '60%', flexShrink: 0 }}>
                {food?.foodInfo.food_name}
              </Typography>
              <TableCell sx={{ border: 0, width: '40%', display: 'flex', justifyContent: 'flex-end' }}>
                <Button onClick={() => { handleEditFood(food, activeServings) }}>
                  <ModeEditIcon fontSize='20px' />
                </Button>
                <Button onClick={() => { handleDeleteFoodlModal(food) }}>
                  <DeleteForeverIcon fontSize='20px' color="error" />
                </Button>
              </TableCell>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={3}>
                  <Typography color={"primary"} variant="h6" align="center">Calories</Typography>
                  <Typography variant="body1" align="center">{activeServings?.calories}</Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography color={"primary"} variant="h6" align="center">Carbs</Typography>
                  <Typography variant="body1" align="center">{activeServings?.carbohydrate}</Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography color={"primary"} variant="h6" align="center">Protein</Typography>
                  <Typography variant="body1" align="center">{activeServings?.protein}</Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography color={"primary"} variant="h6" align="center">Fat</Typography>
                  <Typography variant="body1" align="center">{activeServings?.fat}</Typography>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </div>
  );
}

