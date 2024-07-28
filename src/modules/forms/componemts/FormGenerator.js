import React, { useState } from 'react';
import {
  Button,
  TextField,
  Select,
  MenuItem,
  Checkbox,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  InputLabel,
  Grid,
  Card,
  CardActions,
  CardContent,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Save as SaveIcon,
  FileCopy as FileCopyIcon,
} from '@mui/icons-material';

const FormBuilderComponent = () => {
  const [formConfig, setFormConfig] = useState([]);
  const [selectedField, setSelectedField] = useState(null);
  const [newOption, setNewOption] = useState('');
  const [previewVisible, setPreviewVisible] = useState(false);

  const addField = (fieldType) => {
    const newField = {
      key: `field_${Date.now()}`,
      label: `New ${fieldType} Field`,
      widget: fieldType,
      required: false,
    };
    if (['select', 'radio', 'checkbox'].includes(fieldType)) {
      newField.options = ['Option 1', 'Option 2', 'Option 3'];
    }
    if (['radio', 'checkbox'].includes(fieldType)) {
      newField.columns = 1;
    }
    setFormConfig([...formConfig, newField]);
  };

  const updateField = (key, updatedField) => {
    setFormConfig(
      formConfig.map((field) =>
        field.key === key ? { ...field, ...updatedField } : field
      )
    );
    setSelectedField((prev) =>
      prev && prev.key === key ? { ...prev, ...updatedField } : prev
    );
  };

  const deleteField = (key) => {
    setFormConfig(formConfig.filter((field) => field.key !== key));
    setSelectedField(null);
  };

  const addOption = () => {
    if (newOption.trim()) {
      const updatedOptions = [...(selectedField.options || []), newOption.trim()];
      updateField(selectedField.key, { options: updatedOptions });
      setNewOption('');
    }
  };

  const deleteOption = (option) => {
    const updatedOptions = selectedField.options.filter((opt) => opt !== option);
    updateField(selectedField.key, { options: updatedOptions });
  };

  const renderFieldButtons = () => {
    const fieldTypes = [
      { label: 'Text', type: 'input' },
      { label: 'Textarea', type: 'textarea' },
      { label: 'Number', type: 'number' },
      { label: 'Select', type: 'select' },
      { label: 'Checkbox', type: 'checkbox' },
      { label: 'Radio', type: 'radio' },
      { label: 'Date', type: 'date-picker' },
      { label: 'Time', type: 'time-picker' },
    ];

    return (
      <Box display="flex" flexDirection="column" gap={1}>
        {fieldTypes.map((field) => (
          <Button
            size='small'
            key={field.type}
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => addField(field.type)}
          >
            Add {field.label} Field
          </Button>
        ))}
      </Box>
    );
  };

  const renderFormFields = () => {
    return formConfig.map((field) => (
      <Card key={field.key} variant="outlined" sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6">{field.label}</Typography>
          <Typography variant="body2">Type: {field.widget}</Typography>
        </CardContent>
        <CardActions>
          <IconButton onClick={() => setSelectedField(field)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => deleteField(field.key)}>
            <DeleteIcon />
          </IconButton>
        </CardActions>
      </Card>
    ));
  };

  const renderFieldEditor = () => {
    if (!selectedField) return null;

    return (
      <Card sx={{ mt: 2 }}>
        <CardContent>
          <Typography variant="h6">Edit Field</Typography>
          <TextField
            label="Label"
            value={selectedField.label}
            onChange={(e) => updateField(selectedField.key, { label: e.target.value })}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Key"
            value={selectedField.key}
            onChange={(e) => updateField(selectedField.key, { key: e.target.value })}
            fullWidth
            sx={{ mb: 2 }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={selectedField.required}
                onChange={(e) => updateField(selectedField.key, { required: e.target.checked })}
              />
            }
            label="Required"
          />
          {['select', 'radio', 'checkbox'].includes(selectedField.widget) && (
            <>
              <Box display="flex" alignItems="center" gap={1} sx={{ mb: 2 }}>
                <TextField
                  label="New Option"
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                  fullWidth
                />
                <Button variant="contained" onClick={addOption}>
                  Add
                </Button>
              </Box>
              <List>
                {selectedField.options.map((option, index) => (
                  <ListItem key={index} secondaryAction={
                    <IconButton edge="end" onClick={() => deleteOption(option)}>
                      <DeleteIcon />
                    </IconButton>
                  }>
                    <ListItemText primary={option} />
                  </ListItem>
                ))}
              </List>
            </>
          )}
          {['radio', 'checkbox'].includes(selectedField.widget) && (
            <TextField
              label="Columns"
              type="number"
              value={selectedField.columns}
              onChange={(e) => updateField(selectedField.key, { columns: parseInt(e.target.value, 10) })}
              fullWidth
              sx={{ mt: 2 }}
            />
          )}
        </CardContent>
      </Card>
    );
  };

  const handlePreview = () => {
    setPreviewVisible(true);
  };

  const handleSave = () => {
    const formData = JSON.stringify(formConfig, null, 2);
    const blob = new Blob([formData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'form_config.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyJSON = () => {
    const formData = JSON.stringify(formConfig, null, 2);
    navigator.clipboard.writeText(formData).then(() => {
      alert('Form configuration copied to clipboard!');
    });
  };

  const renderPreviewField = (field) => {
    switch (field.widget) {
      case 'input':
        return <TextField fullWidth />;
      case 'textarea':
        return <TextField fullWidth multiline rows={4} />;
      case 'number':
        return <TextField type="number" fullWidth />;
      case 'select':
        return (
          <Select fullWidth>
            {field.options.map((option, index) => (
              <MenuItem key={index} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        );
      case 'checkbox':
        return (
          <FormControl component="fieldset">
            <FormLabel component="legend">{field.label}</FormLabel>
            {field.options.map((option, index) => (
              <FormControlLabel
                key={index}
                control={<Checkbox />}
                label={option}
              />
            ))}
          </FormControl>
        );
      case 'radio':
        return (
          <FormControl component="fieldset">
            <FormLabel component="legend">{field.label}</FormLabel>
            <RadioGroup row={field.columns > 1}>
              {field.options.map((option, index) => (
                <FormControlLabel
                  key={index}
                  control={<Radio />}
                  label={option}
                  value={option}
                />
              ))}
            </RadioGroup>
          </FormControl>
        );
      case 'date-picker':
        return <TextField type="date" fullWidth />;
      case 'time-picker':
        return <TextField type="time" fullWidth />;
      default:
        return null;
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Form Builder
      </Typography>
      <Grid container spacing={2}>
        <Grid item  xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Add Fields</Typography>
              {renderFieldButtons()}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Form Preview</Typography>
              {renderFormFields()}
            </CardContent>
            <CardActions>
              <Button startIcon={<VisibilityIcon />} onClick={handlePreview}>
                Preview
              </Button>
              <Button startIcon={<SaveIcon />} onClick={handleSave}>
                Save
              </Button>
              {/* <Button startIcon={<FileCopyIcon />} onClick={handleCopyJSON}>
                Copy JSON
              </Button> */}
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          {renderFieldEditor()}
        </Grid>
      </Grid>
      <Dialog
        open={previewVisible}
        onClose={() => setPreviewVisible(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Form Preview</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {formConfig.map((field) => (
              <Grid item xs={12} key={field.key}>
                <FormControl fullWidth>
                  <FormLabel>{field.label}</FormLabel>
                  {renderPreviewField(field)}
                </FormControl>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewVisible(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FormBuilderComponent;
