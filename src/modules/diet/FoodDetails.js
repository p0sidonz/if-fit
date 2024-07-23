import React from 'react';
import { Box,Grid, Card, CardContent, Typography, CardMedia, Tooltip, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { CheckCircle, Warning, Cancel, LocalDining } from '@mui/icons-material'

const FoodDetails = ({ data, showOtherData }) => {
    const { food_images, food_attributes } = data;



    return (
        <Grid sx={{ ml: 5, mr: 5 }} container spacing={3}>
            {showOtherData && (
                <>
                    {/* Food Images */}
                    <Grid item xs={12} md={12}>
                        <Typography variant="h6" sx={{ fontSize: '1rem' }}>Food Images</Typography>
                        <Grid container spacing={2}>
                            {food_images?.food_image?.length > 0 ? (
                                food_images.food_image.map((image, index) => (
                                    <Grid item xs={6} sm={4} md={3} lg={2} key={index}>
                                        <CardMedia
                                            component="img"
                                            image={image.image_url}
                                            alt={`Food Image ${index + 1}`}
                                            sx={{ height: { xs: 100, sm: 150, md: 200 }, width: '100%', objectFit: 'contain' }}
                                        />
                                    </Grid>
                                ))
                            ) : (
                                <Box sx={{ display: 'flex', p: 2, textAlign: 'center', justifyContent: 'center' }}>
                                    <Typography sx={{textAlign: 'center' }} variant="body1">No images available</Typography>
                                </Box>
                            )}
                        </Grid>
                    </Grid>

                    {/* Allergens */}
                    <Grid item xs={12} md={12}>
                        <Typography variant="h6" sx={{ fontSize: '1rem' }}>Allergens</Typography>
                        <List>
                            {food_attributes?.allergens?.allergen?.length > 0 ? (
                                food_attributes.allergens.allergen.map((allergen) => (
                                    <ListItem key={allergen.id}>
                                        <ListItemIcon>
                                            <Tooltip title={allergen.value === "0" ? "Does not contain" : "Contains"}>
                                                {allergen.value === "0" ? <CheckCircle color="success" /> : <Cancel color="error" />}
                                            </Tooltip>
                                        </ListItemIcon>
                                        <ListItemText primary={allergen.name} />
                                    </ListItem>
                                ))
                            ) : (
                                <Box sx={{ p: 2, textAlign: 'center' }}>
                                    <Typography variant="body1">No allergens available</Typography>
                                </Box>
                            )}
                        </List>
                    </Grid>

                    {/* Preferences */}
                    <Grid item xs={12} md={12}>
                        <Typography variant="h6" sx={{ fontSize: '1rem' }}>Preferences</Typography>
                        <List>
                            {food_attributes?.preferences?.preference?.length > 0 ? (
                                food_attributes.preferences.preference.map((preference) => (
                                    <ListItem key={preference.id}>
                                        <ListItemIcon>
                                            <Tooltip title={preference.value === "0" ? "Not preferred" : "Preferred"}>
                                                {preference.value === "0" ? <Cancel color="error" /> : <LocalDining color="primary" />}
                                            </Tooltip>
                                        </ListItemIcon>
                                        <ListItemText primary={preference.name} />
                                    </ListItem>
                                ))
                            ) : (
                                <Box sx={{ p: 2, textAlign: 'center' }}>
                                    <Typography variant="body1">No preferences available</Typography>
                                </Box>
                            )}
                        </List>
                    </Grid>
                </>
            )}
        </Grid>
    );
};

export default FoodDetails;