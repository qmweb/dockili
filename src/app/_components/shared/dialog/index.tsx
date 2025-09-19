'use client';

import { Modal, ModalProps } from 'antd';
import clsx from 'clsx';
import { useState } from 'react';
import styles from './dialog.module.scss';

interface DialogProps extends Omit<ModalProps, 'open' | 'onOk' | 'footer'> {
  children: React.ReactNode;
  trigger: React.ReactNode;
  footer: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary';
  className?: string;
}

const Dialog = ({
  children,
  trigger,
  footer,
  variant = 'default',
  className,
  ...props
}: DialogProps) => {
  const dialogClassName = clsx(
    styles.dialog,
    styles[`dialog--${variant}`],
    className,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div onClick={showModal} className={styles.trigger}>
        {trigger}
      </div>
      <Modal
        className={dialogClassName}
        open={isModalOpen}
        onOk={handleOk}
        footer={
          <div onClick={handleOk} className={styles.footer}>
            {footer}
          </div>
        }
        {...props}
      >
        {children}
      </Modal>
    </>
  );
};

export default Dialog;
