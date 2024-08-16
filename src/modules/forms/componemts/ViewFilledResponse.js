
import React from 'react';
import { Dialog, DialogTitle, DialogContent, List, ListItem, ListItemText, Typography } from '@mui/material';
import { useEffect } from 'react';
import { FormLabel, TextField, Select, MenuItem, FormControl, FormControlLabel, Checkbox, RadioGroup, Radio, FormHelperText, DialogActions, Button } from '@mui/material';
import DatePicker from "react-datepicker";
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker';



const ViewFilledResponse = ({open, onClose, values, user, rawForm}) => {
    const [formConfig, setFormConfig] = React.useState([]);
    const [response, setResponse] = React.useState([]);
    console.log("ViewFilledResponse", values);
    useEffect(() => {
        if (rawForm) {
            try {
                setFormConfig(JSON.parse(rawForm));
            } catch (error) {
                console.error("Error parsing form data:", error);
                setFormConfig([]);
            }
        } else {
            setFormConfig([]);
        }
    }, [rawForm]);

    const RenderPreviewField = (field, value, onChange, readOnly= true) => {
        switch (field.widget) {
            case 'input':
                return <TextField disabled={readOnly} fullWidth value={value} onChange={onChange} />;
            case 'textarea':
                return <TextField disabled={readOnly}  fullWidth multiline rows={4} value={value} onChange={onChange} />;
            case 'number':
                return <TextField disabled={readOnly}  fullWidth type="number" value={value} onChange={onChange} />;
            case 'select':
                return (
                    <Select disabled={readOnly}  fullWidth value={value} onChange={onChange}>
                        {field.options.map((option, index) => (
                            <MenuItem key={index} value={option}>{option}</MenuItem>
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
                                control={<Checkbox disabled={readOnly}  checked={value.includes(option)} onChange={(e) => {
                                    const newValue = e.target.checked
                                        ? [...value, option]
                                        : value.filter(v => v !== option);
                                    onChange({ target: { value: newValue } });
                                }} />}
                                label={option}
                            />
                        ))}
                    </FormControl>
                );
            case 'radio':
                return (
                    <FormControl component="fieldset">
                        <FormLabel component="legend">{field.label}</FormLabel>
                        <RadioGroup disabled={readOnly}  value={value} onChange={onChange}>
                            {field.options.map((option, index) => (
                                <FormControlLabel
                                    key={index}
                                    value={option}
                                    control={<Radio />}
                                    label={option}
                                />
                            ))}
                        </RadioGroup>
                    </FormControl>
                );
            case 'date-picker':
                return (
                    <DatePickerWrapper>
                        <DatePicker
                            disabled={readOnly} 
                            selected={value}
                            onChange={(date) => onChange({ target: { value: date } })}
                            dateFormat="MMMM d, yyyy"
                        />
                    </DatePickerWrapper>
                );
            case 'time-picker':
                return (
                    <DatePickerWrapper>
                        <DatePicker
                            disabled={readOnly} 
                            selected={value}
                            onChange={(date) => onChange({ target: { value: date } })}
                            showTimeSelect
                            showTimeSelectOnly
                            timeIntervals={15}
                            timeCaption="Time"
                            dateFormat="h:mm aa"
                        />
                    </DatePickerWrapper>
                );
            default:
                return null;
        }
    };


    useEffect(()=> {
       if(values?.length > 0) {
        setResponse(JSON.parse(values[0]?.response_data));
       }

    }, [values]);
    
    if(!values || values.length === 0) return null;

    return (
        <div>
            <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{sx: {borderRadius: 2, boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',}}}>
                <DialogTitle>
                    <Typography variant="h6" color="textPrimary">
                       Viewing : {user?.userInfo.first_name} {user?.userInfo.last_name}
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    {formConfig?.map((field) => (
                        <div key={field.key}>
                            <FormLabel>{field.label}</FormLabel>
                            {RenderPreviewField(
                                field,
                                response?.[field.key] || '',
                            )}
                        </div>
                    ))}
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </div>
    );

}

export default ViewFilledResponse;