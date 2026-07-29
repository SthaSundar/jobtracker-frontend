import { useDroppable } from '@dnd-kit/core';
import KanbanCard from './KanbanCard';

function KanbanColumn({ status, title, applications }) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  const columnApplications = applications.filter((app) => app.status === status);

  return (
    <div className="flex-1 min-w-[250px]">
      <h3 className="font-bold mb-2 text-sm uppercase text-slate-400">
        {title} ({columnApplications.length})
      </h3>
      <div
        ref={setNodeRef}
        className={`flex flex-col gap-2 p-2 rounded min-h-[200px] border-2 border-dashed transition-colors ${
          isOver ? 'border-blue-500 bg-slate-800/50' : 'border-slate-700'
        }`}
      >
        {columnApplications.map((app) => (
          <KanbanCard key={app.id} application={app} />
        ))}
      </div>
    </div>
  );
}

export default KanbanColumn;