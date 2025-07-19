// src/pages/EducationPage.tsx
import React from 'react';
import './EducationPage.css';

export default function EducationPage() {
  return (
    <div className="education-container">
      <h1>Education</h1>
      <p>This section provides an intuitive and mathematical explanation of the Monty Hall problem, plus interactive visualizations coming soon.</p>
      <h3>Background</h3>
      <p>The Monty Hall problem is a brain teaser based on the American television game show <i>Let's Make a Deal</i>. The 
      brain teaser goes as so:</p>
      <h3>How it Works</h3>
      <p>
        You are on a game show where there are 3 doors in front of you. Behind one door is a prize (say a car), 
        and behind the other doors are non-prizes (say a goat). Now, say you choose door 1. Monty the game show host (who knows what 
        is behind each door) then opens one of the doors that has a goat behind it. You are then are asked if you want to stay with 
        the door you initially picked, or switch your choice. Do you switch or do you stay?
      </p>
        
      <h3>Answer/Explanation</h3>
      <p>You switch!</p>
      <p>
          Switching gives you a 2/3 chance of winning, whereas staying with your initial choice gives 
          you a 1/3 chance. 
      </p>
      <p>
        The reason for this is because Monty actually knows which door has the prize, and therefore makes a strategic 
        choice to avoid opening the door with the prize in it. As a result, if you initially picked a goat (2/3 chance), the 
        prize has to be behind the door that Monty did not open. 
      </p>

      <h3>Mathematical Explanation (Bayes' Theorem)</h3>
      <p>C1 = prize is behind your initial pick</p>
      <p>C2 =  prize is behind the other unopened door</p>
      <p>M = Monty opens a door showing a non-prize</p>

      <p>
        P(C1|M) = (P(M|C1)P(C1)) / P(M)
      </p>

      <p>
        P(C2|M) = (P(M|C2)P(C2)) / P(M)
      </p>
      
      <p>
        P(C1|M) = 1/3
        P(C2|M) = 2/3
      </p>

    </div>
  );
}