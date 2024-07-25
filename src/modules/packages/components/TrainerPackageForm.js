import React, { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic'

import { TextField, Button, Box, Typography } from '@mui/material';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorWrapper } from 'src/@core/styles/libs/react-draft-wysiwyg';
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
const Editor = dynamic(
  () => import('react-draft-wysiwyg').then((mod) => mod.Editor),
  { ssr: false }
)
import { InputAdornment, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const TrainerPackageForm = ({ formData, setFormData }) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const initialLoad = useRef(true);

  const currencies = [
    { value: 'USD', label: '$ (USD)' },
    { value: 'EUR', label: '€ (EUR)' },
    { value: 'INR', label: '₹ (INR)' },
  ];


  const categories = ['Fitness', 'Nutrition', 'Yoga', 'Personal Training', 'Other'];



  useEffect(() => {
    if (initialLoad.current && formData.description) {
      try {
        const contentState = convertFromRaw(JSON.parse(formData.description));
        setEditorState(EditorState.createWithContent(contentState));
      } catch (error) {
        console.error('Error parsing description:', error);
        setEditorState(EditorState.createEmpty());
      }
      initialLoad.current = false;
    }
  }, [formData.description]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    let parsedValue = value;

    if (type === 'number') {
      parsedValue = value === '' ? '' : Number(value);
    }

    setFormData({ ...formData, [name]: parsedValue });
  };

  const onEditorStateChange = (newEditorState) => {
    setEditorState(newEditorState);
    const contentRaw = JSON.stringify(convertToRaw(newEditorState.getCurrentContent()));
    setFormData({ ...formData, description: contentRaw });
  };

  return (
    <Box sx={{ width: '100%', margin: 'auto' }}>
      <TextField
        name="title"
        label="Title"
        value={formData.title}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />
      <EditorWrapper
        sx={{
          '& .rdw-editor-wrapper': {
            border: '1px solid #ccc',
            borderRadius: '4px',
            overflow: 'hidden'
          },
          '& .rdw-editor-toolbar': {
            p: '0.35rem 1rem !important',
            borderBottom: '1px solid #ccc',
            '& .rdw-option-wrapper': {
              minWidth: '1.25rem',
              borderRadius: '4px !important'
            },
            '& .rdw-inline-wrapper, & .rdw-text-align-wrapper': {
              mb: 0
            }
          },
          '& .rdw-editor-main': {
            px: '1.25rem',
            minHeight: '200px'
          }
        }}
      >
        <Editor
          editorState={editorState}
          onEditorStateChange={onEditorStateChange}
          toolbar={{
            options: ['inline', 'blockType', 'fontSize', 'list', 'textAlign', 'history'],
            inline: { inDropdown: false },
            list: { inDropdown: true },
            textAlign: { inDropdown: true },
          }}
        />
      </EditorWrapper>

      <TextField
        name="validity"
        label="Validity (days)"
        value={formData.validity}
        onChange={handleChange}
        fullWidth
        margin="normal"
        type="number"
        required
        InputProps={{
          endAdornment: <InputAdornment position="end">days</InputAdornment>,
        }}
      />
      <TextField
        name="amount"
        label="Amount"
        value={formData.amount}
        onChange={handleChange}
        fullWidth
        margin="normal"
        type="number"
        required
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              {formData.currency === 'USD' ? '$' : formData.currency === 'EUR' ? '€' : '₹'}
            </InputAdornment>
          ),
        }}
      />
      <FormControl fullWidth margin="normal">
        <InputLabel>Currency</InputLabel>
        <Select
          name="currency"
          value={formData.currency}
          onChange={handleChange}
          required
        >
          {currencies.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth margin="normal">
        <InputLabel>Category</InputLabel>
        <Select
          name="category"
          value={formData.category}
          onChange={handleChange}
        >
          {categories.map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        name="session_count"
        label="Session Count"
        value={formData.session_count}
        onChange={handleChange}
        fullWidth
        margin="normal"
        type="number"
        InputProps={{
          endAdornment: <InputAdornment position="end">sessions</InputAdornment>,
        }}
      />
      <TextField
        name="features"
        label="Features"
        value={formData.features}
        onChange={handleChange}
        fullWidth
        margin="normal"
        multiline
        rows={3}
        placeholder="Enter package features, one per line"
      />
      <TextField
        name="discount"
        label="Discount"
        value={formData.discount}
        onChange={handleChange}
        fullWidth
        margin="normal"
        type="number"
        InputProps={{
          endAdornment: <InputAdornment position="end">%</InputAdornment>,
        }}
      />


    </Box>
  );
};
export default TrainerPackageForm