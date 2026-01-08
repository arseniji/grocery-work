import { createRoot } from "react-dom/client";
import { useEffect } from "react";
import {
  ErrorProgressBar,
  ErrorTitleWrapper,
  MsgTitleWrapper,
  ProgressBar,
  ToastContainer,
  ToastMessage,
  ToastTitle,
} from "./styled";

interface ToastOptions {
  zIndex?: number;
  verticalPos?: "top" | "bottom" | "center";
  horizontalPos?: "left" | "right" | "center";
  position?: {
    left?: string;
    right?: string;
    top?: string;
    bottom?: string;
  };
  timeout?: number;
}

interface ProviderProps {
  options?: ToastOptions;
}

function getPositionStyle(opts?: ToastOptions): Record<string, string> {
  if (!opts) return { top: "10px", left: "50%", transform: "translateX(-50%)" };

  if (opts.position) {
    return opts.position as Record<string, string>;
  }

  const vertical = opts.verticalPos || "top";
  const horizontal = opts.horizontalPos || "center";

  const style: Record<string, string> = {};

  if (vertical === "top") style.top = "10px";
  else if (vertical === "bottom") style.bottom = "10px";
  else if (vertical === "center") {
    style.top = "50%";
    style.transform = "translateY(-50%)";
  }

  if (horizontal === "left") style.left = "10px";
  else if (horizontal === "right") style.right = "10px";
  else if (horizontal === "center") {
    style.left = "50%";
    if (style.transform) style.transform += " translateX(-50%)";
    else style.transform = "translateX(-50%)";
  }

  return style;
}

export const ToastProvider = ({ options }: ProviderProps) => {
  useEffect(() => {
    Toast.options = options || {};
  }, [options]);

  return (
    <div
      id="toast-provider"
      style={{
        position: "absolute",
        zIndex: options?.zIndex || 100,
      }}
    />
  );
};

type ToastType = "error" | "msg";

interface ShowOptions {
  title?: string;
  msg?: string;
  type: ToastType;
}

export class Toast {
  static options: ToastOptions;

  static show(options: ShowOptions) {
    const provider = document.querySelector("#toast-provider");

    if (!provider) {
      throw Error("Провайдер сообщений не установлен");
    }

    const posOptions = Toast.options;
    const positionStyle = getPositionStyle(posOptions);

    const toastContainer = document.createElement("div");
    Object.assign(toastContainer.style, {
      position: "fixed",
      zIndex: (posOptions?.zIndex || 1000).toString(),
      ...positionStyle,
    });
    provider.appendChild(toastContainer);
    const root = createRoot(toastContainer);

    const duration = posOptions?.timeout || 3000;

    switch (options.type) {
      case "error":
        root.render(
          <ErrorToast
            title={options.title}
            msg={options.msg}
            duration={duration}
          />
        );
        break;
      case "msg":
      default:
        root.render(
          <MsgToast
            title={options.title}
            msg={options.msg}
            duration={duration}
          />
        );
    }

    setTimeout(() => {
      root.unmount();
      toastContainer.remove();
    }, posOptions?.timeout || 3000);
  }
}

const MsgToast = ({
  title,
  msg,
  duration,
}: {
  title?: string;
  msg?: string;
  duration: number;
}) => {
  return (
    <ToastContainer>
      {title && (
        <MsgTitleWrapper>
          <ToastTitle>{title}</ToastTitle>
        </MsgTitleWrapper>
      )}
      {msg && <ToastMessage>{msg}</ToastMessage>}
      <ProgressBar duration={duration} />
    </ToastContainer>
  );
};

const ErrorToast = ({
  title,
  msg,
  duration,
}: {
  title?: string;
  msg?: string;
  duration: number;
}) => {
  return (
    <ToastContainer>
      {title && (
        <ErrorTitleWrapper>
          <ToastTitle>{title}</ToastTitle>
        </ErrorTitleWrapper>
      )}
      {msg && <ToastMessage>{msg}</ToastMessage>}
      <ErrorProgressBar duration={duration} />
    </ToastContainer>
  );
};
