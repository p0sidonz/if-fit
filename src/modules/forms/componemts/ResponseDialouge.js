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
import { useGetResponseByFormId } from 'src/modules/forms/hooks/useDynamicForms';
import ViewFilledResponse from './ViewFilledResponse';


const ResponseDialouge = ({ name, open, onClose, users, formId, formConfig }) => {
    const [openUserResponse, setOpenUserResponse] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const { data: responses, isLoading, refetch, status } = useGetResponseByFormId(formId);
    const [form_id, setForm_id] = useState(null);
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
        setForm_id(formId);
    }, [formId]);

    const isFormAssigned = (userId) => responses?.some(assignment => assignment.user_id === userId);
    const getAssignedFormedUser = (userId) => responses?.find(assignment => assignment.user_id === userId);

    const onClickViewResponse = (user) => {
        setSelectedUser(user);
        setOpenUserResponse(true);
    }

    const onCloseUserResponse = () => {
        setOpenUserResponse(false);
        setSelectedUser(null);
    }


    return (
        <>
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
                <DialogTitle>
                    <Typography variant="h6" color="textPrimary">
                        {name}
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Search by name or email"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <List>
                        {filteredUsers?.map((user) => (
                            <ListItem key={user.id}>
                                <ListItemAvatar>
                                    <Avatar src={user.userInfo.profile_pic} />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={`${user.userInfo.first_name} ${user.userInfo.last_name}`}
                                    secondary={user.userInfo.email}
                                />
                                <Box sx={{ ml: 'auto' }}>
                                    <Button
                                        disabled={!isFormAssigned(user.userInfo.id)}
                                        variant={!isFormAssigned(user.userInfo.id) ? 'text' : 'contained'}
                                        color="primary"
                                        onClick={() => onClickViewResponse(user)}
                                    >
                                        {isFormAssigned(user.userInfo.id) ? 'View Response' : 'Not filled'}
                                    </Button>
                                </Box>
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="primary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>

            <ViewFilledResponse
                rawForm={formConfig}
                form={form_id}
                open={openUserResponse}
                onClose={onCloseUserResponse}
                values={responses?.filter(response => response?.user_id === selectedUser?.userInfo.id)}
                user={selectedUser}
            />

        </>
    );
}

export default ResponseDialouge;