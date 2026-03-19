'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function CustomizeRedirect() {
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    router.replace(`/editor/${params.id}`);
  }, [router, params.id]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
    </div>
  );
}
