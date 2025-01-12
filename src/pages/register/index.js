// ** React Imports
import { useState } from "react";

// ** Next Import
import Link from "next/link";

// ** MUI Components
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import useMediaQuery from "@mui/material/useMediaQuery";
import OutlinedInput from "@mui/material/OutlinedInput";
import { styled, useTheme } from "@mui/material/styles";
import InputAdornment from "@mui/material/InputAdornment";
import Typography from "@mui/material/Typography";
import MuiFormControlLabel from "@mui/material/FormControlLabel";
import { useAuth } from "src/hooks/useAuth";
import FormHelperText from "@mui/material/FormHelperText";
import Grid from "@mui/material/Grid";
import { useRouter } from "next/router";
import FooterIllustrationsV1 from "src/views/pages/auth/FooterIllustrationsV1";
import Logo from "src/views/components/Logo";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

// ** Third Party Imports
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

// ** Icon Imports
import Icon from "src/@core/components/icon";

// ** Configs
import themeConfig from "src/configs/themeConfig";

// ** Layout Import
import BlankLayout from "src/@core/layouts/BlankLayout";

// ** Hooks
import { useSettings } from "src/@core/hooks/useSettings";

// ** Demo Imports
import FooterIllustrationsV2 from "src/views/pages/auth/FooterIllustrationsV2";

// ** Styled Components
const RegisterIllustrationWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(20),
  paddingRight: "0 !important",
  [theme.breakpoints.down("lg")]: {
    padding: theme.spacing(10),
  },
}));

const RegisterIllustration = styled("img")(({ theme }) => ({
  maxWidth: "48rem",
  [theme.breakpoints.down("xl")]: {
    maxWidth: "38rem",
  },
  [theme.breakpoints.down("lg")]: {
    maxWidth: "30rem",
  },
}));

const RightWrapper = styled(Box)(({ theme }) => ({
  width: "100%",
  [theme.breakpoints.up("md")]: {
    maxWidth: 400,
  },
  [theme.breakpoints.up("lg")]: {
    maxWidth: 450,
  },
}));

const BoxWrapper = styled(Box)(({ theme }) => ({
  width: "100%",
  [theme.breakpoints.down("md")]: {
    maxWidth: 400,
  },
}));

const TypographyStyled = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  letterSpacing: "0.18px",
  marginBottom: theme.spacing(1.5),
  [theme.breakpoints.down("md")]: { marginTop: theme.spacing(8) },
}));

const FormControlLabel = styled(MuiFormControlLabel)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  "& .MuiFormControlLabel-label": {
    fontSize: "0.875rem",
    color: theme.palette.text.secondary,
  },
}));

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: "none",
  color: theme.palette.primary.main,
}));

const Register = () => {
  const router = useRouter();
  // ** States
  const [showPassword, setShowPassword] = useState(false);
  // Add state for confirm password
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  // ** Hooks
  const theme = useTheme();
  const { settings } = useSettings();
  const hidden = useMediaQuery(theme.breakpoints.down("md"));
  const auth = useAuth();

  const schema = yup.object().shape({
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("Last name is required"),
    username: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string().min(5).required(),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), null], "Passwords must match"),
  });

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm({
    // defaultValues,
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    if (!agreeToTerms) {
      setError("terms", {
        type: "manual",
        message: "You must agree to the privacy policy and terms",
      });
      return;
    }
    if (data.password !== confirmPassword) {
      setPasswordMatch(false);
      return;
    }
    const { password, firstName, lastName } = data;
    // Convert username and email to lowercase
    const username = data.username.toLowerCase();
    const email = data.email.toLowerCase();
    
    auth.register(
      { username, email, password, firstName, lastName },
      () => {
        router.push('/login');
      },
      (error) => {
        if (error?.response?.data?.message) {
          setError('email', {
            type: 'manual',
            message: error.response.data.message
          });
        } else {
          setError('email', {
            type: 'manual',
            message: 'Registration failed. Please try again.'
          });
        }
      }
    );
  };

  // ** Vars
  const { skin } = settings;
  const imageSource =
    skin === "bordered"
      ? "auth-v2-register-illustration-bordered"
      : "auth-v2-register-illustration";

  return (
    <Box className="content-center">
      {/* {!hidden ? (
        <Box sx={{ flex: 1, display: 'flex', position: 'relative', alignItems: 'center', justifyContent: 'center' }}>
          <RegisterIllustrationWrapper>
            <RegisterIllustration
              alt='register-illustration'
              src={`/images/pages/${imageSource}-${theme.palette.mode}.png`}
            />
          </RegisterIllustrationWrapper>
          <FooterIllustrationsV2 image={`/images/pages/auth-v2-register-mask-${theme.palette.mode}.png`} />
        </Box>
      ) : null} */}
      <RightWrapper
        sx={
          skin === "bordered" && !hidden
            ? { borderLeft: `1px solid ${theme.palette.divider}` }
            : {}
        }
      >
         <Card sx={{ zIndex: 1 }}>
         <CardContent sx={{ p: theme => `${theme.spacing(1, 1, 1)} !important` }}>
        <Box
          sx={{
            p: 4,
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "background.paper",
          }}
          >
                 
          <BoxWrapper>
            <Logo />
            <Box sx={{ mb: 6, mt: 2, textAlign: 'center' }}>
              <TypographyStyled variant="h6">
                Adventure starts here 🚀
              </TypographyStyled>
              <Typography variant="body2">
                Train or get trained by the best
              </Typography>
            </Box>
            <form
              noValidate
              autoComplete="off"
              onSubmit={handleSubmit(onSubmit)}
            >
              <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <Controller
                      name="firstName"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange, onBlur } }) => (
                        <TextField
                          label="First Name"
                          value={value}
                          onBlur={onBlur}
                          onChange={onChange}
                          error={Boolean(errors.firstName)}
                          placeholder="John"
                        />
                      )}
                    />
                    {errors.firstName && (
                      <FormHelperText sx={{ color: "error.main" }}>
                        {errors.firstName.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <Controller
                      name="lastName"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange, onBlur } }) => (
                        <TextField
                          label="Last Name"
                          value={value}
                          onBlur={onBlur}
                          onChange={onChange}
                          error={Boolean(errors.lastName)}
                          placeholder="Doe"
                        />
                      )}
                    />
                    {errors.lastName && (
                      <FormHelperText sx={{ color: "error.main" }}>
                        {errors.lastName.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
              </Grid>

              <FormControl fullWidth sx={{ mb: 4 }}>
                <Controller
                  name="username"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextField
                      autoFocus
                      label="Username"
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                      error={Boolean(errors.username)}
                      placeholder="johndoe"
                      autoComplete="username"
                    />
                  )}
                />
                {errors.username && (
                  <FormHelperText sx={{ color: "error.main" }}>
                    {errors.username.message}
                  </FormHelperText>
                )}
              </FormControl>

              <FormControl fullWidth sx={{ mb: 4 }}>
                <Controller
                  name="email"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextField
                      label="Email"
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                      error={Boolean(errors.email)}
                      placeholder="user@email.com"
                    />
                  )}
                />
                {errors.email && (
                  <FormHelperText sx={{ color: "error.main" }}>
                    {errors.email.message}
                  </FormHelperText>
                )}
              </FormControl>

              <FormControl fullWidth sx={{ mb: 4 }}>
                <InputLabel htmlFor="auth-register-v2-password">
                  Password
                </InputLabel>
                <Controller
                  name="password"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <OutlinedInput
                      value={value}
                      onBlur={onBlur}
                      label="Password"
                      onChange={onChange}
                      id="auth-register-v2-password"
                      error={Boolean(errors.password)}
                      type={showPassword ? "text" : "password"}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            edge="end"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            <Icon
                              icon={
                                showPassword
                                  ? "mdi:eye-outline"
                                  : "mdi:eye-off-outline"
                              }
                            />
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  )}
                />
                {errors.password && (
                  <FormHelperText sx={{ color: "error.main" }}>
                    {errors.password.message}
                  </FormHelperText>
                )}
              </FormControl>

              <FormControl fullWidth sx={{ mb: 4 }}>
                <InputLabel htmlFor="auth-register-v2-confirm-password">
                  Confirm Password
                </InputLabel>
                <OutlinedInput
                  value={confirmPassword}
                  label="Confirm Password"
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setPasswordMatch(true);
                  }}
                  id="auth-register-v2-confirm-password"
                  error={!passwordMatch}
                  type={showPassword ? "text" : "password"}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <Icon
                          icon={
                            showPassword
                              ? "mdi:eye-outline"
                              : "mdi:eye-off-outline"
                          }
                        />
                      </IconButton>
                    </InputAdornment>
                  }
                />
                {!passwordMatch && (
                  <FormHelperText sx={{ color: "error.main" }}>
                    Passwords do not match
                  </FormHelperText>
                )}
              </FormControl>

              <FormControlLabel
                control={
                  <Checkbox
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                  />
                }
                sx={{
                  mb: 4,
                  mt: 1.5,
                  "& .MuiFormControlLabel-label": { fontSize: "0.875rem" },
                }}
                label={
                  <>
                    <Typography variant="body2" component="span">
                      I agree to{" "}
                    </Typography>
                    <LinkStyled href="/" onClick={(e) => e.preventDefault()}>
                      privacy policy & terms
                    </LinkStyled>
                  </>
                }
              />
              {errors.terms && (
                <FormHelperText sx={{ color: "error.main", mb: 4 }}>
                  {errors.terms.message}
                </FormHelperText>
              )}

              <Button
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                sx={{ mb: 7 }}
              >
                Sign up
              </Button>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                <Typography sx={{ mr: 2, color: "text.secondary" }}>
                  Already have an account?
                </Typography>
                <Typography
                  href="/login"
                  component={Link}
                  sx={{ color: "primary.main", textDecoration: "none" }}
                >
                  Sign in instead
                </Typography>
              </Box>
             
            </form>
          </BoxWrapper>
        
        </Box>
        </CardContent>
        </Card>
      </RightWrapper>
      <FooterIllustrationsV1
        image={`/images/pages/auth-v1-register-mask-${theme.palette.mode}.png`}
      />
    </Box>
  );
};
Register.getLayout = (page) => <BlankLayout>{page}</BlankLayout>;
Register.guestGuard = true;

export default Register;
