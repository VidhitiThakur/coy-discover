
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, X, Users, Home, Compass, RotateCcw } from "lucide-react";
import "./App.css";

const API = "http://localhost:5000";

function App() {
  const [tab, setTab] = useState("discover");
  const [profiles, setProfiles] = useState([]);
  const [matches, setMatches] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [showMatch, setShowMatch] = useState(null);
  const [dragDirection, setDragDirection] = useState(0);

  const loadFeed = async () => {
    try {
      const response = await fetch(`${API}/feed`);
      const data = await response.json();
      setProfiles(data);
      setCurrent(0);
    } catch {
      setMessage("Cannot connect to server. Please start the backend.");
    } finally {
      setLoading(false);
    }
  };

  const loadMatches = async () => {
    try {
      const response = await fetch(`${API}/matches`);
      setMatches(await response.json());
    } catch {
      setMessage("Unable to load matches.");
    }
  };

  useEffect(() => {
    loadFeed();
    loadMatches();
  }, []);

  const swipe = async (action) => {
    const profile = profiles[current];
    if (!profile) return;

    try {
      const response = await fetch(`${API}/swipe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profileId: profile.id,
          action
        })
      });

      if (!response.ok) throw new Error("Swipe failed");

      const result = await response.json();

      if (result.isMatch) {
        setShowMatch(profile);
        loadMatches();
      }

      setProfiles((old) => old.filter((p) => p.id !== profile.id));
      setCurrent(0);
      setDragDirection(0);
    } catch {
      setMessage("Something went wrong. Please try again.");
    }
  };

  const handleDragEnd = (event, info) => {
    if (info.offset.x > 100) {
      swipe("like");
    } else if (info.offset.x < -100) {
      swipe("pass");
    }
  };

  const profile = profiles[current];

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <span className="brand-icon">c</span>
          <span>coy<span className="brand-dot">.</span></span>
        </div>
        <div className="top-note">A little mystery, a little magic ✨</div>
      </header>

      <nav className="tabs">
        <button
          className={tab === "home" ? "tab active" : "tab"}
          onClick={() => setTab("home")}
        >
          <Home size={18} /> Home
        </button>
        <button
          className={tab === "discover" ? "tab active" : "tab"}
          onClick={() => setTab("discover")}
        >
          <Compass size={18} /> Discover
        </button>
        <button
          className={tab === "matches" ? "tab active" : "tab"}
          onClick={() => {
            setTab("matches");
            loadMatches();
          }}
        >
          <Users size={18} /> Matches
          {matches.length > 0 && <span className="count">{matches.length}</span>}
        </button>
      </nav>

      <main className="main">
        {tab === "home" && (
          <section className="home-empty">
            <div className="home-heart"><Heart size={34} /></div>
            <h1>Welcome to Coy</h1>
            <p>Your little world of secret connections.</p>
          </section>
        )}

        {tab === "discover" && (
          <section className="discover">
            <div className="section-heading">
              <div>
                <p className="eyebrow">YOUR NEXT CONNECTION</p>
                <h1>Discover</h1>
              </div>
              <span className="profile-count">{profiles.length} profiles left</span>
            </div>

            {message && <p className="notice">{message}</p>}

            {loading ? (
              <div className="empty-state">Loading profiles...</div>
            ) : profile ? (
              <>
                <p className="swipe-hint">Swipe right if you like them 💗</p>
                <div className="card-area">
                  <AnimatePresence mode="wait">
                    <motion.article
                      key={profile.id}
                      className="profile-card"
                      drag="x"
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.8}
                      onDrag={(event, info) => {
                        setDragDirection(info.offset.x);
                      }}
                      onDragEnd={handleDragEnd}
                      initial={{ opacity: 0, scale: 0.92, y: 25 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{
                        opacity: 0,
                        x: dragDirection > 0 ? 250 : -250,
                        rotate: dragDirection > 0 ? 15 : -15
                      }}
                      transition={{ duration: 0.25 }}
                      whileDrag={{ rotate: dragDirection / 20 }}
                    >
                      <div className="photo-wrap">
                        <img
                          src={profile.photo}
                          alt={profile.name}
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                        <div className="photo-overlay" />
                        <div className="photo-label">COY DISCOVER</div>
                        <div className="profile-info">
                          <h2>{profile.name}, {profile.age}</h2>
                          <p>📍 {profile.city}</p>
                        </div>
                      </div>

                      <div className="profile-details">
                        <p className="bio">{profile.bio}</p>
                        <div className="interests">
                          {profile.interests.map((interest) => (
                            <span key={interest}>{interest}</span>
                          ))}
                        </div>
                      </div>
                    </motion.article>
                  </AnimatePresence>
                </div>

                <div className="actions">
                  <button className="action-btn pass" onClick={() => swipe("pass")}>
                    <X size={25} />
                  </button>
                  <button className="action-btn like" onClick={() => swipe("like")}>
                    <Heart size={25} fill="currentColor" />
                  </button>
                </div>
                <p className="action-caption">Pass <span>Like</span></p>
              </>
            ) : (
              <div className="empty-state">
                <div className="empty-heart">💗</div>
                <h2>You've seen everyone!</h2>
                <p>You've discovered all available profiles. Check back later.</p>
                <button className="secondary-btn" onClick={loadFeed}>
                  <RotateCcw size={16} /> Refresh
                </button>
              </div>
            )}
          </section>
        )}

        {tab === "matches" && (
          <section className="matches-section">
            <p className="eyebrow">MUTUAL CONNECTIONS</p>
            <h1>Your Matches 💗</h1>
            <p className="match-subtitle">Only when you both like each other.</p>

            {matches.length === 0 ? (
              <div className="empty-state">
                <div className="empty-heart">💌</div>
                <h2>No matches yet</h2>
                <p>Your mutual connections will appear here.</p>
                <button className="secondary-btn" onClick={() => setTab("discover")}>
                  Discover people
                </button>
              </div>
            ) : (
              <div className="match-grid">
                {matches.map((person) => (
                  <div className="match-card" key={person.id}>
                    <img src={person.photo} alt={person.name} />
                    <div>
                      <h3>{person.name}, {person.age}</h3>
                      <p>📍 {person.city}</p>
                    </div>
                    <Heart size={19} fill="#ff5b85" color="#ff5b85" />
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      {showMatch && (
        <div className="match-overlay">
          <div className="match-popup">
            <div className="match-sparkle">✨ 💗 ✨</div>
            <p className="eyebrow">IT'S MUTUAL!</p>
            <h1>It's a match!</h1>
            <img src={showMatch.photo} alt={showMatch.name} />
            <h2>You and {showMatch.name} like each other!</h2>
            <p>Sometimes, the feeling is mutual. 💕</p>
            <button
              className="secondary-btn"
              onClick={() => {
                setShowMatch(null);
                setTab("matches");
                loadMatches();
              }}
            >
              See your matches
            </button>
            <button className="close-btn" onClick={() => setShowMatch(null)}>
              Keep discovering
            </button>
          </div>
        </div>
      )}

      <footer>Made with 💗 for meaningful connections</footer>
    </div>
  );
}

export default App;
