import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/components/ui/dialog"
import { Button } from "./ui/button"
import { Download, Paperclip } from "lucide-react"
import { StockEntryAttachment } from "../types/stock-entry-attachment"
import { useEffect, useState } from "react"
import { getFileUrlStockEntryAttachment } from "../services/stock-entry-attachment"

export const FilePreviewModal: React.FC<{ isOpen: boolean, onClose: () => void, file: StockEntryAttachment | null }> = ({ isOpen, onClose, file }) => {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const fetchFileUrl = async () => {
      if (!file || !file.id) return

      try {
        setIsLoading(true);

        const response = await getFileUrlStockEntryAttachment({ id: file.id });
       
        setFileUrl(response.fileUrl) 
      } catch (err) {
        console.error(err)
        setFileUrl(null)
      } finally {
        setIsLoading(false)
      }
    }

    if (file?.id){
      fetchFileUrl()
    } 
    else if (file?.file) {
      const base64Url = `data:application/octet-stream;base64,${
        file.file instanceof Uint8Array
          ? btoa(String.fromCharCode(...file.file))
          : file.file
      }`
      setFileUrl(base64Url)
    } else {
      setFileUrl(file?.filePath ?? null)
    }
  }, [file])
  
  if (!file) return null

  const isImage = file.fileExtension.startsWith("image/");
  
  const handleDownload = () => {
    if (!file || !fileUrl) return;

    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = file.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const fileSizeMB = file.fileSize ? (file.fileSize / 1024 / 1024).toFixed(2) : undefined;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bebas text-gray-900">Preview do Arquivo</p>
              <DialogTitle className="font-bebas text-gray-900"></DialogTitle>
              <p className="font-nunito text-gray-600">{file.fileName}</p>
              {fileSizeMB && <p className="font-nunito text-sm text-gray-500">{fileSizeMB} MB</p>}
            </div>
            <Button onClick={handleDownload} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download
            </Button>
          </div>
        </DialogHeader>
        <div className="flex justify-center items-center min-h-[400px] bg-gray-50 rounded-lg">
          {isImage ? (
            <img src={fileUrl ?? ""} alt={file.fileName} className="max-w-full max-h-[500px] object-contain rounded" />
          ) : (
            <div className="text-center">
              <Paperclip className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="font-nunito text-gray-600">Preview não disponível para este tipo de arquivo</p>
              <p className="font-nunito text-sm text-gray-500">{file.fileName}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}