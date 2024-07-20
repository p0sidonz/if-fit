import React, { useState } from 'react';
import { Box, TextField, Typography } from '@mui/material';


const EditableText = ({ text, onChange }) => {

    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(text);

    const handleTextChange = (e) => {
        setValue(e.target.value);
    };

    const handleTextBlur = () => {
        setIsEditing(false);
        onChange(value);
    };

    const handleTextClick = () => {
        setIsEditing(true);
    };

    return (
        <Box>
            {isEditing ? (
                <TextField
                    sx={{
                        overflow: 'hidden', mx: 4,
                        py: 4, width: '98%',
                    }}
                    fullWidth
                    multiline
                    rows={4}
                    value={value}
                    onChange={handleTextChange}
                    onBlur={handleTextBlur}
                    autoFocus
                />
            ) : (
                <Typography
                    color={value ? 'textPrimary' : 'textSecondary'}
                    variant="subtitle2"
                    onClick={handleTextClick}
                    sx={{
                        widows: '90%',
                        mx: 4,
                        py: 4,
                        padding: '10px',
                        borderRadius: '6px',
                        cursor: 'pointer'
                    }}
                >
                    {value || 'Click to add a note'}
                </Typography>
            )}
        </Box>
    );



}

export default EditableText;