import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormLabel,
    MenuItem,
    Radio,
    RadioGroup,
    Select,
    TextField,
    Grid
} from '@mui/material';
import { useEffect, useState } from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import {useCreateFormResponse, useGetResponseById, useUpdateFormResponse} from 'src/modules/forms/hooks/useDynamicForms';

const RenderPreviewField = (field, value, onChange, readOnly= false) => {
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

const RenderFormTrainee = ({ form, userId, readOnly = false }) => {
    const [open, setOpen] = useState(false);
    const [formConfig, setFormConfig] = useState([]);
    const [formValues, setFormValues] = useState({});
    const createFormResponse = useCreateFormResponse();
    const updateFormResponse = useUpdateFormResponse();
    const { data: responseData, refetch: refetchResponse } = useGetResponseById(form.formInfo?.id);

    useEffect(() => {
        if (form && form.formInfo && form.formInfo.form_data) {
            try {
                setFormConfig(JSON.parse(form.formInfo.form_data));
            } catch (error) {
                console.error("Error parsing form data:", error);
                setFormConfig([]);
            }
        } else {
            setFormConfig([]);
        }
    }, [form]);

    useEffect(() => {
        refetchResponse();
    }, [form?.formInfo?.id, refetchResponse]);

    useEffect(() => {
        if (responseData && responseData.length > 0) {
            console.log('Response data:', responseData);
            const response = responseData[0]; // Get the first (and presumably only) response
            try {
                const parsedResponse = JSON.parse(response.response_data);
                setFormValues(parsedResponse);
            } catch (error) {
                console.error("Error parsing response data:", error);
                setFormValues({});
            }
        } else {
            setFormValues({});
        }
    }, [responseData]);

    const handleSubmit = async () => {
        const responseDataNew = {
            form_id: form.formInfo.id,
            user_id: userId,
            response_data: JSON.stringify(formValues)
        };
    
        let ifExisting = responseData && responseData.length > 0
       // Check if an existing response is being updated
        if (ifExisting) {
            // Update the existing response
            try {
                await updateFormResponse.mutateAsync({...responseDataNew, id: responseData[0].id});
                setOpen(false);
                refetchResponse();  // Assuming this function refreshes the data
            } catch (error) {
                console.error('Error updating form response:', error);
            }
        } else {
            // Handle the creation of a new response if needed
            try {
                await createFormResponse.mutateAsync(responseDataNew);
                setOpen(false);
                refetchResponse();
            } catch (error) {
                console.error('Error submitting form:', error);
            }
        }
    };

    
    const handleChange = (field) => (event) => {
        setFormValues(prev => ({ ...prev, [field.key]: event.target.value }));
    };

    const existingResponse = responseData && responseData.length > 0;

    return (
        <>
            <Button 
                onClick={() => setOpen(true)} 
                variant="contained"
                size="small"
                sx={{
                    borderRadius: '16px',
                    height: '25px',
                    textTransform: 'none',
                    fontSize: '12px',
                    ml: 1,
                    borderColor: 'primary.main',
                    '&:hover': {
                        backgroundColor: 'primary.light',
                        borderColor: 'primary.main'
                    }
                }}
            >
                {existingResponse ? 'Edit Response' : 'Fill Form'}
            </Button>
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>
                    {existingResponse ? 'Edit Your Response' : 'Please Fill the Form'}
                </DialogTitle>
                <DialogContent>
                    {formConfig.map((field) => (
                        <div key={field.key}>
                            <FormLabel>{field.label}</FormLabel>
                            {RenderPreviewField(
                                field,
                                formValues[field.key] || '',
                                handleChange(field)
                            )}
                        </div>
                    ))}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} color="secondary">
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleSubmit} 
                        color="primary"
                        disabled={createFormResponse.isLoading}
                    >
                        {createFormResponse.isLoading ? 'Submitting...' : (existingResponse ? 'Update' : 'Submit')}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default RenderFormTrainee;


