import { DndContext, closestCenter } from '@dnd-kit/core';
import { useApplications, useUpdateApplication } from '../hooks/useApplications';
import KanbanColumn from '../components/KanbanColumn';

const COLUMNS = [
  { status: 'applied', title: 'Applied' },
  { status: 'interview', title: 'Interview' },
  { status: 'offer', title: 'Offer' },
  { status: 'rejected', title: 'Rejected' },
];

function Board() {
  const { data: applications, isLoading, isError, error } = useApplications();
  const updateMutation = useUpdateApplication();

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    const applicationId = active.id;
    const newStatus = over.id;
    const application = applications.find((app) => app.id === applicationId);

    if (application.status === newStatus) return;

    updateMutation.mutate({ id: applicationId, data: { status: newStatus } });
  };

  if (isLoading) return <p>Loading board...</p>;
  if (isError) return <p className="text-red-400">Error: {error.message}</p>;

  return (
    <div>
      <h2 className="text-xl mb-4">Board</h2>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {COLUMNS.map((col) => (
            <KanbanColumn
              key={col.status}
              status={col.status}
              title={col.title}
              applications={applications}
              updatingId={updateMutation.isPending ? updateMutation.variables?.id : null}
            />
          ))}
        </div>
      </DndContext>
    </div>
  );
}

export default Board;