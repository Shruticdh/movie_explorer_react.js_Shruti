import React, { Component, ChangeEvent, FormEvent } from 'react';
import { withNavigation } from '../utils/withNavigation';
import { loginAPI } from '../Services/userServices';
import toast from 'react-hot-toast';

interface LoginPageState {
  email: string;
  password: string;
  errors: Partial<Record<keyof Omit<LoginPageState, 'errors' | 'isLoading'>, string>>;
  isLoading: boolean;
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
    };
  }

  handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    this.setState((prevState) => ({
      ...prevState,
      [name]: value,
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
    const { email, password, errors, isLoading } = this.state;

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-white bg-[url('./assets/background_Dark_signup.webp')] bg-cover bg-center px-4 relative">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-xs"></div>

        <div className="bg-black/80 border border-black-800 rounded-tl-[4rem] rounded-tr-lg rounded-br-[4rem] rounded-bl-lg p-6 w-full max-w-[25rem] shadow-md z-10">
          <h1 className="text-xl font-bold text-center text-white">Login</h1>
          <p className="text-center text-lg text-white font-semibold mt-3">Welcome Back To<div className="text-lg text-center font-bold text-red-600 cursor-pointer">
            M<span className="text-white">OVIEXPO!</span>
          </div></p>
          <p className="text-center text-sm text-white mb-6">Login to your Account</p>

          <form onSubmit={this.handleSubmit} className="space-y-4" noValidate>
            <div>
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
            </div>

            <div>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={password}
                autoComplete="off"
                onChange={this.handleChange}
                className="w-full px-4 py-2 bg-white/90 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            <button
              type="submit"
              className="w-[50%] py-2 bg-red-800 text-white font-semibold rounded-full hover:bg-red-700 transition mx-auto block"
              disabled={isLoading}
            >
              LOGIN
            </button>
          </form>

          <p className="text-center text-sm text-white mt-4">
            Don’t have an account?{' '}
            <button 
              className="text-blue-500 hover:underline cursor-pointer"
              onClick={this.handleSignupClick}
              disabled={isLoading}
            >
              Signup
            </button>
          </p>
        </div>

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