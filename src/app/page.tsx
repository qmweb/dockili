import { registryService } from '@/features/registry';
import '@/styles/pages/home.scss';
import { Repository } from '@/utils/types/registry.interface';
import DashboardChart from './(pages)/(home)/_components/dashboard-chart';

export default async function Home() {
  const data = await registryService.getRepositoriesWithTags();
  const repositories = data.repositories as Repository[];

  return <DashboardChart repositories={repositories} />;
}
