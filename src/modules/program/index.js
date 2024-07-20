import React, { useEffect, useState } from "react";
import ProgramCard from "./components/ProgramCard";
import {useGetProgramList, useUpdateProgram} from "./hooks/useProgram";
import CardHeader, { Hidden } from "@mui/material";
import { useRouter } from "next/router";

import {
  Card,
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
  Box,
  CardActions
} from "@mui/material";
import { Search as SearchIcon, Add as AddIcon } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import { FloatBarAction } from "../components/FloatBarAction";


const ProgramList = () => {
    const router = useRouter();
    // const updateProgram = useUpdateProgram();
    const { data, isLoading, isError, error, isFetched } = useGetProgramList();
    // const createProgram = useCreateNewProgram();
    const [programs, setPrograms] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [weeksFilterValue, setWeeksFilterValue] = useState("");
    const [weeksFilterType, setWeeksFilterType] = useState("");
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [newProgramDialogOpen, setNewProgramDialogOpen] = useState(false);
    const [currentProgram, setCurrentProgram] = useState(null);
  
    useEffect(() => {
      if (isFetched) {
        setPrograms(data);
      }
    }, [isFetched, data]);
  
    const [newProgram, setNewProgram] = useState({
      title: "",
      description: "",
      total_weeks: "",
      total_days: "",
      total_workouts: "",
      type: "beginner",
    });
  
    const handleEdit = (program) => {
      setCurrentProgram(program);
      setNewProgram({ ...program });
      setEditDialogOpen(true);
    };
  
    const handleDelete = (program) => {
      setCurrentProgram(program);
      setDeleteDialogOpen(true);
    };
  
    const handleUpdateProgram = () => {
    //   updateProgram.mutate({
    //     ...newProgram,
    //     program_id: currentProgram.id,
    //     total_weeks: parseInt(newProgram.total_weeks) || 0,
    //     total_days: parseInt(newProgram.total_days) || 0,
    //     total_workouts: parseInt(newProgram.total_workouts) || 0,
    //   });
      setEditDialogOpen(false);
    };
    
    const handleNavigation = (id) => {
      router.push(`/program/${id}`);
    }

    const handleDeleteProgram = () => {
      setPrograms(programs.filter((program) => program.id !== currentProgram.id));
      setDeleteDialogOpen(false);
    };
  
    const handleAddProgram = () => {
      setNewProgram({
        title: "",
        description: "",
        total_weeks: "",
        total_days: "",
        total_workouts: "",
        type: "beginner",
      });
      setNewProgramDialogOpen(true);
    };
  
    const handleCreateProgram = () => {
      const newProgramData = {
        ...newProgram,
        image: "https://source.unsplash.com/featured/?exercise",
      };
    //   createProgram.mutate(newProgramData);
    };
  
    const handleSearch = (e) => {
      setSearchQuery(e.target.value.toLowerCase());
    };
  
    const handleWeeksFilterType = (e) => {
      setWeeksFilterType(e.target.value);
    };
  
    const handleWeeksFilterValue = (e) => {
      setWeeksFilterValue(e.target.value);
    };
  
    const filteredPrograms = programs.filter((program) => {
      const matchesSearchQuery =
        program.title.toLowerCase().includes(searchQuery) ||
        program.description.toLowerCase().includes(searchQuery);
      const matchesWeeksFilter =
        weeksFilterType === "" ||
        (weeksFilterType === "greater" &&
          program.total_weeks > parseInt(weeksFilterValue)) ||
        (weeksFilterType === "less" &&
          program.total_weeks < parseInt(weeksFilterValue));
      return matchesSearchQuery && matchesWeeksFilter;
    });
  
    if (isLoading) return <Typography>Loading...</Typography>;
    if (error) return <Typography>An error occurred: {error.message}</Typography>;

    
    return (
      <Container>
          <Hidden smDown>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddProgram}
            startIcon={<AddIcon />}
            sx={{ marginTop: 3 }}
          >
            Add New Program
          </Button>
        </div>
        </Hidden>
        <Card sx={{ marginTop: 3, padding: 2 }}>
          <CardContent sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="Search Programs"
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
              <InputLabel>Weeks Filter</InputLabel>
              <Select
                value={weeksFilterType}
                onChange={handleWeeksFilterType}
                label="Weeks Filter"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="greater">Greater than</MenuItem>
                <MenuItem value="less">Less than</MenuItem>
              </Select>
            </FormControl>
            {weeksFilterType && (
              <TextField
                label="Weeks Value"
                variant="outlined"
                fullWidth
                value={weeksFilterValue}
                onChange={handleWeeksFilterValue}
              />
            )}
          </CardContent>
        </Card>
  
        <Grid container spacing={1} sx={{ marginTop: 3 }}>
          {filteredPrograms.map((program, index) => (
              <ProgramCard 
              handleNavigation={handleNavigation}
              program={program} 
              onEdit={handleEdit} 
              onDelete={handleDelete} />
          ))}
        </Grid>
  
        {/* Edit Program Dialog */}
        <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
          <DialogTitle>Edit Program</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Program Name"
              type="text"
              fullWidth
              value={newProgram.title}
              onChange={(e) => setNewProgram({ ...newProgram, title: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Description"
              type="text"
              fullWidth
              value={newProgram.description}
              onChange={(e) =>
                setNewProgram({ ...newProgram, description: e.target.value })
              }
            />
  
            <FormControl fullWidth margin="dense">
              <InputLabel>Type</InputLabel>
              <Select
                value={newProgram.type}
                onChange={(e) => setNewProgram({ ...newProgram, type: e.target.value })}
              >
                <MenuItem value="beginner">Beginner</MenuItem>
                <MenuItem value="intermediate">Intermediate</MenuItem>
                <MenuItem value="advanced">Advanced</MenuItem>
              </Select>
            </FormControl>
  
          </DialogContent>
  
          <DialogActions>
            <Button onClick={() => setEditDialogOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleUpdateProgram} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
  
        {/* Delete Program Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        >
          <DialogTitle>Delete Program</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this program?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleDeleteProgram} color="secondary">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
  
        {/* New Program Dialog */}
        <Dialog
          open={newProgramDialogOpen}
          onClose={() => setNewProgramDialogOpen(false)}
        >
          <DialogTitle>Add New Program</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Program Name"
              type="text"
              fullWidth
              value={newProgram.title}
              onChange={(e) => setNewProgram({ ...newProgram, title: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Description"
              type="text"
              fullWidth
              value={newProgram.description}
              onChange={(e) =>
                setNewProgram({ ...newProgram, description: e.target.value })
              }
            />
            <FormControl fullWidth margin="dense">
              <InputLabel>Type</InputLabel>
              <Select
                value={newProgram.type}
                onChange={(e) => setNewProgram({ ...newProgram, type: e.target.value })}
              >
                <MenuItem value="beginner">Beginner</MenuItem>
                <MenuItem value="intermediate">Intermediate</MenuItem>
                <MenuItem value="advanced">Advanced</MenuItem>
              </Select>
            </FormControl>

          </DialogContent>
          <DialogActions>
            <Button onClick={() => setNewProgramDialogOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleCreateProgram} color="primary">
              Add
            </Button>
          </DialogActions>
        </Dialog>
        <Hidden smUp>
        <FloatBarAction name="Program" handleClick={handleAddProgram} />
      </Hidden>

      </Container>
    );
  };
  

  
  export default ProgramList;