import { registryService } from '@/features/registry';
import '@/styles/pages/image.scss';
import { RegistryRepositoriesResponse } from '@/utils/types/registry.interface';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ImageDetails from './_components/image-details';

interface ImagePageProps {
  params: {
    image: string;
  };
}

export async function generateMetadata({
  params,
}: ImagePageProps): Promise<Metadata> {
  const { image } = await params;
  const imageName = decodeURIComponent(image);

  return {
    title: `📦 ${imageName}`,
  };
}

export default async function ImagePage({ params }: ImagePageProps) {
  const { image } = await params;
  const imageName = decodeURIComponent(image);

  let repositoriesData: RegistryRepositoriesResponse = { repositories: [] };
  let error: string | null = null;

  try {
    repositoriesData = await registryService.getRepositoriesWithTags();
  } catch (err) {
    console.error('Failed to fetch registry data:', err);
    error =
      err instanceof Error ? err.message : 'Failed to fetch registry data';
  }

  // Find the specific repository
  const repository = repositoriesData.repositories.find(
    (repo) => repo.name === imageName,
  );

  if (!repository && !error) {
    notFound();
  }

  return (
    <main className='image-page'>
      <div className='image-page__container'>
        <ImageDetails
          repository={repository}
          error={error}
          imageName={imageName}
        />
      </div>
    </main>
  );
}
