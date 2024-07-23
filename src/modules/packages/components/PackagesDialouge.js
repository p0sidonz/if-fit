const { default: TrainerPackageForm } = require("./TrainerPackageForm");
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';


const PackagesDialouge = ({ open, handleClose, packageData }) => {
    return (
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title"></DialogTitle>
            <DialogContent>
                <TrainerPackageForm initialData={packageData} onSuccess={handleClose} />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default PackagesDialouge;