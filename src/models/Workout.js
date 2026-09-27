export class Workout {
  constructor(data = {}) {
    this.id = data.id;
    this.title = data.title || '';
    this.targetmuscle = data.targetmuscle || '';
    this.difficultlevel = data.difficultlevel || '';
    this.duration = data.duration || 0;
    this.description = data.description || '';
    this.workoutimage = data.workoutimage || '';
    this.sets = data.sets || 0;
    this.reps = data.reps || 0;
    this.weight = data.weight || 0;
    this.resttime = data.resttime || 0;
    this.createdAt = data.createdAt || '';
    this.updatedAt = data.updatedAt || '';
    this.trainerId = data.trainerId || null;
  }
}

export default Workout;
