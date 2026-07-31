import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { loginSchema } from '../schemas/authSchemas';
import useAuthStore from '../store/authStore';
import api from '../api/axios';
import { Eye, EyeOff } from 'lucide-react';

function Login() {
  const navigate = useNavigate();
  const setTokens = useAuthStore((state) => state.setTokens);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

const [showPassword, setShowPassword] = useState(false);


  const onSubmit = async (data) => {
    setServerError('');
    try {
      const response = await api.post('/auth/login/', data);
      setTokens(response.data.access, response.data.refresh);
      navigate('/');
    } catch (error) {
      setServerError('Invalid username or password.');
    }
  };

  return (
    <div className="max-w-sm">
      <h2 className="text-xl mb-4">Login</h2>

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
          {isSubmitting ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}

export default Login;