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
      className={`w-full rounded-md border border-theme-border-light dark:border-theme-border-dark
      bg-transparent pr-2 text-black dark:text-white`}
    >
      <select
        className="text-left w-full bg-transparent p-3"
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
