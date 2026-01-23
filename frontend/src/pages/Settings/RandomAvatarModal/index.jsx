import { useState, useRef, useEffect } from "react";
import { useNotifications } from "@context/NotificationsContext";
import { ModalForm } from "@components/ModalForm";
import { Button } from "@components/Button";
import { MdShuffle } from "react-icons/md";
import { generateRandomAvatar } from "@api/avatar.random";
import { Spinner } from "@components/Spinner";
import "./RandomAvatarModal.scss";

export function RandomAvatarModal({ isOpen, onClose, onSave }) {
  const [avatarUrl, setAvatarUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const imgRef = useRef(null);
  const { notify } = useNotifications();

  useEffect(() => {
    if (isOpen) {
      setAvatarUrl("");
      setImgLoaded(false);
      setLoading(true);
      generateRandomAvatar()
        .then((url) => setAvatarUrl(url))
        .catch((err) => {
          notify({
            message: err.message || "Failed to generate avatar",
            type: "error",
          });
        })
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  const handleGenerate = async () => {
    setLoading(true);
    setImgLoaded(false);
    try {
      const url = await generateRandomAvatar();
      setAvatarUrl(url);
    } catch (err) {
      notify({
        message: err.message || "Failed to generate avatar",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (avatarUrl) onSave(avatarUrl);
  };

  return (
    <ModalForm
      isOpen={isOpen}
      onClose={onClose}
      onCancel={onClose}
      onSave={handleSave}
      saveLabel="Set as profile"
      cancelLabel="Cancel"
      title="Random Avatar"
      titleIcon={<MdShuffle />}
      isSaveDisabled={!avatarUrl}
    >
      <div className="random-avatar-modal">
        <div className="random-avatar-modal-preview avatar-preview avatar-preview-large">
          {loading ? (
            <Spinner size={48} />
          ) : avatarUrl ? (
            <img
              ref={imgRef}
              src={avatarUrl}
              alt="Random avatar"
              className="random-avatar-modal-img"
              style={{ display: imgLoaded ? "block" : "none" }}
              onLoad={() => setImgLoaded(true)}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "";
                setImgLoaded(true);
              }}
            />
          ) : (
            <div className="avatar-placeholder avatar-placeholder-large random-avatar-modal-placeholder" />
          )}
          {/* Placeholder spinner while image loads */}
          {avatarUrl && !loading && !imgLoaded && (
            <div className="random-avatar-modal-spinner">
              <Spinner size={48} />
            </div>
          )}
        </div>
        <div style={{ marginTop: 16 }}>
          <Button
            size="sm"
            variant="primary"
            icon={<MdShuffle />}
            onClick={handleGenerate}
            disabled={loading}
          >
            Generate
          </Button>
        </div>
        {/* error notification is now global */}
      </div>
    </ModalForm>
  );
}
