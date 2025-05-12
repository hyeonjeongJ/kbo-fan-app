import EditPostForm from './EditPostForm';
import { Suspense } from 'react';

interface PageProps {
  params: {
    id: string;
  };
}

export default async function EditPostPage({ params }: PageProps) {
  const id = await Promise.resolve(params.id);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditPostForm id={id} />
    </Suspense>
  );
} 