import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../firebase";

export function handleUpload(
  file: File,
  {
    setIsPending,
    setProgress,
    handleComplete,
  }: {
    setIsPending: (value: boolean) => void;
    setProgress: (value: number) => void;
    handleComplete: (url: string) => void;
  }
) {
  console.log("file - ", file);
  const storageRef = ref(storage, `images/${file.name}`);

  const uploadTask = uploadBytesResumable(storageRef, file);
  setIsPending(true);

  uploadTask.on(
    "state_changed",
    (snapshot) => {
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      const _progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log("Upload is " + _progress + "% done");
      setProgress(_progress);
      switch (snapshot.state) {
        case "paused":
          console.log("Upload is paused");
          break;
        case "running":
          console.log("Upload is running");
          break;
      }
    },
    (error) => {
      // A full list of error codes is available at
      // https://firebase.google.com/docs/storage/web/handle-errors
      switch (error.code) {
        case "storage/unauthorized":
          // User doesn't have permission to access the object
          break;
        case "storage/canceled":
          // User canceled the upload
          break;

        // ...

        case "storage/unknown":
          // Unknown error occurred, inspect error.serverResponse
          break;
      }

      setIsPending(false);
    },
    () => {
      // Upload completed successfully, now we can get the download URL
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        console.log("File available at", downloadURL);
        //   setIsPending(false);
        handleComplete(downloadURL);
      });
    }
  );
}

export function handleUploadAsync(
  file: File,
  {
    setProgress,
  }: {
    setProgress: (value: number) => void;
  }
): Promise<string> {
  return new Promise((resolve, reject) => {
    console.log("file - ", file);
    const storageRef = ref(storage, `images/${file.name}`);

    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const _progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + _progress + "% done");
        setProgress(_progress);
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case "storage/unauthorized":
            // User doesn't have permission to access the object
            break;
          case "storage/canceled":
            // User canceled the upload
            break;

          // ...

          case "storage/unknown":
            // Unknown error occurred, inspect error.serverResponse
            break;
        }

        reject(error);
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          //   setIsPending(false);
          // handleComplete(downloadURL);
          resolve(downloadURL);
        });
      }
    );
  });
}
