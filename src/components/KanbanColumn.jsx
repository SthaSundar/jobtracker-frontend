import { useDroppable } from '@dnd-kit/core';
import KanbanCard from './KanbanCard';

function KanbanColumn({ status, title, applications, updatingId }) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  const columnApplications = applications.filter((app) => app.status === status);

  return (
    <div className="flex-1 min-w-[250px]">
      <h3 className="font-mono font-bold mb-2 text-xs uppercase tracking-wider text-text-muted">
        {title} ({columnApplications.length})
      </h3>
      <div
        ref={setNodeRef}
        className={`flex flex-col gap-2 p-2 rounded-md min-h-[200px] border-2 border-dashed transition-colors ${
          isOver ? 'border-accent bg-surface/50' : 'border-accent/20'
        }`}
      >
        {columnApplications.map((app) => (
          <KanbanCard key={app.id} application={app} isUpdating={app.id === updatingId} />
        ))}
      </div>
    </div>
  );
}

export default KanbanColumn;