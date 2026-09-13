export class Workout {
  constructor(data = {}) {
    this.id = data.id;
    this.title = data.title || '';
    this.targetmuscle = data.targetmuscle || '';
    this.difficultlevel = data.difficultlevel || '';
    this.duration = data.duration || 0;
    this.description = data.description || '';
    this.createdAt = data.createdAt || '';
    this.updatedAt = data.updatedAt || '';
    this.trainerId = data.trainerId || null;
  }
}

export default Workout;
