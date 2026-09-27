export class Diet {
  constructor(data = {}) {
    this.id = data.id || null;
    this.session = data.session || '';
    this.foodName = data.foodName || '';
    this.foodimageurl = data.foodimageurl || '';
    this.isQuantity = Boolean(data.isQuantity);
    this.isGrams = Boolean(data.isGrams);
    this.quantity = data.quantity || null;
    this.grams = data.grams || null;
    this.description = data.description || '';
    this.createdAt = data.createdAt || '';
    this.updatedAt = data.updatedAt || '';
    this.trainerId = data.trainerId || null;
  }
}

export default Diet;
