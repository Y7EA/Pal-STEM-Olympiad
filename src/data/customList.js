// -------------------------------------------------------------
// CUSTOM PARTICIPANTS CONFIGURATION
// -------------------------------------------------------------
// 1. Place your images in the "public/participants" folder.
// 2. Ensure image names match the names below exactly (e.g. "Ahmed.png").
// 3. Supported format assumed is .png (you can change extension below).

const names = [
    "Ahmed",
    "Mohammed",
    "Sara",
    "Leen",
    "Omar",
    "Khalid",
    "Yousef",
    "Ibrahim",
    "Nour",
    "Huda",
    "Ali",
    "Salma",
    "Rami",
    "Layla",
    "Zaid",
    "Hassan",
    "Muna",
    "Tamer",
    "Dina",
    "Samer",
    "Ran",
    "Suha",
    "Fadi",
    "Hala",
    "Majed",
    "Rola",
    "Nader",
    "Samia",
    "Tareq",
    "Wala"
];

// Generate the list
export const customParticipants = names.map((name, index) => ({
    id: `custom-${index}`,
    name: name,
    // Assumes image is in public/participants/Name.png
    // If your images are .jpg, change this to `${name}.jpg`
    image: `/participants/${name}.png`
}));
