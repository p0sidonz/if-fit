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

const UPLOAD_FOLDER_NAME = "uploads";
const POST_FOLDER_NAME = "posts";
const AVATAR_FOLDER_NAME = "avatar";
const THUMBNAIL_FOLDER_NAME = "thumbnails";
const COMPRESSED_FOLDER_NAME = "compressed";

export function GET_POST_THUMBNAIL_URL(image) {
  return `${process.env.NEXT_PUBLIC_API_URL}/${UPLOAD_FOLDER_NAME}/${POST_FOLDER_NAME}/${THUMBNAIL_FOLDER_NAME}/${image}`;
}

export function GET_POST_IMAGE_URL(image) {
  return `${process.env.NEXT_PUBLIC_API_URL}/${UPLOAD_FOLDER_NAME}/${POST_FOLDER_NAME}/${COMPRESSED_FOLDER_NAME}/${image}`;
} 

export function GET_AVATAR_THUMBNAIL_URL(image) {
  return `${process.env.NEXT_PUBLIC_API_URL}/${UPLOAD_FOLDER_NAME}/${AVATAR_FOLDER_NAME}/${THUMBNAIL_FOLDER_NAME}/${image}`;
} 
export function GET_AVATAR_COMPRESSED_URL(image) {
  return `${process.env.NEXT_PUBLIC_API_URL}/${UPLOAD_FOLDER_NAME}/${AVATAR_FOLDER_NAME}/${COMPRESSED_FOLDER_NAME}/${image}`;
} 