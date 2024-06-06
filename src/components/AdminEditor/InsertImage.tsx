import { storage } from "@/lib/firebase";
import { Button } from "@nextui-org/button";
import { Tabs, Tab } from "@nextui-org/tabs";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { Key, useRef, useState } from "react";
import { Progress } from "@nextui-org/progress";

interface InsertImageProps {
  handleImageUrl: (url: string) => void;
}

export default function InsertImage(props: InsertImageProps) {
  const [selected, setSelected] = useState("login");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [isPending, setIsPending] = useState(false);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    const files = e.dataTransfer.files;

    if (!files.length) return;

    const file = files[0];
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    setFile(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Create blob url
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    setFile(file);

    e.target.value = "";
  };

  function handleUpload(file: File) {
    console.log("file - ", file);
    const storageRef = ref(storage, `images/${file.name}`);

    const uploadTask = uploadBytesResumable(storageRef, file);
    setIsPending(true);

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

        setIsPending(false);
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          setIsPending(false);
          props.handleImageUrl(downloadURL);
        });
      }
    );
  }

  return (
    <div>
      <Tabs
        fullWidth
        size="md"
        aria-label="Tabs form"
        selectedKey={selected}
        onSelectionChange={(str: Key) => setSelected(str as string)}
      >
        <Tab key="login" title="Login">
          <form className="flex flex-col gap-4">
            <div
              onDrop={handleDrop}
              className="relative flex items-center justify-center border border-dashed"
            >
              <input
                className="w-full absolute top-0 left-0 h-full opacity-0"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              <div className="text-center py-4 px-2">
                <p>
                  <strong className="font-bold">Drop Image</strong>
                </p>
                <p>or click</p>
              </div>
            </div>
            <div ref={previewRef}>
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="preview"
                  style={{ maxWidth: "100%", maxHeight: "100%" }}
                />
              )}
            </div>
          </form>
        </Tab>
        <Tab key="sign-up" title="Sign up">
          <form className="flex flex-col gap-4 h-[300px]">
            <input
              className="border text-[16px] flex-1 flex-shrink py-2 px-2 bg-lightPrimary focus:outline-appBlack focus:outline-offset-[-2]"
              placeholder="Insert Image URL"
              type="text"
              style={{
                fontVariationSettings: '"wght" 400,"opsz" 10',
                borderInlineEnd: 0,
              }}
            />
          </form>
        </Tab>
      </Tabs>
      <div className="flex gap-2 justify-end">
        {!isPending ? (
          <Button
            className="h-9 px-5 rounded bg-appBlue text-primary text-xs uppercase font-featureRegular"
            variant="flat"
            fullWidth
            color="primary"
            isDisabled={!file}
            isLoading={isPending}
            onClick={() => file && handleUpload(file)}
          >
            Upload
          </Button>
        ) : (
          <Progress
            aria-label="Downloading..."
            size="md"
            value={progress}
            classNames={{
              indicator: "bg-appBlue",
            }}
          />
        )}
      </div>
    </div>
  );
}
