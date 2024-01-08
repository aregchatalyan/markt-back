import _ from 'lodash';

export class UserDto {
  id;
  firstName;
  lastName;
  username;
  email;
  avatar;
  phone;
  password;
  active;
  role;
  createdAt;
  updatedAt;

  constructor(model) {
    this.id = model?.id;
    this.firstName = model?.firstName;
    this.lastName = model?.lastName;
    this.username = model?.username;
    this.email = model?.email;
    this.avatar = model?.avatar;
    this.phone = model?.phone;
    this.password = model?.password;
    this.active = model?.active;
    this.role = model?.role;
    this.createdAt = model?.createdAt;
    this.updatedAt = model?.updatedAt;
  }

  create() {
    const picked = _.pick(this, [ 'firstName', 'lastName', 'username', 'email', 'phone', 'password' ]);

    return _.omitBy(picked, (value) => typeof value === 'undefined');
  }

  get() {
    return _.omit(this, [ 'password' ]);
  }

  update() {
    const picked = _.pick(this, [ 'firstName', 'lastName', 'username', 'email', 'avatar', 'phone', 'password' ]);

    return _.omitBy(picked, (value) => typeof value === 'undefined');
  }
}
