import { Separator, SidebarTrigger } from '@/app/_components/ui';
import './header.scss';

export default function Header() {
  return (
    <header className='header'>
      <SidebarTrigger />
      <Separator orientation='vertical' />
    </header>
  );
}
