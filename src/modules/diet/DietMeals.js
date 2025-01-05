import React, { useState, useCallback, useEffect } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";
import { useSearchForFood, useGetFoodById, useGetMealList, useCreateNewMeal, useAddFoodToMeal, useUpdateMealFood, useDeleteMeal, useDeleteFood, useUpdateMeal, useCreateCustomFood, useGetCustomFoods } from "./hooks/useDiet";
import EditFoodDialog from "./EditFoodDialog";
import Tooltip from '@mui/material/Tooltip';
import axios from "../../utils/axios";
import { toast } from "react-hot-toast";

import {
  InputAdornment,
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  TableSortLabel,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CardActionArea,
  Collapse,
  IconButton,
  Hidden,
  Divider,
  Chip,
  Tabs,
  Tab
} from "@mui/material";
import NutritionValueDisplay from "./NutritionValueDisplay";
import LoadingButton from "@mui/lab/LoadingButton";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { ExpandMore as ExpandMoreIcon, Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { styled } from '@mui/system';
import MobileDietMeal from './MobileDietMeal';
import { FloatBarAction } from "../components/FloatBarAction";
import FoodChart from "./components/FoodChart";
import FoodSummaryInfo from "./components/FoodSummaryInfo";
import CustomFoodForm from "./components/CustomFoodForm";
const DietMeals = (props) => {
  console.log("props.param", props.param)

  const [foodId, setFoodId] = useState(null);
  const [meals, setMeals] = useState([]);
  const [newMeal, setNewMeal] = useState({ title: "", description: "" });
  const [updateMeal, setUpdateMeal] = useState({ title: "", description: "" });
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [foodSearch, setFoodSearch] = useState("");
  const [selectedFood, setSelectedFood] = useState(null);
  const [servingData, setServingData] = useState({}); // [ { id: 1, name: 'serving name', quantity: 100, unit: 'g' }
  const [open, setOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const { mutateAsync: createnNewMeal, isLoading: newMealLoading, error: newMealError, } = useCreateNewMeal();
  const { mutateAsync: addFoodToMeal, isLoading: addFoodToMealLoading, error: addFoodToMealError, } = useAddFoodToMeal();
  const { mutateAsync: updateMealFood, isLoading: updateMealFoodLoading, error: updateMealFoodError, } = useUpdateMealFood();
  const { mutateAsync: updateMeals, isLoading: updateMealLoading, error: updateMealError, } = useUpdateMeal();
  const { mutateAsync: deleteMeal, isLoading: deleteMealLoading, error: deleteMealError, } = useDeleteMeal();
  const { mutateAsync: deleteFood, isLoading: deleteFoodLoading, error: deleteFoodError, } = useDeleteFood();
  const [selectedMealDelete, setSelectedMealDelete] = useState(null);
  const [selectedFoodDelete, setSelectedFoodDelete] = useState(null);
  const { data: mealList, isLoading, error, refetch } = useGetMealList(props.param);
  //not surre about this
  const [showOtherData, setShowOtherData] = useState([]);

  {/* Food edit */ }
  const [openFoodEdit, setOpenFoodEdit] = useState(false);
  const [selectedServingdForEdit, setselectedServingdForEdit] = useState(null);

  {/* delete food  */ }
  const [openDeleteFood, setOpenDeleteFood] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  {/* edit meal  */ }
  const [openEditMeal, setOpenEditMeal] = useState(false);

  const [isCustomFood, setIsCustomFood] = useState(false);
  const [customFood, setCustomFood] = useState({
    name: '',
    protein: '',
    carbs: '',
    fat: '',
    fiber: '',
    calories: '',
    serving_description: ''
  });

  const createCustomFood = useCreateCustomFood();

  const [customFoodsList, setCustomFoodsList] = useState([]);

  const { data: customFoods, isLoading: isLoadingCustomFoods } = useGetCustomFoods();

  const [customFoodTab, setCustomFoodTab] = useState(0);

  useEffect(() => { 
    refetch()
   }, [props.param]);

  const handleEditMealInfo = (meal) => {
    setOpenEditMeal(true);
    setSelectedMeal(meal);
    setUpdateMeal({ title: meal.title, description: meal.description });
  }

  const handleupdateMeal = async () => {
    try {
      await updateMeals({
        meal_id: selectedMeal.id,
        title: updateMeal.title,
        description: updateMeal.description,
      });
      setOpenEditMeal(false);

    } catch (error) {
      console.error('Error updating meal:', error);
      setOpenEditMeal(false);
    }
  }

  const handleDeleteFoodlModal = (food) => {
    console.log("Selected handleDeleteFoodlModal:", food)
    setSelectedFoodDelete(food)
    setOpenDeleteFood(true);
  }


  const handleDeleteMealModal = (meal) => {
    setSelectedMealDelete(meal)
    setOpenDelete(true);
  }

  const handleDeleteMeal = async () => {
    try {
      await deleteMeal({
        meal_id: selectedMealDelete.id,
      });
      setSelectedMealDelete(null)
      setOpenDelete(false);
    } catch (error) {
      setSelectedMealDelete(null)
      setOpenDelete(false);
      console.error('Error deleting meal:', error);
    }

  }

  useEffect(() => {
    if (!isLoading && mealList) {
      console.log("Loading meals", mealList);
      setMeals(mealList);
    }
  }, [mealList]);

  //severing select
  const [selectedServing, setSelectedServing] = useState(null);

  const fetchTheFood = useSearchForFood(foodSearch);

  // const foodById = useGetFoodById(foodId);




  const handleEditFood = (food, activeServings) => {
    setOpenFoodEdit(true);
    setSelectedFood(food);
    setselectedServingdForEdit(activeServings);
  }



  const handleSaveEditServing = async (data) => {
    //save the edited serving
    setOpenFoodEdit(false);
    console.log("Selected meal:", data);
    try {
      await updateMealFood({
        meal_id: selectedFood.id,
        is_custom: true,
        custom_serving: data,
      });

    } catch (error) {
      console.error('Error adding food to  meal:', error);
    }
  }
  const handleAddMeal = async () => {
    // setMeals([...meals, { ...newMeal, id: meals.length + 1, foodList: [] }]);

    try {
      await createnNewMeal({
        ...newMeal,
        diet_id: props.param,
      });
      setNewMeal({ title: "", description: "" });
      setOpen(false);
    } catch (error) {
      console.error('Error creating meal:', error);
    }

  };

  const handleAddFoodToMeal = async () => {

    if (selectedMeal && selectedServing) {
      try {
        await addFoodToMeal({
          meal_id: selectedMeal.id,
          food_id: foodId,
          serving_id: selectedServing.serving_id,
        });

      } catch (error) {
        console.error('Error adding food to  meal:', error);
      }
      //clear the selected food
      // setMeals(updatedMeals);
      // setSelectedServing(null);
      setDrawerOpen(false); // Close the drawer after adding the food
      setSelectedFood(null); // Reset selected food after adding
    }
  };

  const handleDeleteFoodFromMeal = () => {
    try {
      deleteFood(selectedFoodDelete);
      setOpenDeleteFood(false);

    } catch (error) {
      console.error('Error deleting food:', error);
      setOpenDeleteFood(false);


    }
  };

  const fetchFood = async (query) => {
    try {
      const result = await fetchTheFood.refetch(query);
      setSearchResults(result?.data || []);
      // Do something with the result
    } catch (error) {
      console.error("Error searching for food:", error);
    }
  };

  const handleSearchById = async (foodId) => {
    try {
      const result = await axios.get(`misc/food-id/${foodId}`);
      return result?.data.data || {};
    } catch (error) {
      console.error("Error fetching food by ID:", error);
      toast.error(`${error.message} ${error.response?.data?.message || ""}`, {
        duration: 4000,
      });
      throw error;


    }
  }



  const handleOnclickSelectedFood = async (newFoodId) => {
    setFoodId(newFoodId);
    // Refetch the food data by ID
    const result = await handleSearchById(newFoodId);
    console.log("Data from foodById:", result);
    setServingData(result || {});
  };

  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  const debouncedFetchFood = useCallback(
    debounce((query) => {
      if (query.trim()) {
        fetchFood(query);
      } else {
        setSearchResults([]);
      }
    }, 500),
    []
  );

  const handleSearchFood = (value) => {
    setFoodSearch(value);
    debouncedFetchFood(value);
  };

  const handleServingsChange = (e) => {
    const value = e.target.value;
    //find the serving data
    const serving = servingData.servings.serving.find(
      (serve) => serve.serving_id === value
    );
    setSelectedServing(serving);
  };

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

  const handleCloseDrawer = () => {
    console.log("Close Drawer");
    setSelectedFood(null);
    setFoodId(null);
    setSelectedServing(null);
    setServingData({});
    setSearchResults([]);
    setDrawerOpen(false);
    setFoodSearch("");

  }

  const handleOpenDrawer = () => {
    setDrawerOpen(true);

  }



  const MealCard = ({ meal, chart }) => {
    const [expanded, setExpanded] = useState(false);


    const handleExpandClick = () => {
      setExpanded(!expanded);
    };


    return (

      <Grid key={meal.id}>
        <Card onClick={() => setSelectedMeal(meal)}>
          <CardContent>
            <Grid
              sx={{ display: "flex", justifyContent: "space-between" }}
            >
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

            {/* Add meal totals here */}
            <Grid container spacing={1} sx={{ mt: 1, mb: 1 }}>
              {['calories', 'protein', 'carbohydrate', 'fat'].map((nutrient) => {
                const total = meal.Diet_Meals_FoodList.reduce((sum, food) => {
                  let servingValues;
                  
                  // Add console.log to debug the food object
                  console.log('Processing food:', {
                    food_name: food.foodInfo?.food_name,
                    serving_id: food.serving_id,
                    is_custom: food.is_custom,
                    custom_serving: food.custom_serving,
                    foodInfo: food.foodInfo
                  });

                  if (food.is_custom) {
                    servingValues = food.custom_serving;
                    console.log('Using custom_serving values:', servingValues);
                  } else if (food.serving_id?.includes('custom')) { 
                    servingValues = food.foodInfo?.servings?.serving[0];
                    console.log('Using custom serving_id values:', servingValues);
                  } else {
                    // For regular foods, first try exact match, then fallback to string comparison
                    const serving = food.foodInfo?.servings?.serving?.find(
                      serve => serve.serving_id === food.serving_id || 
                              serve.serving_id === JSON.stringify(food.serving_id)
                    );
                    servingValues = serving;
                    console.log('Using regular serving values:', servingValues);
                  }

                  // Map 'carbohydrate' to 'carbs' for custom foods if needed
                  const nutrientKey = food.is_custom && nutrient === 'carbohydrate' ? 'carbs' : nutrient;
                  const value = Number(servingValues?.[nutrientKey]) || 0;
                  
                  console.log(`Adding ${nutrientKey}: ${value} to sum: ${sum}`);
                  return sum + value;
                }, 0);

                return (
                  <Grid item xs={3} key={nutrient}>
                    <Typography color="primary" variant="caption" align="center" display="block">
                      {nutrient.charAt(0).toUpperCase() + nutrient.slice(1)}
                    </Typography>
                    <Typography variant="body2" align="center">
                      {Math.round(total * 10) / 10}
                    </Typography>
                  </Grid>
                );
              })}
            </Grid>

            <Collapse in={expanded} timeout="auto" unmountOnExit>
              <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" color="textSecondary" component="p">
                  {meal.description}
                </Typography>
                <Box>
                  <Tooltip title="Edit this meal">
                    <IconButton size="small" onClick={() => handleEditMealInfo(meal)} aria-label="edit">
                      <EditIcon color="primary" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete this meal">
                    <IconButton size="small" onClick={() => handleDeleteMealModal(meal)} aria-label="delete">
                      <DeleteIcon color="error" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
              {chart}
            </Collapse>

            {/* <MealTable meal={meal} data={meal.Diet_Meals_FoodList} /> */}
            <MobileDietMeal
              handleEditFood={handleEditFood}
              handleDeleteFoodlModal={handleDeleteFoodlModal}
              meal={meal}
              data={meal.Diet_Meals_FoodList}

            />
            {/* {JSON.stringify(meal.Diet_Meals_FoodList.servings.serving.filter((serve) => serve.serving_id === meal.Diet_Meals_FoodList.serving_id))} */}
          </CardContent>
          <CardActionArea>
            <Grid container spacing={2} justifyContent="center" sx={{ py: 2 }}>
              <Grid item>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={handleOpenDrawer}
                >
                  Add Food
                </Button>

              </Grid>
            </Grid>
          </CardActionArea>
        </Card>



      </Grid>
    )
  }

  const handleAddCustomFood = async () => {
    try {
      const customServing = {
        fat: customFood.fat|| "0.00",
        sugar: "0.00",
        sodium: "0",
        protein: customFood.protein || "0.00",
        calories: customFood.calories || "0",
        serving_id: `custom-${Date.now()}`,
        cholesterol: "0",
        carbohydrate: customFood.carbs || "0.00",
        saturated_fat: "0.000",
        number_of_units: "1.000",
        metric_serving_unit: "g",
        serving_description: customFood.serving_description || "100g serving",
        metric_serving_amount: "100.000",
        measurement_description: "serving",
        fiber: customFood.fiber|| "0.00"
      };

      // Create the food data
      const customFoodData = {
        name: customFood.name,
        serving: customServing
      };

      // Call the mutation to create the custom food
      const result = await createCustomFood.mutateAsync(customFoodData);
      
      // Set the food data with the returned data from the server
      setFoodId(result.food_id);
      setServingData({
        food_id: result.food_id,
        food_name: customFood.name,
        food_description: 'Custom food',
        servings: {
          serving: [result.serving]
        }
      });
      setSelectedServing(result.serving);
      
      // Reset the form
      setCustomFood({
        name: '',
        protein: '',
        carbs: '',
        fat: '',
        fiber: '',
        calories: '',
        serving_description: ''
      });
      setIsCustomFood(false);
    } catch (error) {
      console.error('Error adding custom food:', error);
      // Error handling is managed by the mutation
    }
  };

  const handleAddCustomFoodToMeal = async (food) => {
    try {
      await addFoodToMeal({
        meal_id: selectedMeal.id,
        food_id: food.source_id,
        serving_id: food.servings.serving[0].serving_id,
        is_custom: true
      });
      setDrawerOpen(false);
    } catch (error) {
      console.error('Error adding custom food to meal:', error);
    }
  };

  return (
    <>
      <Container>
        <Grid container justifyContent="end">
          <Hidden smDown>
            <Button
              sx={{ mb: 5 }}
              variant="contained"
              color="primary"
              onClick={() => setOpen(true)}
            >
              Add Meal
            </Button>
          </Hidden>

        </Grid>

        <Grid container justifyContent="center">
          {meals.map((meal, index) => (
            <Grid key={index} item sx={{ mb: 2 }} lg={12} md={12} xs={12} sm={12}>
              <MealCard meal={meal} chart={<FoodChart mealData={meal.Diet_Meals_FoodList} />} />
            </Grid>
          ))}
        </Grid>

        <Drawer
          PaperProps={{ sx: { maxHeight: "70%" } }}
          anchor="bottom"
          open={drawerOpen}
          onClose={handleCloseDrawer}
        >
          {/* Header with Back Button */}
          {foodId && (
            <Button
              sx={{ m: 2 }}
              variant="text"
              onClick={() => {
                setSelectedServing(null);
                setFoodId(null);
                setSelectedFood(null);
              }}
            >
              <ArrowBackIcon sx={{ mr: 1 }} /> Back
            </Button>
          )}

          {/* Main Content */}
          <Box sx={{ p: 2 }}>
            {/* Step 1: Initial Options */}
            {!foodId && !isCustomFood && (
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => handleSearchFood('')}
                    startIcon={<SearchIcon />}
                  >
                    Search Food
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => setIsCustomFood(true)}
                    startIcon={<AddIcon />}
                  >
                    Custom Food
                  </Button>
                </Grid>
              </Grid>
            )}

            {/* Step 2A: Food Search */}
            {!foodId && !isCustomFood && (
              <Box sx={{ mt: 2 }}>
                <TextField
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  placeholder="Search foods..."
                  value={foodSearch}
                  onChange={(e) => handleSearchFood(e.target.value)}
                  fullWidth
                />
                
                <List sx={{ mt: 1, maxHeight: 300, overflow: 'auto' }}>
                  {fetchTheFood.isLoading ? (
                    <ListItem>
                      <CircularProgress size={20} sx={{ mr: 2 }} />
                      <ListItemText primary="Searching..." />
                    </ListItem>
                  ) : (
                    searchResults?.map((food) => (
                      <ListItem
                        button
                        key={food.food_id}
                        onClick={() => handleOnclickSelectedFood(food.food_id)}
                      >
                        <ListItemText 
                          primary={food.food_name}
                          secondary={food.food_description}
                        />
                      </ListItem>
                    ))
                  )}
                </List>
              </Box>
            )}

            {/* Step 2B: Custom Foods */}
            {!foodId && isCustomFood && (
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <IconButton 
                    onClick={() => setIsCustomFood(false)}
                    sx={{ mr: 1 }}
                    aria-label="back to search"
                  >
                    <ArrowBackIcon />
                  </IconButton>
                  <Tabs
                    value={customFoodTab}
                    onChange={(e, newValue) => setCustomFoodTab(newValue)}
                    sx={{ flex: 1 }}
                  >
                    <Tab label="My Custom Foods" />
                    <Tab label="Create New" />
                  </Tabs>
                </Box>

                {customFoodTab === 0 && (
                  <List sx={{ maxHeight: 300, overflow: 'auto' }}>
                    {isLoadingCustomFoods ? (
                      <ListItem>
                        <CircularProgress size={20} sx={{ mr: 2 }} />
                        <ListItemText primary="Loading custom foods..." />
                      </ListItem>
                    ) : !customFoods || customFoods.length === 0 ? (
                      <ListItem>
                        <ListItemText 
                          primary="No custom foods found" 
                          secondary="Create your first custom food using the 'Create New' tab"
                        />
                      </ListItem>
                    ) : (
                      customFoods.map((food) => {
                        console.log("customFoods", customFoods)
                        let servingValues = food.servings.serving[0]
                        return ( <ListItem
                          key={food.id}
                          secondaryAction={
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => handleAddCustomFoodToMeal(food)}
                            >
                              Add
                            </Button>
                          }
                        >
                          <ListItemText
                            primary={food.food_name}
                            secondary={`${servingValues.calories} cal | P:${servingValues.protein}g | C:${servingValues.carbohydrate}g | F:${servingValues.fat}g`}
                          />
                        </ListItem>)
                      }
                       )
                    )}
                  </List>
                )}

                {customFoodTab === 1 && (
                  <CustomFoodForm
                    customFood={customFood}
                    setCustomFood={setCustomFood}
                    onSubmit={handleAddCustomFood}
                    isLoading={createCustomFood.isLoading}
                  />
                )}
              </Box>
            )}

            {/* Step 3: Food Details & Serving Selection */}
            {foodId && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  {servingData.food_name}
                </Typography>
                
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Serving Size</InputLabel>
                  <Select
                    value={selectedServing?.serving_id || ''}
                    onChange={handleServingsChange}
                    label="Serving Size"
                  >
                    {servingData?.servings?.serving?.map((serving) => (
                      <MenuItem key={serving.serving_id} value={serving.serving_id}>
                        {serving.serving_description}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {selectedServing && (
                  <>
                    <NutritionValueDisplay 
                      data={selectedServing}
                      otherData={servingData}
                      showOtherData={true}
                    />
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={handleAddFoodToMeal}
                      sx={{ mt: 2 }}
                    >
                      Add to Meal
                    </Button>
                  </>
                )}
              </Box>
            )}
          </Box>
        </Drawer>

        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>Add Meal</DialogTitle>
          <DialogContent>
            <TextField
              label="Meal Title"
              value={newMeal.title}
              onChange={(e) =>
                setNewMeal({ ...newMeal, title: e.target.value })
              }
              fullWidth
              margin="normal"
            />
            <TextField
              label="Meal Description"
              value={newMeal.description}
              onChange={(e) =>
                setNewMeal({ ...newMeal, description: e.target.value })
              }
              fullWidth
              margin="normal"
              multiline
              rows={4}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)} color="secondary">
              Cancel
            </Button>
            <LoadingButton loading={newMealLoading} onClick={handleAddMeal} color="primary">
              Add
            </LoadingButton>
          </DialogActions>
        </Dialog>

        {/* update meal Dialog later will change the component into one */}
        <Dialog open={openEditMeal} onClose={() => setOpenEditMeal(false)}>
          <DialogTitle>Update Meal</DialogTitle>
          <DialogContent>
            <TextField
              label="Meal Title"
              value={updateMeal.title}
              onChange={(e) =>
                setUpdateMeal({ ...updateMeal, title: e.target.value })
              }
              fullWidth
              margin="normal"
            />
            <TextField
              label="Meal Description"
              value={updateMeal.description}
              onChange={(e) =>
                setUpdateMeal({ ...updateMeal, description: e.target.value })

              }
              fullWidth
              margin="normal"
              multiline
              rows={4}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenEditMeal(false)} color="secondary">
              Cancel
            </Button>
            <LoadingButton loading={newMealLoading} onClick={handleupdateMeal} color="primary">
              Update
            </LoadingButton>
          </DialogActions>
        </Dialog>

        <Dialog sx={{ minWidth: 400 }} open={openDelete} onClose={() => setOpenDelete(false)}>
          <DialogTitle>Delete Meal</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete <Typography sx={{ fontWeight: 'bold' }} component="span" color="primary">{selectedMealDelete?.title}</Typography> meal?
            </Typography>
            <Typography sx={{ fontSize: '14px', fontStyle: 'italic' }} color="error">Deleting this meal will remove all the foods associated with it.</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDelete(false)} color="secondary">
              Cancel
            </Button>
            <LoadingButton loading={newMealLoading} onClick={handleDeleteMeal} color="error">
              Delete
            </LoadingButton>
          </DialogActions>
        </Dialog>

        <Dialog sx={{ minWidth: 400 }} open={openDeleteFood} onClose={() => setOpenDeleteFood(false)}>
          <DialogTitle>Delete Food</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to delete {<Typography color={"primary"}> {selectedFoodDelete?.foodInfo?.food_name}</Typography>}?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => { setOpenDeleteFood(false) }} color="secondary">
              Cancel
            </Button>
            <LoadingButton loading={newMealLoading} onClick={handleDeleteFoodFromMeal} color="error">
              Delete
            </LoadingButton>
          </DialogActions>
        </Dialog>
      </Container>
      <EditFoodDialog
        openFoodEdit={openFoodEdit}
        setOpenFoodEdit={setOpenFoodEdit}
        selectedFood={selectedFood}
        selectedServing={selectedServingdForEdit}
        setselectedServingdForEdit={setselectedServingdForEdit}
        handleSaveEditServing={handleSaveEditServing}
      />
      <Hidden mdUp>
        <FloatBarAction
          name={"Meal"}
          handleClick={() => setOpen(true)}
        />
      </Hidden>

      <Container >
        <Card sx={{ mt: 2 }}>
          <CardContent>
            <FoodSummaryInfo mealsData={meals} />
          </CardContent>
        </Card>
      </Container>

    </>
  );
};

export default DietMeals;
