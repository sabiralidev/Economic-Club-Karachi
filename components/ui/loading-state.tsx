type LoadingStateProps = {
  label?: string;
};

export function LoadingState({ label = "Loading" }: LoadingStateProps) {
  return (
    <div aria-label={label} className="flex items-center gap-3 text-sm text-brand-ink/70" role="status">
      <span
        aria-hidden="true"
        className="h-4 w-4 animate-spin rounded-full border-2 border-brand-purple/20 border-t-brand-teal motion-reduce:animate-none"
      />
      <span>{label}</span>
    </div>
  );
}
