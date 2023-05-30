import { Menu, Transition } from '@headlessui/react';
import { IconDotsVertical } from '@tabler/icons-react';
import { Fragment, useState } from 'react';

import { InstallFromUrlsModal } from './InstallFromUrlModal';

export const ExtraOptionsButton = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  return (
    <div className="relative text-right">
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button
            className="flex flex-shrink cursor-pointer items-center gap-3 rounded-md border
          border-theme-border-light dark:border-theme-border-dark p-3 text-sm
          text-black dark:text-white transition-colors
          duration-200 hover:bg-theme-hover-light dark:hover:bg-theme-hover-dark"
          >
            <IconDotsVertical size={16} />
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items
            className="absolute z-50 right-0 mt-2 w-56 origin-top-right
          divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black
          ring-opacity-5 focus:outline-none
          cursor-pointer items-center gap-3 border
          border-theme-border-light dark:border-theme-border-dark text-sm
          text-black dark:text-white transition-colors
          duration-200 
          bg-theme-dropdown-light dark:bg-theme-dropdown-dark"
          >
            <div className="px-1 py-1 ">
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active
                        ? 'bg-theme-dropdown-hover-light dark:bg-theme-dropdown-hover-dark text-black dark:text-white'
                        : 'text-black dark:text-white'
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowModal(true);
                    }}
                  >
                    Install from URL
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>

      {showModal && (
        <InstallFromUrlsModal onClose={() => setShowModal(false)} />
      )}
    </div>
  );
};
