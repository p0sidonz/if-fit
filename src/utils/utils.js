export const formatDate = (dateStr) => {
  const date = new Date(dateStr);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const year = date.getUTCFullYear();
  const month = monthNames[date.getUTCMonth()];
  const day = String(date.getUTCDate()).padStart(2, "0");

  return `${month} ${day}, ${year}`;
};


// Function to determine if the muscles are anterior or posterior
const anteriorMuscles = [
  "abdominals",
  "adductors",
  "quadriceps",
  "biceps",
  "forearms",
  "chest"
];

const posteriorMuscles = [
  "hamstrings",
  "calves",
  "shoulders",
  "glutes",
  "lower back",
  "traps",
  "middle back",
  "lats",
  "neck",
  "triceps",
  "abductors"
];

export function checkMuscleGroup(muscles) {
  if (!Array.isArray(muscles)) {
    return "unknown"; // Return unknown if muscles is not an array
  }

  let anteriorCount = 0;
  let posteriorCount = 0;

  muscles.forEach(muscle => {
    const muscleLowerCase = muscle?.toLowerCase() || '';
    if (anteriorMuscles.includes(muscleLowerCase)) {
      anteriorCount++;
    } else if (posteriorMuscles.includes(muscleLowerCase)) {
      posteriorCount++;
    }
  });

  if (anteriorCount > posteriorCount) {
    return "anterior";
  } else if (posteriorCount > anteriorCount) {
    return "posterior";
  } else {
    return ""; // If counts are equal or no matches found
  }
}