import React, { useEffect, useState } from "react";
import ProgramCard from "./components/ProgramCard";
import { useGetProgramList, useUpdateProgram, addNewProgram, useDeleteProgram, getAllUserAndTrainerList, getAssignedUserList, assignUserToProgram, unassignUserFromProgram, useSyncProgram } from "./hooks/useProgram";
import CardHeader, { Hidden } from "@mui/material";
import AssignDialog from "./AssignDialog";
import { useRouter } from "next/router";
import usePackagesEvents from "../user/hooks/usePackagesEvents";
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
  Tooltip,
  CardActions,
  Alert
} from "@mui/material";
import { Search as SearchIcon, Add as AddIcon } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import { FloatBarAction } from "../components/FloatBarAction";
import LoadingButton from "@mui/lab/LoadingButton";

const ProgramList = () => {
  const {isPackageExpired} = usePackagesEvents()
  const router = useRouter();
  const deleteProgram = useDeleteProgram();
  const assignUser = assignUserToProgram();
  const unassignUser = unassignUserFromProgram();
  const syncProgram = useSyncProgram();
  const updateProgram = useUpdateProgram();
  const createProgram = addNewProgram();
  const { data, isLoading, isError, error, isFetched } = useGetProgramList();
  const { data: users, isLoading: usersLoading, error: usersError, isFetched: usersFetched } = getAllUserAndTrainerList();
  // const createProgram = useCreateNewProgram();
  const [programs, setPrograms] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [weeksFilterValue, setWeeksFilterValue] = useState("");
  const [weeksFilterType, setWeeksFilterType] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [newProgramDialogOpen, setNewProgramDialogOpen] = useState(false);
  const [currentProgram, setCurrentProgram] = useState(null);
  const [openAssignDialog, setOpenAssignDialog] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const { data: assignedUsers, isLoading: assignedUsersLoading, error: assignedUsersError, isFetched: assignedUsersFetched } = getAssignedUserList(selectedProgram);


  console.log(users);
  const onAssignClick = (programId) => {
    setSelectedProgram(programId);
    setOpenAssignDialog(true);
  };

  const handleAssignConfirm = async (program_id, assignedId) => {
    console.log("handleAssignConfirm", program_id, assignedId);
    assignUser.mutate({ program_id, assignedId }, {
      onSuccess: (data) => {
        // setOpenAssignDialog(false);
      },
      onError: (error) => {
        console.log(error);
      },
    });
    // Logic for assigning program
  };

  const handleDeleteAssignee = (assignedId) => {
    unassignUser.mutate(assignedId, {
      onSuccess: (data) => {
        // setOpenAssignDialog(false);
      },
      onError: (error) => {
        console.log(error);
      },
    });
  };

  useEffect(() => {
    if (isFetched) {
      setPrograms(data);
    }
  }, [isFetched, data]);

  const [newProgram, setNewProgram] = useState({
    title: "",
    description: "",
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
    updateProgram.mutate({
      program_id: currentProgram.id,
      title: newProgram.title,
      description: newProgram.description,
      type: newProgram.type,
      });
    setEditDialogOpen(false);
  };

  const handleNavigation = (id) => {
    router.push(`/program/${id}`);
  }

  const handleSyncProgram = (id, sync) => {
    syncProgram.mutate({ id, sync });
  }

  const handleDeleteProgram = () => {
    // setPrograms(programs.filter((program) => program.id !== currentProgram.id));
    deleteProgram.mutate(currentProgram?.id,
      {
        onSuccess: (data) => {
          setDeleteDialogOpen(false);
        },
        onError: (error) => {
          console.log(error);
        },
      }
    );
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
    createProgram.mutate(newProgram, {
      onSuccess: (data) => {
        setNewProgramDialogOpen(false);
      },
      onError: (error) => {
        console.log(error);
      },
    });
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
    return matchesSearchQuery
  });

  if (isLoading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>An error occurred: {error.message}</Typography>;


  return (
    <>
      <Hidden smDown>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h4" gutterBottom>
            Program
          </Typography>
          <Tooltip title={isPackageExpired ? "Package expired. Please renew to add new programs." : ""}>
            <span>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddProgram}
                startIcon={<AddIcon />}
                sx={{ marginTop: 3 }}
                disabled={isPackageExpired}
              >
                Add New Program
              </Button>
            </span>
          </Tooltip>
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
        </CardContent>
      </Card>

      {/* Add alert when no programs exist */}
      {filteredPrograms.length === 0 && (
        <Box sx={{ mt: 3 }}>
          <Alert severity="info" sx={{display: 'flex', justifyContent: 'center'}}>
            No programs created yet. Click the "Add New Program" button to create one.
          </Alert>
        </Box>
      )}

      <Grid container spacing={1} sx={{ marginTop: 3 }}>
        {filteredPrograms.map((program, index) => (
          <ProgramCard
            onAssignClick={onAssignClick}
            handleNavigation={handleNavigation}
            program={program}
            onEdit={handleEdit}
            onDelete={handleDelete}
            disabled={isPackageExpired}
          />
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
          <LoadingButton 
            loading={updateProgram.isLoading} 
            onClick={handleUpdateProgram}
            variant="contained"
          >
            Save
          </LoadingButton>
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
      <AssignDialog
        name={"Program"}
        programId={selectedProgram}
        open={openAssignDialog}
        onAssign={handleAssignConfirm}
        onAssignLoading={assignUser.isLoading}
        onUnassignLoading={unassignUser.isLoading}
        onUnassign={handleDeleteAssignee}
        onClose={() => setOpenAssignDialog(false)}
        users={users}
        assignedUsers={assignedUsers}
        useSync={handleSyncProgram}
        disabled={isPackageExpired}
      />

      <Hidden smUp>
        <Tooltip title={isPackageExpired ? "Package expired. Please renew to add new programs." : ""}>
          <span>
            <FloatBarAction 
              name="Program" 
              handleClick={handleAddProgram} 
              disabled={isPackageExpired}
            />
          </span>
        </Tooltip>
      </Hidden>

    </>
  );
};



export default ProgramList;