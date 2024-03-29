import _ from 'lodash';

export class UserDto {
  id;
  first_name;
  last_name;
  username;
  email;
  avatar;
  phone;
  password;
  active;
  role;
  created_at;
  updated_at;

  constructor(model) {
    this.id = model?.id;
    this.first_name = model?.first_name;
    this.last_name = model?.last_name;
    this.username = model?.username;
    this.email = model?.email;
    this.avatar = model?.avatar;
    this.phone = model?.phone;
    this.password = model?.password;
    this.active = model?.active;
    this.role = model?.role;
    this.created_at = model?.created_at;
    this.updated_at = model?.updated_at;
  }

  create() {
    const picked = _.pick(this, [ 'first_name', 'last_name', 'username', 'email', 'phone', 'password' ]);

    return _.omitBy(picked, (value) => typeof value === 'undefined');
  }

  get() {
    return _.omit(this, [ 'password' ]);
  }

  update() {
    const picked = _.pick(this, [ 'first_name', 'last_name', 'username', 'email', 'avatar', 'phone', 'password' ]);

    return _.omitBy(picked, (value) => typeof value === 'undefined');
  }
}
