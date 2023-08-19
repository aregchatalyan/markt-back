import _ from 'lodash';

class UserDto {
  id;
  first_name;
  last_name;
  username;
  email;
  avatar;
  phone;
  password;
  active;
  created_at;
  updated_at;

  constructor(model) {
    this.id = model.id;
    this.first_name = model.first_name;
    this.last_name = model.last_name;
    this.username = model.username;
    this.email = model.email;
    this.avatar = model.avatar;
    this.phone = model.phone;
    this.password = model.password;
    this.active = model.active;
    this.created_at = model.created_at;
    this.updated_at = model.updated_at;
  }

  create() {
    return _.pick(this, [ 'first_name', 'last_name', 'username', 'email', 'phone', 'password' ]);
  }

  get() {
    return _.omit(this, [ 'password' ]);
  }

  update() {
    const picked = _.pick(this, [ 'first_name', 'last_name', 'username', 'email', 'avatar', 'phone', 'password' ]);

    return _.omitBy(picked, (value, l) => typeof value === 'undefined');
  }
}

export default UserDto;
