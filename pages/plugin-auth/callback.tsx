import { useEffect } from 'react';

import { useRouter } from 'next/router';

import { APP_DOMAIN } from '@/utils/app/const';

// import { saveAccessToken } from '../saveAccessToken';

// Import the saveAccessToken function

const Callback = () => {
  const router = useRouter();
  const { plugin_id, access_token, expires_in } = router.query;

  useEffect(() => {
    if (access_token && expires_in) {
      document.cookie = `${plugin_id}-token=${access_token}; max-age=${expires_in}; domain=${APP_DOMAIN}; path=/`;
    }
  }, [access_token, router, expires_in, plugin_id]);

  return <div className="text-white">You may now close this tab</div>;
};

export default Callback;
