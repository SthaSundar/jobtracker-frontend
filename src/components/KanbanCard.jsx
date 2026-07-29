import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Link } from 'react-router';

function KanbanCard({ application }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: application.id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="bg-slate-800 border border-slate-700 rounded p-3 cursor-grab active:cursor-grabbing"
    >
      <p className="font-bold text-sm">{application.role}</p>
      <p className="text-slate-400 text-xs">{application.company}</p>
      <Link
        to={`/applications/${application.id}`}
        className="text-blue-400 text-xs hover:underline mt-1 inline-block"
        onClick={(e) => e.stopPropagation()}
      >
        Edit
      </Link>
    </div>
  );
}

export default KanbanCard;