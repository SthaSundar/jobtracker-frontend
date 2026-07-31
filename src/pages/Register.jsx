import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { registerSchema } from '../schemas/authSchemas';
import api from '../api/axios';
import { Eye, EyeOff } from 'lucide-react';

function Register() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

const [showPassword, setShowPassword] = useState(false);

 
  const onSubmit = async (data) => {
  setServerError('');
  try {
    await api.post('/auth/register/', data);
    navigate('/login');
  } catch (error) {
    const responseData = error.response?.data;

    if (responseData && typeof responseData === 'object') {
      const messages = Object.values(responseData)
        .flat()
        .join(' ');
      setServerError(messages || 'Registration failed. Please try again.');
    } else {
      setServerError('Registration failed. Please try again.');
    }
  }
};

  return (
    <div className="max-w-sm">
      <h2 className="text-xl mb-4">Register</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <div>
          <input
            {...register('username')}
            placeholder="Username"
            className="w-full p-2 rounded-md bg-surface border border-accent/20 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent"
          />
          {errors.username && (
            <p className="text-red-400 text-sm mt-1">{errors.username.message}</p>
          )}
        </div>

        <div>
          <input
            {...register('email')}
            placeholder="Email"
            className="w-full p-2 rounded-md bg-surface border border-accent/20 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent"
          />
          {errors.email && (
            <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <div className="relative">
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              className="w-full p-2 rounded-md bg-surface border border-accent/20 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-accent"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        {serverError && <p className="text-red-400 text-sm">{serverError}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-accent text-ink font-medium p-2 rounded-md hover:bg-accent-hover transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Creating account...' : 'Register'}
        </button>
      </form>
    </div>
  );
}

export default Register;