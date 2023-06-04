import { useCallback, useContext, useEffect } from 'react';

import { LEARNING_URL } from '@/utils/app/const';

import { Namespace } from '@/types/learning';

import HomeContext from '@/pages/api/home/home.context';

export const NamespaceSelect = () => {
  const {
    state: { selectedNamespace, namespaces },
    dispatch: homeDispatch,
  } = useContext(HomeContext);

  const handleSwitchNamespace = (name: string) => {
    const namespace = namespaces.find(
      (namespace) => namespace.namespace === name,
    );
    homeDispatch({
      field: 'selectedNamespace',
      value: namespace,
    });
  };

  return (
    <div
      className="
      pr-2 w-full flex flex-shrink cursor-pointer select-none items-center justify-center
      gap-1 text-white
      rounded-md border border-theme-border-light dark:border-theme-border-dark
      bg-gradient-to-r from-fuchsia-600 via-violet-900 to-indigo-500
      dark:from-fuchsia-500 dark:via-violet-600 dark:to-indigo-400
      bg-175% animate-bg-pan-slow appearance-none dark:bg-gray-700 hover:opacity-90
      "
    >
      <select
        className="text-left w-full bg-transparent py-3 sm:py-2"
        value={selectedNamespace?.namespace}
        onChange={(event) => handleSwitchNamespace(event.target.value)}
      >
        {namespaces.map((namespace, index) => (
          <option
            key={index}
            value={namespace.namespace}
            className="bg-theme-primary-menu-light dark:bg-theme-primary-menu-dark text-black dark:text-white"
          >
            {namespace.namespace}
          </option>
        ))}
      </select>
    </div>
  );
};
