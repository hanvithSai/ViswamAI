import React from "react";
import { College } from "../types";

interface CollegeListProps {
  colleges: College[];
  visible: boolean;
  onSelectCollege: (college: College) => void;
  searchQuery: string;
}

const CollegeList: React.FC<CollegeListProps> = ({
  colleges,
  visible,
  onSelectCollege,
  searchQuery,
}) => {
  // Return an empty div with display:none if conditions not met
  // This approach keeps the element in DOM but hidden
  if (!searchQuery) {
    return <div className="college-list" style={{ display: "none" }}></div>;
  }
  return (
    <div
      className={`college-list ${visible ? "visible" : ""}`}
      role="listbox"
      aria-label="College search results"
    >
      {colleges.length > 0 ? (
        colleges.map((college) => {
          // Get full college name and ID for display
          const name = college.name;
          const index = name.toLowerCase().indexOf(searchQuery.toLowerCase());
          let beforeMatch = "";
          let match = "";
          let afterMatch = "";

          if (index >= 0) {
            beforeMatch = name.substring(0, index);
            match = name.substring(index, index + searchQuery.length);
            afterMatch = name.substring(index + searchQuery.length);
          } else {
            // Fallback if substring not found (shouldn't happen with current filter)
            beforeMatch = name;
          }
          return (
            <div
              key={college.id}
              className="college-item"
              onClick={() => onSelectCollege(college)}
              title={name} // Add tooltip for very long names
              role="option"
              aria-selected={false}
            >
              <div className="college-details">
                <div className="college-name">
                  {beforeMatch}
                  <span className="highlight-match">{match}</span>
                  {afterMatch}
                </div>
                <div className="college-meta">
                  <span className="college-id">ID: {college.id}</span>
                  <span className="college-interns">
                    <span className="tech-lead">
                      TL: {college.techLeadInterns}
                    </span>{" "}
                    |
                    <span className="ai-dev">
                      AI: {college.aiDeveloperInterns}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="no-results">No colleges found</div>
      )}
    </div>
  );
};

export default CollegeList;
