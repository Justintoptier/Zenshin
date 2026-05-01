// Day mapping: 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
const WORKOUT_SCHEDULE = {
  0: { name: 'Lower', muscleGroups: 'Quads · Hamstrings · Calves · Core' },
  1: { name: 'Rest', muscleGroups: 'Recovery Day' },
  2: { name: 'Push', muscleGroups: 'Chest · Shoulders · Triceps' },
  3: { name: 'Pull', muscleGroups: 'Back · Rear Delts · Biceps' },
  4: { name: 'Legs', muscleGroups: 'Quads · Hamstrings · Calves' },
  5: { name: 'Rest', muscleGroups: 'Recovery Day' },
  6: { name: 'Upper', muscleGroups: 'Push + Pull Compound' },
};

const EXERCISE_LISTS = {
  Push: [
    { name: 'Bench Press', sets: '3×10-12' },
    { name: 'Peck-Deck Flies', sets: '3×10-12' },
    { name: 'Shoulder Press', sets: '3×10-12' },
    { name: 'Lateral Raise Machine', sets: '3×10-12' },
    { name: 'Tricep Pushdown', sets: '3×10-12' },
    { name: 'Overhead Tricep Extension', sets: '3×10-12' },
    { name: 'Abs Cruncher', sets: '3×15-20' },
    { name: 'Cardio', sets: '15-20 min' },
  ],
  Pull: [
    { name: 'Lat Pulldown Machine', sets: '3×10-12' },
    { name: 'Seated Cable Row', sets: '3×10-12' },
    { name: 'Chest-Supported Row Machine', sets: '3×10-12' },
    { name: 'Rear Delt Fly Machine', sets: '3×12' },
    { name: 'Bicep Curl Machine', sets: '3×12' },
    { name: 'Hammer Curl (Dumbbell)', sets: '3×12' },
    { name: 'Abs Cruncher', sets: '3×15-20' },
    { name: 'Cardio', sets: '15-20 min' },
  ],
  Legs: [
    { name: 'Squats', sets: '4×12-15' },
    { name: 'Leg Extension Machine', sets: '3×12-15' },
    { name: 'Hamstring Machine', sets: '3×12-15' },
    { name: 'Calf Raise Machine', sets: '4×15-20' },
    { name: 'Abs Cruncher', sets: '3×15-20' },
    { name: 'Cardio', sets: '15-20 min' },
  ],
  Upper: [
    { name: 'Bench Press', sets: '3×12' },
    { name: 'Lat Pulldown Machine', sets: '3×12' },
    { name: 'Shoulder Press', sets: '3×12' },
    { name: 'Seated Cable Row', sets: '3×12' },
    { name: 'Lateral Raise Machine', sets: '3×15' },
    { name: 'Bicep Curl Machine', sets: '2×15' },
    { name: 'Tricep Pushdown', sets: '2×15' },
    { name: 'Abs Cruncher', sets: '3×15-20' },
    { name: 'Cardio', sets: '15-20 min' },
  ],
  Lower: [
    { name: 'Squats', sets: '3×20' },
    { name: 'Leg Extension Machine', sets: '3×12' },
    { name: 'Hamstring Curls', sets: '3×12' },
    { name: 'Calf Raise', sets: '3×15' },
    { name: 'Abs', sets: '3×30-45 sec' },
    { name: 'Abs Cruncher', sets: '3×15-20' },
    { name: 'Cardio', sets: '15-20 min' },
  ],
  Rest: [],
};

export const getTodayWorkout = () => {
  const day = new Date().getDay();
  const base = WORKOUT_SCHEDULE[day] || WORKOUT_SCHEDULE[1];

  return {
    name: base.name,
    muscleGroups: base.muscleGroups,
    exerciseList: EXERCISE_LISTS[base.name] || [],
  };
};
