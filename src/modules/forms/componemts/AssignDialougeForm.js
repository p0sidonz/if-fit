import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, List, ListItem,
  ListItemAvatar, ListItemText, Avatar, Button, Typography, Chip, Box,
  InputAdornment, IconButton, Divider, useTheme, alpha,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import {
  Search as SearchIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Close as CloseIcon
} from '@mui/icons-material';

const AssignDialougeForm = ({ name, open, onClose, onAssign, onUnassign, users, programId, onAssignLoading, onUnassignLoading, assignedUsers = [] }) => {
  console.log("AssignDialog -> assignedUsers", assignedUsers)
  const [program_id, setProgram_id] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState(users);
  const theme = useTheme();

  useEffect(() => {
    setFilteredUsers(
      users?.filter(user => 
        user.userInfo.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.userInfo.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.userInfo.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

  }, [searchTerm, users]);

  useEffect(()=>{
    setProgram_id(programId);
  }, [programId]);

  const handleAssign = (assignedId) => {
    onAssign(program_id, assignedId);
  };

  const handleUnassign = (assignedId) => {
    onUnassign(assignedId);
  };

  const isAssigned = (userId) =>  assignedUsers.some(assignment => assignment.id === userId);
  const getAssignedUser = (userId) => assignedUsers.find(assignment => assignment.id === userId);


  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        // bgcolor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
      }}>
        <Typography variant="h6">Manage {name} Users</Typography>
        <IconButton onClick={onClose} size="small" sx={{ color: 'inherit' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 3 }}
        />
        <List sx={{ maxHeight: 400, overflow: 'auto' }}>
          {filteredUsers?.map((user, index) => {
            const { userInfo } = user;
            const assigned = isAssigned(userInfo.id);
            const assignedUser = getAssignedUser(userInfo.id);
            return (
              <React.Fragment key={userInfo.id}>
                <ListItem
                  sx={{
                    borderRadius: 1,
                    mb: 1,
                    transition: 'all 0.3s',
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.05),
                    },
                  }}
                >
                  <ListItemAvatar>
                    <Avatar 
                      sx={{ 
                        bgcolor: assigned ? theme.palette.success.main : theme.palette.primary.main,
                        color: '#fff',
                      }}
                    >
                      {userInfo.first_name[0]}{userInfo.last_name[0]}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center">
                        <Typography variant="subtitle1">
                          {userInfo.first_name} {userInfo.last_name}
                        </Typography>
                        {/* {assigned && (
                          <Chip
                            label="Assigned"
                            color="success"
                            size="small"
                            sx={{ ml: 1 }}
                          />
                        )} */}
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.secondary"
                          sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}
                        >
                          <EmailIcon fontSize="small" sx={{ mr: 0.5 }} />
                          {userInfo.email}
                        </Typography>
                        {userInfo.contact && (
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.secondary"
                            sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}
                          >
                            <PhoneIcon fontSize="small" sx={{ mr: 0.5 }} />
                            {userInfo.contact}
                          </Typography>
                        )}
                      </Box>
                    }
                  />
                  <LoadingButton
                    loading={onAssignLoading || onUnassignLoading}
                    variant={assigned ? "outlined" : "contained"}
                    color={assigned ? "error" : "primary"}
                    onClick={() => assigned ? handleUnassign(assignedUser?.AssignedForms[0]?.id) : handleAssign(user?.userInfo?.id)}
                    sx={{ minWidth: 100 }}
                  >
                    {assigned ? "Unassign" : "Assign"}
                  </LoadingButton>
                </ListItem>
                {index < filteredUsers.length - 1 && <Divider variant="inset" component="li" />}
              </React.Fragment>
            );
          })}
        </List>
      </DialogContent>
      <DialogActions sx={{ p: 2,  }}>
        <Button onClick={onClose} variant="contained">Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssignDialougeForm;