import EditPostForm from './EditPostForm';
import { Suspense } from 'react';

type Props = {
  params: {
    id: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default function EditPostPage({ params }: Props) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditPostForm id={params.id} />
    </Suspense>
  );
} 