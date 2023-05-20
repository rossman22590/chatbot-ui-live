import {
  IconBulb,
  IconFolderPlus,
  IconMessages,
  IconPuzzle,
} from '@tabler/icons-react';
import { useContext } from 'react';

import { ActivityBarTab } from './components/ActivityBarTab';

import PrimaryMenuContext from '../../PrimaryMenu.context';

const ActivityBar = ({ icons }: { icons: JSX.Element[] }) => {
  const {
    state: { selectedIndex },
    dispatch: homeDispatch,
  } = useContext(PrimaryMenuContext);

  const handleSelect = (index: number) => {
    homeDispatch({ field: 'selectedIndex', value: index });
  };

  return (
    <div
      className={`fixed border-r border-[#121314] top-0 z-50 flex h-full w-[50px] flex-none flex-col
          space-y-6 bg-[#363739] items-center align-middle pt-6 text-[14px] transition-all sm:relative sm:top-0`}
    >
      {icons.map((icon, index) => (
        <ActivityBarTab
          handleSelect={handleSelect}
          isSelected={index === selectedIndex}
          index={index}
          key={index}
        >
          {icon}
        </ActivityBarTab>
      ))}
    </div>
  );
};

export default ActivityBar;
