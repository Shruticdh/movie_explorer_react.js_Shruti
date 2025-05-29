import React, { Component, ChangeEvent, FormEvent } from 'react';
import { withNavigation } from '../utils/withNavigation';
import { signup } from '../Services/userServices';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FiEye, FiEyeOff } from 'react-icons/fi';

interface SignupState {
  name: string;
  mobile: string;
  email: string;
  password: string;
  confirmPassword: string;
  errors: Partial<Record<keyof Omit<SignupState, 'errors' | 'showPassword' | 'showConfirmPassword'>, string>>;
  showPassword: boolean;
  showConfirmPassword: boolean;
}

interface SignupPageProps {
  navigate: (path: string) => void;
}

class Signup extends Component<SignupPageProps, SignupState> {
  constructor(props: SignupPageProps) {
    super(props);
    this.state = {
      name: '',
      mobile: '',
      email: '',
      password: '',
      confirmPassword: '',
      errors: {},
      showPassword: false,
      showConfirmPassword: false,
    };
  }

  handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    this.setState(
      (prevState) => ({
        ...prevState,
        [name]: value,
      }),
      () => {
        this.validateField(name as keyof Omit<SignupState, 'errors' | 'showPassword' | 'showConfirmPassword'>, value);
      }
    );
  };

  toggleShowPassword = () => {
    this.setState((prevState) => ({
      showPassword: !prevState.showPassword,
    }));
  };

  toggleShowConfirmPassword = () => {
    this.setState((prevState) => ({
      showConfirmPassword: !prevState.showConfirmPassword,
    }));
  };

  validateField = (field: keyof Omit<SignupState, 'errors' | 'showPassword' | 'showConfirmPassword'>, value: string) => {
    const errors = { ...this.state.errors };

    switch (field) {
      case 'name':
        errors.name = value.trim() ? '' : 'Name is required';
        break;
      case 'mobile':
        errors.mobile = /^\d{10}$/.test(value) ? '' : 'Mobile must be 10 digits';
        break;
      case 'email':
        errors.email = /\S+@\S+\.\S+/.test(value) ? '' : 'Enter a valid email';
        break;
      case 'password':
        errors.password = value.length >= 6 ? '' : 'Password must be at least 6 characters';
        break;
      case 'confirmPassword':
        errors.confirmPassword = value === this.state.password ? '' : 'Passwords do not match';
        break;
    }

    this.setState({ errors });
  };

  handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { name, mobile, email, password } = this.state;
    const fields: (keyof Omit<SignupState, 'errors' | 'showPassword' | 'showConfirmPassword'>)[] = ['name', 'mobile', 'email', 'password', 'confirmPassword'];

    fields.forEach((field) => this.validateField(field, this.state[field]));

    const hasErrors = fields.some((field) => this.state.errors[field]);
    if (hasErrors) return;

    try {
      const userData = { name, mobile_number: mobile, email, password };
      const response = await signup(userData);
      if (response) {
        this.props.navigate('/');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Signup failed. Please try again.';
      toast.error(errorMessage);
    }
  };

  handleLoginClick = () => {
    this.props.navigate('/');
  };

  render() {
    const { name, mobile, email, password, confirmPassword, errors, showPassword, showConfirmPassword } = this.state;

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-white bg-[url('./assets/background_Dark_signup.webp')] bg-cover bg-center px-4 relative">
        <style>
          {`
            input::-ms-reveal {
              display: none !important; /* Hide Edge's native password reveal button */
            }
          `}
        </style>
        <div className="absolute inset-0 bg-black/50 backdrop-bl-xs"></div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="bg-black/86 border border-black-800 rounded-tl-[4rem] rounded-tr-lg rounded-br-[4rem] rounded-bl-lg p-7 w-full max-w-[25rem] shadow-md z-10"
        >
          <h1 className="text-xl font-bold text-center text-[white]">Signup</h1>
          <p className="text-center text-lg text-[white] font-semibold mt-3">Create Account</p>
          <p className="text-center text-sm text-[white] mb-6">Join us now</p>

          <form onSubmit={this.handleSubmit} className="space-y-4" noValidate>
            <div>
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={name}
                onChange={this.handleChange}
                className="w-full bg-white/90 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
            <div>
              <input
                type="text"
                name="mobile"
                placeholder="Enter your mobile number"
                value={mobile}
                onChange={this.handleChange}
                className="w-full px-4 py-2 bg-white/90 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
              {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>}
            </div>
            <div>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={email}
                onChange={this.handleChange}
                className="w-full px-4 py-2 bg-white/90 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
            <div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'} 
                  name="password"
                  placeholder="Enter your password"
                  value={password}
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
            </div>
            <div>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'} 
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={this.handleChange}
                  className="w-full px-4 py-2 bg-white/90 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-300 pr-10"
                />
                <button
                  type="button"
                  onClick={this.toggleShowConfirmPassword}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
                >
                  {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>

            <button
              type="submit"
              className="w-[50%] py-2 bg-red-800 text-white font-semibold rounded-full hover:bg-red-700 transition mx-auto block cursor-pointer"
            >
              SIGNUP
            </button>
          </form>

          <p className="text-center text-sm text-[white] mt-4">
            Already have an account?{' '}
            <button className="text-blue-500 hover:underline cursor-pointer" onClick={this.handleLoginClick}>
              Login
            </button>
          </p>
        </motion.div>
      </div>
    );
  }
}

export default withNavigation(Signup);