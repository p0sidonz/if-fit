import React, { useState, useCallback } from 'react';
import {
    List, ListItem, ListItemText, Button, Select, MenuItem, FormControl, InputLabel, Card, CardContent, Typography, TextField, CircularProgress,
    IconButton, InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ExerciseDetail from '../workout/ExerciseDetail';


import { useSearchExercises } from "../workout/hooks/useWorkout"
import { Container } from '@mui/system';
const Muscle = {
    abdominals: "abdominals",
    hamstrings: "hamstrings",
    calves: "calves",
    shoulders: "shoulders",
    adductors: "adductors",
    glutes: "glutes",
    quadriceps: "quadriceps",
    biceps: "biceps",
    forearms: "forearms",
    abductors: "abductors",
    triceps: "triceps",
    chest: "chest",
    lower_back: "lower back",
    traps: "traps",
    middle_back: "middle back",
    lats: "lats",
    neck: "neck",
}

const Force = {
    pull: "pull",
    push: "push",
    static: "static",
};

const Level = {
    beginner: "beginner",
    intermediate: "intermediate",
    expert: "expert",
};

const Mechanic = {
    compound: "compound",
    isolation: "isolation",
};

const Equipment = {
    body: "body only",
    machine: "machine",
    kettlebells: "kettlebells",
    dumbbell: "dumbbell",
    cable: "cable",
    barbell: "barbell",
    bands: "bands",
    medicine_ball: "medicine ball",
    exercise_ball: "exercise ball",
    e_z_curl_bar: "e-z curl bar",
    foam_roll: "foam roll",
};

const Category = {
    strength: "strength",
    stretching: "stretching",
    plyometrics: "plyometrics",
    strongman: "strongman",
    powerlifting: "powerlifting",
    cardio: "cardio",
    olympic_weightlifting: "olympic weightlifting",
    crossfit: "crossfit",
    weighted_bodyweight: "weighted bodyweight",
    assisted_bodyweight: "assisted bodyweight",
};

const initialFilters = {
    muscle: '',
    force: '',
    level: '',
    mechanic: '',
    equipment: '',
    category: '',
};

const ExerciseSearch = () => {
    const [filters, setFilters] = useState(initialFilters);
    const [searchQuery, setSearchQuery] = useState('');
    const { data: searchResultsData, refetch: refetchExercises, isFetched: isExerciseFetched, isLoading: exerciseSearchLoading } = useSearchExercises(searchQuery || '');

    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value,
        });
    };

    const debouncse = (func, wait) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                const query = args[0]; // Assuming query is the first argument
                if (query.trim()) {
                    func(query);
                }
            }, wait);
        };
    };

    const debouncedFetchExercises = useCallback(
        debouncse((value) => {
            setSearchQuery(value);
            refetchExercises(value);
        }, 1000),
        []
    );

    const handleSearch = (value) => {
        if (value.trim() === '') {
            setSearchQuery('');
            refetchExercises('');
        }
        debouncedFetchExercises(value);
    };

    const filteredResults = searchResultsData?.filter(exercise => {
        return (
            (filters.muscle === '' || exercise.primaryMuscles.includes(filters.muscle)) &&
            (filters.force === '' || exercise.force === filters.force) &&
            (filters.level === '' || exercise.level === filters.level) &&
            (filters.mechanic === '' || exercise.mechanic === filters.mechanic) &&
            (filters.equipment === '' || exercise.equipment === filters.equipment) &&
            (filters.category === '' || exercise.category === filters.category)
        );
    }) || [];

    return (
        <div>
            <Container>
                <Card sx={{ mr: 4, ml: 4 }}>
                    <CardContent>
                        <TextField
                            helperText="Search for an exercise by name like 'Bench Press'"
                            autoFocus
                            margin="dense"
                            label="Search"
                            fullWidth
                            onChange={(e) => handleSearch(e.target.value)}
                            variant="outlined"
                            InputProps={{
                                sx: { borderRadius: "20px" },
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton edge="end">
                                            <SearchIcon />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}

                        />

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', marginTop: '20px' }}>
                            <FormControl variant="outlined" sx={{ minWidth: 120 }}>
                                <InputLabel>Muscle</InputLabel>
                                <Select
                                    name="muscle"
                                    value={filters.muscle}
                                    onChange={handleFilterChange}
                                    label="Muscle"
                                >
                                    <MenuItem value=""><em>None</em></MenuItem>
                                    {Object.values(Muscle).map(muscle => (
                                        <MenuItem key={muscle} value={muscle}>{muscle}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl variant="outlined" sx={{ minWidth: 120 }}>
                                <InputLabel>Force</InputLabel>
                                <Select
                                    name="force"
                                    value={filters.force}
                                    onChange={handleFilterChange}
                                    label="Force"
                                >
                                    <MenuItem value=""><em>None</em></MenuItem>
                                    {Object.values(Force).map(force => (
                                        <MenuItem key={force} value={force}>{force}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl variant="outlined" sx={{ minWidth: 120 }}>
                                <InputLabel>Level</InputLabel>
                                <Select
                                    name="level"
                                    value={filters.level}
                                    onChange={handleFilterChange}
                                    label="Level"
                                >
                                    <MenuItem value=""><em>None</em></MenuItem>
                                    {Object.values(Level).map(level => (
                                        <MenuItem key={level} value={level}>{level}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl variant="outlined" sx={{ minWidth: 120 }}>
                                <InputLabel>Mechanic</InputLabel>
                                <Select
                                    name="mechanic"
                                    value={filters.mechanic}
                                    onChange={handleFilterChange}
                                    label="Mechanic"
                                >
                                    <MenuItem value=""><em>None</em></MenuItem>
                                    {Object.values(Mechanic).map(mechanic => (
                                        <MenuItem key={mechanic} value={mechanic}>{mechanic}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl variant="outlined" sx={{ minWidth: 120 }}>
                                <InputLabel>Equipment</InputLabel>
                                <Select
                                    name="equipment"
                                    value={filters.equipment}
                                    onChange={handleFilterChange}
                                    label="Equipment"
                                >
                                    <MenuItem value=""><em>None</em></MenuItem>
                                    {Object.values(Equipment).map(equipment => (
                                        <MenuItem key={equipment} value={equipment}>{equipment}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl variant="outlined" sx={{ minWidth: 120 }}>
                                <InputLabel>Category</InputLabel>
                                <Select
                                    name="category"
                                    value={filters.category}
                                    onChange={handleFilterChange}
                                    label="Category"
                                >
                                    <MenuItem value=""><em>None</em></MenuItem>
                                    {Object.values(Category).map(category => (
                                        <MenuItem key={category} value={category}>{category}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                    </CardContent>
                </Card>

                {exerciseSearchLoading ? (
                    <CircularProgress />
                ) : filteredResults.length > 0 && (
                    <List>
                        {filteredResults.map(exercise => (
                            <ListItem key={exercise.id}>
                                <Card sx={{ width: '100%', marginBottom: '10px' }}>
                                    <CardContent>
                                        <ExerciseDetail exercise={exercise} />
                                    </CardContent>
                                </Card>
                            </ListItem>
                        ))}
                    </List>
                )}
                {!searchQuery && <div>
                    {
                        filteredResults.length === 0 && isExerciseFetched && (
                            <Typography variant="h6" align="center" sx={{ mt: 4 }}>No exercises found</Typography>
                        )
                    }
                </div>}


            </Container>

        </div>
    );
};

export default ExerciseSearch;