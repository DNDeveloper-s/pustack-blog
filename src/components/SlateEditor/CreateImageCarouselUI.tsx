"use client";

import { handleUpload, handleUploadAsync } from "@/lib/firebase/upload";
import { Button } from "@nextui-org/button";
import { Image, Upload, UploadFile, UploadProps } from "antd";
import { useEffect, useMemo, useState } from "react";
import { BsPlusCircle } from "react-icons/bs";
import { IoCloudDone } from "react-icons/io5";
import { Transforms } from "slate";
import { ReactEditor, useSlate } from "slate-react";

const getBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

interface CreateImageCarouselUIProps {
  element: any;
  attributes: any;
  setPreviewMode: any;
}
export default function CreateImageCarouselUI({
  element,
  attributes,
  setPreviewMode,
}: CreateImageCarouselUIProps) {
  const editor = useSlate();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [isPending, setIsPending] = useState(false);
  // return ();

  useEffect(() => {
    if (element) {
      const images = element.images.map((image: any) => ({
        url: image.src,
        name: image.caption,
        status: "done",
        isUploaded: true,
      }));
      setFileList(images);
    }
  }, [element]);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as File);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) =>
    setFileList(newFileList);

  const uploadButton = (
    <button
      className="flex items-center flex-col justify-center"
      style={{ border: 0, background: "none" }}
      type="button"
    >
      <BsPlusCircle className="text-lg text-black text-opacity-80" />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  const handleSubmit = async () => {
    setIsPending(true);
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];

      // @ts-ignore
      if (file.status === "done" || file.isUploaded) continue;

      file.status = "uploading";
      // @ts-ignore
      file.isUploaded = false;
      setFileList([...fileList]);

      const url = await handleUploadAsync(file.originFileObj as File, {
        setProgress: (value: number) => {
          file.percent = parseInt(value.toString());
          setFileList([...fileList]);
        },
      });

      file.url = url;
      file.status = "done";
      // @ts-ignore
      file.isUploaded = true;
      setFileList([...fileList]);
    }
    setIsPending(false);
  };

  const isAllUploaded = useMemo(() => {
    // @ts-ignore
    return fileList.every((file) => file.isUploaded);
  }, [fileList]);

  const handlePreviewCarousel = () => {
    const images = fileList.map((file) => ({
      src: file.url as string,
      caption: file.name,
    }));

    const path = ReactEditor.findPath(editor, element);

    Transforms.setNodes(
      editor,
      {
        type: "image-carousel",
        images,
        children: [],
      },
      {
        at: path,
      }
    );

    setPreviewMode(true);
  };

  return (
    <div {...attributes} className="w-full h-auto border-2 border-dashed p-4">
      <Upload
        action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        className="my-classname"
        rootClassName="root-classname"
        itemRender={(
          originNode,
          file,
          fileList,
          { download, preview, remove }
        ) => {
          // @ts-ignore
          console.log("file.isUploaded - ", file.isUploaded);
          return (
            <div className={"relative w-full h-full "}>
              {originNode}
              {/* @ts-ignore */}
              {file.isUploaded && (
                <div className="rounded-[8px] absolute top-0 left-0 w-full h-full bg-green-600 bg-opacity-35 flex items-center justify-center text-4xl text-white">
                  <IoCloudDone />
                </div>
              )}
            </div>
          );
        }}
      >
        {fileList.length >= 20 ? null : uploadButton}
      </Upload>
      {previewImage && (
        <Image
          wrapperStyle={{ display: "none" }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(""),
          }}
          src={previewImage}
        />
      )}
      <div className="flex justify-end mt-5">
        <Button
          variant="flat"
          className="py-2 px-6 rounded-lg bg-appBlue text-gray-100"
          onClick={isAllUploaded ? handlePreviewCarousel : handleSubmit}
          isLoading={isPending}
          isDisabled={isPending}
        >
          {isAllUploaded ? "Preview" : "Start Upload"}
        </Button>
      </div>
    </div>
  );
}
