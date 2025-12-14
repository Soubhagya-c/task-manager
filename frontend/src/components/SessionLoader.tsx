import { useGlobalLoading } from "../context/GlobalLoadingContext";

export default function SessionLoader() {
  const { refreshing } = useGlobalLoading();

  if (!refreshing) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3">
        <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full" />
        <span className="text-sm font-medium">Refreshing session…</span>
      </div>
    </div>
  );
}
