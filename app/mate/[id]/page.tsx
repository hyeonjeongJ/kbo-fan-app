import PostDetail from './PostDetail';
import { Suspense } from 'react';

interface PageProps {
  params: {
    id: string;
  };
}

export default function Page({ params }: PageProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PostDetail id={params.id} />
    </Suspense>
  );
} 