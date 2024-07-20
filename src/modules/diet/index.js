import DietCard from "./components/DietCard";
import React, { useEffect, useState } from "react";
import Collapse from "@mui/material/Collapse";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ExpandLess } from "@mui/icons-material";
import { useGetDietList, useCreatNewDiet, useUpdateDiet } from "./hooks/useDiet";
import {
  Card,
  Box,
  CardContent,
  Container,
  Grid,
  Button,
  Dialog,
  Typography,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  InputAdornment,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Fab,
  Hidden,
  Tooltip
} from "@mui/material";
import { Search as SearchIcon, Add as AddIcon } from "@mui/icons-material";
import { FloatBarAction } from "../components/FloatBarAction";

const DietList = () => {
  const updateDiet = useUpdateDiet();
  const { data, isLoading, isError, error, isFetched } = useGetDietList();
  const createDiet = useCreatNewDiet();
  const [diets, setDiets] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [calorieFilterValue, setCalorieFilterValue] = useState("");
  const [calorieFilterType, setCalorieFilterType] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [newDietDialogOpen, setNewDietDialogOpen] = useState(false);
  const [currentDiet, setCurrentDiet] = useState(null);
  const [viewMore, setViewMore] = useState(false);


  useEffect(() => {
    if (isFetched) {
      setDiets(data);
    }
  }, [isFetched, data]);

  const [newDiet, setNewDiet] = useState({
    title: "",
    description: "",
    calories: "",
    carbs: "",
    fat: "",
    protein: "",
    type: "veg",
    is_macro_set: false,
    macro_type: "",
    target_calories: "",
    target_protein: "",
    target_carbs: "",
    target_fat: "",
    target_fibre: "",
  });

  const handleEdit = (diet) => {
    setCurrentDiet(diet);
    setNewDiet({ ...diet });
    setEditDialogOpen(true);
  };

  const handleDelete = (diet) => {
    setCurrentDiet(diet);
    setDeleteDialogOpen(true);
  };

  const handleUpdateDiet = () => {
    // setDiets(
    //   diets.map((diet) => (diet.id === currentDiet.id ? { ...newDiet } : diet))
    // );
    updateDiet.mutate({
      ...newDiet, diet_id: currentDiet.id,
      //make other thing int 
      target_calories: parseInt(newDiet.target_calories) || 0,
      target_protein: parseInt(newDiet.target_protein) || 0,
      target_carbs: parseInt(newDiet.target_carbs) || 0,
      target_fat: parseInt(newDiet.target_fat) || 0,
      target_fibre: parseInt(newDiet.target_fibre) || 0,

    })
    setEditDialogOpen(false);
  };

  const handleDeleteDiet = () => {
    setDiets(diets.filter((diet) => diet.id !== currentDiet.id));
    setDeleteDialogOpen(false);
  };

  const handleAddDiet = () => {
    setNewDiet({
      title: "",
      description: "",
      calories: "",
      carbs: "",
      fat: "",
      protein: "",
      type: "veg",
      is_macro_set: false,
      macro_type: "",
      target_calories: "",
      target_protein: "",
      target_carbs: "",
      target_fat: "",
      target_fibre: "",
    });
    setNewDietDialogOpen(true);
  };

  const handleCreateDiet = () => {
    const newDietData = {
      ...newDiet,
      image: "https://source.unsplash.com/featured/?food",
    };
    createDiet.mutate(newDietData)
    // setDiets([...diets, newDietData]);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const handleCalorieFilterType = (e) => {
    setCalorieFilterType(e.target.value);
  };

  const handleCalorieFilterValue = (e) => {
    setCalorieFilterValue(e.target.value);
  };

  const filteredDiets = diets.filter((diet) => {
    const matchesSearchQuery =
      diet.title.toLowerCase().includes(searchQuery) ||
      diet.description.toLowerCase().includes(searchQuery);
    const matchesCalorieFilter =
      calorieFilterType === "" ||
      (calorieFilterType === "greater" &&
        diet.calories > parseInt(calorieFilterValue)) ||
      (calorieFilterType === "less" &&
        diet.calories < parseInt(calorieFilterValue));
    return matchesSearchQuery && matchesCalorieFilter;
  });

  const calculateCalories = (protein, carbs, fat) =>
    protein * 4 + carbs * 4 + fat * 9;

  const checkMacroValues = () => {
    if (newDiet.macro_type === "percentage") {
      const totalPercentage =
        Number(newDiet.target_protein) +
        Number(newDiet.target_carbs) +
        Number(newDiet.target_fat);
      if (totalPercentage > 100) {
        return "Total percentage exceeds 100%";
      }
    } else if (newDiet.macro_type === "gram") {
      const totalCalories = calculateCalories(
        newDiet.target_protein,
        newDiet.target_carbs,
        newDiet.target_fat
      );
      if (totalCalories > newDiet.target_calories) {
        return `Total calories exceed target by ${totalCalories - newDiet.target_calories
          }`;
      } else if (totalCalories < newDiet.target_calories) {
        return `Total calories are less than target by ${newDiet.target_calories - totalCalories
          }`;
      }
    }
    return null;
  };

  if (isLoading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>An error occurred: {error.message}</Typography>;

  return (
    <Container>
      <Hidden smDown>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddDiet}
            startIcon={<AddIcon />}
            sx={{ marginTop: 3 }}
          >
            Add New Diet
          </Button>

        </div>
      </Hidden >

      <Card sx={{ marginTop: 3, padding: 2 }}>
        <CardContent sx={{ display: "flex", gap: 2 }}>
          <TextField
            label="Search Diets"
            variant="outlined"
            fullWidth
            value={searchQuery}
            onChange={handleSearch}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end">
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <FormControl fullWidth variant="outlined">
            <InputLabel>Calorie Filter</InputLabel>
            <Select
              value={calorieFilterType}
              onChange={handleCalorieFilterType}
              label="Calorie Filter"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="greater">Greater than</MenuItem>
              <MenuItem value="less">Less than</MenuItem>
            </Select>
          </FormControl>
          {calorieFilterType && (
            <TextField
              label="Calorie Value"
              variant="outlined"
              fullWidth
              value={calorieFilterValue}
              onChange={handleCalorieFilterValue}
            />
          )}
        </CardContent>
      </Card>

      <Grid container  spacing={2}  sx={{ marginTop: 3 }}>
        {filteredDiets.map((diet, index) => (
          <Grid item xs={12} sm={12} md={4} key={index}>
            <DietCard diet={diet} onEdit={handleEdit} onDelete={handleDelete} />
          </Grid>
        ))}
      </Grid>

      {/* Edit Diet Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit Diet</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Diet Name"
            type="text"
            fullWidth
            value={newDiet.title}
            onChange={(e) => setNewDiet({ ...newDiet, title: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            value={newDiet.description}
            onChange={(e) =>
              setNewDiet({ ...newDiet, description: e.target.value })
            }
          />

          <FormControl fullWidth margin="dense">
            <InputLabel>Type</InputLabel>
            <Select
              value={newDiet.type}
              onChange={(e) => setNewDiet({ ...newDiet, type: e.target.value })}
            >
              <MenuItem value="veg">Veg</MenuItem>
              <MenuItem value="non-veg">Non-Veg</MenuItem>
            </Select>
          </FormControl>
          <IconButton
            onClick={() => setViewMore(!viewMore)}
            aria-expanded={viewMore}
            aria-label="show more"
          >
            {viewMore ? (
              <ExpandLess color="primary" />
            ) : (
              <ExpandMoreIcon color="primary" />
            )}

            <span style={{ fontSize: "12px", color: "#666cff" }}>
              {viewMore ? "View less" : "View more"}
            </span>
          </IconButton>
          <Collapse in={viewMore} timeout="auto" unmountOnExit>
            <FormControl fullWidth margin="dense">
              <InputLabel>Macro Type</InputLabel>
              <Select
                value={newDiet.macro_type}
                onChange={(e) =>
                  setNewDiet({ ...newDiet, macro_type: e.target.value })
                }
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="percentage">Percentage</MenuItem>
                <MenuItem value="gram">Gram</MenuItem>
              </Select>
            </FormControl>
            <TextField
              margin="dense"
              label="Target Calories"
              type="number"
              fullWidth
              value={newDiet.target_calories}
              onChange={(e) =>
                setNewDiet({ ...newDiet, target_calories: e.target.value })
              }
            />
            <TextField
              margin="dense"
              label="Target Protein"
              type="number"
              fullWidth
              value={newDiet.target_protein}
              onChange={(e) =>
                setNewDiet({ ...newDiet, target_protein: e.target.value })
              }
            />
            <TextField
              margin="dense"
              label="Target Carbs"
              type="number"
              fullWidth
              value={newDiet.target_carbs}
              onChange={(e) =>
                setNewDiet({ ...newDiet, target_carbs: e.target.value })
              }
            />
            <TextField
              margin="dense"
              label="Target Fat"
              type="number"
              fullWidth
              value={newDiet.target_fat}
              onChange={(e) =>
                setNewDiet({ ...newDiet, target_fat: e.target.value })
              }
            />
            <TextField
              margin="dense"
              label="Target Fibre"
              type="number"
              fullWidth
              value={newDiet.target_fibre}
              onChange={(e) =>
                setNewDiet({ ...newDiet, target_fibre: e.target.value })
              }
            />
          </Collapse>
          {checkMacroValues() && (
            <>
              <Typography color="error" variant="body2">
                {checkMacroValues()}
              </Typography>
              <Typography color="info" variant="subtitle2">
                Correction is optional but recommended
              </Typography>
            </>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUpdateDiet} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Diet Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Diet</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this diet?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteDiet} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* New Diet Dialog */}
      <Dialog
        open={newDietDialogOpen}
        onClose={() => setNewDietDialogOpen(false)}
      >
        <DialogTitle>Add New Diet</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Diet Name"
            type="text"
            fullWidth
            value={newDiet.title}
            onChange={(e) => setNewDiet({ ...newDiet, title: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            value={newDiet.description}
            onChange={(e) =>
              setNewDiet({ ...newDiet, description: e.target.value })
            }
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Type</InputLabel>
            <Select
              value={newDiet.type}
              onChange={(e) => setNewDiet({ ...newDiet, type: e.target.value })}
            >
              <MenuItem value="veg">Veg</MenuItem>
              <MenuItem value="non-veg">Non-Veg</MenuItem>
            </Select>
          </FormControl>
          <IconButton
            onClick={() => setViewMore(!viewMore)}
            aria-expanded={viewMore}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </IconButton>
          <Collapse in={viewMore} timeout="auto" unmountOnExit>
            <FormControl fullWidth margin="dense">
              <InputLabel>Macro Type</InputLabel>
              <Select
                value={newDiet.macro_type}
                onChange={(e) =>
                  setNewDiet({ ...newDiet, macro_type: e.target.value })
                }
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="percentage">Percentage</MenuItem>
                <MenuItem value="gram">Gram</MenuItem>
              </Select>
            </FormControl>
            <TextField
              margin="dense"
              label="Target Calories"
              type="number"
              fullWidth
              value={newDiet.target_calories}
              onChange={(e) =>
                setNewDiet({ ...newDiet, target_calories: e.target.value })
              }
            />
            <TextField
              margin="dense"
              label="Target Protein"
              type="number"
              fullWidth
              value={newDiet.target_protein}
              onChange={(e) =>
                setNewDiet({ ...newDiet, target_protein: e.target.value })
              }
            />
            <TextField
              margin="dense"
              label="Target Carbs"
              type="number"
              fullWidth
              value={newDiet.target_carbs}
              onChange={(e) =>
                setNewDiet({ ...newDiet, target_carbs: e.target.value })
              }
            />
            <TextField
              margin="dense"
              label="Target Fat"
              type="number"
              fullWidth
              value={newDiet.target_fat}
              onChange={(e) =>
                setNewDiet({ ...newDiet, target_fat: e.target.value })
              }
            />
            <TextField
              margin="dense"
              label="Target Fibre"
              type="number"
              fullWidth
              value={newDiet.target_fibre}
              onChange={(e) =>
                setNewDiet({ ...newDiet, target_fibre: e.target.value })
              }
            />
          </Collapse>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewDietDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCreateDiet} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
      <Hidden smUp>
        <FloatBarAction name="Diet" handleClick={handleAddDiet} />
      </Hidden>
    </Container>
  );
};

export default DietList;
