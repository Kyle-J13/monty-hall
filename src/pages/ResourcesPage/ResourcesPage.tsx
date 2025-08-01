// src/pages/ResourcesPage.tsx
import './ResourcesPage.css'; 
import ResourcesCards from "../../components/ResourcesCards/ResourcesCards";

export default function ResourcesPage() {
  return (
    <div className="resources-container">
      <h1>Resources</h1>
      <p id="sub-text">
        Here you’ll find links to documentation, tutorials, and related materials for the Monty Hall Learning Platform.
      </p>
      <div id="resources-section">
        <ResourcesCards
          title="Monty Hall"
          link="https://en.wikipedia.org/wiki/Monty_Hall_problem"
          description="Description of the Monty Hall Problem"
        />
      </div>
    </div>
  );
}
