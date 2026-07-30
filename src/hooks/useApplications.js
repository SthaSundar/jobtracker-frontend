import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '../api/axios';

const fetchApplications = async (filters) => {
  const response = await api.get('/applications/', { params: filters });
  return response.data;
};

const fetchApplication = async (id) => {
  const response = await api.get(`/applications/${id}/`);
  return response.data;
};

const createApplication = async (data) => {
  const response = await api.post('/applications/', data);
  return response.data;
};

const updateApplication = async ({ id, data }) => {
  const response = await api.patch(`/applications/${id}/`, data);
  return response.data;
};

const deleteApplication = async (id) => {
  await api.delete(`/applications/${id}/`);
};

export function useApplications(filters = {}) {
  return useQuery({
    queryKey: ['applications', filters],
    queryFn: () => fetchApplications(filters),
    placeholderData: keepPreviousData,
  });
}


export function useApplication(id) {
  return useQuery({
    queryKey: ['applications', id],
    queryFn: () => fetchApplication(id),
    enabled: !!id,
  });
}

export function useCreateApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      toast.success('Application created');
    },
  });
}

export function useUpdateApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      toast.success('Application updated');
    },
  });
}

export function useDeleteApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteApplication,

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['applications'] });

      const previousApplications = queryClient.getQueryData(['applications']);

      queryClient.setQueryData(['applications'], (old) =>
        old ? old.filter((app) => app.id !== id) : old
      );

      return { previousApplications };
    },

    onError: (err, id, context) => {
      queryClient.setQueryData(['applications'], context.previousApplications);
      toast.error('Failed to delete application');
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
  });
}