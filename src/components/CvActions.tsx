interface CvActionsProps {
  path: string;
  viewUrl: string;
  downloadUrl: string;
  className?: string;
}

export function CvActions({ viewUrl, downloadUrl, className }: CvActionsProps) {
  return (
    <div className={className ?? "flex items-center gap-4"}>
      <a href={viewUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-cricket-red hover:underline">View CV / Resume ↗</a>
      <a href={downloadUrl} download className="text-sm text-cricket-red hover:underline">↓ Download</a>
    </div>
  );
}
