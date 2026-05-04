import LandingPage from './landingPage/landing';
import Sidebar from '../main/components/Sidebar';
import Popup from '../main/components/Popup';

export default function Home() {
  return (
    <>
      <Sidebar />
      <Popup />
      <LandingPage />
    </>
  );
}