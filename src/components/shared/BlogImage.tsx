import { useBlogImage } from "@/context/BlogImageContext";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/modal";
import Zoom, { Controlled } from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import AppImage from "./AppImage";
import { useState } from "react";
import e from "cors";

export function ImageModalPreview() {
  // const { state, closePreview } = useBlogImage();
  // console.log("previewUrl - ", state.previewUrl);
  // return (
  //   <Modal
  //     isOpen={!!state.previewUrl}
  //     onClose={closePreview}
  //     classNames={{
  //       wrapper: "bg-black bg-opacity-50",
  //       base: "!max-w-[90vw] !w-[90vw] h-[90vh] p-0 bg-transparent",
  //       closeButton: "text-black p-2 bg-gray-300",
  //     }}
  //   >
  //     <ModalContent className="max-h-[90vh]">
  //       <ModalBody className="p-0 flex items-center justify-center h-full">
  //         <div className="w-full h-full flex items-center justify-center">
  //           {state.previewUrl && (
  //             <Zoom>
  //               <img
  //                 className="max-w-full max-h-full w-auto h-auto object-contain"
  //                 src={state.previewUrl}
  //                 alt="Image Preview"
  //               />
  //             </Zoom>
  //           )}
  //         </div>
  //       </ModalBody>
  //     </ModalContent>
  //   </Modal>
  // );
}

interface BlogImageProps extends React.HTMLAttributes<HTMLElement> {
  src: string;
  imageProps?: React.ImgHTMLAttributes<HTMLImageElement>;
  noZoom?: boolean;
}
/**
 * @description Providing onClick in props will remove the functionality of the image preview
 * @param src Image source
 * @returns {JSX.Element}
 */
export default function BlogImage({
  src,
  style,
  imageProps = {},
  noZoom,
  ...props
}: BlogImageProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const { openWithUrl } = useBlogImage();
  const imageContent = (
    <AppImage
      src={src}
      alt="Image Preview"
      width={600}
      height={400}
      {...imageProps}
      className={
        "max-w-full max-h-full w-full h-full object-cover " +
        (imageProps.className ?? "")
      }
      onClick={(e: any) => {
        // @ts-ignore
        !noZoom && openWithUrl({ url: src, blurData: imageProps.blurDataURL });
      }}
    />
  );

  return (
    <figure
      //   className="mt-2"
      style={{
        aspectRatio: 1.77,
        overflow: "hidden",
        cursor: "pointer",
        position: "relative",
        ...(style ?? {}),
      }}
      {...props}
    >
      {/* {noZoom ? (
        imageContent
      ) : (
        <Controlled
          zoomImg={{
            width: 1920,
            height: 1080,
          }}
          isZoomed={isZoomed}
          onZoomChange={setIsZoomed}
        >
          {imageContent}
        </Controlled>
      )} */}
      {imageContent}
    </figure>
  );
  // return (
  //   <figure
  //     //   className="mt-2"
  //     style={{
  //       aspectRatio: 1.33,
  //       overflow: "hidden",
  //       cursor: "pointer",
  //       ...(style ?? {}),
  //     }}
  //     {...props}
  //   >
  //     <img
  //       onClick={(e: any) => {
  //         e.stopPropagation();
  //         e.preventDefault();
  //         openPreview(src);
  //         console.log("src - ", src);
  //       }}
  //       className="w-full h-full object-cover"
  //       src={src}
  //       alt="Image One"
  //       {...imageProps}
  //     />
  //   </figure>
  // );
}

export function BlogImageDefault({
  src,
  style,
  imageProps = {},
  ...props
}: BlogImageProps) {
  const { openWithUrl } = useBlogImage();
  const imageContent = (
    <AppImage
      src={src}
      alt="Image Preview"
      width={600}
      height={400}
      {...imageProps}
      className={
        "max-w-full max-h-full w-full h-full object-cover " +
        (imageProps.className ?? "")
      }
      onClick={(e: any) => {
        // @ts-ignore
        openWithUrl({ url: src, blurData: imageProps.blurDataURL });
      }}
    />
  );

  return (
    <figure
      //   className="mt-2"
      style={{
        cursor: "pointer",
        ...(style ?? {}),
      }}
      {...props}
    >
      {/* <Zoom>
        <img
          onClick={(e: any) => {
            e.stopPropagation();
            e.preventDefault();
            // openPreview(src);
            // console.log("src - ", src);
          }}
          className="w-full h-full object-cover"
          src={src}
          alt="Image Preview"
          {...imageProps}
        />
      </Zoom> */}
      {imageContent}
    </figure>
  );

  // return (
  //   <figure
  //     //   className="mt-2"
  //     style={{
  //       cursor: "pointer",
  //       ...(style ?? {}),
  //     }}
  //     {...props}
  //   >
  //     <img
  //       onClick={(e: any) => {
  //         e.stopPropagation();
  //         e.preventDefault();
  //         openPreview(src);
  //         console.log("src - ", src);
  //       }}
  //       className="w-full h-full object-cover"
  //       src={src}
  //       alt="Image One"
  //       {...imageProps}
  //     />
  //   </figure>
  // );
}
