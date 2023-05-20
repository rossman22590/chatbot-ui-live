import { useContext } from 'react';

import PrimaryMenuContext from '../../PrimaryMenu.context';

const Menu = ({ screens }: { screens: JSX.Element[] }) => {
  const {
    state: { selectedIndex },
  } = useContext(PrimaryMenuContext);

  const selectedScreen = screens[selectedIndex];

  return (
    <>
      <div
        className={`fixed w-[280px] h-full z-40 left-[50px] flex flex-col space-y-2 bg-[#202123] p-2 
        text-[14px] transition-all md:relative sm:relative sm:top-0 sm:left-0`}
      >
        {selectedScreen}
      </div>
    </>
  );
};

export default Menu;
