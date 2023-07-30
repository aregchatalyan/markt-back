import UserModel from '../../models/user/user.model.js';
import UserCreateDto from '../../models/user/user-create.dto.js';
import bcrypt from 'bcrypt';

class AuthService {
  signUp = async ({ first_name, last_name, email, password }) => {
    const candidate = await UserModel.findOne({ email });
    // if (candidate) throw new Error('User with this email address already exists');
    if (candidate) return null;

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt)

    const user = await UserModel.create({ first_name, last_name, email, password: hash });
    return new UserCreateDto(user);
  }

  signIn = async () => {
    return 'Hello Motherfucker';
  }

  logout = async () => {
    return 'Hello Motherfucker';
  }

  refresh = async () => {
    return 'Hello Motherfucker';
  }
}

export default new AuthService();
