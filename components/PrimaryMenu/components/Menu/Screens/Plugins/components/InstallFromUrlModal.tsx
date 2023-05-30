import { KeyboardEvent, useContext, useEffect, useRef, useState } from 'react';

import { useTranslation } from 'next-i18next';

import PluginCatalogContext from '../PluginCatalog.context';

export const InstallFromUrlsModal = ({ onClose }: { onClose: () => void }) => {
  const { t } = useTranslation('promptbar');
  const [urls, setUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const { handleInstallFromUrls } = useContext(PluginCatalogContext);

  const modalRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const handleEnter = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleProceed();
    }
  };

  const parseUrls = (urls: string) => {
    const urlArray = urls
      .replaceAll(' ', '')
      .split(',')
      .filter((url) => url !== '');
    setUrls(urlArray);
  };

  const handleProceed = async () => {
    if (urls.length > 0) {
      setLoading(true);
      handleInstallFromUrls(urls);
      setLoading(false);
      onClose();
    }
  };

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        window.addEventListener('mouseup', handleMouseUp);
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      window.removeEventListener('mouseup', handleMouseUp);
      onClose();
    };

    window.addEventListener('mousedown', handleMouseDown);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, [onClose]);

  useEffect(() => {
    nameInputRef.current?.focus();
  }, []);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onKeyDown={handleEnter}
    >
      <div className="fixed inset-0 z-10 overflow-hidden">
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <div
            className="hidden sm:inline-block sm:h-screen sm:align-middle"
            aria-hidden="true"
          />

          <div
            ref={modalRef}
            className="dark:border-netural-400 inline-block max-h-[400px] transform overflow-y-auto rounded-lg border border-gray-300 bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all dark:bg-[#202123] sm:my-8 sm:max-h-[600px] sm:w-full sm:max-w-lg sm:p-6 sm:align-middle"
            role="dialog"
          >
            <div className="mb-2 text-sm font-bold text-black dark:text-neutral-200">
              {t('URLs')}
            </div>
            <input
              ref={nameInputRef}
              className="mt-2 w-full rounded-lg border border-neutral-500 px-4 py-2 text-neutral-900 shadow focus:outline-none dark:border-neutral-800 dark:border-opacity-50 dark:bg-[#40414F] dark:text-neutral-100"
              onChange={(e) => parseUrls(e.target.value)}
              placeholder={t('comma-separated list of URLs') || ''}
            />

            <button
              disabled={loading}
              type="button"
              className="w-full px-4 py-2 mt-6 border rounded-lg shadow border-neutral-500 text-neutral-900 hover:bg-neutral-100 focus:outline-none dark:border-neutral-800 dark:border-opacity-50 dark:bg-white dark:text-black dark:hover:bg-neutral-300"
              onClick={handleProceed}
            >
              {loading ? 'Installing' : t('Install')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
