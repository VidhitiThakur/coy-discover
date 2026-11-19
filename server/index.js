
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const dataPath = path.join(__dirname, "data.json");

// 30 demo profiles
const profiles = [
  ["Aarav", 22, "Mumbai", "Photography, Music"],
  ["Ananya", 21, "Navi Mumbai", "Dancing, Travel"],
  ["Rohan", 23, "Pune", "Cricket, Movies"],
  ["Isha", 20, "Panvel", "Reading, Art"],
  ["Kabir", 22, "Thane", "Football, Gaming"],
  ["Meera", 21, "Mumbai", "Music, Painting"],
  ["Aditya", 24, "Pune", "Coding, Trekking"],
  ["Sana", 20, "Navi Mumbai", "Fashion, Dance"],
  ["Vihaan", 22, "Nagpur", "Fitness, Travel"],
  ["Diya", 21, "Mumbai", "Books, Music"],
  ["Arjun", 23, "Thane", "Photography, Sports"],
  ["Kiara", 20, "Panvel", "Movies, Art"],
  ["Reyansh", 22, "Pune", "Gaming, Music"],
  ["Myra", 21, "Mumbai", "Travel, Food"],
  ["Ishaan", 24, "Navi Mumbai", "Technology, Cricket"],
  ["Aditi", 22, "Thane", "Dance, Reading"],
  ["Dev", 23, "Panvel", "Football, Fitness"],
  ["Riya", 20, "Mumbai", "Painting, Fashion"],
  ["Neil", 21, "Pune", "Music, Coding"],
  ["Tara", 22, "Navi Mumbai", "Travel, Photography"],
  ["Karan", 24, "Mumbai", "Movies, Gaming"],
  ["Nisha", 21, "Thane", "Books, Art"],
  ["Yash", 23, "Panvel", "Cricket, Music"],
  ["Pooja", 20, "Pune", "Dance, Travel"],
  ["Dhruv", 22, "Mumbai", "Fitness, Coding"],
  ["Avni", 21, "Navi Mumbai", "Food, Painting"],
  ["Samar", 23, "Thane", "Sports, Movies"],
  ["Zoya", 20, "Panvel", "Fashion, Music"],
  ["Atharv", 22, "Pune", "Photography, Gaming"],
  ["Mahi", 21, "Mumbai", "Reading, Travel"]
].map((p, i) => ({
  id: i + 1,
  name: p[0],
  age: p[1],
  city: p[2],
  interests: p[3].split(", "),
  bio: `Hey! I'm ${p[0]}. Let's connect and share good vibes.`,
  photo: `https://i.pravatar.cc/500?img=${i + 1}`,
  likedMe: [2, 5, 8, 12, 16, 20, 24, 28].includes(i + 1)
}));

function loadData() {
  if (fs.existsSync(dataPath)) {
    return JSON.parse(fs.readFileSync(dataPath, "utf8"));
  }

  const initialData = { swipes: [], matches: [] };
  fs.writeFileSync(dataPath, JSON.stringify(initialData, null, 2));
  return initialData;
}

function saveData(data) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

// GET: profiles not yet swiped
app.get("/feed", (req, res) => {
  const data = loadData();

  const feed = profiles
    .filter(profile => !data.swipes.some(s => s.profileId === profile.id))
    .map(({ likedMe, ...publicProfile }) => publicProfile);

  res.json(feed);
});

// POST: like or pass a profile
app.post("/swipe", (req, res) => {
  const { profileId, action } = req.body;
  const id = Number(profileId);

  if (!profiles.some(p => p.id === id) || !["like", "pass"].includes(action)) {
    return res.status(400).json({ error: "Invalid profile or action" });
  }

  const data = loadData();

  if (data.swipes.some(s => s.profileId === id)) {
    return res.status(409).json({ error: "Profile already swiped" });
  }

  data.swipes.push({ profileId: id, action });

  const isMatch =
    action === "like" &&
    profiles.find(p => p.id === id).likedMe;

  if (isMatch) {
    data.matches.push(id);
  }

  saveData(data);

  res.json({
    success: true,
    isMatch,
    message: isMatch ? "It's a match!" : "Swipe saved"
  });
});

// GET: mutual matches only
app.get("/matches", (req, res) => {
  const data = loadData();

  const matches = profiles
    .filter(p => data.matches.includes(p.id))
    .map(({ likedMe, ...publicProfile }) => publicProfile);

  res.json(matches);
});

app.listen(PORT, () => {
  console.log(`Coy Discover API running at http://localhost:${PORT}`);
});
