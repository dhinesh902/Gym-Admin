export default class Payment {
  constructor(data) {
    this.id = data?.id;
    this.memberId = data?.memberId;
    this.member = data?.Member?.fullname || 'Unknown';
    this.amount = parseFloat(data?.amount || 0).toFixed(2);
    this.date = data?.paymentDate;
    this.method = data?.paymentMethod;
    this.screenshot = data?.paymentscreenshot;
    this.transactionId = data?.transactionid;
    this.remarks = data?.remarks;
    this.status = 'Completed'; // API doesn't seem to return status, fallback
    this.createdAt = data?.createdAt;
  }
}
