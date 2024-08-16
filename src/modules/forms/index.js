import React, { useState, useEffect } from 'react';
import {
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Typography,
    Paper,
    Button,
    Menu,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Snackbar,
    Hidden,
    Tooltip,
    Box,
    Avatar,

} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import useNavigateTo from '../components/useRouterPush';
import { useFetchForms, useCreateForm, useUpdateForm, useDeleteForm, getAllUserAndTrainerList, getAssignedFormList, assignUserToForms, unassignUserFromForms } from './hooks/useDynamicForms';
import { FloatBarAction } from '../components/FloatBarAction';
// import AssignDialog from "../program/AssignDialog";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import AssignDialougeForm from './componemts/AssignDialougeForm';
import AssignDialog from './AssignDialog';
import ResponseDialouge from './componemts/ResponseDialouge';

const DynamicFormsList = () => {
    const navigateTo = useNavigateTo();
    const { data: forms = [] } = useFetchForms();
    const createForm = useCreateForm();
    const updateForm = useUpdateForm();
    const deleteForm = useDeleteForm();
    const assignUser = assignUserToForms();
    const unassignUser = unassignUserFromForms();

    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedForm, setSelectedForm] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [renameDialogOpen, setRenameDialogOpen] = useState(false);
    const [newFormName, setNewFormName] = useState('');
    const [newFormDialogOpen, setNewFormDialogOpen] = useState(false);

    const [selectedProgram, setSelectedProgram] = useState(null);

    const [openAssignDialog, setOpenAssignDialog] = useState(false);
    const { data: users, isLoading: usersLoading, error: usersError, isFetched: usersFetched } = getAllUserAndTrainerList();
    const { data: assignedUsers, isLoading: assignedUsersLoading, error: assignedUsersError, isFetched: assignedUsersFetched } = getAssignedFormList(selectedProgram?.id);


    const [showResponseDialog, setShowResponseDialog] = useState(false);

    const onAssignClick = (programId) => {
        console.log("onAssignFormClick", programId);
        setSelectedProgram(programId);
        setOpenAssignDialog(true);
    };

    const onAssignFormClick = (id) => {
        console.log("onAssignFormClick", id);
        setSelectedProgram(id);
        setShowResponseDialog(true);
    }

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


    const handleMenuOpen = (event, form) => {
        setAnchorEl(event.currentTarget);
        setSelectedForm(form);
        //add the form nanme to the input field
        setNewFormName(form.form_name);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedForm(null);
    };

    const handleDelete = async () => {
        deleteForm.mutate(selectedForm.id, {
            onSuccess: () => {
                setDeleteDialogOpen(false);
            }
        });

    };

    const handleRename = async () => {

        updateForm.mutate({ id: selectedForm.id, form_name: newFormName }, {
            onSuccess: () => {
                setRenameDialogOpen(false);
                setNewFormName('');
            }
        });


    };


    const handleCreateNewForm = async () => {
        createForm.mutate({ form_name: newFormName }, {
            onSuccess: () => {
                setNewFormDialogOpen(false);
                setNewFormName('');
            }
        });
    }


    return (
        <>


            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                    <Typography variant="h4" gutterBottom>
                        Dynamic Forms
                    </Typography>
                </div>
                <div>
                    <Hidden smDown>
                        <Tooltip title={`Add New Form`} aria-label="add">

                            <Button
                                variant='contained'
                                color="primary"
                                startIcon={<AddIcon />}
                                onClick={() => setNewFormDialogOpen(true)}
                            >
                                Create New Form
                            </Button>
                        </Tooltip>
                    </Hidden>
                </div>
            </div>


            <Paper elevation={3} style={{ padding: '20px', margin: '20px auto' }}>



                <List sx={{ width: '100%' }}>
                    {forms.map((form) => (
                        <ListItem
                            key={form.id}
                            divider
                            sx={{
                                flexDirection: { xs: 'column', sm: 'row' },
                                alignItems: { xs: 'flex-start', sm: 'center' },
                                py: { xs: 2, sm: 1 },
                                px: { xs: 1, sm: 2 }
                            }}
                        >
                            <ListItemText
                                sx={{
                                    cursor: 'pointer',
                                    mb: { xs: 1, sm: 0 },
                                    width: '100%'
                                }}
                                onClick={() => navigateTo(`forms/${form.id}`)}
                                primary={
                                    <Typography
                                        variant='h6'
                                        color='primary'
                                        sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
                                    >
                                        {form.form_name}
                                    </Typography>
                                }
                                secondary={
                                    <Typography
                                        variant="body2"
                                        sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                                    >
                                        Last updated: {new Date(form.updated_at).toLocaleString()}
                                    </Typography>
                                }
                            />
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    width: { xs: '100%', sm: 'auto' },
                                    mt: { xs: 1, sm: 0 }
                                }}
                            >
                                <Button
                                    size='small'
                                    variant="contained"
                                    onClick={() => onAssignFormClick(form)}
                                    sx={{
                                        mr: { xs: 1, sm: 2 },
                                        fontSize: { xs: '0.75rem', sm: '0.875rem' }
                                    }}
                                >
                                    <AssignmentIndIcon sx={{ mr: 0.5, fontSize: { xs: '1rem', sm: '1.25rem' } }} />
                                    Responses
                                </Button>

                                <Button
                                    size='small'
                                    variant="contained"
                                    onClick={() => onAssignClick(form)}
                                    sx={{
                                        mr: { xs: 1, sm: 2 },
                                        fontSize: { xs: '0.75rem', sm: '0.875rem' }
                                    }}
                                >
                                    <AssignmentIndIcon sx={{ mr: 0.5, fontSize: { xs: '1rem', sm: '1.25rem' } }} />
                                    Assign
                                </Button>
                                <IconButton
                                    edge="end"
                                    onClick={(event) => handleMenuOpen(event, form)}
                                    sx={{ p: { xs: 0.5, sm: 1 } }}
                                >
                                    <MoreVertIcon sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }} />
                                </IconButton>
                            </Box>
                        </ListItem>
                    ))}
                </List>

                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                >
                    <MenuItem onClick={() => setRenameDialogOpen(true)}>
                        <EditIcon fontSize="small" style={{ marginRight: '8px' }} />
                        Rename
                    </MenuItem>
                    <MenuItem onClick={() => setDeleteDialogOpen(true)}>
                        <DeleteIcon fontSize="small" style={{ marginRight: '8px' }} />
                        Delete
                    </MenuItem>
                </Menu>

                <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                    <DialogTitle>Confirm Delete</DialogTitle>
                    <DialogContent>
                        Are you sure you want to delete "{selectedForm?.form_name}"?
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleDelete} color="error">Delete</Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={renameDialogOpen} onClose={() => setRenameDialogOpen(false)}>
                    <DialogTitle>Rename Form</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="New Form Name"
                            type="text"
                            fullWidth
                            value={newFormName}
                            onChange={(e) => setNewFormName(e.target.value)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setRenameDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleRename} color="primary">Rename</Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={newFormDialogOpen} onClose={() => setNewFormDialogOpen(false)}>
                    <DialogTitle>Create New Form</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Form Name"
                            type="text"
                            fullWidth
                            value={newFormName}
                            onChange={(e) => setNewFormName(e.target.value)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setNewFormDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleCreateNewForm} color="primary">Create</Button>
                    </DialogActions>
                </Dialog>


                <Hidden mdUp>
                    <FloatBarAction
                        name={"Form"}
                        handleClick={() => setNewFormDialogOpen(true)}
                    />
                </Hidden>

            </Paper>
            {/* 
            <AssignDialougeForm
                name={"Form"}
                programId={selectedForm?.id}
                open={openAssignDialog}
                onAssign={handleAssignConfirm}
                onAssignLoading={assignUser?.isLoading}
                onUnassignLoading={unassignUser.isLoading}
                onUnassign={handleDeleteAssignee}
                onClose={() => setOpenAssignDialog(false)}
                users={users}
                assignedUsers={assignedUsers}
            /> */}

            {selectedProgram?.id && <AssignDialog
                name={"Form New"}
                programId={selectedProgram?.id}
                open={openAssignDialog}
                onAssign={handleAssignConfirm}
                onAssignLoading={assignUser.isLoading}
                onUnassignLoading={unassignUser.isLoading}
                onUnassign={handleDeleteAssignee}
                onClose={() => setOpenAssignDialog(false)}
                users={users}
                assignedUsers={assignedUsers}

            />}

            {selectedProgram?.id && <ResponseDialouge
                name={"Form"}
                formConfig={selectedProgram?.form_data}
                formId={selectedProgram?.id}
                open={showResponseDialog}
                onClose={() => setShowResponseDialog(false)}
                users={users}
            />}

        </>
    );
};

export default DynamicFormsList;