import { IInstruction } from '../helpers/types';
import { useCallback, useEffect, useState } from 'react';
import { IFileInfo } from 'react-csv-reader';

export interface IFile {
  data: string[];
  fileInfo?: IFileInfo;
}

export type IParseFile<T> = (file: IFile) => Promise<T | undefined>;

interface IParseFileReturn<T> {
  setFile: (file: IFile) => void;
  loading: boolean;
  error: boolean;
  data: T | undefined;
}

const useFile = <T extends IInstruction[]>(parseFile: IParseFile<T>): IParseFileReturn<T> => {
  const [file, setFile] = useState<IFile>();
  const [data, setData] = useState<T>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    try {
      if (!file || !file.data) return;
      setLoading(true);
      parseFile({ data: file.data.flat().filter((i) => i), fileInfo: file.fileInfo }).then(
        (data) => {
          setData(data);
          setLoading(false);
        },
      );
    } catch (error) {
      setError(true);
      setLoading(false);
    }
  }, [file, parseFile]);

  return { setFile, loading, error, data };
};

export default useFile;
