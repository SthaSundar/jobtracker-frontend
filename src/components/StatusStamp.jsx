const LABELS = {
  applied: 'Applied',
  interview: 'Interview',
  offer: 'Offer',
  rejected: 'Rejected',
};

const STYLES = {
  applied: 'border-status-applied text-status-applied',
  interview: 'border-status-interview text-status-interview',
  offer: 'border-status-offer text-status-offer',
  rejected: 'border-status-rejected text-status-rejected',
};

function StatusStamp({ status }) {
  return (
    <span
      className={`inline-block px-2.5 py-1 rounded-full border-2 text-[10px] font-mono uppercase tracking-wider -rotate-2 ${STYLES[status]}`}
    >
      {LABELS[status]}
    </span>
  );
}

export default StatusStamp; 