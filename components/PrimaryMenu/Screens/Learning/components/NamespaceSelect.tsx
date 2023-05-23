import { useCallback, useContext, useEffect } from 'react';

import { LEARNING_URL } from '@/utils/app/const';

import { Namespace } from '@/types/learning';

import HomeContext from '@/pages/api/home/home.context';

export const NamespaceSelect = () => {
  const {
    state: { selectedNamespace, namespaces },
    dispatch: homeDispatch,
  } = useContext(HomeContext);

  const fetchNamespaces = useCallback(async () => {
    const url = `${LEARNING_URL}/list_namespaces?index=secondmuse`;
    const response = await fetch(url);
    if (response.ok) {
      const body = await response.json();
      const namespaces = body.message as Namespace[];
      namespaces.unshift({ namespace: 'none' });
      console.log('namespaces', namespaces);
      homeDispatch({
        field: 'namespaces',
        value: namespaces,
      });
    }
  }, [homeDispatch]);

  useEffect(() => {
    fetchNamespaces();
  }, [fetchNamespaces]);

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
      className={
        'w-full rounded-md border border-neutral-200 bg-transparent pr-2 text-neutral-900 dark:border-neutral-600 dark:text-white'
      }
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
            className="dark:bg-unsaged-menu dark:text-white "
          >
            {namespace.namespace}
          </option>
        ))}
      </select>
    </div>
  );
};
