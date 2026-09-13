export class Diet {
  constructor(data = {}) {
    this.id = data.id;
    this.title = data.title || '';
    this.dietgoal = data.dietgoal || '';
    this.calories = data.calories || 0;
    this.diettype = data.diettype || '';
    this.morning = data.morning || '';
    this.lunch = data.lunch || '';
    this.dinner = data.dinner || '';
    this.restrictions = data.restrictions || '';
    this.createdAt = data.createdAt || '';
    this.updatedAt = data.updatedAt || '';
    this.trainerId = data.trainerId || null;
  }
}

export default Diet;
