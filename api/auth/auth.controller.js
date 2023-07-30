import authService from './auth.service.js';

class AuthController {
  signUp = async (req, res) => {
    const { first_name, last_name, email, password } = req.body;

    const user = await authService.signUp({ first_name, last_name, email, password });
    if (!user) return res.status(404).json({ message: 'User with this email address already exists' });

    res.status(200).json(user);
  }

  signIn = async (req, res) => {
    const user = await authService.signIn();
    res.status(200).json(user);
  }

  logout = async (req, res) => {
    const user = await authService.logout();
    res.status(200).json(user);
  }

  refresh = async (req, res) => {
    const user = await authService.refresh();
    res.status(200).json(user);
  }
}

export default new AuthController();
