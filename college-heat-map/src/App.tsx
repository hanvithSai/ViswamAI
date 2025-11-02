import { useState, useEffect } from "react";
import MapComponent from "./components/Map";
import SearchBar from "./components/SearchBar";
import CollegeList from "./components/CollegeList";
import { parseCSV } from "./utils/csvParser";
import { College } from "./types";
import { mockColleges } from "./data/mockData";
import "./App.css";

function App() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [filteredColleges, setFilteredColleges] = useState<College[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 768);

  // Handle responsive layout
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setColleges(parseCSV(mockColleges));
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredColleges([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = colleges.filter((college) =>
      college.name.toLowerCase().includes(query)
    );

    // Sort results by relevance (colleges that start with the search term first)
    filtered.sort((a, b) => {
      const aStartsWith = a.name.toLowerCase().startsWith(query);
      const bStartsWith = b.name.toLowerCase().startsWith(query);

      if (aStartsWith && !bStartsWith) return -1;
      if (!aStartsWith && bStartsWith) return 1;
      return 0;
    });

    // Limit results to improve performance on mobile
    const limitedResults =
      isMobile && filtered.length > 20 ? filtered.slice(0, 20) : filtered;

    setFilteredColleges(limitedResults);
  }, [searchQuery, colleges, isMobile]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setShowResults(query.trim() !== "");

    // If query is empty, clear the selected college
    if (query.trim() === "") {
      setSelectedCollege(null);
    }
  };

  const handleSelectCollege = (college: College) => {
    setSelectedCollege(college);
    setShowResults(false);
    setSearchQuery(college.name); // Update search input with selected college name

    // Force focus on the map
    document.querySelector(".map-container")?.focus();

    // Announce selection for screen readers
    const announcement = document.getElementById("college-announcement");
    if (announcement) {
      announcement.textContent = `Selected ${college.name}`;
    }
  };

  if (colleges.length === 0) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <div>Loading college data...</div>
      </div>
    );
  }

  return (
    <div className="App">
      {/* Screen reader announcement (visually hidden) */}
      <div
        id="college-announcement"
        className="sr-only"
        aria-live="polite"
      ></div>

      <header className="header">
        <h1 className="app-title">College Heat Map</h1>
        {selectedCollege && (
          <div className="selected-college-header">
            Selected:{" "}
            {selectedCollege.name.length > 20 && isMobile
              ? `${selectedCollege.name.substring(0, 20)}...`
              : selectedCollege.name}
          </div>
        )}
      </header>

      <div className="map-container" tabIndex={-1}>
        <div className="search-container">
          <SearchBar onSearch={handleSearch} />
          <CollegeList
            colleges={filteredColleges}
            visible={showResults}
            onSelectCollege={handleSelectCollege}
            searchQuery={searchQuery}
          />
        </div>
        <MapComponent colleges={colleges} selectedCollege={selectedCollege} />
      </div>
    </div>
  );
}

export default App;
