import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Link } from 'react-router';
import StatusStamp from './StatusStamp';

function KanbanCard({ application, isUpdating }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: application.id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : isUpdating ? 0.6 : 1,
    touchAction: 'none',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="bg-surface border border-accent/10 rounded-md p-3 cursor-grab active:cursor-grabbing"
    >
      <p className="font-bold text-sm text-text-primary">{application.role}</p>
      <p className="text-text-muted text-xs">{application.company}</p>
      {isUpdating && <p className="text-accent text-xs">Updating...</p>}
      <div className="flex items-center gap-2 mt-1">
      <StatusStamp status={application.status} />
      <Link
        to={`/applications/${application.id}`}
        className="text-accent text-xs hover:underline"
        onClick={(e) => e.stopPropagation()}
      >
        Edit
      </Link>
      </div>
    </div>
  );
}

export default KanbanCard;