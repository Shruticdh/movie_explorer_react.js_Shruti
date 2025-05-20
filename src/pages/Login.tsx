import React, { Component, ChangeEvent, FormEvent } from 'react';
import { withNavigation } from '../utils/withNavigation';
import { loginAPI } from '../Services/userServices';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FiEye, FiEyeOff } from 'react-icons/fi'; 

interface LoginPageState {
  email: string;
  password: string;
  errors: Partial<Record<keyof Omit<LoginPageState, 'errors' | 'isLoading' | 'showPassword'>, string>>;
  isLoading: boolean;
  showPassword: boolean; 
}

interface LoginPageProps {
  navigate: (path: string) => void;
}

class LoginPage extends Component<LoginPageProps, LoginPageState> {
  constructor(props: LoginPageProps) {
    super(props);
    this.state = {
      email: '',
      password: '',
      errors: {},
      isLoading: false,
      showPassword: false, 
    };
  }

  handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    this.setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  toggleShowPassword = () => {
    this.setState((prevState) => ({
      showPassword: !prevState.showPassword,
    }));
  };

  validateFields = (): boolean => {
    const { email, password } = this.state;
    const errors: LoginPageState["errors"] = {};

    if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Enter a valid email";
    }

    if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    this.setState({ errors });

    return Object.keys(errors).length === 0;
  };

  handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!this.validateFields()) return;

    this.setState({ isLoading: true });

    const { email, password } = this.state;

    try {
      const user = await loginAPI({ email, password });

      if (user?.token) {
        toast.success('Login successful!');
        localStorage.setItem("token", user.token);
        localStorage.setItem("user", JSON.stringify(user));    
        this.props.navigate('/dashboard'); 
      } else {
        toast.error('Login failed: Invalid credentials');
      }
    } catch (error: any) {
      console.error('Login failed:', error);
      toast.error('Login failed: Something went wrong');
    } finally {
      this.setState({ isLoading: false });
    }
  };

  handleSignupClick = () => {
    this.props.navigate('/signup');
  };

  render() {
    const { email, password, errors, isLoading, showPassword } = this.state;

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-white bg-[url('./assets/background_Dark_signup.webp')] bg-cover bg-center px-4 relative">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-xs"></div>

        <motion.div
          className="bg-black/80 border border-black-800 rounded-tl-[4rem] rounded-tr-lg rounded-br-[4rem] rounded-bl-lg p-6 w-full max-w-[25rem] shadow-md z-10"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1
            className="text-xl font-bold text-center text-white"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Login
          </motion.h1>

          <motion.div
            className="text-center text-lg text-white font-semibold mt-3"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            Welcome Back To
            <div className="text-lg text-center font-bold text-red-600 cursor-pointer">
              M<span className="text-white">OVIEXPO!</span>
            </div>
          </motion.div>

          <motion.p
            className="text-center text-sm text-white mb-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.4 }}
          >
            Login to your Account
          </motion.p>

          <motion.form
            onSubmit={this.handleSubmit}
            className="space-y-4"
            noValidate
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.2,
                  delayChildren: 0.9,
                },
              },
            }}
          >
            <motion.div
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            >
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={email}
                autoComplete="off"
                onChange={this.handleChange}
                className="w-full bg-white/90 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </motion.div>

            <motion.div
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            >
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Enter your password"
                  value={password}
                  autoComplete="off"
                  onChange={this.handleChange}
                  className="w-full px-4 py-2 bg-white/90 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-300 pr-10"
                />
                <button
                  type="button"
                  onClick={this.toggleShowPassword}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </motion.div>

            <motion.button
              type="submit"
              className="w-[50%] py-2 bg-red-800 text-white font-semibold rounded-full hover:bg-red-700 transition mx-auto block"
              disabled={isLoading}
              variants={{ hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1 } }}
            >
              LOGIN
            </motion.button>
          </motion.form>

          <motion.p
            className="text-center text-sm text-white mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6 }}
          >
            Don’t have an account?{' '}
            <button
              className="text-blue-500 hover:underline cursor-pointer"
              onClick={this.handleSignupClick}
              disabled={isLoading}
            >
              Signup
            </button>
          </motion.p>
        </motion.div>

        {isLoading && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50">
            <div className="text-center">
              <p className="text-center text-4xl text-white font-semibold mt-3">Wait For<div className="text-4xl text-center font-bold text-red-600 cursor-pointer">
                M<span className="text-white text-4xl">OVIEXPO! Entry!</span>
              </div></p>
              <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mt-4"></div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default withNavigation(LoginPage);