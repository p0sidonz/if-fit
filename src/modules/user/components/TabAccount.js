// ** React Imports
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
// ** MUI Imports
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Select from "@mui/material/Select";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import CardHeader from "@mui/material/CardHeader";
import FormControl from "@mui/material/FormControl";
import CardContent from "@mui/material/CardContent";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";
import {useUserData, useUpdateUser} from "../hooks/useUserData";

import Avatar from "./Avatar";
// ** Third Party Imports
import { useForm, Controller } from "react-hook-form";
import { COUNTRIES } from "../consts";


const initialData = {
  first_name: "",
  last_name: "",
  email: "",
  username: "",
  contact: "",
  gender: "",
  dob: "",
  bio: "",
};

const TabAccount = () => {

  const updateUser = useUpdateUser();

  const initialData = {
    first_name: "",
    last_name: "",
    email: "",
    username: "",
    contact: "",
    gender: "",
    dob: "",
    country: "",
    bio: ''
  };

  // ** State
  const [formData, setFormData] = useState(initialData);
  const realReduxData = useSelector((state) => state.user.details);

  // ** Hooks
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ defaultValues: initialData });

  useEffect(() => {
    if (realReduxData) {
      const newFormData = {
        username: realReduxData.username || "",
        first_name: realReduxData.first_name || "",
        last_name: realReduxData.last_name || "",
        contact: realReduxData.contact || "",
        email: realReduxData.email || "",
        gender: realReduxData.gender || "",
        dob: realReduxData.dob || "",
        country: realReduxData.country || "",
        bio: realReduxData.bio || ""
      };
      setFormData(newFormData);

      Object.keys(newFormData).forEach(key => {
        setValue(key, newFormData[key]);
      });
    }
  }, [realReduxData, setValue]);

  const handleFormChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setValue(field, value); // Update react-hook-form value
  };

  const onSubmit = async data => {
    try {
      await updateUser.mutate(data);
      // Optionally, handle success state here
      console.log("User data updated successfully");

    } catch (err) {
      // Optionally, handle error state here
      console.error(err);
    }
  };

  return (
    <Grid container spacing={6}>

      
      {/* Account Details Card */}
      <Grid item xs={12}>
        <Card>
          <CardHeader title="Account Details" />
          <form onSubmit={handleSubmit(onSubmit)}>
            <Avatar />
            <Divider />
            <CardContent>

            

              <Grid container spacing={6}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="first_name"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="First Name"
                        placeholder="John"
                        value={formData.first_name}
                        onChange={(e) =>
                          handleFormChange("first_name", e.target.value)
                        }
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name="last_name"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Last Name"
                        placeholder="Doe"
                        value={formData.last_name}
                        onChange={(e) =>
                          handleFormChange("last_name", e.target.value)
                        }
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        type="email"
                        label="Email"
                        placeholder="john.doe@example.com"
                        value={formData.email}
                        onChange={(e) =>
                          handleFormChange("email", e.target.value)
                        }
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name="username"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Username"
                        placeholder="john.doe"
                        value={formData.username}
                        onChange={(e) =>
                          handleFormChange("username", e.target.value)
                        }
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name="contact"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        type="number"
                        label="Phone Number"
                        placeholder="202 555 0111"
                        value={formData.contact}
                        onChange={(e) =>
                          handleFormChange("contact", e.target.value)
                        }
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              US (+1)
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name="gender"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth>
                        <InputLabel>Gender</InputLabel>
                        <Select
                          {...field}
                          label="Gender"
                          value={formData.gender}
                          onChange={(e) =>
                            handleFormChange("gender", e.target.value)
                          }
                        >
                          <MenuItem value="male">Male</MenuItem>
                          <MenuItem value="female">Female</MenuItem>
                          <MenuItem value="other">Other</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name="dob"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Date of Birth"
                        type="date"
                        value={formData.dob}
                        onChange={(e) =>
                          handleFormChange("dob", e.target.value)
                        }
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={12}>
                  <Controller
                    name="dob"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        rows={4}
                        multiline
                        fullWidth
                        label="Bio"
                        type="text"
                        value={formData?.bio}
                        onChange={(e) =>
                          handleFormChange("bio", e.target.value)
                        }
                      />
                    )}
                  />
                </Grid>



                <Grid item xs={12}>
                  <Button disabled={updateUser.isPending} type="submit" variant="contained" sx={{ mr: 3 }}>
                    Save Changes
                  </Button>
                  {/* <Button
                    type="reset"
                    variant="outlined"
                    color="secondary"
                    onClick={() => setFormData(initialData)}
                  >
                    Reset
                  </Button> */}
                </Grid>
              </Grid>
            </CardContent>
          </form>
        </Card>
      </Grid>
    </Grid>
  );
};

export default TabAccount;
