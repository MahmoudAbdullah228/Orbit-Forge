/**
 * Transparent Mission Scoring Engine
 */

export function calculateMissionScore({
  success = false,
  tasksCompleted = 0,
  totalTasks = 3,
  remainingBudgetPercent = 0.5,
  remainingPowerPercent = 0.5,
  scientificValue = 20,
  decisionEfficiency = 0.8
}) {
  if (!success) {
    const consolation = Math.max(
      150,
      Math.round(scientificValue * 8 + tasksCompleted * 75)
    );
    return {
      score: consolation,
      stars: 1,
      rating: 'MISSION INCOMPLETE',
      breakdown: {
        baseScore: 0,
        taskScore: tasksCompleted * 75,
        scienceScore: Math.round(scientificValue * 8),
        budgetBonus: 0,
        powerBonus: 0,
        efficiencyBonus: 0
      }
    };
  }

  const baseScore = 1000;
  const taskRatio = Math.min(1, tasksCompleted / Math.max(1, totalTasks));
  const taskScore = Math.round(taskRatio * 1500);
  const scienceScore = Math.round(scientificValue * 25);
  const budgetBonus = Math.round(Math.max(0, remainingBudgetPercent) * 500);
  const powerBonus = Math.round(Math.max(0, remainingPowerPercent) * 400);
  const efficiencyBonus = Math.round(Math.max(0, decisionEfficiency) * 300);

  const totalScore = baseScore + taskScore + scienceScore + budgetBonus + powerBonus + efficiencyBonus;

  // Star calculation
  let stars = 3;
  if (totalScore >= 3500) {
    stars = 5;
  } else if (totalScore >= 2800) {
    stars = 4;
  } else if (totalScore < 2000) {
    stars = 2;
  }

  let rating = 'MISSION SUCCESS';
  if (stars === 5) rating = 'OUTSTANDING FLIGHT';
  if (stars === 4) rating = 'COMMENDABLE SCIENCE';
  if (stars === 3) rating = 'MISSION ACCOMPLISHED';
  if (stars === 2) rating = 'MARGINAL RETURN';

  return {
    score: totalScore,
    stars,
    rating,
    breakdown: {
      baseScore,
      taskScore,
      scienceScore,
      budgetBonus,
      powerBonus,
      efficiencyBonus
    }
  };
}
