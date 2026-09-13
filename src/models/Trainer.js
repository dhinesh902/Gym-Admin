export class Trainer {
  constructor(data = {}) {
    this.id = data.id;
    this.fullname = data.fullname ?? data.fullName ?? '';
    this.email = data.email ?? '';
    this.password = data.password ?? '';
    this.phone = data.phone ?? '';
    this.dateofbirth = data.dateofbirth ?? data.dob ?? '';
    this.speciality = data.speciality ?? data.specialty ?? '';
    this.experience = data.experience ?? '';
    this.shifttiming = data.shifttiming ?? data.shift ?? 'Morning';
    this.monthlysalary = data.monthlysalary ?? data.salary ?? '';
    this.status = data.status ?? 'active';
    this.profilephoto = data.profilephoto ?? null;
    this.createdAt = data.createdAt ?? '';
    this.updatedAt = data.updatedAt ?? '';
  }

  toFormData({ includePassword = true } = {}) {
    const formData = new FormData();
    const fields = {
      fullname: this.fullname,
      email: this.email,
      phone: this.phone,
      dateofbirth: this.dateofbirth,
      speciality: this.speciality,
      experience: this.experience,
      shifttiming: this.shifttiming,
      monthlysalary: this.monthlysalary,
    };

    if (includePassword && this.password) fields.password = this.password;

    Object.entries(fields).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') formData.append(key, value);
    });

    if (this.profilephoto instanceof FileList && this.profilephoto[0]) {
      formData.append('profilephoto', this.profilephoto[0]);
    } else if (this.profilephoto instanceof File) {
      formData.append('profilephoto', this.profilephoto);
    }

    return formData;
  }
}

export default Trainer;
