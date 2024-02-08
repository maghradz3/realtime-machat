import { Modal, Upload } from "antd";
import React from "react";

const ImageSelector = ({
  showImageSelection,
  setShowImageSelection,
  selectedImageFile,
  setSelectedImageFile,
  onSend,
  loading = false,
}: {
  showImageSelection: boolean;
  setShowImageSelection: React.Dispatch<React.SetStateAction<boolean>>;
  selectedImageFile: File | null;
  setSelectedImageFile: React.Dispatch<React.SetStateAction<File | null>>;
  onSend: () => void;
  loading: boolean;
}) => {
  return (
    <Modal
      open={showImageSelection}
      onCancel={() => setShowImageSelection(false)}
      title={
        <span className="text-xl font-semibold tex-center">
          Select An Image
        </span>
      }
      centered
      okText="Send"
      okButtonProps={{ disabled: !selectedImageFile, loading }}
      onOk={onSend}
    >
      <Upload
        listType="picture-card"
        beforeUpload={(file) => {
          setSelectedImageFile(file);
          return false;
        }}
      >
        <span className="p-5"> click here to select an image</span>
      </Upload>
    </Modal>
  );
};

export default ImageSelector;
