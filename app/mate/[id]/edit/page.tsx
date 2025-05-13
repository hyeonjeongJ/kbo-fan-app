import EditPostForm from './EditPostForm';
import { Suspense } from 'react';

interface PageProps {
  params: {
    id: string;
  };
}

export default function EditPostPage({ params }: PageProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditPostForm id={params.id} />
    </Suspense>
  );
} 