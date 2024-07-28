import React from 'react';
import { styled } from '@mui/material/styles';
import { Card, CardContent, CardActions, Typography, Box, Button, Avatar, IconButton, Menu, MenuItem, Chip } from '@mui/material';
import Link from 'next/link';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';


const StyledCard = styled(Card)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: theme.shadows[3],
    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: theme.shadows[10],
    },
}));

const CardHeader = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
}));

const CardBody = styled(Box)(({ theme }) => ({
    flexGrow: 1,
    marginBottom: theme.spacing(2),
}));

const CardFooter = styled(Box)(({ theme }) => ({
    borderTop: `1px solid ${theme.palette.divider}`,
    padding: theme.spacing(2),
}));

const UnifiedCard = ({ title, description, icon: IconComponent, content, footerContent, onNavigate, onAssign, onDelete, menuItems }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleMenuClick = (event) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <StyledCard>
            <CardContent sx={{ flexGrow: 1, cursor: 'pointer', padding: 3 }} onClick={onNavigate}>
                <CardHeader>
                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                        <IconComponent />
                    </Avatar>
                    <Typography variant="h5" component="div" fontWeight="bold">
                        <Link href={onNavigate} passHref legacyBehavior>
                            <a style={{ textDecoration: 'none', color: 'inherit' }}>
                                {title}
                            </a>
                        </Link>
                    </Typography>
                    {menuItems && (
                        <>
                            <IconButton
                                sx={{ marginLeft: 'auto' }}
                                onClick={handleMenuClick}
                            >
                                <MoreVertIcon />
                            </IconButton>
                            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                                {menuItems.map((item, index) => (
                                    <MenuItem key={index} onClick={() => { item.onClick(); handleMenuClose(); }}>
                                        {item.label}
                                    </MenuItem>
                                ))}
                            </Menu>
                        </>
                    )}
                </CardHeader>

                <CardBody>
                    <Typography variant="body2" color="text.secondary" mb={2}>
                        {description}
                    </Typography>
                    {content}
                </CardBody>

                {footerContent}
            </CardContent>

            <CardFooter>
                <Box display="flex" justifyContent="space-between">
                    {onAssign && (
                        <Button
                            onClick={onAssign}
                            startIcon={<AssignmentIndIcon />}
                            color="primary"
                            variant="contained"
                            size="small"
                        >
                            Assign
                        </Button>
                    )}
                    {onDelete && (
                        <Button
                            onClick={onDelete}
                            startIcon={<DeleteIcon />}
                            color="error"
                            variant="outlined"
                            size="small"
                        >
                            Delete
                        </Button>
                    )}
                </Box>
            </CardFooter>
        </StyledCard>
    );
};

export default UnifiedCard;