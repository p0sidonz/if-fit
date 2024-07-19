import React, { useState, useCallback, useEffect } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";
import { useSearchForFood, useGetFoodById, useGetMealList, useCreateNewMeal, useAddFoodToMeal, useUpdateMealFood, useDeleteMeal, useDeleteFood, useUpdateMeal } from "./hooks/useDiet";
import EditFoodDialog from "./EditFoodDialog";
import Tooltip from '@mui/material/Tooltip';

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
  IconButton
} from "@mui/material";
import NutritionValueDisplay from "./NutritionValueDisplay";
import LoadingButton from "@mui/lab/LoadingButton";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { ExpandMore as ExpandMoreIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { styled } from '@mui/system';


const DietMeals = (props) => {
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

  {/* Food edit */ }
  const [openFoodEdit, setOpenFoodEdit] = useState(false);
  const [selectedServingdForEdit, setselectedServingdForEdit] = useState(null);


  {/* delete food  */ }
  const [openDeleteFood, setOpenDeleteFood] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  {/* edit meal  */ }
  const [openEditMeal, setOpenEditMeal] = useState(false);


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

  const foodById = useGetFoodById(foodId);




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
      // setMeals(updatedMeals);
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

  const handleOnclickSelectedFood = (newFoodId) => {
    console.log("Selected Food ID:", newFoodId);
    try {
      setFoodId(newFoodId); // Update the foodId state
      foodById
        .refetch()
        .then((data) => {
          if (data.status === "success") {
            console.log("Data from foodById:", data);
            setServingData(data.data.data || {});
          }
        })
        .catch((error) => {
          console.error("Error getting food by id:", error);
        });
    } catch (error) {
      console.error("Error setting foodId:", error);
    }
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




  const headCells = [
    { id: "title", label: "Title" },
    { id: "protein", label: "Protein (g)" },
    { id: "carbs", label: "Carbs (g)" },
    { id: "fat", label: "Fat (g)" },
    { id: "kals", label: "Calories" },
    { id: "quantity", label: "Quantity" },
  ];


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
              if (!activeServings) return null;
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
                  <TableCell>{food?.foodInfo.food_name}</TableCell>
                  <TableCell>{activeServings?.protein}</TableCell>
                  <TableCell>{activeServings?.carbohydrate}</TableCell>
                  <TableCell>{activeServings?.fat}</TableCell>
                  <TableCell>{activeServings?.calories}</TableCell>
                  <TableCell>{JSON.parse(activeServings?.metric_serving_amount).toFixed(1)} {" "} {activeServings?.measurement_description}</TableCell>
                  <TableCell>
                    <Button onClick={() => {
                      handleEditFood(food, activeServings)

                    }}><ModeEditIcon /></Button>
                    <Button onClick={() => { handleDeleteFoodlModal(food) }}><DeleteForeverIcon color="error" /> </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    );
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



  const MealCard = ({ meal }) => {
    const [expanded, setExpanded] = useState(false);


    const handleExpandClick = () => {
      setExpanded(!expanded);
    };


    return (

      <Grid item xs={12} sm={6} lg={12} key={meal.id}>
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
            </Collapse>
            <MealTable meal={meal} data={meal.Diet_Meals_FoodList} />
            {/* {JSON.stringify(meal.Diet_Meals_FoodList.servings.serving.filter((serve) => serve.serving_id === meal.Diet_Meals_FoodList.serving_id))} */}
          </CardContent>
          <CardActionArea>
            <Grid container spacing={2} justifyContent="center" sx={{ py: 2 }}>
              <Grid item>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => setDrawerOpen(true)}
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

  return (
    <>
      <Container>
        <Grid container spacing={2} justifyContent="end">
          <Button
            sx={{ my: 2, mx: 2 }}
            variant="contained"
            color="primary"
            onClick={() => setOpen(true)}
          >
            Add Meal
          </Button>
        </Grid>

        <Grid container spacing={2} justifyContent="center">
          {meals.map((meal) => <MealCard meal={meal} />)}
        </Grid>


        <Drawer
          PaperProps={{ sx: { width: "30%" } }}
          anchor="right"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        >
          {!foodId ? (
            <div style={{ marginLeft: 4, padding: 4 }}>
              <TextField
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                placeholder="May be chicken...?"
                helperText="Search for food to add to the meal"
                variant="outlined"
                sx={{ pr: 4 }}
                label="Search Food"
                value={foodSearch}
                onChange={(e) => handleSearchFood(e.target.value)}
                fullWidth
                margin="normal"
              />
            </div>
          ) : (
            <Button
              sx={{ margin: 2 }}
              variant="text"
              onClick={() => {
                setFoodId(null);
                setSelectedFood(null);
              }}
              color="primary"
            >
              <ArrowBackIcon sx={{ mr: 3 }} /> Back to search
            </Button>
          )}
          <List
            sx={{
              "& .MuiListItemButton-root:hover": {
                bgcolor: "orange",
                "&, & .MuiListItemIcon-root": {
                  color: "yellow",
                },
              },
            }}
          >
            {fetchTheFood.isLoading && (
              <ListItem>
                <CircularProgress style={{ margin: "0 auto" }} /> Loading...
              </ListItem>
            )}

            {!foodId &&
              searchResults?.map((food) => (
                <ListItem
                  button
                  key={food.id + Math.random()}
                  onClick={() => {
                    setSelectedFood(food);
                    handleOnclickSelectedFood(food.food_id);
                  }}
                >
                  <ListItemText
                    primary={food.food_name}
                    secondary={food.food_description}
                  />
                </ListItem>
              ))}

            {foodId && (
              <>
                <ListItem>
                  <ListItemText
                    primary={
                      <>
                        <FormControl fullWidth>
                          <InputLabel id="serving-size">
                            Serving Size
                          </InputLabel>
                          <Select
                            labelId="serving-size"
                            id="serving-size"
                            label="Serving Size"
                            onChange={handleServingsChange}
                          >
                            {console.log("Serving Data:", servingData)}
                            {servingData?.servings?.serving?.map((serve) => (
                              <MenuItem
                                key={serve.serving_id}
                                value={serve.serving_id}
                              >
                                {serve.serving_description}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </>
                    }
                    secondary={servingData.serving_size}
                  />
                </ListItem>
                {selectedServing && (
                  <NutritionValueDisplay data={selectedServing} />
                )}
                <Grid container spacing={2} justifyContent="center">
                  <Grid sx={{ m: 5 }} item lg={12} sm={12}>
                    <Button
                      onClick={handleAddFoodToMeal}
                      fullWidth
                      variant="outlined"
                      color="primary"
                    >
                      Add to Meal
                    </Button>
                  </Grid>
                </Grid>
              </>
            )}
          </List>
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
            <Button onClick={() => { }} color="secondary">
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

    </>
  );
};

export default DietMeals;
