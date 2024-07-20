// ** React Imports
import { forwardRef, Fragment, useState } from "react";

// ** MUI Imports
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Slide from "@mui/material/Slide";
import DialogContentText from "@mui/material/DialogContentText";
import Box from "@mui/material/Box";
import { useMediaQuery } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useDropzone } from "react-dropzone";
import Grid from "@mui/material/Grid";
// ** Styled Component
import DropzoneWrapper from "src/@core/styles/libs/react-dropzone";
import StepperCustomDot from "./StepperCustomDot";

import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { TextField } from "@mui/material";

import Step from "@mui/material/Step";
import Stepper from "@mui/material/Stepper";
import StepLabel from "@mui/material/StepLabel";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import StepContent from "@mui/material/StepContent";
import StepperWrapper from "src/@core/styles/mui/stepper";
import clsx from "clsx";
import { useAddPost } from "../../hooks/useSocialData";
import { LoadingButton } from "@mui/lab";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Header = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(3, 4),
  justifyContent: "space-between",
  backgroundColor: theme.palette.background.default,
}));

const FileUploaderSingle = ({ files, setFiles }) => {
  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
    },
    onDrop: (acceptedFiles) => {
      setFiles(acceptedFiles.map((file) => Object.assign(file)));
    },
  });

  const img = files.map((file) => (
    <img
      style={{
        maxWidth: '60%',
        maxHeight: '300px',
        objectFit: 'cover',
        borderRadius: '8px',
      }}
      key={file.name}
      alt={file.name}
      className="single-file-image"
      src={URL.createObjectURL(file)}
    />
  ));

  return (
    <Box
      {...getRootProps({ className: 'dropzone' })}
      {...(files.length && {
        sx: { height: 450, minWidth: '450px', maxWidth: '450px' },
      })}
    >
      <input {...getInputProps()} />
      {files.length ? (
        img
      ) : (
        <div className="flex items-center flex-col">
          <Avatar variant="rounded" className="bs-12 is-12 mbe-9">
            <i className="ri-upload-2-line" />
          </Avatar>
          <Typography variant="h4" className="mbe-2.5">
            Drop files here or click to upload.
          </Typography>
          <Typography color="text.secondary">
            Drop files here or click{' '}
            <a
              href="/"
              onClick={(e) => e.preventDefault()}
              className="text-textPrimary no-underline"
            >
              browse
            </a>{' '}
            thorough your machine
          </Typography>
        </div>
      )}
    </Box>
  );
};


const PostStepperDialog = ({ open, onClose }) => {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const [activeStep, setActiveStep] = useState(0);
  const [files, setFiles] = useState([]);
  const [content, setContent] = useState('');
  const addPostMutation = useAddPost();

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      // Final step, submit the form
      handleSubmit();

    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const handleSubmit = () => {
    if (files.length === 0) {
      toast.error('Please upload an image');
      return;
    }

    addPostMutation.mutate({ photo: files[0], content })
    setFiles([]);
      onClose();
    
  };

  const steps = [
    {
      title: 'Upload Image',
      description: (
        <Grid container>
          <FileUploaderSingle files={files} setFiles={setFiles} />
        </Grid>
      ),
    },
    {
      title: 'Post Description',
      description: (
        <Grid item xs={12}>
          <TextField
            onChange={(e) => setContent(e.target.value)}
            sx={{ minWidth: isSmallScreen ? '100%' : '450px' }}
            multiline
            rows={3}
            fullWidth
            label='Description'
            placeholder='Enter your post description'
          />
        </Grid>
      ),
    },
  ];

  return (

    <Fragment>
      <Dialog
        fullWidth
        maxWidth="sm"
        open={open}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Create your new post</DialogTitle>
        <DialogContent>
          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((step, index) => (
              <Step key={index}>
                <StepLabel>{step.title}</StepLabel>
                <StepContent>
                  <Typography variant={isSmallScreen ? "body2" : "body1"}>{step.description}</Typography>
                  {/* Assuming there's an input for photo upload */}
                  {step.requiresPhoto && (
                    <Box sx={{ my: 2 }}>
                      <input type="file" onChange={handlePhotoUpload} />
                    </Box>
                  )}
                  <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                    <Button
                      size="small"
                      color="secondary"
                      variant="outlined"
                      onClick={handleBack}
                      disabled={activeStep === 0}
                    >
                      Back
                    </Button>
                    <LoadingButton
                      loading={addPostMutation.status === "pending"}
                      size="small"
                      variant="contained"
                      onClick={handleNext}
                      sx={{ ml: 2 }}
                      disabled={!files.length || (activeStep === 1 && !content) }

                    >
                      {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                    </LoadingButton>
                  </Box>
                </StepContent>
              </Step>
            ))}
          </Stepper>
          {activeStep === steps.length && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="body2">All steps are completed!</Typography>
              <Button
                size="small"
                sx={{ mt: 2 }}
                variant="contained"
                onClick={handleReset}
              >
                Reset
              </Button>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};


const ShowNewPost = ({ open, onClose }) => <PostStepperDialog open={open} onClose={onClose} />

export default ShowNewPost;
