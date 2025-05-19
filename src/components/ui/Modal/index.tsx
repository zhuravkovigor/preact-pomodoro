import { createPortal, FC, ReactNode } from "preact/compat";
import { useEffect, useState } from "preact/hooks";
import styles from "./Modal.module.css";
import CloseIcon from "../../icons/CloseIcon";
import { returnColorBasedOnMode } from "../../../lib/utils";
import core from "../../../store/core";
import { classNames } from "../../../lib/helpers";

type ModalProps = {
  children: ReactNode;
  title?: string;
  isOpen: boolean;
  onClose?: () => void;
};

const Modal: FC<ModalProps> = ({ children, title, isOpen, onClose }) => {
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  const color = returnColorBasedOnMode(core.value.mode);
  const componentClassNames = classNames(styles.component, styles[color]);
  const overlayClassNames = classNames(
    styles.overlay,
    isOpen && styles.open,
    visible && styles.visible, // CSS-класс для анимации
  );

  // Устанавливаем ссылку на body после монтирования
  useEffect(() => {
    setPortalTarget(document.body);
  }, []);

  // Обновляем флаг для анимации входа
  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => {
        setVisible(true);
      });
    } else {
      setVisible(false);
    }
  }, [isOpen]);

  if (!portalTarget) return null;

  return createPortal(
    <div class={overlayClassNames} onClick={onClose}>
      <div
        class={componentClassNames}
        onClick={(event) => event.stopPropagation()}
      >
        <div class={styles.header}>
          {title && <h2 class={styles.title}>{title}</h2>}
          <div onClick={onClose} class={styles.close}>
            <CloseIcon />
          </div>
        </div>
        <div>{children}</div>
      </div>
    </div>,
    portalTarget,
  );
};

export default Modal;
