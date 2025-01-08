// ** React Imports
import React, { useEffect, useState } from "react";
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Card,
  CardContent,
  CardActions,
  Grid,
  TextField,
  Box,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
  FormControlLabel,
  Divider,
  Link,
  Tabs,
  Tab,
  Alert,
} from "@mui/material";
import { useGetUpgradePackages, useHandleTrailSubscription } from "src/modules/user/hooks/usePackages";
import BlankLayout from "src/@core/layouts/BlankLayout";
import { useAuth } from "src/hooks/useAuth";
import BillingAddressCardPublic from "./BillingCardPublic";
import useRazorpay from "react-razorpay";
import { useCreateOrderTrainerPublicWithToken } from "../../modules/payments/razorpay/useRazorPay";

import {
  Check as CheckIcon,
  AccountCircle as AccountIcon,
  CreditCard as PaymentIcon,
  Done as DoneIcon,
  ShoppingCart as CartIcon,
} from "@mui/icons-material";

const steps = ["Select Plan", "Account Details", "Payment", "Confirmation"];

const isIndianTimeZone = () => {
  const timeZoneOffset = new Date().getTimezoneOffset();
  // Indian timezone offset is -330 minutes (-5:30 hours)
  return timeZoneOffset === -330;
};

const CheckoutStepper = ({ userData, customToken, pkgId, payments, hasTrialAccess }) => {
  const auth = useAuth();
  const handleTrailSubscription = useHandleTrailSubscription();
  const [Razorpay] = useRazorpay();
  const [activeStep, setActiveStep] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const { data: pricingPlans, isFetched } = useGetUpgradePackages();
  const [isExistingUser, setIsExistingUser] = useState(true);
  const [isModalDismissed, setIsModalDismissed] = useState(false);
  const [isTrialAvailable, setIsTrialAvailable] = useState(false);
  const [isPreviousButtonDisabled, setIsPreviousButtonDisabled] =
    useState(false);
  const [orderResponse, setOrderResponse] = useState(null);
  const [billingData, setBillingData] = useState({
    companyName: "",
    billingEmail: "",
    billingPhone: "",
    billingCountry: "",
    billingAddressLine1: "",
    billingState: "",
    billingZip: "",
  });
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTos: false,
  });

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authenticatedUser, setAuthenticatedUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    if (customToken) {
      setToken(customToken);
    }
    if (userData) {
      setAuthenticatedUser(userData);
    }
    if (token && userData) {
      setIsAuthenticated(true);
    }
  }, [customToken, userData, token]);

  useEffect(() => {
    if (pkgId && pricingPlans?.result) {
      const selectedPackage = pricingPlans.result.find(
        (plan) => plan.id === pkgId
      );
      if (selectedPackage) {
        setSelectedPlan(selectedPackage);
      }
    }
  }, [pkgId, pricingPlans]);

  const createOrderTrainerPublicWithToken =
    useCreateOrderTrainerPublicWithToken(token);

  if (!isFetched) return <p>Loading...</p>;
  if (isLoading) return <p>Loading...</p>;

  const plans = pricingPlans?.result || [];
  const sortedPlans = [...plans].sort((a, b) => a.order - b.order);

  console.log("plans", sortedPlans);



  useEffect(() => {
    function checkIfUserAviledTrial() {
      // Check both payments history and hasTrialAccess prop
      const hasTrialInPayments = payments?.some(payment => 
        payment.packageInfo.title === "Trial" && 
        payment.status === "COMPLETED"
      );
      
      // Set trial availability based on both conditions
      setIsTrialAvailable(hasTrialInPayments || hasTrialAccess);
    }
    checkIfUserAviledTrial();
  }, [payments, hasTrialAccess]);

  const handlePurchase = async () => {
    const userData = authenticatedUser;
    
    // Add check for Trial package
    if (selectedPlan?.title === "Trial" && 
        (selectedPlan?.monthly_price === 0 || selectedPlan?.monthly_price === "0" || 
         selectedPlan?.yearlyPrice === 0 || selectedPlan?.yearlyPrice === "0")) {
      try {
        // Generate order ID using timestamp
        const trialOrderId = `trial_${Date.now()}`;
        
        // Collect browser and device information
        const browserInfo = {
          userAgent: navigator.userAgent,
          language: navigator.language,
          platform: navigator.platform,
          screenResolution: `${window.screen.width}x${window.screen.height}`,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          referrer: document.referrer || 'direct',
          timestamp: new Date().toISOString()
        };

        // Call trial subscription API with required body
        const result = await handleTrailSubscription.mutateAsync({
          order_id: trialOrderId,
          package_id: selectedPlan.id,
          browser_info: browserInfo,
          ip_address: window.location.hostname,
          page_url: window.location.href,
          user_email: authenticatedUser?.email,
          user_id: authenticatedUser?.id
        });

        if (result.ok) {
          setOrderResponse({
            orderId: trialOrderId,
            paymentId: 'trial',
            signature: 'trial'
          });
          setActiveStep(3);
          
          return; // Add early return here to prevent Razorpay execution
        } else {
          throw new Error(result.message);
        }
        return; // Add return here as well for the trial case
      } catch (error) {
        console.error("Error creating trial subscription:", error);
        return; // Add return here to prevent Razorpay execution even in case of error
      }
    }

    // Rest of the Razorpay logic will only execute for non-trial plans
    try {
      const finalAmount = selectedPlan?.isYearlyPlan
        ? (isIndianTimeZone() && selectedPlan?.lowIncomeCountryPrice 
            ? parseInt(selectedPlan?.lowIncomeCountryPrice) 
            : parseInt(selectedPlan?.yearlyPrice))
        : (isIndianTimeZone() && selectedPlan?.lowIncomeCountryPrice 
            ? parseInt(selectedPlan?.lowIncomeCountryPrice) 
            : parseInt(selectedPlan?.monthly_price));

      const order = await createOrderTrainerPublicWithToken.mutateAsync({
        packageId: selectedPlan?.id,
        amount: finalAmount,
        currency: isIndianTimeZone() ? 'INR' : selectedPlan?.currency,
      });

      const options = {
        key: "rzp_test_XzVgCoZd6ruTtE",
        amount: order.amount * 100,
        currency: isIndianTimeZone() ? 'INR' : selectedPlan?.currency,
        name: selectedPlan?.title,
        description: `Purchase of ${selectedPlan?.title}`,
        order_id: order.id,
        notes: {
          isUpgradePlan: true, // upgrade or personal
          userId: userData.id,
          packageId: selectedPlan?.id,
        },
        prefill: {
          name: billingData.companyName,
          email: billingData.billingEmail,
          contact: billingData.billingPhone,
        },
        theme: {
          color: "#666CFF",
        },
        modal: {
          ondismiss: () => {
            console.log("Modal dismissed");
            setIsModalDismissed(true);
          },
          escape: true,
          confirm_close: true,
        },
        handler: (response) => {
          console.log("handler", response);
          setOrderResponse({
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
          });
          setActiveStep(3);
        },
      };

      const rzp = new Razorpay(options);
      rzp && rzp.open();

      //next step
      setActiveStep(activeStep + 1);
      //disable previous button
      setIsPreviousButtonDisabled(true);
    } catch (error) {
      console.error("Error creating order:", error);
      // Handle error appropriately
    }
  };

  const handleNext = async () => {
    if (activeStep === 0 && !selectedPlan) {
      return; // Don't proceed if no plan is selected
    }
    if (activeStep === 1) {
      if (!validateForm()) {
        return;
      }

      setIsLoading(true);
      setAuthError("");

      try {
        const response = await fetch("/api/auth", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            action: isExistingUser ? "login" : "register",
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Authentication failed");
        }

        setIsAuthenticated(true);
        setActiveStep(activeStep + 1);
      } catch (error) {
        setAuthError(
          error.message || "Authentication failed. Please try again."
        );
        console.error("Auth error:", error);
      } finally {
        setIsLoading(false);
      }
    } else if (activeStep === 1 && !isAuthenticated) {
      // Don't proceed if not authenticated
      return;
    } else {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleNextStep = async () => {
    if (selectedPlan?.title === "Trial" && 
        (selectedPlan?.monthly_price === 0 || selectedPlan?.yearlyPrice === 0)) {
      await handlePurchase();
    } else {
      setActiveStep(activeStep + 1);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setAuthError("");

    try {
      if (isExistingUser) {
        // Handle Login
        const result = await auth.handleLoginMinimal({
          email: formData.email,
          password: formData.password,
        });
        console.log("handleSubmit result", result);

        if (!result.success) {
          throw new Error(result.error);
        }

        console.log("result", result);
        setAuthenticatedUser(result.user);
        setToken(result.token);
        setIsAuthenticated(true);
        // setActiveStep(activeStep + 1);
      } else {
        // Handle Register
        const result = await auth.handleRegisterMinimal({
          firstName: formData.firstName,
          lastName: formData.lastName,
          username: formData.username,
          email: formData.email,
          password: formData.password,
        });

        console.log("handleSubmit result", result);

        if (!result.success) {
          throw new Error(result.error);
        }

        setAuthenticatedUser(result.user);
        setIsAuthenticated(true);
        setToken(result.token);
        // setActiveStep(activeStep + 1);
      }
    } catch (error) {
      setAuthError(error.message || "Authentication failed. Please try again.");
      console.error("Auth error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ width: "100%" }}>
            <Grid container spacing={3}>
              {sortedPlans.map((plan) => (
                <Grid item xs={12} md={4} key={plan.title}>
                  <Card
                    raised={plan.popular}
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      position: "relative",
                      border: selectedPlan?.title === plan.title ? 2 : 0,
                      borderColor: "primary.main",
                      opacity: plan.title === "Trial" && isTrialAvailable ? 0.7 : 1
                    }}
                  >
                    {plan.popular && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: 16,
                          right: 16,
                          bgcolor: "primary.main",
                          color: "primary.contrastText",
                          px: 2,
                          py: 0.5,
                          borderRadius: 16,
                        }}
                      >
                        Popular
                      </Box>
                    )}
                    <CardContent>
                      <Typography variant="h5" component="h2">
                        {plan.title}
                      </Typography>
                      <Typography color="textSecondary" gutterBottom>
                        {plan.subtitle}
                      </Typography>
                      <Typography variant="h4" component="p" sx={{ my: 2 }}>
                        {plan.isYearlyPlan ? (
                          <>
                            <Box
                              component="span"
                              sx={{
                                textDecoration: "line-through",
                                color: "text.secondary",
                                mr: 1,
                              }}
                            >
                              {isIndianTimeZone() ? '₹' : '$'}
                              {isIndianTimeZone() && plan.lowIncomeCountryPrice ? plan?.original_lowIncomeCountryPrice : plan.original_price}
                            </Box>
                            {isIndianTimeZone() ? '₹' : '$'}
                            {isIndianTimeZone() && plan.lowIncomeCountryPrice ? plan.lowIncomeCountryPrice : plan.yearlyPrice}
                            <Typography variant="subtitle1" component="span">
                              /year
                            </Typography>
                          </>
                        ) : (
                          <>
                            {plan.monthly_price == 0 ? (
                              <>
                                <Box
                                  component="span"
                                  sx={{
                                    textDecoration: "line-through",
                                    color: "text.secondary",
                                    mr: 1,
                                  }}
                                >
                                  {isIndianTimeZone() ? '₹' : '$'}
                                  {isIndianTimeZone() && plan.lowIncomeCountryPrice ? plan?.original_lowIncomeCountryPrice : plan.original_price}
                                </Box>
                                Free
                              </>
                            ) : (
                              <>
                                <Box
                                  component="span"
                                  sx={{
                                    textDecoration: "line-through",
                                    color: "text.secondary",
                                    mr: 1,
                                  }}
                                >
                                  {isIndianTimeZone() ? '₹' : '$'}
                                  {isIndianTimeZone() && plan.lowIncomeCountryPrice ? plan?.original_lowIncomeCountryPrice : plan.original_price}
                                </Box>
                                {isIndianTimeZone() ? '₹' : '$'}
                                {isIndianTimeZone() && plan.lowIncomeCountryPrice 
                                  ? plan.lowIncomeCountryPrice 
                                  : plan.monthly_price == 0 
                                    ? "*Free" 
                                    : plan.monthly_price}
                                <Typography variant="subtitle1" component="span">
                                  /month
                                </Typography>
                              </>
                            )}
                          </>
                        )}
                      </Typography>
                      <List>
                        {Object.entries(plan.planBenefits).map(
                          ([key, value]) => (
                            <ListItem key={key} dense>
                              <ListItemIcon>
                                <CheckIcon color="primary" />
                              </ListItemIcon>
                              <ListItemText
                                primary={`${key
                                  .replace(/_/g, " ")
                                  .replace(/\b\w/g, (l) => l.toUpperCase())}: ${
                                  key === "clients"
                                    ? value > 50
                                      ? "Unlimited"
                                      : value
                                    : typeof value === "boolean"
                                    ? value
                                      ? "Yes"
                                      : "No"
                                    : value
                                }`}
                              />
                            </ListItem>
                          )
                        )}
                      </List>
                      {plan.title == "Trial" && (
                        <Typography
                          variant="caption"
                          component="div"
                          sx={{
                            color: "text.secondary",
                            mt: 1,
                            fontStyle: "italic",
                          }}
                        >
                          Trial is for 1 month only
                        </Typography>
                      )}
                    </CardContent>
                    <CardActions sx={{ mt: "auto", p: 2 }}>
                      <Button
                        fullWidth
                        variant={selectedPlan?.title === plan.title ? "contained" : "outlined"}
                        onClick={() => setSelectedPlan(plan)}
                        disabled={plan.title === "Trial" && (isTrialAvailable || hasTrialAccess)}
                      >
                        {plan.title === "Trial" && (isTrialAvailable || hasTrialAccess)
                          ? "Already Availed"
                          : selectedPlan?.title === plan.title
                            ? "Selected"
                            : "Select Plan"}
                      </Button>
                    </CardActions>
                    {plan.title === "Trial" && isTrialAvailable && !hasTrialAccess && (
                      <Typography
                        variant="caption"
                        component="div"
                        sx={{
                          color: "error.main",
                          textAlign: "center",
                          mb: 2
                        }}
                      >
                        You have already availed the trial plan
                      </Typography>
                    )}
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        );

      case 1:
        return (
          <Box sx={{ maxWidth: 500, mx: "auto", p: 3 }}>
            {isAuthenticated && authenticatedUser ? (
              <Box sx={{ textAlign: "center", my: 4 }}>
                <Typography variant="h4" gutterBottom color="primary">
                  Welcome, {authenticatedUser.first_name}{" "}
                  {authenticatedUser.last_name}!
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  Your account has been verified. Please continue to complete
                  your subscription.
                </Typography>
                <BillingAddressCardPublic
                  token={token}
                  callback={handleNextStep}
                  setBillingDataLocal={setBillingData}
                  handlePurchase={handlePurchase}
                />
                {/* <Button
                  variant="contained"
                  onClick={() => setActiveStep(activeStep + 1)}
                  sx={{ mt: 2 }}
                >
                  Continue to Payment
                </Button> */}
              </Box>
            ) : (
              <>
                <Typography variant="h4" align="center" gutterBottom>
                  {isExistingUser ? "Welcome Back!" : "Create Account"}
                </Typography>
                <Typography
                  variant="body1"
                  align="center"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  {isExistingUser
                    ? "Please sign in to continue"
                    : "Fill in your information to get started"}
                </Typography>

                <Tabs
                  value={isExistingUser ? 0 : 1}
                  onChange={(e, newValue) => setIsExistingUser(newValue === 0)}
                  variant="fullWidth"
                  sx={{
                    mb: 4,
                    "& .MuiTabs-indicator": {
                      height: 3,
                    },
                    borderBottom: 1,
                    borderColor: "divider",
                  }}
                >
                  <Tab
                    label="Sign In"
                    sx={{
                      textTransform: "none",
                      fontSize: "1rem",
                      fontWeight: 500,
                    }}
                  />
                  <Tab
                    label="Sign Up"
                    sx={{
                      textTransform: "none",
                      fontSize: "1rem",
                      fontWeight: 500,
                    }}
                  />
                </Tabs>

                <Box component="form" noValidate>
                  <Grid container spacing={3}>
                    {!isExistingUser && (
                      <>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            required
                            fullWidth
                            label="First Name"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            error={!!errors.firstName}
                            helperText={errors.firstName}
                            variant="outlined"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            required
                            fullWidth
                            label="Last Name"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            error={!!errors.lastName}
                            helperText={errors.lastName}
                            variant="outlined"
                          />
                        </Grid>
                      </>
                    )}
                    {!isExistingUser && (
                      <Grid item xs={12}>
                        <TextField
                          required
                          fullWidth
                          label="Username"
                          name="username"
                          value={formData.username}
                          onChange={handleInputChange}
                          error={!!errors.username}
                          helperText={errors.username}
                          variant="outlined"
                        />
                      </Grid>
                    )}

                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        label="Email Address"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        error={!!errors.email}
                        helperText={errors.email}
                        variant="outlined"
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        label="Password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        error={!!errors.password}
                        helperText={errors.password}
                        variant="outlined"
                      />
                    </Grid>

                    {!isExistingUser && (
                      <>
                        <Grid item xs={12}>
                          <TextField
                            required
                            fullWidth
                            label="Confirm Password"
                            name="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            error={!!errors.confirmPassword}
                            helperText={errors.confirmPassword}
                            variant="outlined"
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                name="acceptTos"
                                checked={formData.acceptTos}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    acceptTos: e.target.checked,
                                  })
                                }
                                color="primary"
                              />
                            }
                            label={
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                I agree to the{" "}
                                <Link href="/terms" color="primary">
                                  Terms of Service
                                </Link>{" "}
                                and{" "}
                                <Link href="/privacy" color="primary">
                                  Privacy Policy
                                </Link>
                              </Typography>
                            }
                          />
                          {errors.acceptTos && (
                            <Typography
                              variant="caption"
                              color="error"
                              sx={{ ml: 2 }}
                            >
                              {errors.acceptTos}
                            </Typography>
                          )}
                        </Grid>
                      </>
                    )}
                  </Grid>

                  {isExistingUser && (
                    <Typography variant="body2" align="right" sx={{ mt: 2 }}>
                      <Link href="/forgot-password" color="primary">
                        Forgot password?
                      </Link>
                    </Typography>
                  )}

                  <Box sx={{ mt: 3 }}>
                    {authError && (
                      <Typography color="error" align="center" sx={{ mb: 2 }}>
                        {authError}
                      </Typography>
                    )}

                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      size="large"
                      onClick={handleSubmit}
                      disabled={isLoading}
                      sx={{ mb: 2 }}
                    >
                      {isLoading
                        ? "Processing..."
                        : isExistingUser
                        ? "Sign In"
                        : "Create Account"}
                    </Button>

                    <Typography
                      variant="body2"
                      align="center"
                      color="text.secondary"
                    >
                      {isExistingUser ? (
                        <>
                          Don't have an account?{" "}
                          <Link
                            component="button"
                            variant="body2"
                            onClick={() => setIsExistingUser(false)}
                          >
                            Sign up here
                          </Link>
                        </>
                      ) : (
                        <>
                          Already have an account?{" "}
                          <Link
                            component="button"
                            variant="body2"
                            onClick={() => setIsExistingUser(true)}
                          >
                            Sign in here
                          </Link>
                        </>
                      )}
                    </Typography>
                  </Box>
                </Box>
              </>
            )}
          </Box>
        );

      case 2:
        return (
          <Box sx={{ maxWidth: 400, mx: "auto" }}>
            {isModalDismissed ? (
              <Alert
                severity="error"
                action={
                  <Button
                    color="inherit"
                    size="small"
                    onClick={() => {
                      handlePurchase();
                      setIsModalDismissed(false);
                    }}
                  >
                    Try Again
                  </Button>
                }
              >
                Payment Window is closed. Please click here to try again.
              </Alert>
            ) : (
              <Alert severity="warning">
                Payment Window is open. Please complete the payment to continue.
              </Alert>
            )}
          </Box>
        );

      case 3:
        return (
          <Box sx={{ textAlign: "center" }}>
           {orderResponse?.orderId && <div>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                bgcolor: "success.light",
                width: 64,
                height: 64,
                borderRadius: "50%",
                mx: "auto",
                mb: 2,
              }}
            >
              <DoneIcon sx={{ color: "success.contrastText", fontSize: 32 }} />
            </Box>
            <Typography variant="h5" gutterBottom>
              Thank you for your subscription!
            </Typography>
           
              <div>
                <Typography variant="h6" color="textSecondary" sx={{ mb: 2 }}>
                  Order ID: {orderResponse.orderId}
                </Typography>
                <Alert
                  severity="success"
                  sx={{
                    mb: 2,
                    "& .MuiAlert-message": {
                      width: "100%",
                      textAlign: "center",
                    },
                    "& ul": {
                      display: "inline-block",
                      textAlign: "left",
                      margin: "0 auto",
                    },
                  }}
                >
                  <ul>
                    <li>
                      Your subscription will be activated within 24 hours
                      (usually instantly)
                    </li>
                    <li>
                      Please logout and log back in to access your new features
                    </li>
                  </ul>
                </Alert>
                <Button 
                  variant="contained" 
                  onClick={() => {
                    setIsModalDismissed(true);
                    setActiveStep(0);
                    setOrderResponse(null);
                    setSelectedPlan(null);
                    // Reset any other necessary state
                    window.location.reload(); // or your desired redirect path
                  }}
                >
                  Close
                </Button>
              </div>

            </div>}
         
          </Box>
        );

      default:
        return "Unknown step";
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 8 characters";
    }

    // Additional validations for registration
    if (!isExistingUser) {
      if (!formData.firstName) {
        newErrors.firstName = "First name is required";
      }

      if (!formData.lastName) {
        newErrors.lastName = "Last name is required";
      }
      if (!formData.username) {
        newErrors.username = "Username is required";
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }

      if (!formData.acceptTos) {
        newErrors.acceptTos = "You must accept the Terms of Service";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 1200, mx: "auto" }}>
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {getStepContent(activeStep)}

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
        <Box>
          {!isPreviousButtonDisabled && activeStep !== 3 && activeStep !== 2 && (
            <Button disabled={activeStep === 0} onClick={handleBack}>
              Back
            </Button>
          )}
        </Box>
        {activeStep !== 1 && activeStep !== 3 && (
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={
              isLoading ||
              (activeStep === 0 && !selectedPlan) ||
              (activeStep === 1 && !isAuthenticated)
            }
          >
            {isLoading ? "Processing..." : "Next"}
          </Button>
        )}
      </Box>

      {authError && (
        <Typography color="error" align="center" sx={{ mt: 2 }}>
          {authError}
        </Typography>
      )}
    </Paper>
  );
};

CheckoutStepper.getLayout = (page) => <BlankLayout>{page}</BlankLayout>;
CheckoutStepper.guestGuard = true;

export default CheckoutStepper;
