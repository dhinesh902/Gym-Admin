export class MembershipPlan {
  constructor(data = {}) {
    this.id = data.id || data._id;
    this.name = data.name || '';
    this.description = data.description || '';
    this.durationInMonths = data.durationInMonths || data.duration || 0;
    this.price = data.price || 0;
    this.createdAt = data.createdAt || '';
    this.updatedAt = data.updatedAt || '';
    this.status = data.status || 'Active';
  }
}

export default MembershipPlan;
