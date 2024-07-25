import React, { useEffect, useState } from 'react';
import TrainerPackageForm  from "./TrainerPackageForm";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle , Typography, 

} from '@mui/material';
import { useCreateTrainerPackage, useUpdateTrainerPackage , useTrainerPackageById} from '../hooks/usePackages';

const PackagesDialog = ({ open, handleClose, trainerPackage }) => {
    const [formData, setFormData] = useState({
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

    const createPackage = useCreateTrainerPackage();
    const updatePackage = useUpdateTrainerPackage();

    useEffect(() => {
        if (trainerPackage) {
          setFormData(trainerPackage);
        } else {
          resetFormData();
        }
      }, [trainerPackage]);

    const resetFormData = () => {
        setFormData({
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
    };

    const handleSubmit = () => {
        if (trainerPackage && trainerPackage.id) {
            updatePackage.mutate({ newData: formData, id: trainerPackage.id });
        } else {
          createPackage.mutate(formData);
        }
        handleClose();
      };


    return (
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">
                <Typography  gutterBottom>
                    {formData.id ? 'Update Trainer Package' : 'Create Trainer Package'}
                </Typography>
            </DialogTitle>
            <DialogContent>
            <TrainerPackageForm formData={formData} setFormData={setFormData} />

            </DialogContent>
            <DialogActions>
                <Button onClick={handleSubmit} color="primary">
                    {formData.id ? 'Update' : 'Create'}
                </Button>
                <Button onClick={handleClose} color="primary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default PackagesDialog;

