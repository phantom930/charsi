import { gql, useMutation } from "@apollo/client";

export const UPLOAD_FILE_MUTATION = gql`
  mutation uploadFile($file: Upload!) {
    upload(file: $file) {
      id
      url
      name
      mime
    }
  }
`;

export const UPLOAD_MULTIPLE_FILE_MUTATION = gql`
  mutation uploadMultipleFile($files: [Upload!]!) {
    multipleUpload(files: $files) {
      id
      url
      name
      mime
    }
  }
`;

export interface FileUploadResponse {
  id: string;
  url: string;
  name: string;
  mime: string;
}

export interface UploadMultipleFileResponse {
  multipleUpload?: FileUploadResponse[];
}

interface FileUploadVariables {
  file: File;
}

interface MultipleFileUploadVariables {
  files: File[];
}

const useUploadFile = () => {
  const [uploadFile] = useMutation<FileUploadResponse, FileUploadVariables>(
    UPLOAD_FILE_MUTATION
  );

  const handleFileUpload = async (file: File) => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await uploadFile({
          variables: { file: file },
        });

        resolve(response.data);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  };

  return handleFileUpload;
};

export const useUploadMultipleFile = () => {
  const [uploadMultipleFile] = useMutation<
    FileUploadResponse[],
    MultipleFileUploadVariables
  >(UPLOAD_MULTIPLE_FILE_MUTATION);

  const handleMultipleFileUpload = async (files: File[]) => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await uploadMultipleFile({
          variables: { files: files },
        });

        resolve(response.data);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  };

  return handleMultipleFileUpload;
};

export default useUploadFile;
