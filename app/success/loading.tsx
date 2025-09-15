import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <div className="w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full bg-brand/10 flex items-center justify-center mx-auto">
        <Loader2 className="h-10 w-10 md:h-12 md:w-12 lg:h-14 lg:w-14 text-brand animate-spin" />
      </div>
    </div>
  );
}
