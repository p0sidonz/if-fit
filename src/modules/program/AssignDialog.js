import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, List, ListItem,
  ListItemAvatar, ListItemText, Avatar, Button, Typography, Chip, Box,
  InputAdornment, IconButton, Divider, useTheme, alpha, FormControlLabel,
  Select,
  Switch,
  Tooltip,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import {
  Search as SearchIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import { GET_AVATAR_COMPRESSED_URL } from 'src/utils/utils';

const AssignDialog = ({ name, open, onClose, onAssign, onUnassign, users, programId, onAssignLoading, onUnassignLoading,isLoading, assignedUsers = [], useSync, disabled }) => {
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

  useEffect(() => {
    setProgram_id(programId);
  }, [programId]);

  const handleAssign = (assignedId) => {
    onAssign(program_id, assignedId);
  };

  const handleUnassign = (assignedId) => {
    onUnassign(assignedId);
  };

  const isAssigned = (userId) => assignedUsers.some(assignment => assignment.relationInfo.userInfo.id === userId);
  const getAssignedUser = (userId) => assignedUsers.find(assignment => assignment.relationInfo.userInfo.id === userId);


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
                    borderRadius: 2,
                    mb: 2,
                    transition: 'all 0.3s',
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      transform: 'translateY(-2px)',
                      boxShadow: 1,
                    },
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: { xs: 'flex-start', md: 'center' },
                    py: 2,
                    px: 3,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mb: { xs: 2, md: 0 } }}>
                    <ListItemAvatar>
                      <Avatar
                        src={GET_AVATAR_COMPRESSED_URL(userInfo.avatar?.avatar_compressed)} // Add this prop if available
                        sx={{
                          bgcolor: assigned ? theme.palette.success.main : theme.palette.primary.main,
                          color: '#fff',
                          width: 60,
                          height: 60,
                        }}
                      >
                        {!userInfo.profilePicture && `${userInfo.first_name[0]}${userInfo.last_name[0]}`}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center">
                          <Typography variant="h6" sx={{ mr: 1 }}>
                            {userInfo.first_name} {userInfo.last_name}
                          </Typography>
                          <Tooltip title={assigned ? "Assigned" : "Unassigned"}>
                            <Box
                              component="span"
                              sx={{
                                width: 10,
                                height: 10,
                                borderRadius: '50%',
                                bgcolor: assigned ? 'success.main' : 'grey.400',
                              }}
                            />
                          </Tooltip>
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              mt: 1,
                              wordBreak: 'break-word'
                            }}
                          >
                            <EmailIcon fontSize="small" sx={{ mr: 1, flexShrink: 0 }} />
                            {userInfo.email}
                          </Typography>
                          {userInfo.contact && (
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                mt: 1,
                              }}
                            >
                              <PhoneIcon fontSize="small" sx={{ mr: 1, flexShrink: 0 }} />
                              {userInfo.contact}
                            </Typography>
                          )}
                        </Box>
                      }
                    />
                    {assigned && (
                      <Box sx={{ display: 'flex', alignItems: 'center', typography: 'body2', color: 'text.secondary' }}>
                        <AccessTimeIcon fontSize="small" sx={{ mr: 1 }} />
                        Assigned: {new Date(assignedUser?.created_at).toLocaleDateString()}
                      </Box>
                    )}
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mt: { xs: 2, md: 0 } }}>
                    {assigned && (
                      <Tooltip title="If enabled, it will sync all your changes in real-time to assigned user" placement="top">
                        <FormControlLabel
                          sx={{m: 2}}
                          control={
                            <Switch
                              size="small"
                              disabled={isLoading}
                              checked={assignedUser?.shoudsync}
                              onChange={(e) => useSync(assignedUser?.id, e.target.checked)}
                            />
                          }
                          label={<Typography variant="body2" color="text.secondary">Sync</Typography>}
                          labelPlacement="start"
                        />
                      </Tooltip>
                    )}
                    <LoadingButton
                      size='small'
                      loading={isLoading}
                      variant={assigned ? "outlined" : "contained"}
                      color={assigned ? "error" : "primary"}
                      onClick={() => assigned ? handleUnassign(assignedUser?.id) : handleAssign(user?.id)}
                      startIcon={assigned ? <PersonRemoveIcon /> : <PersonAddIcon />}
                      sx={{ ml: 2 }}
                    >
                      {assigned ? "Unassign" : "Assign"}
                    </LoadingButton>
                  </Box>
                </ListItem>
                {index < filteredUsers.length - 1 && <Divider />}
              </React.Fragment>
            );
          })}
        </List>
      </DialogContent>
      <DialogActions sx={{ p: 2, }}>
        <Button onClick={onClose} variant="contained">Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssignDialog;