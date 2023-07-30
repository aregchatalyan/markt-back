class UserCreateDto {
  id;
  first_name;
  last_name;
  username;
  email;
  avatar;
  phone;

  constructor(model) {
    this.id = model.id;
    this.first_name = model.first_name;
    this.last_name = model.last_name;
    this.username = model.username;
    this.email = model.email;
    this.avatar = model.avatar;
    this.phone = model.phone;
  }
}

export default UserCreateDto;
