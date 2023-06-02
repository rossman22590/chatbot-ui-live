import { IconFilePlus } from '@tabler/icons-react';
import {
  FC,
  KeyboardEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { useTranslation } from 'next-i18next';

import { Namespace } from '@/types/learning';
import { Prompt } from '@chatbot-ui/core/types/prompt';

import LearningScreenContext from '../LearningScreen.context';

import { url } from 'inspector';

export const AddNamespaceModal = ({ onClose }: { onClose: () => void }) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const { t } = useTranslation('promptbar');
  const [name, setName] = useState('');
  const [urls, setUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const { handleAddNamespace, dispatch: learningScreenDispatch } = useContext(
    LearningScreenContext,
  );

  const modalRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const handleEnter = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleAdd();
    }
  };

  const parseUrls = (urls: string) => {
    const urlArray = urls.replaceAll(' ', '').split(',');
    console.log(urlArray);
    setUrls(urlArray);
  };

  const handleFileChange = (event: any) => {
    if (event.target.files && event.target.files[0]) {
      // const fileReader = new FileReader();
      // fileReader.onload = (e) => {
      //   const buffer = e.target.result as ArrayBuffer;
      //   const binaryFile = Buffer.from(buffer).toString('base64');

      //   // Print the first 100 characters of the file
      //   console.log(binaryFile.slice(0, 100));
      // };

      // fileReader.readAsArrayBuffer(event.target.files[0]);
      setFile(event.target.files[0]);
      setFileName(event.target.files[0].name);
    }
  };

  const handleAdd = async () => {
    if (name !== '' && urls.length > 0) {
      const newNamespace: Namespace = {
        namespace: name,
      };
      setLoading(true);
      await handleAddNamespace(newNamespace, undefined, urls);
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
            <div className="text-sm font-bold text-black dark:text-neutral-200">
              {t('Name')}
            </div>
            <input
              ref={nameInputRef}
              className="mt-2 w-full rounded-lg border border-neutral-500 px-4 py-2 text-neutral-900 shadow focus:outline-none dark:border-neutral-800 dark:border-opacity-50 dark:bg-[#40414F] dark:text-neutral-100"
              placeholder={t('My namespace') || ''}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            {/* <div className="mt-6 mb-2 text-sm font-bold text-black dark:text-neutral-200">
              {t('File (Disabled)')}
            </div> */}
            {/* <label
              className="flex flex-shrink w-1/2 cursor-pointer items-center gap-3 rounded-md border
              border-theme-border-light dark:border-theme-border-dark p-3 text-sm
              text-black dark:text-white transition-colors duration-200
              hover:bg-theme-hover-light dark:hover:bg-theme-hover-dark"
            >
              <IconFilePlus size={16} />
              Add File (PDF)
              <input
                disabled
                type="file"
                id="addedFile"
                name="filename"
                className="hidden"
                accept=".pdf"
                onChange={handleFileChange}
              ></input>
            </label> */}
            {/* <p className="mt-2 pl-[12px] text-black dark:text-white">
              {fileName}
            </p> */}

            <div className="mt-6 mb-2 text-sm font-bold text-black dark:text-neutral-200">
              {t('Add URLs')}
            </div>
            <input
              ref={nameInputRef}
              className="mt-2 w-full rounded-lg border border-neutral-500 px-4 py-2 text-neutral-900 shadow focus:outline-none dark:border-neutral-800 dark:border-opacity-50 dark:bg-[#40414F] dark:text-neutral-100"
              placeholder={t('comma-separated list of URLs') || ''}
              value={urls}
              onChange={(e) => parseUrls(e.target.value)}
            />

            <button
              disabled={loading}
              type="button"
              className="w-full px-4 py-2 mt-6 border rounded-lg shadow border-neutral-500 text-neutral-900 hover:bg-neutral-100 focus:outline-none dark:border-neutral-800 dark:border-opacity-50 dark:bg-white dark:text-black dark:hover:bg-neutral-300"
              onClick={handleAdd}
            >
              {loading ? 'Creating' : t('Create')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
