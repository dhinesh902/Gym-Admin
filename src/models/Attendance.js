import Member from './Member';

export class Attendance {
  constructor(data = {}) {
    this.id = data.id;
    this.memberId = data.memberId || null;
    this.date = data.date || '';
    this.checkInTime = data.checkInTime || null;
    this.checkOutTime = data.checkOutTime || null;
    this.createdAt = data.createdAt || '';
    this.updatedAt = data.updatedAt || '';
    
    // Relations
    this.Member = data.Member ? new Member(data.Member) : null;
  }
}

export default Attendance;
