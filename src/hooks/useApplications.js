import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';

const fetchApplications = async () => {
  const response = await api.get('/applications/');
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

export function useApplications() {
  return useQuery({
    queryKey: ['applications'],
    queryFn: fetchApplications,
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
    },
  });
}

export function useUpdateApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
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
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
  });
}