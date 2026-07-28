import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams } from 'react-router';
import { useEffect } from 'react';
import { applicationSchema } from '../schemas/applicationSchema';
import { useApplication, useCreateApplication, useUpdateApplication } from '../hooks/useApplications';

function ApplicationForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const { data: existingApplication, isLoading: isLoadingExisting } = useApplication(id);
  const createMutation = useCreateApplication();
  const updateMutation = useUpdateApplication();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      status: 'applied',
    },
  });

  useEffect(() => {
    if (isEditing && existingApplication) {
      reset({
        company: existingApplication.company,
        role: existingApplication.role,
        status: existingApplication.status,
        date_applied: existingApplication.date_applied,
        follow_up_date: existingApplication.follow_up_date || '',
        notes: existingApplication.notes || '',
        job_link: existingApplication.job_link || '',
      });
    }
  }, [isEditing, existingApplication, reset]);

  const onSubmit = async (data) => {
  const cleanedData = {
    ...data,
    follow_up_date: data.follow_up_date || null,
  };

  if (isEditing) {
    await updateMutation.mutateAsync({ id, data: cleanedData });
  } else {
    await createMutation.mutateAsync(cleanedData);
  }
  navigate('/');
};

  if (isEditing && isLoadingExisting) {
    return <p>Loading...</p>;
  }

  return (
    <div className="max-w-md">
      <h2 className="text-xl mb-4">{isEditing ? 'Edit Application' : 'New Application'}</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <div>
          <input
            {...register('company')}
            placeholder="Company"
            className="w-full p-2 rounded bg-slate-800 border border-slate-700"
          />
          {errors.company && <p className="text-red-400 text-sm mt-1">{errors.company.message}</p>}
        </div>

        <div>
          <input
            {...register('role')}
            placeholder="Role"
            className="w-full p-2 rounded bg-slate-800 border border-slate-700"
          />
          {errors.role && <p className="text-red-400 text-sm mt-1">{errors.role.message}</p>}
        </div>

        <div>
          <select
            {...register('status')}
            className="w-full p-2 rounded bg-slate-800 border border-slate-700"
          >
            <option value="applied">Applied</option>
            <option value="interview">Interview</option>
            <option value="offer">Offer</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div>
          <label className="text-sm text-slate-400">Date Applied</label>
          <input
            {...register('date_applied')}
            type="date"
            className="w-full p-2 rounded bg-slate-800 border border-slate-700"
          />
          {errors.date_applied && (
            <p className="text-red-400 text-sm mt-1">{errors.date_applied.message}</p>
          )}
        </div>

        <div>
          <label className="text-sm text-slate-400">Follow-up Date (optional)</label>
          <input
            {...register('follow_up_date')}
            type="date"
            className="w-full p-2 rounded bg-slate-800 border border-slate-700"
          />
        </div>

        <div>
          <input
            {...register('job_link')}
            placeholder="Job posting URL (optional)"
            className="w-full p-2 rounded bg-slate-800 border border-slate-700"
          />
          {errors.job_link && <p className="text-red-400 text-sm mt-1">{errors.job_link.message}</p>}
        </div>

        <div>
          <textarea
            {...register('notes')}
            placeholder="Notes (optional)"
            rows={3}
            className="w-full p-2 rounded bg-slate-800 border border-slate-700"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 p-2 rounded disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : isEditing ? 'Update Application' : 'Create Application'}
        </button>
      </form>
    </div>
  );
}

export default ApplicationForm;