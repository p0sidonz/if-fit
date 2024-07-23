import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import ReactDraftWysiwyg from 'src/@core/components/react-draft-wysiwyg'
// ** Styled Component Imports
import { EditorWrapper } from 'src/@core/styles/libs/react-draft-wysiwyg'

import axios from 'axios';

const TrainerPackageForm = ({ packageId, initialData, onSuccess }) => {
  const [formData, setFormData] = useState(initialData || {
    title: '',
    description: '',
    validity: 0,
    amount: 0,
    is_free: false,
    currency: '',
    category: '',
    session_count: 0,
    features: '',
    discount: 0,
    rating: 0,
    reviews: '',
    image: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const url = packageId ? `/api/trainer-packages/${packageId}` : '/api/trainer-packages';
    const method = packageId ? 'patch' : 'post';
    
    axios[method](url, formData).then(response => {
      onSuccess(response.data);
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        {packageId ? 'Update Trainer Package' : 'Create Trainer Package'}
      </Typography>
      <TextField name="title" label="Title" value={formData.title} onChange={handleChange} fullWidth margin="normal" required />
      {/* <EditorWrapper
        sx={{
          '& .rdw-editor-wrapper': {
            border: '0 !important'
          },
          '& .rdw-editor-toolbar': {
            p: '0.35rem 1rem !important',
            '& .rdw-option-wrapper': {
              minWidth: '1.25rem',
              borderRadius: '4px !important'
            },
            '& .rdw-inline-wrapper, & .rdw-text-align-wrapper': {
              mb: 0
            }
          },
          '& .rdw-editor-main': {
            px: '1.25rem'
          }
        }}
      >
        <ReactDraftWysiwyg
          required
          editorState={formData.description}
          onEditorStateChange={(editorState) => setFormData({ ...formData, description: editorState })}
          placeholder='Description'
          toolbar={{
            options: ['inline', 'textAlign'],
            inline: {
              inDropdown: false,
              options: ['bold', 'italic', 'underline', 'strikethrough']
            }
          }}
        />
      </EditorWrapper> */}

      {/* <TextField name="description" label="Description" value={formData.description} onChange={handleChange} fullWidth margin="normal" required /> */}
      <TextField name="validity" label="Validity (days)" value={formData.validity} onChange={handleChange} fullWidth margin="normal" type="number" required />
      <TextField name="amount" label="Amount" value={formData.amount} onChange={handleChange} fullWidth margin="normal" type="number" required />
      <TextField name="currency" label="Currency" value={formData.currency} onChange={handleChange} fullWidth margin="normal" required />
      <TextField name="category" label="Category" value={formData.category} onChange={handleChange} fullWidth margin="normal" />
      <TextField name="session_count" label="Session Count" value={formData.session_count} onChange={handleChange} fullWidth margin="normal" type="number" />
      <TextField name="features" label="Features" value={formData.features} onChange={handleChange} fullWidth margin="normal" />
      <TextField name="discount" label="Discount" value={formData.discount} onChange={handleChange} fullWidth margin="normal" type="number" />
      <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
        {packageId ? 'Update Package' : 'Create Package'}
      </Button>
    </Box>
  );
};

export default TrainerPackageForm;