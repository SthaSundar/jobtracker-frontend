import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { registerSchema } from '../schemas/authSchemas';
import api from '../api/axios';

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

  const onSubmit = async (data) => {
    setServerError('');
    try {
      await api.post('/auth/register/', data);
      navigate('/login');
    } catch (error) {
      setServerError('Registration failed. Username may already be taken.');
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
            className="w-full p-2 rounded bg-slate-800 border border-slate-700"
          />
          {errors.username && (
            <p className="text-red-400 text-sm mt-1">{errors.username.message}</p>
          )}
        </div>

        <div>
          <input
            {...register('email')}
            placeholder="Email"
            className="w-full p-2 rounded bg-slate-800 border border-slate-700"
          />
          {errors.email && (
            <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <input
            {...register('password')}
            type="password"
            placeholder="Password"
            className="w-full p-2 rounded bg-slate-800 border border-slate-700"
          />
          {errors.password && (
            <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        {serverError && <p className="text-red-400 text-sm">{serverError}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 p-2 rounded disabled:opacity-50"
        >
          {isSubmitting ? 'Creating account...' : 'Register'}
        </button>
      </form>
    </div>
  );
}

export default Register;