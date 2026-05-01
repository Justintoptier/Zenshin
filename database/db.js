import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('zenshin.db');

export const initializeDatabase = () => {
  db.execSync(`CREATE TABLE IF NOT EXISTS profile (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    age INTEGER,
    weight REAL,
    goal TEXT
  )`);

  db.execSync(`CREATE TABLE IF NOT EXISTS workouts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT,
    exercise TEXT,
    sets INTEGER,
    reps INTEGER,
    weight REAL
  )`);
};

export const insertWorkout = (date, exercise, sets, reps, weight) => {
  db.runSync(
    'INSERT INTO workouts (date, exercise, sets, reps, weight) VALUES (?,?,?,?,?)',
    [date, exercise, sets, reps, weight]
  );
};

export const getWorkouts = () => {
  return db.getAllSync('SELECT * FROM workouts ORDER BY id DESC');
};

export const getWorkoutsByDate = () => {
  return db.getAllSync('SELECT * FROM workouts ORDER BY date DESC, id ASC');
};

export const getWorkoutStats = () => {
  const total = db.getAllSync('SELECT COUNT(*) as count FROM workouts');
  const days = db.getAllSync('SELECT COUNT(DISTINCT date) as count FROM workouts');
  const exercises = db.getAllSync('SELECT COUNT(DISTINCT exercise) as count FROM workouts');
  return {
    totalEntries: total[0]?.count || 0,
    totalDays: days[0]?.count || 0,
    uniqueExercises: exercises[0]?.count || 0,
  };
};

export const getWorkoutStreak = () => {
  const rows = db.getAllSync('SELECT DISTINCT date FROM workouts ORDER BY date DESC');
  if (rows.length === 0) return 0;
  let streak = 0;
  let checkDate = new Date();
  checkDate.setHours(0, 0, 0, 0);
  const dateSet = new Set(rows.map((r) => r.date));
  // Check if today or yesterday has a workout to start the streak
  const todayStr = checkDate.toISOString().split('T')[0];
  const yesterdayDate = new Date(checkDate);
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterdayStr = yesterdayDate.toISOString().split('T')[0];
  if (!dateSet.has(todayStr) && !dateSet.has(yesterdayStr)) return 0;
  // If no workout today, start from yesterday
  if (!dateSet.has(todayStr)) {
    checkDate = yesterdayDate;
  }
  while (true) {
    const ds = checkDate.toISOString().split('T')[0];
    if (dateSet.has(ds)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
};

export const getLastWorkout = () => {
  const rows = db.getAllSync('SELECT * FROM workouts ORDER BY id DESC LIMIT 1');
  return rows.length > 0 ? rows[0] : null;
};

export const getWeeklyStats = () => {
  const today = new Date();
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekAgoStr = weekAgo.toISOString().split('T')[0];
  const workouts = db.getAllSync(
    'SELECT COUNT(DISTINCT date) as days, SUM(sets * reps * weight) as totalVolume FROM workouts WHERE date >= ?',
    [weekAgoStr]
  );
  const best = db.getAllSync(
    'SELECT exercise, MAX(weight) as maxWeight FROM workouts WHERE date >= ? GROUP BY exercise ORDER BY maxWeight DESC LIMIT 1',
    [weekAgoStr]
  );
  return {
    workoutDays: workouts[0]?.days || 0,
    totalVolume: Math.round(workouts[0]?.totalVolume || 0),
    bestLift: best.length > 0 ? best[0] : null,
  };
};

export const insertProfile = (name, age, weight, goal) => {
  db.runSync(
    'INSERT OR REPLACE INTO profile (id, name, age, weight, goal) VALUES (1,?,?,?,?)',
    [name, age, weight, goal]
  );
};

export const getProfile = () => {
  const rows = db.getAllSync('SELECT * FROM profile LIMIT 1');
  return rows.length > 0 ? rows[0] : null;
};
