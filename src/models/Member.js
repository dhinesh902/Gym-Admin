import Trainer from './Trainer';
import MembershipPlan from './MembershipPlan';

export class Member {
  constructor(data = {}) {
    this.id = data.id;
    this.fullname = data.fullname || '';
    this.email = data.email || '';
    this.phone = data.phone || '';
    this.dateofbirth = data.dateofbirth || '';
    this.gender = data.gender || '';
    this.emergency = data.emergency || '';
    this.address = data.address || '';
    this.height = data.height || null;
    this.weight = data.weight || null;
    this.bloodgroup = data.bloodgroup || '';
    this.fitnessgoal = data.fitnessgoal || '';
    this.assignedtrainer = data.assignedtrainer || null;
    this.membershipplanid = data.membershipplanid || null;
    this.joiningdate = data.joiningdate || '';
    this.status = data.status || 'active';
    this.profilephoto = data.profilephoto || null;
    this.createdAt = data.createdAt || '';
    this.updatedAt = data.updatedAt || '';
    
    // Relations
    this.Trainer = data.Trainer ? new Trainer(data.Trainer) : null;
    this.MembershipPlan = data.MembershipPlan ? new MembershipPlan(data.MembershipPlan) : null;
  }
}

export default Member;
