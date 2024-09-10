import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";
import { Button } from "@nextui-org/button";
import Image from "next/image";
import { AiOutlineFullscreenExit } from "react-icons/ai";
import { LuMinusCircle, LuPlusCircle } from "react-icons/lu";
import { BiReset } from "react-icons/bi";
import { useBlogImage } from "@/context/BlogImageContext";
import { useEffect } from "react";
import { MdZoomIn, MdZoomOut } from "react-icons/md";

export default function ImageScale() {
  const { isOpen, imageData, onClose } = useBlogImage();

  let zoomLevel = 1.0; // Initial zoom level

  const handleZoomIn = (zoomIn: any) => {
    zoomIn();
  };

  const handleZoomOut = (zoomOut: any) => {
    zoomOut();
  };

  const handleReset = (resetTransform: any) => {
    resetTransform();
  };

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleMouseDown(e: any) {
      if (e.target.classList.contains("react-transform-wrapper")) {
        onClose();
      }
    }

    window.addEventListener("mousedown", handleMouseDown);

    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
    };
  }, [isOpen, onClose]);

  return (
    <Modal
      isOpen={isOpen}
      classNames={{
        wrapper: "bg-transparent !z-[9999]",
        base: "!w-screen !max-w-[unset] !h-screen !max-h-[unset] !mx-0 !bg-transparent",
        backdrop: "!z-[999]",
      }}
      isDismissable={false}
      onClose={onClose}
      hideCloseButton={true}
    >
      <ModalContent className="h-auto max-h-[90vh] overflow-auto jodit-table bg-primary no-preflight">
        <ModalBody className="!block !px-0 !py-0 relative">
          <TransformWrapper
            initialScale={zoomLevel}
            centerOnInit={true}
            minScale={0.5} // Set the minimum zoom scale
            maxScale={3} // Set the maximum zoom scale
          >
            {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
              <>
                {/* <div
                  onClick={() => onClose()}
                  className="top-3 right-3 absolute transform text-white text-2xl bg-black rounded-full p-1 cursor-pointer z-10"
                >
                  <AiOutlineFullscreenExit />
                </div> */}
                <div className="flex gap-4 text-2xl absolute z-20 bottom-5 left-1/2 transform -translate-x-1/2 h-auto">
                  <Button
                    className="text-sm bg-appBlack text-white !min-w-[unset]"
                    onClick={() => handleZoomIn(zoomIn)}
                  >
                    <MdZoomIn className="cursor-pointer text-4xl" />
                  </Button>
                  <Button
                    className="text-sm bg-appBlack text-white !min-w-[unset]"
                    onClick={() => handleZoomOut(zoomOut)}
                  >
                    <MdZoomOut className="cursor-pointer text-4xl" />
                  </Button>
                  {/* <Button
                    className="text-sm bg-appBlack text-white"
                    onClick={() => handleReset(resetTransform)}
                  >
                    <BiReset className="cursor-pointer text-lg" />
                    <span>Reset</span>
                  </Button> */}
                </div>
                <TransformComponent>
                  {imageData && (
                    <Image
                      src={imageData.url}
                      alt="Zoomable content"
                      style={{
                        width: "100%",
                        maxHeight: "600px",
                        objectFit: "contain",
                      }}
                      width={2000}
                      height={1000}
                      placeholder={imageData.blurData ? "blur" : "empty"}
                      blurDataURL={imageData.blurData}
                    />
                  )}
                </TransformComponent>
              </>
            )}
          </TransformWrapper>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
