import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from './ui/use-toast';
import { SelectService } from '@/drizzle/schema';
import { Button } from './ui/button';

export const ServiceCard = ({ service }: { service: SelectService }) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/services/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete service');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast({
        variant: 'default',
        title: 'Service deleted',
        description: 'The service has been removed from the list',
      });
    },
    onError: (error) => {
      toast({
        title: 'Failed to delete service',
        description: 'Please try again',
      });
      console.error(error);
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate(service.id);
  };

  return (
    <div className='bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden'>
      <div className='p-4 flex justify-between items-center'>
        <div className='overflow-hidden'>
          <p className='font-medium truncate'>{service.name}</p>
          <p className='text-sm text-gray-500'>{service.duration} minutes</p>
        </div>
        <Button
          size='sm'
          variant='destructive'
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
        >
          {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
        </Button>
      </div>
    </div>
  );
};
