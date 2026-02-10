const workoutPlan = [
  '10 min warm-up',
  '3 x 12 bodyweight squats',
  '3 x 10 push-ups',
  '15 min brisk walk or jog',
  '5 min cooldown stretch',
];

const state = {
  completedWorkouts: 0,
  weeklyTarget: 5,
  activityLog: [],
};

const planList = document.getElementById('workout-plan');
const goalLabel = document.getElementById('goal-label');
const progressFill = document.getElementById('goal-progress');
const completeButton = document.getElementById('complete-workout');
const logForm = document.getElementById('log-form');
const activityLog = document.getElementById('activity-log');

function renderPlan() {
  planList.innerHTML = '';
  workoutPlan.forEach((item) => {
    const li = document.createElement('li');
    li.textContent = item;
    planList.append(li);
  });
}

function renderGoal() {
  goalLabel.textContent = `${state.completedWorkouts} / ${state.weeklyTarget} workouts completed`;
  const completion = Math.min((state.completedWorkouts / state.weeklyTarget) * 100, 100);
  progressFill.style.width = `${completion}%`;
}

function renderLog() {
  activityLog.innerHTML = '';
  if (state.activityLog.length === 0) {
    const empty = document.createElement('li');
    empty.textContent = 'No activities logged yet.';
    activityLog.append(empty);
    return;
  }

  [...state.activityLog].reverse().forEach((entry) => {
    const li = document.createElement('li');
    li.textContent = `${entry.activity} • ${entry.duration} min`;
    activityLog.append(li);
  });
}

completeButton.addEventListener('click', () => {
  state.completedWorkouts += 1;
  renderGoal();
});

logForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(logForm);
  state.activityLog.push({
    activity: formData.get('activity').toString().trim(),
    duration: Number(formData.get('duration')),
  });

  logForm.reset();
  renderLog();
});

renderPlan();
renderGoal();
renderLog();
