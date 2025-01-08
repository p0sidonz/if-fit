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

const FoodAccordion = ({ food, activeServings, handleEditFood, handleDeleteFoodModal }) => {
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const nutritionItems = [
    { label: 'Cals', value: activeServings?.calories },
    { label: 'Carbs', value: activeServings?.carbohydrate },
    { label: 'Protein', value: activeServings?.protein },
    { label: 'Fat', value: activeServings?.fat },
  ];

  return (
    <Accordion 
      key={food.id} 
      expanded={expanded === 'panel1'} 
      onChange={handleChange('panel1')}
      sx={{
        '&:before': {
          display: 'none',
        },
        boxShadow: 'rgba(0, 0, 0, 0.04) 0px 3px 5px',
        mb: 1
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1bh-content"
        id="panel1bh-header"
        sx={{
          '& .MuiAccordionSummary-content': {
            margin: '12px 0',
          }
        }}
      >
        <Typography 
          variant='h6' 
          sx={{ 
            width: '100%', 
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            fontWeight: 500,
            '& .serving-info': {
              color: 'text.secondary',
              fontSize: '0.9em',
              marginLeft: '4px'
            }
          }}
        >
          {food?.foodInfo.food_name}
          {(activeServings?.metric_serving_amount || activeServings?.metric_serving_unit) && (
            <span className="serving-info">
              {`${activeServings?.metric_serving_amount || ''} ${activeServings?.metric_serving_unit || ''}`}
            </span>
          )}
        </Typography>
      </AccordionSummary>

      <AccordionDetails sx={{ pb: 2 }}>
        <Grid 
          container 
          spacing={2} 
          sx={{ 
            mb: 2,
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

        <div style={{ 
          display: 'flex', 
          justifyContent: 'center',
          gap: '8px'
        }}>
          <Tooltip title="Edit Food" arrow>
            <Button 
              onClick={() => handleEditFood(food, activeServings)}
              sx={{
                minWidth: '120px',
                '&:hover': {
                  backgroundColor: 'action.hover'
                }
              }}
            >
              <ModeEditIcon />
            </Button>
          </Tooltip>
          <Tooltip title="Delete Food" arrow>
            <Button 
              onClick={() => handleDeleteFoodModal(food)}
              sx={{
                minWidth: '120px',
                '&:hover': {
                  backgroundColor: 'error.light'
                }
              }}
            >
              <DeleteForeverIcon color="error" />
            </Button>
          </Tooltip>
        </div>
      </AccordionDetails>
    </Accordion>
  );
};

export default function MobileDietMeal({
  meal,
  data,
  handleEditFood,
  handleDeleteFoodModal
}) {
  return (
    <div style={{ padding: '8px 0' }}>
      {meal.Diet_Meals_FoodList.map((food) => {
        const activeServings = food.is_custom
          ? food.custom_serving
          : food.foodInfo.servings.serving.find((serve) => serve.serving_id === food.serving_id);

        if (!activeServings) return null;
        
        return (
          <FoodAccordion
            key={food.id}
            food={food}
            activeServings={activeServings}
            handleEditFood={handleEditFood}
            handleDeleteFoodModal={handleDeleteFoodModal}
          />
        );
      })}
    </div>
  );
}

