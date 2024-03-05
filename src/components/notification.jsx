export default function Notification({ children }) {
  return (
    <div className="p-4 bg-indigo-100 dark:bg-indigo-950 text-sm rounded-md space-y-4">
      {children}
    </div>
  );
}
