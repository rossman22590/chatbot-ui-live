import { useContext } from 'react';

import { LearningFile } from '@/types/learning';

import LearningScreenContext from '../LearningScreen.context';
import { FileComponent } from './FileComponent';

interface Props {
  files: LearningFile[];
}

export const FileList = ({ files }: Props) => {
  const {
    state: { selectedFile },
    dispatch: learningScreenDispatch,
  } = useContext(LearningScreenContext);

  const handleSelect = (index: number) => {
    learningScreenDispatch({ field: 'selectedFile', value: files[index] });
  };

  return (
    <div className="relative h-fit flex w-full flex-col gap-1">
      {files.slice().map((file, index) => (
        <FileComponent
          handleSelect={handleSelect}
          isSelected={selectedFile?.id === file.id}
          index={index}
          key={index}
          file={file}
        />
      ))}
    </div>
  );
};
